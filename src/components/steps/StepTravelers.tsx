"use client";

import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { Stepper } from "@/components/ui/Stepper";
import { headcount } from "@/lib/quote";

const MAX_GROUP_SIZE = 20;

const PAX_ROWS = [
  { key: "adults" as const, label: "Adults", note: "12 and over", min: 1, max: MAX_GROUP_SIZE },
  { key: "children" as const, label: "Children", note: "2 to 11", min: 0, max: MAX_GROUP_SIZE },
  { key: "infants" as const, label: "Infants", note: "Under 2", min: 0, max: MAX_GROUP_SIZE },
];

export function StepTravelers() {
  const { passengers, setPassengers } = useBookingStore();
  const heads = headcount(passengers);
  const tooManyInfants = passengers.infants > passengers.adults;
  const tooLarge = heads > MAX_GROUP_SIZE;

  return (
    <StepFrame
      title="Who's travelling?"
      description="Add everyone in your party. Larger groups are welcome, just get in touch if you're bringing more than 20."
      canContinue={!tooManyInfants && !tooLarge}
    >
      <div className="max-w-[520px] divide-y divide-hairline rounded-[10px] border border-hairline-firm bg-canvas-soft">
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
      {tooLarge && (
        <p className="mt-3 text-[13px] text-danger">
          For groups over {MAX_GROUP_SIZE}, contact us directly and we'll put together a
          group quote.
        </p>
      )}
    </StepFrame>
  );
}
