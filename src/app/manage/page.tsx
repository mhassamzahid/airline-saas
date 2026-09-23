import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { ManageTripForm } from "@/components/site/ManageTripForm";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "Manage your trip",
    description: `Retrieve a ${site_title} booking to choose seats, add bags, or change your flights.`,
  };
}

export default async function ManagePage() {
  const { site_title } = await getSiteSettings();

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Manage your trip"
        title="Pick up where you left off"
        lede="Enter your reference and surname to change seats, add baggage, or move a flight. Changes follow your fare conditions."
        className="-mt-16 mb-10 sm:-mt-20"
      />
      <ManageTripForm siteTitle={site_title} />
    </PageContainer>
  );
}
