import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { PakistanToursBrowser } from "@/components/site/PakistanToursBrowser";
import { getSiteSettings } from "@/lib/cms";
import { getPakistanTourPackages } from "@/lib/packages";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "Pakistan Tour Packages",
    description: `${site_title} domestic tour packages across Hunza, Skardu, Swat, Murree, Naran/Kaghan and more, filterable by region, duration, price, group type and season.`,
  };
}

export default async function PakistanToursPage() {
  const packages = await getPakistanTourPackages();

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Tours"
        title="Pakistan Tour Packages"
        lede="From Hunza's glacial lakes to a family weekend in Murree. Filter by region, duration, price, group type or season, then open a package for the full itinerary."
        className="mb-10"
      />
      <PakistanToursBrowser packages={packages} />
    </PageContainer>
  );
}
