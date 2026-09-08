"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle,
  AirplaneTakeoff,
  AirplaneLanding,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { useBookingStore } from "@/store/useBookingStore";
import { useQuote, useFareHold } from "@/lib/hooks";
import { StepFrame } from "@/components/booking/StepFrame";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { Photo } from "@/components/ui/Photo";
import { destinationByCode, originByCode } from "@/data/airports";
import { cabinById } from "@/data/cabins";
import { windowById } from "@/data/flights";
import type { FlightOption, TripType } from "@/types";
import { formatGBP, formatDateLong, formatDuration } from "@/lib/utils";
import { headcount } from "@/lib/quote";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Reserved by Ofcom for fictitious use (film/TV/drama); never a real, dialable number. */
const HALCYON_WHATSAPP_NUMBER = "442079460100";

function whatsAppText(args: {
  destCity?: string;
  originCity?: string;
  departDate?: string;
  returnDate?: string;
  tripType: TripType;
  heads: number;
  cabinName: string;
  total: number;
  contactName: string;
}) {
  return [
    "Hi, I'd like to talk about my Umrah booking.",
    args.destCity && `Package: ${args.destCity}`,
    args.originCity && `Departing: ${args.originCity}`,
    args.departDate && `Depart: ${formatDateLong(args.departDate)}`,
    args.tripType === "return" && args.returnDate && `Return: ${formatDateLong(args.returnDate)}`,
    `Travellers: ${args.heads}`,
    `Cabin: ${args.cabinName}`,
    `Estimated total: ${formatGBP(args.total)}`,
    args.contactName.trim() && `Name: ${args.contactName.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function whatsAppUrl(text: string) {
  return `https://wa.me/${HALCYON_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function ItineraryLeg({
  flight,
  date,
  kind,
}: {
  flight: FlightOption;
  date?: string;
  kind: "out" | "in";
}) {
  const Icon = kind === "out" ? AirplaneTakeoff : AirplaneLanding;
  return (
    <div className="flex gap-4 p-4">
      <Icon size={18} className="mt-1 shrink-0 text-rust-700" weight="fill" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[13px] text-muted">
            {kind === "out" ? "Outbound" : "Return"} · {date ? formatDateLong(date) : "date to confirm"}
          </p>
          <p data-numeric className="text-[12px] text-muted">
            {flight.flightNo} · {flight.aircraft}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <p data-numeric className="text-[17px] font-semibold text-ink">
            {flight.dep.time}{" "}
            <span className="text-[13px] font-normal text-muted">{flight.dep.code}</span>
          </p>
          <span className="h-px flex-1 bg-hairline-firm" />
          <p data-numeric className="text-[12px] text-muted">
            {formatDuration(flight.durationMin)}
            {flight.stops > 0 ? " · 1 stop" : " · nonstop"}
          </p>
          <span className="h-px flex-1 bg-hairline-firm" />
          <p data-numeric className="text-[17px] font-semibold text-ink">
            {flight.arr.time}
            {flight.arr.dayOffset > 0 && (
              <sup className="text-[10px] text-muted">+{flight.arr.dayOffset}</sup>
            )}{" "}
            <span className="text-[13px] font-normal text-muted">{flight.arr.code}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function WhatsAppHandoff() {
  const { heldRef, from, to, tripType, departDate, returnDate, passengers, cabin, contact, reset } =
    useBookingStore();
  const { label, expired } = useFareHold();
  const quote = useQuote();
  const origin = originByCode(from);
  const dest = to ? destinationByCode(to) : undefined;
  const heads = headcount(passengers);

  const text = whatsAppText({
    destCity: dest?.city,
    originCity: origin?.city,
    departDate,
    returnDate,
    tripType,
    heads,
    cabinName: cabinById(cabin).name,
    total: quote.total,
    contactName: contact.name,
  });
  const url = whatsAppUrl(text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {dest && (
        <Photo
          src={dest.image}
          alt={dest.city}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="mb-6 aspect-[21/9] rounded-[12px] border border-hairline"
        >
          <div className="photo-caption absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-dark/80 to-transparent p-5">
            <p className="text-[12px] uppercase tracking-[0.14em] text-on-dark/70">
              Continuing on WhatsApp
            </p>
            <p className="text-[22px] font-semibold text-on-dark">
              {dest.city} from {origin?.city}
            </p>
          </div>
        </Photo>
      )}

      <CheckCircle size={30} weight="fill" className="text-success" />
      <h1 className="mt-3 text-[26px] font-semibold text-ink">We&apos;ve opened WhatsApp for you</h1>
      <p className="mt-2 max-w-[46ch] text-[15px] text-body">
        Your trip details are already in the message. Just hit send. If nothing
        opened, use the button below.
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#25D366] px-5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
      >
        <WhatsappLogo size={18} weight="fill" />
        Open WhatsApp
      </a>

      <dl className="mt-6 grid gap-px overflow-hidden rounded-[10px] border border-hairline bg-hairline sm:grid-cols-3">
        {[
          { k: "Reference", v: heldRef },
          { k: "Route", v: `${from} to ${to}` },
          { k: expired ? "Status" : "Price held for", v: expired ? "Please re-price" : label },
        ].map((cell) => (
          <div key={cell.k} className="bg-canvas-soft p-4">
            <dt className="text-[12px] uppercase tracking-[0.1em] text-muted">{cell.k}</dt>
            <dd data-numeric className="mt-1 text-[16px] font-semibold text-ink">
              {cell.v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex justify-center">
        <Button variant="secondary" onClick={reset}>
          Plan another trip
        </Button>
      </div>
    </motion.div>
  );
}

export function StepReview() {
  const s = useBookingStore();
  const quote = useQuote();
  const heldRef = useBookingStore((st) => st.heldRef);
  const holdFare = useBookingStore((st) => st.holdFare);
  const back = useBookingStore((st) => st.back);
  const setContact = useBookingStore((st) => st.setContact);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const heads = headcount(s.passengers);
  const origin = originByCode(s.from);
  const dest = s.to ? destinationByCode(s.to) : undefined;

  const nameError =
    touched.name && s.contact.name.trim().length < 2 ? "Enter the lead traveller's name" : undefined;
  const emailError =
    touched.email && s.contact.email.trim() && !EMAIL_RE.test(s.contact.email)
      ? "Enter a valid email address"
      : undefined;
  const canSend =
    s.contact.name.trim().length >= 2 && (!s.contact.email.trim() || EMAIL_RE.test(s.contact.email));

  if (heldRef) return <WhatsAppHandoff />;

  function talkOnWhatsApp() {
    const text = whatsAppText({
      destCity: dest?.city,
      originCity: origin?.city,
      departDate: s.departDate,
      returnDate: s.returnDate,
      tripType: s.tripType,
      heads,
      cabinName: cabinById(s.cabin).name,
      total: quote.total,
      contactName: s.contact.name,
    });
    window.open(whatsAppUrl(text), "_blank", "noopener,noreferrer");
    holdFare();
  }

  return (
    <StepFrame
      title="Review and talk to us"
      description="Check the trip, add your name, and continue on WhatsApp. We'll hold this price while we talk."
      hideFooter
    >
      <div className="space-y-6">
        {dest && (
          <Photo
            src={dest.image}
            alt={dest.city}
            sizes="(min-width: 1024px) 720px, 100vw"
            className="aspect-[21/9] rounded-[12px] border border-hairline"
          >
            <div className="photo-caption absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-dark/80 to-transparent p-5">
              <p className="text-[12px] uppercase tracking-[0.14em] text-on-dark/70">
                {s.tripType === "return" ? "Return" : "One way"} · {heads}{" "}
                {heads === 1 ? "traveller" : "travellers"}
              </p>
              <p className="text-[22px] font-semibold text-on-dark">
                {dest.city} from {origin?.city}
              </p>
            </div>
          </Photo>
        )}

        <div className="divide-y divide-hairline rounded-[10px] border border-hairline-firm bg-canvas-soft">
          {s.outboundFlight && (
            <ItineraryLeg flight={s.outboundFlight} date={s.departDate} kind="out" />
          )}
          {s.tripType === "return" && s.inboundFlight && (
            <ItineraryLeg flight={s.inboundFlight} date={s.returnDate} kind="in" />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            cabinById(s.cabin).name,
            s.fare === "flex" ? "Fully flexible" : null,
            s.outboundWindow ? `${windowById(s.outboundWindow).label} out` : null,
            s.extras.checkedBags > 0 ? `${s.extras.checkedBags} extra bags` : null,
            s.extras.seatPref === "legroom" ? "Extra legroom" : null,
            s.extras.ziyarat ? "Ziyarat tour" : null,
            s.extras.guide ? "Private guide" : null,
            s.extras.carbonOffset ? "Carbon removal" : null,
          ]
            .filter(Boolean)
            .map((chip) => (
              <span
                key={chip as string}
                className="rounded-full border border-hairline-firm bg-canvas-soft px-2.5 py-1 text-[12px] text-body"
              >
                {chip}
              </span>
            ))}
        </div>

        <div>
          <h2 className="mb-3 text-[16px] font-semibold text-ink">Contact for this booking</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Lead traveller" error={nameError} className="sm:col-span-2">
              {(id) => (
                <TextInput
                  id={id}
                  autoComplete="name"
                  value={s.contact.name}
                  onChange={(e) => setContact({ name: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  placeholder="As shown on the passport"
                />
              )}
            </Field>
            <Field
              label="Email"
              error={emailError}
              hint="Optional: for a written confirmation too"
              className="sm:col-span-2"
            >
              {(id) => (
                <TextInput
                  id={id}
                  type="email"
                  autoComplete="email"
                  value={s.contact.email}
                  onChange={(e) => setContact({ email: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="you@example.com"
                />
              )}
            </Field>
          </div>
        </div>

        <div className="rounded-[10px] border border-hairline bg-canvas-sink p-4">
          <div className="space-y-1.5">
            {quote.lines.map((l) => (
              <div key={l.id} className="flex items-baseline justify-between gap-4 text-[13px]">
                <span className="text-body">
                  {l.label}
                  {l.detail && <span className="text-muted"> · {l.detail}</span>}
                </span>
                <span data-numeric className="text-ink">{formatGBP(l.amount)}</span>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 text-[13px]">
              <span className="text-body">Taxes and carrier charges</span>
              <span data-numeric className="text-ink">{formatGBP(quote.taxes)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-hairline-firm pt-3">
            <span className="text-[15px] font-semibold text-ink">Estimated total</span>
            <span data-numeric className="text-[20px] font-semibold text-ink">
              {formatGBP(quote.total)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={back} className="sm:w-auto">
            <ArrowLeft size={16} />
            Back
          </Button>
          <Button
            onClick={talkOnWhatsApp}
            disabled={!canSend}
            className="bg-[#25D366] shadow-none hover:bg-[#1ebc59] sm:w-auto"
          >
            <WhatsappLogo size={17} weight="fill" />
            Talk on WhatsApp
          </Button>
        </div>
        <p className="text-center text-[12px] text-muted sm:text-right">
          Nothing is charged here. We&apos;ll agree everything over WhatsApp. This is a
          prototype, so the chat won&apos;t actually connect to anyone.
        </p>
      </div>
    </StepFrame>
  );
}
