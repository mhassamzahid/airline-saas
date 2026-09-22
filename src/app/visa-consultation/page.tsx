import { ServicePage, ServiceSection, ServiceSteps, ServiceChecklist } from "@/components/site/ServicePage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { stock } from "@/lib/img";
import { getServicePage, getSiteSettings, cmsRenditionUrl } from "@/lib/cms";

export const metadata = {
  title: "Visa Consultation",
  description: "Countries we cover, how the process works, the documents you'll need, and a specialist you can ask.",
};

// Editors can add/reorder "checklist" and "steps" blocks freely in Wagtail --
// each one renders as its own <ServiceSection>, in the order given here.
const FALLBACK_SECTIONS = [
  {
    type: "checklist" as const,
    value: {
      title: "Countries we cover",
      items: [
        "Saudi Arabia — Umrah & Hajj visas",
        "Turkey",
        "Thailand",
        "United Arab Emirates (Dubai)",
        "Malaysia",
        "Schengen Europe",
        "Egypt",
        "Maldives",
        "Indonesia",
        "Pakistan — NICOP & visit visas",
      ],
    },
  },
  {
    type: "steps" as const,
    value: {
      title: "How it works",
      steps: [
        { title: "Send your details", body: "Passport, travel dates, and which package or tour you've booked, or plan to." },
        { title: "We check the requirement", body: "A specialist confirms exactly what's needed for your nationality and destination." },
        { title: "We track it through", body: "You get a status update at each stage, through to the visa landing in your inbox." },
      ],
    },
  },
  {
    type: "checklist" as const,
    value: {
      title: "Documents you'll need",
      items: [
        "A passport valid for at least 6 months beyond your return date",
        "Two recent passport-sized photographs",
        "A completed visa application form",
        "Proof of travel — your booking confirmation or itinerary",
        "Proof of accommodation for the full stay",
        "Bank statements or proof of funds, where the destination requires them",
      ],
    },
  },
];

const FALLBACK_LEDE =
  "Every Umrah, Hajj and tour booking needs the right paperwork in the right order. We check it before it becomes a problem at the airport.";
const LEAD_TIME = "2 business days";

export default async function VisaConsultationPage() {
  const [cms, { site_title }] = await Promise.all([
    getServicePage("visa-consultation"),
    getSiteSettings(),
  ]);
  const eyebrow = cms?.eyebrow || `${site_title} services`;
  const title = cms?.title || "Visa Consultation";
  const lede = cms?.lede || FALLBACK_LEDE;
  const sections = cms?.sections.length ? cms.sections : FALLBACK_SECTIONS;
  const heroImageUrl = cmsRenditionUrl(cms?.hero_image ?? null);
  const countriesSection = sections.find((s) => s.type === "checklist");
  const stepsSection = sections.find((s) => s.type === "steps");

  return (
    <ServicePage
      eyebrow={eyebrow}
      title={title}
      lede={lede}
      heroImage={{
        src: heroImageUrl || stock("photo-1524661135-423995f22d0b", 900, 1125),
        alt: cms?.hero_image?.alt || "A world map laid out on a table",
        unoptimized: Boolean(heroImageUrl),
      }}
      heroVariant="visa-consultation"
      heroFacts={[
        ...(countriesSection ? [{ value: String(countriesSection.value.items.length), label: "Countries covered" }] : []),
        ...(stepsSection ? [{ value: String(stepsSection.value.steps.length), label: "Simple steps" }] : []),
        { value: LEAD_TIME, label: "Typical turnaround" },
      ]}
    >
      {sections.map((s) => {
        if (s.type === "checklist") {
          return (
            <ServiceSection key={s.value.title} title={s.value.title}>
              <ServiceChecklist items={s.value.items} />
            </ServiceSection>
          );
        }
        if (s.type === "steps") {
          return (
            <ServiceSection key={s.value.title} title={s.value.title}>
              <ServiceSteps steps={s.value.steps} />
            </ServiceSection>
          );
        }
        return null;
      })}

      <ServiceSection title="Start your visa application">
        <InquiryForm subject="Visa consultation" leadTime={LEAD_TIME} submitLabel="Start my visa application" />
      </ServiceSection>
    </ServicePage>
  );
}
