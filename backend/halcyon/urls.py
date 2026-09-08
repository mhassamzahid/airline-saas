from django.conf import settings
from django.http import JsonResponse
from django.urls import include, path
from django.contrib import admin

from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.models import Site

from search import views as search_views
from home.models import FooterSettings, HeaderSettings, SiteSettings

# Read-only content API for the Next.js frontend to consume later.
# Listings (CSV/XLSX-backed) endpoints are a separate, not-yet-built piece --
# this router only exposes Wagtail pages.
api_router = WagtailAPIRouter("wagtailapi")
api_router.register_endpoint("pages", PagesAPIViewSet)


def footer_settings_api(request):
    # FooterSettings is a Wagtail Setting, not a Page, so it isn't picked up
    # by PagesAPIViewSet above -- exposed here as its own small read-only view.
    site = Site.find_for_request(request)
    footer = FooterSettings.for_site(site)

    columns = [
        {
            "title": col.value["title"],
            "links": [
                {"label": link["label"], "href": link["href"]} for link in col.value["links"]
            ],
        }
        for col in footer.columns
    ]

    return JsonResponse({
        "tagline": footer.tagline,
        "legal_line": footer.legal_line,
        "columns": columns,
    })


def header_settings_api(request):
    site = Site.find_for_request(request)
    h = HeaderSettings.for_site(site)
    return JsonResponse({
        "nav_links": [
            {"label": link.value["label"], "href": link.value["href"]}
            for link in h.nav_links
        ],
        "cta": {"label": h.cta_label, "href": h.cta_href},
    })


def site_settings_api(request):
    site = Site.find_for_request(request)
    s = SiteSettings.for_site(site)

    def image_url(image, spec):
        if not image:
            return None
        return request.build_absolute_uri(image.get_rendition(spec).url)

    return JsonResponse({
        "site_title": s.site_title,
        "theme": s.theme,
        "color_mode": s.color_mode,
        "logo_url": image_url(s.logo, "max-320x96"),
        "favicon_url": image_url(s.favicon, "fill-64x64"),
    })


urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("admin/", include(wagtailadmin_urls)),
    path("documents/", include(wagtaildocs_urls)),
    path("api/v2/", api_router.urls),
    path("api/v2/header-settings/", header_settings_api),
    path("api/v2/footer-settings/", footer_settings_api),
    path("api/v2/site-settings/", site_settings_api),
    path("search/", search_views.search, name="search"),
]


if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    # Serve static and media files from development server
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = urlpatterns + [
    # For anything not caught by a more specific rule above, hand over to
    # Wagtail's page serving mechanism. This should be the last pattern in
    # the list:
    path("", include(wagtail_urls)),
    # Alternatively, if you want Wagtail pages to be served from a subpath
    # of your site, rather than the site root:
    #    path("pages/", include(wagtail_urls)),
]
