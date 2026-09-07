"use client";

import { useState } from "react";
import { CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { makeBookingRef } from "@/lib/utils";

interface InquiryFormProps {
  /** What this inquiry is about; shown in the heading and the confirmation. */
  subject: string;
  /** e.g. "6 business days". Omit to skip the reply-time line. */
  leadTime?: string;
  /** Shows a group-size field when relevant (Hajj, group tours). Off by default. */
  askGroupSize?: boolean;
  className?: string;
}

/**
 * The shared terminal action for Archetypes B/C/D: a mock-submitted inquiry,
 * confirmed with the same `makeBookingRef()` reference the booking wizard's
 * fare hold uses: one funnel, whichever archetype got you here.
 */
export function InquiryForm({ subject, leadTime, askGroupSize = false, className }: InquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [size, setSize] = useState("");
  const [notes, setNotes] = useState("");
  const [ref, setRef] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const seed = name.length * 131 + email.length * 17 + (size ? Number(size) || 0 : 0) * 91 + subject.length;
    setRef(makeBookingRef(seed));
  }

  if (ref) {
    return (
      <div className={`rounded-[10px] border border-hairline bg-canvas p-6 h-shadow-raised sm:p-7 ${className ?? ""}`}>
        <CheckCircle size={28} weight="fill" className="text-success" />
        <h3 className="mt-3 text-[18px] font-semibold text-ink">Inquiry sent</h3>
        <p className="mt-1.5 max-w-[46ch] text-[14px] text-body">
          Reference <span data-numeric className="font-medium text-ink">{ref}</span>.
          {leadTime
            ? ` Our team will reply to ${email || "your email"} within ${leadTime}, usually much sooner.`
            : ` We'll reply to ${email || "your email"} shortly.`}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-[10px] border border-hairline bg-canvas p-6 h-shadow-raised sm:p-7 ${className ?? ""}`}
    >
      <h3 className="text-[16px] font-semibold text-ink">Send an inquiry</h3>
      <p className="mt-1 text-[13px] text-body">
        About {subject}.{leadTime ? ` We reply within ${leadTime}.` : ""}
      </p>
      <div className="mt-5 grid gap-4">
        <Field label="Your name">
          {(id) => (
            <TextInput id={id} required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          )}
        </Field>
        <Field label="Email">
          {(id) => (
            <TextInput
              id={id}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          )}
        </Field>
        {askGroupSize && (
          <Field label="Group size" hint="Approximate is fine">
            {(id) => (
              <TextInput
                id={id}
                type="number"
                min={1}
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 24"
              />
            )}
          </Field>
        )}
        <Field label="Anything else" hint="Optional: add anything you already know">
          {(id) => (
            <textarea
              id={id}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="field-input h-auto resize-none py-2.5"
            />
          )}
        </Field>
      </div>
      <Button type="submit" className="mt-5 w-full">
        <PaperPlaneTilt size={15} />
        Send inquiry
      </Button>
    </form>
  );
}
