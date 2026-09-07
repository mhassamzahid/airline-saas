import type { Quote, QuoteLine } from "@/types";
import { airportByCode, originByCode } from "@/data/airports";
import { cabinById } from "@/data/cabins";
import { fareById } from "@/data/fares";
import {
  BAG_PRICE_GBP,
  ZIYARAT_PRICE_GBP,
  GUIDE_PRICE_GBP,
  LEGROOM_PRICE_PER_DIRECTION,
  OFFSET_PRICE_PER_PAX_PER_DIRECTION,
} from "@/data/extras";
import type { BookingState } from "@/store/useBookingStore";

const PAX_WEIGHT = { adults: 1, children: 0.75, infants: 0.1 };
const TAX_RATE = 0.166;
const CARRIER_CHARGE_PER_PAX = 42;

export function payingWeight(p: BookingState["passengers"]) {
  return (
    p.adults * PAX_WEIGHT.adults +
    p.children * PAX_WEIGHT.children +
    p.infants * PAX_WEIGHT.infants
  );
}

export function headcount(p: BookingState["passengers"]) {
  return p.adults + p.children + p.infants;
}

export function computeQuote(s: BookingState): Quote {
  const dest = s.to ? airportByCode(s.to) : undefined;
  const directions = s.tripType === "return" ? 2 : 1;
  const weight = payingWeight(s.passengers);
  const heads = headcount(s.passengers);

  const lines: QuoteLine[] = [];

  const cabin = cabinById(s.cabin);
  const routeBase = (dest?.baseFareGBP ?? 0) * cabin.multiplier;
  const baseFare = routeBase * directions * weight;
  lines.push({
    id: "fare",
    label: `${cabin.name} fare`,
    detail: `${s.tripType === "return" ? "Return" : "One way"} · ${formatPax(s.passengers)}`,
    amount: baseFare,
  });

  const origin = originByCode(s.from);
  if (origin && origin.adjustmentGBP !== 0) {
    lines.push({
      id: "origin",
      label: `Departing ${origin.city}`,
      detail: "Base adjustment",
      amount: origin.adjustmentGBP * directions * weight,
    });
  }

  const flightDelta =
    ((s.outboundFlight?.priceGBP ?? 0) +
      (s.tripType === "return" ? s.inboundFlight?.priceGBP ?? 0 : 0)) *
    weight;
  if (flightDelta !== 0) {
    lines.push({
      id: "flights",
      label: "Departure times",
      amount: flightDelta,
    });
  }

  if (s.fare === "flex") {
    lines.push({
      id: "flex",
      label: "Fully flexible",
      detail: "Free changes and cancellation",
      amount: fareById("flex").addPerDirection * directions * weight,
    });
  }

  if (s.extras.checkedBags > 0) {
    lines.push({
      id: "bags",
      label: "Extra checked bags",
      detail: `${s.extras.checkedBags} x £${BAG_PRICE_GBP}`,
      amount: s.extras.checkedBags * BAG_PRICE_GBP,
    });
  }
  if (s.extras.seatPref === "legroom") {
    lines.push({
      id: "seat",
      label: "Extra legroom",
      detail: `${heads} seated · ${directions === 2 ? "both flights" : "one flight"}`,
      amount: LEGROOM_PRICE_PER_DIRECTION * directions * heads,
    });
  }
  if (s.extras.ziyarat) {
    lines.push({
      id: "ziyarat",
      label: "Ziyarat tour",
      detail: `${heads} x £${ZIYARAT_PRICE_GBP}`,
      amount: heads * ZIYARAT_PRICE_GBP,
    });
  }
  if (s.extras.guide) {
    lines.push({ id: "guide", label: "Private guide", amount: GUIDE_PRICE_GBP });
  }
  if (s.extras.carbonOffset) {
    lines.push({
      id: "offset",
      label: "Verified carbon removal",
      detail: "Added to each ticket",
      amount: OFFSET_PRICE_PER_PAX_PER_DIRECTION * directions * heads,
    });
  }

  const preTax = lines.reduce((sum, l) => sum + l.amount, 0);
  const taxes = preTax * TAX_RATE + CARRIER_CHARGE_PER_PAX * heads;

  return {
    lines,
    taxes: round2(taxes),
    total: round2(preTax + taxes),
  };
}

/** 0-100, how close the trip is to being ready to hold. */
export function computeReadiness(s: BookingState): number {
  let done = 0;
  const total = 6;
  if (s.to) done++;
  if (s.departDate && (s.tripType === "oneway" || s.returnDate)) done++;
  if (s.cabin) done++;
  if (s.outboundFlight && (s.tripType === "oneway" || s.inboundFlight)) done++;
  done++; // add-ons are optional, always "done"
  if (s.contact.name.trim() && s.contact.email.trim()) done++;
  return Math.round((done / total) * 100);
}

function formatPax(p: BookingState["passengers"]) {
  const parts: string[] = [];
  if (p.adults) parts.push(`${p.adults} adult${p.adults > 1 ? "s" : ""}`);
  if (p.children) parts.push(`${p.children} child${p.children > 1 ? "ren" : ""}`);
  if (p.infants) parts.push(`${p.infants} infant${p.infants > 1 ? "s" : ""}`);
  return parts.join(", ") || "1 adult";
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
