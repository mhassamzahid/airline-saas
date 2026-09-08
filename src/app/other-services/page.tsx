import { ServicePage, ServiceSection } from "@/components/site/ServicePage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { stock } from "@/lib/img";
import { getServicePage, type CmsIconTextLink } from "@/lib/cms";
import { resolveIcon } from "@/lib/icons";

export const metadata = {
  title: "Other Services",
  description: "Smaller offerings alongside Umrah, Hajj and tours: travel insurance, meet & greet, Qurbani arrangement and more.",
};

const FALLBACK = {
  eyebrow: "Halcyon services",
  lede: "Smaller offerings that round out an Umrah, Hajj or tour booking. None of these need a full booking flow: just tell us what you need.",
  tileGrid: {
    title: "What's available",
    tiles: [
      { icon_name: "ShieldCheck", label: "Travel insurance", body: "Medical, baggage and trip cancellation cover, arranged alongside any Umrah, Hajj or tour booking.", href: "", image: null, action_label: "" },
      { icon_name: "CurrencyGbp", label: "Currency exchange assistance", body: "Guidance on carrying and exchanging Saudi riyal, plus which airport counters carry the best rate.", href: "", image: null, action_label: "" },
      { icon_name: "HandWaving", label: "Meet & greet", body: "A representative waiting at Jeddah or Madinah arrivals to walk your group through immigration and baggage.", href: "", image: null, action_label: "" },
      { icon_name: "Package", label: "Qurbani arrangement", body: "Qurbani booked and confirmed on your behalf during Hajj or Dhul Hijjah, with a certificate sent to you.", href: "", image: null, action_label: "" },
      { icon_name: "BookOpen", label: "Umrah guide booklet", body: "A printed step-by-step guide to the rites, sent ahead of departure, useful for first-time pilgrims.", href: "", image: null, action_label: "" },
    ] as CmsIconTextLink[],
  },
};

export default async function OtherServicesPage() {
  const cms = await getServicePage("other-services");
  const eyebrow = cms?.eyebrow || FALLBACK.eyebrow;
  const lede = cms?.lede || FALLBACK.lede;
  const tileGrid = cms?.sections.find((s) => s.type === "tile_grid")?.value ?? FALLBACK.tileGrid;

  return (
    <ServicePage
      eyebrow={eyebrow}
      title="Other services"
      lede={lede}
      heroImage={{
        src: stock("photo-1600880292203-757bb62b4baf", 900, 1125),
        alt: "Two colleagues at a desk, working through a service request",
      }}
    >
      <ServiceSection title={tileGrid.title}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tileGrid.tiles.map((tile) => {
            const TileIcon = resolveIcon(tile.icon_name);
            return (
              <div key={tile.label} className="rounded-[10px] border border-hairline bg-canvas p-5">
                {TileIcon && <TileIcon size={20} className="text-rust-700" weight="fill" />}
                <h3 className="mt-3 text-[16px] font-semibold text-ink">{tile.label}</h3>
                <p className="mt-1.5 text-[13px] text-body">{tile.body}</p>
              </div>
            );
          })}
        </div>
      </ServiceSection>

      <ServiceSection title="Ask about any of these">
        <InquiryForm subject="Other services" leadTime="2 business days" />
      </ServiceSection>
    </ServicePage>
  );
}
