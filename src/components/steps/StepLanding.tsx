"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, MapPinLine, Sliders, Star, X } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import {
  DURATION_OPTIONS,
  UMRAH_SEASONS,
  distanceMeters,
  type HotelDef,
  type PackageTierDef,
} from "@/data/umrah";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { stock } from "@/lib/img";
import { ProgressRail } from "@/components/booking/ProgressRail";
import { ServiceCta } from "@/components/site/ServicePage";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { formatGBP, cn } from "@/lib/utils";
import type { CmsCatalogueLandingContent } from "@/lib/cms";

// Relevant pilgrimage photography, cropped for the wide page banner.
const HERO_IMAGE = stock("photo-1513072064285-240f87fa81e8", 2000, 800);

interface Band {
  label: string;
  min: number;
  max: number;
}

const PRICE_BANDS: Band[] = [
  { label: "Under £1,500", min: 0, max: 1499 },
  { label: "£1,500 – £2,500", min: 1500, max: 2499 },
  { label: "£2,500 – £3,500", min: 2500, max: 3499 },
  { label: "£3,500+", min: 3500, max: Infinity },
];

const DISTANCE_BANDS: Band[] = [
  { label: "Under 200m", min: 0, max: 199 },
  { label: "200m – 500m", min: 200, max: 500 },
  { label: "500m+", min: 501, max: Infinity },
];

const STAR_OPTIONS = [3, 4, 5] as const;

function chipClass(active: boolean) {
  return cn(
    "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
    active
      ? "border-rust-700 bg-rust-700 text-on-rust"
      : "border-hairline-firm bg-canvas-soft text-body hover:bg-canvas",
  );
}

function PackageCard({
  p,
  hotels,
  onSelect,
}: {
  p: PackageTierDef;
  hotels: HotelDef[];
  onSelect: () => void;
}) {
  const makkahHotel = hotels.find((h) => h.id === p.defaults.makkahHotelId);
  return (
    <button type="button" onClick={onSelect} className="group block w-full text-left">
      <div className="overflow-hidden rounded-[12px] border border-hairline bg-canvas transition-all hover:-translate-y-1 hover:h-shadow-md">
        <Photo src={p.image} alt={p.name} sizes="(min-width: 640px) 33vw, 100vw" className="aspect-[4/3] w-full">
          <div
            className="photo-caption absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(20,32,31,0.85) 0%, rgba(20,32,31,0.3) 32%, rgba(20,32,31,0) 55%)",
            }}
          />
          <div className="photo-caption absolute inset-x-0 bottom-0 p-4 text-on-dark">
            {p.popular && (
              <span className="mb-2 inline-block rounded-full bg-on-dark/15 px-2.5 py-1 text-[11px] font-medium text-on-dark backdrop-blur-sm">
                Most popular
              </span>
            )}
            <h3 className="text-[17px] font-semibold leading-tight">{p.name}</h3>
            <p className="mt-1 text-[12px] text-on-dark/80">{p.strap}</p>
          </div>
        </Photo>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
            <span className="flex items-center gap-1">
              <span data-numeric>{p.defaults.durationDays}</span> nights
            </span>
            {makkahHotel && (
              <span className="flex items-center gap-1">
                <MapPinLine size={12} /> {makkahHotel.distance}
              </span>
            )}
            {makkahHotel && (
              <span className="inline-flex items-center gap-0.5 text-rust-500">
                {Array.from({ length: makkahHotel.stars }).map((_, i) => (
                  <Star key={i} size={10} weight="fill" />
                ))}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
            <div>
              <p className="text-[11px] text-muted">Estimated from</p>
              <p data-numeric className="text-[17px] font-semibold text-ink">
                {formatGBP(p.fromPriceGBP)}
              </p>
            </div>
            <span className="flex items-center gap-1 text-[13px] font-medium text-rust-700 transition-transform group-hover:translate-x-0.5">
              Select <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// Shows the process instead of a picture: a dark tile with a miniature of the
// wizard's own progress rail, so it says what "build your own" involves. A flat
// dark block can't be mistaken for a missing photo, or for a package.
const BUILD_OWN_STEPS = ["Category", "Hotels", "Transport", "Add-ons"];

function BuildOwnCard({ onSelect }: { onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className="group flex h-full w-full text-left">
      <div className="flex w-full flex-col justify-between gap-6 rounded-[12px] border border-on-dark/10 bg-dark p-5 text-on-dark transition-all hover:-translate-y-1 hover:h-shadow-md">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-on-dark/10 px-2.5 py-1 text-[11px] font-medium">
            <Sliders size={11} /> Custom
          </span>
          <h3 className="mt-4 text-[26px] font-semibold leading-[1.1] tracking-[-0.01em]">Build your own</h3>
          <p className="mt-2 max-w-[32ch] text-[13px] leading-relaxed text-on-dark-mut">
            Nothing quite right? You choose every step, and the price builds as you go.
          </p>
          <ol className="mt-5">
            {BUILD_OWN_STEPS.map((step, i) => (
              <li key={step} className="relative flex items-center gap-3 py-1 text-[13px]">
                {i < BUILD_OWN_STEPS.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[9px] top-1/2 h-full w-px bg-on-dark/20" />
                )}
                <span
                  data-numeric
                  className={cn(
                    "relative z-10 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border text-[10px]",
                    i === 0 ? "border-rust-500 bg-rust-500 text-on-rust" : "border-on-dark/25 bg-dark text-on-dark-mut",
                  )}
                >
                  {i + 1}
                </span>
                <span className={i === 0 ? "text-on-dark" : "text-on-dark/80"}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-on-dark/10 pt-3">
          <div>
            <p className="text-[11px] text-on-dark-mut">Fully custom</p>
            <p className="text-[17px] font-semibold">No fixed price</p>
          </div>
          <span className="inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-on-dark px-4 text-[13px] font-medium text-dark transition-transform group-hover:translate-x-0.5">
            Start <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </button>
  );
}

export function StepLanding({ landingContent }: { landingContent: CmsCatalogueLandingContent | null }) {
  const { pickPackage, catalog } = useBookingStore();
  const reduce = useReducedMotion();
  const copy = (slot: string, fallback: { eyebrow: string; heading: string; body: string }) => {
    const section = landingContent?.sections.find(
      (item): item is Extract<CmsCatalogueLandingContent["sections"][number], { type: "copy" }> =>
        item.type === "copy" && item.value.slot === slot,
    );
    return section?.value ?? { slot, ...fallback };
  };
  const builderCopy = copy("builder_intro", {
    eyebrow: "Build your package",
    heading: "Choose a starting point",
    body: "Filter ready-made options or build your own Umrah package step by step.",
  });
  const processCopy = copy("process_intro", {
    eyebrow: "How it works",
    heading: "From package choice to a clear quote",
    body: "The builder keeps your choices together and shows the estimate as you go.",
  });
  const faqSection = landingContent?.sections.find(
    (item): item is Extract<CmsCatalogueLandingContent["sections"][number], { type: "faq" }> =>
      item.type === "faq",
  );

  const [duration, setDuration] = useState<number | "all">("all");
  const [category, setCategory] = useState<string>("all");
  const [stars, setStars] = useState<number | "all">("all");
  const [distanceBand, setDistanceBand] = useState<string>("all");
  const [roomSharing, setRoomSharing] = useState<string>("all");
  const [priceBand, setPriceBand] = useState<string>("all");
  const [season, setSeason] = useState<string>("all");

  const results = useMemo(() => {
    const pBand = priceBand === "all" ? null : PRICE_BANDS.find((b) => b.label === priceBand);
    const dBand = distanceBand === "all" ? null : DISTANCE_BANDS.find((b) => b.label === distanceBand);
    return catalog.packages.filter((p) => {
      if (duration !== "all" && p.defaults.durationDays !== duration) return false;
      if (category !== "all" && p.defaults.category !== category) return false;
      const makkahHotel = catalog.hotels.find((h) => h.id === p.defaults.makkahHotelId);
      if (stars !== "all" && makkahHotel?.stars !== stars) return false;
      if (dBand && makkahHotel) {
        const meters = distanceMeters(makkahHotel.distance);
        if (meters < dBand.min || meters > dBand.max) return false;
      }
      if (roomSharing !== "all" && p.defaults.roomSharing !== roomSharing) return false;
      if (pBand && (p.fromPriceGBP < pBand.min || p.fromPriceGBP > pBand.max)) return false;
      if (season !== "all" && p.season !== season) return false;
      return true;
    });
  }, [catalog, duration, category, stars, distanceBand, roomSharing, priceBand, season]);

  function clearFilters() {
    setDuration("all");
    setCategory("all");
    setStars("all");
    setDistanceBand("all");
    setRoomSharing("all");
    setPriceBand("all");
    setSeason("all");
  }

  const hasFilters =
    duration !== "all" ||
    category !== "all" ||
    stars !== "all" ||
    distanceBand !== "all" ||
    roomSharing !== "all" ||
    priceBand !== "all" ||
    season !== "all";

  const container: Variants = {
    hidden: {},
    show: { transition: reduce ? {} : { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      };

  return (
    <div>
      {/* Full-width Umrah banner, matching the other inner-page heroes. */}
      <div className="relative left-1/2 flex min-h-[340px] w-screen -translate-x-1/2 items-center justify-center overflow-hidden bg-dark px-5 py-16 text-center sm:min-h-[416px] sm:px-8">
        <Photo
          src={landingContent?.hero_image?.url || HERO_IMAGE}
          alt={landingContent?.hero_image?.alt || "Pilgrims performing Umrah at the Grand Mosque"}
          unoptimized={Boolean(landingContent?.hero_image?.url)}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,32,.72),rgba(8,18,32,.46),rgba(8,18,32,.7))]" />
        <motion.header variants={container} initial="hidden" animate="show" className="relative z-10 mx-auto w-full max-w-[900px] text-on-dark">
          <motion.p variants={item} className="mb-3 text-[11px] font-semibold uppercase tracking-[.22em] text-white/75">{landingContent?.hero_eyebrow || "Umrah"}</motion.p>
          <motion.h1 variants={item} className="text-[34px] font-semibold leading-[1.1] text-white sm:text-[48px]">{landingContent?.hero_heading || "Find your Umrah package"}</motion.h1>
          <motion.p variants={item} className="mx-auto mt-4 max-w-[58ch] text-[15px] leading-relaxed text-white/85">
            {landingContent?.hero_subheading || "Filter by duration, category, hotel and price to browse ready-made packages, or build your own from scratch. Prices are estimates until confirmed by our team."}
          </motion.p>
          <motion.nav variants={item} aria-label="Breadcrumb" className="mt-5 text-[11px] font-medium uppercase tracking-[.18em] text-white/80">
            <span>Home</span><span className="mx-2 text-white/55">/</span><span>Umrah</span>
          </motion.nav>
          <motion.dl variants={item} className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-4">
            <div><dd data-numeric className="text-[20px] font-semibold text-white">{catalog.packages.length}</dd><dt className="mt-0.5 text-[12px] text-white/70">Ready-made packages</dt></div>
            <div><dd data-numeric className="text-[20px] font-semibold text-white">{catalog.categories.length}</dd><dt className="mt-0.5 text-[12px] text-white/70">Categories</dt></div>
            {catalog.packages.length > 0 && <div><dd data-numeric className="text-[20px] font-semibold text-white">{formatGBP(Math.min(...catalog.packages.map((p) => p.fromPriceGBP)))}</dd><dt className="mt-0.5 text-[12px] text-white/70">From</dt></div>}
          </motion.dl>
        </motion.header>
      </div>

      <section className="relative left-1/2 w-screen -translate-x-1/2 border-b border-hairline bg-canvas">
        <div className="mx-auto max-w-[1180px] overflow-x-auto px-5 py-4 no-scrollbar sm:px-8">
          <div className="min-w-[720px] sm:min-w-0"><ProgressRail /></div>
        </div>
      </section>

      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setDuration("all")} className={chipClass(duration === "all")}>
            Any duration
          </button>
          {DURATION_OPTIONS.map((d) => (
            <button key={d} onClick={() => setDuration(d)} className={chipClass(duration === d)}>
              {d} days
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={() => setCategory("all")} className={chipClass(category === "all")}>
            Any category
          </button>
          {catalog.categories.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.id)} className={chipClass(category === c.id)}>
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-[13px] text-body">
            <span className="shrink-0 text-muted">Hotel rating</span>
            <select
              value={stars}
              onChange={(e) => setStars(e.target.value === "all" ? "all" : Number(e.target.value))}
              aria-label="Filter by hotel rating"
              className="field-input h-9 w-auto py-0 pr-8"
            >
              <option value="all">Any rating</option>
              {STAR_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s} star
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-body">
            <span className="shrink-0 text-muted">Distance</span>
            <select
              value={distanceBand}
              onChange={(e) => setDistanceBand(e.target.value)}
              aria-label="Filter by distance from the Haram"
              className="field-input h-9 w-auto py-0 pr-8"
            >
              <option value="all">Any distance</option>
              {DISTANCE_BANDS.map((b) => (
                <option key={b.label} value={b.label}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-body">
            <span className="shrink-0 text-muted">Room type</span>
            <select
              value={roomSharing}
              onChange={(e) => setRoomSharing(e.target.value)}
              aria-label="Filter by room sharing type"
              className="field-input h-9 w-auto py-0 pr-8"
            >
              <option value="all">Any room type</option>
              {catalog.roomSharingOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-body">
            <span className="shrink-0 text-muted">Price</span>
            <select
              value={priceBand}
              onChange={(e) => setPriceBand(e.target.value)}
              aria-label="Filter by price range"
              className="field-input h-9 w-auto py-0 pr-8"
            >
              <option value="all">Any price</option>
              {PRICE_BANDS.map((b) => (
                <option key={b.label} value={b.label}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-body">
            <span className="shrink-0 text-muted">Month</span>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              aria-label="Filter by travel season"
              className="field-input h-9 w-auto py-0 pr-8"
            >
              <option value="all">Any month</option>
              {UMRAH_SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[13px] text-muted" aria-live="polite">
            {results.length} package{results.length === 1 ? "" : "s"}
          </p>
          {results.length === 0 && hasFilters && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              <X size={14} />
              Clear filters
            </Button>
          )}
        </div>
        {results.length === 0 && (
          <p className="mt-1 text-[13px] text-body">
            No packages match those filters — try different filters, clear them, or build your own
            below.
          </p>
        )}

        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PackageCard key={p.id} p={p} hotels={catalog.hotels} onSelect={() => pickPackage(p.id)} />
          ))}
          <BuildOwnCard onSelect={() => pickPackage("custom")} />
        </div>
      </div>

      <section className="relative left-1/2 mt-16 w-screen -translate-x-1/2 border-t border-hairline bg-canvas">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <p className="overline mb-3">{builderCopy.eyebrow}</p>
              <h2 className="max-w-[18ch] text-[26px] font-semibold leading-tight text-ink">{builderCopy.heading}</h2>
              <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-body">{builderCopy.body}</p>
            </div>
            <dl className="divide-y divide-hairline border-y border-hairline">
              <div className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:gap-5"><dt className="text-[14px] font-medium text-ink">Categories</dt><dd className="text-[13px] leading-relaxed text-body">{catalog.categories.map((c) => c.name).join(" · ")}</dd></div>
              <div className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:gap-5"><dt className="text-[14px] font-medium text-ink">Hotels</dt><dd className="text-[13px] leading-relaxed text-body">{catalog.hotels.length} options in Makkah and Madinah, with the listed rating and distance shown for each.</dd></div>
              <div className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:gap-5"><dt className="text-[14px] font-medium text-ink">Room sharing</dt><dd className="text-[13px] leading-relaxed text-body">{catalog.roomSharingOptions.map((r) => r.label).join(" · ")}</dd></div>
              <div className="grid gap-1 py-4 sm:grid-cols-[170px_1fr] sm:gap-5"><dt className="text-[14px] font-medium text-ink">Transport</dt><dd className="text-[13px] leading-relaxed text-body">{catalog.transportTiers.map((t) => t.label).join(" · ")}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="relative left-1/2 w-screen -translate-x-1/2 border-t border-hairline bg-canvas-soft">
        <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="overline mb-3">{processCopy.eyebrow}</p><h2 className="text-[24px] font-semibold text-ink">{processCopy.heading}</h2></div>
            <p className="max-w-[40ch] text-[13px] leading-relaxed text-body">{processCopy.body}</p>
          </div>
          <ol className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Choose a starting point", body: "Select a ready-made package or begin with Build your own." },
              { title: "Set dates and travellers", body: "Choose your duration, travel dates and party details." },
              { title: "Select the stay", body: "Choose hotels, room sharing and transport for your trip." },
              { title: "Review your estimate", body: "Check services and the itemised quote before submitting an enquiry." },
            ].map((step, i) => <li key={step.title} className="border-t border-hairline-firm pt-3"><span data-numeric className="text-[12px] font-semibold text-rust-700">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-2 text-[15px] font-semibold text-ink">{step.title}</h3><p className="mt-1.5 text-[13px] leading-relaxed text-body">{step.body}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="relative left-1/2 w-screen -translate-x-1/2 border-t border-hairline bg-canvas">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div><p className="overline mb-3">Questions</p><h2 className="text-[24px] font-semibold text-ink">{faqSection?.value.heading || "Umrah package questions"}</h2></div>
          <FaqAccordion faqs={faqSection?.value.items || [
            { question: "How is the estimate calculated?", answer: "It updates with your selected category, duration, hotels, room sharing, transport and any additional services. The review step shows the itemised estimate before you submit." },
            { question: "Can I change a ready-made package?", answer: "Yes. Selecting a package fills in its defaults, and you can continue through the builder to review or change the available choices." },
            { question: "Can I choose my own hotels?", answer: "Yes. The hotel step lists the available Makkah and Madinah options with their star rating and distance." },
            { question: "Does this builder book flights?", answer: "No. This builder estimates the Umrah ground-service package: hotels, visa processing, transport and optional services." },
          ]} />
        </div>
      </section>

      <ServiceCta
        heading="Can't find the right fit?"
        body="Tell us what you're after and we'll help you put together a package that matches it."
        label="Get in touch"
        href="/contact"
      />
    </div>
  );
}
