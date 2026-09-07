---
version: 1
name: halcyon-design
description: "Design contract for Halcyon — an independent long-haul airline. The site is a four-archetype category portal — Umrah (build a package), Hajj (fixed quota'd packages), International & Pakistan Tours (filtered browsing), and Visa Consultation / Air Ticketing / Other Services (static pages) — not a single booking flow. The Umrah wizard is an image-first, tap-don't-type package builder: package → when & who → cabin → departures → extras → review, with a live price summary and a running 'trip ready' bar. Restrained chrome (kingfisher-rust + Geist), the photography carries the warmth."
---

# Halcyon — Design Contract

Single source of truth for all UI.

**Site shape (restructured into a portal, see §7A):** the homepage is no
longer a booking wizard — it's a portal with three entry points (Umrah, Hajj,
International & Pakistan Tours) plus static service pages, all sharing one
design system. The categories and their archetypes were given as a brief to
follow exactly (a generalized 4-archetype category-portal pattern, with
real-brand examples per archetype) rather than invented; Halcyon's own brand
voice, palette and photography style carry the execution. The Umrah wizard
lives at `/umrah` and is unchanged in spirit from the original booking flow —
it mirrors the `example/` travel-package builder — **you tap photos, you
barely type**. Six steps, ~4 inputs total (date range, three passenger
steppers, name, email). Package and cabin auto-advance on selection. A "trip
ready" progress bar fills as you go. The package photo is pinned in the fare
summary and reappears as a hero on review and the held screen.

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
- **Small, fixed sets** (Archetype A's Umrah packages, Archetype B's Hajj
  packages — 4 items each): a plain `sm:grid-cols-2` grid, no featured
  banner, no show-more. At this size a progressive-disclosure device is
  overhead, not a help — every option should be visible at once. `"Most
  popular"` appears on exactly one tile, data-flagged (`popular`), never on
  more than one per grid.
- **Larger filtered sets** (Archetype C's Tours, 13 destinations): shown in
  full as `DestinationsBrowser`'s result grid, narrowed by the region/search/
  sort controls rather than hidden behind a manual expander — the filter bar
  *is* the progressive disclosure.

---

## 7. Layout

- Page max width `1180px`, `px-5 sm:px-8`, `mx-auto`.
- Booking screen grid: `lg:grid-cols-[1fr_360px] gap-12`. Below `lg`: single column, summary becomes the bottom bar.
- Navbar: 64px, single line, wordmark left, 5 nav links + "Sign in" right, hairline bottom, `bg var(--canvas-soft)/90` + `backdrop-blur`.
- Hero (step 1 of the Umrah builder, `StepPackage.tsx`): full-bleed. One
  atmospheric photo (wing over cloud) fills the entire header band edge to
  edge of the content column — "full-bleed" relative to the step's own
  container, not the true viewport edge; the wizard shell stays at
  `max-w-[1180px]`. A bottom-anchored `dark/92→transparent` gradient scrim
  carries the eyebrow, headline (`text-on-dark`, ≤ 2 lines, 54px desktop),
  and subtext in light type. The From + trip-type controls float on a
  frosted panel — `bg-canvas/92` + `backdrop-blur-md`, a stronger ink-tinted
  shadow than `--shadow-raised` (calibrated for light-on-photo, not
  light-on-paper) — rather than sitting on plain paper, since the whole band
  is now photographic. Min-height `440/520/580px` (mobile/tablet/desktop) so
  it never forces scroll to see the controls, even on a 1366×720 laptop.
  Header text still does the one-time staggerChildren entrance;
  `prefers-reduced-motion` shows everything at full opacity immediately. No
  scroll cues, no logo wall.
- Footer: one dark block (`--dark`), wordmark + 4 short link columns + legal line. Regular hyphens only.

### 7A. Site structure — four archetypes

The whole site is built from four repeatable category archetypes rather than
one bespoke flow per section (a generalized category-portal pattern, given as
a structure/UX brief to follow — categories chosen to match its real-brand
examples exactly). Every new section should be sorted into one of these
before it's designed, not custom-built from scratch:

| Archetype | Pattern | On this site |
|---|---|---|
| **A — Filter + builder** | Large, combinable inventory; a multi-step configurator with a live running total. | `/umrah` — the 6-step Umrah package wizard (`StepPackage` → when&who → cabin → departure → extras → review). |
| **B — Fixed listing** | Small, regulated, quota'd or lead-time-bound inventory; browse a short grouped list, open a detail page, inquire (not a live price). | `/hajj` + `/hajj/[slug]` — 4 fixed packages (`data/hajj.ts`), each with its own quota and application deadline shown up front, ending in `InquiryForm`. |
| **C — Filter-driven listing** | Moderate inventory, a handful of clean AND-combined facets, no builder needed. | `/tours` + `/tours/[code]` ("International & Pakistan Tours") — region chips (incl. a `Pakistan` region) + search + sort over 13 routes (`DestinationsBrowser`), each opening to a detail page that ends in `InquiryForm`, not a booking flow — Tours doesn't earn a builder. |
| **D — Static service page** | No real inventory — description, process, inquiry CTA. One shared shell so a new page is content dropped into a pattern, not a one-off build. | `/visa-consultation`, `/air-ticketing`, `/other-services` — all built on `components/site/ServicePage.tsx` (+ `ServiceSection`/`ServiceSteps`/`ServiceChecklist`), each ending in an embedded `InquiryForm` rather than just a link-out CTA. |

**Umrah packages reuse the `Destination` data shape** (`UMRAH_PACKAGES` in
`data/airports.ts`, `UmrahPackage extends Destination`) so the whole
booking-wizard machinery — `destinationByCode`/`airportByCode` lookups,
`flightFor()`, the quote engine, `FareSummary`, `StepReview` — works
unchanged against package tiers instead of point-to-point cities; only
`StepPackage.tsx`'s content and the `extras`/`ADDON_CARDS` set are
Umrah-specific. Every package's `city` field is its display name ("Standard
Umrah"), not a place, since it's a product, not an airport; `airportCity:
"Jeddah"` is set on each entry so flight-leg labels (`StepDeparture`'s
"London to Jeddah") stay geographically correct while identity banners
(`StepReview`'s "Standard Umrah from London") use the package name.

**Homepage (`/`)** is the portal: hero with one photo card per Archetype
A/B/C entry point (`Start here →`, leads straight into that section, not a
generic landing page), a `QuickFilterWidget` that jumps straight into
`/umrah` prefilled with a package (the fast path for a visitor who already
knows what they want), a trust stats strip (reuses `FLEET_STATS`), an
"Alongside your trip" highlights strip into the Archetype D pages + Manage
trip, testimonials, and an FAQ excerpt linking to `/help`.

**Deep-link prefill:** `/umrah` reads `?to=` / `?from=` query params on mount
(`BookingShell`, validated against `destinationByCode`/`originByCode` before
applying) and pre-selects them on the package step — it never auto-advances
past step 1, so the visitor still confirms by tapping.

**One funnel:** whichever archetype a visitor moves through, the terminal
action produces a `makeBookingRef()` reference either way — Archetype A
(`StepReview`) hands off to a WhatsApp conversation (button opens a `wa.me`
link pre-filled with the package, dates, travellers, cabin and estimated
total; the in-app screen afterwards shows the reference plus a fallback
"Open WhatsApp" link in case the popup didn't fire), while B/C/D
(`InquiryForm`) mock-submit a contact-us-style form. Both land the visitor on
a reference they can quote back, they just differ in whether the next step
happens in-app (a form) or in another app (a chat). Manage trip and Help sit
outside the archetype grid as sitewide utilities, matching the source
structure's own "Contact /
Inquiry" and "Resources" buckets.

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
