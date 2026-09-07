"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { STEPS, useBookingStore } from "@/store/useBookingStore";
import { originByCode, destinationByCode } from "@/data/airports";
import { useStepDirection } from "@/lib/hooks";
import { ProgressRail } from "./ProgressRail";
import { FareSummary } from "./FareSummary";
import { MobileFareBar } from "./MobileFareBar";
import { StepPackage } from "@/components/steps/StepPackage";
import { StepWhenWho } from "@/components/steps/StepWhenWho";
import { StepCabin } from "@/components/steps/StepCabin";
import { StepDeparture } from "@/components/steps/StepDeparture";
import { StepAddons } from "@/components/steps/StepAddons";
import { StepReview } from "@/components/steps/StepReview";

const STEP_COMPONENTS = {
  destination: StepPackage,
  whenwho: StepWhenWho,
  cabin: StepCabin,
  departure: StepDeparture,
  addons: StepAddons,
  review: StepReview,
} as const;

export function BookingShell() {
  const currentStep = useBookingStore((s) => s.currentStep);
  const stepId = STEPS[currentStep].id;
  const isIntro = stepId === "destination";
  const reduce = useReducedMotion();
  const direction = useStepDirection(currentStep);
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [currentStep, reduce]);

  useEffect(() => {
    const to = searchParams.get("to")?.toUpperCase();
    const from = searchParams.get("from")?.toUpperCase();
    const { setTo, setFrom } = useBookingStore.getState();
    if (from && originByCode(from)) setFrom(from);
    if (to && destinationByCode(to)) setTo(to);
    // Prefill from a deep link (destination page, homepage quick-filter) once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Step = STEP_COMPONENTS[stepId];

  const variants = reduce
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: { opacity: 0, x: 16 * direction },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 * direction },
      };

  return (
    <div className="mx-auto max-w-[1180px] px-5 pt-8 pb-32 sm:px-8 lg:pb-16">
      <div className="mb-8 overflow-x-auto no-scrollbar">
        <div className="min-w-[520px] sm:min-w-0">
          <ProgressRail />
        </div>
      </div>

      <div
        className={
          isIntro ? "" : "grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12"
        }
      >
        <div className="min-w-0 lg:w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={stepId}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className={
                isIntro
                  ? undefined
                  : "rounded-[16px] border border-hairline bg-canvas p-5 h-shadow-raised sm:p-8"
              }
            >
              <Step />
            </motion.div>
          </AnimatePresence>
        </div>

        {!isIntro && <FareSummary />}
      </div>

      {!isIntro && <MobileFareBar />}
    </div>
  );
}
