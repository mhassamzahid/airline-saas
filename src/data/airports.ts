import type { Airport } from "@/types";
import { stock } from "@/lib/img";

export interface Origin extends Airport {
  /** One-way economy adjustment vs. the primary base, GBP per adult. */
  adjustmentGBP: number;
  note: string;
}

/**
 * Where Halcyon flies from. A short list for now, growing as we add bases.
 * The first entry is the primary base and the default selection.
 */
export const ORIGINS: Origin[] = [
  {
    code: "LGW", city: "London", name: "London Gatwick", country: "United Kingdom",
    baseFareGBP: 0, adjustmentGBP: 0,
    note: "Our main base. Every route below flies nonstop from here.",
  },
  {
    code: "MAN", city: "Manchester", name: "Manchester Airport", country: "United Kingdom",
    baseFareGBP: 0, adjustmentGBP: 18,
    note: "Our newest base, a smaller schedule to start.",
  },
  {
    code: "EDI", city: "Edinburgh", name: "Edinburgh Airport", country: "United Kingdom",
    baseFareGBP: 0, adjustmentGBP: 26,
    note: "Seasonal so far. More routes as demand grows.",
  },
];

export const DEFAULT_ORIGIN = ORIGINS[0];

export function originByCode(code: string): Origin | undefined {
  return ORIGINS.find((o) => o.code === code);
}

export const REGIONS = [
  "North America",
  "South America",
  "Africa",
  "Middle East",
  "Asia",
  "Oceania",
  "Pakistan",
] as const;
export type Region = (typeof REGIONS)[number];

export interface Destination extends Airport {
  tagline: string;
  blurb: string;
  image: string;
  region: Region;
  popular?: boolean;
  /** The one destination given the wide hero tile on the destination step. */
  featured?: boolean;
  /** Where the flight itself actually lands, when it differs from `city` (a package/product name rather than a place, e.g. Umrah packages, which all fly to Jeddah). Defaults to `city`. */
  airportCity?: string;
}

/** Destinations Halcyon serves. baseFareGBP = one-way economy from the primary base (LGW), per adult. */
export const DESTINATIONS: Destination[] = [
  {
    code: "JFK", city: "New York", name: "John F. Kennedy Intl", country: "United States",
    baseFareGBP: 349, popular: true, region: "North America",
    tagline: "The classic crossing",
    blurb: "Daytime and overnight departures, both nonstop in about eight hours.",
    image: stock("photo-1496442226666-8d4d0e62e6e9"),
  },
  {
    code: "BOS", city: "Boston", name: "Logan Intl", country: "United States",
    baseFareGBP: 332, popular: false, region: "North America",
    tagline: "Shortest hop across",
    blurb: "Our quickest transatlantic sector, and the easiest jet lag to shake.",
    image: stock("photo-1522083165195-3424ed129620"),
  },
  {
    code: "YYZ", city: "Toronto", name: "Toronto Pearson", country: "Canada",
    baseFareGBP: 361, popular: false, region: "North America",
    tagline: "Gateway to the lakes",
    blurb: "A morning departure lands you with the afternoon still ahead of you.",
    image: stock("photo-1517090504586-fde19ea6066f"),
  },
  {
    code: "GRU", city: "São Paulo", name: "Guarulhos Intl", country: "Brazil",
    baseFareGBP: 512, popular: false, region: "South America",
    tagline: "Overnight to the southern hemisphere",
    blurb: "A single overnight sector, breakfast served before descent.",
    image: stock("photo-1543059080-f9b1272213d5"),
  },
  {
    code: "CPT", city: "Cape Town", name: "Cape Town Intl", country: "South Africa",
    baseFareGBP: 468, popular: true, region: "Africa",
    tagline: "Table Mountain by morning",
    blurb: "Leave in the evening, wake up to the Cape.",
    image: stock("photo-1580060839134-75a5edca2e99"),
  },
  {
    code: "DXB", city: "Dubai", name: "Dubai Intl", country: "United Arab Emirates",
    baseFareGBP: 298, popular: true, featured: true, region: "Middle East",
    tagline: "Our most frequent route",
    blurb: "Three departures a day, the shortest of them under seven hours.",
    image: stock("photo-1512453979798-5ea266f8880c"),
  },
  {
    code: "DEL", city: "Delhi", name: "Indira Gandhi Intl", country: "India",
    baseFareGBP: 377, popular: false, region: "Asia",
    tagline: "Into the subcontinent",
    blurb: "An overnight flight with a full night's sleep built into the schedule.",
    image: stock("photo-1587474260584-136574528ed5"),
  },
  {
    code: "SIN", city: "Singapore", name: "Changi", country: "Singapore",
    baseFareGBP: 541, popular: true, region: "Asia",
    tagline: "Thirteen hours, one film short of two",
    blurb: "Our longest daytime sector, timed to land you in the evening.",
    image: stock("photo-1525625293386-3f8f99389edd"),
  },
  {
    code: "HND", city: "Tokyo", name: "Haneda", country: "Japan",
    baseFareGBP: 604, popular: true, region: "Asia",
    tagline: "Straight into the city",
    blurb: "Haneda, not Narita, so you are downtown within the hour.",
    image: stock("photo-1540959733332-eab4deabeeaf"),
  },
  {
    code: "SYD", city: "Sydney", name: "Kingsford Smith", country: "Australia",
    baseFareGBP: 812, popular: false, region: "Oceania",
    tagline: "The long one",
    blurb: "One stop for fuel and a fresh crew, then on to the harbour.",
    image: stock("photo-1523059623039-a9ed027e7fad"),
  },
  {
    code: "LHE", city: "Lahore", name: "Allama Iqbal Intl", country: "Pakistan",
    baseFareGBP: 412, popular: true, region: "Pakistan",
    tagline: "The Badshahi skyline",
    blurb: "Two flights a week direct into Punjab's cultural capital.",
    image: stock("photo-1603491656337-3b491147917c"),
  },
  {
    code: "KHI", city: "Karachi", name: "Jinnah Intl", country: "Pakistan",
    baseFareGBP: 429, popular: true, region: "Pakistan",
    tagline: "Pakistan's coastal capital",
    blurb: "Our busiest Pakistan route, with an evening arrival most days.",
    image: stock("photo-1602740337312-e28c0b7d27f9"),
  },
  {
    code: "ISB", city: "Islamabad", name: "Islamabad Intl", country: "Pakistan",
    baseFareGBP: 419, popular: false, region: "Pakistan",
    tagline: "Beneath the Margalla Hills",
    blurb: "The most direct way into the capital and the north.",
    image: stock("photo-1635016288720-c52507b9a717"),
  },
];

export function destinationByCode(code: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.code === code);
}

/** Rough block time, primary base <-> destination, minutes. */
export const BLOCK_MINUTES: Record<string, number> = {
  JFK: 470, BOS: 445, YYZ: 460, GRU: 685, CPT: 700,
  DXB: 420, DEL: 525, SIN: 800, HND: 730, SYD: 1310,
  LHE: 420, KHI: 435, ISB: 415,
};
