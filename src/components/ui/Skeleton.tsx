import { cn } from "@/lib/utils";

/**
 * Base pulsing block. Every skeleton on the site is built from this so the
 * pulse timing and color stay identical everywhere. `motion-reduce` drops the
 * animation to a flat placeholder rather than a moving one.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-[6px] bg-canvas-sink motion-reduce:animate-none", className)}
    />
  );
}

/**
 * Matches PageIntro's image variant (the full-screen split hero every
 * top-level page now uses) so the swap-in on load doesn't reflow the page.
 */
export function HeroSkeleton() {
  return (
    <div className="flex min-h-[calc(100dvh-64px)] items-center sm:min-h-[calc(100dvh-96px)]">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <Skeleton className="order-first aspect-[16/10] rounded-[12px] lg:order-last lg:aspect-[4/5]" />
        <div>
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="mt-4 h-9 w-full max-w-[420px]" />
          <Skeleton className="mt-2.5 h-9 w-2/3 max-w-[260px]" />
          <Skeleton className="mt-5 h-4 w-full max-w-[480px]" />
          <Skeleton className="mt-2 h-4 w-3/4 max-w-[380px]" />
        </div>
      </div>
    </div>
  );
}

/** Matches PageIntro's plain (no-image) variant, used inside a PageContainer. */
export function IntroSkeleton() {
  return (
    <div className="max-w-[52ch]">
      <Skeleton className="h-3 w-16 rounded-full" />
      <Skeleton className="mt-4 h-8 w-full max-w-[380px]" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
    </div>
  );
}

/** Matches the HajjCard / TourCard / package-tile shape: photo, title, footer row. */
export function PackageCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[12px] border border-hairline bg-canvas">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2.5 h-3 w-1/2" />
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-hairline pt-3">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-14" />
        </div>
      </div>
    </div>
  );
}

export function PackageGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PackageCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** A row of pill-shaped filter chips, for browsers that filter by facet. */
export function FilterChipsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-full" />
      ))}
    </div>
  );
}

/** Matches ServicePage's body: a couple of headed sections plus a dark CTA band. */
export function ServiceBodySkeleton() {
  return (
    <>
      <section className="border-t border-hairline bg-canvas">
        <div className="mx-auto max-w-[1180px] space-y-14 px-5 py-14 sm:px-8 sm:py-16">
          <div>
            <Skeleton className="h-5 w-40" />
            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-t border-hairline-firm pt-4">
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                  <Skeleton className="mt-1.5 h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-32" />
            <div className="mt-4 space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-3.5 w-2/3" />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-dark">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-5 px-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-16">
          <div className="w-full max-w-[320px]">
            <Skeleton className="h-5 w-2/3 bg-on-dark/10" />
            <Skeleton className="mt-2 h-3.5 w-full bg-on-dark/10" />
          </div>
          <Skeleton className="h-11 w-40 shrink-0 rounded-[10px] bg-on-dark/10" />
        </div>
      </section>
    </>
  );
}
