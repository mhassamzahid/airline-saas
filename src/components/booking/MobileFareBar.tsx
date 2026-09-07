"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { CaretUp, X } from "@phosphor-icons/react";
import { useQuote } from "@/lib/hooks";
import { formatGBP } from "@/lib/utils";
import { SummaryContent, FareHoldChip } from "./FareSummary";

export function MobileFareBar() {
  const quote = useQuote();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/95 backdrop-blur-md h-shadow-md safe-bottom lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between px-5 py-3 text-left"
        >
          <span className="flex items-center gap-2">
            <span className="text-[12px] uppercase tracking-[0.12em] text-muted">
              Total
            </span>
            <FareHoldChip />
          </span>
          <span className="flex items-center gap-2">
            <span data-numeric className="text-[18px] font-semibold text-ink">
              {formatGBP(quote.total)}
            </span>
            <CaretUp size={16} className="text-muted" />
          </span>
        </button>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px] lg:hidden"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                  className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[16px] border-t border-hairline bg-canvas p-5 safe-bottom lg:hidden"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Dialog.Title className="text-[15px] font-semibold text-ink">
                      Your fare
                    </Dialog.Title>
                    <Dialog.Close className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-canvas-soft hover:text-ink">
                      <X size={16} />
                    </Dialog.Close>
                  </div>
                  <SummaryContent />
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
}
