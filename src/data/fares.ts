import type { FareId } from "@/types";

export interface FareDef {
  id: FareId;
  name: string;
  /** Added per passenger, per direction, GBP. */
  addPerDirection: number;
  strap: string;
  includes: { label: string; value: string }[];
}

export const FARES: FareDef[] = [
  {
    id: "lite",
    name: "Lite",
    addPerDirection: 0,
    strap: "Travelling light and set on your dates.",
    includes: [
      { label: "Cabin bag", value: "Included" },
      { label: "Checked bag", value: "From £32" },
      { label: "Seat selection", value: "At check-in" },
      { label: "Changes", value: "Not permitted" },
      { label: "Miles earned", value: "25%" },
    ],
  },
  {
    id: "value",
    name: "Value",
    addPerDirection: 45,
    strap: "The balance most travellers pick.",
    includes: [
      { label: "Cabin bag", value: "Included" },
      { label: "Checked bag", value: "1 x 23kg included" },
      { label: "Seat selection", value: "Standard seats free" },
      { label: "Changes", value: "£60 fee plus fare difference" },
      { label: "Miles earned", value: "100%" },
    ],
  },
  {
    id: "flex",
    name: "Flex",
    addPerDirection: 120,
    strap: "Plans that might move.",
    includes: [
      { label: "Cabin bag", value: "Included" },
      { label: "Checked bag", value: "2 x 23kg included" },
      { label: "Seat selection", value: "Any seat, including legroom" },
      { label: "Changes", value: "Free, fare difference only" },
      { label: "Miles earned", value: "150%" },
    ],
  },
];

export function fareById(id: FareId): FareDef {
  return FARES.find((f) => f.id === id)!;
}
