import Link from "next/link";
import {
  ChatCircle,
  Phone,
  Lifebuoy,
  CaretDown,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";

export const metadata = {
  title: "Help",
  description:
    "Contact Halcyon, read the common questions, and find out what happens if your flight is disrupted.",
};

const CHANNELS = [
  {
    icon: ChatCircle,
    title: "Message us",
    body: "In the app or on web, 24 hours. Median first reply is under four minutes.",
    action: "Open chat",
  },
  {
    icon: Phone,
    title: "Call",
    body: "+44 20 7946 0100, 06:00 to 23:00 UK time. Priority line for travel within 48 hours.",
    action: "See numbers by country",
  },
  {
    icon: Lifebuoy,
    title: "At the airport",
    body: "Halcyon desks at Gatwick South, zone C, from three hours before each departure.",
    action: "Airport guide",
  },
];

const FAQS = [
  {
    q: "Can I change my flight after booking?",
    a: "It depends on your fare. Flex changes are free with only the fare difference to pay. Value changes carry a £60 fee plus any fare difference. Lite fares cannot be changed. You can always upgrade a fare before departure.",
  },
  {
    q: "What is included in my baggage allowance?",
    a: "Every fare includes a cabin bag and a personal item. Value includes one 23kg checked bag, Flex includes two. On Lite you can add checked bags from £32 each during booking or later from Manage your trip.",
  },
  {
    q: "When can I choose my seat?",
    a: "Value and Flex fares can choose a standard seat for free at any point after booking. Flex can also take extra-legroom seats at no charge. On Lite, seats are assigned free at check-in, or you can pay to choose earlier.",
  },
  {
    q: "How do Halcyon miles work?",
    a: "You earn miles as a percentage of the fare paid: 25% on Lite, 100% on Value, 150% on Flex. Miles never expire while your account is active and can be spent on any seat, with no blackout dates.",
  },
  {
    q: "What happens if my flight is delayed or cancelled?",
    a: "We rebook you on the next Halcyon service automatically and message you the details. If the delay is over five hours or overnight, we cover a hotel and meals. For cancellations within our control you can take a full refund instead of a rebooking.",
  },
  {
    q: "Do you offer assistance for reduced mobility?",
    a: "Yes, at no charge. Add it during booking or from Manage your trip at least 48 hours before departure so we can arrange it at both airports. Guide dogs and assistance animals travel in the cabin.",
  },
];

export default function HelpPage() {
  return (
    <PageContainer>
      <PageIntro
        eyebrow="Help"
        title="Answers, and a person when you need one"
        lede="Most things can be sorted from Manage your trip. For everything else, here is how to reach us and what to expect."
        className="mb-12"
      />

      {/* Channels */}
      <div className="grid gap-3 sm:grid-cols-3">
        {CHANNELS.map((c) => (
          <div key={c.title} className="rounded-[10px] border border-hairline bg-canvas p-5">
            <c.icon size={20} className="text-rust-700" weight="fill" />
            <h2 className="mt-3 text-[16px] font-semibold text-ink">{c.title}</h2>
            <p className="mt-1.5 text-[13px] text-body">{c.body}</p>
            <Link
              href="/help"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-rust-700 hover:text-rust-600"
            >
              {c.action}
              <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-[24px] text-ink">Common questions</h2>
        <div className="mt-6 divide-y divide-hairline border-y border-hairline">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <CaretDown
                  size={16}
                  className="shrink-0 text-muted transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="max-w-[68ch] pb-4 text-[14px] leading-relaxed text-body">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Disruption strip */}
      <section className="mt-16 rounded-[10px] border border-hairline bg-canvas p-6 sm:p-8">
        <h2 className="text-[18px] font-semibold text-ink">If something goes wrong today</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {[
            { n: "1", t: "Check your messages", d: "We send rebooking options before you reach the desk." },
            { n: "2", t: "Reply to accept or change", d: "Pick a different flight in the same message thread." },
            { n: "3", t: "Keep receipts", d: "Claim meals and transport for eligible delays from Manage your trip." },
          ].map((s) => (
            <div key={s.n}>
              <span data-numeric className="text-[13px] font-semibold text-rust-700">
                {s.n}
              </span>
              <p className="mt-1 text-[14px] font-medium text-ink">{s.t}</p>
              <p className="mt-1 text-[13px] text-body">{s.d}</p>
            </div>
          ))}
        </div>
        <Link
          href="/help"
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-rust-700 hover:text-rust-600"
        >
          Read our disruption and refunds policy
          <ArrowRight size={13} />
        </Link>
      </section>
    </PageContainer>
  );
}
