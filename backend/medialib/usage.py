"""Finds package content that points at a given image URL, so deleting an
image that's still in use can be flagged before it breaks a live page."""

from django.urls import reverse

from packages import models as pm

_DIRECT = [pm.UmrahHotel, pm.UmrahPackage, pm.HajjPackage, pm.TourPackage, pm.PakistanTourPackage]
_GALLERY = [pm.HajjGalleryImage, pm.TourGalleryImage, pm.PakistanTourGalleryImage]


def _admin_url(obj) -> str:
    return reverse(f"admin:{obj._meta.app_label}_{obj._meta.model_name}_change", args=[obj.pk])


def find_usages(url: str) -> list[dict]:
    found = []
    for model in _DIRECT:
        for obj in model.objects.filter(image_url=url):
            found.append({"kind": model._meta.verbose_name.capitalize(), "name": str(obj), "url": _admin_url(obj)})
    for model in _GALLERY:
        for item in model.objects.filter(image_url=url).select_related("package"):
            found.append({
                "kind": model._meta.verbose_name.capitalize(),
                "name": str(item.package),
                "url": _admin_url(item.package),
            })
    return found
