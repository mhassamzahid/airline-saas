/**
 * Regenerates the page-builder block preview images shown in the Wagtail
 * block picker.
 *
 * For each block it loads `/preview-blocks/<key>` (rendered from
 * `src/lib/blockPlaceholders.ts`, no page chrome) and screenshots it into
 * `backend/flexpages/static/flexpages/previews/<key>.png`.
 *
 * Prereqs: the Next.js site running, and Chromium for Playwright
 * (`npx playwright install chromium`).
 *
 * Usage:  npm run gen:block-previews
 *         PREVIEW_BASE_URL=http://localhost:3001 npm run gen:block-previews
 */
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const BASE_URL = process.env.PREVIEW_BASE_URL ?? "http://localhost:3000";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "backend/flexpages/static/flexpages/previews");

const BLOCKS = [
  "hero",
  "rich_text",
  "image",
  "feature_grid",
  "cta_band",
  "faq",
  "stats",
  "testimonials",
];

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 900 },
  deviceScaleFactor: 2,
});

let failed = 0;
for (const block of BLOCKS) {
  const url = `${BASE_URL}/preview-blocks/${block}`;
  try {
    const res = await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    if (!res || !res.ok()) throw new Error(`HTTP ${res && res.status()}`);
    const target = page.locator("#block-preview");
    await target.waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(300); // let webfonts / images settle
    await target.screenshot({ path: join(OUT_DIR, `${block}.png`) });
    console.log(`  ok  ${block}.png`);
  } catch (err) {
    failed += 1;
    console.error(`  FAIL ${block}: ${err.message}`);
  }
}

await browser.close();

if (failed) {
  console.error(`\n${failed} block(s) failed. Is the site up at ${BASE_URL}?`);
  process.exit(1);
}
console.log(`\nWrote ${BLOCKS.length} previews to ${OUT_DIR}`);
console.log("In production, run `python manage.py collectstatic` in backend/.");
