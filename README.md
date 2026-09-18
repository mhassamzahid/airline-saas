# Halcyon

**Halcyon** is a design prototype for an invented independent long-haul
airline / travel agency, built as a **portal with four booking archetypes**
plus a set of static service pages, all sharing one design system:

- **Umrah** (`/umrah`) — a ground-services package builder. A landing screen
  filters an 11-package catalog (duration, category, hotel rating, distance,
  room type, price, month) down to ready-made packages, plus a "Build your
  own" fallback, leading into a 9-step builder (category, duration & dates,
  travellers, visa, hotels, transport, add-ons, review, submit) with a live
  quote sidebar.
- **Hajj** (`/hajj`) — a short list of fixed, quota'd packages grouped by
  type (Government Scheme / Private Economy / Private Premium), each with
  its own capacity and application deadline.
- **International Tours** (`/tours`) and **Pakistan Tours** (`/pakistan-tours`)
  — filterable browsing pages (country/region, duration, price, group type,
  season) over a catalog of guided packages, each with its own detail page.
- **Visa Consultation**, **Air Ticketing**, **Other Services** — static
  service pages, plus **Manage your trip**, **Help** and **Sign in** as
  secondary utilities.

Design contract: [`design/DESIGN.md`](./design/DESIGN.md) — the single
source of truth for tokens, type, spacing and component patterns. Read it
before changing any UI.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript
- Tailwind v4 (tokens in `src/app/globals.css`, light/dark + 4 accent themes)
- `motion` (Motion, formerly Framer Motion) for step transitions, crossfades and micro-feedback
- `zustand` for the Umrah booking wizard's state (`src/store/useBookingStore.ts`)
- Radix primitives (select, switch, dialog, checkbox, popover, radio-group, slider, tooltip) · `react-day-picker` · `@phosphor-icons/react`
- Geist + Geist Mono (self-hosted via the `geist` package)

## Backend

Content and package data are served by a separate Django + Wagtail backend
at [`backend/`](./backend) — see [`backend/README.md`](./backend/README.md)
for setup, the admin, and the CSV bulk-import tool for package pricing/
availability. The frontend talks to it over two read-only JSON APIs
(`src/lib/cms.ts` for CMS pages/settings, `src/lib/packages.ts` for package
catalogs), configured via `CMS_API_URL` / `PACKAGES_API_URL`.

**Every fetch is best-effort**: if the backend isn't running, both libraries
silently fall back to hardcoded content (originally in `src/data/*.ts`, now
mirrored in the backend's seed data), so the frontend always renders
something even with no backend at all. This makes the frontend runnable and
demoable entirely standalone.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Optionally, run the backend alongside it for real CMS/package content
instead of the hardcoded fallback — see `backend/README.md`. Copy
`.env.example` to `.env.local` to point at a non-default backend URL or set
the production site URL.

## Deploying (Vercel)

This repo deploys as **two Vercel Services in one project** — the Next.js
frontend (repo root) and the Django backend (`backend/`) — sharing a single
domain, defined in [`vercel.json`](./vercel.json). Vercel's importer
auto-detects this monorepo shape and offers a "Services" application preset;
`vercel.json` here already has both services and the routing wired up, so
you don't need to accept whatever it auto-generates.

**How the routing works:** everything under `/django-admin/*`, `/admin/*`,
`/documents/*`, `/api/v2/*`, `/api/packages/*`, `/packages/*` (the CSV
import tool), `/search`, `/static/*` and `/media/*` routes to the `backend`
service; every other path routes to `frontend`. (If you've only seen
Vercel's auto-generated `/api/backend/*` rewrite template — that's a generic
placeholder, not this project's actual URL scheme, so it's been replaced
with the real one above.)

Because both services share one domain, `src/lib/site.ts` resolves the
backend's origin and this site's own URL automatically from Vercel's
built-in `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL` env vars — **you don't
need to hand-type your Vercel domain into `CMS_API_URL`/`PACKAGES_API_URL`/
`NEXT_PUBLIC_SITE_URL`** for this same-project setup. Only set those
explicitly if you're overriding the default (e.g. hosting the backend on a
separate service elsewhere).

Set these as **Vercel project environment variables**, scoped to the
`backend` service (Project Settings → Environment Variables):

| Variable | Purpose |
|---|---|
| `DJANGO_SETTINGS_MODULE` | `halcyon.settings.production` |
| `SECRET_KEY` | Required — see `backend/README.md#deploying-to-production` for how to generate one |
| `DATABASE_URL` | A real hosted Postgres — SQLite doesn't persist on a serverless filesystem. See `backend/README.md` for the caveat on media/file uploads too |

Optional, on the `frontend` service, only if overriding the same-domain
defaults above:

| Variable | Purpose |
|---|---|
| `CMS_API_URL` | An external backend's Wagtail content API, e.g. `https://your-backend.example.com/api/v2` |
| `PACKAGES_API_URL` | An external backend's package-catalog API |
| `NEXT_PUBLIC_SITE_URL` | Override this site's canonical URL (custom domain, etc.) |

Without a reachable backend at all, the site still works using its built-in
fallback content, just without live package/CMS edits.

## Pages

| Route | What |
|---|---|
| `/` | The portal homepage — four entry points, category highlights, testimonials, FAQ |
| `/umrah` | Umrah package browser + 9-step "build your own" wizard |
| `/hajj`, `/hajj/[slug]` | Hajj package list and detail |
| `/tours`, `/tours/[slug]` | International Tours package list and detail |
| `/pakistan-tours`, `/pakistan-tours/[slug]` | Pakistan Tours package list and detail |
| `/visa-consultation`, `/air-ticketing`, `/other-services` | Static service pages (CMS-editable via Wagtail) |
| `/experience` | Marketing: cabins, the fleet, route map |
| `/manage` | Retrieve a booking (demo ref `HN-2P4P84`, any surname) and change it — front-end only |
| `/help` | Contact channels, FAQ, disruption guidance |
| `/signin` | Email + password or magic-link — front-end only, nothing submitted |
| `/privacy-policy`, `/terms-of-service` | Legal pages |
| `/[...slug]` | Catch-all for Wagtail `FlexiblePage` page-builder content |
| `/sitemap.xml`, `/robots.txt` | Generated (`src/app/sitemap.ts`, `src/app/robots.ts`) |
| `not-found` | Custom 404 |

Navbar + Footer live in `src/app/layout.tsx`; every page renders inside them.

## Layout

```
src/
  app/
    page.tsx                     portal homepage
    umrah/, hajj/, tours/, pakistan-tours/    package archetypes (+ [slug] detail routes)
    visa-consultation/, air-ticketing/, other-services/    static service pages
    experience/, manage/, help/, signin/      secondary utilities
    privacy-policy/, terms-of-service/        legal
    [...slug]/                   Wagtail FlexiblePage catch-all
    preview-blocks/[block]/      isolated block renderer for CMS block-picker screenshots
    sitemap.ts, robots.ts, layout.tsx, not-found.tsx, loading.tsx, globals.css
  components/
    layout/          Navbar (with mobile menu), Footer
    booking/          BookingShell, ProgressRail, FareSummary, MobileFareBar, StepFrame
    steps/            The Umrah wizard: StepLanding, StepCategory, StepDuration, StepTravelers,
                       StepVisa, StepHotels, StepTransport, StepServices, StepReviewQuote, StepSubmit
    site/             PageIntro, ServicePage, CinematicHero, FaqAccordion, HajjBrowser, ToursBrowser,
                       PakistanToursBrowser, TourCard, PakistanTourCard, QuickFilterWidget,
                       ManageTripForm, SignInForm, ContactForm, InquiryForm, BoardingPass
    flex/             PageBlocks (renders Wagtail page-builder StreamField blocks)
    ui/               Button, Field, Segmented, Stepper, ChoiceCard, Photo, PhotoCard, PhotoRotator,
                       Skeleton, Toggle, RouteArc, Wordmark
  data/               Hardcoded fallback content: hajj, tours, pakistan-tours, umrah, airports, cabins, fleet
  lib/                cms.ts (Wagtail content client), packages.ts (package-catalog client), quote.ts
                       (Umrah pricing engine), img.ts (Unsplash helper), icons.ts, sanitize.ts, hooks.ts
  store/              useBookingStore (Umrah wizard state)
  types/
backend/              Django + Wagtail CMS + packages app — see backend/README.md
design/               Design contract (DESIGN.md) and reference material
```
