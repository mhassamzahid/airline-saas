"use client";

import { Check } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { STEPS, isPackageLocked, useBookingStore } from "@/store/useBookingStore";
import { cn } from "@/lib/utils";

export function ProgressRail() {
  const current = useBookingStore((s) => s.currentStep);
  const goTo = useBookingStore((s) => s.goTo);
  const locked = useBookingStore(isPackageLocked);

  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = locked ? i === 0 : i <= current;
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1">
              <button
                disabled={!clickable}
                onClick={() => goTo(i)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors",
                  clickable ? "cursor-pointer hover:bg-canvas" : "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "grid h-[22px] w-[22px] place-items-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors",
                    done && "border-rust-700 bg-rust-700 text-on-rust",
                    active && "border-rust-700 text-rust-700",
                    !done && !active && "border-hairline-firm text-faint",
                  )}
                >
                  {done ? <Check size={12} weight="bold" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[13px] font-medium sm:inline",
                    active ? "text-ink" : done ? "text-body" : "text-muted",
                  )}
                >
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span className="relative h-px flex-1 bg-hairline-firm">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-rust-500"
                    initial={false}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
