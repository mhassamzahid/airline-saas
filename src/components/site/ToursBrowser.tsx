"use client";

import { useMemo, useState } from "react";
import { X } from "@phosphor-icons/react";
import {
  TOUR_PACKAGES,
  TOUR_COUNTRIES,
  TOUR_GROUP_TYPES,
  TOUR_SEASONS,
  TOUR_DURATIONS,
  TOUR_PRICE_BANDS,
  type TourCountry,
  type TourGroupType,
  type TourSeason,
} from "@/data/tours";
import { TourCard } from "@/components/site/TourCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Sort = "price-asc" | "price-desc" | "duration-asc" | "az";

const SORTS: { value: Sort; label: string }[] = [
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "duration-asc", label: "Duration: shortest first" },
  { value: "az", label: "A to Z" },
];

function chipClass(active: boolean) {
  return cn(
    "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
    active
      ? "border-rust-700 bg-rust-700 text-on-rust"
      : "border-hairline-firm bg-canvas-soft text-body hover:bg-canvas",
  );
}

/** Archetype C: five clean AND-combined facets, all click-and-see -- no multi-step builder needed at this inventory size. */
export function ToursBrowser() {
  const [country, setCountry] = useState<TourCountry | "all">("all");
  const [groupType, setGroupType] = useState<TourGroupType | "all">("all");
  const [duration, setDuration] = useState<number | "all">("all");
  const [priceBand, setPriceBand] = useState<string>("all");
  const [season, setSeason] = useState<TourSeason | "all">("all");
  const [sort, setSort] = useState<Sort>("price-asc");

  const featured = useMemo(() => TOUR_PACKAGES.filter((p) => p.featured), []);

  const results = useMemo(() => {
    const band = priceBand === "all" ? null : TOUR_PRICE_BANDS.find((b) => b.label === priceBand);
    let list = TOUR_PACKAGES.filter((p) => {
      if (country !== "all" && p.country !== country) return false;
      if (groupType !== "all" && !p.groupTypes.includes(groupType)) return false;
      if (duration !== "all" && p.durationDays !== duration) return false;
      if (season !== "all" && p.season !== season) return false;
      if (band && (p.fromPriceGBP < band.min || p.fromPriceGBP > band.max)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.fromPriceGBP - b.fromPriceGBP;
      if (sort === "price-desc") return b.fromPriceGBP - a.fromPriceGBP;
      if (sort === "duration-asc") return a.durationDays - b.durationDays;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [country, groupType, duration, priceBand, season, sort]);

  function clearFilters() {
    setCountry("all");
    setGroupType("all");
    setDuration("all");
    setPriceBand("all");
    setSeason("all");
  }

  const hasFilters =
    country !== "all" || groupType !== "all" || duration !== "all" || priceBand !== "all" || season !== "all";

  return (
    <div>
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-[20px] text-ink">Featured this season</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <TourCard key={p.slug} p={p} />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline-firm pt-8">
        <h2 className="text-[20px] text-ink">All packages</h2>
        <label className="flex items-center gap-2 text-[13px] text-body">
          <span className="shrink-0 text-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort tour packages"
            className="field-input h-9 w-auto py-0 pr-8"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setCountry("all")} className={chipClass(country === "all")}>
          All countries
        </button>
        {TOUR_COUNTRIES.map((c) => (
          <button key={c} onClick={() => setCountry(c)} className={chipClass(country === c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={() => setGroupType("all")} className={chipClass(groupType === "all")}>
          Any traveller
        </button>
        {TOUR_GROUP_TYPES.map((g) => (
          <button key={g} onClick={() => setGroupType(g)} className={chipClass(groupType === g)}>
            {g}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-[13px] text-body">
          <span className="shrink-0 text-muted">Duration</span>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value === "all" ? "all" : Number(e.target.value))}
            aria-label="Filter by duration"
            className="field-input h-9 w-auto py-0 pr-8"
          >
            <option value="all">Any length</option>
            {TOUR_DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d} days
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
            {TOUR_PRICE_BANDS.map((b) => (
              <option key={b.label} value={b.label}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] text-body">
          <span className="shrink-0 text-muted">Season</span>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value as TourSeason | "all")}
            aria-label="Filter by travel season"
            className="field-input h-9 w-auto py-0 pr-8"
          >
            <option value="all">Any season</option>
            {TOUR_SEASONS.map((s) => (
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
            <TourCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-col items-center gap-4 rounded-[10px] border border-dashed border-hairline-firm bg-canvas-soft px-6 py-16 text-center">
          <p className="text-[15px] font-medium text-ink">No packages match those filters</p>
          <p className="max-w-[40ch] text-[13px] text-body">
            Try a different country, price range, or clear your filters.
          </p>
          {hasFilters && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              <X size={14} />
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
