from django.db import models

from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail import blocks
from wagtail.contrib.settings.models import BaseSiteSetting
from wagtail.contrib.settings.registry import register_setting

from halcyon.blocks import IconTextLinkBlock, FAQBlock, TestimonialBlock, StatBlock


class HomePage(Page):
    hero_eyebrow = models.CharField(
        max_length=80, blank=True,
        help_text="Small kicker above the hero heading. Leave blank to use the site title.",
    )
    hero_heading = models.CharField(max_length=200, blank=True)
    hero_subheading = models.TextField(blank=True)

    body = StreamField(
        [
            ("category_cards", blocks.ListBlock(IconTextLinkBlock(), label="Category cards")),
            ("stats", blocks.ListBlock(StatBlock(), label="Statistics (trust strip)")),
            ("highlights", blocks.ListBlock(IconTextLinkBlock(), label="Highlights")),
            ("testimonials", blocks.ListBlock(TestimonialBlock(), label="Testimonials")),
            ("faqs", blocks.ListBlock(FAQBlock(), label="FAQ")),
        ],
        blank=True,
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("hero_eyebrow"),
        FieldPanel("hero_heading"),
        FieldPanel("hero_subheading"),
        FieldPanel("body"),
    ]

    api_fields = [
        APIField("hero_eyebrow"),
        APIField("hero_heading"),
        APIField("hero_subheading"),
        APIField("body"),
    ]

    max_count = 1


THEME_CHOICES = [
    ("rust", "Rust (default)"),
    ("ocean", "Ocean"),
    ("forest", "Forest"),
    ("midnight", "Midnight"),
]

COLOR_MODE_CHOICES = [
    ("light", "Light"),
    ("dark", "Dark"),
    ("system", "Follow the visitor's device setting"),
]


@register_setting
class SiteSettings(BaseSiteSetting):
    """Site-wide brand controls: the name shown in the browser tab and the
    header/footer wordmark, an optional uploaded logo/favicon, and which of the
    pre-built color themes / light-dark modes (both defined as CSS variable
    overrides in globals.css, keyed by these same values) is active. Kept
    separate from FooterSettings since it's a different concern (global brand)
    from footer-specific copy."""

    site_title = models.CharField(
        max_length=60,
        default="Halcyon",
        help_text="Shown in the browser tab and the header/footer wordmark.",
    )
    logo = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Replaces the default mark in the header and footer. Leave empty to use the built-in wordmark.",
    )
    favicon = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Browser-tab icon. A square PNG works best.",
    )
    theme = models.CharField(
        max_length=20, choices=THEME_CHOICES, default="rust",
        help_text="The accent colour palette.",
    )
    color_mode = models.CharField(
        max_length=10, choices=COLOR_MODE_CHOICES, default="light",
        help_text="Light or dark surfaces. 'Follow device' uses each visitor's OS light/dark setting.",
    )

    panels = [
        FieldPanel("site_title"),
        FieldPanel("logo"),
        FieldPanel("favicon"),
        FieldPanel("theme"),
        FieldPanel("color_mode"),
    ]


class FooterLinkBlock(blocks.StructBlock):
    label = blocks.CharBlock(max_length=60)
    href = blocks.CharBlock(max_length=200, help_text="Internal route, e.g. /umrah")

    class Meta:
        icon = "link"


class FooterColumnBlock(blocks.StructBlock):
    title = blocks.CharBlock(max_length=40)
    links = blocks.ListBlock(FooterLinkBlock())

    class Meta:
        icon = "list-ul"
        label = "Column"


class NavLinkBlock(blocks.StructBlock):
    label = blocks.CharBlock(max_length=40)
    href = blocks.CharBlock(
        max_length=200,
        help_text="Internal route, e.g. /umrah, or a page you built (e.g. /pages/ramadan-offer)",
    )

    class Meta:
        icon = "link"


@register_setting
class HeaderSettings(BaseSiteSetting):
    nav_links = StreamField(
        [("link", NavLinkBlock())],
        blank=True,
        use_json_field=True,
        help_text=(
            "Main navigation links. Leave empty for the built-in "
            "Umrah / Hajj / Tours / Manage trip / Help."
        ),
    )
    cta_label = models.CharField(
        max_length=40, blank=True,
        help_text="Right-hand button label. Blank falls back to \"Sign in\".",
    )
    cta_href = models.CharField(
        max_length=200, blank=True,
        help_text="Where the button links. Blank falls back to /signin.",
    )

    panels = [
        FieldPanel("nav_links"),
        FieldPanel("cta_label"),
        FieldPanel("cta_href"),
    ]


@register_setting
class FooterSettings(BaseSiteSetting):
    tagline = models.TextField(
        blank=True,
        help_text="Short description under the logo, e.g. 'An independent long-haul airline...'",
    )
    legal_line = models.CharField(
        max_length=200,
        blank=True,
        help_text="Legal-entity / copyright line. Leave blank to fall back to \"<site title> is a design prototype, not a real airline.\"",
    )
    columns = StreamField(
        [("column", FooterColumnBlock())],
        blank=True,
        use_json_field=True,
        help_text=(
            "The footer's navigation columns. Leave empty to use the built-in "
            "Travel / Services / <site title> / Help columns."
        ),
    )

    panels = [
        FieldPanel("tagline"),
        FieldPanel("legal_line"),
        FieldPanel("columns"),
    ]
