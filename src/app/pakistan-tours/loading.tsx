import { PageContainer } from "@/components/site/PageIntro";
import { FilterChipsSkeleton, HeroSkeleton, PackageGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <PageContainer>
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-40 rounded-[8px]" />
        </div>
        <div className="mt-4">
          <FilterChipsSkeleton />
        </div>
        <div className="mt-3">
          <FilterChipsSkeleton count={4} />
        </div>
        <Skeleton className="mt-5 h-3.5 w-20" />
        <div className="mt-3">
          <PackageGridSkeleton />
        </div>
      </PageContainer>
    </>
  );
}
