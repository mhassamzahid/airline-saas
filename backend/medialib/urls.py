from django.urls import path

from . import views

urlpatterns = [
    path("", views.library, name="medialib_library"),
    path("presign/", views.presign, name="medialib_presign"),
    path("complete/", views.complete, name="medialib_complete"),
    path("delete/", views.delete, name="medialib_delete"),
    path("<uuid:asset_id>/", views.detail, name="medialib_detail"),
]
