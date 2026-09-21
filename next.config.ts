import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Django's URLs require a trailing slash (/django-admin/, /api/packages/hajj/)
  // and it 301s to add one. Next's default "strip the trailing slash" 308 runs
  // at the Vercel edge ahead of the backend rewrites in vercel.json, so the two
  // redirects ping-pong forever (ERR_TOO_MANY_REDIRECTS). Disabling Next's
  // redirect lets backend paths reach Django untouched.
  skipTrailingSlashRedirect: true,

  // The default /_next/image optimizer isn't reachable behind Vercel Services
  // (see src/lib/imageLoader.ts), so photos are resized by their own host
  // instead. CMS-served images bypass this via <Photo unoptimized>.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
};

export default nextConfig;
