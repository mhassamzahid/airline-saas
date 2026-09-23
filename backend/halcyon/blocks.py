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


class LandingCopyBlock(blocks.StructBlock):
    """Editable copy for a named editorial section on a catalogue landing page."""

    slot = blocks.CharBlock(max_length=60, help_text="Stable section key used by the frontend, e.g. season_intro")
    eyebrow = blocks.CharBlock(max_length=80, required=False)
    heading = blocks.CharBlock(max_length=160)
    body = blocks.TextBlock(required=False)

    class Meta:
        icon = "doc-full"
        label = "Landing section copy"


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
MARKDOWN_SAMPLE = {
    "body": (
        "## Privacy Policy\n\n"
        "_Last updated 1 January 2026._\n\n"
        "This policy explains what we collect when you book a trip with us, how "
        "we use it, and the choices you have.\n\n"
        "### What we collect\n\n"
        "- Contact details you give us when enquiring or booking\n"
        "- Passport and travel details needed to issue tickets and visas\n"
        "- Payment information, handled by our payment provider\n\n"
        "### How to reach us\n\n"
        "Email **privacy@example.com** with any question about your data."
    ),
}
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


class MarkdownBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/markdown.png"

    body = blocks.TextBlock(
        default=MARKDOWN_SAMPLE["body"],
        help_text=(
            "Written in Markdown -- headings (##), lists, links, **bold**. "
            "Best for long policy or terms pages."
        ),
    )

    class Meta:
        icon = "doc-empty"
        label = "Markdown"
        preview_value = MARKDOWN_SAMPLE


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


INQUIRY_FORM_SAMPLE = {
    "heading": "Ready to talk to someone?",
    "subject": "your trip",
    "lead_time": "2 business days",
    "ask_group_size": False,
}
GALLERY_SAMPLE = {"heading": "A closer look"}
MEDIA_TEXT_SAMPLE = {
    "heading": "Built around how people actually travel",
    "body": "<p>A short paragraph of supporting copy that sits beside the image, explaining the point in a sentence or two.</p>",
    "image_position": "left",
    "cta": {"label": "Learn more", "href": "/umrah"},
}
LOGO_STRIP_SAMPLE = {"heading": "Trusted by travellers booking through"}
VIDEO_SAMPLE = {
    "heading": "",
    "video_url": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "caption": "A short look at what to expect.",
}
SECTION_NAV_SAMPLE = {
    "heading": "On this page",
    "items": ["What we collect", "How to reach us"],
}


class InquiryFormBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/inquiry_form.png"

    heading = blocks.CharBlock(max_length=120, required=False, default=INQUIRY_FORM_SAMPLE["heading"])
    subject = blocks.CharBlock(
        max_length=120,
        default=INQUIRY_FORM_SAMPLE["subject"],
        help_text="What the inquiry is about, e.g. 'a Ramadan Umrah package'.",
    )
    lead_time = blocks.CharBlock(
        max_length=60, required=False, default=INQUIRY_FORM_SAMPLE["lead_time"],
        help_text="e.g. '2 business days'. Leave blank to omit the reply-time line.",
    )
    ask_group_size = blocks.BooleanBlock(
        required=False, default=False,
        help_text="Show a group-size field (for Hajj / group tours).",
    )

    class Meta:
        icon = "form"
        label = "Inquiry form"
        preview_value = INQUIRY_FORM_SAMPLE


class GalleryBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/gallery.png"

    heading = blocks.CharBlock(max_length=120, required=False, default=GALLERY_SAMPLE["heading"])
    images = blocks.ListBlock(
        ImageChooserBlock(required=False),
        help_text="An image left empty (e.g. a slot you haven't uploaded to yet) shows a placeholder, not an error.",
    )

    class Meta:
        icon = "image"
        label = "Gallery"
        preview_value = GALLERY_SAMPLE


class MediaTextBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/media_text.png"

    heading = blocks.CharBlock(max_length=120, required=False, default=MEDIA_TEXT_SAMPLE["heading"])
    body = blocks.RichTextBlock(
        features=["bold", "italic", "link", "ol", "ul"],
        default=MEDIA_TEXT_SAMPLE["body"],
    )
    image = ImageChooserBlock(required=False, help_text="Optional. Leave empty to use a default image.")
    image_position = blocks.ChoiceBlock(
        choices=[("left", "Image on the left"), ("right", "Image on the right")],
        default=MEDIA_TEXT_SAMPLE["image_position"],
    )
    cta = LinkValueBlock(required=False, default=MEDIA_TEXT_SAMPLE["cta"])

    class Meta:
        icon = "table"
        label = "Media + text"
        preview_value = MEDIA_TEXT_SAMPLE


class LogoItemBlock(blocks.StructBlock):
    image = ImageChooserBlock(required=False, help_text="Left empty, this logo shows a placeholder rather than an error.")
    name = blocks.CharBlock(max_length=60, required=False, help_text="Used as the image's alt text.")

    class Meta:
        icon = "image"
        label = "Logo"


class LogoStripBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/logo_strip.png"

    heading = blocks.CharBlock(max_length=120, required=False, default=LOGO_STRIP_SAMPLE["heading"])
    logos = blocks.ListBlock(LogoItemBlock())

    class Meta:
        icon = "group"
        label = "Logo strip"
        preview_value = LOGO_STRIP_SAMPLE


class VideoBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/video.png"

    heading = blocks.CharBlock(max_length=120, required=False)
    video_url = blocks.URLBlock(
        default=VIDEO_SAMPLE["video_url"],
        help_text="A YouTube or Vimeo URL.",
    )
    caption = blocks.CharBlock(max_length=160, required=False, default=VIDEO_SAMPLE["caption"])

    class Meta:
        icon = "media"
        label = "Video"
        preview_value = VIDEO_SAMPLE


class SectionNavBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/section_nav.png"

    heading = blocks.CharBlock(max_length=120, required=False, default=SECTION_NAV_SAMPLE["heading"])
    items = blocks.ListBlock(
        blocks.CharBlock(max_length=80),
        default=SECTION_NAV_SAMPLE["items"],
        help_text="Each entry must match a heading's exact text elsewhere on the page -- the link is generated from it.",
    )

    class Meta:
        icon = "list-ul"
        label = "Section links"
        preview_value = SECTION_NAV_SAMPLE


CONTACT_SAMPLE = {
    "heading": "Contact us",
    "intro": (
        "Use this form for all general enquiries. We monitor these responses "
        "constantly during working hours."
    ),
}


class ContactBlock(ScreenshotPreviewBlock):
    preview_image = "flexpages/previews/contact.png"

    heading = blocks.CharBlock(max_length=120, default=CONTACT_SAMPLE["heading"])
    intro = blocks.TextBlock(required=False, default=CONTACT_SAMPLE["intro"])
    image = ImageChooserBlock(required=False, help_text="Optional. Leave empty to use a default image.")

    class Meta:
        icon = "mail"
        label = "Contact"
        preview_value = CONTACT_SAMPLE
