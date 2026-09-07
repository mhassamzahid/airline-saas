import { stock } from "@/lib/img";

const img = (id: string) => stock(id, 900, 560);

export const BAG_PRICE_GBP = 32;
export const ZIYARAT_PRICE_GBP = 45; // per person, one guided tour
export const GUIDE_PRICE_GBP = 60; // per booking, private guide for the trip
export const LEGROOM_PRICE_PER_DIRECTION = 28; // per passenger per direction
export const OFFSET_PRICE_PER_PAX_PER_DIRECTION = 8;
export const FLEX_ADD_PER_DIRECTION = 120; // per passenger per direction (fare = flex)

/** The tappable add-on cards. Each maps to one flag in the booking store. */
export const ADDON_CARDS = [
  {
    key: "legroom" as const,
    title: "Extra legroom",
    note: "Exit row or bulkhead, on both flights",
    image: img("photo-1583863788434-e58a36330cf0"),
  },
  {
    key: "ziyarat" as const,
    title: "Ziyarat tour",
    note: "A guided half-day around the historical sites of Makkah and Madinah",
    image: img("photo-1584186028062-637e3e77318d"),
  },
  {
    key: "guide" as const,
    title: "Private guide",
    note: "One guide with you throughout, not shared with the group",
    image: img("photo-1650446647974-451d05d2136d"),
  },
  {
    key: "flex" as const,
    title: "Fully flexible",
    note: "Change your dates or cancel with no fee, fare difference only",
    image: img("photo-1499591934245-40b55745b905"),
  },
];
