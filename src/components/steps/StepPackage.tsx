"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useBookingStore } from "@/store/useBookingStore";
import { UMRAH_PACKAGES, originByCode } from "@/data/airports";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { Photo } from "@/components/ui/Photo";
import { OriginSelect } from "@/components/ui/OriginSelect";
import { Segmented } from "@/components/ui/Segmented";
import { formatGBP } from "@/lib/utils";
import { stock } from "@/lib/img";
import type { TripType } from "@/types";

export function StepPackage() {
  const { from, to, tripType, setFrom, setTo, setTripType, next } = useBookingStore();
  const origin = originByCode(from);
  const adjustment = origin?.adjustmentGBP ?? 0;
  const reduce = useReducedMotion();

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
      {/* Full-bleed hero: one atmospheric photo behind the whole header band,
          headline set in light type over a bottom scrim, the From + trip-type
          controls floating on a frosted panel. "Full-bleed" here means it fills
          the step's own content column edge to edge — the wizard's outer shell
          stays contained (max-w-[1180px]) rather than breaking to the true
          viewport edge, which would need restructuring BookingShell itself. */}
      <div className="relative min-h-[440px] overflow-hidden rounded-[10px] border border-hairline sm:min-h-[520px] lg:min-h-[580px]">
        <Photo
          src={stock("photo-1436491865332-7a61a109cc05", 1800, 1100)}
          alt="A wing above a layer of cloud, mid-journey"
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-dark/92 via-dark/35 to-transparent"
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative flex h-full min-h-[440px] flex-col justify-end p-6 sm:min-h-[520px] sm:p-10 lg:min-h-[580px] lg:p-14"
        >
          <motion.p variants={item} className="overline mb-3 text-on-dark/70">
            Flights to Jeddah, tailored packages
          </motion.p>
          <motion.h1
            variants={item}
            className="max-w-[17ch] text-[38px] leading-[1.03] text-on-dark sm:text-[54px]"
          >
            Choose your Umrah package
          </motion.h1>
          <motion.p variants={item} className="mt-3 max-w-[46ch] text-[16px] text-on-dark/85">
            Every tier includes flights, hotels in Makkah and Madinah, and visa
            processing — pick one and we build the trip around it.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-7 inline-flex w-fit flex-wrap items-end gap-4 rounded-[10px] border border-white/25 bg-canvas/92 p-4 shadow-[0_20px_50px_rgba(15,18,20,0.35)] backdrop-blur-md sm:p-5"
          >
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
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {UMRAH_PACKAGES.map((p, i) => (
          <motion.div
            key={p.code}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(0.1 + i * 0.06, 0.4), ease: [0.16, 1, 0.3, 1] }}
          >
            <PhotoCard
              name="package"
              value={p.code}
              image={p.image}
              alt={p.city}
              selected={to === p.code}
              onSelect={() => pick(p.code)}
              imageAspect="aspect-[4/3]"
              overlay={
                <div>
                  {p.popular && (
                    <span className="mb-2 inline-block rounded-full bg-on-dark/15 px-2.5 py-1 text-[11px] font-medium text-on-dark backdrop-blur-sm">
                      Most popular
                    </span>
                  )}
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[22px] font-semibold leading-tight text-on-dark">
                        {p.city}
                      </h3>
                      <p className="text-[13px] text-on-dark/75">
                        {p.nights} nights · {p.hotelDistance}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] text-on-dark/60">from</p>
                      <p data-numeric className="text-[18px] font-semibold text-on-dark">
                        {formatGBP(p.baseFareGBP + adjustment)}
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
