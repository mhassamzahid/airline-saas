import { Clock } from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { HajjBrowser } from "@/components/site/HajjBrowser";
import { getHajjPackages } from "@/lib/packages";
import { stock } from "@/lib/img";

export const metadata = {
  title: "Hajj",
  description:
    "Hajj packages grouped by type: Government Scheme, Private Economy and Private Premium. Browse what's included and request a place.",
};

export default async function HajjPage() {
  const packages = await getHajjPackages();

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Hajj"
        title="A place for the season"
        lede="Hajj allocation is genuinely limited, so it isn't a filter: it's a short list of fixed packages grouped by type, each with its own quota and application deadline. Open one to see what's included and request a place."
        image={{ src: stock("photo-1554794470-42d3cd193ecc", 900, 1125), alt: "Pilgrims at the Grand Mosque" }}
        className="mb-8"
      />

      <div className="mb-10 flex items-start gap-3 rounded-[10px] border border-warning/30 bg-warning-bg px-4 py-3.5">
        <Clock size={18} weight="fill" className="mt-0.5 shrink-0 text-warning" />
        <p className="text-[13px] leading-relaxed text-ink">
          <span className="font-semibold">Places are quota&apos;d and time-bound.</span> Every
          package below has its own registration deadline and capacity, allocated in the order
          applications arrive, not on demand. Apply as early as you can.
        </p>
      </div>

      <HajjBrowser packages={packages} />
    </PageContainer>
  );
}
