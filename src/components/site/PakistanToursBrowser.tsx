"use client";

import { useMemo, useState } from "react";
import { X } from "@phosphor-icons/react";
import {
  PAKISTAN_TOUR_PACKAGES,
  PAKISTAN_REGIONS,
  PAKISTAN_TOUR_DURATIONS,
  PAKISTAN_PRICE_BANDS,
  TOUR_GROUP_TYPES,
  TOUR_SEASONS,
  type PakistanRegion,
  type TourGroupType,
  type TourSeason,
} from "@/data/pakistan-tours";
import { PakistanTourCard } from "@/components/site/PakistanTourCard";
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

/** Archetype C, scoped to domestic Pakistan destinations -- the same filter-driven pattern as `ToursBrowser`, kept as its own component since the facets (region vs. country) and card shape (region + Family/Honeymoon/Group tag) differ. */
export function PakistanToursBrowser() {
  const [region, setRegion] = useState<PakistanRegion | "all">("all");
  const [groupType, setGroupType] = useState<TourGroupType | "all">("all");
  const [duration, setDuration] = useState<number | "all">("all");
  const [priceBand, setPriceBand] = useState<string>("all");
  const [season, setSeason] = useState<TourSeason | "all">("all");
  const [sort, setSort] = useState<Sort>("price-asc");

  const featured = useMemo(() => PAKISTAN_TOUR_PACKAGES.filter((p) => p.featured), []);

  const results = useMemo(() => {
    const band = priceBand === "all" ? null : PAKISTAN_PRICE_BANDS.find((b) => b.label === priceBand);
    let list = PAKISTAN_TOUR_PACKAGES.filter((p) => {
      if (region !== "all" && p.region !== region) return false;
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
  }, [region, groupType, duration, priceBand, season, sort]);

  function clearFilters() {
    setRegion("all");
    setGroupType("all");
    setDuration("all");
    setPriceBand("all");
    setSeason("all");
  }

  const hasFilters =
    region !== "all" || groupType !== "all" || duration !== "all" || priceBand !== "all" || season !== "all";

  return (
    <div>
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-[20px] text-ink">Featured this season</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PakistanTourCard key={p.slug} p={p} />
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
            aria-label="Sort Pakistan tour packages"
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
        <button onClick={() => setRegion("all")} className={chipClass(region === "all")}>
          All regions
        </button>
        {PAKISTAN_REGIONS.map((r) => (
          <button key={r} onClick={() => setRegion(r)} className={chipClass(region === r)}>
            {r}
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
            {PAKISTAN_TOUR_DURATIONS.map((d) => (
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
            {PAKISTAN_PRICE_BANDS.map((b) => (
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
            <PakistanTourCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-col items-center gap-4 rounded-[10px] border border-dashed border-hairline-firm bg-canvas-soft px-6 py-16 text-center">
          <p className="text-[15px] font-medium text-ink">No packages match those filters</p>
          <p className="max-w-[40ch] text-[13px] text-body">
            Try a different region, price range, or clear your filters.
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
