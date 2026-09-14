import { stock } from "@/lib/img";
import type { CategoryId, RoomSharingId, TransportTierId, AdditionalServiceKey } from "@/types";

/** Visa processing, per adult. Children and infants are not charged. */
export const VISA_PRICE_GBP = 180;

export interface CategoryDef {
  id: CategoryId;
  name: string;
  strap: string;
  description: string;
}

/** Sets base expectations on hotel class and services included, before any
 * specific hotel or add-on is chosen. */
export const CATEGORIES: CategoryDef[] = [
  {
    id: "economy",
    name: "Economy",
    strap: "Everything you need, nothing you don't",
    description: "3-star hotels a short walk or shuttle from the Haram, shared transport, visa handled.",
  },
  {
    id: "standard",
    name: "Standard",
    strap: "The one most travellers choose",
    description: "4-star hotels closer to both mosques, a choice of room sharing, and priority visa processing.",
  },
  {
    id: "premium",
    name: "Premium",
    strap: "5-star, throughout",
    description: "5-star hotels within a few minutes' walk of the Haram, private transport, and a dedicated guide.",
  },
];

export function categoryById(id: CategoryId): CategoryDef {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export const DURATION_OPTIONS = [7, 10, 15, 21, 30] as const;
export type DurationOption = (typeof DURATION_OPTIONS)[number];

export interface HotelDef {
  id: string;
  name: string;
  city: "Makkah" | "Madinah";
  distance: string;
  stars: 3 | 4 | 5;
  pricePerNightGBP: number;
  /** Which categories this hotel is offered under. */
  categories: CategoryId[];
  image: string;
}

export const MAKKAH_HOTELS: HotelDef[] = [
  {
    id: "makkah-ajyad-heritage",
    name: "Ajyad Heritage Hotel",
    city: "Makkah",
    distance: "800m from the Haram",
    stars: 3,
    pricePerNightGBP: 45,
    categories: ["economy"],
    image: stock("photo-1591604129939-f1efa4d9f7fa", 900, 700),
  },
  {
    id: "makkah-zam-residence",
    name: "Zam Residence",
    city: "Makkah",
    distance: "450m from the Haram",
    stars: 4,
    pricePerNightGBP: 85,
    categories: ["economy", "standard"],
    image: stock("photo-1584186028062-637e3e77318d", 900, 700),
  },
  {
    id: "makkah-grand-plaza",
    name: "Makkah Grand Plaza",
    city: "Makkah",
    distance: "250m from the Haram",
    stars: 4,
    pricePerNightGBP: 120,
    categories: ["standard"],
    image: stock("photo-1650446647974-451d05d2136d", 900, 700),
  },
  {
    id: "makkah-al-haram-view",
    name: "Al Haram View Towers",
    city: "Makkah",
    distance: "100m from the Haram",
    stars: 5,
    pricePerNightGBP: 240,
    categories: ["premium"],
    image: stock("photo-1565330770968-0240c0046ce3", 900, 700),
  },
  {
    id: "makkah-kaaba-vista",
    name: "Kaaba Vista Suites",
    city: "Makkah",
    distance: "50m from the Haram",
    stars: 5,
    pricePerNightGBP: 310,
    categories: ["premium"],
    image: stock("photo-1591604129939-f1efa4d9f7fa", 900, 700),
  },
];

export const MADINAH_HOTELS: HotelDef[] = [
  {
    id: "madinah-ansar",
    name: "Al Ansar Courtyard",
    city: "Madinah",
    distance: "700m from the Masjid",
    stars: 3,
    pricePerNightGBP: 38,
    categories: ["economy"],
    image: stock("photo-1513072064285-240f87fa81e8", 900, 700),
  },
  {
    id: "madinah-rawdah",
    name: "Rawdah Hotel",
    city: "Madinah",
    distance: "350m from the Masjid",
    stars: 4,
    pricePerNightGBP: 75,
    categories: ["economy", "standard"],
    image: stock("photo-1591604129939-f1efa4d9f7fa", 900, 700),
  },
  {
    id: "madinah-taiba-grand",
    name: "Taiba Grand",
    city: "Madinah",
    distance: "200m from the Masjid",
    stars: 4,
    pricePerNightGBP: 105,
    categories: ["standard"],
    image: stock("photo-1650446647974-451d05d2136d", 900, 700),
  },
  {
    id: "madinah-nabawi-suites",
    name: "Al Masjid Nabawi Suites",
    city: "Madinah",
    distance: "80m from the Masjid",
    stars: 5,
    pricePerNightGBP: 210,
    categories: ["premium"],
    image: stock("photo-1584186028062-637e3e77318d", 900, 700),
  },
  {
    id: "madinah-rawdah-royal",
    name: "Rawdah Royal Residence",
    city: "Madinah",
    distance: "40m from the Masjid",
    stars: 5,
    pricePerNightGBP: 265,
    categories: ["premium"],
    image: stock("photo-1513072064285-240f87fa81e8", 900, 700),
  },
];

export function hotelById(id: string): HotelDef | undefined {
  return [...MAKKAH_HOTELS, ...MADINAH_HOTELS].find((h) => h.id === id);
}

export interface RoomSharingDef {
  id: RoomSharingId;
  label: string;
  note: string;
  /** How many travellers split the cost of one room-night. */
  divisor: number;
}

export const ROOM_SHARING: RoomSharingDef[] = [
  { id: "quad", label: "Quad sharing", note: "4 to a room, the lowest cost per person", divisor: 4 },
  { id: "triple", label: "Triple sharing", note: "3 to a room", divisor: 3 },
  { id: "double", label: "Double sharing", note: "2 to a room", divisor: 2 },
  { id: "single", label: "Single room", note: "The whole room to yourself", divisor: 1 },
];

export function roomSharingById(id: RoomSharingId): RoomSharingDef {
  return ROOM_SHARING.find((r) => r.id === id) ?? ROOM_SHARING[0];
}

export const AIRPORT_TRANSFER_PRICE_GBP = 25; // per person, one-way Jeddah/Madinah airport to hotel

export interface TransportTierDef {
  id: TransportTierId;
  label: string;
  note: string;
  /** Per person, for the whole Jeddah-Makkah-Madinah circuit. */
  priceGBP: number;
}

export const TRANSPORT_TIERS: TransportTierDef[] = [
  { id: "shared", label: "Shared coach", note: "Air-conditioned group coach between cities", priceGBP: 35 },
  { id: "private", label: "Private car", note: "A car for your party only", priceGBP: 110 },
  { id: "luxury", label: "Luxury SUV", note: "A premium vehicle, for a smaller party", priceGBP: 220 },
];

export function transportTierById(id: TransportTierId): TransportTierDef {
  return TRANSPORT_TIERS.find((t) => t.id === id) ?? TRANSPORT_TIERS[0];
}

export const ZIYARAT_PRICE_GBP = 45; // per person, one guided tour of the historical sites

export interface AdditionalServiceDef {
  key: AdditionalServiceKey;
  title: string;
  note: string;
  priceGBP: number;
  per: "person" | "booking" | "day";
}

export const ADDITIONAL_SERVICES: AdditionalServiceDef[] = [
  {
    key: "insurance",
    title: "Travel insurance",
    note: "Medical cover and trip protection for the whole party",
    priceGBP: 22,
    per: "person",
  },
  {
    key: "sim",
    title: "Local SIM card",
    note: "Data and calls from landing to departure",
    priceGBP: 12,
    per: "person",
  },
  {
    key: "laundry",
    title: "Laundry service",
    note: "Handled at the hotel every few days",
    priceGBP: 30,
    per: "booking",
  },
  {
    key: "guide",
    title: "Guide services",
    note: "A guide with your group for the rites, not shared",
    priceGBP: 60,
    per: "booking",
  },
  {
    key: "mealUpgrade",
    title: "Meal plan upgrade",
    note: "Half board upgraded to full board, both hotels",
    priceGBP: 18,
    per: "day",
  },
];

export function additionalServiceByKey(key: AdditionalServiceKey): AdditionalServiceDef {
  return ADDITIONAL_SERVICES.find((s) => s.key === key) as AdditionalServiceDef;
}

export interface PackageTierDef {
  id: "standard" | "premium" | "deluxe";
  name: string;
  strap: string;
  blurb: string;
  image: string;
  popular?: boolean;
  fromPriceGBP: number;
  /** Defaults applied when this tile is picked -- the traveller can still
   * change any of them in the steps that follow. */
  defaults: {
    category: CategoryId;
    durationDays: DurationOption;
    makkahHotelId: string;
    madinahHotelId: string;
    roomSharing: RoomSharingId;
    intercityTransport: TransportTierId;
    services?: Partial<Record<AdditionalServiceKey, boolean>>;
  };
  inclusions: string[];
}

/**
 * The three ready-made tiers shown on the landing screen. Picking one
 * pre-fills Category through Transport with sensible defaults; the customer
 * still walks the full 9-step flow and can change anything.
 */
export const PACKAGE_TIERS: PackageTierDef[] = [
  {
    id: "standard",
    name: "Standard",
    strap: "The one most families choose",
    blurb: "10 nights, 4-star hotels a short walk from both mosques, shared transport throughout.",
    image: stock("photo-1591604129939-f1efa4d9f7fa", 1200, 900),
    popular: true,
    fromPriceGBP: 1499,
    defaults: {
      category: "standard",
      durationDays: 10,
      makkahHotelId: "makkah-zam-residence",
      madinahHotelId: "madinah-rawdah",
      roomSharing: "quad",
      intercityTransport: "shared",
    },
    inclusions: [
      "Umrah visa processing",
      "4-star hotels in Makkah and Madinah, quad sharing",
      "Shared airport and intercity transport",
      "Group Ziyarat tour",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    strap: "A week, done properly",
    blurb: "7 nights, 5-star hotels within a few minutes of the Haram, private intercity transport, triple sharing.",
    image: stock("photo-1565330770968-0240c0046ce3", 1200, 900),
    fromPriceGBP: 2199,
    defaults: {
      category: "premium",
      durationDays: 7,
      makkahHotelId: "makkah-al-haram-view",
      madinahHotelId: "madinah-nabawi-suites",
      roomSharing: "triple",
      intercityTransport: "private",
    },
    inclusions: [
      "Everything in Standard",
      "5-star hotels within a few minutes of both Harams, triple sharing",
      "Private intercity transport",
      "Priority visa processing",
    ],
  },
  {
    id: "deluxe",
    name: "Deluxe",
    strap: "5-star, throughout",
    blurb: "7 nights, 5-star hotels within a few minutes of the Haram, a private guide, and every transfer handled.",
    image: stock("photo-1650446647974-451d05d2136d", 1200, 900),
    fromPriceGBP: 3499,
    defaults: {
      category: "premium",
      durationDays: 7,
      makkahHotelId: "makkah-al-haram-view",
      madinahHotelId: "madinah-nabawi-suites",
      roomSharing: "double",
      intercityTransport: "luxury",
      services: { guide: true },
    },
    inclusions: [
      "Everything in Premium",
      "5-star hotels within a few minutes of both Harams, double sharing",
      "Luxury private transport throughout",
      "A dedicated guide for the whole trip",
    ],
  },
];

export function packageTierById(id: string): PackageTierDef | undefined {
  return PACKAGE_TIERS.find((p) => p.id === id);
}
