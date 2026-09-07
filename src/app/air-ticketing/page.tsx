import { ServicePage, ServiceSection, ServiceSteps, ServiceChecklist } from "@/components/site/ServicePage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { stock } from "@/lib/img";

export const metadata = {
  title: "Air Ticketing",
  description: "Reissue, reroute, or refund a ticket you already hold, for a booking made with us or transferred from elsewhere.",
};

export default function AirTicketingPage() {
  return (
    <ServicePage
      eyebrow="Halcyon services"
      title="Air Ticketing"
      lede="For changes to a ticket you already hold (a date move, a name correction, or a refund) rather than a new booking."
      heroImage={{
        src: stock("photo-1517479149777-5f3b1511d5ad", 900, 1125),
        alt: "An aircraft wing catching the light at sunset",
      }}
    >
      <ServiceSection title="What we handle">
        <ServiceChecklist
          items={[
            "Date and route changes on an existing ticket",
            "Name corrections ahead of departure",
            "Refunds and partial refunds under your fare's conditions",
            "Reissuing a ticket originally booked through a travel partner",
            "Multi-passenger and group ticket changes handled together",
          ]}
        />
      </ServiceSection>

      <ServiceSection title="How it works">
        <ServiceSteps
          steps={[
            {
              title: "Send your reference",
              body: "Your booking reference and the change you need. Most requests need nothing else.",
            },
            {
              title: "We confirm the fare difference",
              body: "Any difference in fare or fee is confirmed with you before anything is changed.",
            },
            {
              title: "Reissued and sent over",
              body: "Your updated ticket lands in your inbox, usually the same business day.",
            },
          ]}
        />
      </ServiceSection>

      <ServiceSection title="Request a change">
        <InquiryForm subject="Air ticketing" leadTime="1 business day" />
      </ServiceSection>
    </ServicePage>
  );
}
