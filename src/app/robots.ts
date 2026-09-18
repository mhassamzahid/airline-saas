import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const SITE_URL = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Sign-in is a front-end-only prototype screen, not a real account
      // area -- nothing to index and no reason to send crawl budget there.
      disallow: ["/signin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
