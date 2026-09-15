"use client";

import { FileText, IdentificationCard } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { formatGBP } from "@/lib/utils";

export function StepVisa() {
  const { visaChoice, setVisaChoice, catalog } = useBookingStore();

  return (
    <StepFrame title="Umrah visa" description="Let us know if you need a visa arranged, or if you're already covered.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChoiceCard
          name="visa"
          value="include"
          selected={visaChoice === "include"}
          onSelect={() => setVisaChoice("include")}
        >
          <IdentificationCard size={22} className="text-rust-700" />
          <h3 className="mt-2 text-[16px] font-semibold text-ink">Include the visa</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-body">
            We handle the application and documentation for everyone in your party.
          </p>
          <p data-numeric className="mt-2 text-[13px] font-medium text-ink">
            {formatGBP(catalog.pricing.visaPriceGBP)} per person
          </p>
        </ChoiceCard>
        <ChoiceCard
          name="visa"
          value="skip"
          selected={visaChoice === "skip"}
          onSelect={() => setVisaChoice("skip")}
        >
          <FileText size={22} className="text-rust-700" />
          <h3 className="mt-2 text-[16px] font-semibold text-ink">I already have one</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-body">
            Skip visa processing. We'll ask for your visa details when we confirm.
          </p>
        </ChoiceCard>
      </div>
    </StepFrame>
  );
}
