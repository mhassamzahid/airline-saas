import type { FlightOption } from "@/types";
import { BLOCK_MINUTES, ORIGINS } from "./airports";
import { stock } from "@/lib/img";

const ORIGIN_CODES = new Set(ORIGINS.map((o) => o.code));

const img = (id: string) => stock(id, 900, 760);

export type DepartureWindowId = "morning" | "midday" | "evening" | "overnight";

export interface DepartureWindow {
  id: DepartureWindowId;
  label: string;
  note: string;
  /** Local departure time, HH:MM. */
  depTime: string;
  /** Per-passenger price delta for choosing this window, GBP. */
  priceGBP: number;
  image: string;
}

export const DEPARTURE_WINDOWS: DepartureWindow[] = [
  {
    id: "morning",
    label: "Early",
    note: "A full day at the other end",
    depTime: "07:40",
    priceGBP: -8,
    image: img("photo-1474302770737-173ee21bab63"),
  },
  {
    id: "midday",
    label: "Midday",
    note: "The most popular slot",
    depTime: "12:30",
    priceGBP: 42,
    image: img("photo-1436491865332-7a61a109cc05"),
  },
  {
    id: "evening",
    label: "Evening",
    note: "Leave after work",
    depTime: "18:15",
    priceGBP: 18,
    image: img("photo-1464037866556-6812c9d1c72e"),
  },
  {
    id: "overnight",
    label: "Overnight",
    note: "Sleep across, save a day",
    depTime: "22:35",
    priceGBP: -44,
    image: img("photo-1517263904808-5dc91e3e7044"),
  },
];

export function windowById(id: DepartureWindowId): DepartureWindow {
  return DEPARTURE_WINDOWS.find((w) => w.id === id)!;
}

const AIRCRAFT = ["A350-900", "A350-1000", "787-9", "A330-900"];

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function addMinutes(hhmm: string, mins: number) {
  const [h, m] = hhmm.split(":").map(Number);
  let total = h * 60 + m + mins;
  const dayOffset = Math.floor(total / 1440);
  total = ((total % 1440) + 1440) % 1440;
  const nh = Math.floor(total / 60).toString().padStart(2, "0");
  const nm = (total % 60).toString().padStart(2, "0");
  return { time: `${nh}:${nm}`, dayOffset };
}

/** A concrete flight for a route + chosen departure window. Deterministic. */
export function flightFor(
  fromCode: string,
  toCode: string,
  win: DepartureWindowId,
): FlightOption {
  const destCode = ORIGIN_CODES.has(fromCode) ? toCode : fromCode;
  const block = BLOCK_MINUTES[destCode] ?? 480;
  const seed = hash(`${fromCode}>${toCode}:${win}`);
  const w = windowById(win);

  const jitter = ((seed % 40) - 20);
  const nonstop = block < 900; // only the very longest sector stops
  const stopMinutes = nonstop ? 0 : 80;
  const duration = block + jitter + stopMinutes;
  const arr = addMinutes(w.depTime, duration);
  const flightNo = `HN ${200 + (seed % 90)}`;

  return {
    id: `${fromCode}-${toCode}-${win}`,
    flightNo,
    dep: { code: fromCode, time: w.depTime },
    arr: { code: toCode, time: arr.time, dayOffset: arr.dayOffset },
    durationMin: duration,
    stops: nonstop ? 0 : 1,
    stopAirport: nonstop ? undefined : "SIN",
    aircraft: AIRCRAFT[seed % AIRCRAFT.length],
    priceGBP: w.priceGBP,
  };
}
