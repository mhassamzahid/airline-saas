import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { ToursBrowser } from "@/components/site/ToursBrowser";
import { getSiteSettings } from "@/lib/cms";
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
  const packages = await getTourPackages();
  const countries = new Set(packages.map((p) => p.country)).size;

  return (
    <>
      <PageIntro
        eyebrow="Tours"
        title="International Tour Packages"
        lede="Guided tours across Turkey, Thailand, Dubai, Malaysia, Europe and more. Filter by country, duration, price, group type or season, then open a package for the full itinerary."
        image={{ src: stock("photo-1512453979798-5ea266f8880c", 900, 1125), alt: "A guided international tour destination" }}
        heroVariant="tours"
        facts={[
          { value: String(countries), label: "Countries" },
          { value: String(packages.length), label: "Packages" },
        ]}
      />
      <PageContainer>
        <ToursBrowser packages={packages} />
      </PageContainer>
    </>
  );
}
