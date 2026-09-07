"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { DEPARTURE_WINDOWS, flightFor, type DepartureWindowId } from "@/data/flights";
import { destinationByCode, originByCode } from "@/data/airports";
import { formatGBP } from "@/lib/utils";

function Leg({
  title,
  from,
  to,
  selected,
  onSelect,
}: {
  title: string;
  from: string;
  to: string;
  selected: DepartureWindowId | null;
  onSelect: (w: DepartureWindowId) => void;
}) {
  const flights = useMemo(
    () => DEPARTURE_WINDOWS.map((w) => ({ w, f: flightFor(from, to, w.id) })),
    [from, to],
  );

  return (
    <section>
      <h2 className="mb-3 text-[16px] font-semibold text-ink">{title}</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {flights.map(({ w, f }, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <PhotoCard
              name={`dep-${from}-${to}`}
              value={w.id}
              image={w.image}
              alt={`${w.label} departure`}
              selected={selected === w.id}
              onSelect={() => onSelect(w.id)}
              imageAspect="aspect-[5/4]"
              overlay={
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[15px] font-semibold leading-tight text-on-dark">
                      {w.label}
                    </p>
                    <p data-numeric className="text-[12px] text-on-dark/80">
                      dep {f.dep.time}
                      {f.stops > 0 && <span className="text-on-dark/60"> · 1 stop</span>}
                    </p>
                  </div>
                  <p data-numeric className="shrink-0 text-[12px] font-medium text-on-dark/90">
                    {f.priceGBP === 0
                      ? "incl."
                      : `${f.priceGBP > 0 ? "+" : "-"}${formatGBP(Math.abs(f.priceGBP))}`}
                  </p>
                </div>
              }
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function StepDeparture() {
  const {
    from,
    to,
    tripType,
    outboundWindow,
    inboundWindow,
    setOutboundWindow,
    setInboundWindow,
  } = useBookingStore();

  const origin = originByCode(from);
  const dest = to ? destinationByCode(to) : undefined;
  const canContinue = !!outboundWindow && (tripType === "oneway" || !!inboundWindow);

  if (!to) return null;

  return (
    <StepFrame
      title="Pick your departures"
      description="Choose a time of day and we put you on that flight. All times local."
      canContinue={canContinue}
    >
      <div className="space-y-8">
        <Leg
          title={`${origin?.city} to ${dest?.airportCity ?? dest?.city}`}
          from={from}
          to={to}
          selected={outboundWindow}
          onSelect={setOutboundWindow}
        />
        {tripType === "return" && (
          <Leg
            title={`${dest?.airportCity ?? dest?.city} to ${origin?.city}`}
            from={to}
            to={from}
            selected={inboundWindow}
            onSelect={setInboundWindow}
          />
        )}
      </div>
    </StepFrame>
  );
}
