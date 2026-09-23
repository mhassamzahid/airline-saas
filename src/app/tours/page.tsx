import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { ServiceCta } from "@/components/site/ServicePage";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { ToursBrowser } from "@/components/site/ToursBrowser";
import { getCatalogueLandingContent, getLandingCopy, getLandingFaqSection, getSiteSettings } from "@/lib/cms";
import { getTourPackages } from "@/lib/packages";
import { stock } from "@/lib/img";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "International Tour Packages",
    description: `${site_title} guided tour packages across Turkey, Thailand, Dubai, Malaysia, Europe and more, filterable by country, duration, price, group type and season.`,
  };
}

export default async function ToursPage() {
  const [packages, landing] = await Promise.all([getTourPackages(), getCatalogueLandingContent("tours")]);
  const seasonCopy = getLandingCopy(landing, "season_intro", { slot: "season_intro", eyebrow: "Plan by season", heading: "Find a trip for the time you have", body: "Every package is tagged with a season. Compare the available itineraries below, then use the filters above to narrow by country, duration, group type or price." });
  const styleCopy = getLandingCopy(landing, "travel_style_intro", { slot: "travel_style_intro", eyebrow: "Travel style", heading: "Who is each itinerary for?", body: "These groups reflect the travel-style tags attached to the current package listings." });
  const faq = getLandingFaqSection(landing, { heading: "International tours, at a glance", items: [
    { question: "Which countries are available?", answer: "Use the country filter to see the available packages for each destination." },
    { question: "How do I compare itineraries?", answer: "Each package page lists its duration, season, itinerary, inclusions, exclusions and accommodation details." },
    { question: "Can I find a package for a particular travel style?", answer: "The package cards are tagged by group type. Use the group-type filter or the list above to see matching itineraries." },
    { question: "How much do the tours cost?", answer: "Prices vary by destination, duration and season. Each package card shows its current from-price, and the detail page explains what is included." },
  ] });
  const countries = new Set(packages.map((p) => p.country)).size;
  const seasonOrder = ["Spring", "Summer", "Autumn", "Winter", "Year-round"] as const;
  const seasons = seasonOrder.map((season) => ({ season, packages: packages.filter((p) => p.season === season) })).filter((group) => group.packages.length > 0);
  const travelStyles = ["Individual", "Couple", "Family", "Group"] as const;

  return (
    <>
      <PageIntro
        eyebrow={landing?.hero_eyebrow || "Tours"}
        title={landing?.hero_heading || "International Tour Packages"}
        lede={landing?.hero_subheading || "Guided tours across Turkey, Thailand, Dubai, Malaysia, Europe and more. Filter by country, duration, price, group type or season, then open a package for the full itinerary."}
        image={{ src: landing?.hero_image?.url || stock("photo-1512453979798-5ea266f8880c", 2000, 800), alt: landing?.hero_image?.alt || "A guided international tour destination", unoptimized: Boolean(landing?.hero_image?.url) }}
        heroVariant="tours"
        facts={[
          { value: String(countries), label: "Countries" },
          { value: String(packages.length), label: "Packages" },
        ]}
      />
      <PageContainer>
        <ToursBrowser packages={packages} />
      </PageContainer>

      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="overline mb-3">{seasonCopy.eyebrow}</p>
              <h2 className="max-w-[18ch] text-[26px] font-semibold leading-tight text-ink">{seasonCopy.heading}</h2>
              <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-body">{seasonCopy.body}</p>
            </div>
            <div className="divide-y divide-hairline border-y border-hairline">
              {seasons.map(({ season, packages: seasonPackages }) => (
                <div key={season} className="grid gap-2 py-4 sm:grid-cols-[110px_1fr] sm:gap-5">
                  <div>
                    <h3 className="text-[15px] font-semibold text-ink">{season}</h3>
                    <p className="mt-1 text-[12px] text-muted">{seasonPackages.length} option{seasonPackages.length === 1 ? "" : "s"}</p>
                  </div>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    {seasonPackages.map((p) => (
                      <li key={p.slug}><Link href={`/tours/${p.slug}`} className="inline-flex items-center gap-1 text-[13px] text-body hover:text-rust-700">{p.country}<ArrowRight size={12} />{p.name}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="border-t border-hairline bg-canvas-soft">
        <PageContainer className="py-14 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="overline mb-3">{styleCopy.eyebrow}</p>
              <h2 className="text-[24px] font-semibold text-ink">{styleCopy.heading}</h2>
            </div>
            <p className="max-w-[44ch] text-[13px] leading-relaxed text-body">{styleCopy.body}</p>
          </div>
          <div className="mt-7 grid gap-x-10 sm:grid-cols-2">
            {travelStyles.map((style) => {
              const matches = packages.filter((p) => p.groupTypes.includes(style));
              return (
                <div key={style} className="border-t border-hairline-firm py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[16px] font-semibold text-ink">{style}</h3>
                    <span data-numeric className="text-[12px] text-muted">{matches.length} package{matches.length === 1 ? "" : "s"}</span>
                  </div>
                  {matches.length > 0 && <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">{matches.map((p) => <li key={p.slug}><Link href={`/tours/${p.slug}`} className="text-[13px] text-body underline decoration-hairline-firm underline-offset-4 hover:text-rust-700">{p.name}</Link></li>)}</ul>}
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="grid gap-8 py-14 sm:py-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
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
