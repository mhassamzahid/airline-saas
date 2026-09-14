"use client";

import { useBookingStore, effectiveDurationDays } from "@/store/useBookingStore";
import { useQuote } from "@/lib/hooks";
import { StepFrame } from "@/components/booking/StepFrame";
import { categoryById, hotelById, roomSharingById, transportTierById } from "@/data/umrah";
import { formatGBP, formatDateLong } from "@/lib/utils";
import { headcount } from "@/lib/quote";

export function StepReviewQuote() {
  const s = useBookingStore();
  const quote = useQuote();
  const heads = headcount(s.passengers);
  const days = effectiveDurationDays(s);
  const makkahHotel = s.makkahHotelId ? hotelById(s.makkahHotelId) : undefined;
  const madinahHotel = s.madinahHotelId ? hotelById(s.madinahHotelId) : undefined;

  const chips = [
    categoryById(s.category).name,
    s.visaChoice === "include" ? "Visa included" : "Visa not included",
    roomSharingById(s.roomSharing).label,
    transportTierById(s.intercityTransport).label,
    s.airportTransfer ? "Airport transfers" : null,
    s.ziyarat ? "Ziyarat tour" : null,
  ].filter(Boolean);

  return (
    <StepFrame
      title="Review your trip"
      description="Check everything below. Go back to any step to change something before you submit."
    >
      <div className="space-y-6">
        <div className="divide-y divide-hairline rounded-[10px] border border-hairline-firm bg-canvas-soft">
          <Row label="Duration" value={`${days} days`} />
          <Row label="Travel date" value={s.travelDate ? formatDateLong(s.travelDate) : "Not set"} />
          <Row label="Travellers" value={`${heads} ${heads === 1 ? "person" : "people"}`} />
          {makkahHotel && <Row label="Makkah hotel" value={makkahHotel.name} />}
          {madinahHotel && <Row label="Madinah hotel" value={madinahHotel.name} />}
        </div>

        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip as string}
              className="rounded-full border border-hairline-firm bg-canvas-soft px-2.5 py-1 text-[12px] text-body"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="rounded-[10px] border border-hairline bg-canvas-sink p-4">
          <div className="space-y-1.5">
            {quote.lines.map((l) => (
              <div key={l.id} className="flex items-baseline justify-between gap-4 text-[13px]">
                <span className="text-body">
                  {l.label}
                  {l.detail && <span className="text-muted"> · {l.detail}</span>}
                </span>
                <span data-numeric className="text-ink">
                  {formatGBP(l.amount)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-hairline-firm pt-3">
            <span className="text-[15px] font-semibold text-ink">Estimated total</span>
            <span data-numeric className="text-[20px] font-semibold text-ink">
              {formatGBP(quote.total)}
            </span>
          </div>
        </div>
        <p className="text-[12px] text-muted">
          This is an estimate. Our sales team confirms the actual price and availability
          before anything is booked.
        </p>
      </div>
    </StepFrame>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 p-4">
      <span className="text-[13px] text-body">{label}</span>
      <span data-numeric className="text-right text-[13px] text-ink">
        {value}
      </span>
    </div>
  );
}
