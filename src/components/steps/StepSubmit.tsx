"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { useQuote } from "@/lib/hooks";
import { StepFrame } from "@/components/booking/StepFrame";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { formatGBP } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Confirmation() {
  const { submittedRef, contact, reset } = useBookingStore();
  const reduce = useReducedMotion();

  // Submitting doesn't change currentStep (it swaps content in place), so
  // BookingShell's step-change scroll effect never fires here -- do it
  // ourselves so the confirmation isn't left below the fold.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <CheckCircle size={30} weight="fill" className="text-success" />
      <h1 className="mt-3 text-[26px] font-semibold text-ink">Inquiry sent</h1>
      <p className="mt-2 max-w-[52ch] text-[15px] text-body">
        Our sales team will follow up by WhatsApp, email or phone to confirm the
        actual price and availability, usually within 2 business days.
      </p>

      <dl className="mt-6 grid gap-px overflow-hidden rounded-[10px] border border-hairline bg-hairline sm:grid-cols-2">
        <div className="bg-canvas-soft p-4">
          <dt className="text-[12px] uppercase tracking-[0.1em] text-muted">Reference</dt>
          <dd data-numeric className="mt-1 text-[16px] font-semibold text-ink">
            {submittedRef}
          </dd>
        </div>
        <div className="bg-canvas-soft p-4">
          <dt className="text-[12px] uppercase tracking-[0.1em] text-muted">We'll reach you at</dt>
          <dd className="mt-1 text-[16px] font-semibold text-ink">
            {contact.phone || contact.email}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex justify-center">
        <Button variant="secondary" onClick={reset}>
          Plan another trip
        </Button>
      </div>
    </motion.div>
  );
}

export function StepSubmit() {
  const { contact, setContact, back, submitInquiry, submittedRef } = useBookingStore();
  const quote = useQuote();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  if (submittedRef) return <Confirmation />;

  const nameError = touched.name && contact.name.trim().length < 2 ? "Enter your name" : undefined;
  const phoneError = touched.phone && contact.phone.trim().length < 5 ? "Enter a phone or WhatsApp number" : undefined;
  const emailError =
    touched.email && contact.email.trim() && !EMAIL_RE.test(contact.email)
      ? "Enter a valid email address"
      : undefined;
  const canSubmit =
    contact.name.trim().length >= 2 &&
    contact.phone.trim().length >= 5 &&
    (!contact.email.trim() || EMAIL_RE.test(contact.email));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    submitInquiry();
  }

  return (
    <StepFrame
      title="Submit your inquiry"
      description="Add your details and we'll come back with the confirmed price and availability."
      hideFooter
    >
      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={nameError} className="sm:col-span-2">
            {(id) => (
              <TextInput
                id={id}
                autoComplete="name"
                value={contact.name}
                onChange={(e) => setContact({ name: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />
            )}
          </Field>
          <Field label="Phone / WhatsApp" error={phoneError}>
            {(id) => (
              <TextInput
                id={id}
                type="tel"
                autoComplete="tel"
                value={contact.phone}
                onChange={(e) => setContact({ phone: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              />
            )}
          </Field>
          <Field label="Email" error={emailError} hint="Optional: for a written confirmation too">
            {(id) => (
              <TextInput
                id={id}
                type="email"
                autoComplete="email"
                value={contact.email}
                onChange={(e) => setContact({ email: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
            )}
          </Field>
        </div>

        <div className="flex items-baseline justify-between border-t border-hairline-firm pt-4">
          <span className="text-[15px] font-semibold text-ink">Estimated total</span>
          <span data-numeric className="text-[20px] font-semibold text-ink">
            {formatGBP(quote.total)}
          </span>
        </div>

        <div className="flex flex-col gap-3 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" onClick={back} className="sm:w-auto">
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button type="submit" disabled={!canSubmit} className="sm:w-auto">
            <PaperPlaneTilt size={16} />
            Submit inquiry
          </Button>
        </div>
        <p className="text-center text-[12px] text-muted sm:text-right">
          Nothing is charged here. This is a prototype, so the inquiry won't actually reach
          a sales team.
        </p>
      </form>
    </StepFrame>
  );
}
