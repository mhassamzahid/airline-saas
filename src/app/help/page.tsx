import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { getHelpPage, getSiteSettings, type CmsIconTextLink, type CmsFaq } from "@/lib/cms";
import { resolveIcon } from "@/lib/icons";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "Help",
    description: `Contact ${site_title}, read the common questions, and find out what happens if your flight is disrupted.`,
  };
}

const FALLBACK_LEDE = "Most things can be sorted from Manage your trip. For everything else, here is how to reach us and what to expect.";

const FALLBACK_CHANNELS: CmsIconTextLink[] = [
  {
    icon_name: "ChatCircle", image: null, href: "/help",
    label: "Message us",
    body: "In the app or on web, 24 hours. Median first reply is under four minutes.",
    action_label: "Open chat",
  },
  {
    icon_name: "Phone", image: null, href: "/help",
    label: "Call",
    body: "+44 20 7946 0100, 06:00 to 23:00 UK time. Priority line for travel within 48 hours.",
    action_label: "See numbers by country",
  },
  {
    icon_name: "Lifebuoy", image: null, href: "/help",
    label: "At the airport",
    body: "Our desks at Gatwick South, zone C, from three hours before each departure.",
    action_label: "Airport guide",
  },
];

const FALLBACK_FAQS: CmsFaq[] = [
  {
    question: "Can I change my flight after booking?",
    answer: "It depends on your fare. Flex changes are free with only the fare difference to pay. Value changes carry a £60 fee plus any fare difference. Lite fares cannot be changed. You can always upgrade a fare before departure.",
  },
  {
    question: "What is included in my baggage allowance?",
    answer: "Every fare includes a cabin bag and a personal item. Value includes one 23kg checked bag, Flex includes two. On Lite you can add checked bags from £32 each during booking or later from Manage your trip.",
  },
  {
    question: "When can I choose my seat?",
    answer: "Value and Flex fares can choose a standard seat for free at any point after booking. Flex can also take extra-legroom seats at no charge. On Lite, seats are assigned free at check-in, or you can pay to choose earlier.",
  },
  {
    question: "How do reward miles work?",
    answer: "You earn miles as a percentage of the fare paid: 25% on Lite, 100% on Value, 150% on Flex. Miles never expire while your account is active and can be spent on any seat, with no blackout dates.",
  },
  {
    question: "What happens if my flight is delayed or cancelled?",
    answer: "We rebook you on the next available service automatically and message you the details. If the delay is over five hours or overnight, we cover a hotel and meals. For cancellations within our control you can take a full refund instead of a rebooking.",
  },
  {
    question: "Do you offer assistance for reduced mobility?",
    answer: "Yes, at no charge. Add it during booking or from Manage your trip at least 48 hours before departure so we can arrange it at both airports. Guide dogs and assistance animals travel in the cabin.",
  },
];

const FALLBACK_DISRUPTION_HEADING = "If something goes wrong today";
const FALLBACK_DISRUPTION_STEPS = [
  { title: "Check your messages", body: "We send rebooking options before you reach the desk." },
  { title: "Reply to accept or change", body: "Pick a different flight in the same message thread." },
  { title: "Keep receipts", body: "Claim meals and transport for eligible delays from Manage your trip." },
];

export default async function HelpPage() {
  const cms = await getHelpPage();

  const lede = cms?.lede || FALLBACK_LEDE;
  const channels = cms?.body.find((b) => b.type === "channels")?.value ?? FALLBACK_CHANNELS;
  const faqs = cms?.body.find((b) => b.type === "faqs")?.value ?? FALLBACK_FAQS;
  const disruptionHeading = cms?.disruption_heading || FALLBACK_DISRUPTION_HEADING;
  const disruptionSteps = cms?.disruption_steps.length
    ? cms.disruption_steps.map((s) => s.value)
    : FALLBACK_DISRUPTION_STEPS;

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Help"
        title="Answers, and a person when you need one"
        lede={lede}
        className="mb-12"
      />

      {/* Channels */}
      <div className="grid gap-3 sm:grid-cols-3">
        {channels.map((c) => {
          const ChannelIcon = resolveIcon(c.icon_name);
          return (
            <div key={c.label} className="rounded-[10px] border border-hairline bg-canvas p-5">
              {ChannelIcon && <ChannelIcon size={20} className="text-rust-700" weight="fill" />}
              <h2 className="mt-3 text-[16px] font-semibold text-ink">{c.label}</h2>
              <p className="mt-1.5 text-[13px] text-body">{c.body}</p>
              <Link
                href={c.href || "/help"}
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-rust-700 hover:text-rust-600"
              >
                {c.action_label || "Learn more"}
                <ArrowRight size={13} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-[24px] text-ink">Common questions</h2>
        <FaqAccordion faqs={faqs} className="mt-6" />
      </section>

      {/* Disruption strip */}
      <section className="mt-16 rounded-[10px] border border-hairline bg-canvas p-6 sm:p-8">
        <h2 className="text-[18px] font-semibold text-ink">{disruptionHeading}</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {disruptionSteps.map((s, i) => (
            <div key={s.title}>
              <span data-numeric className="text-[13px] font-semibold text-rust-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-[14px] font-medium text-ink">{s.title}</p>
              <p className="mt-1 text-[13px] text-body">{s.body}</p>
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
