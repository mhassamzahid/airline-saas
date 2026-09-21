"""
Dumps the CMS page tree (Home, service pages, Help, flexible pages) to a JSON
seed file, so the same content can be recreated on another database with
`seed_pages`. Page content is created by hand in the Wagtail admin, so this is
how it travels between environments (local -> production).

Images are deliberately not exported: uploaded files live on local disk, not in
the database, so an image reference would point at a file that doesn't exist on
the target. Foreign keys (e.g. hero_image) are skipped for the same reason.
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand
from wagtail.fields import StreamField
from wagtail.models import Page

DEFAULT_OUT = Path(__file__).resolve().parents[2] / "seed" / "pages.json"


class Command(BaseCommand):
    help = "Export the Wagtail page tree to a JSON seed file."

    def add_arguments(self, parser):
        parser.add_argument("--out", default=str(DEFAULT_OUT))

    def handle(self, *args, **options):
        tree_fields = {f.name for f in Page._meta.get_fields()}
        entries = []

        for page in Page.objects.filter(depth__gte=2).order_by("path"):
            specific = page.specific
            fields = {}
            for f in specific._meta.concrete_fields:
                if f.name in tree_fields or f.name == "page_ptr" or f.is_relation:
                    continue
                value = f.value_from_object(specific)
                if isinstance(f, StreamField):
                    value = f.get_prep_value(value)
                    if isinstance(value, str):
                        value = json.loads(value)
                fields[f.name] = value

            ancestors = list(page.get_ancestors().filter(depth__gte=2).values_list("slug", flat=True))
            entries.append({
                "model": f"{specific._meta.app_label}.{specific.__class__.__name__}",
                "parent_slugs": ancestors,
                "slug": page.slug,
                "title": page.title,
                "live": page.live,
                "show_in_menus": page.show_in_menus,
                "seo_title": page.seo_title,
                "search_description": page.search_description,
                "fields": fields,
            })

        out = Path(options["out"])
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(entries, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        self.stdout.write(self.style.SUCCESS(f"Exported {len(entries)} pages to {out}"))
