"""
Thin wrapper around the Cloudflare R2 (S3-compatible) client, plus the key and
URL rules for the media library.

Uploads go browser -> R2 directly through a short-lived presigned PUT URL, not
through Django: Vercel caps request bodies at ~4.5 MB, so proxying photos
through the backend would fail for anything sizeable.
"""

import os
import re
import uuid
from datetime import date

import boto3
from botocore.config import Config
from django.conf import settings

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
}
MAX_BYTES = 15 * 1024 * 1024
KEY_PREFIX = "library/"
PRESIGN_EXPIRES_SECONDS = 300
_KEY_RE = re.compile(r"^library/\d{4}/\d{2}/[0-9a-f]{8}-[a-z0-9-]+\.(jpg|png|webp|avif)$")


def is_configured() -> bool:
    return bool(settings.R2_ENABLED)


def get_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.R2_ENDPOINT_URL,
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        region_name="auto",
        config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
    )


def public_url(key: str) -> str:
    return f"{settings.R2_PUBLIC_URL}/{key}"


def build_key(filename: str, content_type: str) -> str:
    """A unique, URL-safe object key: library/YYYY/MM/<8 hex>-<slugified name>.<ext>."""
    stem = re.sub(r"[^a-z0-9]+", "-", os.path.splitext(filename)[0].lower()).strip("-")[:60] or "image"
    today = date.today()
    return f"{KEY_PREFIX}{today:%Y/%m}/{uuid.uuid4().hex[:8]}-{stem}{ALLOWED_TYPES[content_type]}"


def is_valid_key(key: str) -> bool:
    """Only keys this module could have generated may be registered or deleted."""
    return bool(_KEY_RE.match(key))


def presign_put(key: str, content_type: str) -> str:
    return get_client().generate_presigned_url(
        "put_object",
        Params={"Bucket": settings.R2_BUCKET_NAME, "Key": key, "ContentType": content_type},
        ExpiresIn=PRESIGN_EXPIRES_SECONDS,
    )


# -- Migrated placeholder photos --------------------------------------------
# Each photo is stored once per width so the frontend's image loader can pick
# a size that fits (R2 doesn't resize): photos/<photo-id>/<width>.webp.

UNSPLASH_ID_RE = re.compile(r"photo-\d{10,13}-[0-9a-f]{12}")
PHOTO_WIDTHS = (640, 1280, 2400)
_PHOTO_KEY_RE = re.compile(r"^photos/(?P<id>photo-[\w-]+)/(?P<width>\d+)\.webp$")


def photo_key(photo_id: str, width: int = max(PHOTO_WIDTHS)) -> str:
    return f"photos/{photo_id}/{width}.webp"


def photo_url(photo_id: str) -> str:
    """The URL stored in the database / used by the frontend: the largest size."""
    return public_url(photo_key(photo_id))


def keys_to_delete(key: str) -> list[str]:
    """Deleting a migrated photo must remove every size, not just the one listed."""
    match = _PHOTO_KEY_RE.match(key)
    if not match:
        return [key]
    return [photo_key(match["id"], width) for width in PHOTO_WIDTHS]


def is_photo_variant(key: str) -> bool:
    match = _PHOTO_KEY_RE.match(key)
    return bool(match) and int(match["width"]) != max(PHOTO_WIDTHS)
