from django.contrib import admin

from . import models


class UmrahPackageInclusionInline(admin.TabularInline):
    model = models.UmrahPackageInclusion
    extra = 1


class UmrahPackageAddonInline(admin.TabularInline):
    model = models.UmrahPackageAddon
    extra = 1


@admin.register(models.UmrahPackage)
class UmrahPackageAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "duration_days", "from_price_gbp", "season", "popular")
    list_filter = ("category", "season", "duration_days")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [UmrahPackageInclusionInline, UmrahPackageAddonInline]


@admin.register(models.UmrahCategory)
class UmrahCategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(models.UmrahHotel)
class UmrahHotelAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "star_rating", "distance_label", "price_per_night_gbp")
    list_filter = ("city", "star_rating", "categories")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(models.UmrahRoomSharingOption)
class UmrahRoomSharingOptionAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("label",)}


@admin.register(models.UmrahTransportTier)
class UmrahTransportTierAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("label",)}


@admin.register(models.UmrahAddOnService)
class UmrahAddOnServiceAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}


@admin.register(models.UmrahPricingSettings)
class UmrahPricingSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not models.UmrahPricingSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class HajjAccommodationInline(admin.TabularInline):
    model = models.HajjAccommodation
    extra = 1


class HajjItineraryStepInline(admin.TabularInline):
    model = models.HajjItineraryStep
    extra = 1


class HajjGalleryImageInline(admin.TabularInline):
    model = models.HajjGalleryImage
    extra = 1


@admin.register(models.HajjPackage)
class HajjPackageAdmin(admin.ModelAdmin):
    list_display = ("name", "package_type", "nights", "from_price_gbp", "application_deadline")
    list_filter = ("package_type",)
    prepopulated_fields = {"slug": ("name",)}
    inlines = [HajjAccommodationInline, HajjItineraryStepInline, HajjGalleryImageInline]


class TourPackageGroupTypeInline(admin.TabularInline):
    model = models.TourPackageGroupType
    extra = 1


class TourInclusionInline(admin.TabularInline):
    model = models.TourInclusion
    extra = 1


class TourExclusionInline(admin.TabularInline):
    model = models.TourExclusion
    extra = 1


class TourHotelStayInline(admin.TabularInline):
    model = models.TourHotelStay
    extra = 1


class TourItineraryStepInline(admin.TabularInline):
    model = models.TourItineraryStep
    extra = 1


class TourGalleryImageInline(admin.TabularInline):
    model = models.TourGalleryImage
    extra = 1


@admin.register(models.TourPackage)
class TourPackageAdmin(admin.ModelAdmin):
    list_display = ("name", "country", "duration_days", "from_price_gbp", "season", "featured")
    list_filter = ("country", "season", "featured")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [
        TourPackageGroupTypeInline,
        TourInclusionInline,
        TourExclusionInline,
        TourHotelStayInline,
        TourItineraryStepInline,
        TourGalleryImageInline,
    ]


@admin.register(models.TourCountry)
class TourCountryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


class PakistanTourPackageGroupTypeInline(admin.TabularInline):
    model = models.PakistanTourPackageGroupType
    extra = 1


class PakistanTourInclusionInline(admin.TabularInline):
    model = models.PakistanTourInclusion
    extra = 1


class PakistanTourStayInline(admin.TabularInline):
    model = models.PakistanTourStay
    extra = 1


class PakistanTourItineraryStepInline(admin.TabularInline):
    model = models.PakistanTourItineraryStep
    extra = 1


class PakistanTourGalleryImageInline(admin.TabularInline):
    model = models.PakistanTourGalleryImage
    extra = 1


@admin.register(models.PakistanTourPackage)
class PakistanTourPackageAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "duration_days", "from_price_gbp", "season", "card_tag", "featured")
    list_filter = ("region", "season", "card_tag", "featured")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [
        PakistanTourPackageGroupTypeInline,
        PakistanTourInclusionInline,
        PakistanTourStayInline,
        PakistanTourItineraryStepInline,
        PakistanTourGalleryImageInline,
    ]


@admin.register(models.PakistanRegion)
class PakistanRegionAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
