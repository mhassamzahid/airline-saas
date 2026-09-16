import { PageContainer } from "@/components/site/PageIntro";
import { IntroSkeleton, ServiceBodySkeleton } from "@/components/ui/Skeleton";

/** Generic fallback for routes without their own more specific loading.tsx. */
export default function Loading() {
  return (
    <>
      <PageContainer>
        <IntroSkeleton />
      </PageContainer>
      <ServiceBodySkeleton />
    </>
  );
}
