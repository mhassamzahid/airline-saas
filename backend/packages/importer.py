"""
CSV bulk-import engine for package content (Hajj/Umrah/Tours/Pakistan Tours).

Scope is deliberately narrow: only the *flat* fields on each package model
(name, price, duration, season, quota/deadline, popular/featured, strap/
blurb, image URL, and FK references expressed by slug). Nested child rows
(itinerary, gallery, inclusions/exclusions, hotel stays, group types) are not
covered here -- they stay editable only via the existing django-admin
inlines, and `commit_rows()` never touches them.

One `ArchetypeSpec` per package type drives a single generic pipeline
(`parse_csv` -> `build_diff` -> `commit_rows`) rather than four bespoke
implementations. Field lists mirror `management/commands/seed_packages.py`,
which is the existing source of truth for "what are the flat fields" -- but
unlike that command, `commit_rows()` is an upsert-by-slug that leaves a
package's existing child rows untouched, never a wipe-and-rebuild.
"""

import csv
import io
from dataclasses import dataclass, field

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction

from . import models

_TRUE_VALUES = {"true", "1", "yes", "y"}
_FALSE_VALUES = {"false", "0", "no", "n"}


class CsvStructureError(Exception):
    """Raised when the uploaded file itself can't be read as this archetype's CSV."""


@dataclass(frozen=True)
class ForeignKeyField:
    csv_column: str
    model_field: str
    related_model: type
    lookup_field: str = "slug"


@dataclass(frozen=True)
class ArchetypeSpec:
    key: str
    label: str
    model: type
    csv_columns: tuple
    plain_field_names: tuple = ()
    choice_field_names: tuple = ()
    boolean_field_names: tuple = ()
    foreign_keys: tuple = ()


@dataclass
class RowResult:
    line_no: int
    slug: str
    action: str  # "create" | "update" | "error"
    changed_fields: dict
    errors: list
    instance: object = None  # unsaved-but-validated model instance, set only when ok

    @property
    def ok(self):
        return not self.errors


@dataclass
class ImportPreview:
    archetype: str
    rows: list = field(default_factory=list)

    @property
    def creates(self):
        return [r for r in self.rows if r.ok and r.action == "create"]

    @property
    def updates(self):
        return [r for r in self.rows if r.ok and r.action == "update"]

    @property
    def errored(self):
        return [r for r in self.rows if not r.ok]


def _display_value(instance, field_name):
    model_field = instance._meta.get_field(field_name)
    value = getattr(instance, field_name)
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else "false"
    if hasattr(model_field, "decimal_places") and model_field.decimal_places is not None:
        try:
            return format(value, f".{model_field.decimal_places}f")
        except (TypeError, ValueError):
            return str(value)
    return str(value)


def instance_to_row(instance, spec):
    """The CSV-row representation of a package's current flat-field state --
    shared by the diff (as the 'old' side), the 'download current' export,
    and (via an empty instance's slug-less header) the blank template."""
    row = {"slug": instance.slug if instance.pk else ""}
    for name in (*spec.plain_field_names, *spec.choice_field_names, *spec.boolean_field_names):
        row[name] = _display_value(instance, name)
    for fk in spec.foreign_keys:
        related = getattr(instance, fk.model_field, None)
        row[fk.csv_column] = getattr(related, fk.lookup_field) if related else ""
    return row


def normalize_choice(model, field_name, raw_value):
    """Case-insensitive match against a model field's own `choices`, so the
    valid-options list can never drift out of sync with models.py."""
    model_field = model._meta.get_field(field_name)
    choices = [c[0] for c in (model_field.choices or [])]
    raw = (raw_value or "").strip()
    if raw == "":
        if model_field.blank:
            return "", None
        return None, f"'{field_name}' is required. Expected one of: {', '.join(choices)}."
    for choice_value in choices:
        if choice_value.lower() == raw.lower():
            return choice_value, None
    return None, f"'{raw_value}' is not valid for '{field_name}'. Expected one of: {', '.join(choices)}."


def normalize_boolean(field_name, raw_value, default=False):
    raw = (raw_value or "").strip().lower()
    if raw == "":
        return default, None
    if raw in _TRUE_VALUES:
        return True, None
    if raw in _FALSE_VALUES:
        return False, None
    return None, f"'{raw_value}' is not a valid true/false value for '{field_name}'. Use true/false, yes/no, or 1/0."


def read_csv_rows(spec, file_obj):
    """Structural parse only: decodes the file and checks the header row has
    every expected column. Raises CsvStructureError on anything wrong with
    the file itself (encoding, missing columns) before any row is touched."""
    file_obj.seek(0)
    raw = file_obj.read()
    if isinstance(raw, bytes):
        try:
            text = raw.decode("utf-8-sig")
        except UnicodeDecodeError as exc:
            raise CsvStructureError(f"Could not read the file as UTF-8 text ({exc}).") from exc
    else:
        text = raw

    reader = csv.DictReader(io.StringIO(text))
    fieldnames = reader.fieldnames or []
    missing = [c for c in spec.csv_columns if c not in fieldnames]
    if missing:
        raise CsvStructureError(f"Missing column(s): {', '.join(missing)}.")
    return list(reader)


def build_diff(spec, rows):
    """Validates every row and produces the create/update/error diff the
    preview screen renders. Never writes to the database."""
    line_numbers_by_slug = {}
    for line_no, raw in enumerate(rows, start=2):  # header is line 1
        slug = (raw.get("slug") or "").strip()
        line_numbers_by_slug.setdefault(slug, []).append(line_no)

    results = []
    for line_no, raw in enumerate(rows, start=2):
        slug = (raw.get("slug") or "").strip()

        if not slug:
            results.append(RowResult(line_no, "", "error", {}, ["Missing 'slug'."]))
            continue

        errors = []
        other_lines = [n for n in line_numbers_by_slug[slug] if n != line_no]
        if other_lines:
            errors.append(
                f"Duplicate slug '{slug}' also appears on line(s) {', '.join(str(n) for n in other_lines)}."
            )

        existing = spec.model.objects.filter(slug=slug).first()
        action = "update" if existing else "create"
        instance = existing if existing else spec.model(slug=slug)
        old_row = instance_to_row(existing, spec) if existing else None

        for name in spec.plain_field_names:
            setattr(instance, name, (raw.get(name) or "").strip())

        for name in spec.choice_field_names:
            value, err = normalize_choice(spec.model, name, raw.get(name, ""))
            if err:
                errors.append(err)
            else:
                setattr(instance, name, value)

        for name in spec.boolean_field_names:
            value, err = normalize_boolean(name, raw.get(name, ""), default=False)
            if err:
                errors.append(err)
            else:
                setattr(instance, name, value)

        for fk in spec.foreign_keys:
            raw_value = (raw.get(fk.csv_column) or "").strip()
            if not raw_value:
                errors.append(f"'{fk.csv_column}' is required.")
                continue
            related = fk.related_model.objects.filter(**{fk.lookup_field: raw_value}).first()
            if related is None:
                errors.append(
                    f"No {fk.related_model.__name__} with {fk.lookup_field} '{raw_value}' ('{fk.csv_column}')."
                )
            else:
                setattr(instance, fk.model_field, related)

        if spec.key == "umrah" and not errors:
            if instance.makkah_hotel.city != "Makkah":
                errors.append(f"'makkah_hotel_slug' ({instance.makkah_hotel.slug}) is not a Makkah hotel.")
            if instance.madinah_hotel.city != "Madinah":
                errors.append(f"'madinah_hotel_slug' ({instance.madinah_hotel.slug}) is not a Madinah hotel.")

        if not errors:
            try:
                instance.full_clean()
            except DjangoValidationError as exc:
                for field_name, messages in exc.message_dict.items():
                    for message in messages:
                        errors.append(f"{field_name}: {message}")

        if errors:
            results.append(RowResult(line_no, slug, "error", {}, errors))
            continue

        new_row = instance_to_row(instance, spec)
        if action == "create":
            changed_fields = {col: (None, new_row[col]) for col in spec.csv_columns if col != "slug"}
        else:
            changed_fields = {
                col: (old_row[col], new_row[col])
                for col in spec.csv_columns
                if col != "slug" and old_row.get(col) != new_row[col]
            }
        results.append(RowResult(line_no, slug, action, changed_fields, [], instance=instance))

    return ImportPreview(archetype=spec.key, rows=results)


def commit_rows(spec, preview):
    """Upserts every valid row's flat fields. Never touches child
    tables (itinerary/gallery/inclusions/etc.) -- the opposite of
    seed_packages.py's wipe-and-rebuild pattern."""
    created, updated, skipped = [], [], []
    with transaction.atomic():
        for row in preview.rows:
            if not row.ok:
                skipped.append({"line_no": row.line_no, "slug": row.slug, "errors": row.errors})
                continue
            row.instance.save()
            (created if row.action == "create" else updated).append(row.slug)
    return {"created": created, "updated": updated, "skipped": skipped}


ARCHETYPE_SPECS = {
    "hajj": ArchetypeSpec(
        key="hajj",
        label="Hajj",
        model=models.HajjPackage,
        csv_columns=(
            "slug", "name", "package_type", "strap", "blurb", "image_url", "nights",
            "from_price_gbp", "quota_text", "application_deadline",
            "transport_text", "meals_text", "guide_text",
        ),
        plain_field_names=(
            "name", "strap", "blurb", "image_url", "nights", "from_price_gbp",
            "quota_text", "application_deadline", "transport_text", "meals_text", "guide_text",
        ),
        choice_field_names=("package_type",),
    ),
    "tours": ArchetypeSpec(
        key="tours",
        label="International Tours",
        model=models.TourPackage,
        csv_columns=(
            "slug", "name", "country_slug", "strap", "blurb", "image_url",
            "duration_days", "from_price_gbp", "season", "featured",
        ),
        plain_field_names=("name", "strap", "blurb", "image_url", "duration_days", "from_price_gbp"),
        choice_field_names=("season",),
        boolean_field_names=("featured",),
        foreign_keys=(
            ForeignKeyField(csv_column="country_slug", model_field="country", related_model=models.TourCountry),
        ),
    ),
    "pakistan-tours": ArchetypeSpec(
        key="pakistan-tours",
        label="Pakistan Tours",
        model=models.PakistanTourPackage,
        csv_columns=(
            "slug", "name", "region_slug", "strap", "blurb", "image_url",
            "duration_days", "from_price_gbp", "season", "featured", "card_tag",
        ),
        plain_field_names=("name", "strap", "blurb", "image_url", "duration_days", "from_price_gbp"),
        choice_field_names=("season", "card_tag"),
        boolean_field_names=("featured",),
        foreign_keys=(
            ForeignKeyField(csv_column="region_slug", model_field="region", related_model=models.PakistanRegion),
        ),
    ),
    "umrah": ArchetypeSpec(
        key="umrah",
        label="Umrah",
        model=models.UmrahPackage,
        csv_columns=(
            "slug", "name", "strap", "blurb", "image_url", "category_slug", "duration_days",
            "makkah_hotel_slug", "madinah_hotel_slug", "room_sharing_slug", "transport_tier_slug",
            "season", "from_price_gbp", "popular",
        ),
        plain_field_names=("name", "strap", "blurb", "image_url", "duration_days", "from_price_gbp"),
        choice_field_names=("season",),
        boolean_field_names=("popular",),
        foreign_keys=(
            ForeignKeyField(csv_column="category_slug", model_field="category", related_model=models.UmrahCategory),
            ForeignKeyField(csv_column="makkah_hotel_slug", model_field="makkah_hotel", related_model=models.UmrahHotel),
            ForeignKeyField(csv_column="madinah_hotel_slug", model_field="madinah_hotel", related_model=models.UmrahHotel),
            ForeignKeyField(
                csv_column="room_sharing_slug", model_field="room_sharing",
                related_model=models.UmrahRoomSharingOption,
            ),
            ForeignKeyField(
                csv_column="transport_tier_slug", model_field="transport_tier",
                related_model=models.UmrahTransportTier,
            ),
        ),
    ),
}
