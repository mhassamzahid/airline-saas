"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { ORIGINS, UMRAH_PACKAGES, DEFAULT_ORIGIN } from "@/data/airports";
import { Segmented } from "@/components/ui/Segmented";
import { Button } from "@/components/ui/Button";
import type { TripType } from "@/types";

/** Jumps straight into the Umrah builder pre-filled, skipping the section page — the homepage's fast path for a visitor who already knows which package they want. */
export function QuickFilterWidget() {
  const router = useRouter();
  const [from, setFrom] = useState(DEFAULT_ORIGIN.code);
  const [pkg, setPkg] = useState("");
  const [tripType, setTripType] = useState<TripType>("return");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ from, tripType });
    if (pkg) params.set("to", pkg);
    router.push(`/umrah?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 rounded-[14px] border border-hairline bg-canvas p-5 h-shadow-raised sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end sm:gap-3 sm:p-6"
    >
      <div>
        <label htmlFor="qf-from" className="field-label">From</label>
        <select
          id="qf-from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="field-input"
        >
          {ORIGINS.map((o) => (
            <option key={o.code} value={o.code}>
              {o.city} ({o.code})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="qf-package" className="field-label">Umrah package</label>
        <select
          id="qf-package"
          value={pkg}
          onChange={(e) => setPkg(e.target.value)}
          className="field-input"
        >
          <option value="">Not sure yet</option>
          {UMRAH_PACKAGES.map((p) => (
            <option key={p.code} value={p.code}>
              {p.city}
            </option>
          ))}
        </select>
      </div>

      <Segmented<TripType>
        ariaLabel="Trip type"
        value={tripType}
        onChange={setTripType}
        options={[
          { value: "return", label: "Return" },
          { value: "oneway", label: "One way" },
        ]}
        className="sm:h-11"
      />

      <Button type="submit" className="w-full sm:w-auto">
        <MagnifyingGlass size={15} />
        Build my package
      </Button>
    </form>
  );
}
