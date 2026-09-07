"use client";

import { motion } from "motion/react";
import { Check } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { CABINS } from "@/data/cabins";
import { destinationByCode } from "@/data/airports";
import { formatGBP } from "@/lib/utils";

export function StepCabin() {
  const { to, tripType, cabin, setCabin, next } = useBookingStore();
  const dest = to ? destinationByCode(to) : undefined;
  const directions = tripType === "return" ? 2 : 1;
  const base = dest?.baseFareGBP ?? 0;

  function pick(id: typeof cabin) {
    setCabin(id);
    window.setTimeout(next, 220);
  }

  return (
    <StepFrame
      title="Choose your cabin"
      description="Prices are per adult for the whole trip, before taxes. Change it later without losing your place."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CABINS.map((c, i) => {
          const fromPrice = base * c.multiplier * directions;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChoiceCard
                name="cabin"
                value={c.id}
                selected={cabin === c.id}
                onSelect={() => pick(c.id)}
                className="flex h-full flex-col p-5"
              >
                <div className="pr-6">
                  <h3 className="text-[17px] font-semibold text-ink">{c.name}</h3>
                  <p className="mt-0.5 text-[13px] text-muted">{c.strap}</p>
                  <p className="mt-3">
                    <span className="text-[12px] text-muted">from </span>
                    <span data-numeric className="text-[19px] font-semibold text-ink">
                      {formatGBP(fromPrice)}
                    </span>
                  </p>
                </div>
                <ul className="mt-4 space-y-1.5 border-t border-hairline pt-3">
                  {c.perks.map((perk) => (
                    <li key={perk} className="flex gap-2 text-[13px] text-body">
                      <Check size={15} weight="bold" className="mt-0.5 shrink-0 text-rust-600" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </ChoiceCard>
            </motion.div>
          );
        })}
      </div>
    </StepFrame>
  );
}
