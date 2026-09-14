"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { computeQuote, computeReadiness } from "@/lib/quote";
import type { Quote } from "@/types";

export function useQuote(): Quote {
  // computeQuote is cheap and pure; recompute every render off the live store.
  const state = useBookingStore();
  return computeQuote(state);
}

export function useReadiness(): number {
  const state = useBookingStore();
  return computeReadiness(state);
}

/**
 * +1 when the traveller moved forward, -1 when they went back.
 * Uses React's sanctioned "adjust state during render" pattern.
 */
export function useStepDirection(currentStep: number) {
  const [prev, setPrev] = useState(currentStep);
  const [direction, setDirection] = useState<1 | -1>(1);

  if (prev !== currentStep) {
    setDirection(currentStep > prev ? 1 : -1);
    setPrev(currentStep);
  }

  return direction;
}
