"use client";

import { DayPicker } from "react-day-picker";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { Field, TextInput } from "@/components/ui/Field";
import { DURATION_OPTIONS } from "@/data/umrah";
import { isoToDate, dateToIso, formatDateLong } from "@/lib/utils";
import { cn } from "@/lib/utils";

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

  const customValid = durationDays !== "custom" || (customDurationDays ?? 0) > 0;

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
        {durationDays === "custom" && (
          <div className="mt-4 max-w-[200px]">
            <Field label="Number of days">
              {(id) => (
                <TextInput
                  id={id}
                  type="number"
                  min={1}
                  value={customDurationDays ?? ""}
                  onChange={(e) => setCustomDurationDays(Number(e.target.value))}
                />
              )}
            </Field>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-[16px] font-semibold text-ink">Preferred travel date</h2>
        <div className="inline-block rounded-[10px] border border-hairline-firm bg-canvas-soft p-3">
          <DayPicker
            mode="single"
            numberOfMonths={1}
            selected={isoToDate(travelDate)}
            onSelect={(d) => setTravelDate(dateToIso(d ?? undefined))}
            disabled={{ before: today }}
            startMonth={today}
          />
        </div>
        <p className="mt-3 text-[13px] text-body">
          {travelDate ? formatDateLong(travelDate) : "Pick a date, or your best estimate"}
        </p>
      </div>
    </StepFrame>
  );
}
