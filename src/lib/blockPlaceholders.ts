import type { FlexBlock } from "./cms";

/**
 * Sample content for every page-builder block. `/preview-blocks/[block]`
 * renders each block from this data with no page chrome, and those pages are
 * screenshotted into the Wagtail block picker (see
 * `scripts/gen-block-previews.mjs`).
 *
 * Keep in sync with the `*_SAMPLE` dicts in `backend/halcyon/blocks.py`, which
 * seed the same values as defaults into the admin form so a newly added block
 * starts from real copy instead of empty fields.
 */

type BlockValue<K extends FlexBlock["type"]> = Extract<FlexBlock, { type: K }>["value"];

function sampleImage(photoId: string, w = 1200, h = 800) {
  return {
    id: 0,
    title: "Sample image",
    meta: { download_url: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=70` },
  };
}

const SAMPLE_IMAGE = sampleImage("photo-1650446647974-451d05d2136d");

export const BLOCK_PLACEHOLDERS: { [K in FlexBlock["type"]]: BlockValue<K> } = {
  hero: {
    eyebrow: "New for 2026",
    heading: "Umrah, done properly",
    subheading:
      "Fixed departures, hotels within walking distance of the Haram, and a guide with every group.",
    image: null,
    cta: { label: "See packages", href: "/umrah" },
  },
  rich_text: {
    text:
      "<h2>What to expect</h2><p>A short introduction to the section, with room for a <a href=\"#\">link</a> and a couple of points worth calling out:</p><ul><li>The first thing travellers ask about</li><li>The second thing travellers ask about</li></ul>",
  },
  markdown: {
    body:
      "## Privacy Policy\n\n_Last updated 1 January 2026._\n\nThis policy explains what we collect when you book a trip with us, how we use it, and the choices you have.\n\n### What we collect\n\n- Contact details you give us when enquiring or booking\n- Passport and travel details needed to issue tickets and visas\n- Payment information, handled by our payment provider\n\n### How to reach us\n\nEmail **privacy@example.com** with any question about your data.",
  },
  image: {
    image: SAMPLE_IMAGE,
    caption: "A caption sits under the image.",
  },
  gallery: {
    heading: "A closer look",
    images: [
      sampleImage("photo-1650446647974-451d05d2136d", 900, 700),
      sampleImage("photo-1584186028062-637e3e77318d", 900, 700),
      sampleImage("photo-1565330770968-0240c0046ce3", 900, 700),
    ],
  },
  media_text: {
    heading: "Built around how people actually travel",
    body: "<p>A short paragraph of supporting copy that sits beside the image, explaining the point in a sentence or two.</p>",
    image: SAMPLE_IMAGE,
    image_position: "left",
    cta: { label: "Learn more", href: "/umrah" },
  },
  feature_grid: {
    heading: "What's included",
    items: [
      {
        icon_name: "ShieldCheck",
        label: "Hotels near the Haram",
        body: "Vetted four-star stays within a short walk of the mosque.",
        image: null,
        href: "",
        action_label: "",
      },
      {
        icon_name: "Lifebuoy",
        label: "A guide per group",
        body: "Someone with you for the rites, not just a number to call.",
        image: null,
        href: "",
        action_label: "",
      },
      {
        icon_name: "BookOpen",
        label: "Visa handled",
        body: "The visa is arranged as part of every package.",
        image: null,
        href: "",
        action_label: "",
      },
    ],
  },
  logo_strip: {
    heading: "Trusted by travellers booking through",
    logos: [
      { image: sampleImage("photo-1650446647974-451d05d2136d", 200, 80), name: "Traveller Weekly" },
      { image: sampleImage("photo-1584186028062-637e3e77318d", 200, 80), name: "Northbound Times" },
      { image: sampleImage("photo-1565330770968-0240c0046ce3", 200, 80), name: "Compass Review" },
      { image: sampleImage("photo-1513072064285-240f87fa81e8", 200, 80), name: "Fifth Meridian" },
    ],
  },
  video: {
    heading: "",
    video_url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    caption: "A short look at what to expect.",
  },
  cta_band: {
    heading: "Ready to start planning?",
    body: "Tell us your dates and group size and we'll come back with options.",
    cta: { label: "Get a quote", href: "/manage" },
  },
  inquiry_form: {
    heading: "Ready to talk to someone?",
    subject: "your trip",
    lead_time: "2 business days",
    ask_group_size: false,
  },
  faq: {
    heading: "Common questions",
    items: [
      {
        question: "How far in advance should I book?",
        answer: "For Ramadan, three to four months. Off-peak, six weeks is usually enough.",
      },
      {
        question: "Do you arrange the visa?",
        answer: "Yes, the visa is included and handled for you on every package.",
      },
    ],
  },
  stats: {
    heading: "",
    items: [
      { label: "Years running", figure: "12" },
      { label: "Travellers a year", figure: "40k" },
      { label: "Destinations", figure: "18" },
      { label: "Repeat customers", figure: "63%" },
    ],
  },
  testimonials: {
    heading: "What travellers say",
    items: [
      {
        quote: "Everything was handled. We turned up and focused on the worship.",
        name: "Aisha R.",
        detail: "Standard Umrah, March",
      },
      {
        quote: "The hotel really was two minutes from the Haram. That made the trip.",
        name: "Bilal K.",
        detail: "Group Hajj",
      },
      {
        quote: "Clear pricing, no surprises, and a guide who knew what he was doing.",
        name: "Fatima S.",
        detail: "Ramadan Umrah",
      },
    ],
  },
  section_nav: {
    heading: "On this page",
    items: ["What we collect", "How to reach us"],
  },
};

export const BLOCK_KEYS = Object.keys(BLOCK_PLACEHOLDERS) as FlexBlock["type"][];
