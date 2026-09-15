---
version: 1
name: halcyon-design
description: "Design contract for Halcyon — an independent long-haul airline. The site is built around six core sections — Umrah (build a package), Hajj (fixed quota'd packages), International Tour Packages and Pakistan Tour Packages (each its own filtered browsing page), and Visa Consultation / Air Ticketing (static pages) — plus Other Services, Manage trip and Help as secondary utilities. The Umrah flow is a ground-services package builder (category, dates, travellers, visa, hotels, transport, add-ons), not a flight booking: pick a fixed tier (skips straight to review) or build custom, with a live quote and a running 'trip ready' bar. Restrained chrome (kingfisher-rust + Geist), the photography carries the warmth."
---

# Halcyon — Design Contract

Single source of truth for all UI.

**Site shape (restructured into a portal, see §7A):** the homepage is a
portal with four entry points (Umrah, Hajj, International Tours, Pakistan
Tours) plus static service pages, all sharing one design system. The
categories and their archetypes were given as a brief to follow exactly (a
generalized category-portal pattern, with real-brand examples per archetype)
rather than invented; Halcyon's own brand voice, palette and photography
style carry the execution. The Umrah flow lives at `/umrah`: a landing screen
that filters an 11-package catalog (Duration, Category, hotel rating,
distance, room type, price and month, all AND-combined and instant) down to
matching ready-made packages, plus a "Build your own" fallback, leading into
a 9-step ground-services builder (category, duration & dates, travellers,
visa, hotels, transport, add-ons, review, submit) with a live quote sidebar
and a running "trip ready" bar. Picking a filtered package pre-fills every
step and jumps straight to the last one — nothing is hidden, the traveller
can still go back to any step via the rail.

**Look:** the *chrome* stays restrained — the Stripe reference system
(forms-as-product, tabular figures, tight radii, hairlines) with a deep
kingfisher amber/rust accent and Geist. The **photography carries the warmth** (Airbnb /
modern-editorial), not gold-and-serif decoration.

Taste note: this is product UI, which the `design-taste-frontend` skill does not
cover. Its discipline still applies as anti-slop rules: one accent, shape lock,
no em-dashes, no AI-purple, real images, Geist over Inter.

---

## 1. Principles

1. **The number is the hero.** Fares, times, durations, seat rows, passenger counts
   are set in Geist Mono with tabular figures. They never shift width as they change.
2. **Hairlines, not boxes.** Group with `1px` borders and negative space before
   reaching for a card or a shadow.
3. **One calm accent.** Rust appears on the primary action, the current step, focus
   rings, and selected state. Nowhere decorative.
4. **Motion confirms, never entertains.** Step transitions, price-change pulses,
   selection feedback. All ≤ 400ms, all spring or `cubic-bezier(0.16,1,0.3,1)`,
   all gone under `prefers-reduced-motion`.
5. **Every state is designed.** Loading (skeletons that match final shape), empty,
   error (inline, below field), and the held-fare confirmation.

---

## 2. Color

Light theme only for v1 (booking flows are near-universally light for legibility
and trust). Tokens are CSS variables in `globals.css`. No section inverts except
the footer, which is a deliberate full dark block.

```
/* Accent — kingfisher amber/rust (v2: swapped from the original kingfisher-teal
   after review; keeps the bird's other half — a kingfisher has a blue back and
   a rust-orange breast) */
--rust-700:   #9f3d14;   /* primary action, pressed */
--rust-600:   #c44f1c;   /* primary hover */
--rust-500:   #dd6531;   /* focus ring, links, active step tick */
--rust-100:   #f2e4de;   /* selected row / chip background */
--on-rust:    #ffffff;

/* Ink — neutral cool grey, no green cast */
--ink:        #141719;   /* headlines, primary text */
--body:       #4c5358;   /* body copy */
--muted:      #868d92;   /* captions, helper text, placeholders (>=4.5:1 on canvas) */
--faint:      #aeb3b6;   /* disabled text, decorative ticks */

/* Surface — warm paper */
--canvas:      #ffffff;   /* inputs, elevated panels, the summary card */
--canvas-soft: #f7f6f3;   /* page background */
--canvas-sink: #efede8;   /* inset wells (breakdown rows, disabled inputs) */

/* Lines */
--hairline:      #e6e3dc;  /* default border */
--hairline-firm: #d4d0c6;  /* input border, divider that needs to read */

/* Semantic — warning's hue is deliberately kept a distinct golden-yellow,
   well clear of the rust accent's red-orange, so the fare-hold chip never
   reads as a second brand colour */
--success: #1f7a3d;   --success-bg: #e5f2e9;
--warning: #815e0e;   --warning-bg: #f7ecdc;
--danger:  #b83227;   --danger-bg:  #f7e3e1;

/* Footer dark block */
--dark:        #14201f;
--on-dark:     #eef1f0;
--on-dark-mut: #93a09d;
```

**Contrast:** `--muted` on `--canvas-soft` = 4.6:1. `--on-rust` on `--rust-700` = 6.7:1.
Audit every button and helper string before shipping.

---

## 3. Typography

Font: **Geist** (sans) + **Geist Mono**, self-hosted via the `geist` package.
No serif anywhere. Emphasis inside a heading = same family, weight 600.

| Role | Size / Line / Tracking | Weight | Family |
|---|---|---|---|
| Display (hero) | 52 / 1.05 / -0.03em | 600 | Geist |
| Step title (h1) | 30 / 1.15 / -0.02em | 600 | Geist |
| Section (h2) | 20 / 1.25 / -0.01em | 600 | Geist |
| Card title (h3) | 16 / 1.35 / -0.005em | 560 | Geist |
| Body | 15 / 1.55 / 0 | 400 | Geist |
| Small / helper | 13 / 1.5 / 0 | 400 | Geist |
| Overline (rare) | 11.5 / 1 / 0.14em, uppercase | 600 | Geist |
| **Numeric** (fare, time, duration, PNR, counts) | inherit size, tabular | 500 | **Geist Mono** |

Rules:
- `font-variant-numeric: tabular-nums` globally on `.mono` and all price/time nodes.
- Overline is rationed: at most one per screen, only where a group genuinely needs a name.
- Body copy caps at `65ch`.

---

## 4. Space, shape, elevation

- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96. Nothing off-scale.
- **Radius (shape lock):** `10px` for every container, input, button, and card.
  Full-pill (`999px`) **only** for: status chips, the trip-type segmented control,
  passenger steppers, filter pills. Never a pill button as a primary CTA.
- **Borders:** default `1px var(--hairline)`. Inputs and read-critical dividers
  `1px var(--hairline-firm)`.
- **Elevation:** three shadows, no more.
  - `--shadow-sm`: `0 1px 2px rgba(20,23,25,.04), 0 1px 1px rgba(20,23,25,.03)` — resting elements.
  - `--shadow-md`: `0 8px 24px rgba(20,23,25,.08), 0 2px 6px rgba(20,23,25,.04)` — popovers, dialogs, hover-lift.
  - `--shadow-raised`: `0 14px 34px rgba(42,24,14,.12), 0 4px 10px rgba(42,24,14,.06), inset 0 1px 0 rgba(255,255,255,.7)` — the workspace panels: the step card, the fare summary, the route search panel. The primary CTA carries a smaller rust-ink-tinted version of the same idea (`rgba(74,31,10,.28-.3)`).
  Shadows are tinted to ink (or, for raised, to a deep rust-ink), never pure black. No glows.
- Selected state = `1px var(--rust-500)` border + a doubled ring
  (`0 0 0 1px rust-500, 0 0 0 4px rgba(221,101,49,.16)`) + a filled `CheckCircle`
  in `--rust-700`. Selected controls also flip their fill to white. Same recipe
  everywhere via `.is-selected`.

### 4.1 Surface levels (figure / ground)

Three levels, and only three:

| Level | Colour | Where |
|---|---|---|
| 0 — page | `--canvas-soft` + fixed 2.5% grain | the ground behind everything |
| 1 — workspace | `--canvas` (white) + `--shadow-raised` | the step card, the fare summary, the route search panel |
| 2 — control | `--canvas-soft` fill + `1px var(--hairline-firm)` | choice cards, flight rows, toggle rows, inputs, wells, inset tables sitting inside a level-1 panel |

A control on hover lifts to white (`--canvas`); a selected control stays white with the rust ring. Never nest a level-1 white card inside another level-1 white card.

**Grain:** one SVG `feTurbulence` tile on `body` (`background-attachment: fixed`), ~2.5% alpha. It reads as matte stock. It is the only background texture on the site — no gradients, no mesh, nothing animated.

### 4.2 Photography — light unifying cast (`.photo`)

Every photograph runs through one CSS map (`.photo` in `globals.css`), but the
image stays in **full colour**: `saturate(0.86) contrast(1.05)` (dialled down,
not boosted — a stock set spans wildly different color temperatures, so calming
the outliers matters more than adding punch), then a `multiply` of deep rust ink
(`#3d1a08`, 20%) and a `soft-light` of warm paper (`#f2ead9`, 30%). Enough shared
cast that a set of stock photos actually hangs together as one family; not a
duotone. Wrap overlays/captions in `.photo-caption` so they sit above the cast
layers.

### 4.3 Route arc (`<RouteArc>`)

The origin and destination drawn as a dashed great-circle arc with the real airport codes. It is data, not decoration, so use it **once**, where there is room and it means something: the `/experience` hero. Not on the booking hero, not on the confirmation (tried both, they crowd).

### 4.4 Boarding pass (`<BoardingPass>`)

A recognisable physical object, used where the screen is about **one specific trip**: `/manage` (a live pass when the booking resolves, a dashed-border "sample" pass otherwise). Anatomy: face (wordmark, status pill, `FROM → plane → TO` in 34px mono, a passenger/cabin/flights strip, the legs), a dotted **perforation with punched-hole notches** (`overflow-hidden` container + half-off circles filled `--canvas-soft`), then the **stub** (`--canvas-soft` fill) carrying the reference, a CSS `repeating-linear-gradient` barcode, and — on the live pass — the manage actions. Keep it to this one use; it loses meaning if it becomes a generic card style.

---

## 5. Motion

`MOTION_INTENSITY: 5`. Library: `motion/react`.

- **Step change:** outgoing `opacity 1→0, x 0→-16`; incoming `opacity 0→1, x 16→0`;
  `duration .34, ease [0.16,1,0.3,1]`. Height animates via layout.
- **Price change:** the total node does `y: -3 → 0, opacity .4 → 1` over `.25` when its value changes (keyed on the number).
- **Selection:** `scale .985` on press (`whileTap`), border/fill transition `.18`.
- **Reveal:** lists stagger children `.04` on first mount only (`viewport once`).
- **Reduced motion:** all of the above collapse to an instant opacity swap or nothing.
  The fare-hold countdown still ticks (it is information, not decoration).

---

## 6. Components

### Buttons
- **Primary:** `bg var(--rust-700)`, `text var(--on-rust)`, hover `--rust-600`,
  active `translateY(1px)`, radius 10, height 44 (40 in compact rows), label 15/600,
  1-3 words, never wraps. Disabled: `--canvas-sink` bg, `--faint` text, no pointer.
- **Secondary:** `bg var(--canvas)`, `1px var(--hairline-firm)`, `text var(--ink)`, hover bg `--canvas-soft`.
- **Ghost:** text `--body`, hover `--ink` + `--canvas-soft` bg. Used for "Back".
- **Focus (all):** `outline: 2px solid var(--rust-500); outline-offset: 2px`.

### Inputs / selects (Radix Select, native where possible)
- Height 44, radius 10, `1px var(--hairline-firm)`, `bg var(--canvas)`.
- **Label above**, 13/500 `--ink`. Helper 13 `--muted` below. Error 13 `--danger` below, with a `WarningCircle` icon. Never placeholder-as-label.
- Focus: border `--rust-500` + 3px rust ring.

### Choice cards (cabin, fare bundle, flights)
- Radius 10, `1px var(--hairline)`, `bg var(--canvas)`, `--shadow-sm`.
- Hover: border `--hairline-firm`, `translateY(-2px)`, `--shadow-md`.
- Selected: the section-5 selected recipe + a `CheckCircle` weight=fill in `--rust-700` top-right.
- Radio semantics (Radix RadioGroup) even though they look like cards. Keyboard: arrow keys move, space selects.

### Segmented control (trip type)
- Pill container `bg var(--canvas-sink)`, inner buttons pill, active = `bg var(--canvas)` + `--shadow-sm` + `--ink` text; inactive `--muted`.

### Stepper (passengers, bags)
- Pill, `1px var(--hairline-firm)`. `-` / `+` are 32px icon buttons (`Minus`/`Plus`, Phosphor, weight regular). Count is Geist Mono, tabular, `min-width: 2ch`, centered.

### Fare summary (the sidebar)
- `bg var(--canvas)`, radius 10, `--shadow-md`, sticky `top: 88px`.
- Rows: label `--body` left, value mono `--ink` right, `justify-between`, `py-2`, `divide-y var(--hairline)`.
- Total row: 18/600 label, 20 mono value, `border-t 1px var(--hairline-firm)`, `pt-3`.
- Fare-hold chip: pill, `--warning-bg` / `--warning`, `Clock` icon + mono `mm:ss`. Appears from the flights step on.
- Mobile (`<1024`): not sticky sidebar — a fixed bottom bar, `--canvas`, `--shadow-md` upward, showing total + "Review" / next CTA.

### Progress rail
- Horizontal on desktop (top of content), vertical list on `lg` left rail is **not** used — keep it one line.
- Steps: done = `Check` in `--rust-700`; current = filled rust dot + label `--ink`/600; upcoming = `--faint` dot + `--muted` label. Connector hairline; the done portion is `--rust-500`.
- Clicking a completed step returns to it. Upcoming steps are not clickable.

### Icons
`@phosphor-icons/react`, `weight="regular"` default, `weight="fill"` only for selected/success marks. Size 18 in rows, 20 in headers, 24 in empty states. One family, no hand-rolled SVG except the Halcyon wordmark mark (a single geometric glyph).

### Photo grids
Two sizes, matched to the archetype:
- **Small, fixed sets** (Archetype B's 3 Hajj packages): a plain
  `sm:grid-cols-2` grid, no featured banner, no show-more. At this size a
  progressive-disclosure device is overhead, not a help — every option
  should be visible at once. `"Most popular"` appears on exactly one tile,
  data-flagged (`popular`), never on more than one per grid. Hajj is one
  package per type, so "grouped by type" is expressed as a photo-overlay type
  badge on each tile (the same idiom as the "Most popular" chip) inside a
  single flat grid, not stacked per-type sections — a section header + a
  one-card grid per type wastes two-thirds of the row and only earns its
  keep once a type holds more than one package.
- **Larger filtered sets**: Umrah (`StepLanding.tsx`, 11 packages),
  International Tours (`ToursBrowser`, 8 packages) and Pakistan Tours
  (`PakistanToursBrowser`, 8 packages) all show their full result grid,
  narrowed by filter/sort controls rather than hidden behind a manual
  expander — the filter bar *is* the progressive disclosure. The Tours pages
  pin
  a "Featured this season" strip above the filtered grid, using the same card
  shape as the grid below it.

---

## 7. Layout

- Page max width `1180px`, `px-5 sm:px-8`, `mx-auto`.
- Booking screen grid: `lg:grid-cols-[1fr_360px] gap-12`. Below `lg`: single column, summary becomes the bottom bar.
- Navbar: a slim dark utility strip (tagline + phone, scrolls away with the
  page, not sticky) above the 64px main bar — wordmark left, 6 core-section
  nav links + a filled rust "Sign in" button right, hairline bottom,
  `bg var(--canvas-soft)/90` + `backdrop-blur` on the main bar (which alone
  stays `sticky top-0`).
- Umrah landing hero (`StepLanding.tsx`, the flow's first screen): plain
  text hero (eyebrow, `h1`, subheading) above the filter bar and result grid
  — no full-bleed photo band here, that pattern is reserved for the
  individual package-tile photos and the flexible-page builder's Hero block,
  not the Umrah entry screen itself.
- Footer: one dark block (`--dark`), wordmark + 4-5 short link columns + legal line. Regular hyphens only.

### 7A. Site structure — six core sections, four archetypes

The site has **six core sections** — Umrah, Hajj, International Tour
Packages, Pakistan Tour Packages, Visa Consultation, Air Ticketing — each
built from one of four repeatable category archetypes rather than a bespoke
flow per section (a generalized category-portal pattern, given as a
structure/UX brief to follow — categories chosen to match its real-brand
examples exactly). Other Services, Manage trip and Help are real pages too,
just secondary utilities rather than core sections — they sit in the footer,
not the header nav. Every new section should be sorted into one of the four
archetypes before it's designed, not custom-built from scratch:

| Archetype | Pattern | On this site |
|---|---|---|
| **A — Filter + builder** | Large, combinable inventory; a multi-step configurator with a live running total. | `/umrah` — a landing screen filtering an 11-package catalog (`UMRAH_PACKAGES`) by Duration, Category, hotel rating, distance, room type, price and month, all AND-combined and instant, plus a "Build your own" fallback, into a 9-step ground-services builder: category → duration & dates → travellers → visa → hotels → transport → add-ons → review → submit. Picking a filtered package pre-fills every step and jumps straight to submit; custom starts at step 1. No flights in this flow — see below. |
| **B — Fixed listing** | Small, regulated, quota'd or lead-time-bound inventory; browse a short grouped list, open a detail page, inquire (not a live price). | `/hajj` + `/hajj/[slug]` — 3 fixed packages, one per type (`data/hajj.ts`), each with its own quota and application deadline shown up front, ending in `InquiryForm`. |
| **C — Filter-driven listing** | Moderate inventory, a handful of clean AND-combined facets, no builder needed. | **International Tour Packages** (`/tours` + `/tours/[slug]`) — country, group-type, duration, price-range and season filters (`ToursBrowser`, `data/tours.ts`) over 8 curated guided-tour packages (Turkey, Thailand, Dubai, Malaysia, Europe, Egypt, Maldives, Indonesia). **Pakistan Tour Packages** (`/pakistan-tours` + `/pakistan-tours/[slug]`) — the same pattern scoped to domestic destinations: region, group-type, duration, price-range and season filters (`PakistanToursBrowser`, `data/pakistan-tours.ts`) over 8 packages across Hunza/Skardu, Swat, Murree, Naran/Kaghan, Northern Areas, Neelum Valley, Fairy Meadows and Kalash Valley. Both sections use featured/seasonal packages pinned above the filtered grid, a two-CTA card (View details / Inquire now — Pakistan's says "Book now"), and a detail page ending in an itinerary, inclusions, hotel-or-camping info, a gallery, and `InquiryForm`; Pakistan's cards also carry an optional Family/Honeymoon/Group marketing tag next to the region badge, aligned with (but friendlier-worded than) the Group Type filter. The two sections are structurally identical but deliberately not code-shared — each has its own data file, browser and card component, consistent with Hajj/Umrah/Tours each owning their own data model rather than a generic cross-archetype component. |
| **D — Static service page** | No real inventory — description, process, inquiry CTA. One shared shell so a new page is content dropped into a pattern, not a one-off build. | `/visa-consultation`, `/air-ticketing` (core sections) and `/other-services` (secondary, footer-only) — all built on `components/site/ServicePage.tsx` (+ `ServiceSection`/`ServiceSteps`/`ServiceChecklist`), each ending in an embedded `InquiryForm` with a page-specific `submitLabel` (e.g. "Start my visa application", "Request a fare quote") rather than just a link-out CTA or the generic "Send inquiry" text. Both Next.js pages render `cms.sections` **in order**, mapping each block's `type` (`checklist`/`steps`) to its component, rather than picking one block per type — so Visa Consultation can carry two checklists ("Countries we cover" then, after the process steps, "Documents you'll need") from the same Wagtail `ServicePage.sections` StreamField. Air Ticketing is an assisted, inquiry-only fare-quote service (domestic & international) — flight search/selection isn't self-service yet. |

**Umrah has its own ground-services data model** (`data/umrah.ts`): package
tiers, categories, Makkah/Madinah hotels, room sharing, transport tiers and
add-on services, each with its own price — deliberately separate from
`data/airports.ts`'s flight-era `Destination`/`Airport` shapes, since Umrah no
longer books a flight at all (no cabin, no departure, no `from`/`to`
airports). `useBookingStore` and `computeQuote` (`lib/quote.ts`) are built
around this model; `data/airports.ts` (and its `Origin`/`Destination` shapes,
`cabinById`, `ORIGINS`) still powers `/experience`'s flight-network overview
(bases, popular routes, fleet), which is genuinely flight-based. **Both Tours
sections have their own guided-tour-package data models** — `data/tours.ts`
(country, duration, price, group types, season, itinerary, inclusions/
exclusions, hotel info) and `data/pakistan-tours.ts` (the same shape, scoped
to domestic region, plus hotel-or-camping stays and a Family/Honeymoon/Group
card tag) — closer in spirit to Umrah/Hajj's ground-services framing than to
a flight destination. `/experience`'s "Where we fly" route snapshot links
every destination to its Tours listing (`/tours` or `/pakistan-tours`) rather
than a per-code detail page, since flight network codes (JFK, CPT, DXB, LHE,
…) no longer map 1:1 onto either curated tour-package's slugs.

**Homepage (`/`)** is the portal: hero with one photo card per core-section
entry point (`Start here →`, leads straight into that section, not a generic
landing page — Umrah, Hajj, International Tours, Pakistan Tours), a
`QuickFilterWidget` that jumps straight into `/umrah` prefilled with a
package tier (the fast path for a visitor who already knows what they want),
a trust stats strip (reuses `FLEET_STATS`), an "Alongside your trip"
highlights strip into the Archetype D pages + Manage trip, testimonials, and
an FAQ excerpt linking to `/help`.

**Deep-link prefill:** `/umrah` reads a `?package=` query param on mount
(`BookingShell`, validated against the three fixed tier ids) and calls the
same `pickPackage()` a landing-screen tap would — pre-filling every step and
jumping to submit, exactly like tapping the tile directly.

**One funnel:** every archetype's terminal action is now the same shape — a
mock-submitted form (`InquiryForm`, or Umrah's `StepSubmit`) that produces a
`makeBookingRef()` reference and a confirmation screen naming how the team
will follow up (WhatsApp, email or phone — mentioned as contact channels in
copy only; there's no real `wa.me` integration anywhere in the prototype).
Manage trip and Help sit outside the six core sections as sitewide utilities,
matching the source structure's own "Contact / Inquiry" and "Resources"
buckets.

---

## 8. Content & voice

- Plain, concrete, quietly confident. "Choose your cabin", not "Elevate your journey".
- Fares shown as `£1,240` style, Geist Mono, tabular. Currency GBP, `en-GB` formatting.
- Times 24h `14:05`, durations `7h 40m`, all mono.
- Invented but realistic: airline **Halcyon**, IATA-style code **HN**, flying from three UK bases
  (primary: **London Gatwick / LGW**; also Manchester / MAN, Edinburgh / EDI — short list, growing).
  Flight numbers `HN 218`. Booking reference format `HN-4K2QXP` (client-generated, clearly a demo hold).
- No fake precision in marketing copy. No "trusted by 2.4m flyers" unless labelled mock.
- **Zero em-dashes.** Regular hyphen only.

---

## 9. Accessibility

- WCAG AA minimum, AAA for step titles and the total.
- Full keyboard path through every step; visible focus always.
- Radad groups / dialogs / selects via Radix primitives (focus trap, escape, aria done).
- The countdown announces politely (`aria-live="polite"`) at 5:00, 1:00, 0:30.
- Target size ≥ 44px for all controls; stepper buttons 32 visually but 44 hit area.
- `prefers-reduced-motion` fully honored (section 5).
