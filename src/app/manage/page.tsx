import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { ManageTripForm } from "@/components/site/ManageTripForm";

export const metadata = {
  title: "Manage your trip",
  description:
    "Retrieve a Halcyon booking to choose seats, add bags, or change your flights.",
};

export default function ManagePage() {
  return (
    <PageContainer>
      <PageIntro
        eyebrow="Manage your trip"
        title="Pick up where you left off"
        lede="Enter your reference and surname to change seats, add baggage, or move a flight. Changes follow your fare conditions."
        className="mb-10"
      />
      <ManageTripForm />
    </PageContainer>
  );
}
