"use client";

import { DayPicker, type DateRange } from "react-day-picker";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { Stepper } from "@/components/ui/Stepper";
import { destinationByCode, originByCode } from "@/data/airports";
import {
  isoToDate,
  dateToIso,
  formatDateLong,
  nightsBetween,
} from "@/lib/utils";
import { headcount } from "@/lib/quote";

const PAX_ROWS = [
  { key: "adults" as const, label: "Adults", note: "16 and over", min: 1, max: 9 },
  { key: "children" as const, label: "Children", note: "2 to 15", min: 0, max: 8 },
  { key: "infants" as const, label: "Infants", note: "Under 2, on a lap", min: 0, max: 4 },
];

export function StepWhenWho() {
  const {
    from,
    to,
    tripType,
    departDate,
    returnDate,
    passengers,
    setDepartDate,
    setReturnDate,
    setPassengers,
  } = useBookingStore();

  const dest = to ? destinationByCode(to) : undefined;
  const origin = originByCode(from);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const range: DateRange | undefined = departDate
    ? { from: isoToDate(departDate), to: isoToDate(returnDate) }
    : undefined;
  const single = isoToDate(departDate);
  const nights = nightsBetween(departDate, returnDate);
  const heads = headcount(passengers);
  const tooManyInfants = passengers.infants > passengers.adults;

  const datesReady = tripType === "return" ? !!departDate && !!returnDate : !!departDate;

  return (
    <StepFrame
      title="When, and who with?"
      description={`Your dates and group size for ${dest?.city ?? "your package"}, departing ${origin?.city ?? "the UK"}.`}
      canContinue={datesReady && !tooManyInfants && heads <= 9}
    >
      <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
        <div>
          <div className="inline-block rounded-[10px] border border-hairline-firm bg-canvas-soft p-3">
            {tripType === "return" ? (
              <DayPicker
                mode="range"
                numberOfMonths={1}
                selected={range}
                onSelect={(r) => {
                  setDepartDate(dateToIso(r?.from));
                  setReturnDate(dateToIso(r?.to));
                }}
                disabled={{ before: today }}
                startMonth={today}
              />
            ) : (
              <DayPicker
                mode="single"
                numberOfMonths={1}
                selected={single}
                onSelect={(d) => setDepartDate(dateToIso(d ?? undefined))}
                disabled={{ before: today }}
                startMonth={today}
              />
            )}
          </div>
          <p className="mt-3 text-[13px] text-body">
            {departDate ? formatDateLong(departDate) : "Pick your outbound date"}
            {tripType === "return" && (
              <>
                {" "}
                <span className="text-muted">to</span>{" "}
                {returnDate ? formatDateLong(returnDate) : "…"}
                {nights > 0 && (
                  <span data-numeric className="text-muted"> · {nights} nights</span>
                )}
              </>
            )}
          </p>
        </div>

        <div>
          <h2 className="mb-1 text-[16px] font-semibold text-ink">Travellers</h2>
          <p className="mb-3 text-[13px] text-muted">
            Fares and taxes are worked out per person.
          </p>
          <div className="divide-y divide-hairline rounded-[10px] border border-hairline-firm bg-canvas-soft">
            {PAX_ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-[15px] font-medium text-ink">{row.label}</p>
                  <p className="text-[13px] text-muted">{row.note}</p>
                </div>
                <Stepper
                  label={row.label.toLowerCase()}
                  value={passengers[row.key]}
                  min={row.min}
                  max={row.max}
                  onChange={(v) => setPassengers({ [row.key]: v })}
                />
              </div>
            ))}
          </div>
          {tooManyInfants && (
            <p className="mt-3 text-[13px] text-danger">
              Each infant travels with an adult. Add an adult or remove an infant.
            </p>
          )}
        </div>
      </div>
    </StepFrame>
  );
}
