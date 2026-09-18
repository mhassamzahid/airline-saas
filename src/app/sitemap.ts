import type { MetadataRoute } from "next";
import { getHajjPackages, getTourPackages, getPakistanTourPackages } from "@/lib/packages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/umrah",
  "/hajj",
  "/tours",
  "/pakistan-tours",
  "/visa-consultation",
  "/air-ticketing",
  "/other-services",
  "/experience",
  "/help",
  "/manage",
  "/privacy-policy",
  "/terms-of-service",
];

/**
 * Package detail pages come from the same best-effort fetchers the pages
 * themselves use (src/lib/packages.ts) -- if the backend isn't reachable,
 * those already resolve to the hardcoded fallback content instead of
 * rejecting, so the sitemap never fails to build.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [hajj, tours, pakistanTours] = await Promise.all([
    getHajjPackages(),
    getTourPackages(),
    getPakistanTourPackages(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const packageEntries: MetadataRoute.Sitemap = [
    ...hajj.map((p) => ({ url: `${SITE_URL}/hajj/${p.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...tours.map((p) => ({ url: `${SITE_URL}/tours/${p.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...pakistanTours.map((p) => ({ url: `${SITE_URL}/pakistan-tours/${p.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
  ];

  return [...staticEntries, ...packageEntries];
}
