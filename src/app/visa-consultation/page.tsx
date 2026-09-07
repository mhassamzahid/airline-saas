import { ServicePage, ServiceSection, ServiceSteps, ServiceChecklist } from "@/components/site/ServicePage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { stock } from "@/lib/img";

export const metadata = {
  title: "Visa Consultation",
  description: "Help with Umrah, Hajj and tour visas: document checklists, application tracking, and a specialist you can ask.",
};

export default function VisaConsultationPage() {
  return (
    <ServicePage
      eyebrow="Halcyon services"
      title="Visa Consultation"
      lede="Every Umrah, Hajj and tour booking needs the right paperwork in the right order. We check it before it becomes a problem at the airport."
      heroImage={{
        src: stock("photo-1524661135-423995f22d0b", 900, 1125),
        alt: "A world map laid out on a table",
      }}
    >
      <ServiceSection title="What we help with">
        <ServiceChecklist
          items={[
            "Saudi Umrah and Hajj visa applications, including biometric appointments",
            "Passport validity checks against your destination's requirement",
            "Document review before you submit, so errors get caught early",
            "Visa status tracking once your application is submitted",
            "Guidance for group and family applications submitted together",
          ]}
        />
      </ServiceSection>

      <ServiceSection title="How it works">
        <ServiceSteps
          steps={[
            {
              title: "Send your details",
              body: "Passport, travel dates, and which package or tour you've booked, or plan to.",
            },
            {
              title: "We check the requirement",
              body: "A specialist confirms exactly what's needed for your nationality and destination.",
            },
            {
              title: "We track it through",
              body: "You get a status update at each stage, through to the visa landing in your inbox.",
            },
          ]}
        />
      </ServiceSection>

      <ServiceSection title="Ask a specialist">
        <InquiryForm subject="Visa consultation" leadTime="2 business days" />
      </ServiceSection>
    </ServicePage>
  );
}
