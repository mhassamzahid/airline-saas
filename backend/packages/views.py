"""
Plain read-only JSON endpoints for the package catalogs -- deliberately not
part of the Wagtail API (see halcyon/urls.py), since this content isn't
managed through the CMS. Hand-serialized rather than DRF, matching the
existing header/footer/site-settings views' convention.
"""

from django.http import JsonResponse

from . import models


def _money(value):
    return float(value)


def umrah_catalog_api(request):
    def hotel_dict(h):
        return {
            "id": h.slug,
            "name": h.name,
            "city": h.city,
            "distance": h.distance_label,
            "distanceMeters": h.distance_meters,
            "stars": h.star_rating,
            "pricePerNightGBP": _money(h.price_per_night_gbp),
            "categories": list(h.categories.values_list("slug", flat=True)),
            "image": h.image_url,
        }

    def package_dict(p):
        return {
            "id": p.slug,
            "name": p.name,
            "strap": p.strap,
            "blurb": p.blurb,
            "image": p.image_url,
            "popular": p.popular,
            "fromPriceGBP": _money(p.from_price_gbp),
            "season": p.season,
            "defaults": {
                "category": p.category.slug,
                "durationDays": p.duration_days,
                "makkahHotelId": p.makkah_hotel.slug,
                "madinahHotelId": p.madinah_hotel.slug,
                "roomSharing": p.room_sharing.slug,
                "intercityTransport": p.transport_tier.slug,
                "services": {
                    a.addon_service.slug: True for a in p.default_addons.select_related("addon_service")
                },
            },
            "inclusions": list(p.inclusions.values_list("text", flat=True)),
        }

    pricing = models.UmrahPricingSettings.load()

    return JsonResponse({
        "categories": [
            {"id": c.slug, "name": c.name, "strap": c.strap, "description": c.description}
            for c in models.UmrahCategory.objects.all()
        ],
        "hotels": [hotel_dict(h) for h in models.UmrahHotel.objects.prefetch_related("categories")],
        "roomSharingOptions": [
            {"id": r.slug, "label": r.label, "note": r.note, "divisor": r.divisor}
            for r in models.UmrahRoomSharingOption.objects.all()
        ],
        "transportTiers": [
            {"id": t.slug, "label": t.label, "note": t.note, "priceGBP": _money(t.price_gbp)}
            for t in models.UmrahTransportTier.objects.all()
        ],
        "addOnServices": [
            {"key": a.slug, "title": a.title, "note": a.note, "priceGBP": _money(a.price_gbp), "per": a.pricing_unit}
            for a in models.UmrahAddOnService.objects.all()
        ],
        "pricing": {
            "visaPriceGBP": _money(pricing.visa_price_gbp),
            "airportTransferPriceGBP": _money(pricing.airport_transfer_price_gbp),
            "ziyaratPriceGBP": _money(pricing.ziyarat_price_gbp),
        },
        "packages": [
            package_dict(p) for p in models.UmrahPackage.objects.select_related(
                "category", "makkah_hotel", "madinah_hotel", "room_sharing", "transport_tier",
            ).prefetch_related("inclusions", "default_addons__addon_service")
        ],
    })


def hajj_packages_api(request):
    def package_dict(p):
        return {
            "slug": p.slug,
            "name": p.name,
            "type": p.package_type,
            "strap": p.strap,
            "blurb": p.blurb,
            "image": p.image_url,
            "gallery": list(p.gallery.values_list("image_url", flat=True)),
            "nights": p.nights,
            "fromPriceGBP": _money(p.from_price_gbp),
            "quota": p.quota_text,
            "applicationDeadline": p.application_deadline,
            "accommodation": [
                {"location": a.location, "detail": a.detail} for a in p.accommodation.all()
            ],
            "transport": p.transport_text,
            "meals": p.meals_text,
            "guide": p.guide_text,
            "itinerary": [
                {"title": s.title, "body": s.body} for s in p.itinerary.all()
            ],
        }

    packages = models.HajjPackage.objects.prefetch_related("accommodation", "itinerary", "gallery")
    return JsonResponse({"packages": [package_dict(p) for p in packages]})


def tour_packages_api(request):
    def package_dict(p):
        return {
            "slug": p.slug,
            "name": p.name,
            "country": p.country.name,
            "strap": p.strap,
            "blurb": p.blurb,
            "image": p.image_url,
            "gallery": list(p.gallery.values_list("image_url", flat=True)),
            "durationDays": p.duration_days,
            "fromPriceGBP": _money(p.from_price_gbp),
            "groupTypes": list(p.group_types.values_list("group_type", flat=True)),
            "season": p.season,
            "featured": p.featured,
            "inclusions": list(p.inclusions.values_list("text", flat=True)),
            "exclusions": list(p.exclusions.values_list("text", flat=True)),
            "hotels": [
                {"city": h.city, "name": h.hotel_name, "rating": h.rating, "detail": h.detail}
                for h in p.hotels.all()
            ],
            "itinerary": [
                {"day": s.day_label, "title": s.title, "body": s.body} for s in p.itinerary.all()
            ],
        }

    packages = models.TourPackage.objects.select_related("country").prefetch_related(
        "group_types", "inclusions", "exclusions", "hotels", "itinerary", "gallery",
    )
    return JsonResponse({"packages": [package_dict(p) for p in packages]})


def pakistan_tour_packages_api(request):
    def package_dict(p):
        return {
            "slug": p.slug,
            "name": p.name,
            "region": p.region.name,
            "strap": p.strap,
            "blurb": p.blurb,
            "image": p.image_url,
            "gallery": list(p.gallery.values_list("image_url", flat=True)),
            "durationDays": p.duration_days,
            "fromPriceGBP": _money(p.from_price_gbp),
            "groupTypes": list(p.group_types.values_list("group_type", flat=True)),
            "cardTag": p.card_tag or None,
            "season": p.season,
            "featured": p.featured,
            "inclusions": list(p.inclusions.values_list("text", flat=True)),
            "stays": [
                {
                    "location": s.location, "type": s.stay_type, "name": s.name,
                    "rating": s.rating, "detail": s.detail,
                }
                for s in p.stays.all()
            ],
            "itinerary": [
                {"day": s.day_label, "title": s.title, "body": s.body} for s in p.itinerary.all()
            ],
        }

    packages = models.PakistanTourPackage.objects.select_related("region").prefetch_related(
        "group_types", "inclusions", "stays", "itinerary", "gallery",
    )
    return JsonResponse({"packages": [package_dict(p) for p in packages]})
