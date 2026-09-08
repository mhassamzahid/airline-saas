import { ServicePage, ServiceSection, ServiceSteps, ServiceChecklist } from "@/components/site/ServicePage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { stock } from "@/lib/img";
import { getServicePage, getSiteSettings } from "@/lib/cms";

export const metadata = {
  title: "Air Ticketing",
  description: "Reissue, reroute, or refund a ticket you already hold, for a booking made with us or transferred from elsewhere.",
};

const FALLBACK = {
  lede: "For changes to a ticket you already hold (a date move, a name correction, or a refund) rather than a new booking.",
  checklist: {
    title: "What we handle",
    items: [
      "Date and route changes on an existing ticket",
      "Name corrections ahead of departure",
      "Refunds and partial refunds under your fare's conditions",
      "Reissuing a ticket originally booked through a travel partner",
      "Multi-passenger and group ticket changes handled together",
    ],
  },
  steps: {
    title: "How it works",
    steps: [
      { title: "Send your reference", body: "Your booking reference and the change you need. Most requests need nothing else." },
      { title: "We confirm the fare difference", body: "Any difference in fare or fee is confirmed with you before anything is changed." },
      { title: "Reissued and sent over", body: "Your updated ticket lands in your inbox, usually the same business day." },
    ],
  },
};

export default async function AirTicketingPage() {
  const [cms, { site_title }] = await Promise.all([
    getServicePage("air-ticketing"),
    getSiteSettings(),
  ]);
  const eyebrow = cms?.eyebrow || `${site_title} services`;
  const lede = cms?.lede || FALLBACK.lede;
  const checklist = cms?.sections.find((s) => s.type === "checklist")?.value ?? FALLBACK.checklist;
  const steps = cms?.sections.find((s) => s.type === "steps")?.value ?? FALLBACK.steps;

  return (
    <ServicePage
      eyebrow={eyebrow}
      title="Air Ticketing"
      lede={lede}
      heroImage={{
        src: stock("photo-1517479149777-5f3b1511d5ad", 900, 1125),
        alt: "An aircraft wing catching the light at sunset",
      }}
    >
      <ServiceSection title={checklist.title}>
        <ServiceChecklist items={checklist.items} />
      </ServiceSection>

      <ServiceSection title={steps.title}>
        <ServiceSteps steps={steps.steps} />
      </ServiceSection>

      <ServiceSection title="Request a change">
        <InquiryForm subject="Air ticketing" leadTime="1 business day" />
      </ServiceSection>
    </ServicePage>
  );
}
