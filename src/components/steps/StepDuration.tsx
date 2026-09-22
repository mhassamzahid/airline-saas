"use client";

import { DayPicker, type DateRange } from "react-day-picker";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { DURATION_OPTIONS } from "@/data/umrah";
import { isoToDate, dateToIso, formatDateLong, formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function StepDuration() {
  const {
    durationDays,
    customDurationDays,
    travelDate,
    setDuration,
    setCustomDurationDays,
    setTravelDate,
  } = useBookingStore();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCustom = durationDays === "custom";
  const customValid = !isCustom || (customDurationDays ?? 0) > 0;

  // The nights the trip actually covers: typed in for custom, fixed for
  // everything else. Either way, picking a start date should show the whole
  // span on the calendar, not just the one day clicked.
  const nights = isCustom ? customDurationDays : durationDays;

  const selectedFrom = isoToDate(travelDate);
  const selectedRange: DateRange | undefined = selectedFrom
    ? { from: selectedFrom, to: nights ? addDays(selectedFrom, nights) : undefined }
    : undefined;

  function onCustomRangeSelect(range: DateRange | undefined) {
    setTravelDate(dateToIso(range?.from));
    if (range?.from && range?.to) {
      const pickedNights = Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000);
      setCustomDurationDays(Math.max(1, pickedNights));
    }
  }

  // Fixed durations: only the start date is a real choice -- the end date is
  // implied by the duration, not picked -- but using range mode (rather than
  // single) is what makes the whole span highlight, matching custom's picker.
  function onFixedRangeSelect(range: DateRange | undefined) {
    setTravelDate(dateToIso(range?.from));
  }

  return (
    <StepFrame
      title="How long, and when?"
      description="Pick a trip length and your preferred travel date. Exact dates are confirmed with the sales team based on availability."
      canContinue={!!travelDate && customValid}
    >
      <div>
        <h2 className="mb-3 text-[16px] font-semibold text-ink">Duration</h2>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={cn(
                "rounded-[10px] border px-4 py-2.5 text-[14px] font-medium transition-all",
                durationDays === d
                  ? "is-selected bg-canvas text-ink"
                  : "border-hairline-firm bg-canvas-soft text-body hover:bg-canvas",
              )}
            >
              <span data-numeric>{d}</span> days
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDuration("custom")}
            className={cn(
              "rounded-[10px] border px-4 py-2.5 text-[14px] font-medium transition-all",
              durationDays === "custom"
                ? "is-selected bg-canvas text-ink"
                : "border-hairline-firm bg-canvas-soft text-body hover:bg-canvas",
            )}
          >
            Custom
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-[16px] font-semibold text-ink">
          {isCustom ? "Travel dates" : "Preferred travel date"}
        </h2>
        <div className="inline-block rounded-[10px] border border-hairline-firm bg-canvas-soft p-3">
          <DayPicker
            mode="range"
            numberOfMonths={1}
            selected={selectedRange}
            onSelect={isCustom ? onCustomRangeSelect : onFixedRangeSelect}
            disabled={{ before: today }}
            startMonth={today}
          />
        </div>
        <p className="mt-3 text-[13px] text-body">
          {travelDate
            ? nights
              ? `${formatDateLong(travelDate)} – ${formatDateShort(dateToIso(addDays(selectedFrom!, nights)))} · ${nights} night${nights === 1 ? "" : "s"}`
              : `${formatDateLong(travelDate)} — pick a return date`
            : isCustom
              ? "Pick a start and end date for your trip"
              : "Pick a date, or your best estimate"}
        </p>
      </div>
    </StepFrame>
  );
}
