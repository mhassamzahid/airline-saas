import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { ToursBrowser } from "@/components/site/ToursBrowser";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "International Tour Packages",
    description: `${site_title} guided tour packages across Turkey, Thailand, Dubai, Malaysia, Europe and more, filterable by country, duration, price, group type and season.`,
  };
}

export default function ToursPage() {
  return (
    <PageContainer>
      <PageIntro
        eyebrow="Tours"
        title="International Tour Packages"
        lede="Guided tours across Turkey, Thailand, Dubai, Malaysia, Europe and more. Filter by country, duration, price, group type or season, then open a package for the full itinerary."
        className="mb-10"
      />
      <ToursBrowser />
    </PageContainer>
  );
}
