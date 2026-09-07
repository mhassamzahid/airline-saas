import Link from "next/link";
import {
  ArrowRight,
  CaretDown,
  IdentificationCard,
  Ticket,
  Wrench,
  ClipboardText,
  Quotes,
} from "@phosphor-icons/react/dist/ssr";
import { Photo } from "@/components/ui/Photo";
import { QuickFilterWidget } from "@/components/site/QuickFilterWidget";
import { FLEET_STATS } from "@/data/fleet";
import { stock } from "@/lib/img";

export const metadata = {
  title: "Umrah, Hajj and tours",
  description:
    "Build an Umrah package yourself, secure a Hajj place for the season, or browse international and Pakistan tours. One independent long-haul airline, three ways to book it.",
};

const CATEGORIES = [
  {
    href: "/umrah",
    label: "Umrah",
    body: "Package, dates, cabin and extras — a few steps, price in view the whole way.",
    image: stock("photo-1513072064285-240f87fa81e8", 700, 860),
  },
  {
    href: "/hajj",
    label: "Hajj",
    body: "Fixed, quota'd packages for the season. Browse what's included and request a place.",
    image: stock("photo-1554794470-42d3cd193ecc", 700, 860),
  },
  {
    href: "/tours",
    label: "International & Pakistan Tours",
    body: "Ten nonstop routes, filterable by region and price — including Lahore, Karachi and Islamabad.",
    image: stock("photo-1603491656337-3b491147917c", 700, 860),
  },
];

const HIGHLIGHTS = [
  { href: "/visa-consultation", icon: IdentificationCard, label: "Visa Consultation", body: "Document checks & tracking" },
  { href: "/air-ticketing", icon: Ticket, label: "Air Ticketing", body: "Changes to a ticket you hold" },
  { href: "/other-services", icon: Wrench, label: "Other Services", body: "Insurance, meet & greet, more" },
  { href: "/manage", icon: ClipboardText, label: "Manage your trip", body: "Seats, bags, changes" },
];

const TESTIMONIALS = [
  {
    quote:
      "The package price didn't move between building it and paying for it. First time that's happened with an Umrah booking for us.",
    name: "Amina R.",
    detail: "Standard Umrah, LGW departure",
  },
  {
    quote:
      "Applied for our Hajj place through the Group & Community package — one coordinator, one invoice, twenty-six of us kept together the whole trip.",
    name: "Yusuf M.",
    detail: "Group & community Hajj",
  },
  {
    quote:
      "Booked the Lahore tour and had a visa question answered within a day through Visa Consultation. Made the whole thing much less stressful.",
    name: "Sana K.",
    detail: "International & Pakistan Tours",
  },
];

const FAQS = [
  {
    q: "What's included in an Umrah package?",
    a: "Every tier includes flights to Jeddah, hotels in both Makkah and Madinah, and visa processing. Higher tiers add closer hotels, fewer nights, and more personal support.",
  },
  {
    q: "How do I apply for a Hajj place?",
    a: "Open the package closest to your group size on the Hajj page and send an inquiry. Places are quota'd by season, so earlier applications have more choice.",
  },
  {
    q: "Can you help with my visa?",
    a: "Yes — Visa Consultation checks your documents, tracks your application, and flags anything missing before it becomes a problem at the airport.",
  },
  {
    q: "Do you fly to Pakistan?",
    a: "Yes, nonstop to Lahore, Karachi and Islamabad from our UK bases — browse them on International & Pakistan Tours alongside our other routes.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
        <p className="overline mb-4">Halcyon</p>
        <h1 className="max-w-[20ch] text-[38px] leading-[1.05] text-ink sm:text-[54px]">
          Umrah, Hajj, and tours — one trusted place.
        </h1>
        <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-body">
          Build an Umrah package yourself, secure a Hajj place for the season,
          or browse international and Pakistan tours — then track the price
          the whole way through.
        </p>

        {/* Category cards — each leads straight into its own entry point */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group relative block overflow-hidden rounded-[12px] border border-hairline bg-canvas transition-all hover:-translate-y-1 hover:h-shadow-md"
            >
              <Photo src={c.image} alt="" className="aspect-[4/5] w-full">
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

        {/* Quick-filter — the fast path into an Umrah package for a visitor who already knows their dates */}
        <div className="mt-6">
          <QuickFilterWidget />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-hairline bg-canvas-soft">
        <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {FLEET_STATS.map((s) => (
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

      {/* Highlights — secondary nav layer into the Archetype-D pages + manage */}
      <section className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="text-[22px] text-ink">Alongside your trip</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <Link
              key={h.href}
              href={h.href}
              className="group flex flex-col gap-2.5 rounded-[10px] border border-hairline bg-canvas p-4 transition-all hover:-translate-y-0.5 hover:h-shadow-md"
            >
              <h.icon size={20} className="text-rust-700" weight="fill" />
              <span className="text-[14px] font-medium text-ink">{h.label}</span>
              <span className="text-[12px] text-muted">{h.body}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-hairline bg-canvas-soft">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16">
          <h2 className="text-[22px] text-ink">What travelling with us is like</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
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
          {FAQS.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <CaretDown
                  size={16}
                  className="shrink-0 text-muted transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="max-w-[68ch] pb-4 text-[14px] leading-relaxed text-body">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
