import { stock } from "@/lib/img";

export interface HajjPackage {
  slug: string;
  name: string;
  strap: string;
  blurb: string;
  image: string;
  quota: string;
  applicationDeadline: string;
  inclusions: string[];
}

/**
 * Fixed, quota'd, season-bound: a browsed listing, not a filter, per
 * Archetype B. Each package has its own real capacity and application
 * deadline shown up front, since Hajj allocation is genuinely regulated.
 */
export const HAJJ_PACKAGES: HajjPackage[] = [
  {
    slug: "economy",
    name: "Economy Hajj",
    strap: "The full rites, without the premium",
    blurb:
      "Shared-room accommodation in Makkah and Madinah, coach transfers between the holy sites, and a guided group leader for every ritual: Mina, Arafat, Muzdalifah and the stoning at Jamarat.",
    image: stock("photo-1650446647974-451d05d2136d", 1200, 800),
    quota: "120 places",
    applicationDeadline: "6 months before the season",
    inclusions: [
      "Visa processing and Saudi entry documentation",
      "Shared-room hotels in both Makkah and Madinah",
      "Air-conditioned tent accommodation at Mina",
      "A group leader present for every ritual day",
    ],
  },
  {
    slug: "standard",
    name: "Standard Hajj",
    strap: "The one most pilgrims choose",
    blurb:
      "Twin-share hotels closer to both mosques, a smaller group size for a calmer pace through Mina and Arafat, and a dedicated guide throughout.",
    image: stock("photo-1584186028062-637e3e77318d", 1200, 800),
    quota: "80 places",
    applicationDeadline: "6 months before the season",
    inclusions: [
      "Everything in Economy Hajj",
      "Twin-share hotels, closer to the Haram in Makkah",
      "Smaller group size, capped at 80 pilgrims",
      "A dedicated Halcyon guide for the full trip",
    ],
  },
  {
    slug: "premium",
    name: "Premium Hajj",
    strap: "Five-star, throughout",
    blurb:
      "Five-star hotels within walking distance of both mosques, upgraded Mina tents, and private transfers rather than shared coaches.",
    image: stock("photo-1565330770968-0240c0046ce3", 1200, 800),
    quota: "40 places",
    applicationDeadline: "8 months before the season",
    inclusions: [
      "Everything in Standard Hajj",
      "Five-star hotels within walking distance of the Haram",
      "Upgraded, less crowded tents at Mina",
      "Private transfers between all ritual sites",
    ],
  },
  {
    slug: "group-community",
    name: "Group & community Hajj",
    strap: "For mosques, families and community groups travelling together",
    blurb:
      "The same rites and standards as our Standard package, booked and paid for as one group with a single named coordinator, built for a mosque committee or an extended family travelling together.",
    image: stock("photo-1513072064285-240f87fa81e8", 1200, 800),
    quota: "20+ places per group",
    applicationDeadline: "8 months before the season",
    inclusions: [
      "Everything in Standard Hajj",
      "Seats and rooms kept together for the whole group",
      "One named coordinator and one consolidated invoice",
      "Flexible payment across the group ahead of the deadline",
    ],
  },
];

export function hajjPackageBySlug(slug: string): HajjPackage | undefined {
  return HAJJ_PACKAGES.find((p) => p.slug === slug);
}
