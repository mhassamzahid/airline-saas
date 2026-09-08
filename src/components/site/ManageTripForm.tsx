"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  MagnifyingGlass,
  WarningCircle,
  Armchair,
  SuitcaseRolling,
  CalendarPlus,
  DownloadSimple,
  ArrowRight,
  ShieldCheck,
  UsersThree,
  Lightning,
} from "@phosphor-icons/react";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { BoardingPass, type PassLeg } from "@/components/site/BoardingPass";

const DEMO_REF = "HN-2P4P84";

const DEMO_TRIP = {
  from: { code: "LGW", city: "London Gatwick" },
  to: { code: "JFK", city: "New York JFK" },
  cabin: "Premium",
  legs: [
    { label: "Out", flightNo: "HN 222", date: "Sat 13 Sept", dep: "11:15", arr: "14:08" },
    { label: "Return", flightNo: "HN 250", date: "Sat 20 Sept", dep: "13:40", arr: "01:23 +1" },
  ] satisfies PassLeg[],
};

const ACTIONS = [
  { label: "Choose seats", icon: Armchair },
  { label: "Add bags", icon: SuitcaseRolling },
  { label: "Change flights", icon: CalendarPlus },
  { label: "Get itinerary", icon: DownloadSimple },
];

const REASSURANCE = [
  { icon: Lightning, text: "Seat maps, baggage and meals open straight away. No sign-in needed." },
  {
    icon: ShieldCheck,
    text: "Changes follow your original fare rules. Flex moves carry no fee, only the fare difference.",
  },
  {
    icon: UsersThree,
    text: "Companions and reward miles on the booking stay attached through any change.",
  },
];

function ActionGrid() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ACTIONS.map((a) => (
        <Link
          key={a.label}
          href="/manage"
          className="flex items-center gap-2 rounded-[10px] border border-hairline-firm bg-canvas px-3 py-2.5 text-[13px] font-medium text-ink transition-all hover:-translate-y-0.5 hover:h-shadow-md"
        >
          <a.icon size={15} className="text-rust-700" />
          {a.label}
        </Link>
      ))}
    </div>
  );
}

export function ManageTripForm({ siteTitle }: { siteTitle?: string }) {
  const [reference, setReference] = useState("");
  const [surname, setSurname] = useState("");
  const [state, setState] = useState<"idle" | "error" | "found">("idle");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const match =
      reference.trim().toUpperCase().replace(/\s+/g, "") === DEMO_REF &&
      surname.trim().length > 1;
    setState(match ? "found" : "error");
  }

  const found = state === "found";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start lg:gap-16">
      {/* Left: retrieve */}
      <div>
        <form
          onSubmit={submit}
          className="rounded-[14px] border border-hairline bg-canvas p-5 h-shadow-raised sm:p-6"
        >
          <div className="grid gap-4">
            <Field label="Booking reference" hint="Six characters, for example HN-2P4P84">
              {(id) => (
                <TextInput
                  id={id}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="HN-000000"
                  autoComplete="off"
                  spellCheck={false}
                />
              )}
            </Field>
            <Field label="Lead traveller surname">
              {(id) => (
                <TextInput
                  id={id}
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Surname"
                  autoComplete="family-name"
                />
              )}
            </Field>
          </div>

          {state === "error" && (
            <p className="mt-4 flex items-start gap-1.5 text-[13px] text-danger">
              <WarningCircle size={15} weight="fill" className="mt-0.5 shrink-0" />
              We could not find that booking. In this prototype only {DEMO_REF} resolves, with any surname.
            </p>
          )}

          <Button type="submit" className="mt-5 w-full sm:w-auto">
            <MagnifyingGlass size={15} />
            {found ? "Find another trip" : "Find my trip"}
          </Button>
        </form>

        <p className="mt-4 text-[13px] text-muted">
          Can&apos;t find your reference? It is in your confirmation email, on the
          first line after the greeting.{" "}
          <Link href="/help" className="font-medium text-rust-700 hover:text-rust-600">
            More help
            <ArrowRight size={12} className="ml-0.5 inline align-[-1px]" />
          </Link>
        </p>

        <ul className="mt-8 space-y-3.5 border-t border-hairline pt-6">
          {REASSURANCE.map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-3 text-[13px] text-body">
              <Icon size={16} className="mt-0.5 shrink-0 text-rust-700" weight="fill" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: the pass */}
      <div className="lg:pt-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={found ? "found" : "sample"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {found ? (
              <BoardingPass
                reference={DEMO_REF}
                status="confirmed"
                from={DEMO_TRIP.from}
                to={DEMO_TRIP.to}
                passenger={surname.trim() ? surname.trim().toUpperCase() : "LEAD TRAVELLER"}
                cabin={DEMO_TRIP.cabin}
                legs={DEMO_TRIP.legs}
                siteTitle={siteTitle}
                stub={<ActionGrid />}
              />
            ) : (
              <>
                <BoardingPass
                  reference={DEMO_REF}
                  status="sample"
                  from={DEMO_TRIP.from}
                  to={DEMO_TRIP.to}
                  passenger="Your name"
                  cabin={DEMO_TRIP.cabin}
                  legs={DEMO_TRIP.legs}
                  siteTitle={siteTitle}
                />
                <p className="mt-3 px-1 text-[12px] text-muted">
                  A retrieved trip looks like this. Try{" "}
                  <span data-numeric className="text-ink">{DEMO_REF}</span> with any
                  surname.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
