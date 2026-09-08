from django.db import models

from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField
from wagtail import blocks

from halcyon.blocks import ChecklistBlock, StepsBlock, IconTextLinkBlock


class TileGridBlock(blocks.StructBlock):
    """A grid of icon/title/body tiles with no list bullets or numbering --
    matches Other Services' "What's available" section, which is a plain
    grid of offerings rather than a checklist or a numbered sequence."""

    title = blocks.CharBlock(max_length=120)
    tiles = blocks.ListBlock(IconTextLinkBlock())

    class Meta:
        icon = "grip"
        label = "Tile grid"


class ServicePage(Page):
    """
    One instance per secondary offering (Visa Consultation, Air Ticketing,
    Other Services): a shared shell used identically for every service so a
    new service is content dropped into an existing pattern, not a new build.
    Mirrors the real ServicePage/ServiceSection/ServiceChecklist/ServiceSteps
    component structure -- each StreamField block below is one <ServiceSection>.
    """

    eyebrow = models.CharField(
        max_length=80, blank=True,
        help_text="Small kicker label above the title. Leave blank to use \"<site title> services\".",
    )
    lede = models.TextField(blank=True)
    hero_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    sections = StreamField(
        [
            ("checklist", ChecklistBlock()),
            ("steps", StepsBlock()),
            ("tile_grid", TileGridBlock()),
            (
                "paragraph",
                blocks.StructBlock(
                    [
                        ("title", blocks.CharBlock(max_length=120, required=False)),
                        ("text", blocks.RichTextBlock()),
                    ],
                    icon="pilcrow",
                ),
            ),
        ],
        blank=True,
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("eyebrow"),
        FieldPanel("lede"),
        FieldPanel("hero_image"),
        FieldPanel("sections"),
    ]

    api_fields = [
        APIField("eyebrow"),
        APIField("lede"),
        APIField("hero_image"),
        APIField("sections"),
    ]

    subpage_types: list = []
