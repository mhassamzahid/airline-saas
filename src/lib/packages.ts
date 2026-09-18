/**
 * Client for the package-catalog API (backend/packages/, see backend/README.md).
 * Deliberately separate from lib/cms.ts: this content isn't managed through
 * the Wagtail CMS, it's plain database rows (eventually updated via a
 * separate CSV-upload dashboard, not built yet). Every call is best-effort:
 * if the backend isn't running, callers fall back to the same hardcoded
 * content the data/*.ts files shipped with before this existed.
 */

import {
  CATEGORIES,
  MAKKAH_HOTELS,
  MADINAH_HOTELS,
  ROOM_SHARING,
  TRANSPORT_TIERS,
  ADDITIONAL_SERVICES,
  UMRAH_PACKAGES,
  VISA_PRICE_GBP,
  AIRPORT_TRANSFER_PRICE_GBP,
  ZIYARAT_PRICE_GBP,
  type CategoryDef,
  type HotelDef,
  type RoomSharingDef,
  type TransportTierDef,
  type AdditionalServiceDef,
  type PackageTierDef,
} from "@/data/umrah";
import { HAJJ_PACKAGES, type HajjPackage } from "@/data/hajj";
import { TOUR_PACKAGES, type TourPackage } from "@/data/tours";
import { PAKISTAN_TOUR_PACKAGES, type PakistanTourPackage } from "@/data/pakistan-tours";
import { getBackendOrigin } from "@/lib/site";

const PACKAGES_API_URL = process.env.PACKAGES_API_URL ?? `${getBackendOrigin()}/api/packages`;

async function fetchPackages<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${PACKAGES_API_URL}${path}`, { next: { revalidate: 10 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface UmrahCatalog {
  categories: CategoryDef[];
  hotels: HotelDef[];
  roomSharingOptions: RoomSharingDef[];
  transportTiers: TransportTierDef[];
  addOnServices: AdditionalServiceDef[];
  pricing: { visaPriceGBP: number; airportTransferPriceGBP: number; ziyaratPriceGBP: number };
  packages: PackageTierDef[];
}

const FALLBACK_UMRAH_CATALOG: UmrahCatalog = {
  categories: CATEGORIES,
  hotels: [...MAKKAH_HOTELS, ...MADINAH_HOTELS],
  roomSharingOptions: ROOM_SHARING,
  transportTiers: TRANSPORT_TIERS,
  addOnServices: ADDITIONAL_SERVICES,
  pricing: {
    visaPriceGBP: VISA_PRICE_GBP,
    airportTransferPriceGBP: AIRPORT_TRANSFER_PRICE_GBP,
    ziyaratPriceGBP: ZIYARAT_PRICE_GBP,
  },
  packages: UMRAH_PACKAGES,
};

export async function getUmrahCatalog(): Promise<UmrahCatalog> {
  const data = await fetchPackages<UmrahCatalog>("/umrah/");
  return data ?? FALLBACK_UMRAH_CATALOG;
}

export async function getHajjPackages(): Promise<HajjPackage[]> {
  const data = await fetchPackages<{ packages: HajjPackage[] }>("/hajj/");
  return data?.packages ?? HAJJ_PACKAGES;
}

export async function getTourPackages(): Promise<TourPackage[]> {
  const data = await fetchPackages<{ packages: TourPackage[] }>("/tours/");
  return data?.packages ?? TOUR_PACKAGES;
}

export async function getPakistanTourPackages(): Promise<PakistanTourPackage[]> {
  const data = await fetchPackages<{ packages: PakistanTourPackage[] }>("/pakistan-tours/");
  return data?.packages ?? PAKISTAN_TOUR_PACKAGES;
}
