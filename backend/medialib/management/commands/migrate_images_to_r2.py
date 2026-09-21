"""
Moves the site's placeholder photography from Unsplash hot-links to the R2
bucket, and points the database at the copies.

For every Unsplash photo id found in the database and in the scanned source
folders, this downloads the photo once, stores it in R2 at three widths
(photos/<id>/640|1280|2400.webp), records it in the media library, and rewrites
any Unsplash URL in the package image fields to the R2 URL.

Idempotent: photos already in the bucket are not downloaded again, and rows
already pointing at R2 are left alone, so it's safe to re-run -- and to run
once per database (local, then production).

    python manage.py migrate_images_to_r2 --dry-run    # report only
    python manage.py migrate_images_to_r2              # do it

The frontend switches over separately, by setting NEXT_PUBLIC_MEDIA_URL (see
the repo README) *after* this has run.
"""

import time
import urllib.error
import urllib.request
from io import BytesIO
from pathlib import Path

from botocore.exceptions import ClientError
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from PIL import Image, ImageOps

from medialib import r2
from medialib.models import MediaAsset
from packages import models as pm

IMAGE_FIELDS = [
    (pm.UmrahHotel, "image_url"),
    (pm.UmrahPackage, "image_url"),
    (pm.HajjPackage, "image_url"),
    (pm.HajjGalleryImage, "image_url"),
    (pm.TourPackage, "image_url"),
    (pm.TourGalleryImage, "image_url"),
    (pm.PakistanTourPackage, "image_url"),
    (pm.PakistanTourGalleryImage, "image_url"),
]
SCAN_SUFFIXES = {".ts", ".tsx", ".py", ".json", ".html", ".mjs"}
SKIP_DIRS = {"node_modules", ".next", ".venv", "__pycache__", ".git", "migrations", "static", "media"}
CACHE_CONTROL = "public, max-age=31536000, immutable"


def fetch_image(photo_id: str) -> bytes:
    """Downloads the photo at up to 2400px wide, uncropped."""
    url = f"https://images.unsplash.com/{photo_id}?auto=format&fit=max&w=2400&q=85&fm=jpg"
    request = urllib.request.Request(url, headers={"User-Agent": "halcyon-image-migration"})
    last_error = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=40) as response:
                return response.read()
        except (urllib.error.URLError, TimeoutError) as exc:
            last_error = exc
            time.sleep(1.5 * (attempt + 1))
    raise CommandError(f"Couldn't download {photo_id}: {last_error}")


def make_variants(data: bytes) -> dict[int, tuple[bytes, tuple[int, int]]]:
    """One WebP per configured width. Never upscales; a small source is simply
    stored at its own size under every width so any variant URL resolves."""
    image = ImageOps.exif_transpose(Image.open(BytesIO(data))).convert("RGB")
    variants = {}
    for width in r2.PHOTO_WIDTHS:
        resized = image if image.width <= width else image.resize(
            (width, round(image.height * width / image.width)), Image.LANCZOS,
        )
        buffer = BytesIO()
        resized.save(buffer, "WEBP", quality=80, method=6)
        variants[width] = (buffer.getvalue(), resized.size)
    return variants


def ids_in_text(text: str) -> set[str]:
    return set(r2.UNSPLASH_ID_RE.findall(text))


class Command(BaseCommand):
    help = "Copy the placeholder photos from Unsplash into R2 and repoint the database at them."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Report what would happen; change nothing.")
        parser.add_argument(
            "--scan-dir", action="append", dest="scan_dirs", default=None,
            help="Source folder to scan for photo ids (repeatable). Defaults to the repo's src/ and backend/.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        if not r2.is_configured() and not dry_run:
            raise CommandError("R2 isn't configured -- set the R2_* environment variables (see backend/README.md).")

        scan_dirs = [Path(d) for d in options["scan_dirs"]] if options["scan_dirs"] else self.default_scan_dirs()
        db_ids = self.ids_from_database()
        source_ids = self.ids_from_files(scan_dirs)
        all_ids = sorted(db_ids | source_ids)
        self.stdout.write(
            f"Found {len(all_ids)} photo(s): {len(db_ids)} in the database, {len(source_ids)} in source files "
            f"({', '.join(str(d) for d in scan_dirs) or 'no folders scanned'})."
        )

        client = r2.get_client() if r2.is_configured() else None
        present, uploaded, would_upload, failed = set(), 0, 0, []
        for photo_id in all_ids:
            key = r2.photo_key(photo_id)
            head = self.head(client, key)
            if head is not None:
                present.add(photo_id)
                self.record_asset(photo_id, key, head["ContentLength"], None, None, dry_run)
                continue
            if dry_run:
                would_upload += 1
                self.stdout.write(f"  would upload {photo_id}")
                continue
            try:
                variants = make_variants(fetch_image(photo_id))
            except (CommandError, OSError, ValueError) as exc:
                failed.append(photo_id)
                self.stderr.write(f"  FAILED {photo_id}: {exc}")
                continue
            for width, (body, _size) in variants.items():
                client.put_object(
                    Bucket=settings.R2_BUCKET_NAME, Key=r2.photo_key(photo_id, width), Body=body,
                    ContentType="image/webp", CacheControl=CACHE_CONTROL,
                )
            body, (w, h) = variants[max(r2.PHOTO_WIDTHS)]
            self.record_asset(photo_id, key, len(body), w, h, dry_run)
            present.add(photo_id)
            uploaded += 1
            self.stdout.write(f"  uploaded {photo_id} ({w}x{h})")

        # A dry run has nothing in the bucket yet, so count against every photo it would upload.
        rewritten = self.rewrite_database(present | set(all_ids) if dry_run else present, dry_run)
        if dry_run:
            self.stdout.write(self.style.SUCCESS(
                f"Dry run: would upload {would_upload} photo(s) ({len(present)} already in the bucket) "
                f"and rewrite {rewritten} database URL(s). Nothing was changed."
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                f"Uploaded {uploaded} new photo(s); {len(present)} of {len(all_ids)} are in the bucket; "
                f"rewrote {rewritten} database URL(s)."
            ))
        if failed:
            raise CommandError(f"{len(failed)} photo(s) failed and were left as Unsplash links: {', '.join(failed)}")

    # -- helpers ---------------------------------------------------------

    def default_scan_dirs(self):
        repo_root = Path(settings.BASE_DIR).parent
        return [d for d in (repo_root / "src", repo_root / "backend") if d.is_dir()]

    def ids_from_database(self) -> set[str]:
        ids = set()
        for model, field in IMAGE_FIELDS:
            for value in model.objects.values_list(field, flat=True):
                ids |= ids_in_text(value or "")
        return ids

    def ids_from_files(self, dirs) -> set[str]:
        ids = set()
        for directory in dirs:
            for path in directory.rglob("*"):
                if path.suffix in SCAN_SUFFIXES and path.is_file() and not self.is_skipped(path):
                    ids |= ids_in_text(path.read_text(encoding="utf-8", errors="ignore"))
        return ids

    def is_skipped(self, path: Path) -> bool:
        # Test files hold made-up photo ids that must never be downloaded.
        return bool(SKIP_DIRS & set(path.parts)) or path.name == "tests.py" or path.name.startswith("test_")

    def head(self, client, key):
        if client is None:
            return None
        try:
            return client.head_object(Bucket=settings.R2_BUCKET_NAME, Key=key)
        except ClientError:
            return None

    def record_asset(self, photo_id, key, size, width, height, dry_run):
        if dry_run:
            return
        MediaAsset.objects.get_or_create(key=key, defaults={
            "original_name": f"{photo_id}.webp", "content_type": "image/webp",
            "size": size, "width": width, "height": height,
        })

    def rewrite_database(self, available: set[str], dry_run: bool) -> int:
        count = 0
        for model, field in IMAGE_FIELDS:
            for obj in model.objects.filter(**{f"{field}__contains": "images.unsplash.com"}):
                match = r2.UNSPLASH_ID_RE.search(getattr(obj, field))
                if not match or match.group(0) not in available:
                    continue
                count += 1
                if not dry_run:
                    setattr(obj, field, r2.photo_url(match.group(0)))
                    obj.save(update_fields=[field])
        return count
