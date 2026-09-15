"use client";

import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { ChoiceCard } from "@/components/ui/ChoiceCard";

export function StepCategory() {
  const { category, setCategory, catalog } = useBookingStore();

  return (
    <StepFrame
      title="Which category?"
      description="Sets your starting point for hotel class and what's included. You can fine-tune each part later."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {catalog.categories.map((c) => (
          <ChoiceCard
            key={c.id}
            name="category"
            value={c.id}
            selected={category === c.id}
            onSelect={() => setCategory(c.id)}
          >
            <h3 className="text-[16px] font-semibold text-ink">{c.name}</h3>
            <p className="mt-1 text-[13px] font-medium text-rust-700">{c.strap}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-body">{c.description}</p>
          </ChoiceCard>
        ))}
      </div>
    </StepFrame>
  );
}
