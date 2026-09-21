"""
Recreates the CMS page tree from home/seed/pages.json (see `export_pages`).

Idempotent and non-destructive: pages are matched by slug under their parent,
so re-running updates existing pages in place and never deletes anything. The
depth-2 page (Home) is updated rather than duplicated, since every Wagtail
install already ships with one. Note that re-running overwrites edits made in
the admin to any page in the seed file.
"""

import json
from pathlib import Path

from django.apps import apps
from django.core.management.base import BaseCommand, CommandError
from wagtail.models import Page

DEFAULT_SRC = Path(__file__).resolve().parents[2] / "seed" / "pages.json"


class Command(BaseCommand):
    help = "Create or update the Wagtail page tree from the JSON seed file."

    def add_arguments(self, parser):
        parser.add_argument("--src", default=str(DEFAULT_SRC))

    def handle(self, *args, **options):
        src = Path(options["src"])
        if not src.exists():
            raise CommandError(f"Seed file not found: {src}")
        entries = json.loads(src.read_text(encoding="utf-8"))

        root = Page.objects.filter(depth=1).first()
        if root is None:
            raise CommandError("No Wagtail root page found -- run `migrate` first.")

        by_chain = {}
        created = updated = 0

        for entry in entries:
            model = apps.get_model(entry["model"])
            chain = tuple(entry["parent_slugs"])
            parent = root if not chain else by_chain[chain]

            existing = parent.get_children().filter(slug=entry["slug"]).first()
            if existing is None and not chain:
                existing = parent.get_children().filter(depth=2).first()

            values = {
                "title": entry["title"],
                "show_in_menus": entry["show_in_menus"],
                "seo_title": entry["seo_title"],
                "search_description": entry["search_description"],
                **{name: json.dumps(v) if isinstance(v, (list, dict)) else v for name, v in entry["fields"].items()},
            }

            if existing is not None and isinstance(existing.specific, model):
                page = existing.specific
                for name, value in values.items():
                    setattr(page, name, value)
                page.save()
                updated += 1
            else:
                page = model(slug=entry["slug"], live=entry["live"], **values)
                parent.add_child(instance=page)
                created += 1

            if entry["live"]:
                page.save_revision().publish()
            by_chain[chain + (entry["slug"],)] = page
            self.stdout.write(f"  {'/'.join(chain + (entry['slug'],))}")

        self.stdout.write(self.style.SUCCESS(f"Seeded pages: {created} created, {updated} updated."))
