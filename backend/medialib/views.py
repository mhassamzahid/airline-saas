"""
Staff-only media library screens: browse, upload (browser -> R2 via presigned
URL, then registered here), inspect and delete images in the R2 bucket.
"""

import json
from io import BytesIO

from botocore.exceptions import ClientError
from django.conf import settings
from django.contrib import admin, messages
from django.contrib.admin.views.decorators import staff_member_required
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST
from PIL import Image, UnidentifiedImageError

from . import r2
from .models import MediaAsset
from .usage import find_usages

PAGE_SIZE = 48


def _render(request, template_name, context):
    # Same reason as packages.import_views: these templates extend the admin
    # chrome, which needs AdminSite.each_context() merged in by hand.
    return render(request, template_name, {**admin.site.each_context(request), **context})


def _json_error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def _json_body(request):
    try:
        data = json.loads(request.body or b"{}")
    except (ValueError, UnicodeDecodeError):
        return None
    return data if isinstance(data, dict) else None


@staff_member_required
def library(request):
    query = (request.GET.get("q") or "").strip()
    assets = MediaAsset.objects.select_related("uploaded_by")
    if query:
        assets = assets.filter(original_name__icontains=query)
    page = Paginator(assets, PAGE_SIZE).get_page(request.GET.get("page"))
    return _render(request, "medialib/library.html", {
        "page": page,
        "query": query,
        "r2_enabled": r2.is_configured(),
        "allowed_types": ", ".join(t.split("/")[1].upper() for t in r2.ALLOWED_TYPES),
        "max_mb": r2.MAX_BYTES // (1024 * 1024),
    })


@staff_member_required
@require_POST
def presign(request):
    """Step 1 of an upload: validate what the browser intends to send and hand
    back a short-lived signed URL it can PUT the file to directly."""
    if not r2.is_configured():
        return _json_error("R2 storage isn't configured on the server.", 503)
    data = _json_body(request)
    if data is None:
        return _json_error("Invalid request.")

    filename = str(data.get("filename") or "").strip()
    content_type = str(data.get("content_type") or "")
    size = data.get("size")

    if not filename:
        return _json_error("Missing file name.")
    if content_type not in r2.ALLOWED_TYPES:
        return _json_error(f"'{filename}' isn't a supported type. Use JPG, PNG, WebP or AVIF.")
    if not isinstance(size, int) or size <= 0:
        return _json_error(f"'{filename}' looks empty.")
    if size > r2.MAX_BYTES:
        return _json_error(f"'{filename}' is over the {r2.MAX_BYTES // (1024 * 1024)} MB limit.")

    key = r2.build_key(filename, content_type)
    return JsonResponse({
        "key": key,
        "upload_url": r2.presign_put(key, content_type),
        "headers": {"Content-Type": content_type},
    })


@staff_member_required
@require_POST
def complete(request):
    """Step 2: the browser says it finished the PUT. Confirm the object really
    is there and really is an image, then record it. Anything that fails the
    checks is deleted from the bucket so junk doesn't accumulate."""
    if not r2.is_configured():
        return _json_error("R2 storage isn't configured on the server.", 503)
    data = _json_body(request)
    key = str((data or {}).get("key") or "")
    original_name = str((data or {}).get("original_name") or "").strip()[:255] or "image"
    if not r2.is_valid_key(key):
        return _json_error("Invalid file key.")

    existing = MediaAsset.objects.filter(key=key).first()
    if existing:
        return JsonResponse(_asset_json(existing))

    client = r2.get_client()
    bucket = settings.R2_BUCKET_NAME

    def reject(message):
        try:
            client.delete_object(Bucket=bucket, Key=key)
        except ClientError:
            pass
        return _json_error(message)

    try:
        head = client.head_object(Bucket=bucket, Key=key)
    except ClientError:
        return _json_error("The upload didn't reach storage. Try again.")

    content_type = head.get("ContentType", "")
    size = head.get("ContentLength", 0)
    if content_type not in r2.ALLOWED_TYPES:
        return reject(f"'{original_name}' isn't a supported image type.")
    if size <= 0 or size > r2.MAX_BYTES:
        return reject(f"'{original_name}' is empty or over the size limit.")

    body = client.get_object(Bucket=bucket, Key=key)["Body"].read()
    width = height = None
    try:
        image = Image.open(BytesIO(body))
        width, height = image.size
        image.verify()
    except (UnidentifiedImageError, OSError, ValueError, SyntaxError):
        # Older Pillow builds can't read AVIF; accept it without dimensions.
        if content_type != "image/avif":
            return reject(f"'{original_name}' isn't a valid image file.")
        width = height = None

    asset = MediaAsset.objects.create(
        key=key, original_name=original_name, content_type=content_type, size=size,
        width=width, height=height, uploaded_by=request.user,
    )
    return JsonResponse(_asset_json(asset))


def _asset_json(asset):
    return {"id": str(asset.id), "url": asset.url, "name": asset.original_name}


@staff_member_required
def detail(request, asset_id):
    asset = get_object_or_404(MediaAsset.objects.select_related("uploaded_by"), id=asset_id)
    return _render(request, "medialib/detail.html", {"asset": asset, "usages": find_usages(asset.url)})


@staff_member_required
@require_POST
def delete(request):
    """Two steps, both POSTs: without `confirm`, show what's about to go (and
    which package pages still use it); with `confirm`, delete for real."""
    ids = request.POST.getlist("ids")
    assets = list(MediaAsset.objects.filter(id__in=ids)) if ids else []
    if not assets:
        messages.info(request, "Nothing selected.")
        return redirect("medialib_library")

    if not request.POST.get("confirm"):
        return _render(request, "medialib/confirm_delete.html", {
            "items": [{"asset": a, "usages": find_usages(a.url)} for a in assets],
        })

    client = r2.get_client()
    deleted, failed = 0, []
    for asset in assets:
        try:
            for key in r2.keys_to_delete(asset.key):
                client.delete_object(Bucket=settings.R2_BUCKET_NAME, Key=key)
        except ClientError:
            failed.append(asset.original_name)
            continue
        asset.delete()
        deleted += 1
    if deleted:
        messages.success(request, f"Deleted {deleted} image{'s' if deleted != 1 else ''}.")
    if failed:
        messages.error(request, f"Couldn't delete from storage: {', '.join(failed)}. They were left in place.")
    return redirect("medialib_library")
