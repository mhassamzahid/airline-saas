import { PageContainer } from "@/components/site/PageIntro";
import { HeroSkeleton, PackageGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <PageContainer>
        <Skeleton className="mb-10 h-14 w-full rounded-[10px]" />
        <PackageGridSkeleton />
      </PageContainer>
    </>
  );
}
