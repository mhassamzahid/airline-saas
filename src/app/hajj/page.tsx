import { Clock } from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { HajjBrowser } from "@/components/site/HajjBrowser";

export const metadata = {
  title: "Hajj",
  description:
    "Hajj packages grouped by type: Government Scheme, Private Economy and Private Premium. Browse what's included and request a place.",
};

export default function HajjPage() {
  return (
    <PageContainer>
      <PageIntro
        eyebrow="Hajj"
        title="A place for the season"
        lede="Hajj allocation is genuinely limited, so it isn't a filter: it's a short list of fixed packages grouped by type, each with its own quota and application deadline. Open one to see what's included and request a place."
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

      <HajjBrowser />
    </PageContainer>
  );
}
