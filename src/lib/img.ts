/**
 * Placeholder photography, by Unsplash photo id.
 *
 * Once the photos have been copied into the R2 bucket (backend command
 * `migrate_images_to_r2`) and NEXT_PUBLIC_MEDIA_URL points at the bucket's
 * public address, this returns the R2 copy: one file per photo, cropped to
 * fit by <Photo>'s object-cover, and sized per request by imageLoader.ts.
 * With that unset it falls back to hot-linking Unsplash, so local dev works
 * without a bucket. Swap for licensed, art-directed photography before launch.
 */
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL?.replace(/\/$/, "");

export function stock(id: string, w = 1200, h = 1400) {
  if (MEDIA_URL) return `${MEDIA_URL}/photos/${id}/2400.webp`;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}
