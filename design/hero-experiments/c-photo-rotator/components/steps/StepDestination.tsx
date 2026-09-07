"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { DESTINATIONS, originByCode } from "@/data/airports";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { PhotoRotator } from "@/components/ui/PhotoRotator";
import { OriginSelect } from "@/components/ui/OriginSelect";
import { Segmented } from "@/components/ui/Segmented";
import { Button } from "@/components/ui/Button";
import { formatGBP, cn } from "@/lib/utils";
import type { TripType } from "@/types";

/** Hero + one tidy row of two beneath it; the rest are one tap away. */
const VISIBLE_COUNT = 5;

export function StepDestination() {
  const { from, to, tripType, setFrom, setTo, setTripType, next } = useBookingStore();
  const origin = originByCode(from);
  const adjustment = origin?.adjustmentGBP ?? 0;
  const reduce = useReducedMotion();
  const [showAll, setShowAll] = useState(false);

  const featured = DESTINATIONS.find((d) => d.featured) ?? DESTINATIONS[0];
  const rest = DESTINATIONS.filter((d) => d.code !== featured.code);
  const visible = showAll ? rest : rest.slice(0, VISIBLE_COUNT);
  const hiddenCount = rest.length - VISIBLE_COUNT;

  function pick(code: string) {
    setTo(code);
    window.setTimeout(next, 220);
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: reduce
        ? {}
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      };

  return (
    <div>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="overline mb-3">
            Nonstop from the UK
          </motion.p>
          <motion.h1 variants={item} className="text-[38px] leading-[1.05] text-ink sm:text-[50px]">
            Where are you headed?
          </motion.h1>
          <motion.p variants={item} className="mt-3 max-w-[46ch] text-[16px] text-body">
            Pick a city and we build the trip around it, keeping the price in view
            the whole way.
          </motion.p>

          <motion.div variants={item} className="mt-7 flex flex-wrap items-end gap-4">
            <div>
              <span id="from-label" className="field-label">From</span>
              <OriginSelect value={from} onChange={setFrom} labelId="from-label" />
            </div>
            <Segmented<TripType>
              ariaLabel="Trip type"
              value={tripType}
              onChange={setTripType}
              options={[
                { value: "return", label: "Return" },
                { value: "oneway", label: "One way" },
              ]}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block"
        >
          <PhotoRotator items={rest} selected={to} onSelect={pick} adjustment={adjustment} />
        </motion.div>
      </div>

      {/* Featured — the one destination that gets to be the hero */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8"
      >
        <PhotoCard
          name="destination"
          value={featured.code}
          image={featured.image}
          alt={`${featured.city}, ${featured.country}`}
          selected={to === featured.code}
          onSelect={() => pick(featured.code)}
          imageAspect="aspect-[16/9] sm:aspect-[21/9]"
          overlay={
            <div className="flex items-end justify-between gap-6">
              <div className="min-w-0">
                <span className="mb-2 inline-block rounded-full bg-on-dark/15 px-2.5 py-1 text-[12px] font-medium text-on-dark backdrop-blur-sm">
                  Most popular
                </span>
                <h3 className="text-[30px] font-semibold leading-[1.05] text-on-dark sm:text-[40px]">
                  {featured.city}
                </h3>
                <p className="mt-1.5 max-w-[52ch] text-[13px] text-on-dark/80 sm:text-[14px]">
                  {featured.blurb}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[11px] text-on-dark/60">from</p>
                <p data-numeric className="text-[22px] font-semibold text-on-dark sm:text-[26px]">
                  {formatGBP(featured.baseFareGBP + adjustment)}
                </p>
              </div>
            </div>
          }
        />
      </motion.div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {visible.map((d, i) => (
            <motion.div
              key={d.code}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: Math.min(0.15 + i * 0.04, 0.45), ease: [0.16, 1, 0.3, 1] }}
            >
              <PhotoCard
                name="destination"
                value={d.code}
                image={d.image}
                alt={`${d.city}, ${d.country}`}
                selected={to === d.code}
                onSelect={() => pick(d.code)}
                imageAspect="aspect-[5/6]"
                overlay={
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[22px] font-semibold leading-tight text-on-dark">
                        {d.city}
                      </h3>
                      <p className="text-[13px] text-on-dark/75">{d.tagline}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] text-on-dark/60">from</p>
                      <p data-numeric className="text-[16px] font-semibold text-on-dark">
                        {formatGBP(d.baseFareGBP + adjustment)}
                      </p>
                    </div>
                  </div>
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hiddenCount > 0 && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show fewer" : `Show all ${DESTINATIONS.length} destinations`}
            <CaretDown
              size={14}
              className={cn("transition-transform", showAll && "rotate-180")}
            />
          </Button>
        </div>
      )}
    </div>
  );
}
