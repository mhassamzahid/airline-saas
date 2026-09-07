/**
 * Placeholder photography from Unsplash (stable, hotlinkable, free for demos).
 * Pass an Unsplash photo id. Swap for licensed, art-directed photography
 * before launch.
 */
export function stock(id: string, w = 1200, h = 1400) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}
