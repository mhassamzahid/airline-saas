from django.contrib import admin
from django.shortcuts import redirect

from .models import MediaAsset


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    """Only exists so "Media library" shows up in the Django admin sidebar;
    the changelist just opens the real library screen."""

    def changelist_view(self, request, extra_context=None):
        return redirect("medialib_library")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
