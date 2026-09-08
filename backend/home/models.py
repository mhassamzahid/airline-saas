from django.db import models

from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail import blocks
from wagtail.contrib.settings.models import BaseSiteSetting
from wagtail.contrib.settings.registry import register_setting

from halcyon.blocks import IconTextLinkBlock, FAQBlock


class TestimonialBlock(blocks.StructBlock):
    quote = blocks.TextBlock()
    name = blocks.CharBlock(max_length=80)
    detail = blocks.CharBlock(max_length=140)

    class Meta:
        icon = "openquote"
        label = "Testimonial"


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

    panels = [
        FieldPanel("tagline"),
        FieldPanel("legal_line"),
    ]
