import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Turns heading text into a URL-safe anchor id, e.g. for the Section links block. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const gbpPrecise = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatGBP(amount: number, precise = false) {
  return (precise ? gbpPrecise : gbp).format(Math.round(precise ? amount * 100 : amount) / (precise ? 100 : 1));
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m.toString().padStart(2, "0")}m`;
}

export function formatDateShort(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDateLong(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" });
}

export function isoToDate(iso?: string) {
  return iso ? new Date(iso + "T00:00:00") : undefined;
}

export function dateToIso(d?: Date) {
  if (!d) return undefined;
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function nightsBetween(from?: string, to?: string) {
  if (!from || !to) return 0;
  const a = new Date(from + "T00:00:00").getTime();
  const b = new Date(to + "T00:00:00").getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

/** Deterministic 6-char booking reference, clearly a demo hold. */
export function makeBookingRef(seed: number) {
  const alphabet = "ACDEFHJKLMNPQRTUVWXY2346789";
  let n = Math.abs(Math.floor(seed)) || 1;
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[n % alphabet.length];
    n = Math.floor(n / alphabet.length) + (i + 1) * 7 + seed % 13;
  }
  return `HN-${out}`;
}
