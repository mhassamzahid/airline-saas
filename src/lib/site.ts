/**
 * Resolves this deployment's own public URL and the Django backend's origin,
 * without requiring either to be hand-typed into env vars on Vercel.
 *
 * When frontend and backend deploy as two Vercel Services in one project
 * (see vercel.json), they share a single domain, and Vercel injects that
 * domain as VERCEL_PROJECT_PRODUCTION_URL (stable, production) or VERCEL_URL
 * (per-deployment, e.g. previews) automatically. An explicit env var always
 * wins, for a split deployment (backend hosted elsewhere) or local dev.
 */

function vercelHost(): string | undefined {
  return process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
}

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const host = vercelHost();
  return host ? `https://${host}` : "http://localhost:3000";
}

export function getBackendOrigin(): string {
  const host = vercelHost();
  return host ? `https://${host}` : "http://127.0.0.1:8000";
}
