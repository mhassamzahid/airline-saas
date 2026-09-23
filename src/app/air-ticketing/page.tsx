import { ServicePage, ServiceSection, ServiceSteps } from "@/components/site/ServicePage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { stock } from "@/lib/img";
import { getServicePage, getSiteSettings, cmsRenditionUrl } from "@/lib/cms";

export const metadata = {
  title: "Air Ticketing",
  description: "Domestic and international fares, sourced and booked for you by a specialist. Request a fare quote to get started.",
};

// Editors can add/reorder "steps" (and "checklist") blocks freely in Wagtail
// -- each one renders as its own <ServiceSection>, in the order given here.
const FALLBACK_SECTIONS = [
  {
    type: "steps" as const,
    value: {
      title: "How it works",
      steps: [
        { title: "Tell us where and when", body: "Your route — domestic or international — preferred dates, and how many passengers." },
        { title: "We source the fare", body: "A specialist checks fares across airlines and comes back with the best options for your trip." },
        { title: "Confirm and pay", body: "Once you approve a fare, we issue the ticket and send your confirmation." },
      ],
    },
  },
];

const FALLBACK_LEDE =
  "Domestic and international flights, quoted and booked for you by a specialist — tell us your route and dates, and we'll come back with fares.";
const LEAD_TIME = "1 business day";

export default async function AirTicketingPage() {
  const [cms, { site_title }] = await Promise.all([
    getServicePage("air-ticketing"),
    getSiteSettings(),
  ]);
  const eyebrow = cms?.eyebrow || `${site_title} services`;
  const title = cms?.title || "Air Ticketing";
  const lede = cms?.lede || FALLBACK_LEDE;
  const sections = cms?.sections.length ? cms.sections : FALLBACK_SECTIONS;
  const heroImageUrl = cmsRenditionUrl(cms?.hero_image ?? null);
  const stepsSection = sections.find((s) => s.type === "steps");

  return (
    <ServicePage
      eyebrow={eyebrow}
      title={title}
      lede={lede}
      heroImage={{
        src: heroImageUrl || stock("photo-1517479149777-5f3b1511d5ad", 2000, 800),
        alt: cms?.hero_image?.alt || "An aircraft wing catching the light at sunset",
        unoptimized: Boolean(heroImageUrl),
      }}
      heroVariant="air-ticketing"
      heroFacts={[
        ...(stepsSection ? [{ value: String(stepsSection.value.steps.length), label: "Simple steps" }] : []),
        { value: LEAD_TIME, label: "Fare quote turnaround" },
      ]}
    >
      {sections.map((s) => {
        if (s.type !== "steps") return null;
        return (
          <ServiceSection key={s.value.title} title={s.value.title}>
            <ServiceSteps steps={s.value.steps} />
          </ServiceSection>
        );
      })}

      <ServiceSection title="Request a fare quote">
        <InquiryForm subject="Air ticketing" leadTime={LEAD_TIME} submitLabel="Request a fare quote" />
      </ServiceSection>
    </ServicePage>
  );
}
