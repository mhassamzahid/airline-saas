"use client";

import { Star } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { PhotoCard } from "@/components/ui/PhotoCard";
import type { HotelDef } from "@/data/umrah";
import { formatGBP, cn } from "@/lib/utils";

function HotelGrid({
  title,
  hotels,
  selectedId,
  onSelect,
}: {
  title: string;
  hotels: HotelDef[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-3 text-[16px] font-semibold text-ink">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {hotels.map((h) => (
          <PhotoCard
            key={h.id}
            name={`hotel-${title}`}
            value={h.id}
            image={h.image}
            alt={h.name}
            selected={selectedId === h.id}
            onSelect={() => onSelect(h.id)}
            imageAspect="aspect-[16/10]"
            overlay={
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: h.stars }).map((_, i) => (
                    <Star key={i} size={12} weight="fill" className="text-on-dark" />
                  ))}
                </div>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold leading-tight text-on-dark">{h.name}</h3>
                    <p className="text-[12px] text-on-dark/75">{h.distance}</p>
                  </div>
                  <p data-numeric className="shrink-0 text-[13px] font-semibold text-on-dark">
                    {formatGBP(h.pricePerNightGBP)}/night
                  </p>
                </div>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

export function StepHotels() {
  const {
    category,
    makkahHotelId,
    madinahHotelId,
    roomSharing,
    setMakkahHotel,
    setMadinahHotel,
    setRoomSharing,
    catalog,
  } = useBookingStore();

  const makkahOptions = catalog.hotels.filter((h) => h.city === "Makkah" && h.categories.includes(category));
  const madinahOptions = catalog.hotels.filter((h) => h.city === "Madinah" && h.categories.includes(category));

  return (
    <StepFrame
      title="Choose your hotels"
      description="Filtered to your category. Pick one in each city, then how you'd like to share a room."
      canContinue={!!makkahHotelId && !!madinahHotelId}
    >
      <div className="space-y-8">
        <HotelGrid
          title="Makkah"
          hotels={makkahOptions}
          selectedId={makkahHotelId}
          onSelect={setMakkahHotel}
        />
        <HotelGrid
          title="Madinah"
          hotels={madinahOptions}
          selectedId={madinahHotelId}
          onSelect={setMadinahHotel}
        />

        <div>
          <h2 className="mb-3 text-[16px] font-semibold text-ink">Room sharing</h2>
          <div className="flex flex-wrap gap-2">
            {catalog.roomSharingOptions.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoomSharing(r.id)}
                className={cn(
                  "rounded-[10px] border px-4 py-2.5 text-left text-[14px] transition-all",
                  roomSharing === r.id
                    ? "is-selected bg-canvas"
                    : "border-hairline-firm bg-canvas-soft hover:bg-canvas",
                )}
              >
                <span className="block font-medium text-ink">{r.label}</span>
                <span className="block text-[12px] text-muted">{r.note}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </StepFrame>
  );
}
