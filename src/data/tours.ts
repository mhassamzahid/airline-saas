import { stock } from "@/lib/img";

export type TourCountry =
  | "Turkey"
  | "Thailand"
  | "Dubai"
  | "Malaysia"
  | "Europe"
  | "Egypt"
  | "Maldives"
  | "Indonesia";

export const TOUR_COUNTRIES: TourCountry[] = [
  "Turkey",
  "Thailand",
  "Dubai",
  "Malaysia",
  "Europe",
  "Egypt",
  "Maldives",
  "Indonesia",
];

export type TourGroupType = "Individual" | "Family" | "Couple" | "Group";
export const TOUR_GROUP_TYPES: TourGroupType[] = ["Individual", "Family", "Couple", "Group"];

export type TourSeason = "Spring" | "Summer" | "Autumn" | "Winter" | "Year-round";
export const TOUR_SEASONS: TourSeason[] = ["Spring", "Summer", "Autumn", "Winter", "Year-round"];

export const TOUR_DURATIONS = [5, 7, 10, 14] as const;

export interface TourPriceBand {
  label: string;
  min: number;
  max: number;
}

export const TOUR_PRICE_BANDS: TourPriceBand[] = [
  { label: "Under £1,000", min: 0, max: 999 },
  { label: "£1,000 – £1,500", min: 1000, max: 1499 },
  { label: "£1,500 – £2,000", min: 1500, max: 1999 },
  { label: "£2,000+", min: 2000, max: Infinity },
];

export interface TourHotel {
  city: string;
  name: string;
  rating: number;
  detail: string;
}

export interface TourItineraryStep {
  day: string;
  title: string;
  body: string;
}

export interface TourPackage {
  slug: string;
  name: string;
  country: TourCountry;
  strap: string;
  blurb: string;
  image: string;
  gallery: string[];
  durationDays: number;
  fromPriceGBP: number;
  groupTypes: TourGroupType[];
  season: TourSeason;
  /** Shown in the "Featured this season" strip above the filtered grid. */
  featured?: boolean;
  inclusions: string[];
  exclusions: string[];
  hotels: TourHotel[];
  itinerary: TourItineraryStep[];
}

export const TOUR_PACKAGES: TourPackage[] = [
  {
    slug: "istanbul-cappadocia-explorer",
    name: "Istanbul & Cappadocia Explorer",
    country: "Turkey",
    strap: "Two icons, one week",
    blurb:
      "From the Hagia Sophia and Blue Mosque to a sunrise hot-air balloon over Cappadocia's fairy chimneys, a week that pairs Istanbul's history with Anatolia's landscape.",
    image: stock("photo-1524231757912-21f4fe3a7200", 1200, 800),
    gallery: [stock("photo-1541432901042-2d8bd64b4a9b", 1200, 900), stock("photo-1522083165195-3424ed129620", 1200, 900)],
    durationDays: 7,
    fromPriceGBP: 1150,
    groupTypes: ["Individual", "Couple", "Family"],
    season: "Spring",
    featured: true,
    inclusions: [
      "Return flights from London Gatwick",
      "6 nights across Istanbul and Cappadocia",
      "Daily breakfast",
      "Bosphorus sunset cruise",
      "Cappadocia hot-air balloon ride",
      "Airport transfers",
    ],
    exclusions: [
      "Lunches and dinners (except where noted)",
      "Turkey e-visa fee",
      "Travel insurance",
      "Personal spending",
    ],
    hotels: [
      { city: "Istanbul", name: "Sultanahmet Heritage Hotel", rating: 4, detail: "A 5-minute walk from the Blue Mosque, in the heart of the old city." },
      { city: "Cappadocia", name: "Cave Suites Göreme", rating: 4, detail: "Traditional cave-style rooms with balloon-launch views." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Istanbul", body: "Land in Istanbul and transfer to your hotel in Sultanahmet, with the evening free to explore." },
      { day: "Days 2–3", title: "Old city & Bosphorus", body: "Visit the Hagia Sophia, Blue Mosque and Topkapi Palace, then cruise the Bosphorus at sunset." },
      { day: "Day 4", title: "Fly to Cappadocia", body: "Morning flight to Cappadocia and an afternoon exploring the Göreme Open-Air Museum." },
      { day: "Day 5", title: "Sunrise balloon flight", body: "An early hot-air balloon ride over the fairy chimneys, followed by a free afternoon." },
      { day: "Days 6–7", title: "Underground city & departure", body: "Visit an underground city and Uçhisar Castle before flying home via Istanbul." },
    ],
  },
  {
    slug: "bangkok-phuket-getaway",
    name: "Bangkok & Phuket Getaway",
    country: "Thailand",
    strap: "Temples, then beaches",
    blurb:
      "Five days of temples, markets and street food in Bangkok, then five days unwinding on Phuket's beaches.",
    image: stock("photo-1508009603885-50cf7c579365", 1200, 800),
    gallery: [stock("photo-1552465011-b4e21bf6e79a", 1200, 900), stock("photo-1517090504586-fde19ea6066f", 1200, 900)],
    durationDays: 10,
    fromPriceGBP: 1550,
    groupTypes: ["Couple", "Family"],
    season: "Winter",
    featured: true,
    inclusions: [
      "Return flights from London Gatwick",
      "4 nights in Bangkok, 5 nights in Phuket",
      "Daily breakfast",
      "Grand Palace & Wat Arun guided tour",
      "Island-hopping speedboat trip",
      "Airport and inter-city transfers",
    ],
    exclusions: [
      "Lunches and dinners (except where noted)",
      "Thailand entry requirements/fees",
      "Travel insurance",
      "Optional spa treatments",
    ],
    hotels: [
      { city: "Bangkok", name: "Riverside Bangkok Hotel", rating: 4, detail: "On the Chao Phraya river, a short boat ride from the Grand Palace." },
      { city: "Phuket", name: "Patong Beachfront Resort", rating: 4, detail: "Steps from Patong Beach, with a pool facing the Andaman Sea." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Bangkok", body: "Land in Bangkok and settle in along the river, with the night market close by." },
      { day: "Days 2–3", title: "Temples & river", body: "Visit the Grand Palace, Wat Arun and Wat Pho, then a longtail boat ride through the klongs." },
      { day: "Day 4", title: "Floating markets", body: "A morning at the Damnoen Saduak floating market before an afternoon at leisure." },
      { day: "Day 5", title: "Fly to Phuket", body: "Short flight south to Phuket and check-in at your beachfront resort." },
      { day: "Days 6–8", title: "Islands & beaches", body: "Island-hopping by speedboat to Phi Phi and James Bond Island, with beach days between." },
      { day: "Days 9–10", title: "Free time & departure", body: "A final day at leisure before flying home." },
    ],
  },
  {
    slug: "dubai-city-desert-escape",
    name: "Dubai City & Desert Escape",
    country: "Dubai",
    strap: "Skyline by day, dunes by night",
    blurb:
      "A short break pairing Dubai's skyline and souks with an evening desert safari under open sky.",
    image: stock("photo-1512453979798-5ea266f8880c", 1200, 800),
    gallery: [stock("photo-1451337516015-6b6e9a44a8a3", 1200, 900), stock("photo-1522083165195-3424ed129620", 1200, 900)],
    durationDays: 5,
    fromPriceGBP: 780,
    groupTypes: ["Individual", "Couple"],
    season: "Year-round",
    inclusions: [
      "Return flights from London Gatwick",
      "4 nights in a central Dubai hotel",
      "Daily breakfast",
      "Burj Khalifa \"At the Top\" entry",
      "Desert safari with BBQ dinner",
      "Airport transfers",
    ],
    exclusions: [
      "Lunches and dinners (except the desert safari)",
      "UAE tourist visa fee",
      "Travel insurance",
      "Optional Dubai Mall aquarium / Ski Dubai",
    ],
    hotels: [
      { city: "Dubai", name: "Downtown Dubai Hotel", rating: 4, detail: "Walking distance to the Dubai Mall and Burj Khalifa fountains." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Dubai", body: "Land in Dubai and check in downtown, with the fountain show a short walk away in the evening." },
      { day: "Day 2", title: "Burj Khalifa & Old Dubai", body: "Morning at the top of the Burj Khalifa, afternoon in the souks and an abra crossing of Dubai Creek." },
      { day: "Day 3", title: "Desert safari", body: "Dune bashing, camel riding and a BBQ dinner under the stars in the Arabian desert." },
      { day: "Day 4", title: "Free day", body: "A day at leisure for the beach, the Mall, or an optional excursion." },
      { day: "Day 5", title: "Departure", body: "Free morning before your onward flight." },
    ],
  },
  {
    slug: "kuala-lumpur-langkawi",
    name: "Kuala Lumpur & Langkawi",
    country: "Malaysia",
    strap: "City towers, island beaches",
    blurb:
      "Three nights in Kuala Lumpur beneath the Petronas Towers, then four on Langkawi's beaches.",
    image: stock("photo-1596422846543-75c6fc197f07", 1200, 800),
    gallery: [stock("photo-1520454974749-611b7248ffdb", 1200, 900), stock("photo-1517090504586-fde19ea6066f", 1200, 900)],
    durationDays: 7,
    fromPriceGBP: 1050,
    groupTypes: ["Family", "Group"],
    season: "Summer",
    inclusions: [
      "Return flights from London Gatwick",
      "3 nights in Kuala Lumpur, 4 nights in Langkawi",
      "Daily breakfast",
      "Petronas Towers observation deck",
      "Langkawi cable car & island-hopping tour",
      "Airport and inter-city transfers",
    ],
    exclusions: [
      "Lunches and dinners (except where noted)",
      "Malaysia entry requirements/fees",
      "Travel insurance",
      "Optional watersports",
    ],
    hotels: [
      { city: "Kuala Lumpur", name: "KLCC Tower Hotel", rating: 4, detail: "Facing the Petronas Towers and KLCC park." },
      { city: "Langkawi", name: "Pantai Cenang Beach Resort", rating: 4, detail: "Beachfront on Pantai Cenang, Langkawi's liveliest stretch." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Kuala Lumpur", body: "Land in KL and settle in near the Petronas Towers." },
      { day: "Days 2–3", title: "City & culture", body: "Visit the Petronas Towers observation deck, Batu Caves and the Central Market." },
      { day: "Day 4", title: "Fly to Langkawi", body: "Short flight to Langkawi and an afternoon on Pantai Cenang beach." },
      { day: "Days 5–6", title: "Cable car & islands", body: "Ride the SkyCab to Gunung Mat Cincang, then a boat trip through the Kilim Geoforest mangroves." },
      { day: "Day 7", title: "Departure", body: "A final morning at the beach before flying home." },
    ],
  },
  {
    slug: "classic-europe-grand-tour",
    name: "Classic Europe: Paris, Rome & Barcelona",
    country: "Europe",
    strap: "Three cities, one grand tour",
    blurb:
      "A two-week grand tour by rail and air: Paris's boulevards, Rome's ruins, and Barcelona's Gaudí skyline.",
    image: stock("photo-1502602898657-3e91760cbb34", 1200, 800),
    gallery: [stock("photo-1552832230-c0197dd311b5", 1200, 900), stock("photo-1522083165195-3424ed129620", 1200, 900)],
    durationDays: 14,
    fromPriceGBP: 2200,
    groupTypes: ["Individual", "Group"],
    season: "Summer",
    featured: true,
    inclusions: [
      "Return flights from London Gatwick + inter-city travel",
      "4 nights each in Paris, Rome and Barcelona",
      "Daily breakfast",
      "Eiffel Tower summit access",
      "Colosseum skip-the-line tour",
      "Sagrada Família entry",
    ],
    exclusions: [
      "Lunches and dinners (except where noted)",
      "Schengen visa fee where applicable",
      "Travel insurance",
      "Optional day trips",
    ],
    hotels: [
      { city: "Paris", name: "Le Marais Boutique Hotel", rating: 4, detail: "A short walk from Notre-Dame and the Seine." },
      { city: "Rome", name: "Trastevere Residenza", rating: 4, detail: "In Rome's most walkable neighbourhood, near the river." },
      { city: "Barcelona", name: "Eixample Design Hotel", rating: 4, detail: "Close to the Sagrada Família and Passeig de Gràcia." },
    ],
    itinerary: [
      { day: "Days 1–4", title: "Paris", body: "The Louvre, the Eiffel Tower, Montmartre and a Seine river cruise." },
      { day: "Day 5", title: "Travel to Rome", body: "Fly from Paris to Rome and settle into Trastevere." },
      { day: "Days 6–9", title: "Rome", body: "The Colosseum and Roman Forum, the Vatican Museums and Sistine Chapel, and a day trip to Pompeii." },
      { day: "Day 10", title: "Travel to Barcelona", body: "Fly on to Barcelona for the final leg." },
      { day: "Days 11–13", title: "Barcelona", body: "Gaudí's Sagrada Família and Park Güell, the Gothic Quarter and a beach afternoon." },
      { day: "Day 14", title: "Departure", body: "Fly home from Barcelona." },
    ],
  },
  {
    slug: "cairo-nile-cruise",
    name: "Cairo & Nile Cruise",
    country: "Egypt",
    strap: "Pyramids to Aswan, by river",
    blurb:
      "The Giza Pyramids and the Egyptian Museum in Cairo, then four nights cruising the Nile from Luxor to Aswan.",
    image: stock("photo-1568322445389-f64ac2515020", 1200, 800),
    gallery: [stock("photo-1517090504586-fde19ea6066f", 1200, 900), stock("photo-1522083165195-3424ed129620", 1200, 900)],
    durationDays: 10,
    fromPriceGBP: 1650,
    groupTypes: ["Family", "Group"],
    season: "Autumn",
    inclusions: [
      "Return flights from London Gatwick",
      "3 nights in Cairo, 4-night Nile cruise (full board), 2 nights in Luxor",
      "Giza Pyramids & Sphinx tour",
      "Valley of the Kings entry",
      "Karnak & Philae Temple visits",
      "Airport and rail transfers",
    ],
    exclusions: [
      "Drinks on the cruise",
      "Egypt visa fee",
      "Travel insurance",
      "Optional Abu Simbel excursion",
    ],
    hotels: [
      { city: "Cairo", name: "Giza View Hotel", rating: 4, detail: "Rooftop views of the Pyramids from central Giza." },
      { city: "Nile Cruise", name: "MS Nile Premium", rating: 4, detail: "A four-night full-board cruise between Luxor and Aswan." },
    ],
    itinerary: [
      { day: "Days 1–3", title: "Cairo & Giza", body: "The Pyramids of Giza, the Sphinx, and the treasures of the Egyptian Museum." },
      { day: "Day 4", title: "Fly to Luxor", body: "Fly south to Luxor and board your Nile cruise ship." },
      { day: "Days 5–8", title: "Nile cruise", body: "Sail from Luxor to Aswan, stopping at the Valley of the Kings, Karnak Temple and Kom Ombo." },
      { day: "Day 9", title: "Aswan & High Dam", body: "Visit the Aswan High Dam and the Philae Temple before disembarking." },
      { day: "Day 10", title: "Departure", body: "Fly home via Cairo." },
    ],
  },
  {
    slug: "maldives-overwater-escape",
    name: "Maldives Overwater Escape",
    country: "Maldives",
    strap: "Five nights, one lagoon",
    blurb: "An overwater villa on a private atoll, built entirely around doing as little as possible.",
    image: stock("photo-1573843981267-be1999ff37cd", 1200, 800),
    gallery: [stock("photo-1522083165195-3424ed129620", 1200, 900), stock("photo-1517090504586-fde19ea6066f", 1200, 900)],
    durationDays: 5,
    fromPriceGBP: 2400,
    groupTypes: ["Couple"],
    season: "Year-round",
    inclusions: [
      "Return flights + seaplane transfer",
      "5 nights in an overwater villa",
      "Half board",
      "Snorkelling equipment",
      "One sunset dolphin cruise",
    ],
    exclusions: [
      "Spa treatments",
      "Motorised watersports",
      "Alcoholic drinks",
      "Travel insurance",
    ],
    hotels: [
      { city: "South Ari Atoll", name: "Lagoon Overwater Villas", rating: 5, detail: "Private-pool overwater villas reached by a 30-minute seaplane." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival by seaplane", body: "Land in Malé and take a scenic seaplane transfer straight to the resort." },
      { day: "Days 2–4", title: "At leisure", body: "Days built around the lagoon: snorkelling, a sunset dolphin cruise, and time on the villa deck." },
      { day: "Day 5", title: "Departure", body: "Seaplane back to Malé for your flight home." },
    ],
  },
  {
    slug: "bali-retreat-ubud-culture",
    name: "Bali Retreat & Ubud Culture",
    country: "Indonesia",
    strap: "Rice terraces and temple gates",
    blurb: "Four nights among Ubud's rice terraces and temples, then three unwinding on Seminyak's beaches.",
    image: stock("photo-1518548419970-58e3b4079ab2", 1200, 800),
    gallery: [stock("photo-1537996194471-e657df975ab4", 1200, 900), stock("photo-1522083165195-3424ed129620", 1200, 900)],
    durationDays: 7,
    fromPriceGBP: 1300,
    groupTypes: ["Individual", "Couple"],
    season: "Winter",
    inclusions: [
      "Return flights from London Gatwick",
      "4 nights in Ubud, 3 nights in Seminyak",
      "Daily breakfast",
      "Tegallalang rice terrace & temple tour",
      "One yoga class",
      "Airport transfers",
    ],
    exclusions: [
      "Lunches and dinners (except where noted)",
      "Bali visa-on-arrival fee",
      "Travel insurance",
      "Spa treatments",
    ],
    hotels: [
      { city: "Ubud", name: "Ubud Rice Terrace Villas", rating: 4, detail: "Private villas set among working rice paddies." },
      { city: "Seminyak", name: "Seminyak Beach Hotel", rating: 4, detail: "A short walk to Seminyak's beach clubs and sunset bars." },
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival in Ubud", body: "Land in Bali and transfer to Ubud, with the evening free." },
      { day: "Days 2–3", title: "Rice terraces & temples", body: "Visit the Tegallalang rice terraces, the Sacred Monkey Forest and Tirta Empul water temple." },
      { day: "Day 4", title: "Yoga & culture", body: "A morning yoga class, then an afternoon exploring Ubud's art markets." },
      { day: "Day 5", title: "Transfer to Seminyak", body: "Drive south to Seminyak and settle in by the beach." },
      { day: "Days 6–7", title: "Beach & departure", body: "Beach days and sunset drinks before flying home." },
    ],
  },
];

export function tourPackageBySlug(slug: string): TourPackage | undefined {
  return TOUR_PACKAGES.find((p) => p.slug === slug);
}
