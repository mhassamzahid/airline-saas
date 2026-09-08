"""
StreamField blocks shared by more than one page type (home, services, support).
Kept here rather than duplicated per-app since the same content shapes
(FAQ, numbered steps, checklist, icon/text/link tile) repeat across them.
"""

from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock


class FAQBlock(blocks.StructBlock):
    question = blocks.CharBlock(max_length=200)
    answer = blocks.TextBlock()

    class Meta:
        icon = "help"
        label = "FAQ item"


class StepBlock(blocks.StructBlock):
    title = blocks.CharBlock(max_length=120)
    body = blocks.TextBlock()

    class Meta:
        icon = "order"


class StepsBlock(blocks.StructBlock):
    title = blocks.CharBlock(max_length=120)
    steps = blocks.ListBlock(StepBlock())

    class Meta:
        icon = "order"
        label = "Numbered steps"


class ChecklistBlock(blocks.StructBlock):
    title = blocks.CharBlock(max_length=120)
    items = blocks.ListBlock(blocks.CharBlock(max_length=300))

    class Meta:
        icon = "tasks"
        label = "Checklist"


class IconTextLinkBlock(blocks.StructBlock):
    """A tile with a label, body copy, and an optional icon/image/link -- covers
    the homepage's category cards and highlight tiles, and the help page's
    contact channels, which all share this shape with a couple of fields unused."""

    icon_name = blocks.CharBlock(
        max_length=60, required=False,
        help_text="Phosphor icon name used by the frontend, e.g. IdentificationCard",
    )
    image = ImageChooserBlock(required=False)
    label = blocks.CharBlock(max_length=80)
    body = blocks.CharBlock(max_length=200)
    href = blocks.CharBlock(
        max_length=200, required=False,
        help_text="Internal route, e.g. /umrah",
    )
    action_label = blocks.CharBlock(
        max_length=60, required=False,
        help_text="Button/link text, e.g. 'Open chat'",
    )

    class Meta:
        icon = "link"
        label = "Icon/text/link tile"
