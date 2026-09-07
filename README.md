# Halcyon — front-end

A front-end-only prototype for **Halcyon**, an invented independent long-haul
airline. The product is an **image-first trip builder**: you tap big
photographs, and the only typing is the date range, three passenger steppers,
and a name + email at the end.

Six steps — `destination → when & who → cabin → departure → add-ons → review` —
with a live price summary and a "trip ready" progress bar. Destination and cabin
auto-advance on tap. The chosen destination's photo is pinned in the summary and
reused as a hero on the review and held screens. Ends by holding the fare.

Design contract: [`../design/DESIGN.md`](../design/DESIGN.md).

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind v4 (tokens in `src/app/globals.css`)
- `motion` for step transitions and feedback
- `zustand` for booking state (`src/store/useBookingStore.ts`)
- Radix primitives (select, switch, dialog) · `react-day-picker` · `@phosphor-icons/react`
- Geist + Geist Mono (self-hosted via `geist`)

No backend. Destinations, cabins, departure windows and add-ons are mock data in
`src/data/`; a chosen departure window maps to a generated flight
(`src/data/flights.ts`). Pricing engine: `src/lib/quote.ts`. "Hold this fare"
generates a client-side reference; nothing is submitted anywhere.

Placeholder photography is curated Unsplash photo IDs (`src/lib/img.ts`) — swap
for licensed art direction before launch.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Pages

| Route | What |
|---|---|
| `/` | The trip builder (6 image-first steps) |
| `/experience` | Marketing: cabins, what we build around, the fleet, route map |
| `/manage` | Retrieve a booking (demo ref `HN-2P4P84`, any surname) and change it |
| `/help` | Contact channels, FAQ, disruption guidance |
| `/signin` | Email + password or magic-link (front-end only, nothing submitted) |
| `not-found` | Custom 404 |

Navbar + Footer live in `app/layout.tsx`; every page renders inside them.

## Layout

```
src/
  app/                 layout, page (booking), experience, manage, help, signin, not-found, globals.css
  components/
    layout/            Navbar (with mobile menu), Footer
    booking/           BookingShell, ProgressRail, FareSummary, MobileFareBar, StepFrame
    steps/             StepDestination, StepWhenWho, StepCabin, StepDeparture, StepAddons, StepReview
    site/              PageIntro, ManageTripForm, SignInForm, BoardingPass
    ui/                Button, Field, Segmented, Stepper, ChoiceCard, PhotoCard, Photo, Toggle, RouteArc, Wordmark
  data/                airports (destinations + photos), flights (departure windows), cabins, fares, extras, fleet
  lib/                 quote engine + readiness, img (Unsplash helper), formatters, hooks
  store/               useBookingStore
  types/
```
