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
import {
  type DurationOption,
  CATEGORIES,
  MAKKAH_HOTELS,
  MADINAH_HOTELS,
  ROOM_SHARING,
  TRANSPORT_TIERS,
  ADDITIONAL_SERVICES,
  UMRAH_PACKAGES,
  VISA_PRICE_GBP,
  AIRPORT_TRANSFER_PRICE_GBP,
  ZIYARAT_PRICE_GBP,
} from "@/data/umrah";
import type { UmrahCatalog } from "@/lib/packages";
import { makeBookingRef } from "@/lib/utils";

/** Hardcoded fallback, used until `hydrateCatalog` replaces it with the DB-backed catalog fetched server-side in `/umrah/page.tsx`. */
const FALLBACK_CATALOG: UmrahCatalog = {
  categories: CATEGORIES,
  hotels: [...MAKKAH_HOTELS, ...MADINAH_HOTELS],
  roomSharingOptions: ROOM_SHARING,
  transportTiers: TRANSPORT_TIERS,
  addOnServices: ADDITIONAL_SERVICES,
  pricing: {
    visaPriceGBP: VISA_PRICE_GBP,
    airportTransferPriceGBP: AIRPORT_TRANSFER_PRICE_GBP,
    ziyaratPriceGBP: ZIYARAT_PRICE_GBP,
  },
  packages: UMRAH_PACKAGES,
};

/** A fixed package is fully pre-filled, so every step but the first (where a
 * traveller can pick a different package, or "Build your own" to unlock the
 * rest) is closed to editing via the rail or an in-step Back button. */
export function isPackageLocked(s: Pick<BookingState, "packageTier">): boolean {
  return s.packageTier !== null && s.packageTier !== "custom";
}

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

/** Any `UMRAH_PACKAGES` id, or "custom" for the step-by-step builder. */
export type PackageTierChoice = string;

export interface BookingState {
  currentStep: number;

  /** DB-backed catalog (categories, hotels, packages, pricing, ...), hydrated
   * once from the server-fetched data via `hydrateCatalog`. Starts as the
   * hardcoded fallback so the wizard works before hydration runs. */
  catalog: UmrahCatalog;

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

  /** Replaces the fallback catalog with the DB-backed one, fetched server-side and passed down once on mount. */
  hydrateCatalog: (catalog: UmrahCatalog) => void;

  reset: () => void;
}

const INITIAL: BookingState = {
  currentStep: 0,
  catalog: FALLBACK_CATALOG,
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

  goTo: (step) =>
    set((s) => {
      // Locked: only the landing step (to swap packages, or go custom) and
      // the current step itself (a no-op) are reachable.
      if (isPackageLocked(s) && step !== 0) return {};
      return { currentStep: Math.max(0, Math.min(STEPS.length - 1, step)) };
    }),
  next: () => set((s) => ({ currentStep: Math.min(STEPS.length - 1, s.currentStep + 1) })),
  back: () =>
    set((s) => ({
      currentStep: isPackageLocked(s) ? 0 : Math.max(0, s.currentStep - 1),
    })),

  pickPackage: (tier) => {
    set((s) => {
      const tierDef = tier === "custom" ? undefined : s.catalog.packages.find((p) => p.id === tier);
      return {
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
        // A fixed package is already fully specified -- jump straight to the
        // last step. Every earlier step still shows as done in the rail and
        // stays editable via goTo, so nothing is actually skipped, just not
        // clicked through. Custom starts at the first real step instead.
        currentStep: tierDef ? STEPS.length - 1 : 1,
      };
    });
  },

  hydrateCatalog: (catalog) => set({ catalog }),

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

  reset: () => set((s) => ({ ...INITIAL, catalog: s.catalog })),
}));

export function effectiveDurationDays(s: Pick<BookingState, "durationDays" | "customDurationDays">): number {
  return s.durationDays === "custom" ? (s.customDurationDays ?? 10) : s.durationDays;
}
