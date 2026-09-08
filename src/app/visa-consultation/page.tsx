import { ServicePage, ServiceSection, ServiceSteps, ServiceChecklist } from "@/components/site/ServicePage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { stock } from "@/lib/img";
import { getServicePage, getSiteSettings } from "@/lib/cms";

export const metadata = {
  title: "Visa Consultation",
  description: "Help with Umrah, Hajj and tour visas: document checklists, application tracking, and a specialist you can ask.",
};

const FALLBACK = {
  lede: "Every Umrah, Hajj and tour booking needs the right paperwork in the right order. We check it before it becomes a problem at the airport.",
  checklist: {
    title: "What we help with",
    items: [
      "Saudi Umrah and Hajj visa applications, including biometric appointments",
      "Passport validity checks against your destination's requirement",
      "Document review before you submit, so errors get caught early",
      "Visa status tracking once your application is submitted",
      "Guidance for group and family applications submitted together",
    ],
  },
  steps: {
    title: "How it works",
    steps: [
      { title: "Send your details", body: "Passport, travel dates, and which package or tour you've booked, or plan to." },
      { title: "We check the requirement", body: "A specialist confirms exactly what's needed for your nationality and destination." },
      { title: "We track it through", body: "You get a status update at each stage, through to the visa landing in your inbox." },
    ],
  },
};

export default async function VisaConsultationPage() {
  const [cms, { site_title }] = await Promise.all([
    getServicePage("visa-consultation"),
    getSiteSettings(),
  ]);
  const eyebrow = cms?.eyebrow || `${site_title} services`;
  const lede = cms?.lede || FALLBACK.lede;
  const checklist = cms?.sections.find((s) => s.type === "checklist")?.value ?? FALLBACK.checklist;
  const steps = cms?.sections.find((s) => s.type === "steps")?.value ?? FALLBACK.steps;

  return (
    <ServicePage
      eyebrow={eyebrow}
      title="Visa Consultation"
      lede={lede}
      heroImage={{
        src: stock("photo-1524661135-423995f22d0b", 900, 1125),
        alt: "A world map laid out on a table",
      }}
    >
      <ServiceSection title={checklist.title}>
        <ServiceChecklist items={checklist.items} />
      </ServiceSection>

      <ServiceSection title={steps.title}>
        <ServiceSteps steps={steps.steps} />
      </ServiceSection>

      <ServiceSection title="Ask a specialist">
        <InquiryForm subject="Visa consultation" leadTime="2 business days" />
      </ServiceSection>
    </ServicePage>
  );
}
