import { HeroSkeleton, ServiceBodySkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <ServiceBodySkeleton />
    </>
  );
}
