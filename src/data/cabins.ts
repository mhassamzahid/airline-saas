import type { CabinId } from "@/types";
import { stock } from "@/lib/img";

export interface CabinDef {
  id: CabinId;
  name: string;
  multiplier: number;
  strap: string;
  perks: string[];
  image: string;
}

const img = (id: string) => stock(id, 1100, 760);

export const CABINS: CabinDef[] = [
  {
    id: "economy",
    name: "Economy",
    multiplier: 1,
    strap: "The essentials, priced honestly.",
    perks: ["31-inch pitch", "Cabin bag and a meal included"],
    image: img("photo-1540339832862-474599807836"),
  },
  {
    id: "premium",
    name: "Premium",
    multiplier: 1.9,
    strap: "More room, a quieter cabin, off the aircraft first.",
    perks: ["38-inch pitch, wide recline", "Two checked bags, priority boarding"],
    image: img("photo-1583863788434-e58a36330cf0"),
  },
  {
    id: "business",
    name: "Business",
    multiplier: 3.6,
    strap: "Lie flat, arrive level.",
    perks: ["Fully flat bed, aisle access", "Lounge both ends, dining on your schedule"],
    image: img("photo-1556388158-158ea5ccacbd"),
  },
  {
    id: "first",
    name: "First",
    multiplier: 6,
    strap: "A private suite at altitude.",
    perks: ["Enclosed suite with a separate bed", "Chauffeur transfers, a dedicated host"],
    image: img("photo-1553095066-5014bc7b7f2d"),
  },
];

export function cabinById(id: CabinId): CabinDef {
  return CABINS.find((c) => c.id === id)!;
}
