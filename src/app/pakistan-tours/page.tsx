import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { ServiceCta } from "@/components/site/ServicePage";
import { Photo } from "@/components/ui/Photo";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { PakistanToursBrowser } from "@/components/site/PakistanToursBrowser";
import { getCatalogueLandingContent, getLandingCopy, getLandingFaqSection, getSiteSettings } from "@/lib/cms";
import { getPakistanTourPackages } from "@/lib/packages";
import { stock } from "@/lib/img";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "Pakistan Tour Packages",
    description: `${site_title} domestic tour packages across Hunza, Skardu, Swat, Murree, Naran/Kaghan and more, filterable by region, duration, price, group type and season.`,
  };
}

export default async function PakistanToursPage() {
  const [packages, landing] = await Promise.all([getPakistanTourPackages(), getCatalogueLandingContent("pakistan-tours")]);
  const regionCopy = getLandingCopy(landing, "region_intro", { slot: "region_intro", eyebrow: "Explore the regions", heading: "Choose where to go", body: "Browse the destinations represented in the current catalogue. Each route page has its own itinerary, duration, accommodation and inclusions." });
  const seasonCopy = getLandingCopy(landing, "season_intro", { slot: "season_intro", eyebrow: "Timing", heading: "Packages by season", body: "Season labels follow the availability recorded for each package." });
  const faq = getLandingFaqSection(landing, { heading: "Pakistan tours, at a glance", items: [
    { question: "Which regions are represented?", answer: "Browse the index above or use the region filter to find a route." },
    { question: "When should I travel?", answer: "Each package is tagged with a season. Open a package for its itinerary and accommodation details before choosing dates." },
    { question: "How long are the trips?", answer: "Durations vary by route. The package cards show the number of days, and each detail page has the full itinerary." },
    { question: "What is included in the price?", answer: "Inclusions are listed on each package detail page, along with the stays and day-by-day itinerary." },
  ] });
  const regions = new Set(packages.map((p) => p.region)).size;
  const regionGroups = Array.from(new Set(packages.map((p) => p.region))).map((region) => ({ region, packages: packages.filter((p) => p.region === region) }));
  const seasons = ["Spring", "Summer", "Autumn", "Winter", "Year-round"] as const;
  const seasonalPackages = seasons.map((season) => ({ season, packages: packages.filter((p) => p.season === season) })).filter((group) => group.packages.length > 0);
  const scenicPackage = packages.find((p) => !p.featured) ?? packages[0];

  return (
    <>
      <PageIntro
        eyebrow={landing?.hero_eyebrow || "Tours"}
        title={landing?.hero_heading || "Pakistan Tour Packages"}
        lede={landing?.hero_subheading || "From Hunza's glacial lakes to a family weekend in Murree. Filter by region, duration, price, group type or season, then open a package for the full itinerary."}
        image={{ src: landing?.hero_image?.url || stock("photo-1603491656337-3b491147917c", 2000, 800), alt: landing?.hero_image?.alt || "A Pakistan tour destination in the northern valleys", unoptimized: Boolean(landing?.hero_image?.url) }}
        heroVariant="pakistan-tours"
        facts={[
          { value: String(regions), label: "Regions" },
          { value: String(packages.length), label: "Packages" },
        ]}
      />
      <PageContainer>
        <PakistanToursBrowser packages={packages} />
      </PageContainer>

      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
            <div>
              <p className="overline mb-3">{regionCopy.eyebrow}</p>
              <h2 className="max-w-[18ch] text-[26px] font-semibold leading-tight text-ink">{regionCopy.heading}</h2>
              <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-body">{regionCopy.body}</p>
              {scenicPackage && (
                <Link href={`/pakistan-tours/${scenicPackage.slug}`} className="group mt-6 block">
                  <Photo src={scenicPackage.image} alt={scenicPackage.name} sizes="(min-width: 1024px) 38vw, 100vw" className="aspect-[4/3] w-full rounded-[10px] border border-hairline" />
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-body group-hover:text-rust-700">{scenicPackage.name}<ArrowRight size={14} /></span>
                </Link>
              )}
            </div>
            <ol className="divide-y divide-hairline border-y border-hairline">
              {regionGroups.map(({ region, packages: regionPackages }, i) => {
                const lead = regionPackages[0];
                return (
                  <li key={region}>
                    <Link href={`/pakistan-tours/${lead.slug}`} className="group grid grid-cols-[34px_1fr_auto] items-center gap-3 py-4 sm:grid-cols-[44px_1fr_auto] sm:gap-4">
                      <span data-numeric className="text-[12px] text-rust-700">{String(i + 1).padStart(2, "0")}</span>
                      <span><span className="block text-[15px] font-semibold text-ink group-hover:text-rust-700">{region}</span><span className="mt-1 block text-[12px] text-muted">{regionPackages.map((p) => p.name).join(" · ")}</span></span>
                      <span className="inline-flex items-center gap-1 text-[12px] text-body"><span className="hidden sm:inline">Explore</span><ArrowRight size={14} /></span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </PageContainer>
      </section>

      <section className="border-t border-hairline bg-canvas-soft">
        <PageContainer className="py-14 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="overline mb-3">{seasonCopy.eyebrow}</p><h2 className="text-[24px] font-semibold text-ink">{seasonCopy.heading}</h2></div>
            <p className="max-w-[42ch] text-[13px] leading-relaxed text-body">{seasonCopy.body}</p>
          </div>
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {seasonalPackages.map(({ season, packages: seasonPackages }) => (
              <div key={season} className="border-t border-hairline-firm pt-3">
                <div className="flex items-baseline justify-between gap-2"><h3 className="text-[15px] font-semibold text-ink">{season}</h3><span data-numeric className="text-[12px] text-muted">{seasonPackages.length}</span></div>
                <ul className="mt-3 space-y-2">{seasonPackages.map((p) => <li key={p.slug}><Link href={`/pakistan-tours/${p.slug}`} className="text-[13px] leading-relaxed text-body underline decoration-hairline-firm underline-offset-4 hover:text-rust-700">{p.region}: {p.name}</Link></li>)}</ul>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="grid gap-8 py-14 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div><p className="overline mb-3">Questions</p><h2 className="text-[24px] font-semibold text-ink">{faq.heading}</h2></div>
          <FaqAccordion faqs={faq.items} />
        </PageContainer>
      </section>

      <ServiceCta
        heading="Ready to plan your trip?"
        body="Browse packages above, or tell us what you're after and we'll help you find it."
        label="Get in touch"
        href="/contact"
      />
    </>
  );
}
