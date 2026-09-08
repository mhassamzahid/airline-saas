from django.db import models

from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail import blocks

from halcyon.blocks import IconTextLinkBlock, FAQBlock, StepBlock


class HelpPage(Page):
    """The single /help page: contact channels, an FAQ list, and the
    disruption-strip's numbered steps -- all currently hardcoded in the
    Next.js page, modelled here so a non-technical user can edit them."""

    eyebrow = models.CharField(max_length=80, blank=True, default="Help")
    lede = models.TextField(blank=True)

    body = StreamField(
        [
            ("channels", blocks.ListBlock(IconTextLinkBlock(), label="Contact channels")),
            ("faqs", blocks.ListBlock(FAQBlock(), label="Common questions")),
        ],
        blank=True,
        use_json_field=True,
    )

    disruption_heading = models.CharField(max_length=160, blank=True)
    disruption_steps = StreamField(
        [("step", StepBlock())],
        blank=True,
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("eyebrow"),
        FieldPanel("lede"),
        FieldPanel("body"),
        FieldPanel("disruption_heading"),
        FieldPanel("disruption_steps"),
    ]

    api_fields = [
        APIField("eyebrow"),
        APIField("lede"),
        APIField("body"),
        APIField("disruption_heading"),
        APIField("disruption_steps"),
    ]

    max_count = 1
