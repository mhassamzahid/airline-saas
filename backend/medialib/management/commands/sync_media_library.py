"""
Records images that are already in the R2 bucket (e.g. dropped in through the
Cloudflare dashboard) in the media library, so they show up in the grid.
Idempotent: keys already recorded are skipped. Files that Wagtail and the CSV
importer manage themselves are never adopted, since deleting one from the
library would break the page or import that owns it.
"""

import os

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from medialib import r2
from medialib.models import MediaAsset

MANAGED_PREFIXES = ("original_images/", "images/", "documents/", "package_imports/")
EXTENSIONS = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif"}


class Command(BaseCommand):
    help = "Record images already in the R2 bucket in the media library."

    def add_arguments(self, parser):
        parser.add_argument("--prefix", default="", help="Only scan keys under this prefix.")

    def handle(self, *args, **options):
        if not r2.is_configured():
            raise CommandError("R2 isn't configured -- set the R2_* environment variables (see backend/README.md).")

        known = set(MediaAsset.objects.values_list("key", flat=True))
        added = skipped = 0
        pages = r2.get_client().get_paginator("list_objects_v2").paginate(
            Bucket=settings.R2_BUCKET_NAME, Prefix=options["prefix"],
        )
        for page in pages:
            for obj in page.get("Contents", []):
                key = obj["Key"]
                content_type = EXTENSIONS.get(os.path.splitext(key)[1].lower())
                if not content_type or key in known or key.startswith(MANAGED_PREFIXES) or r2.is_photo_variant(key):
                    skipped += 1
                    continue
                MediaAsset.objects.create(
                    key=key, original_name=os.path.basename(key), content_type=content_type, size=obj["Size"],
                )
                added += 1
        self.stdout.write(self.style.SUCCESS(f"Added {added} image(s), skipped {skipped}."))
