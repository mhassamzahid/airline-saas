import type { NextConfig } from "next";

// Editor-uploaded media (hero images, etc.) is served straight from the
// Wagtail CMS host, so next/image needs that host allow-listed too -- derived
// from CMS_API_URL rather than hardcoded, so a real deployment's backend host
// doesn't need a second place to update.
const cmsUrl = new URL(process.env.CMS_API_URL ?? "http://127.0.0.1:8000/api/v2");

const nextConfig: NextConfig = {
  // Django's URLs require a trailing slash (/django-admin/, /api/packages/hajj/)
  // and it 301s to add one. Next's default "strip the trailing slash" 308 runs
  // at the Vercel edge ahead of the backend rewrites in vercel.json, so the two
  // redirects ping-pong forever (ERR_TOO_MANY_REDIRECTS). Disabling Next's
  // redirect lets backend paths reach Django untouched.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: cmsUrl.protocol.replace(":", "") as "http" | "https",
        hostname: cmsUrl.hostname,
        port: cmsUrl.port,
      },
    ],
  },
};

export default nextConfig;
