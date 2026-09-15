"use client";

import { Car, MapPin } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { ToggleRow } from "@/components/ui/Toggle";
import { formatGBP, cn } from "@/lib/utils";

export function StepTransport() {
  const {
    airportTransfer,
    intercityTransport,
    ziyarat,
    setAirportTransfer,
    setIntercityTransport,
    setZiyarat,
    catalog,
  } = useBookingStore();

  return (
    <StepFrame title="Getting around" description="Transfers and travel between Jeddah, Makkah and Madinah.">
      <div className="space-y-8">
        <ToggleRow
          checked={airportTransfer}
          onChange={setAirportTransfer}
          title="Airport transfers"
          description="Jeddah airport to your hotel, and back for departure"
          price={`${formatGBP(catalog.pricing.airportTransferPriceGBP)} per person, each way`}
          icon={<MapPin size={18} weight="fill" />}
        />

        <div>
          <h2 className="mb-3 text-[16px] font-semibold text-ink">Intercity transport</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {catalog.transportTiers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setIntercityTransport(t.id)}
                className={cn(
                  "rounded-[10px] border p-4 text-left transition-all",
                  intercityTransport === t.id
                    ? "is-selected bg-canvas"
                    : "border-hairline-firm bg-canvas-soft hover:bg-canvas",
                )}
              >
                <Car size={18} className="text-rust-700" />
                <p className="mt-2 text-[15px] font-medium text-ink">{t.label}</p>
                <p className="mt-0.5 text-[13px] text-muted">{t.note}</p>
                <p data-numeric className="mt-2 text-[13px] font-medium text-ink">
                  {formatGBP(t.priceGBP)} per person
                </p>
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          checked={ziyarat}
          onChange={setZiyarat}
          title="Ziyarat tour"
          description="A guided half-day around the historical sites of Makkah and Madinah"
          price={`${formatGBP(catalog.pricing.ziyaratPriceGBP)} per person`}
          icon={<MapPin size={18} weight="fill" />}
        />
      </div>
    </StepFrame>
  );
}
