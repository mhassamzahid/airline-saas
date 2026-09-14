"use client";

import {
  ShieldCheck,
  DeviceMobile,
  TShirt,
  UsersThree,
  ForkKnife,
} from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { ToggleRow } from "@/components/ui/Toggle";
import { ADDITIONAL_SERVICES } from "@/data/umrah";
import { formatGBP } from "@/lib/utils";
import type { AdditionalServiceKey } from "@/types";

const ICONS: Record<AdditionalServiceKey, React.ReactNode> = {
  insurance: <ShieldCheck size={18} weight="fill" />,
  sim: <DeviceMobile size={18} weight="fill" />,
  laundry: <TShirt size={18} weight="fill" />,
  guide: <UsersThree size={18} weight="fill" />,
  mealUpgrade: <ForkKnife size={18} weight="fill" />,
};

const PER_LABEL: Record<(typeof ADDITIONAL_SERVICES)[number]["per"], string> = {
  person: "per person",
  booking: "per booking",
  day: "per person, per day",
};

export function StepServices() {
  const { services, toggleService } = useBookingStore();

  return (
    <StepFrame
      title="Anything to add?"
      description="All optional. Skip this and continue if your package already has you covered."
    >
      <div className="space-y-3">
        {ADDITIONAL_SERVICES.map((s) => (
          <ToggleRow
            key={s.key}
            checked={services[s.key]}
            onChange={() => toggleService(s.key)}
            title={s.title}
            description={s.note}
            price={`${formatGBP(s.priceGBP)} ${PER_LABEL[s.per]}`}
            icon={ICONS[s.key]}
          />
        ))}
      </div>
    </StepFrame>
  );
}
