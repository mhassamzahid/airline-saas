import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { DestinationsBrowser } from "@/components/site/DestinationsBrowser";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "International & Pakistan Tours",
    description: `Every ${site_title} route, filterable by region (including Pakistan) and price. Browse before you enquire.`,
  };
}

export default function ToursPage() {
  return (
    <PageContainer>
      <PageIntro
        eyebrow="Tours"
        title="International & Pakistan Tours"
        lede="Ten nonstop routes from three UK bases, including Lahore, Karachi and Islamabad. Filter by region or search a city, then open a destination to enquire."
        className="mb-10"
      />
      <DestinationsBrowser />
    </PageContainer>
  );
}
