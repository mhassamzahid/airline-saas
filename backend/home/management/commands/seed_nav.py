"""
Seeds HeaderSettings/FooterSettings with the site's built-in navigation, so
they show up as editable content in the admin instead of empty fields backed
by hardcoded fallbacks in the Next.js components (see FALLBACK_LINKS in
src/components/layout/Navbar.tsx and columns() in src/components/layout/Footer.tsx).

Only fills fields that are currently empty -- safe to re-run, and won't
clobber anything an editor has already set.
"""

from django.core.management.base import BaseCommand
from wagtail.models import Site

from home.models import FooterSettings, HeaderSettings, SiteSettings

NAV_LINKS = [
    {"type": "link", "value": {"label": "Umrah", "href": "/umrah"}},
    {"type": "link", "value": {"label": "Hajj", "href": "/hajj"}},
    {"type": "link", "value": {"label": "Tours", "href": "/tours"}},
    {"type": "link", "value": {"label": "Manage trip", "href": "/manage"}},
    {"type": "link", "value": {"label": "Help", "href": "/help"}},
]

FALLBACK_TAGLINE = (
    "An independent long-haul airline flying from London Gatwick, Manchester "
    "and Edinburgh. Quiet cabins, honest fares, and a plan you can see the "
    "whole way through."
)

HEADER_TAGLINE = "Flying from London Gatwick, Manchester & Edinburgh"
HEADER_PHONE = "+44 20 7946 0192"


def footer_columns(site_title):
    return [
        {"type": "column", "value": {"title": "Travel", "links": [
            {"label": "Build an Umrah package", "href": "/umrah"},
            {"label": "Hajj", "href": "/hajj"},
            {"label": "International & Pakistan Tours", "href": "/tours"},
            {"label": "The fleet", "href": "/experience"},
        ]}},
        {"type": "column", "value": {"title": "Services", "links": [
            {"label": "Visa Consultation", "href": "/visa-consultation"},
            {"label": "Air Ticketing", "href": "/air-ticketing"},
            {"label": "Other Services", "href": "/other-services"},
            {"label": "Manage your trip", "href": "/manage"},
        ]}},
        {"type": "column", "value": {"title": site_title, "links": [
            {"label": "The experience", "href": "/experience"},
            {"label": "Sustainability", "href": "/experience"},
            {"label": "Newsroom", "href": "/help"},
            {"label": "Careers", "href": "/help"},
        ]}},
        {"type": "column", "value": {"title": "Help", "links": [
            {"label": "Contact us", "href": "/help"},
            {"label": "Disruption and refunds", "href": "/help"},
            {"label": "Manage your trip", "href": "/manage"},
            {"label": "Accessibility", "href": "/help"},
        ]}},
    ]


class Command(BaseCommand):
    help = "Seeds HeaderSettings/FooterSettings with the site's built-in nav (only empty fields)."

    def handle(self, *args, **options):
        site = Site.objects.filter(is_default_site=True).first() or Site.objects.first()
        if not site:
            self.stderr.write(self.style.ERROR("No Wagtail Site found -- run migrations first."))
            return

        site_title = SiteSettings.for_site(site).site_title or "Halcyon"

        header = HeaderSettings.for_site(site)
        changed = []
        if not header.nav_links:
            header.nav_links = NAV_LINKS
            changed.append("nav_links")
        if not header.cta_label:
            header.cta_label = "Sign in"
            changed.append("cta_label")
        if not header.cta_href:
            header.cta_href = "/signin"
            changed.append("cta_href")
        if not header.tagline:
            header.tagline = HEADER_TAGLINE
            changed.append("tagline")
        if not header.phone:
            header.phone = HEADER_PHONE
            changed.append("phone")
        if changed:
            header.save()
            self.stdout.write(self.style.SUCCESS(f"HeaderSettings: seeded {', '.join(changed)}"))
        else:
            self.stdout.write("HeaderSettings: already populated, left as-is")

        footer = FooterSettings.for_site(site)
        changed = []
        if not footer.columns:
            footer.columns = footer_columns(site_title)
            changed.append("columns")
        if not footer.tagline:
            footer.tagline = FALLBACK_TAGLINE
            changed.append("tagline")
        if not footer.legal_line:
            footer.legal_line = f"{site_title} is a design prototype, not a real airline."
            changed.append("legal_line")
        if changed:
            footer.save()
            self.stdout.write(self.style.SUCCESS(f"FooterSettings: seeded {', '.join(changed)}"))
        else:
            self.stdout.write("FooterSettings: already populated, left as-is")
