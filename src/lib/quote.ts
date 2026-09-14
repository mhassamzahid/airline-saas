import type { Quote } from "@/types";
import {
  VISA_PRICE_GBP,
  hotelById,
  roomSharingById,
  AIRPORT_TRANSFER_PRICE_GBP,
  transportTierById,
  ZIYARAT_PRICE_GBP,
  additionalServiceByKey,
} from "@/data/umrah";
import type { BookingState } from "@/store/useBookingStore";
import { effectiveDurationDays } from "@/store/useBookingStore";

export function headcount(p: BookingState["passengers"]) {
  return p.adults + p.children + p.infants;
}

/** Adults and children occupy rooms and pay for services; infants travel free. */
function payingHeadcount(p: BookingState["passengers"]) {
  return p.adults + p.children;
}

/** Nights split across the two cities -- more time in Makkah, the rest in Madinah. */
function nightSplit(totalDays: number) {
  const makkahNights = Math.max(1, Math.round(totalDays * 0.6));
  const madinahNights = Math.max(1, totalDays - makkahNights);
  return { makkahNights, madinahNights };
}

export function computeQuote(s: BookingState): Quote {
  const lines: Quote["lines"] = [];
  const heads = payingHeadcount(s.passengers);
  const days = effectiveDurationDays(s);
  const { makkahNights, madinahNights } = nightSplit(days);

  if (s.visaChoice === "include") {
    lines.push({
      id: "visa",
      label: "Umrah visa",
      detail: `${heads} ${heads === 1 ? "person" : "people"}`,
      amount: VISA_PRICE_GBP * heads,
    });
  }

  const rooms = Math.max(1, Math.ceil(heads / roomSharingById(s.roomSharing).divisor));
  const makkahHotel = s.makkahHotelId ? hotelById(s.makkahHotelId) : undefined;
  const madinahHotel = s.madinahHotelId ? hotelById(s.madinahHotelId) : undefined;

  if (makkahHotel) {
    lines.push({
      id: "makkah-hotel",
      label: makkahHotel.name,
      detail: `${makkahNights} nights x ${rooms} room${rooms > 1 ? "s" : ""}`,
      amount: makkahHotel.pricePerNightGBP * makkahNights * rooms,
    });
  }
  if (madinahHotel) {
    lines.push({
      id: "madinah-hotel",
      label: madinahHotel.name,
      detail: `${madinahNights} nights x ${rooms} room${rooms > 1 ? "s" : ""}`,
      amount: madinahHotel.pricePerNightGBP * madinahNights * rooms,
    });
  }

  if (s.airportTransfer) {
    lines.push({
      id: "airport-transfer",
      label: "Airport transfers",
      detail: "Arrival and departure",
      amount: AIRPORT_TRANSFER_PRICE_GBP * heads * 2,
    });
  }

  const transportTier = transportTierById(s.intercityTransport);
  lines.push({
    id: "intercity",
    label: transportTier.label,
    detail: "Jeddah, Makkah, Madinah circuit",
    amount: transportTier.priceGBP * heads,
  });

  if (s.ziyarat) {
    lines.push({
      id: "ziyarat",
      label: "Ziyarat tour",
      detail: `${heads} x ${formatGBPPlain(ZIYARAT_PRICE_GBP)}`,
      amount: ZIYARAT_PRICE_GBP * heads,
    });
  }

  for (const key of Object.keys(s.services) as (keyof BookingState["services"])[]) {
    if (!s.services[key]) continue;
    const service = additionalServiceByKey(key);
    const amount =
      service.per === "person"
        ? service.priceGBP * heads
        : service.per === "day"
          ? service.priceGBP * heads * days
          : service.priceGBP;
    lines.push({ id: `service-${key}`, label: service.title, amount });
  }

  const total = round2(lines.reduce((sum, l) => sum + l.amount, 0));

  return { lines, total };
}

/** 0-100, how close the enquiry is to being ready to submit. */
export function computeReadiness(s: BookingState): number {
  let done = 0;
  const total = 7;
  if (s.category) done++;
  if (s.travelDate) done++;
  if (headcount(s.passengers) > 0) done++;
  if (s.visaChoice) done++;
  if (s.makkahHotelId && s.madinahHotelId) done++;
  done++; // transport always has a default, counts as done
  done++; // additional services are optional, always "done"
  return Math.round((done / total) * 100);
}

function formatGBPPlain(n: number) {
  return `£${n}`;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
