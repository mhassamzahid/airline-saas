"use client";

import { create } from "zustand";
import type {
  StepId,
  CategoryId,
  RoomSharingId,
  TransportTierId,
  VisaChoice,
  AdditionalServiceKey,
  Passengers,
} from "@/types";
import { type DurationOption, packageTierById } from "@/data/umrah";
import { makeBookingRef } from "@/lib/utils";

export const STEPS: { id: StepId; label: string }[] = [
  { id: "landing", label: "Package" },
  { id: "category", label: "Category" },
  { id: "duration", label: "Duration" },
  { id: "travelers", label: "Travellers" },
  { id: "visa", label: "Visa" },
  { id: "hotels", label: "Hotels" },
  { id: "transport", label: "Transport" },
  { id: "services", label: "Services" },
  { id: "review", label: "Review" },
  { id: "submit", label: "Submit" },
];

export type PackageTierChoice = "standard" | "premium" | "deluxe" | "custom";

export interface BookingState {
  currentStep: number;

  packageTier: PackageTierChoice | null;

  category: CategoryId;
  durationDays: DurationOption | "custom";
  customDurationDays: number | null;
  travelDate?: string; // ISO yyyy-mm-dd, preferred travel date

  passengers: Passengers;

  visaChoice: VisaChoice;

  makkahHotelId: string | null;
  madinahHotelId: string | null;
  roomSharing: RoomSharingId;

  airportTransfer: boolean;
  intercityTransport: TransportTierId;
  ziyarat: boolean;

  services: Record<AdditionalServiceKey, boolean>;

  contact: { name: string; phone: string; email: string };
  submittedRef: string | null;
}

interface BookingActions {
  goTo: (step: number) => void;
  next: () => void;
  back: () => void;

  pickPackage: (tier: PackageTierChoice) => void;

  setCategory: (c: CategoryId) => void;
  setDuration: (d: DurationOption | "custom") => void;
  setCustomDurationDays: (n: number) => void;
  setTravelDate: (iso?: string) => void;

  setPassengers: (p: Partial<Passengers>) => void;

  setVisaChoice: (v: VisaChoice) => void;

  setMakkahHotel: (id: string) => void;
  setMadinahHotel: (id: string) => void;
  setRoomSharing: (id: RoomSharingId) => void;

  setAirportTransfer: (v: boolean) => void;
  setIntercityTransport: (id: TransportTierId) => void;
  setZiyarat: (v: boolean) => void;

  toggleService: (key: AdditionalServiceKey) => void;

  setContact: (c: Partial<BookingState["contact"]>) => void;
  submitInquiry: () => void;

  reset: () => void;
}

const INITIAL: BookingState = {
  currentStep: 0,
  packageTier: null,
  category: "standard",
  durationDays: 10,
  customDurationDays: null,
  travelDate: undefined,
  passengers: { adults: 1, children: 0, infants: 0 },
  visaChoice: "include",
  makkahHotelId: null,
  madinahHotelId: null,
  roomSharing: "quad",
  airportTransfer: true,
  intercityTransport: "shared",
  ziyarat: false,
  services: {
    insurance: false,
    sim: false,
    laundry: false,
    guide: false,
    mealUpgrade: false,
  },
  contact: { name: "", phone: "", email: "" },
  submittedRef: null,
};

export const useBookingStore = create<BookingState & BookingActions>()((set, get) => ({
  ...INITIAL,

  goTo: (currentStep) =>
    set({ currentStep: Math.max(0, Math.min(STEPS.length - 1, currentStep)) }),
  next: () => set((s) => ({ currentStep: Math.min(STEPS.length - 1, s.currentStep + 1) })),
  back: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),

  pickPackage: (tier) => {
    const tierDef = tier === "custom" ? undefined : packageTierById(tier);
    set((s) => ({
      packageTier: tier,
      ...(tierDef && {
        category: tierDef.defaults.category,
        durationDays: tierDef.defaults.durationDays,
        makkahHotelId: tierDef.defaults.makkahHotelId,
        madinahHotelId: tierDef.defaults.madinahHotelId,
        roomSharing: tierDef.defaults.roomSharing,
        intercityTransport: tierDef.defaults.intercityTransport,
        services: { ...s.services, ...tierDef.defaults.services },
      }),
      currentStep: 1,
    }));
  },

  setCategory: (category) => set({ category }),
  setDuration: (durationDays) => set({ durationDays }),
  setCustomDurationDays: (n) => set({ customDurationDays: Math.max(1, n) }),
  setTravelDate: (travelDate) => set({ travelDate }),

  setPassengers: (p) => set((s) => ({ passengers: { ...s.passengers, ...p } })),

  setVisaChoice: (visaChoice) => set({ visaChoice }),

  setMakkahHotel: (makkahHotelId) => set({ makkahHotelId }),
  setMadinahHotel: (madinahHotelId) => set({ madinahHotelId }),
  setRoomSharing: (roomSharing) => set({ roomSharing }),

  setAirportTransfer: (airportTransfer) => set({ airportTransfer }),
  setIntercityTransport: (intercityTransport) => set({ intercityTransport }),
  setZiyarat: (ziyarat) => set({ ziyarat }),

  toggleService: (key) =>
    set((s) => ({ services: { ...s.services, [key]: !s.services[key] } })),

  setContact: (c) => set((s) => ({ contact: { ...s.contact, ...c } })),
  submitInquiry: () => {
    const s = get();
    const seed =
      s.contact.name.length * 131 +
      s.contact.phone.length * 53 +
      s.contact.email.length * 17 +
      s.passengers.adults * 9001;
    set({ submittedRef: makeBookingRef(seed) });
  },

  reset: () => set({ ...INITIAL }),
}));

export function effectiveDurationDays(s: Pick<BookingState, "durationDays" | "customDurationDays">): number {
  return s.durationDays === "custom" ? (s.customDurationDays ?? 10) : s.durationDays;
}
