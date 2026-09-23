"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { STEPS, useBookingStore } from "@/store/useBookingStore";
import type { UmrahCatalog } from "@/lib/packages";
import type { CmsCatalogueLandingContent } from "@/lib/cms";
import { useStepDirection } from "@/lib/hooks";
import { ProgressRail } from "./ProgressRail";
import { FareSummary } from "./FareSummary";
import { MobileFareBar } from "./MobileFareBar";
import { StepLanding } from "@/components/steps/StepLanding";
import { StepCategory } from "@/components/steps/StepCategory";
import { StepDuration } from "@/components/steps/StepDuration";
import { StepTravelers } from "@/components/steps/StepTravelers";
import { StepVisa } from "@/components/steps/StepVisa";
import { StepHotels } from "@/components/steps/StepHotels";
import { StepTransport } from "@/components/steps/StepTransport";
import { StepServices } from "@/components/steps/StepServices";
import { StepReviewQuote } from "@/components/steps/StepReviewQuote";
import { StepSubmit } from "@/components/steps/StepSubmit";

const STEP_COMPONENTS = {
  landing: StepLanding,
  category: StepCategory,
  duration: StepDuration,
  travelers: StepTravelers,
  visa: StepVisa,
  hotels: StepHotels,
  transport: StepTransport,
  services: StepServices,
  review: StepReviewQuote,
  submit: StepSubmit,
} as const;

export function BookingShell({ catalog, landingContent }: { catalog: UmrahCatalog; landingContent: CmsCatalogueLandingContent | null }) {
  // Hydrate the store from the server-fetched catalog before the first paint
  // (not in a useEffect, which would flash the hardcoded fallback first).
  const hydrated = useRef(false);
  if (!hydrated.current) {
    useBookingStore.setState({ catalog });
    hydrated.current = true;
  }

  const currentStep = useBookingStore((s) => s.currentStep);
  const stepId = STEPS[currentStep].id;
  const isIntro = stepId === "landing";
  const reduce = useReducedMotion();
  const direction = useStepDirection(currentStep);
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [currentStep, reduce]);

  useEffect(() => {
    const tier = searchParams.get("package");
    const state = useBookingStore.getState();
    if (tier && (tier === "custom" || state.catalog.packages.some((p) => p.id === tier))) {
      state.pickPackage(tier);
    }
    // Prefill from a deep link (homepage quick-filter) once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const variants = reduce
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: { opacity: 0, x: 16 * direction },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 * direction },
      };

  return (
    <div className={isIntro ? "mx-auto max-w-[1180px] px-5 pb-32 sm:px-8 lg:pb-16" : "mx-auto max-w-[1180px] px-5 pt-8 pb-32 sm:px-8 lg:pb-16"}>
      {!isIntro && (
        <div className="mb-8 overflow-x-auto no-scrollbar">
          <div className="min-w-[720px] sm:min-w-0">
            <ProgressRail />
          </div>
        </div>
      )}

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
              {stepId === "landing" ? (
                <StepLanding landingContent={landingContent} />
              ) : (() => {
                const Step = STEP_COMPONENTS[stepId];
                return <Step />;
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {!isIntro && <FareSummary />}
      </div>

      {!isIntro && <MobileFareBar />}
    </div>
  );
}
