export type StepId =
  | "destination"
  | "whenwho"
  | "cabin"
  | "departure"
  | "addons"
  | "review";

export type TripType = "return" | "oneway";

export type CabinId = "economy" | "premium" | "business" | "first";

export type FareId = "lite" | "value" | "flex";

export type SeatPref = "standard" | "legroom";

export type MealPref = "standard" | "vegetarian" | "pescatarian" | "none";

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
  /** One-way economy base fare per adult, GBP, before cabin and taxes. */
  baseFareGBP: number;
}

export interface FlightLeg {
  code: string;
  time: string; // 24h HH:MM local
}

export interface FlightOption {
  id: string;
  flightNo: string;
  dep: FlightLeg;
  arr: FlightLeg & { dayOffset: number };
  durationMin: number;
  stops: number;
  stopAirport?: string;
  aircraft: string;
  /** Per-passenger price delta for choosing this departure, GBP. */
  priceGBP: number;
}

export interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

export interface Extras {
  checkedBags: number;
  seatPref: SeatPref;
  meal: MealPref;
  ziyarat: boolean;
  guide: boolean;
  carbonOffset: boolean;
}

export interface QuoteLine {
  id: string;
  label: string;
  detail?: string;
  amount: number;
}

export interface Quote {
  lines: QuoteLine[];
  taxes: number;
  total: number;
}
