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

const SAMPLE_IMAGE = {
  id: 0,
  title: "Sample image",
  meta: {
    download_url:
      "https://images.unsplash.com/photo-1650446647974-451d05d2136d?auto=format&fit=crop&w=1200&h=800&q=70",
  },
};

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
  cta_band: {
    heading: "Ready to start planning?",
    body: "Tell us your dates and group size and we'll come back with options.",
    cta: { label: "Get a quote", href: "/manage" },
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
};

export const BLOCK_KEYS = Object.keys(BLOCK_PLACEHOLDERS) as FlexBlock["type"][];
