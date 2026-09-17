"""
Plain relational models for Umrah/Hajj/Tours/Pakistan Tours package content.

Deliberately outside Wagtail: this data isn't managed through the CMS page
tree. For now it's edited via django-admin; the eventual real content
pipeline is a separate dashboard with CSV upload, matched by `slug` on
re-import (not built yet). Django admin gives a working "back office" in
the meantime without inventing a throwaway UI.
"""

import uuid

from django.conf import settings
from django.db import models

SEASON_CHOICES = [
    ("Ramadan", "Ramadan"),
    ("Winter", "Winter"),
    ("Spring", "Spring"),
    ("Summer", "Summer"),
    ("Autumn", "Autumn"),
    ("Year-round", "Year-round"),
]

GROUP_TYPE_CHOICES = [
    ("Individual", "Individual"),
    ("Family", "Family"),
    ("Couple", "Couple"),
    ("Group", "Group"),
]


class SortableChild(models.Model):
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True
        ordering = ["sort_order", "id"]


# ---------------------------------------------------------------------------
# Umrah
# ---------------------------------------------------------------------------

class UmrahCategory(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=80)
    strap = models.CharField(max_length=160)
    description = models.TextField()

    class Meta:
        verbose_name_plural = "Umrah categories"

    def __str__(self):
        return self.name


class UmrahHotel(models.Model):
    CITY_CHOICES = [("Makkah", "Makkah"), ("Madinah", "Madinah")]

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    city = models.CharField(max_length=10, choices=CITY_CHOICES)
    distance_label = models.CharField(max_length=80)
    distance_meters = models.PositiveIntegerField()
    star_rating = models.PositiveSmallIntegerField()
    price_per_night_gbp = models.DecimalField(max_digits=8, decimal_places=2)
    image_url = models.URLField(max_length=500)
    categories = models.ManyToManyField(UmrahCategory, related_name="hotels")

    def __str__(self):
        return f"{self.name} ({self.city})"


class UmrahRoomSharingOption(models.Model):
    slug = models.SlugField(unique=True)
    label = models.CharField(max_length=80)
    note = models.CharField(max_length=160)
    divisor = models.PositiveSmallIntegerField(help_text="How many travellers split one room-night.")

    def __str__(self):
        return self.label


class UmrahTransportTier(models.Model):
    slug = models.SlugField(unique=True)
    label = models.CharField(max_length=80)
    note = models.CharField(max_length=160)
    price_gbp = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.label


class UmrahAddOnService(models.Model):
    PRICING_UNIT_CHOICES = [("person", "Per person"), ("booking", "Per booking"), ("day", "Per day")]

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=120)
    note = models.CharField(max_length=200)
    price_gbp = models.DecimalField(max_digits=8, decimal_places=2)
    pricing_unit = models.CharField(max_length=10, choices=PRICING_UNIT_CHOICES)

    def __str__(self):
        return self.title


class UmrahPricingSettings(models.Model):
    """Singleton: constants used alongside package data to price the live quote."""

    visa_price_gbp = models.DecimalField(max_digits=8, decimal_places=2, default=180)
    airport_transfer_price_gbp = models.DecimalField(max_digits=8, decimal_places=2, default=25)
    ziyarat_price_gbp = models.DecimalField(max_digits=8, decimal_places=2, default=45)

    class Meta:
        verbose_name_plural = "Umrah pricing settings"

    def __str__(self):
        return "Umrah pricing settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class UmrahPackage(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    strap = models.CharField(max_length=160)
    blurb = models.TextField()
    image_url = models.URLField(max_length=500)
    category = models.ForeignKey(UmrahCategory, on_delete=models.PROTECT, related_name="packages")
    duration_days = models.PositiveSmallIntegerField()
    makkah_hotel = models.ForeignKey(UmrahHotel, on_delete=models.PROTECT, related_name="+")
    madinah_hotel = models.ForeignKey(UmrahHotel, on_delete=models.PROTECT, related_name="+")
    room_sharing = models.ForeignKey(UmrahRoomSharingOption, on_delete=models.PROTECT, related_name="+")
    transport_tier = models.ForeignKey(UmrahTransportTier, on_delete=models.PROTECT, related_name="+")
    season = models.CharField(max_length=12, choices=SEASON_CHOICES)
    from_price_gbp = models.DecimalField(max_digits=8, decimal_places=2)
    popular = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class UmrahPackageInclusion(SortableChild):
    package = models.ForeignKey(UmrahPackage, on_delete=models.CASCADE, related_name="inclusions")
    text = models.CharField(max_length=300)

    def __str__(self):
        return self.text


class UmrahPackageAddon(models.Model):
    package = models.ForeignKey(UmrahPackage, on_delete=models.CASCADE, related_name="default_addons")
    addon_service = models.ForeignKey(UmrahAddOnService, on_delete=models.CASCADE, related_name="+")

    class Meta:
        unique_together = ("package", "addon_service")

    def __str__(self):
        return f"{self.package} + {self.addon_service}"


# ---------------------------------------------------------------------------
# Hajj
# ---------------------------------------------------------------------------

class HajjPackage(models.Model):
    PACKAGE_TYPE_CHOICES = [
        ("Government Scheme", "Government Scheme"),
        ("Private Economy", "Private Economy"),
        ("Private Premium", "Private Premium"),
    ]

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPE_CHOICES)
    strap = models.CharField(max_length=160)
    blurb = models.TextField()
    image_url = models.URLField(max_length=500)
    nights = models.PositiveSmallIntegerField()
    from_price_gbp = models.DecimalField(max_digits=8, decimal_places=2)
    quota_text = models.CharField(max_length=80)
    application_deadline = models.CharField(max_length=80)
    transport_text = models.CharField(max_length=200)
    meals_text = models.CharField(max_length=200)
    guide_text = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class HajjAccommodation(SortableChild):
    LOCATION_CHOICES = [("Makkah", "Makkah"), ("Madinah", "Madinah"), ("Mina", "Mina"), ("Arafat", "Arafat")]

    package = models.ForeignKey(HajjPackage, on_delete=models.CASCADE, related_name="accommodation")
    location = models.CharField(max_length=10, choices=LOCATION_CHOICES)
    detail = models.CharField(max_length=300)

    def __str__(self):
        return f"{self.package} — {self.location}"


class HajjItineraryStep(SortableChild):
    package = models.ForeignKey(HajjPackage, on_delete=models.CASCADE, related_name="itinerary")
    day_label = models.CharField(max_length=40)
    title = models.CharField(max_length=120)
    body = models.TextField()

    def __str__(self):
        return f"{self.package} — {self.day_label}"


class HajjGalleryImage(SortableChild):
    package = models.ForeignKey(HajjPackage, on_delete=models.CASCADE, related_name="gallery")
    image_url = models.URLField(max_length=500)

    def __str__(self):
        return f"{self.package} — image {self.sort_order}"


# ---------------------------------------------------------------------------
# International Tours
# ---------------------------------------------------------------------------

class TourCountry(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=80)

    class Meta:
        verbose_name_plural = "Tour countries"

    def __str__(self):
        return self.name


class TourPackage(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    country = models.ForeignKey(TourCountry, on_delete=models.PROTECT, related_name="packages")
    strap = models.CharField(max_length=160)
    blurb = models.TextField()
    image_url = models.URLField(max_length=500)
    duration_days = models.PositiveSmallIntegerField()
    from_price_gbp = models.DecimalField(max_digits=8, decimal_places=2)
    season = models.CharField(max_length=12, choices=SEASON_CHOICES)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class TourPackageGroupType(models.Model):
    package = models.ForeignKey(TourPackage, on_delete=models.CASCADE, related_name="group_types")
    group_type = models.CharField(max_length=10, choices=GROUP_TYPE_CHOICES)

    class Meta:
        unique_together = ("package", "group_type")

    def __str__(self):
        return f"{self.package} — {self.group_type}"


class TourInclusion(SortableChild):
    package = models.ForeignKey(TourPackage, on_delete=models.CASCADE, related_name="inclusions")
    text = models.CharField(max_length=300)

    def __str__(self):
        return self.text


class TourExclusion(SortableChild):
    package = models.ForeignKey(TourPackage, on_delete=models.CASCADE, related_name="exclusions")
    text = models.CharField(max_length=300)

    def __str__(self):
        return self.text


class TourHotelStay(SortableChild):
    package = models.ForeignKey(TourPackage, on_delete=models.CASCADE, related_name="hotels")
    city = models.CharField(max_length=80)
    hotel_name = models.CharField(max_length=120)
    rating = models.PositiveSmallIntegerField()
    detail = models.CharField(max_length=300)

    def __str__(self):
        return f"{self.package} — {self.hotel_name}"


class TourItineraryStep(SortableChild):
    package = models.ForeignKey(TourPackage, on_delete=models.CASCADE, related_name="itinerary")
    day_label = models.CharField(max_length=40)
    title = models.CharField(max_length=120)
    body = models.TextField()

    def __str__(self):
        return f"{self.package} — {self.day_label}"


class TourGalleryImage(SortableChild):
    package = models.ForeignKey(TourPackage, on_delete=models.CASCADE, related_name="gallery")
    image_url = models.URLField(max_length=500)

    def __str__(self):
        return f"{self.package} — image {self.sort_order}"


# ---------------------------------------------------------------------------
# CSV bulk-import
# ---------------------------------------------------------------------------

class PackageImportBatch(models.Model):
    """One uploaded CSV, tracked from upload through preview to commit (or
    cancellation). The stored file is re-read and re-validated at both
    preview and confirm time -- this row exists so a batch survives across
    those requests without trusting anything round-tripped through the
    browser, and doubles as an audit trail of who imported what and when."""

    ARCHETYPE_CHOICES = [
        ("hajj", "Hajj"),
        ("umrah", "Umrah"),
        ("tours", "International Tours"),
        ("pakistan-tours", "Pakistan Tours"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("committed", "Committed"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    archetype = models.CharField(max_length=20, choices=ARCHETYPE_CHOICES)
    csv_file = models.FileField(upload_to="package_imports/%Y/%m/")
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    committed_at = models.DateTimeField(null=True, blank=True)
    result_summary = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name_plural = "Package import batches"

    def __str__(self):
        return f"{self.get_archetype_display()} import {self.uploaded_at:%Y-%m-%d %H:%M} ({self.status})"


# ---------------------------------------------------------------------------
# Pakistan Tours
# ---------------------------------------------------------------------------

class PakistanRegion(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=80)

    def __str__(self):
        return self.name


class PakistanTourPackage(models.Model):
    CARD_TAG_CHOICES = [("Family", "Family"), ("Honeymoon", "Honeymoon"), ("Group", "Group")]

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    region = models.ForeignKey(PakistanRegion, on_delete=models.PROTECT, related_name="packages")
    strap = models.CharField(max_length=160)
    blurb = models.TextField()
    image_url = models.URLField(max_length=500)
    duration_days = models.PositiveSmallIntegerField()
    from_price_gbp = models.DecimalField(max_digits=8, decimal_places=2)
    season = models.CharField(max_length=12, choices=SEASON_CHOICES)
    featured = models.BooleanField(default=False)
    card_tag = models.CharField(max_length=10, choices=CARD_TAG_CHOICES, blank=True)

    def __str__(self):
        return self.name


class PakistanTourPackageGroupType(models.Model):
    package = models.ForeignKey(PakistanTourPackage, on_delete=models.CASCADE, related_name="group_types")
    group_type = models.CharField(max_length=10, choices=GROUP_TYPE_CHOICES)

    class Meta:
        unique_together = ("package", "group_type")

    def __str__(self):
        return f"{self.package} — {self.group_type}"


class PakistanTourInclusion(SortableChild):
    package = models.ForeignKey(PakistanTourPackage, on_delete=models.CASCADE, related_name="inclusions")
    text = models.CharField(max_length=300)

    def __str__(self):
        return self.text


class PakistanTourStay(SortableChild):
    STAY_TYPE_CHOICES = [
        ("Hotel", "Hotel"),
        ("Resort", "Resort"),
        ("Guesthouse", "Guesthouse"),
        ("Camping", "Camping"),
    ]

    package = models.ForeignKey(PakistanTourPackage, on_delete=models.CASCADE, related_name="stays")
    location = models.CharField(max_length=120)
    stay_type = models.CharField(max_length=12, choices=STAY_TYPE_CHOICES)
    name = models.CharField(max_length=120)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    detail = models.CharField(max_length=300)

    def __str__(self):
        return f"{self.package} — {self.name}"


class PakistanTourItineraryStep(SortableChild):
    package = models.ForeignKey(PakistanTourPackage, on_delete=models.CASCADE, related_name="itinerary")
    day_label = models.CharField(max_length=40)
    title = models.CharField(max_length=120)
    body = models.TextField()

    def __str__(self):
        return f"{self.package} — {self.day_label}"


class PakistanTourGalleryImage(SortableChild):
    package = models.ForeignKey(PakistanTourPackage, on_delete=models.CASCADE, related_name="gallery")
    image_url = models.URLField(max_length=500)

    def __str__(self):
        return f"{self.package} — image {self.sort_order}"
