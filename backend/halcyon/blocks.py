"""
StreamField blocks shared by more than one page type (home, services, support,
flexible pages). Kept here rather than duplicated per-app since the same content
shapes repeat across them.
"""

from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock


class FAQBlock(blocks.StructBlock):
    question = blocks.CharBlock(max_length=200)
    answer = blocks.TextBlock()

    class Meta:
        icon = "help"
        label = "FAQ item"


class TestimonialBlock(blocks.StructBlock):
    quote = blocks.TextBlock()
    name = blocks.CharBlock(max_length=80)
    detail = blocks.CharBlock(max_length=140)

    class Meta:
        icon = "openquote"
        label = "Testimonial"


class StatBlock(blocks.StructBlock):
    # Not named "value" -- that collides with ListBlock's own per-item "value"
    # wrapper key in the API's JSON output and corrupts the serialization.
    label = blocks.CharBlock(max_length=60)
    figure = blocks.CharBlock(max_length=20)

    class Meta:
        icon = "order"
        label = "Statistic"


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


# ─────────────────────────────────────────────────────────────
# Page-builder blocks used by FlexiblePage.
#
# Each block's picker preview is a real screenshot of the component rendered on
# the Next.js site (regenerate: `npm run gen:block-previews` from the repo
# root). The `*_SAMPLE` dicts below are the single source of truth for that
# sample content -- they seed the admin form via `default=` AND feed the
# screenshot route, whose copy is mirrored in `src/lib/blockPlaceholders.ts`.
# ─────────────────────────────────────────────────────────────

PREVIEW_TEMPLATE = "flexpages/previews/_screenshot.html"

HERO_SAMPLE = {
    "eyebrow": "New for 2026",
    "heading": "Umrah, done properly",
    "subheading": "Fixed departures, hotels within walking distance of the Haram, and a guide with every group.",
    "cta": {"label": "See packages", "href": "/umrah"},
}
RICH_TEXT_SAMPLE = {
    "text": (
        "<h2>What to expect</h2><p>A short introduction to the section, with room "
        "for a <a href='#'>link</a> and a couple of points worth calling out:</p>"
        "<ul><li>The first thing travellers ask about</li>"
        "<li>The second thing travellers ask about</li></ul>"
    ),
}
IMAGE_SAMPLE = {"caption": "A caption sits under the image."}
FEATURE_GRID_SAMPLE = {
    "heading": "What's included",
    "items": [
        {"icon_name": "ShieldCheck", "label": "Hotels near the Haram", "body": "Vetted four-star stays within a short walk of the mosque.", "image": None, "href": "", "action_label": ""},
        {"icon_name": "Lifebuoy", "label": "A guide per group", "body": "Someone with you for the rites, not just a number to call.", "image": None, "href": "", "action_label": ""},
        {"icon_name": "BookOpen", "label": "Visa handled", "body": "The visa is arranged as part of every package.", "image": None, "href": "", "action_label": ""},
    ],
}
CTA_BAND_SAMPLE = {
    "heading": "Ready to start planning?",
    "body": "Tell us your dates and group size and we'll come back with options.",
    "cta": {"label": "Get a quote", "href": "/manage"},
}
FAQ_SAMPLE = {
    "heading": "Common questions",
    "items": [
        {"question": "How far in advance should I book?", "answer": "For Ramadan, three to four months. Off-peak, six weeks is usually enough."},
        {"question": "Do you arrange the visa?", "answer": "Yes, the visa is included and handled for you on every package."},
    ],
}
STATS_SAMPLE = {
    "items": [
        {"label": "Years running", "figure": "12"},
        {"label": "Travellers a year", "figure": "40k"},
        {"label": "Destinations", "figure": "18"},
        {"label": "Repeat customers", "figure": "63%"},
    ],
}
TESTIMONIALS_SAMPLE = {
    "heading": "What travellers say",
    "items": [
        {"quote": "Everything was handled. We turned up and focused on the worship.", "name": "Aisha R.", "detail": "Standard Umrah, March"},
        {"quote": "The hotel really was two minutes from the Haram. That made the trip.", "name": "Bilal K.", "detail": "Group Hajj"},
        {"quote": "Clear pricing, no surprises, and a guide who knew what he was doing.", "name": "Fatima S.", "detail": "Ramadan Umrah"},
    ],
}


class ScreenshotPreviewBlock(blocks.StructBlock):
    """Base for page-builder blocks: the block-picker preview renders
    `preview_image` (a screenshot of the real component) rather than a
    Django-template mock. Subclasses set `preview_image`."""

    preview_image = None  # e.g. "flexpages/previews/hero.png"

    class Meta:
        preview_template = PREVIEW_TEMPLATE

    def get_preview_context(self, value, parent_context=None):
        context = super().get_preview_context(value, parent_context)
        context["preview_image"] = self.preview_image
        return context


class LinkValueBlock(blocks.StructBlock):
    label = blocks.CharBlock(max_length=40)
    href = blocks.CharBlock(max_length=200, help_text="Internal route, e.g. /umrah")

    class Meta:
        icon = "link"


class HeroBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/hero.png"

    eyebrow = blocks.CharBlock(max_length=60, required=False)
    heading = blocks.CharBlock(max_length=120, default=HERO_SAMPLE["heading"])
    subheading = blocks.TextBlock(required=False, default=HERO_SAMPLE["subheading"])
    image = ImageChooserBlock(required=False, help_text="Optional background image")
    cta = LinkValueBlock(required=False, default=HERO_SAMPLE["cta"])

    class Meta:
        icon = "pick"
        label = "Hero"
        preview_value = HERO_SAMPLE


class RichTextSectionBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/rich_text.png"

    text = blocks.RichTextBlock(
        features=["h2", "h3", "bold", "italic", "link", "ol", "ul", "hr", "blockquote"],
        default=RICH_TEXT_SAMPLE["text"],
    )

    class Meta:
        icon = "doc-full"
        label = "Rich text"
        preview_value = RICH_TEXT_SAMPLE


class ImageSectionBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/image.png"

    image = ImageChooserBlock()
    caption = blocks.CharBlock(max_length=160, required=False, default=IMAGE_SAMPLE["caption"])

    class Meta:
        icon = "image"
        label = "Image"
        preview_value = IMAGE_SAMPLE


class FeatureGridBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/feature_grid.png"

    heading = blocks.CharBlock(max_length=120, required=False, default=FEATURE_GRID_SAMPLE["heading"])
    items = blocks.ListBlock(IconTextLinkBlock(), default=FEATURE_GRID_SAMPLE["items"])

    class Meta:
        icon = "grip"
        label = "Feature grid"
        preview_value = FEATURE_GRID_SAMPLE


class CTABandBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/cta_band.png"

    heading = blocks.CharBlock(max_length=120, default=CTA_BAND_SAMPLE["heading"])
    body = blocks.CharBlock(max_length=200, required=False, default=CTA_BAND_SAMPLE["body"])
    cta = LinkValueBlock(default=CTA_BAND_SAMPLE["cta"])

    class Meta:
        icon = "redirect"
        label = "CTA band"
        preview_value = CTA_BAND_SAMPLE


class FAQSectionBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/faq.png"

    heading = blocks.CharBlock(max_length=120, required=False, default=FAQ_SAMPLE["heading"])
    items = blocks.ListBlock(FAQBlock(), default=FAQ_SAMPLE["items"])

    class Meta:
        icon = "help"
        label = "FAQ"
        preview_value = FAQ_SAMPLE


class StatsSectionBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/stats.png"

    heading = blocks.CharBlock(max_length=120, required=False)
    items = blocks.ListBlock(StatBlock(), default=STATS_SAMPLE["items"])

    class Meta:
        icon = "order"
        label = "Stats strip"
        preview_value = STATS_SAMPLE


class TestimonialsSectionBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/testimonials.png"

    heading = blocks.CharBlock(max_length=120, required=False, default=TESTIMONIALS_SAMPLE["heading"])
    items = blocks.ListBlock(TestimonialBlock(), default=TESTIMONIALS_SAMPLE["items"])

    class Meta:
        icon = "openquote"
        label = "Testimonials"
        preview_value = TESTIMONIALS_SAMPLE
