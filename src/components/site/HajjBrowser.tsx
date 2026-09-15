"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "@phosphor-icons/react";
import { HAJJ_PACKAGES, HAJJ_PACKAGE_TYPES, type HajjPackage } from "@/data/hajj";
import { Photo } from "@/components/ui/Photo";
import { formatGBP } from "@/lib/utils";

type Sort = "type" | "price-asc" | "price-desc";

const SORTS: { value: Sort; label: string }[] = [
  { value: "type", label: "Package type" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function HajjCard({ p }: { p: HajjPackage }) {
  return (
    <Link
      href={`/hajj/${p.slug}`}
      className="group block overflow-hidden rounded-[12px] border border-hairline bg-canvas transition-all hover:-translate-y-1 hover:h-shadow-md"
    >
      <Photo src={p.image} alt={p.name} sizes="(min-width: 640px) 33vw, 100vw" className="aspect-[4/3] w-full">
        <div
          className="photo-caption absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(20,32,31,0.85) 0%, rgba(20,32,31,0.3) 32%, rgba(20,32,31,0) 55%)",
          }}
        />
        <div className="photo-caption absolute inset-x-0 bottom-0 p-4 text-on-dark">
          <span className="mb-2 inline-block rounded-full bg-on-dark/15 px-2.5 py-1 text-[11px] font-medium text-on-dark backdrop-blur-sm">
            {p.type}
          </span>
          <h3 className="text-[17px] font-semibold leading-tight">{p.name}</h3>
          <p className="mt-1 text-[12px] text-on-dark/80">{p.strap}</p>
        </div>
      </Photo>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[13px] text-body">
            <span data-numeric>{p.nights}</span> nights
          </span>
          <div className="text-right">
            <p className="text-[11px] text-muted">from</p>
            <p data-numeric className="text-[17px] font-semibold text-ink">
              {formatGBP(p.fromPriceGBP)}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-hairline pt-3">
          <span className="flex items-center gap-1.5 text-[12px] text-muted">
            <Clock size={13} />
            Apply {p.applicationDeadline}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-rust-700 transition-transform group-hover:translate-x-0.5">
            View details
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HajjBrowser() {
  const [sort, setSort] = useState<Sort>("type");

  const sorted = useMemo(() => {
    const list = [...HAJJ_PACKAGES];
    if (sort === "type") {
      list.sort((a, b) => HAJJ_PACKAGE_TYPES.indexOf(a.type) - HAJJ_PACKAGE_TYPES.indexOf(b.type));
    } else if (sort === "price-asc") {
      list.sort((a, b) => a.fromPriceGBP - b.fromPriceGBP);
    } else {
      list.sort((a, b) => b.fromPriceGBP - a.fromPriceGBP);
    }
    return list;
  }, [sort]);

  return (
    <div>
      <div className="flex justify-end">
        <label className="flex items-center gap-2 text-[13px] text-body">
          <span className="shrink-0 text-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort Hajj packages"
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

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p) => (
          <HajjCard key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
}
