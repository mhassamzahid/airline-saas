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
    hero_eyebrow = models.CharField(max_length=80, blank=True, default="Halcyon")
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


@register_setting
class FooterSettings(BaseSiteSetting):
    tagline = models.TextField(
        blank=True,
        help_text="Short description under the logo, e.g. 'An independent long-haul airline...'",
    )
    legal_line = models.CharField(
        max_length=200,
        blank=True,
        help_text="e.g. 'Halcyon Airways Ltd. This is a design prototype, not a real airline.'",
    )

    panels = [
        FieldPanel("tagline"),
        FieldPanel("legal_line"),
    ]
