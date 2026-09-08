/**
 * Client for the Wagtail CMS API (backend/, see backend/README.md).
 * Every call is best-effort: if the CMS isn't running, callers get `null`
 * back and fall back to the hardcoded copy that page already had, rather
 * than the page crashing because a local dev server isn't up.
 */

const CMS_API_URL = process.env.CMS_API_URL ?? "http://127.0.0.1:8000/api/v2";

async function fetchCms<T>(path: string): Promise<T | null> {
  try {
    // A short revalidate window (rather than cache: "no-store") keeps pages
    // statically generated -- no-store on a fetch used from the root layout's
    // Footer would mark every route in the app dynamic, not just this one.
    const res = await fetch(`${CMS_API_URL}${path}`, { next: { revalidate: 10 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface CmsIconTextLink {
  icon_name: string;
  image: { id: number } | null;
  label: string;
  body: string;
  href: string;
  action_label: string;
}

export interface CmsTestimonial {
  quote: string;
  name: string;
  detail: string;
}

export interface CmsFaq {
  question: string;
  answer: string;
}

interface CmsListResponse<T> {
  items: T[];
}

export interface CmsHomePage {
  hero_eyebrow: string;
  hero_heading: string;
  hero_subheading: string;
  body: (
    | { type: "category_cards"; value: CmsIconTextLink[] }
    | { type: "highlights"; value: CmsIconTextLink[] }
    | { type: "testimonials"; value: CmsTestimonial[] }
    | { type: "faqs"; value: CmsFaq[] }
  )[];
}

export async function getHomePage(): Promise<CmsHomePage | null> {
  const data = await fetchCms<CmsListResponse<CmsHomePage>>(
    "/pages/?type=home.HomePage&fields=*",
  );
  return data?.items[0] ?? null;
}

export interface CmsServicePage {
  eyebrow: string;
  lede: string;
  sections: (
    | { type: "checklist"; value: { title: string; items: string[] } }
    | { type: "steps"; value: { title: string; steps: { title: string; body: string }[] } }
    | { type: "tile_grid"; value: { title: string; tiles: CmsIconTextLink[] } }
    | { type: "paragraph"; value: { title: string; text: string } }
  )[];
}

export async function getServicePage(slug: string): Promise<CmsServicePage | null> {
  const data = await fetchCms<CmsListResponse<CmsServicePage>>(
    `/pages/?type=services.ServicePage&slug=${slug}&fields=*`,
  );
  return data?.items[0] ?? null;
}

export interface CmsHelpPage {
  eyebrow: string;
  lede: string;
  body: (
    | { type: "channels"; value: CmsIconTextLink[] }
    | { type: "faqs"; value: CmsFaq[] }
  )[];
  disruption_heading: string;
  disruption_steps: { type: "step"; value: { title: string; body: string } }[];
}

export async function getHelpPage(): Promise<CmsHelpPage | null> {
  const data = await fetchCms<CmsListResponse<CmsHelpPage>>(
    "/pages/?type=support.HelpPage&fields=*",
  );
  return data?.items[0] ?? null;
}

export interface CmsFooterSettings {
  tagline: string;
  legal_line: string;
}

export async function getFooterSettings(): Promise<CmsFooterSettings | null> {
  return fetchCms<CmsFooterSettings>("/footer-settings/");
}

// Keep in sync with THEME_CHOICES / COLOR_MODE_CHOICES in
// backend/home/models.py and the [data-theme=...] / [data-mode=...] blocks
// in src/app/globals.css.
export const SITE_THEMES = ["rust", "ocean", "forest", "midnight"] as const;
export type SiteTheme = (typeof SITE_THEMES)[number];

export const COLOR_MODES = ["light", "dark", "system"] as const;
export type ColorMode = (typeof COLOR_MODES)[number];

export interface CmsSiteSettings {
  site_title: string;
  theme: SiteTheme;
  color_mode: ColorMode;
  logo_url: string | null;
  favicon_url: string | null;
}

const DEFAULT_SITE_SETTINGS: CmsSiteSettings = {
  site_title: "Halcyon",
  theme: "rust",
  color_mode: "light",
  logo_url: null,
  favicon_url: null,
};

interface RawSiteSettings {
  site_title: string;
  theme: string;
  color_mode: string;
  logo_url: string | null;
  favicon_url: string | null;
}

export async function getSiteSettings(): Promise<CmsSiteSettings> {
  const data = await fetchCms<RawSiteSettings>("/site-settings/");
  if (!data) return DEFAULT_SITE_SETTINGS;
  const theme = (SITE_THEMES as readonly string[]).includes(data.theme)
    ? (data.theme as SiteTheme)
    : DEFAULT_SITE_SETTINGS.theme;
  const color_mode = (COLOR_MODES as readonly string[]).includes(data.color_mode)
    ? (data.color_mode as ColorMode)
    : DEFAULT_SITE_SETTINGS.color_mode;
  return {
    site_title: data.site_title || DEFAULT_SITE_SETTINGS.site_title,
    theme,
    color_mode,
    logo_url: data.logo_url ?? null,
    favicon_url: data.favicon_url ?? null,
  };
}
