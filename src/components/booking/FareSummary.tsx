"use client";

import { motion } from "motion/react";
import { AirplaneTakeoff, ArrowRight, Clock } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { useQuote, useFareHold, useReadiness } from "@/lib/hooks";
import { destinationByCode, originByCode } from "@/data/airports";
import { cabinById } from "@/data/cabins";
import { windowById } from "@/data/flights";
import { Photo } from "@/components/ui/Photo";
import { formatGBP, formatDateShort } from "@/lib/utils";
import { headcount } from "@/lib/quote";

export function FareHoldChip() {
  const { active, label, expired } = useFareHold();
  if (!active) return null;
  return (
    <span
      aria-live="polite"
      className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-2.5 py-1 text-[12px] font-medium text-warning"
    >
      <Clock size={13} weight="fill" />
      {expired ? "Fare refreshed" : <span data-numeric>Held {label}</span>}
    </span>
  );
}

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
  const origin = originByCode(s.from);
  const dest = s.to ? destinationByCode(s.to) : undefined;
  const heads = headcount(s.passengers);

  return (
    <div>
      {dest ? (
        <Photo
          src={dest.image}
          alt={dest.city}
          sizes="360px"
          className="mb-3 aspect-[16/9] rounded-[10px] border border-hairline"
        >
          <div className="photo-caption absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-dark/80 to-transparent p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-on-dark/70">
              {origin?.city} to
            </p>
            <p className="text-[16px] font-semibold text-on-dark">{dest.city}</p>
          </div>
        </Photo>
      ) : (
        <p className="mb-3 text-[13px] text-muted">Pick a destination to start.</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <span data-numeric>{s.from}</span>
          <ArrowRight size={15} className="text-muted" />
          <span data-numeric>{s.to ?? "..."}</span>
        </div>
        <FareHoldChip />
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
        <Row
          label="Dates"
          value={
            s.departDate
              ? `${formatDateShort(s.departDate)}${
                  s.tripType === "return" && s.returnDate
                    ? ` to ${formatDateShort(s.returnDate)}`
                    : ""
                }`
              : "Not set"
          }
        />
        <Row label="Travellers" value={`${heads} ${heads === 1 ? "person" : "people"}`} />
        <Row label="Cabin" value={cabinById(s.cabin).name} />
        {s.outboundWindow && (
          <Row label="Outbound" value={`${windowById(s.outboundWindow).label} · ${s.outboundFlight?.dep.time}`} />
        )}
        {s.tripType === "return" && s.inboundWindow && (
          <Row label="Return" value={`${windowById(s.inboundWindow).label} · ${s.inboundFlight?.dep.time}`} />
        )}
        {s.fare === "flex" && <Row label="Fare" value="Fully flexible" />}
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
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[13px] text-body">Taxes and carrier charges</span>
          <span data-numeric className="text-[13px] text-ink">{formatGBP(quote.taxes)}</span>
        </div>
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
        For {heads} {heads === 1 ? "traveller" : "travellers"}, all taxes included
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
            <AirplaneTakeoff size={14} weight="fill" className="text-rust-700" />
            Your fare
          </div>
          <SummaryContent />
        </div>
        <p className="mt-3 px-1 text-[12px] leading-relaxed text-muted">
          Prices update as you choose. Nothing is charged until you confirm and pay.
        </p>
      </div>
    </aside>
  );
}
