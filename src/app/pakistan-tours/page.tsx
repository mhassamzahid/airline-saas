import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { PakistanToursBrowser } from "@/components/site/PakistanToursBrowser";
import { getSiteSettings } from "@/lib/cms";
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
  const packages = await getPakistanTourPackages();
  const regions = new Set(packages.map((p) => p.region)).size;

  return (
    <>
      <PageIntro
        eyebrow="Tours"
        title="Pakistan Tour Packages"
        lede="From Hunza's glacial lakes to a family weekend in Murree. Filter by region, duration, price, group type or season, then open a package for the full itinerary."
        image={{ src: stock("photo-1603491656337-3b491147917c", 2000, 800), alt: "A Pakistan tour destination in the northern valleys" }}
        heroVariant="pakistan-tours"
        facts={[
          { value: String(regions), label: "Regions" },
          { value: String(packages.length), label: "Packages" },
        ]}
      />
      <PageContainer>
        <PakistanToursBrowser packages={packages} />
      </PageContainer>
    </>
  );
}
