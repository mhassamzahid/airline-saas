"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { formatGBP, cn } from "@/lib/utils";

interface RotatorItem {
  code: string;
  city: string;
  country: string;
  tagline: string;
  baseFareGBP: number;
  image: string;
}

interface PhotoRotatorProps {
  items: RotatorItem[];
  selected: string | null;
  onSelect: (code: string) => void;
  /** Per-passenger fare adjustment for the current origin, added to baseFareGBP. */
  adjustment?: number;
  intervalMs?: number;
  className?: string;
}

/**
 * The hero photo, but it's a slow-crossfading preview of the actual destinations
 * rather than one static mood shot; clicking it selects whichever city is showing.
 * Pauses on hover/focus; stops rotating entirely under reduced motion (shows the
 * first item, static).
 */
export function PhotoRotator({
  items,
  selected,
  onSelect,
  adjustment = 0,
  intervalMs = 4200,
  className,
}: PhotoRotatorProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [reduce, paused, items.length, intervalMs]);

  const current = items[Math.min(index, items.length - 1)];
  if (!current) return null;

  return (
    <div
      className={cn("relative aspect-[4/5] w-full overflow-hidden rounded-[10px] border border-hairline", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={current.code}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <PhotoCard
            name="destination"
            value={current.code}
            image={current.image}
            alt={`${current.city}, ${current.country}`}
            selected={selected === current.code}
            onSelect={() => onSelect(current.code)}
            imageAspect="h-full"
            className="h-full w-full rounded-none border-0"
            overlay={
              <div>
                <div aria-hidden="true" className="mb-2.5 flex gap-1.5">
                  {items.map((it) => (
                    <span
                      key={it.code}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        it.code === current.code ? "w-4 bg-on-dark" : "w-1.5 bg-on-dark/40",
                      )}
                    />
                  ))}
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[22px] font-semibold leading-tight text-on-dark">
                      {current.city}
                    </h3>
                    <p className="text-[13px] text-on-dark/75">{current.tagline}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] text-on-dark/60">from</p>
                    <p data-numeric className="text-[16px] font-semibold text-on-dark">
                      {formatGBP(current.baseFareGBP + adjustment)}
                    </p>
                  </div>
                </div>
              </div>
            }
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
