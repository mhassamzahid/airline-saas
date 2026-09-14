"use client";

import { useState } from "react";
import { CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { makeBookingRef } from "@/lib/utils";

interface ContactFormProps {
  className?: string;
}

/**
 * A general-enquiries contact form: name, email, phone, message. Same
 * mock-submit pattern as `InquiryForm` (a `makeBookingRef()` reference), but
 * without the "about a specific subject" framing -- this is for the Contact
 * block, a standalone module rather than one embedded at the end of a
 * specific service page.
 */
export function ContactForm({ className }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [ref, setRef] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const seed = name.length * 131 + email.length * 17 + phone.length * 53 + message.length * 7;
    setRef(makeBookingRef(seed));
  }

  if (ref) {
    return (
      <div className={className}>
        <CheckCircle size={28} weight="fill" className="text-success" />
        <h3 className="mt-3 text-[18px] font-semibold text-ink">Message sent</h3>
        <p className="mt-1.5 max-w-[46ch] text-[14px] text-body">
          Reference <span data-numeric className="font-medium text-ink">{ref}</span>. We&rsquo;ll reply to{" "}
          {email || "your email"} shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={className}>
      <div className="grid gap-4">
        <Field label="Full name">
          {(id) => (
            <TextInput id={id} required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          )}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
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
          <Field label="Phone number">
            {(id) => (
              <TextInput
                id={id}
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            )}
          </Field>
        </div>
        <Field label="Message">
          {(id) => (
            <textarea
              id={id}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="field-input h-auto resize-none py-2.5"
            />
          )}
        </Field>
      </div>
      <Button type="submit" className="mt-5">
        <PaperPlaneTilt size={15} />
        Send message
      </Button>
    </form>
  );
}
