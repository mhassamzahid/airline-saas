import { FilterChipsSkeleton, PackageCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 pt-8 pb-32 sm:px-8 lg:pb-16">
      <div className="flex min-h-[calc(100dvh-160px)] items-center sm:min-h-[calc(100dvh-190px)]">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <Skeleton className="h-3 w-14 rounded-full" />
            <Skeleton className="mt-4 h-9 w-full max-w-[380px]" />
            <Skeleton className="mt-2.5 h-9 w-1/2 max-w-[220px]" />
            <Skeleton className="mt-4 h-4 w-full max-w-[480px]" />
            <Skeleton className="mt-2 h-4 w-3/4 max-w-[380px]" />
          </div>
          <Skeleton className="order-first aspect-[16/10] rounded-[12px] lg:order-last lg:aspect-[4/5]" />
        </div>
      </div>

      <div className="mt-8">
        <FilterChipsSkeleton />
        <div className="mt-3">
          <FilterChipsSkeleton count={4} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-[8px]" />
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <PackageCardSkeleton key={i} />
        ))}
        <div className="overflow-hidden rounded-[12px] border-2 border-dashed border-hairline-firm bg-canvas-soft">
          <Skeleton className="aspect-[4/3] w-full rounded-none bg-canvas-sink/60" />
          <div className="p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2.5 h-3 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
