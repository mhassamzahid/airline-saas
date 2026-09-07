"use client";

import { useEffect, useState } from "react";
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

/** Live mm:ss remaining on the held fare, plus a flag when it lapses. */
export function useFareHold() {
  const expiresAt = useBookingStore((s) => s.fareHoldExpiresAt);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (!expiresAt) return { active: false, label: "", remainingMs: 0, expired: false };

  const remainingMs = Math.max(0, expiresAt - now);
  const expired = remainingMs === 0;
  const total = Math.ceil(remainingMs / 1000);
  const mm = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const ss = (total % 60).toString().padStart(2, "0");

  return { active: true, label: `${mm}:${ss}`, remainingMs, expired };
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
