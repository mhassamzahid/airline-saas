"use client";

import { create } from "zustand";
import type { StepId, TripType, CabinId, FareId, Passengers, Extras, FlightOption } from "@/types";
import { flightFor, type DepartureWindowId } from "@/data/flights";
import { DEFAULT_ORIGIN } from "@/data/airports";
import { makeBookingRef } from "@/lib/utils";

export const STEPS: { id: StepId; label: string }[] = [
  { id: "destination", label: "Package" },
  { id: "whenwho", label: "When & who" },
  { id: "cabin", label: "Cabin" },
  { id: "departure", label: "Flights" },
  { id: "addons", label: "Extras" },
  { id: "review", label: "Review" },
];

export interface BookingState {
  currentStep: number;

  from: string;
  to: string | null;
  tripType: TripType;

  departDate?: string;
  returnDate?: string;

  passengers: Passengers;

  cabin: CabinId;

  outboundWindow: DepartureWindowId | null;
  inboundWindow: DepartureWindowId | null;
  outboundFlight: FlightOption | null;
  inboundFlight: FlightOption | null;

  fare: FareId;
  extras: Extras;

  contact: { name: string; email: string };

  fareHoldExpiresAt: number | null;
  heldRef: string | null;
}

interface BookingActions {
  goTo: (step: number) => void;
  next: () => void;
  back: () => void;

  setFrom: (code: string) => void;
  setTo: (code: string) => void;
  setTripType: (t: TripType) => void;

  setDepartDate: (iso?: string) => void;
  setReturnDate: (iso?: string) => void;

  setPassengers: (p: Partial<Passengers>) => void;
  setCabin: (c: CabinId) => void;

  setOutboundWindow: (w: DepartureWindowId) => void;
  setInboundWindow: (w: DepartureWindowId) => void;

  toggleAddon: (key: "legroom" | "ziyarat" | "guide" | "flex") => void;
  setCheckedBags: (n: number) => void;
  setCarbonOffset: (v: boolean) => void;

  setContact: (c: Partial<BookingState["contact"]>) => void;

  startFareHold: () => void;
  holdFare: () => void;
  reset: () => void;
}

const INITIAL: BookingState = {
  currentStep: 0,
  from: DEFAULT_ORIGIN.code,
  to: null,
  tripType: "return",
  departDate: undefined,
  returnDate: undefined,
  passengers: { adults: 1, children: 0, infants: 0 },
  cabin: "economy",
  outboundWindow: null,
  inboundWindow: null,
  outboundFlight: null,
  inboundFlight: null,
  fare: "value",
  extras: {
    checkedBags: 0,
    seatPref: "standard",
    meal: "standard",
    ziyarat: false,
    guide: false,
    carbonOffset: true,
  },
  contact: { name: "", email: "" },
  fareHoldExpiresAt: null,
  heldRef: null,
};

function syncFlights(s: BookingState): Partial<BookingState> {
  if (!s.to) return {};
  return {
    outboundFlight: s.outboundWindow ? flightFor(s.from, s.to, s.outboundWindow) : null,
    inboundFlight:
      s.tripType === "return" && s.inboundWindow
        ? flightFor(s.to, s.from, s.inboundWindow)
        : null,
  };
}

export const useBookingStore = create<BookingState & BookingActions>()((set, get) => ({
  ...INITIAL,

  goTo: (currentStep) =>
    set({ currentStep: Math.max(0, Math.min(STEPS.length - 1, currentStep)) }),
  next: () => {
    const nextIndex = Math.min(STEPS.length - 1, get().currentStep + 1);
    if (STEPS[nextIndex].id === "departure" && get().fareHoldExpiresAt === null) {
      set({ fareHoldExpiresAt: Date.now() + 10 * 60 * 1000 });
    }
    set({ currentStep: nextIndex });
  },
  back: () => set({ currentStep: Math.max(0, get().currentStep - 1) }),

  setFrom: (from) =>
    set((s) => {
      const next = { ...s, from, outboundWindow: null, inboundWindow: null };
      return { from, outboundWindow: null, inboundWindow: null, ...syncFlights(next) };
    }),
  setTo: (to) =>
    set((s) => {
      const next = { ...s, to, outboundWindow: null, inboundWindow: null };
      return { to, outboundWindow: null, inboundWindow: null, ...syncFlights(next) };
    }),
  setTripType: (tripType) =>
    set((s) => {
      const next = { ...s, tripType, inboundWindow: tripType === "oneway" ? null : s.inboundWindow };
      return {
        tripType,
        inboundWindow: next.inboundWindow,
        returnDate: tripType === "oneway" ? undefined : s.returnDate,
        ...syncFlights(next),
      };
    }),

  setDepartDate: (departDate) => set({ departDate }),
  setReturnDate: (returnDate) => set({ returnDate }),

  setPassengers: (p) => set((s) => ({ passengers: { ...s.passengers, ...p } })),
  setCabin: (cabin) => set({ cabin }),

  setOutboundWindow: (outboundWindow) =>
    set((s) => {
      const next = { ...s, outboundWindow };
      return { outboundWindow, ...syncFlights(next) };
    }),
  setInboundWindow: (inboundWindow) =>
    set((s) => {
      const next = { ...s, inboundWindow };
      return { inboundWindow, ...syncFlights(next) };
    }),

  toggleAddon: (key) =>
    set((s) => {
      if (key === "flex") return { fare: s.fare === "flex" ? "value" : "flex" };
      if (key === "legroom")
        return {
          extras: {
            ...s.extras,
            seatPref: s.extras.seatPref === "legroom" ? "standard" : "legroom",
          },
        };
      return { extras: { ...s.extras, [key]: !s.extras[key] } };
    }),
  setCheckedBags: (n) =>
    set((s) => ({ extras: { ...s.extras, checkedBags: Math.max(0, Math.min(5, n)) } })),
  setCarbonOffset: (carbonOffset) => set((s) => ({ extras: { ...s.extras, carbonOffset } })),

  setContact: (c) => set((s) => ({ contact: { ...s.contact, ...c } })),

  startFareHold: () =>
    set((s) =>
      s.fareHoldExpiresAt === null
        ? { fareHoldExpiresAt: Date.now() + 10 * 60 * 1000 }
        : s,
    ),

  holdFare: () => {
    const s = get();
    const seed =
      (s.to ? s.to.charCodeAt(0) * 131 + s.to.charCodeAt(1) * 17 : 999) +
      (s.departDate ? Number(s.departDate.replaceAll("-", "")) : 424242) +
      s.passengers.adults * 9001;
    set({ heldRef: makeBookingRef(seed) });
  },

  reset: () => set({ ...INITIAL }),
}));
