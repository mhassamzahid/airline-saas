"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { DESTINATIONS, REGIONS, type Region } from "@/data/airports";
import { DestinationCard } from "@/components/site/DestinationCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Sort = "price-asc" | "price-desc" | "az";

const SORTS: { value: Sort; label: string }[] = [
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "az", label: "A to Z" },
];

/** Archetype C: a handful of clean facets, all AND-combined, narrowing an already-small grid. No builder needed. */
export function DestinationsBrowser() {
  const [region, setRegion] = useState<Region | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("price-asc");

  const results = useMemo(() => {
    let list = DESTINATIONS.filter((d) => {
      if (region !== "all" && d.region !== region) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!d.city.toLowerCase().includes(q) && !d.country.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.baseFareGBP - b.baseFareGBP;
      if (sort === "price-desc") return b.baseFareGBP - a.baseFareGBP;
      return a.city.localeCompare(b.city);
    });
    return list;
  }, [region, query, sort]);

  const activeRegions = useMemo(
    () => REGIONS.filter((r) => DESTINATIONS.some((d) => d.region === r)),
    [],
  );

  function clearFilters() {
    setRegion("all");
    setQuery("");
  }

  const hasFilters = region !== "all" || query.trim().length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[280px]">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or country"
            aria-label="Search destinations"
            className="field-input pl-9"
          />
        </div>

        <label className="flex items-center gap-2 text-[13px] text-body">
          <span className="shrink-0 text-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort destinations"
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
        <button
          onClick={() => setRegion("all")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
            region === "all"
              ? "border-rust-700 bg-rust-700 text-on-rust"
              : "border-hairline-firm bg-canvas-soft text-body hover:bg-canvas",
          )}
        >
          All regions
        </button>
        {activeRegions.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              region === r
                ? "border-rust-700 bg-rust-700 text-on-rust"
                : "border-hairline-firm bg-canvas-soft text-body hover:bg-canvas",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <p className="mt-5 text-[13px] text-muted" aria-live="polite">
        {results.length} destination{results.length === 1 ? "" : "s"}
      </p>

      {results.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((d) => (
            <DestinationCard key={d.code} d={d} />
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-col items-center gap-4 rounded-[10px] border border-dashed border-hairline-firm bg-canvas-soft px-6 py-16 text-center">
          <p className="text-[15px] font-medium text-ink">No destinations match those filters</p>
          <p className="max-w-[40ch] text-[13px] text-body">
            Try a different region, or clear the search to see everywhere we fly.
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
