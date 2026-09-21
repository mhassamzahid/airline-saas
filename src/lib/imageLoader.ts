/**
 * Custom next/image loader (wired up via images.loaderFile in next.config.ts).
 *
 * Behind Vercel Services the default /_next/image optimizer isn't reachable
 * (requests fall through to the frontend's catch-all and come back as an HTML
 * page), so every photo broke. Photos here are Unsplash URLs, and Unsplash
 * already resizes and re-encodes on demand, so ask it directly for the width
 * next/image wants, scaling `h` in step so the crop's aspect ratio is kept.
 * Anything else (e.g. CMS renditions, which are passed `unoptimized` anyway)
 * is returned untouched.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  if (url.hostname !== "images.unsplash.com") return src;

  const w0 = Number(url.searchParams.get("w"));
  const h0 = Number(url.searchParams.get("h"));
  url.searchParams.set("w", String(width));
  if (w0 > 0 && h0 > 0) url.searchParams.set("h", String(Math.round((h0 * width) / w0)));
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
}
