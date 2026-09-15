"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import type { PackageTierDef } from "@/data/umrah";
import { Button } from "@/components/ui/Button";

/** Jumps straight into the Umrah builder pre-filled, skipping the section page: the homepage's fast path for a visitor who already knows which package they want. */
export function QuickFilterWidget({ packages }: { packages: PackageTierDef[] }) {
  const router = useRouter();
  const [tier, setTier] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(tier ? `/umrah?package=${tier}` : "/umrah");
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 rounded-[14px] border border-hairline bg-canvas p-5 h-shadow-raised sm:grid-cols-[1fr_auto] sm:items-end sm:gap-3 sm:p-6"
    >
      <div>
        <label htmlFor="qf-package" className="field-label">Umrah package</label>
        <select
          id="qf-package"
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="field-input"
        >
          <option value="">Not sure yet</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        <MagnifyingGlass size={15} />
        Build my package
      </Button>
    </form>
  );
}
