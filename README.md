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

`vercel.json` sets the framework, security headers, and static-asset cache
headers. Before deploying, set these as **Vercel project environment
variables** (not in `vercel.json`, since it's committed to git):

| Variable | Purpose |
|---|---|
| `CMS_API_URL` | The deployed backend's Wagtail content API (defaults to `http://127.0.0.1:8000/api/v2`, which only works locally) |
| `PACKAGES_API_URL` | The deployed backend's package-catalog API (defaults to `http://127.0.0.1:8000/api/packages`) |
| `NEXT_PUBLIC_SITE_URL` | This site's real production URL — used for `metadataBase`/OpenGraph tags, `sitemap.xml` and `robots.txt` |

The Django backend itself isn't a Next.js app and doesn't deploy to Vercel —
host it separately (Railway/Render/Fly/a VM) and point the two API URLs at
it. Without a reachable backend, the site still works using its built-in
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
