"use client";

import { motion } from "motion/react";
import { ClipboardText } from "@phosphor-icons/react";
import { useBookingStore, effectiveDurationDays } from "@/store/useBookingStore";
import { useQuote, useReadiness } from "@/lib/hooks";
import { categoryById, hotelById, roomSharingById } from "@/data/umrah";
import { formatGBP, formatDateShort } from "@/lib/utils";
import { headcount } from "@/lib/quote";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-[13px] text-body">{label}</span>
      <span data-numeric className="text-right text-[13px] text-ink">
        {value}
      </span>
    </div>
  );
}

export function SummaryContent() {
  const s = useBookingStore();
  const quote = useQuote();
  const readiness = useReadiness();
  const heads = headcount(s.passengers);
  const days = effectiveDurationDays(s);
  const makkahHotel = s.makkahHotelId ? hotelById(s.makkahHotelId) : undefined;
  const madinahHotel = s.madinahHotelId ? hotelById(s.madinahHotelId) : undefined;

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-ink">{categoryById(s.category).name} Umrah</span>
      </div>

      {/* Readiness */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[12px] text-muted">
          <span>Trip ready</span>
          <span data-numeric>{readiness}%</span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-canvas-sink">
          <motion.div
            className="h-full rounded-full bg-rust-500"
            initial={false}
            animate={{ width: `${readiness}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="mt-4 divide-y divide-hairline border-y border-hairline">
        <Row label="Duration" value={`${days} days`} />
        <Row label="Travel date" value={s.travelDate ? formatDateShort(s.travelDate) : "Not set"} />
        <Row label="Travellers" value={`${heads} ${heads === 1 ? "person" : "people"}`} />
        {makkahHotel && <Row label="Makkah" value={makkahHotel.name} />}
        {madinahHotel && <Row label="Madinah" value={madinahHotel.name} />}
        <Row label="Room sharing" value={roomSharingById(s.roomSharing).label} />
      </div>

      <div className="mt-4 space-y-1.5">
        {quote.lines.map((line) => (
          <div key={line.id} className="flex items-baseline justify-between gap-4">
            <span className="text-[13px] text-body">{line.label}</span>
            <span data-numeric className="text-[13px] text-ink">
              {formatGBP(line.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-baseline justify-between border-t border-hairline-firm pt-3">
        <span className="text-[15px] font-semibold text-ink">Total</span>
        <div className="text-right">
          <motion.span
            key={quote.total}
            data-numeric
            initial={{ y: -3, opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="block text-[20px] font-semibold text-ink"
          >
            {formatGBP(quote.total)}
          </motion.span>
        </div>
      </div>
      <p className="mt-1 text-right text-[12px] text-muted">
        For {heads} {heads === 1 ? "traveller" : "travellers"}, an estimate only
      </p>
    </div>
  );
}

export function FareSummary() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[88px]">
        <div className="card p-5 h-shadow-raised">
          <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            <ClipboardText size={14} weight="fill" className="text-rust-700" />
            Your quote
          </div>
          <SummaryContent />
        </div>
        <p className="mt-3 px-1 text-[12px] leading-relaxed text-muted">
          Prices update as you choose. Our sales team confirms the final price and
          availability.
        </p>
      </div>
    </aside>
  );
}
