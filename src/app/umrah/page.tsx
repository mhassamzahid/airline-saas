import { Suspense } from "react";
import { BookingShell } from "@/components/booking/BookingShell";

export const metadata = {
  title: "Build your Umrah package",
  description:
    "Plan an Umrah trip step by step: package, dates, cabin, flights and extras, with the price in view the whole way.",
};

export default function UmrahPage() {
  return (
    <Suspense fallback={null}>
      <BookingShell />
    </Suspense>
  );
}
