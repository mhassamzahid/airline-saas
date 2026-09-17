"""
Staff-only screens for the CSV package importer: upload -> preview/diff ->
confirm. Kept separate from views.py, which is deliberately just the 4
public read-only JSON endpoints the Next.js frontend consumes -- mixing
staff-gated mutation views into that file would blur its single
responsibility.

The uploaded file itself is the source of truth across requests: nothing
parsed from it is trusted via hidden form fields or the session. Preview and
confirm both re-open the stored PackageImportBatch.csv_file and re-run the
diff fresh, so a change to the file (or to an FK slug it references) between
preview and confirm is always caught before anything is written.
"""

import csv

from django.contrib import admin, messages
from django.contrib.admin.views.decorators import staff_member_required
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone

from .forms import PackageCsvUploadForm
from .importer import ARCHETYPE_SPECS, CsvStructureError, build_diff, commit_rows, instance_to_row, read_csv_rows
from .models import PackageImportBatch


def _spec_or_404(archetype):
    try:
        return ARCHETYPE_SPECS[archetype]
    except KeyError:
        raise Http404(f"Unknown package archetype '{archetype}'.")


def _render(request, template_name, context):
    # These templates extend admin/base_site.html, which expects the context
    # AdminSite.each_context() normally provides (nav sidebar, app list,
    # site header) -- these views bypass ModelAdmin/AdminSite entirely, so
    # that context has to be merged in by hand or the page renders as bare
    # unstyled HTML with no sidebar.
    return render(request, template_name, {**admin.site.each_context(request), **context})


def _load_batch_preview(batch):
    spec = ARCHETYPE_SPECS[batch.archetype]
    batch.csv_file.open("rb")
    try:
        rows = read_csv_rows(spec, batch.csv_file)
    finally:
        batch.csv_file.close()
    return spec, build_diff(spec, rows)


@staff_member_required
def import_index(request):
    return _render(request, "packages/import_index.html", {
        "specs": ARCHETYPE_SPECS.values(),
        "recent_batches": PackageImportBatch.objects.select_related("uploaded_by")[:20],
    })


@staff_member_required
def import_history(request):
    return _render(request, "packages/import_history.html", {
        "batches": PackageImportBatch.objects.select_related("uploaded_by"),
    })


@staff_member_required
def import_template_download(request, archetype):
    spec = _spec_or_404(archetype)
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{spec.key}_template.csv"'
    csv.DictWriter(response, fieldnames=spec.csv_columns).writeheader()
    return response


@staff_member_required
def import_current_download(request, archetype):
    spec = _spec_or_404(archetype)
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{spec.key}_current.csv"'
    writer = csv.DictWriter(response, fieldnames=spec.csv_columns)
    writer.writeheader()
    for obj in spec.model.objects.all().order_by("slug"):
        writer.writerow(instance_to_row(obj, spec))
    return response


@staff_member_required
def import_upload(request, archetype):
    spec = _spec_or_404(archetype)
    error = None
    if request.method == "POST":
        form = PackageCsvUploadForm(request.POST, request.FILES)
        if form.is_valid():
            uploaded = form.cleaned_data["csv_file"]
            try:
                read_csv_rows(spec, uploaded)
            except CsvStructureError as exc:
                error = str(exc)
            else:
                uploaded.seek(0)
                batch = PackageImportBatch.objects.create(
                    archetype=spec.key,
                    csv_file=uploaded,
                    uploaded_by=request.user,
                )
                return redirect("packages_import_preview", batch_id=batch.id)
    else:
        form = PackageCsvUploadForm()
    return _render(request, "packages/import_upload.html", {"spec": spec, "form": form, "error": error})


@staff_member_required
def import_preview(request, batch_id):
    batch = get_object_or_404(PackageImportBatch, id=batch_id)
    if batch.status != "pending":
        return redirect("packages_import_result", batch_id=batch.id)
    try:
        spec, preview = _load_batch_preview(batch)
    except CsvStructureError as exc:
        messages.error(request, f"This upload is no longer valid: {exc}")
        batch.status = "cancelled"
        batch.save(update_fields=["status"])
        return redirect("packages_import_index")
    return _render(request, "packages/import_preview.html", {"batch": batch, "spec": spec, "preview": preview})


@staff_member_required
def import_confirm(request, batch_id):
    batch = get_object_or_404(PackageImportBatch, id=batch_id)
    if request.method != "POST" or batch.status != "pending":
        return redirect("packages_import_preview", batch_id=batch.id)
    spec, preview = _load_batch_preview(batch)
    result = commit_rows(spec, preview)
    batch.status = "committed"
    batch.committed_at = timezone.now()
    batch.result_summary = result
    batch.save(update_fields=["status", "committed_at", "result_summary"])
    messages.success(
        request,
        f"{spec.label} import complete: {len(result['created'])} created, "
        f"{len(result['updated'])} updated, {len(result['skipped'])} skipped.",
    )
    return redirect("packages_import_result", batch_id=batch.id)


@staff_member_required
def import_cancel(request, batch_id):
    batch = get_object_or_404(PackageImportBatch, id=batch_id)
    if request.method == "POST" and batch.status == "pending":
        batch.status = "cancelled"
        batch.save(update_fields=["status"])
    return redirect("packages_import_index")


@staff_member_required
def import_result(request, batch_id):
    batch = get_object_or_404(PackageImportBatch, id=batch_id)
    return _render(request, "packages/import_result.html", {"batch": batch, "spec": ARCHETYPE_SPECS[batch.archetype]})
