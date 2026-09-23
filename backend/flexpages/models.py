from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from django.db import models
from wagtail.images import get_image_model_string
from wagtail.snippets.models import register_snippet

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
    InquiryFormBlock,
    GalleryBlock,
    MediaTextBlock,
    LogoStripBlock,
    VideoBlock,
    SectionNavBlock,
    ContactBlock,
    LandingCopyBlock,
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
            ("gallery", GalleryBlock()),
            ("media_text", MediaTextBlock()),
            ("feature_grid", FeatureGridBlock()),
            ("logo_strip", LogoStripBlock()),
            ("video", VideoBlock()),
            ("cta_band", CTABandBlock()),
            ("inquiry_form", InquiryFormBlock()),
            ("contact", ContactBlock()),
            ("faq", FAQSectionBlock()),
            ("stats", StatsSectionBlock()),
            ("testimonials", TestimonialsSectionBlock()),
            ("section_nav", SectionNavBlock()),
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


# Content-only records for the four catalogue landing pages. Package listings
# remain in the packages app and are intentionally not editable here.


@register_snippet
class CatalogueLandingContent(models.Model):
    PAGE_CHOICES = [
        ("umrah", "Umrah"),
        ("hajj", "Hajj"),
        ("tours", "International Tours"),
        ("pakistan-tours", "Pakistan Tours"),
    ]

    page_key = models.CharField(max_length=32, choices=PAGE_CHOICES, unique=True)
    hero_eyebrow = models.CharField(max_length=80, blank=True)
    hero_heading = models.CharField(max_length=160, blank=True)
    hero_subheading = models.TextField(blank=True)
    hero_image = models.ForeignKey(
        get_image_model_string(), null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    hero_image_alt = models.CharField(max_length=160, blank=True)
    sections = StreamField(
        [("copy", LandingCopyBlock()), ("faq", FAQSectionBlock())],
        blank=True,
        use_json_field=True,
    )

    panels = [
        FieldPanel("page_key"),
        FieldPanel("hero_eyebrow"),
        FieldPanel("hero_heading"),
        FieldPanel("hero_subheading"),
        FieldPanel("hero_image"),
        FieldPanel("hero_image_alt"),
        FieldPanel("sections"),
    ]
    title = "Catalogue landing content"

    class Meta:
        ordering = ["page_key"]
        verbose_name = "catalogue landing content"
        verbose_name_plural = "catalogue landing content"

    def __str__(self):
        return self.get_page_key_display()
