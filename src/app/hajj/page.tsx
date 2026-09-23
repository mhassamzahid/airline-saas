import { Clock } from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { ServiceCta } from "@/components/site/ServicePage";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { HajjBrowser } from "@/components/site/HajjBrowser";
import { getHajjPackages } from "@/lib/packages";
import { getCatalogueLandingContent, getLandingCopy, getLandingFaqSection } from "@/lib/cms";
import { stock } from "@/lib/img";
import { formatGBP } from "@/lib/utils";

export const metadata = {
  title: "Hajj",
  description:
    "Hajj packages grouped by type: Government Scheme, Private Economy and Private Premium. Browse what's included and request a place.",
};

export default async function HajjPage() {
  const [packages, landing] = await Promise.all([getHajjPackages(), getCatalogueLandingContent("hajj")]);
  const ritesCopy = getLandingCopy(landing, "rites_intro", { slot: "rites_intro", eyebrow: "The rites", heading: "A clear outline of the Hajj journey", body: "The order below follows the itinerary published with the packages. Your selected package page has its full plan and accommodation details." });
  const comparisonCopy = getLandingCopy(landing, "comparison_intro", { slot: "comparison_intro", eyebrow: "Compare the options", heading: "Hajj package details", body: "Quotas, deadlines, duration and prices come from each package listing." });
  const faq = getLandingFaqSection(landing, { heading: "Hajj, at a glance", items: [
    { question: "How much do Hajj packages cost?", answer: `Current package prices start at ${packages.length ? formatGBP(Math.min(...packages.map((p) => p.fromPriceGBP))) : "the listed price"}. Each package shows its own price, duration, quota and application deadline above.` },
    { question: "How do the package types differ?", answer: "Compare the accommodation, transport, meals and guide details on each package page, alongside the quota and deadline in the table above." },
    { question: "When should I apply?", answer: "Each package has its own application deadline and quota. Check both on the package you are considering and apply before its deadline." },
    { question: "What is included?", answer: "Inclusions vary by package. Open a package to review its accommodation, transport, meals, guide and itinerary before enquiring." },
  ] });
  const fromPriceGBP = packages.length ? Math.min(...packages.map((p) => p.fromPriceGBP)) : undefined;

  return (
    <>
      <PageIntro
        eyebrow={landing?.hero_eyebrow || "Hajj"}
        title={landing?.hero_heading || "A place for the season"}
        lede={landing?.hero_subheading || "Hajj allocation is genuinely limited, so it isn't a filter: it's a short list of fixed packages grouped by type, each with its own quota and application deadline. Open one to see what's included and request a place."}
        image={{ src: landing?.hero_image?.url || stock("photo-1554794470-42d3cd193ecc", 2000, 800), alt: landing?.hero_image?.alt || "Pilgrims at the Grand Mosque", unoptimized: Boolean(landing?.hero_image?.url) }}
        heroVariant="hajj"
        facts={[
          { value: String(packages.length), label: "Package tiers" },
          ...(fromPriceGBP ? [{ value: formatGBP(fromPriceGBP), label: "From" }] : []),
          { value: "Quota'd", label: "Places are limited" },
        ]}
      />

      <PageContainer>
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

      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="overline mb-3">{ritesCopy.eyebrow}</p>
              <h2 className="max-w-[18ch] text-[26px] font-semibold leading-tight text-ink">{ritesCopy.heading}</h2>
              <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-body">{ritesCopy.body}</p>
            </div>
            <ol className="divide-y divide-hairline border-y border-hairline">
              {(packages[0]?.itinerary ?? []).map((item, i) => (
                <li key={item.title} className="grid gap-2 py-4 sm:grid-cols-[40px_1fr] sm:gap-4">
                  <span data-numeric className="text-[13px] font-semibold text-rust-700">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-body">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </PageContainer>
      </section>

      <section className="border-t border-hairline bg-canvas-soft">
        <PageContainer className="py-14 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="overline mb-3">{comparisonCopy.eyebrow}</p>
              <h2 className="text-[24px] font-semibold text-ink">{comparisonCopy.heading}</h2>
            </div>
            <p className="max-w-[42ch] text-[13px] leading-relaxed text-body">{comparisonCopy.body}</p>
          </div>
          <div className="mt-7 overflow-x-auto rounded-[10px] border border-hairline bg-canvas">
            <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
              <thead className="bg-canvas-soft text-[11px] font-semibold uppercase tracking-[.1em] text-muted">
                <tr><th className="px-4 py-3">Package</th><th className="px-4 py-3">Nights</th><th className="px-4 py-3">From</th><th className="px-4 py-3">Quota</th><th className="px-4 py-3">Apply by</th></tr>
              </thead>
              <tbody>
                {packages.map((p) => (
                  <tr key={p.slug} className="border-t border-hairline">
                    <th scope="row" className="px-4 py-4 font-medium text-ink">{p.type}</th>
                    <td data-numeric className="px-4 py-4 text-body">{p.nights}</td>
                    <td data-numeric className="px-4 py-4 font-medium text-ink">{formatGBP(p.fromPriceGBP)}</td>
                    <td className="px-4 py-4 text-body">{p.quota}</td>
                    <td className="px-4 py-4 text-body">{p.applicationDeadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageContainer>
      </section>

      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="grid gap-8 py-14 sm:py-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="overline mb-3">Questions</p>
            <h2 className="text-[24px] font-semibold text-ink">{faq.heading}</h2>
          </div>
          <FaqAccordion faqs={faq.items} />
        </PageContainer>
      </section>

      <ServiceCta
        heading="Ready to apply for Hajj?"
        body="Places are quota'd and allocated in the order applications arrive."
        label="Get in touch"
        href="/contact"
      />
    </>
  );
}
