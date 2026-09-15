import { Suspense } from "react";
import { BookingShell } from "@/components/booking/BookingShell";
import { getUmrahCatalog } from "@/lib/packages";

export const metadata = {
  title: "Build your Umrah package",
  description:
    "Choose a ready-made Umrah package or build your own: category, dates, hotels, transport and add-ons, with an estimated price the whole way.",
};

export default async function UmrahPage() {
  const catalog = await getUmrahCatalog();

  return (
    <Suspense fallback={null}>
      <BookingShell catalog={catalog} />
    </Suspense>
  );
}
