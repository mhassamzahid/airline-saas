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
import { formatGBP, cn } from "@/lib/utils";

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

export function StepLanding() {
  const { pickPackage, catalog } = useBookingStore();
  const reduce = useReducedMotion();

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
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p variants={item} className="overline mb-3 text-muted">
          Umrah
        </motion.p>
        <motion.h1 variants={item} className="max-w-[22ch] text-[38px] leading-[1.05] text-ink sm:text-[48px]">
          Find your Umrah package
        </motion.h1>
        <motion.p variants={item} className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-body">
          Filter by duration, category, hotel and price to browse ready-made packages, or build
          your own from scratch if nothing here is an exact match. All prices are estimated until
          confirmed by our sales team.
        </motion.p>
      </motion.div>

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

        <p className="mt-5 text-[13px] text-muted" aria-live="polite">
          {results.length} package{results.length === 1 ? "" : "s"}
        </p>

        {results.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <PackageCard key={p.id} p={p} hotels={catalog.hotels} onSelect={() => pickPackage(p.id)} />
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-col items-center gap-4 rounded-[10px] border border-dashed border-hairline-firm bg-canvas-soft px-6 py-16 text-center">
            <p className="text-[15px] font-medium text-ink">No packages match those filters</p>
            <p className="max-w-[40ch] text-[13px] text-body">
              Try different filters, clear them, or build your own package below.
            </p>
            {hasFilters && (
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                <X size={14} />
                Clear filters
              </Button>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-col items-start gap-4 rounded-[12px] border-2 border-dashed border-hairline-firm bg-canvas-soft p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Sliders size={22} className="mt-0.5 shrink-0 text-rust-700" />
            <div>
              <h3 className="text-[16px] font-semibold text-ink">Can't find an exact match?</h3>
              <p className="mt-1 text-[13px] text-body">
                Build your own package from scratch: choose every hotel, transport option and
                add-on yourself.
              </p>
            </div>
          </div>
          <Button variant="secondary" className="w-full shrink-0 sm:w-auto" onClick={() => pickPackage("custom")}>
            Build your own
          </Button>
        </div>
      </div>
    </div>
  );
}
