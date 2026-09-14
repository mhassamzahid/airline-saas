export type StepId =
  | "landing"
  | "category"
  | "duration"
  | "travelers"
  | "visa"
  | "hotels"
  | "transport"
  | "services"
  | "review"
  | "submit";

export type CategoryId = "economy" | "standard" | "premium";

export type RoomSharingId = "quad" | "triple" | "double" | "single";

export type TransportTierId = "shared" | "private" | "luxury";

export type VisaChoice = "include" | "skip";

export type AdditionalServiceKey = "insurance" | "sim" | "laundry" | "guide" | "mealUpgrade";

/** Used by the /experience cabin showcase, independent of the Umrah booking flow. */
export type CabinId = "economy" | "premium" | "business" | "first";

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
  /** One-way economy base fare per adult, GBP, before cabin and taxes. */
  baseFareGBP: number;
}

export interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

export interface QuoteLine {
  id: string;
  label: string;
  detail?: string;
  amount: number;
}

export interface Quote {
  lines: QuoteLine[];
  total: number;
}
