"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { useBookingStore } from "@/store/useBookingStore";

interface StepFrameProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  canContinue?: boolean;
  nextLabel?: string;
  onNext?: () => void;
  /** Hide the built-in footer entirely (review step renders its own actions). */
  hideFooter?: boolean;
}

export function StepFrame({
  title,
  description,
  children,
  canContinue = true,
  nextLabel = "Continue",
  onNext,
  hideFooter = false,
}: StepFrameProps) {
  const next = useBookingStore((s) => s.next);
  const back = useBookingStore((s) => s.back);
  const currentStep = useBookingStore((s) => s.currentStep);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-[30px] leading-[1.15] text-ink">{title}</h1>
        {description && (
          <p className="mt-2 max-w-[58ch] text-[15px] text-body">{description}</p>
        )}
      </header>

      {children}

      {!hideFooter && (
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-hairline pt-5">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={back}>
              <ArrowLeft size={16} />
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button
            onClick={onNext ?? next}
            disabled={!canContinue}
          >
            {nextLabel}
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
