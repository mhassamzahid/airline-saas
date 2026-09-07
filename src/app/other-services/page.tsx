import { ShieldCheck, CurrencyGbp, HandWaving, Package, BookOpen } from "@phosphor-icons/react/dist/ssr";
import { ServicePage, ServiceSection } from "@/components/site/ServicePage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { stock } from "@/lib/img";

export const metadata = {
  title: "Other Services",
  description: "Smaller offerings alongside Umrah, Hajj and tours — travel insurance, meet & greet, Qurbani arrangement and more.",
};

const OFFERINGS = [
  {
    icon: ShieldCheck,
    title: "Travel insurance",
    body: "Medical, baggage and trip cancellation cover, arranged alongside any Umrah, Hajj or tour booking.",
  },
  {
    icon: CurrencyGbp,
    title: "Currency exchange assistance",
    body: "Guidance on carrying and exchanging Saudi riyal, plus which airport counters carry the best rate.",
  },
  {
    icon: HandWaving,
    title: "Meet & greet",
    body: "A representative waiting at Jeddah or Madinah arrivals to walk your group through immigration and baggage.",
  },
  {
    icon: Package,
    title: "Qurbani arrangement",
    body: "Qurbani booked and confirmed on your behalf during Hajj or Dhul Hijjah, with a certificate sent to you.",
  },
  {
    icon: BookOpen,
    title: "Umrah guide booklet",
    body: "A printed step-by-step guide to the rites, sent ahead of departure — useful for first-time pilgrims.",
  },
];

export default function OtherServicesPage() {
  return (
    <ServicePage
      eyebrow="Halcyon services"
      title="Other services"
      lede="Smaller offerings that round out an Umrah, Hajj or tour booking. None of these need a full booking flow — just tell us what you need."
      heroImage={{
        src: stock("photo-1600880292203-757bb62b4baf", 900, 1125),
        alt: "Two colleagues at a desk, working through a service request",
      }}
    >
      <ServiceSection title="What's available">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {OFFERINGS.map((o) => (
            <div key={o.title} className="rounded-[10px] border border-hairline bg-canvas p-5">
              <o.icon size={20} className="text-rust-700" weight="fill" />
              <h3 className="mt-3 text-[16px] font-semibold text-ink">{o.title}</h3>
              <p className="mt-1.5 text-[13px] text-body">{o.body}</p>
            </div>
          ))}
        </div>
      </ServiceSection>

      <ServiceSection title="Ask about any of these">
        <InquiryForm subject="Other services" leadTime="2 business days" />
      </ServiceSection>
    </ServicePage>
  );
}
