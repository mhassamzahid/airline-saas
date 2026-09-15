import Link from "next/link";
import { ArrowRight, CaretDown, Quotes } from "@phosphor-icons/react/dist/ssr";
import { Photo } from "@/components/ui/Photo";
import { QuickFilterWidget } from "@/components/site/QuickFilterWidget";
import { CinematicHero } from "@/components/site/CinematicHero";
import { FLEET_STATS } from "@/data/fleet";
import { stock } from "@/lib/img";
import { getHomePage, getSiteSettings, type CmsIconTextLink, type CmsTestimonial, type CmsFaq } from "@/lib/cms";
import { resolveIcon } from "@/lib/icons";
import { getUmrahCatalog } from "@/lib/packages";

const NAMED_UMRAH_TIERS = ["standard", "premium", "deluxe"];

// The homepage sets an absolute title (rather than relying on the root
// layout's "%s · {site title}" template) since "{site title}: Umrah, Hajj,
// and tours" reads as one composed headline, not a page name plus a suffix.
export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: `${site_title}: Umrah, Hajj, and tours`,
    description:
      "Build an Umrah package yourself, secure a Hajj place for the season, or browse international and Pakistan tours. One independent long-haul airline, three ways to book it.",
  };
}

// The CMS doesn't have real images uploaded for these yet, so category
// cards always use this local stock photo keyed by href rather than
// whatever (currently empty) image field comes back from Wagtail.
const CATEGORY_IMAGE_BY_HREF: Record<string, string> = {
  "/umrah": stock("photo-1513072064285-240f87fa81e8", 700, 860),
  "/hajj": stock("photo-1554794470-42d3cd193ecc", 700, 860),
  "/tours": stock("photo-1512453979798-5ea266f8880c", 700, 860),
  "/pakistan-tours": stock("photo-1603491656337-3b491147917c", 700, 860),
};

// Same photos as the category cards below, cropped wide and at a much
// higher resolution than the boxed card art -- this one runs the full
// viewport width (up to 2400px+ on a large monitor), so a portrait crop
// sized for a small card would upscale visibly.
const HERO_PHOTO_BY_HREF: Record<string, string> = {
  "/umrah": stock("photo-1513072064285-240f87fa81e8", 2400, 1350),
  "/hajj": stock("photo-1554794470-42d3cd193ecc", 2400, 1350),
  "/tours": stock("photo-1512453979798-5ea266f8880c", 2400, 1350),
  "/pakistan-tours": stock("photo-1603491656337-3b491147917c", 2400, 1350),
};

const FALLBACK_HERO = {
  heading: "Umrah, Hajj, and tours: one trusted place.",
  subheading:
    "Build an Umrah package yourself, secure a Hajj place for the season, or browse international and Pakistan tours, then track the price the whole way through.",
};

const FALLBACK_CATEGORIES: CmsIconTextLink[] = [
  {
    href: "/umrah",
    label: "Umrah",
    body: "Package, dates, cabin and extras: a few steps, price in view the whole way.",
    icon_name: "",
    image: null,
    action_label: "",
  },
  {
    href: "/hajj",
    label: "Hajj",
    body: "Fixed, quota'd packages for the season. Browse what's included and request a place.",
    icon_name: "",
    image: null,
    action_label: "",
  },
  {
    href: "/tours",
    label: "International Tours",
    body: "Guided tour packages across Turkey, Thailand, Dubai and more, filterable by country, price and season.",
    icon_name: "",
    image: null,
    action_label: "",
  },
  {
    href: "/pakistan-tours",
    label: "Pakistan Tours",
    body: "Domestic tour packages across Hunza, Swat, Murree and more, filterable by region and price.",
    icon_name: "",
    image: null,
    action_label: "",
  },
];

const FALLBACK_HIGHLIGHTS: CmsIconTextLink[] = [
  { href: "/visa-consultation", icon_name: "IdentificationCard", label: "Visa Consultation", body: "Document checks & tracking", image: null, action_label: "" },
  { href: "/air-ticketing", icon_name: "Ticket", label: "Air Ticketing", body: "Changes to a ticket you hold", image: null, action_label: "" },
  { href: "/other-services", icon_name: "Wrench", label: "Other Services", body: "Insurance, meet & greet, more", image: null, action_label: "" },
  { href: "/manage", icon_name: "ClipboardText", label: "Manage your trip", body: "Seats, bags, changes", image: null, action_label: "" },
];

const FALLBACK_TESTIMONIALS: CmsTestimonial[] = [
  {
    quote:
      "The package price didn't move between building it and paying for it. First time that's happened with an Umrah booking for us.",
    name: "Amina R.",
    detail: "Standard Umrah, LGW departure",
  },
  {
    quote:
      "Applied for our Hajj place through the Government Scheme. Clear deadline, clear quota, no surprises on what was included.",
    name: "Yusuf M.",
    detail: "Government Scheme Hajj",
  },
  {
    quote:
      "Booked the Swat Valley retreat for the whole family and had a visa question answered within a day through Visa Consultation. Made the whole thing much less stressful.",
    name: "Sana K.",
    detail: "Pakistan Tours",
  },
];

const FALLBACK_FAQS: CmsFaq[] = [
  {
    question: "What's included in an Umrah package?",
    answer:
      "Every tier includes flights to Jeddah, hotels in both Makkah and Madinah, and visa processing. Higher tiers add closer hotels, fewer nights, and more personal support.",
  },
  {
    question: "How do I apply for a Hajj place?",
    answer:
      "Open the package closest to your group size on the Hajj page and send an inquiry. Places are quota'd by season, so earlier applications have more choice.",
  },
  {
    question: "Can you help with my visa?",
    answer:
      "Yes, Visa Consultation checks your documents, tracks your application, and flags anything missing before it becomes a problem at the airport.",
  },
  {
    question: "Do you fly to Pakistan?",
    answer:
      "Yes, nonstop to Lahore, Karachi and Islamabad from our UK bases. Browse them on Pakistan Tours.",
  },
];

export default async function HomePage() {
  const [cms, { site_title }, umrahCatalog] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getUmrahCatalog(),
  ]);
  const umrahNamedTiers = umrahCatalog.packages.filter((p) => NAMED_UMRAH_TIERS.includes(p.id));

  const hero = {
    // The eyebrow is just the brand name -- follows the CMS site title unless
    // an editor typed a custom kicker into the hero_eyebrow field.
    eyebrow: cms?.hero_eyebrow || site_title,
    heading: cms?.hero_heading || FALLBACK_HERO.heading,
    subheading: cms?.hero_subheading || FALLBACK_HERO.subheading,
  };

  const categories =
    cms?.body.find((b) => b.type === "category_cards")?.value ?? FALLBACK_CATEGORIES;
  const heroPhotos = categories.map((c) => ({
    image: HERO_PHOTO_BY_HREF[c.href] ?? Object.values(HERO_PHOTO_BY_HREF)[0],
    alt: c.label,
  }));
  const cmsStats = cms?.body.find((b) => b.type === "stats")?.value;
  const stats = cmsStats
    ? cmsStats.map((s) => ({ label: s.label, value: s.figure }))
    : FLEET_STATS;
  const highlights =
    cms?.body.find((b) => b.type === "highlights")?.value ?? FALLBACK_HIGHLIGHTS;
  const testimonials =
    cms?.body.find((b) => b.type === "testimonials")?.value ?? FALLBACK_TESTIMONIALS;
  const faqs = cms?.body.find((b) => b.type === "faqs")?.value ?? FALLBACK_FAQS;

  return (
    <>
      {/* Hero: full-bleed, edge-to-edge -- the one place on the site the
          photography runs the whole width instead of sitting in a boxed
          panel beside the text, which is what every inner page's hero does. */}
      {/* Fills exactly what's left of the viewport below the navbar on
          first load (utility strip + 64px main bar = 96px from `sm` up,
          just the 64px bar below it) -- "full screen" on any device, not
          an arbitrary fixed band. */}
      <CinematicHero items={heroPhotos} className="min-h-[calc(100dvh-64px)] sm:min-h-[calc(100dvh-96px)]">
        <p className="overline mb-3 text-on-dark/70">{hero.eyebrow}</p>
        <h1 className="max-w-[20ch] text-[34px] leading-[1.05] text-on-dark sm:text-[44px] lg:text-[54px]">
          {hero.heading}
        </h1>
        <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-on-dark/85 sm:text-[16px]">
          {hero.subheading}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-full border border-on-dark/25 bg-on-dark/10 px-3.5 py-1.5 text-[12.5px] font-medium text-on-dark backdrop-blur-sm transition-colors hover:bg-on-dark/20"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </CinematicHero>

      <section className="mx-auto max-w-[1180px] px-5 pb-14 pt-10 sm:px-8 sm:pb-16 sm:pt-12">
        {/* Category cards: each leads straight into its own entry point */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group relative block overflow-hidden rounded-[12px] border border-hairline bg-canvas transition-all hover:-translate-y-1 hover:h-shadow-md"
            >
              <Photo
                src={CATEGORY_IMAGE_BY_HREF[c.href] ?? Object.values(CATEGORY_IMAGE_BY_HREF)[0]}
                alt=""
                className="aspect-[4/5] w-full"
              >
                <div
                  className="photo-caption absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(20,32,31,0.92) 0%, rgba(20,32,31,0.5) 34%, rgba(20,32,31,0.05) 62%)",
                  }}
                />
                <div className="photo-caption absolute inset-x-0 bottom-0 p-5 text-on-dark">
                  <h2 className="text-[19px] font-semibold leading-tight">{c.label}</h2>
                  <p className="mt-1.5 text-[13px] text-on-dark/80">{c.body}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-on-dark transition-transform group-hover:translate-x-0.5">
                    Start here
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Photo>
            </Link>
          ))}
        </div>

        {/* Quick-filter: the fast path into an Umrah package for a visitor who already knows their dates */}
        <div className="mt-6">
          <QuickFilterWidget packages={umrahNamedTiers} />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-hairline bg-canvas-soft">
        <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-[12px] text-muted">{s.label}</dt>
                <dd data-numeric className="mt-1 text-[24px] font-semibold text-ink">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Highlights: secondary nav layer into the Archetype-D pages + manage */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="text-[22px] text-ink">Alongside your trip</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {highlights.map((h) => {
            const HighlightIcon = resolveIcon(h.icon_name);
            return (
              <Link
                key={h.href}
                href={h.href}
                className="group flex flex-col gap-2.5 rounded-[10px] border border-hairline bg-canvas p-4 transition-all hover:-translate-y-0.5 hover:h-shadow-md"
              >
                {HighlightIcon && (
                  <HighlightIcon size={20} className="text-rust-700" weight="fill" />
                )}
                <span className="text-[14px] font-medium text-ink">{h.label}</span>
                <span className="text-[12px] text-muted">{h.body}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-hairline bg-canvas-soft">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16">
          <h2 className="text-[22px] text-ink">What travelling with us is like</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-[10px] border border-hairline bg-canvas p-5"
              >
                <Quotes size={20} weight="fill" className="text-rust-500" />
                <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-body">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 border-t border-hairline-firm pt-3">
                  <p className="text-[13px] font-medium text-ink">{t.name}</p>
                  <p className="text-[12px] text-muted">{t.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Content strip + FAQ */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[22px] text-ink">Common questions</h2>
          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-rust-700 hover:text-rust-600"
          >
            See all FAQs
            <ArrowRight size={13} />
          </Link>
        </div>
        <div className="mt-6 divide-y divide-hairline border-y border-hairline">
          {faqs.map((f) => (
            <details key={f.question} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.question}
                <CaretDown
                  size={16}
                  className="shrink-0 text-muted transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="max-w-[68ch] pb-4 text-[14px] leading-relaxed text-body">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
