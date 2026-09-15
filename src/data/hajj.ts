import { stock } from "@/lib/img";

/**
 * How Hajj packages are grouped and browsed (per the brief): government-
 * allocated quota vs. two private tiers. Sorted in this fixed order wherever
 * "grouped by type" is shown, regardless of array order.
 */
export type HajjPackageType = "Government Scheme" | "Private Economy" | "Private Premium";
export const HAJJ_PACKAGE_TYPES: HajjPackageType[] = [
  "Government Scheme",
  "Private Economy",
  "Private Premium",
];

export interface HajjAccommodation {
  location: "Makkah" | "Madinah" | "Mina" | "Arafat";
  detail: string;
}

export interface HajjItineraryStep {
  title: string;
  body: string;
}

export interface HajjPackage {
  slug: string;
  name: string;
  type: HajjPackageType;
  strap: string;
  blurb: string;
  image: string;
  /** Extra photos for the detail page's gallery, beyond the hero image. */
  gallery: string[];
  nights: number;
  fromPriceGBP: number;
  quota: string;
  applicationDeadline: string;
  accommodation: HajjAccommodation[];
  transport: string;
  meals: string;
  guide: string;
  itinerary: HajjItineraryStep[];
}

const STANDARD_ITINERARY: HajjItineraryStep[] = [
  {
    title: "Arrival & Madinah",
    body: "Land in Jeddah or Madinah and settle in for a few days of prayer at Masjid an-Nabawi before the rites begin.",
  },
  {
    title: "Move to Makkah",
    body: "Transfer to Makkah, perform Umrah, and rest ahead of the 8th of Dhul Hijjah.",
  },
  {
    title: "Mina & Arafat",
    body: "Move to Mina on the 8th, spend the Day of Arafat in prayer on the 9th, then continue to Muzdalifah overnight.",
  },
  {
    title: "Jamarat & Eid",
    body: "Stone the Jamarat, sacrifice, and shave or trim hair to exit Ihram over the days of Eid al-Adha.",
  },
  {
    title: "Return to Makkah",
    body: "Perform Tawaf al-Ifadah and the farewell Tawaf before the journey home.",
  },
];

export const HAJJ_PACKAGES: HajjPackage[] = [
  {
    slug: "government-scheme",
    name: "Government Scheme Hajj",
    type: "Government Scheme",
    strap: "The regulated quota route",
    blurb:
      "Allocated through the government Hajj quota rather than a private operator: larger groups, a longer stay, and the lowest cost per place, with every stage handled by an accredited group leader.",
    image: stock("photo-1650446647974-451d05d2136d", 1200, 800),
    gallery: [
      stock("photo-1584186028062-637e3e77318d", 1200, 900),
      stock("photo-1513072064285-240f87fa81e8", 1200, 900),
      stock("photo-1591604129939-f1efa4d9f7fa", 1200, 900),
    ],
    nights: 35,
    fromPriceGBP: 4200,
    quota: "500 places",
    applicationDeadline: "4 months before the season",
    accommodation: [
      { location: "Makkah", detail: "Shared government-allocated housing, around 1.2km from the Haram" },
      { location: "Madinah", detail: "Shared housing, around 900m from Masjid an-Nabawi" },
      { location: "Mina", detail: "Government-allocated tents, shared with the wider group" },
      { location: "Arafat", detail: "Shared canopy camp, allocated by zone" },
    ],
    transport: "Government-organised coach transfers between all sites",
    meals: "Full board, standard set menu",
    guide: "A government-appointed group leader shared across the wider party",
    itinerary: STANDARD_ITINERARY,
  },
  {
    slug: "private-economy",
    name: "Private Economy Hajj",
    type: "Private Economy",
    strap: "The one most pilgrims choose",
    blurb:
      "A private-operator package at a shorter duration than the government route: closer hotels, a smaller group, and a dedicated guide throughout, without the premium of a five-star tier.",
    image: stock("photo-1584186028062-637e3e77318d", 1200, 800),
    gallery: [
      stock("photo-1650446647974-451d05d2136d", 1200, 900),
      stock("photo-1565330770968-0240c0046ce3", 1200, 900),
      stock("photo-1603491656337-3b491147917c", 1200, 900),
    ],
    nights: 15,
    fromPriceGBP: 5600,
    quota: "150 places",
    applicationDeadline: "6 months before the season",
    accommodation: [
      { location: "Makkah", detail: "Quad-share hotel, around 500m from the Haram" },
      { location: "Madinah", detail: "Quad-share hotel, around 400m from Masjid an-Nabawi" },
      { location: "Mina", detail: "Air-conditioned tents, shared" },
      { location: "Arafat", detail: "Shaded canopy with seating, shared" },
    ],
    transport: "Private coach transfers, smaller group than the government scheme",
    meals: "Full board, buffet",
    guide: "A dedicated guide with the group for the whole trip",
    itinerary: STANDARD_ITINERARY,
  },
  {
    slug: "private-premium",
    name: "Private Premium Hajj",
    type: "Private Premium",
    strap: "Five-star, throughout",
    blurb:
      "Five-star hotels within a short walk of both mosques, upgraded and less crowded tents at Mina and Arafat, and private transfers rather than shared coaches, for the shortest and most comfortable route through the rites.",
    image: stock("photo-1565330770968-0240c0046ce3", 1200, 800),
    gallery: [
      stock("photo-1513072064285-240f87fa81e8", 1200, 900),
      stock("photo-1591604129939-f1efa4d9f7fa", 1200, 900),
      stock("photo-1584186028062-637e3e77318d", 1200, 900),
    ],
    nights: 12,
    fromPriceGBP: 9800,
    quota: "60 places",
    applicationDeadline: "8 months before the season",
    accommodation: [
      { location: "Makkah", detail: "5-star hotel, within 200m of the Haram" },
      { location: "Madinah", detail: "5-star hotel, within 150m of Masjid an-Nabawi" },
      { location: "Mina", detail: "Upgraded, less crowded air-conditioned tents" },
      { location: "Arafat", detail: "Private canopy with premium catering" },
    ],
    transport: "Private vehicles between every site, no shared coaches",
    meals: "Full board, à la carte where the site allows",
    guide: "A dedicated personal guide, plus scholar-led sessions",
    itinerary: STANDARD_ITINERARY,
  },
];

export function hajjPackageBySlug(slug: string): HajjPackage | undefined {
  return HAJJ_PACKAGES.find((p) => p.slug === slug);
}

export function hajjPackagesByType(type: HajjPackageType): HajjPackage[] {
  return HAJJ_PACKAGES.filter((p) => p.type === type);
}
