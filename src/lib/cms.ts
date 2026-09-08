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
