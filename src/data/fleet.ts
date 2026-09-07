export interface Aircraft {
  type: string;
  count: number;
  seats: string;
  routes: string;
  note: string;
}

export const FLEET: Aircraft[] = [
  {
    type: "Airbus A350-1000",
    count: 8,
    seats: "331 across four cabins",
    routes: "Sydney, Tokyo, Singapore",
    note: "The quietest aircraft we fly, and the one we send on the longest sectors.",
  },
  {
    type: "Airbus A350-900",
    count: 11,
    seats: "300 across four cabins",
    routes: "New York, São Paulo, Cape Town",
    note: "Higher cabin humidity and lower pressure altitude, so you land less worn out.",
  },
  {
    type: "Boeing 787-9",
    count: 6,
    seats: "271 across three cabins",
    routes: "Dubai, Delhi, Boston, Toronto",
    note: "Larger windows and a smoother ride through turbulence on our shorter long-haul routes.",
  },
];

export const FLEET_STATS = [
  { label: "Aircraft in service", value: "25" },
  { label: "Average fleet age", value: "4.2 yrs" },
  { label: "Destinations", value: "10" },
  { label: "On-time within 15 min", value: "84.6%" },
];
