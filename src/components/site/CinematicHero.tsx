"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

interface CinematicHeroItem {
  image: string;
  alt: string;
}

interface CinematicHeroProps {
  items: CinematicHeroItem[];
  intervalMs?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Full-bleed, edge-to-edge hero: a slow-crossfading photo band with the
 * heading overlaid on a dark scrim, rather than text beside a boxed photo
 * panel -- the shape every inner page's PageIntro/ServicePage hero uses.
 * Holds on the first photo under reduced motion.
 */
export function CinematicHero({ items, intervalMs = 5200, className, children }: CinematicHeroProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [reduce, items.length, intervalMs]);

  const current = items[Math.min(index, items.length - 1)];
  if (!current) return null;

  return (
    <div className={cn("relative flex w-full items-end overflow-hidden lg:items-center", className)}>
      <AnimatePresence initial={false}>
        <motion.div
          key={current.image}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Photo src={current.image} alt={current.alt} priority className="h-full w-full" />
        </motion.div>
      </AnimatePresence>

      {/* A flat dark wash across the whole photo, not just a bottom fade --
          real photography spikes bright in patches (a lit courtyard, white
          ihram), so the scrim never drops low enough for text to lose
          contrast wherever it happens to land. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,8,6,0.90) 0%, rgba(10,8,6,0.68) 45%, rgba(10,8,6,0.42) 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-10 pt-16 sm:px-8 sm:pb-14 lg:-translate-x-12">
        {children}
      </div>
    </div>
  );
}
