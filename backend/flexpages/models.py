from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField

from halcyon.blocks import (
    HeroBlock,
    RichTextSectionBlock,
    MarkdownBlock,
    ImageSectionBlock,
    FeatureGridBlock,
    CTABandBlock,
    FAQSectionBlock,
    StatsSectionBlock,
    TestimonialsSectionBlock,
)


class FlexiblePage(Page):
    """A page an editor builds from a menu of blocks. Its URL is its position
    in the page tree -- put it under Home for /<slug>, or nest it under another
    FlexiblePage named e.g. "pages" for /pages/<slug>. The frontend resolves it
    by path via a catch-all route."""

    body = StreamField(
        [
            ("hero", HeroBlock()),
            ("rich_text", RichTextSectionBlock()),
            ("markdown", MarkdownBlock()),
            ("image", ImageSectionBlock()),
            ("feature_grid", FeatureGridBlock()),
            ("cta_band", CTABandBlock()),
            ("faq", FAQSectionBlock()),
            ("stats", StatsSectionBlock()),
            ("testimonials", TestimonialsSectionBlock()),
        ],
        blank=True,
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    api_fields = [
        APIField("body"),
    ]
