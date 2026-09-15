import { stock } from "@/lib/img";
import { TOUR_GROUP_TYPES, TOUR_SEASONS, type TourGroupType, type TourSeason, type TourItineraryStep } from "@/data/tours";

export type { TourGroupType, TourSeason, TourItineraryStep };
export { TOUR_GROUP_TYPES, TOUR_SEASONS };

export type PakistanRegion =
  | "Hunza/Skardu"
  | "Swat"
  | "Murree"
  | "Naran/Kaghan"
  | "Northern Areas"
  | "Neelum Valley"
  | "Fairy Meadows"
  | "Kalash Valley";

export const PAKISTAN_REGIONS: PakistanRegion[] = [
  "Hunza/Skardu",
  "Swat",
  "Murree",
  "Naran/Kaghan",
  "Northern Areas",
  "Neelum Valley",
  "Fairy Meadows",
  "Kalash Valley",
];

export const PAKISTAN_TOUR_DURATIONS = [3, 5, 7, 10] as const;

export interface PakistanPriceBand {
  label: string;
  min: number;
  max: number;
}

export const PAKISTAN_PRICE_BANDS: PakistanPriceBand[] = [
  { label: "Under £500", min: 0, max: 499 },
  { label: "£500 – £800", min: 500, max: 799 },
  { label: "£800 – £1,100", min: 800, max: 1099 },
  { label: "£1,100+", min: 1100, max: Infinity },
];

/** The friendly marketing tag shown on cards -- aligned with, but not identical wording to, the Group Type filter (Couple -> "Honeymoon"). Not every package carries one. */
export type PakistanCardTag = "Family" | "Honeymoon" | "Group";

export interface PakistanStay {
  location: string;
  type: "Hotel" | "Resort" | "Guesthouse" | "Camping";
  name: string;
  /** Omitted for camping, which isn't star-rated. */
  rating?: number;
  detail: string;
}

export interface PakistanTourPackage {
  slug: string;
  name: string;
  region: PakistanRegion;
  strap: string;
  blurb: string;
  image: string;
  gallery: string[];
  durationDays: number;
  fromPriceGBP: number;
  groupTypes: TourGroupType[];
  cardTag?: PakistanCardTag;
  season: TourSeason;
  featured?: boolean;
  inclusions: string[];
  stays: PakistanStay[];
  itinerary: TourItineraryStep[];
}

export const PAKISTAN_TOUR_PACKAGES: PakistanTourPackage[] = [
  {
    slug: "hunza-skardu-valley-explorer",
    name: "Hunza & Skardu Valley Explorer",
    region: "Hunza/Skardu",
    strap: "Glacial lakes and switchback roads",
    blurb:
      "The Karakoram Highway into Hunza's terraced orchards, then on to Skardu's glacial lakes and cold desert, on Pakistan's most dramatic mountain road.",
    image: stock("photo-1571401835393-8c5f35328320", 1200, 800),
    gallery: [stock("photo-1635016288720-c52507b9a717", 1200, 900), stock("photo-1603491656337-3b491147917c", 1200, 900)],
    durationDays: 7,
    fromPriceGBP: 950,
    groupTypes: ["Individual", "Group"],
    cardTag: "Group",
    season: "Summer",
    featured: true,
    inclusions: [
      "Return flights to Islamabad",
      "6 nights across Hunza and Skardu",
      "Private 4x4 transport on the Karakoram Highway",
      "Daily breakfast",
      "Attabad Lake boat ride",
      "Local guide throughout",
    ],
    stays: [
      { location: "Hunza", type: "Hotel", name: "Karakoram View Hotel", rating: 4, detail: "Orchard-facing rooms looking out over the Hunza valley." },
      { location: "Skardu", type: "Guesthouse", name: "Shangrila-area Guesthouse", rating: 3, detail: "A short drive from Shangrila Resort and Upper Kachura Lake." },
    ],
    itinerary: [
      { day: "Day 1", title: "Fly to Islamabad", body: "Land in Islamabad and rest overnight before the mountain drive." },
      { day: "Days 2–3", title: "Karakoram Highway to Hunza", body: "Drive the Karakoram Highway via Besham and Chilas, stopping at the Nanga Parbat viewpoint, into Hunza." },
      { day: "Day 4", title: "Hunza sightseeing", body: "Baltit Fort, Attabad Lake and the Hunza viewpoint at Eagle's Nest." },
      { day: "Days 5–6", title: "On to Skardu", body: "Cross into Skardu on the Karakoram Highway, visiting Upper Kachura Lake and Shangrila." },
      { day: "Day 7", title: "Return flight", body: "Fly back from Skardu to Islamabad and onward home." },
    ],
  },
  {
    slug: "swat-valley-family-retreat",
    name: "Swat Valley Family Retreat",
    region: "Swat",
    strap: "Pakistan's Switzerland, for the whole family",
    blurb:
      "Green valleys, orchards and the Mingora bazaar, at a gentle pace built for travelling with kids and grandparents alike.",
    image: stock("photo-1500534623283-312aade485b7", 1200, 800),
    gallery: [stock("photo-1602740337312-e28c0b7d27f9", 1200, 900), stock("photo-1635016288720-c52507b9a717", 1200, 900)],
    durationDays: 5,
    fromPriceGBP: 520,
    groupTypes: ["Family"],
    cardTag: "Family",
    season: "Spring",
    featured: true,
    inclusions: [
      "Return flights to Islamabad",
      "4 nights in Swat",
      "Private family-sized transport",
      "Daily breakfast",
      "Malam Jabba chairlift ride",
      "Kalam & Mahodand Lake day trip",
    ],
    stays: [
      { location: "Mingora", type: "Hotel", name: "Swat Continental Hotel", rating: 4, detail: "Family rooms with a garden and playground on site." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Swat", body: "Drive up from Islamabad into the Swat valley, with the afternoon free to settle in." },
      { day: "Day 2", title: "Malam Jabba", body: "A chairlift ride and easy walks at Malam Jabba, Pakistan's best-known hill resort." },
      { day: "Days 3–4", title: "Kalam & Mahodand Lake", body: "A day trip north to Kalam and the turquoise waters of Mahodand Lake." },
      { day: "Day 5", title: "Mingora & departure", body: "A morning at the Mingora bazaar and Swat Museum before the drive back to Islamabad." },
    ],
  },
  {
    slug: "murree-hills-honeymoon-escape",
    name: "Murree Hills Honeymoon Escape",
    region: "Murree",
    strap: "Pine forests, close to home",
    blurb:
      "A short, easy break in the pine-covered hills above Islamabad, timed for winter snow on the Mall Road and the Patriata chairlift.",
    image: stock("photo-1441974231531-c6227db76b6e", 1200, 800),
    gallery: [stock("photo-1635016288720-c52507b9a717", 1200, 900), stock("photo-1602740337312-e28c0b7d27f9", 1200, 900)],
    durationDays: 3,
    fromPriceGBP: 340,
    groupTypes: ["Couple"],
    cardTag: "Honeymoon",
    season: "Winter",
    inclusions: [
      "Return flights to Islamabad",
      "2 nights in Murree",
      "Private transfers",
      "Daily breakfast",
      "Patriata (New Murree) chairlift tickets",
    ],
    stays: [
      { location: "Murree", type: "Resort", name: "Pine View Couples Resort", rating: 4, detail: "A quiet resort just off Mall Road with valley-facing rooms." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Murree", body: "Drive up from Islamabad into the hills and settle in, with Mall Road a short walk away." },
      { day: "Day 2", title: "Patriata & viewpoints", body: "Ride the Patriata chairlift and visit the Kashmir Point and Pindi Point viewpoints." },
      { day: "Day 3", title: "Departure", body: "A final morning on Mall Road before the drive back to Islamabad." },
    ],
  },
  {
    slug: "naran-kaghan-saiful-malook",
    name: "Naran, Kaghan & Saif-ul-Malook",
    region: "Naran/Kaghan",
    strap: "Alpine lakes and glacier views",
    blurb:
      "The Kaghan valley's alpine lakes, ending at Saif-ul-Malook beneath the Malika Parbat glacier, jeep ride included.",
    image: stock("photo-1439853949127-fa647821eba0", 1200, 800),
    gallery: [stock("photo-1635016288720-c52507b9a717", 1200, 900), stock("photo-1603491656337-3b491147917c", 1200, 900)],
    durationDays: 5,
    fromPriceGBP: 610,
    groupTypes: ["Family", "Group"],
    cardTag: "Family",
    season: "Summer",
    featured: true,
    inclusions: [
      "Return flights to Islamabad",
      "4 nights across Kaghan and Naran",
      "Private transport + jeep transfer to Saif-ul-Malook",
      "Daily breakfast",
      "Shogran & Siri Paye chairlift",
    ],
    stays: [
      { location: "Naran", type: "Hotel", name: "Lake View Naran Hotel", rating: 3, detail: "Riverside rooms in the centre of Naran bazaar." },
      { location: "Saif-ul-Malook", type: "Camping", name: "Lakeside Camp", detail: "Tented camp on the shore, for the one night closest to the lake." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Kaghan", body: "Drive up from Islamabad through Balakot into the Kaghan valley." },
      { day: "Day 2", title: "Shogran & Siri Paye", body: "A chairlift and jeep trip up to the alpine meadows of Siri Paye." },
      { day: "Days 3–4", title: "Naran & Saif-ul-Malook", body: "Jeep up to Lake Saif-ul-Malook beneath Malika Parbat, with a night camping by the lake." },
      { day: "Day 5", title: "Departure", body: "Drive back down through Balakot to Islamabad." },
    ],
  },
  {
    slug: "grand-northern-areas-circuit",
    name: "Grand Northern Areas Circuit",
    region: "Northern Areas",
    strap: "Everything, in ten days",
    blurb:
      "A full loop of the north: Naran, Hunza, Skardu and the Karakoram Highway, for groups who want the whole circuit in one trip.",
    image: stock("photo-1519681393784-d120267933ba", 1200, 800),
    gallery: [stock("photo-1602740337312-e28c0b7d27f9", 1200, 900), stock("photo-1635016288720-c52507b9a717", 1200, 900)],
    durationDays: 10,
    fromPriceGBP: 1250,
    groupTypes: ["Group"],
    cardTag: "Group",
    season: "Summer",
    inclusions: [
      "Return flights to Islamabad",
      "9 nights across Naran, Hunza and Skardu",
      "Private 4x4 convoy throughout",
      "Daily breakfast",
      "Attabad Lake, Khunjerab Pass and Saif-ul-Malook visits",
      "Dedicated group guide",
    ],
    stays: [
      { location: "Naran", type: "Hotel", name: "Lake View Naran Hotel", rating: 3, detail: "Riverside rooms in the centre of Naran bazaar." },
      { location: "Hunza", type: "Hotel", name: "Karakoram View Hotel", rating: 4, detail: "Orchard-facing rooms looking out over the Hunza valley." },
      { location: "Skardu", type: "Guesthouse", name: "Shangrila-area Guesthouse", rating: 3, detail: "A short drive from Shangrila Resort and Upper Kachura Lake." },
    ],
    itinerary: [
      { day: "Days 1–2", title: "Islamabad to Naran", body: "Drive north via Balakot into Kaghan, with a jeep trip to Saif-ul-Malook." },
      { day: "Days 3–4", title: "Naran to Hunza", body: "Continue on the Karakoram Highway via Chilas and the Nanga Parbat viewpoint into Hunza." },
      { day: "Day 5", title: "Hunza sightseeing", body: "Baltit Fort, Attabad Lake and a drive toward the Khunjerab Pass." },
      { day: "Days 6–7", title: "Hunza to Skardu", body: "Cross into Skardu, visiting Upper Kachura Lake and Shangrila." },
      { day: "Days 8–9", title: "Skardu exploring", body: "The Deosai Plains or Shigar Fort, depending on the season and road conditions." },
      { day: "Day 10", title: "Fly home", body: "Fly from Skardu back to Islamabad and onward home." },
    ],
  },
  {
    slug: "neelum-valley-honeymoon-trail",
    name: "Neelum Valley Honeymoon Trail",
    region: "Neelum Valley",
    strap: "Pine forests along the Neelum river",
    blurb:
      "A quieter alternative to Kaghan: the Neelum river valley's forests and waterfalls, timed for autumn colour.",
    image: stock("photo-1506905925346-21bda4d32df4", 1200, 800),
    gallery: [stock("photo-1603491656337-3b491147917c", 1200, 900), stock("photo-1602740337312-e28c0b7d27f9", 1200, 900)],
    durationDays: 5,
    fromPriceGBP: 580,
    groupTypes: ["Couple"],
    cardTag: "Honeymoon",
    season: "Autumn",
    inclusions: [
      "Return flights to Islamabad",
      "4 nights in Neelum Valley",
      "Private transport",
      "Daily breakfast",
      "Ratti Gali Lake jeep & trek day",
    ],
    stays: [
      { location: "Kel", type: "Guesthouse", name: "Neelum Riverside Guesthouse", rating: 3, detail: "Wooden cabins on the riverbank, a short walk from the bazaar." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Neelum Valley", body: "Drive from Islamabad via Muzaffarabad into the Neelum valley." },
      { day: "Days 2–3", title: "Sharda & Kel", body: "Visit Sharda's ruins and continue up-valley to Kel, along the Neelum river." },
      { day: "Day 4", title: "Ratti Gali Lake", body: "A jeep ride and short trek up to the alpine Ratti Gali Lake." },
      { day: "Day 5", title: "Departure", body: "Drive back to Islamabad via Muzaffarabad." },
    ],
  },
  {
    slug: "fairy-meadows-trek-camp",
    name: "Fairy Meadows Trek & Camp",
    region: "Fairy Meadows",
    strap: "Camping beneath Nanga Parbat",
    blurb:
      "A jeep track and a short trek to a meadow camp facing Nanga Parbat, the world's ninth-highest peak, for travellers happy to rough it for one incredible view.",
    image: stock("photo-1464822759023-fed622ff2c3b", 1200, 800),
    gallery: [stock("photo-1635016288720-c52507b9a717", 1200, 900), stock("photo-1603491656337-3b491147917c", 1200, 900)],
    durationDays: 3,
    fromPriceGBP: 420,
    groupTypes: ["Individual", "Couple"],
    season: "Summer",
    inclusions: [
      "Return flights to Islamabad",
      "2 nights camping at Fairy Meadows",
      "Jeep transfer from Raikot Bridge",
      "All meals while camping",
      "Local guide for the trek",
    ],
    stays: [
      { location: "Fairy Meadows", type: "Camping", name: "Nanga Parbat View Camp", detail: "Tented camp with Nanga Parbat directly in view, no road access beyond Raikot Bridge." },
    ],
    itinerary: [
      { day: "Day 1", title: "Drive & jeep to Fairy Meadows", body: "Drive the Karakoram Highway to Raikot Bridge, then jeep and a short trek up to the meadow." },
      { day: "Day 2", title: "At the meadow", body: "A full day with Nanga Parbat views, and an optional hike to Beyal Camp for a closer glacier view." },
      { day: "Day 3", title: "Descent & departure", body: "Trek and jeep back down to the highway for the return drive." },
    ],
  },
  {
    slug: "kalash-valleys-culture-tour",
    name: "Kalash Valleys Culture Tour",
    region: "Kalash Valley",
    strap: "Pakistan's most distinct culture",
    blurb:
      "Chitral and the three Kalash valleys, home to one of Pakistan's smallest and most distinct indigenous communities, timed around the autumn harvest.",
    image: stock("photo-1470770903676-69b98201ea1c", 1200, 800),
    gallery: [stock("photo-1602740337312-e28c0b7d27f9", 1200, 900), stock("photo-1635016288720-c52507b9a717", 1200, 900)],
    durationDays: 7,
    fromPriceGBP: 780,
    groupTypes: ["Individual", "Group"],
    cardTag: "Group",
    season: "Autumn",
    inclusions: [
      "Return flights to Islamabad or Chitral",
      "6 nights across Chitral and the Kalash valleys",
      "Private transport",
      "Daily breakfast",
      "Local Kalash guide",
    ],
    stays: [
      { location: "Chitral", type: "Hotel", name: "Chitral Fort View Hotel", rating: 3, detail: "Overlooking the Chitral Fort and the Hindu Kush skyline." },
      { location: "Bumburet", type: "Guesthouse", name: "Kalash Valley Guesthouse", rating: 3, detail: "Family-run guesthouse in the Bumburet valley." },
    ],
    itinerary: [
      { day: "Days 1–2", title: "Fly to Chitral", body: "Fly into Chitral (weather permitting) or drive via the Lowari Tunnel, and settle in beneath the fort." },
      { day: "Days 3–5", title: "The three Kalash valleys", body: "Visit Bumburet, Rumbur and Birir, the three Kalash valleys, with a local guide throughout." },
      { day: "Day 6", title: "Chitral town", body: "Chitral Fort, the Shahi Mosque and the local bazaar." },
      { day: "Day 7", title: "Departure", body: "Fly or drive back to Islamabad." },
    ],
  },
];

export function pakistanTourPackageBySlug(slug: string): PakistanTourPackage | undefined {
  return PAKISTAN_TOUR_PACKAGES.find((p) => p.slug === slug);
}
