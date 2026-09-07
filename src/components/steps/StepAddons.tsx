"use client";

import { motion } from "motion/react";
import { SuitcaseRolling, Leaf } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { StepFrame } from "@/components/booking/StepFrame";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { Stepper } from "@/components/ui/Stepper";
import { ToggleRow } from "@/components/ui/Toggle";
import { ADDON_CARDS, BAG_PRICE_GBP } from "@/data/extras";
import { formatGBP } from "@/lib/utils";

export function StepAddons() {
  const { extras, fare, toggleAddon, setCheckedBags, setCarbonOffset } = useBookingStore();

  const isOn = (key: "legroom" | "ziyarat" | "guide" | "flex") =>
    key === "flex"
      ? fare === "flex"
      : key === "legroom"
        ? extras.seatPref === "legroom"
        : extras[key];

  return (
    <StepFrame
      title="Anything to add?"
      description="All optional. Skip it and continue if your package already has you covered."
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-[16px] font-semibold text-ink">Checked baggage</h2>
          <div className="flex items-center justify-between gap-4 rounded-[10px] border border-hairline-firm bg-canvas-soft p-4">
            <div className="flex items-start gap-3">
              <SuitcaseRolling size={18} className="mt-0.5 text-rust-700" />
              <div>
                <p className="text-[15px] font-medium text-ink">Extra bags, 23kg each</p>
                <p data-numeric className="text-[13px] text-muted">
                  {formatGBP(BAG_PRICE_GBP)} per bag, handy for Zamzam water on the way home
                </p>
              </div>
            </div>
            <Stepper
              label="checked bag"
              value={extras.checkedBags}
              min={0}
              max={5}
              onChange={setCheckedBags}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[16px] font-semibold text-ink">Umrah extras</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ADDON_CARDS.map((a, i) => (
              <motion.div
                key={a.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <PhotoCard
                  multi
                  name={`addon-${a.key}`}
                  value={a.key}
                  image={a.image}
                  alt={a.title}
                  selected={isOn(a.key)}
                  onSelect={() => toggleAddon(a.key)}
                  imageAspect="aspect-[16/9]"
                  overlay={
                    <div>
                      <p className="text-[15px] font-semibold text-on-dark">{a.title}</p>
                      <p className="text-[12px] text-on-dark/75">{a.note}</p>
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>
        </section>

        <ToggleRow
          checked={extras.carbonOffset}
          onChange={setCarbonOffset}
          title="Verified carbon removal"
          description="A contribution to permanent removal, on top of the fuel we already offset. From £8 per person."
          icon={<Leaf size={18} weight="fill" />}
        />
      </div>
    </StepFrame>
  );
}
