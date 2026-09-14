"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Sliders } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { PACKAGE_TIERS } from "@/data/umrah";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { formatGBP } from "@/lib/utils";

export function StepLanding() {
  const { packageTier, pickPackage } = useBookingStore();
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: reduce ? {} : { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      };

  return (
    <div>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p variants={item} className="overline mb-3 text-muted">
          Umrah
        </motion.p>
        <motion.h1 variants={item} className="max-w-[22ch] text-[38px] leading-[1.05] text-ink sm:text-[48px]">
          Choose your Umrah package
        </motion.h1>
        <motion.p variants={item} className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-body">
          Pick a ready-made tier to start from, or build your own from scratch.
          Every step after this stays open to change.
        </motion.p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PACKAGE_TIERS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(0.1 + i * 0.06, 0.4), ease: [0.16, 1, 0.3, 1] }}
          >
            <PhotoCard
              name="package-tier"
              value={p.id}
              image={p.image}
              alt={p.name}
              selected={packageTier === p.id}
              onSelect={() => pickPackage(p.id)}
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
                      <h3 className="text-[22px] font-semibold leading-tight text-on-dark">{p.name}</h3>
                      <p className="text-[13px] text-on-dark/75">{p.strap}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] text-on-dark/60">from</p>
                      <p data-numeric className="text-[18px] font-semibold text-on-dark">
                        {formatGBP(p.fromPriceGBP)}
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
          </motion.div>
        ))}

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <label
            className={
              "group relative flex h-full min-h-[200px] cursor-pointer flex-col items-start justify-center gap-3 rounded-[12px] border-2 border-dashed p-6 transition-all " +
              (packageTier === "custom"
                ? "is-selected bg-canvas"
                : "border-hairline-firm bg-canvas-soft hover:-translate-y-1 hover:bg-canvas hover:h-shadow-md")
            }
          >
            <input
              type="radio"
              name="package-tier"
              value="custom"
              checked={packageTier === "custom"}
              onChange={() => pickPackage("custom")}
              className="sr-only"
            />
            <Sliders size={24} className="text-rust-700" />
            <div>
              <h3 className="text-[18px] font-semibold text-ink">Build your own</h3>
              <p className="mt-1 text-[13px] text-body">
                Start from scratch and choose every hotel, transport option and
                add-on yourself.
              </p>
            </div>
          </label>
        </motion.div>
      </div>
    </div>
  );
}
