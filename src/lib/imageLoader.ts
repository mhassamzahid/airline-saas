/**
 * Custom next/image loader (wired up via images.loaderFile in next.config.ts).
 *
 * Behind Vercel Services the default /_next/image optimizer isn't reachable
 * (requests fall through to the frontend's catch-all and come back as an HTML
 * page), so every photo broke. So images are sized at their source instead:
 *
 * - R2 copies of the placeholder photos (photos/<id>/<width>.webp) exist at a
 *   few fixed widths; pick the smallest one that covers the width asked for.
 * - Unsplash URLs (local dev, or photos not migrated yet) are resized by
 *   Unsplash itself, scaling `h` in step so the crop's aspect ratio is kept.
 * - Anything else (library uploads, CMS renditions, which are passed
 *   `unoptimized` anyway) is returned untouched.
 */
const R2_PHOTO = /^(.*\/photos\/photo-[\w-]+\/)\d+\.webp$/;
const R2_WIDTHS = [640, 1280, 2400];

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const r2 = src.match(R2_PHOTO);
  if (r2) {
    const fit = R2_WIDTHS.find((w) => w >= width) ?? R2_WIDTHS[R2_WIDTHS.length - 1];
    return `${r2[1]}${fit}.webp`;
  }

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
