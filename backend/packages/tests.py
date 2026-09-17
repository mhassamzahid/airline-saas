import io

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from . import models
from .importer import ARCHETYPE_SPECS, CsvStructureError, build_diff, commit_rows, read_csv_rows

User = get_user_model()


def csv_bytes(header, *rows):
    lines = [",".join(header)]
    for row in rows:
        lines.append(",".join(row))
    return io.BytesIO(("\r\n".join(lines) + "\r\n").encode("utf-8"))


class TourImporterTests(TestCase):
    """Covers the generic engine (create/update/FK/choice/boolean/duplicate)
    using the simplest archetype -- Tours has exactly one FK and one boolean."""

    def setUp(self):
        self.spec = ARCHETYPE_SPECS["tours"]
        self.turkey = models.TourCountry.objects.create(slug="turkey", name="Turkey")
        self.existing = models.TourPackage.objects.create(
            slug="istanbul-week", name="Istanbul Week", country=self.turkey,
            strap="Old strap", blurb="Old blurb", image_url="https://example.com/old.jpg",
            duration_days=7, from_price_gbp="1000.00", season="Spring", featured=False,
        )

    def test_create_new_row(self):
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            ("dubai-week", "Dubai Week", "turkey", "A new one", "Blurb", "https://example.com/new.jpg",
             "5", "800.00", "Summer", "true"),
        ))
        preview = build_diff(self.spec, rows)
        self.assertEqual(len(preview.rows), 1)
        result = preview.rows[0]
        self.assertTrue(result.ok)
        self.assertEqual(result.action, "create")
        self.assertEqual(result.changed_fields["name"], (None, "Dubai Week"))

        commit_rows(self.spec, preview)
        created = models.TourPackage.objects.get(slug="dubai-week")
        self.assertEqual(created.name, "Dubai Week")
        self.assertTrue(created.featured)
        self.assertEqual(str(created.from_price_gbp), "800.00")

    def test_update_only_reports_changed_fields(self):
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            ("istanbul-week", "Istanbul Week", "turkey", "Old strap", "Old blurb",
             "https://example.com/old.jpg", "7", "1250.00", "Spring", "false"),
        ))
        preview = build_diff(self.spec, rows)
        result = preview.rows[0]
        self.assertEqual(result.action, "update")
        self.assertEqual(set(result.changed_fields), {"from_price_gbp"})
        self.assertEqual(result.changed_fields["from_price_gbp"], ("1000.00", "1250.00"))

        commit_rows(self.spec, preview)
        self.existing.refresh_from_db()
        self.assertEqual(str(self.existing.from_price_gbp), "1250.00")
        self.assertEqual(self.existing.strap, "Old strap")

    def test_missing_foreign_key_is_a_row_error(self):
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            ("dubai-week", "Dubai Week", "nowhere", "Strap", "Blurb", "https://example.com/x.jpg",
             "5", "800.00", "Summer", "true"),
        ))
        preview = build_diff(self.spec, rows)
        result = preview.rows[0]
        self.assertFalse(result.ok)
        self.assertIn("No TourCountry with slug 'nowhere'", result.errors[0])
        self.assertFalse(models.TourPackage.objects.filter(slug="dubai-week").exists())

    def test_invalid_choice_lists_valid_options(self):
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            ("dubai-week", "Dubai Week", "turkey", "Strap", "Blurb", "https://example.com/x.jpg",
             "5", "800.00", "Sometimes", "true"),
        ))
        preview = build_diff(self.spec, rows)
        result = preview.rows[0]
        self.assertFalse(result.ok)
        self.assertIn("Year-round", result.errors[0])

    def test_duplicate_slug_flags_every_occurrence(self):
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            ("dubai-week", "Dubai Week A", "turkey", "Strap", "Blurb", "https://example.com/a.jpg",
             "5", "800.00", "Summer", "true"),
            ("dubai-week", "Dubai Week B", "turkey", "Strap", "Blurb", "https://example.com/b.jpg",
             "6", "900.00", "Winter", "false"),
        ))
        preview = build_diff(self.spec, rows)
        self.assertEqual(len(preview.rows), 2)
        self.assertTrue(all(not r.ok for r in preview.rows))
        self.assertIn("Duplicate slug", preview.rows[0].errors[0])
        commit_rows(self.spec, preview)
        self.assertFalse(models.TourPackage.objects.filter(slug="dubai-week").exists())

    def test_boolean_variants(self):
        header = self.spec.csv_columns
        for raw, expected in [("true", True), ("YES", True), ("1", True), ("false", False), ("no", False), ("", False)]:
            rows = read_csv_rows(self.spec, csv_bytes(
                header,
                (f"bool-{raw or 'blank'}", "Name", "turkey", "Strap", "Blurb", "https://example.com/x.jpg",
                 "5", "800.00", "Summer", raw),
            ))
            preview = build_diff(self.spec, rows)
            self.assertTrue(preview.rows[0].ok, preview.rows[0].errors)
            commit_rows(self.spec, preview)
            pkg = models.TourPackage.objects.get(slug=f"bool-{raw or 'blank'}")
            self.assertEqual(pkg.featured, expected, f"raw={raw!r}")

    def test_boolean_bad_value_is_a_row_error(self):
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            ("dubai-week", "Dubai Week", "turkey", "Strap", "Blurb", "https://example.com/x.jpg",
             "5", "800.00", "Summer", "maybe"),
        ))
        preview = build_diff(self.spec, rows)
        self.assertFalse(preview.rows[0].ok)
        self.assertIn("true/false", preview.rows[0].errors[0])

    def test_missing_columns_raises_structure_error(self):
        bad = io.BytesIO(b"slug,name\nfoo,Foo\n")
        with self.assertRaises(CsvStructureError):
            read_csv_rows(self.spec, bad)

    def test_children_survive_an_update(self):
        models.TourInclusion.objects.create(package=self.existing, sort_order=0, text="Breakfast included")
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            ("istanbul-week", "Istanbul Week", "turkey", "Old strap", "Old blurb",
             "https://example.com/old.jpg", "7", "1250.00", "Spring", "false"),
        ))
        preview = build_diff(self.spec, rows)
        commit_rows(self.spec, preview)
        self.existing.refresh_from_db()
        self.assertEqual(list(self.existing.inclusions.values_list("text", flat=True)), ["Breakfast included"])

    def test_partial_commit_skips_only_the_bad_row(self):
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            ("dubai-week", "Dubai Week", "turkey", "Strap", "Blurb", "https://example.com/x.jpg",
             "5", "800.00", "Summer", "true"),
            ("bad-row", "Bad", "nowhere", "Strap", "Blurb", "https://example.com/x.jpg",
             "5", "800.00", "Summer", "true"),
        ))
        preview = build_diff(self.spec, rows)
        result = commit_rows(self.spec, preview)
        self.assertEqual(result["created"], ["dubai-week"])
        self.assertEqual(len(result["skipped"]), 1)
        self.assertTrue(models.TourPackage.objects.filter(slug="dubai-week").exists())
        self.assertFalse(models.TourPackage.objects.filter(slug="bad-row").exists())


class UmrahImporterTests(TestCase):
    def setUp(self):
        self.spec = ARCHETYPE_SPECS["umrah"]
        self.category = models.UmrahCategory.objects.create(
            slug="standard", name="Standard", strap="strap", description="desc",
        )
        self.makkah_hotel = models.UmrahHotel.objects.create(
            slug="makkah-hotel", name="Makkah Hotel", city="Makkah", distance_label="500m",
            distance_meters=500, star_rating=4, price_per_night_gbp="80.00",
            image_url="https://example.com/m.jpg",
        )
        self.madinah_hotel = models.UmrahHotel.objects.create(
            slug="madinah-hotel", name="Madinah Hotel", city="Madinah", distance_label="400m",
            distance_meters=400, star_rating=4, price_per_night_gbp="70.00",
            image_url="https://example.com/n.jpg",
        )
        self.room = models.UmrahRoomSharingOption.objects.create(slug="quad", label="Quad", note="", divisor=4)
        self.transport = models.UmrahTransportTier.objects.create(
            slug="shared", label="Shared", note="", price_gbp="35.00",
        )

    def _row(self, slug="test-package", makkah=None, madinah=None):
        return (
            slug, "Test Package", "Strap", "Blurb", "https://example.com/x.jpg", "standard", "10",
            makkah or self.makkah_hotel.slug, madinah or self.madinah_hotel.slug,
            "quad", "shared", "Summer", "1500.00", "true",
        )

    def test_makkah_hotel_must_be_in_makkah(self):
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            self._row(makkah=self.madinah_hotel.slug),
        ))
        preview = build_diff(self.spec, rows)
        result = preview.rows[0]
        self.assertFalse(result.ok)
        self.assertIn("not a Makkah hotel", result.errors[0])

    def test_madinah_hotel_must_be_in_madinah(self):
        rows = read_csv_rows(self.spec, csv_bytes(
            self.spec.csv_columns,
            self._row(madinah=self.makkah_hotel.slug),
        ))
        preview = build_diff(self.spec, rows)
        result = preview.rows[0]
        self.assertFalse(result.ok)
        self.assertIn("not a Madinah hotel", result.errors[0])

    def test_valid_row_creates_package(self):
        rows = read_csv_rows(self.spec, csv_bytes(self.spec.csv_columns, self._row()))
        preview = build_diff(self.spec, rows)
        self.assertTrue(preview.rows[0].ok, preview.rows[0].errors)
        commit_rows(self.spec, preview)
        pkg = models.UmrahPackage.objects.get(slug="test-package")
        self.assertEqual(pkg.makkah_hotel, self.makkah_hotel)
        self.assertEqual(pkg.madinah_hotel, self.madinah_hotel)
        self.assertTrue(pkg.popular)


@override_settings(STORAGES={
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    # The admin templates these views extend reference {% static %} assets;
    # ManifestStaticFilesStorage (base.py's setting, for production cache-
    # busting) requires a collectstatic manifest that doesn't exist in this
    # test run, so tests use the plain non-manifest backend instead.
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
})
class ImportViewTests(TestCase):
    def setUp(self):
        self.country = models.TourCountry.objects.create(slug="turkey", name="Turkey")
        self.staff = User.objects.create_user(username="staff", password="pw", is_staff=True)
        self.regular = User.objects.create_user(username="regular", password="pw", is_staff=False)

    def _csv_file(self, *rows):
        spec = ARCHETYPE_SPECS["tours"]
        content = csv_bytes(spec.csv_columns, *rows).getvalue()
        return SimpleUploadedFile("packages.csv", content, content_type="text/csv")

    def test_anonymous_is_redirected_to_login(self):
        response = self.client.get(reverse("packages_import_index"))
        self.assertEqual(response.status_code, 302)
        self.assertIn("/django-admin/login/", response.url)

    def test_non_staff_is_redirected_to_login(self):
        self.client.login(username="regular", password="pw")
        response = self.client.get(reverse("packages_import_index"))
        self.assertEqual(response.status_code, 302)

    def test_full_upload_preview_confirm_round_trip(self):
        self.client.login(username="staff", password="pw")

        upload_url = reverse("packages_import_upload", args=["tours"])
        response = self.client.post(upload_url, {"csv_file": self._csv_file(
            ("dubai-week", "Dubai Week", "turkey", "Strap", "Blurb", "https://example.com/x.jpg",
             "5", "800.00", "Summer", "true"),
        )})
        self.assertEqual(response.status_code, 302)
        batch = models.PackageImportBatch.objects.get()
        self.assertEqual(batch.status, "pending")
        self.assertEqual(batch.uploaded_by, self.staff)

        preview_response = self.client.get(response.url)
        self.assertEqual(preview_response.status_code, 200)
        self.assertContains(preview_response, "dubai-week")
        self.assertContains(preview_response, "create")

        confirm_response = self.client.post(reverse("packages_import_confirm", args=[batch.id]))
        self.assertEqual(confirm_response.status_code, 302)
        batch.refresh_from_db()
        self.assertEqual(batch.status, "committed")
        self.assertEqual(batch.result_summary["created"], ["dubai-week"])
        self.assertTrue(models.TourPackage.objects.filter(slug="dubai-week").exists())

    def test_upload_with_missing_columns_shows_error_without_creating_batch(self):
        self.client.login(username="staff", password="pw")
        bad_file = SimpleUploadedFile("bad.csv", b"slug,name\nfoo,Foo\n", content_type="text/csv")
        response = self.client.post(reverse("packages_import_upload", args=["tours"]), {"csv_file": bad_file})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Missing column")
        self.assertFalse(models.PackageImportBatch.objects.exists())

    def test_template_download_returns_header_only(self):
        self.client.login(username="staff", password="pw")
        response = self.client.get(reverse("packages_import_template", args=["tours"]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode().strip(), ",".join(ARCHETYPE_SPECS["tours"].csv_columns))

    def test_current_download_includes_existing_package(self):
        models.TourPackage.objects.create(
            slug="istanbul-week", name="Istanbul Week", country=self.country,
            strap="Strap", blurb="Blurb", image_url="https://example.com/x.jpg",
            duration_days=7, from_price_gbp="1000.00", season="Spring", featured=True,
        )
        self.client.login(username="staff", password="pw")
        response = self.client.get(reverse("packages_import_current", args=["tours"]))
        self.assertContains(response, "istanbul-week")
        self.assertContains(response, "1000.00")
