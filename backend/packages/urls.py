from django.urls import path
from django.views.generic import RedirectView

from . import import_views

urlpatterns = [
    path("", RedirectView.as_view(pattern_name="packages_import_index"), name="packages_index"),
    path("import/", import_views.import_index, name="packages_import_index"),
    path("import/history/", import_views.import_history, name="packages_import_history"),
    path("import/<str:archetype>/upload/", import_views.import_upload, name="packages_import_upload"),
    path("import/<str:archetype>/template/", import_views.import_template_download, name="packages_import_template"),
    path("import/<str:archetype>/current.csv", import_views.import_current_download, name="packages_import_current"),
    path("import/<uuid:batch_id>/preview/", import_views.import_preview, name="packages_import_preview"),
    path("import/<uuid:batch_id>/confirm/", import_views.import_confirm, name="packages_import_confirm"),
    path("import/<uuid:batch_id>/cancel/", import_views.import_cancel, name="packages_import_cancel"),
    path("import/<uuid:batch_id>/result/", import_views.import_result, name="packages_import_result"),
]
