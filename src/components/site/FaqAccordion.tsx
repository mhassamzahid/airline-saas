"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Same open/close model as native <details> (each question toggles
 * independently, several can be open at once) but with an animated
 * height/opacity transition instead of a hard snap -- <details> can't be
 * animated smoothly across browsers without exactly this kind of swap-in.
 */
export function FaqAccordion({ faqs, className }: { faqs: FaqItem[]; className?: string }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const reduce = useReducedMotion();

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  return (
    <div className={cn("divide-y divide-hairline border-y border-hairline", className)}>
      {faqs.map((f, i) => {
        const isOpen = open.has(i);
        return (
          <div key={f.question} className="py-1">
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-medium text-ink"
            >
              {f.question}
              <CaretDown
                size={16}
                className={cn("shrink-0 text-muted transition-transform", isOpen && "rotate-180")}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[68ch] pb-4 text-[14px] leading-relaxed text-body">
                    {f.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
