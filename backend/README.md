# Halcyon CMS (Wagtail)

The static-content half of the [CMS Architecture Plan](../design/DESIGN.md) --
Django + Wagtail, managing the site's editable copy (homepage sections, the
three service pages, the help page, footer text) behind a read-only JSON API.

Package content (Hajj/Umrah/International Tours/Pakistan Tours) lives in a
separate `packages` app, outside the Wagtail page tree -- see
[Packages &amp; CSV import](#packages--csv-import) below. The Next.js frontend
at the repo root reads both this CMS's content API and the packages API,
falling back to its own hardcoded copy if this backend isn't running.

## Requirements

- Python 3.10+
- Postgres (optional -- omit `DATABASE_URL` and it falls back to a local
  SQLite file with zero setup)

## Setup (first time, any machine)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # then edit .env if you're using Postgres
python manage.py migrate
python manage.py seed_nav          # optional: populate header/footer nav for editing
python manage.py createsuperuser
```

That's the whole "run it on another machine" story: `requirements.txt` pins
the dependencies, and `python manage.py migrate` replays every migration file
already committed under `home/migrations/`, `services/migrations/`, and
`support/migrations/` to rebuild the schema from scratch. There's nothing
else to hand-run -- no separate migration tool, no manual SQL.

## Database

Controlled entirely by the `DATABASE_URL` env var (read from `backend/.env`,
which is gitignored -- see `.env.example` for the format):

- **Not set:** uses `backend/db.sqlite3`. Nothing to install or configure.
- **Set**, e.g. `postgresql://admin:admin@127.0.0.1:5432/halcyon_cms`: uses
  that Postgres database instead.

To create a fresh Postgres database and role for this project:

```bash
sudo -u postgres psql -c "CREATE ROLE admin WITH LOGIN PASSWORD 'admin' CREATEDB;"
sudo -u postgres createdb -O admin halcyon_cms
```

(If the role already exists with an unknown password:
`sudo -u postgres psql -c "ALTER ROLE admin WITH PASSWORD 'admin';"`)

Then set `DATABASE_URL` in `.env` to match and run `python manage.py migrate`
again -- migrations are database-agnostic, so the same migration files apply
to either SQLite or Postgres.

## Running it

```bash
source .venv/bin/activate
export DJANGO_SETTINGS_MODULE=halcyon.settings.dev
python manage.py runserver
```

- Wagtail admin (pages, settings, help): <http://127.0.0.1:8000/admin/>
- Django admin (packages, package CSV import): <http://127.0.0.1:8000/django-admin/>
- Content API: <http://127.0.0.1:8000/api/v2/pages/>
- Packages API: <http://127.0.0.1:8000/api/packages/{umrah,hajj,tours,pakistan-tours}/>

## Deploying to production

Use `DJANGO_SETTINGS_MODULE=halcyon.settings.production`, which requires two
env vars `dev.py` hardcodes for you locally:

| Variable | Notes |
|---|---|
| `SECRET_KEY` | Required -- boots fail immediately (a clear `KeyError`) if it's missing, rather than silently falling back to the insecure dev key. Generate one with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`. |
| `ALLOWED_HOSTS` | Comma-separated hostnames. When deployed as a Vercel Service alongside the Next.js frontend (see the repo root's `vercel.json` and its README), the shared production domain is trusted automatically via Vercel's own `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL`, so this can usually be left empty there. |
| `DATABASE_URL` | Required in practice for anything beyond a quick test -- see the note below. |

**SQLite and local media don't survive a serverless deployment.** Without
`DATABASE_URL` set, this falls back to a local `db.sqlite3` file, and Wagtail
image uploads / CSV import files default to local disk under `MEDIA_ROOT`.
Both assume a persistent, writable filesystem that a platform like Vercel
Functions doesn't provide (each invocation can get a fresh, ephemeral
filesystem). For a real deployment:

- Set `DATABASE_URL` to a real hosted Postgres (a Vercel Postgres/Neon
  integration, or any external Postgres) -- already fully wired up via
  `dj-database-url`, no code change needed.
- For uploaded media (Wagtail images, CSV import files), add
  [`django-storages`](https://django-storages.readthedocs.io/) with an
  external bucket (S3, Vercel Blob, Cloudflare R2, etc.) and point
  `DEFAULT_FILE_STORAGE` at it. Not wired up yet -- do this before relying on
  file uploads in production. Static assets (CSS/JS/admin styling) aren't
  affected by this; those are collected at build time and don't need it.

See the repo root [`README.md`](../README.md#deploying-vercel) for deploying
this alongside the Next.js frontend as two Vercel Services in one project.

## Making a schema change

Whenever you add or change a model field (in `home/models.py`,
`services/models.py`, or `support/models.py`):

```bash
python manage.py makemigrations
python manage.py migrate
```

Commit the generated migration file(s) -- that's what lets another machine
(or production) pick up the change with a plain `migrate`.

## What's here

| App | Page type(s) | Covers |
|---|---|---|
| `home` | `HomePage` | Hero copy + StreamField sections: category cards, highlights, testimonials, FAQ |
| `home` | `SiteSettings` (a Wagtail *Setting*) | Site title, uploaded logo + favicon, accent theme (Rust/Ocean/Forest/Midnight), light/dark/system colour mode |
| `home` | `FooterSettings` (a Wagtail *Setting*, not a page) | Footer tagline and legal line |
| `home` | `HeaderSettings` (a Wagtail *Setting*) | Extra nav links and the header CTA |
| `services` | `ServicePage` (one type, three instances) | Visa Consultation, Air Ticketing, Other Services -- each a StreamField of `checklist` / `steps` / `tile_grid` / `paragraph` blocks |
| `support` | `HelpPage` | Contact channels, FAQ, disruption-strip steps |
| `flexpages` | `FlexiblePage` | Page builder: pick from Hero / Rich text / Image / Feature grid / CTA band / FAQ / Stats / Testimonials blocks. The page's URL is its slug prefixed by its parents in the tree, so nest it under a `pages` parent for `/pages/<slug>` or under Home for `/<slug>`. |

The settings objects are exposed to the frontend at `/api/v2/site-settings/`
and `/api/v2/footer-settings/` (plain JSON views -- Wagtail Settings aren't
Pages, so they're not covered by the `/api/v2/pages/` router). Themes and the
light/dark mode are CSS-variable presets defined in
`src/app/globals.css`; the API just returns the key, the frontend applies it
via `<html data-theme=... data-mode=...>`. Uploaded logo/favicon images are
served from Django's `/media/` in dev -- production would need real media
hosting (S3/CDN).

Shared StreamField block definitions (`FAQBlock`, `StepsBlock`,
`ChecklistBlock`, `IconTextLinkBlock`, and the page-builder blocks) live in
`halcyon/blocks.py` since more than one page type reuses them.

### Page-builder block previews

The block picker on a `FlexiblePage` shows a real screenshot of each component
as it renders on the site, plus starter copy pre-filled into every new block
(the `*_SAMPLE` dicts in `halcyon/blocks.py`).

The screenshots live in `flexpages/static/flexpages/previews/*.png`. To
regenerate them after a design change: run the Next.js site, then from the repo
root run `npm run gen:block-previews` (needs `npx playwright install chromium`
once). Set `PREVIEW_BASE_URL` if the site isn't on `http://localhost:3000`.
In production, run `python manage.py collectstatic` so the admin can serve them.

Every page type declares `api_fields`, so its content (not just the title) is
included at `/api/v2/pages/<id>/`.

## Seed content

All five pages (Home, Visa Consultation, Air Ticketing, Other Services, Help)
are already populated with the same copy currently hardcoded in the Next.js
site, so the admin isn't empty on first login. Edit it through
`/admin/pages/`, or `/admin/settings/` for site title / logo / theme / mode
(`SiteSettings`) and the footer text (`FooterSettings`).

`HeaderSettings.nav_links` and `FooterSettings.columns` ship *empty* by
design (an empty list means "use the frontend's built-in nav" -- see
`FALLBACK_LINKS` in `src/components/layout/Navbar.tsx` and `columns()` in
`src/components/layout/Footer.tsx`), so a fresh DB shows a working site with
blank settings pages. Run `python manage.py seed_nav` to copy that built-in
nav into the CMS as editable entries -- it only fills fields that are still
empty, so it's safe to re-run and won't overwrite anything you've since
edited.

## Packages & CSV import

Hajj, Umrah, International Tours and Pakistan Tours packages live in the
`packages` app -- a plain (non-Wagtail) Django app, since this data isn't
managed through the CMS page tree. It's edited two ways:

- **Django admin** (`/django-admin/`, under "Packages"): full editing,
  including nested content -- itinerary steps, photo galleries,
  inclusions/exclusions, hotel stays, Umrah's hotel/category/room/transport
  catalog. This is the *only* place to edit that nested content.
- **CSV bulk import** (below): fast bulk edits to the flat, frequently-changed
  fields (pricing, availability, copy, dates) across many packages at once.

Both read/write the same tables, so either can be used for any single
package -- CSV import is for bulk changes, admin is for everything else.

### Where to upload a CSV

1. Log into `/django-admin/` with a staff account.
2. Go to <http://127.0.0.1:8000/packages/import/> directly, **or** open any
   package changelist (e.g. Packages -> Tour packages) and click the
   **"Import / export CSV"** button top-right.
3. Pick the archetype, then **"Download current packages as CSV"** to get a
   correctly-formatted starting point (or "Download empty template" for a
   blank one), edit it, and upload it back.

Uploading never saves anything immediately: the next screen previews exactly
what would change -- new rows, updated rows with each field's old value next
to the new one, and any per-row validation errors -- before you click
"Confirm import". Every import is also logged (who, when, what happened) at
Packages -> "Package import batches".

### Matching & scope

Each CSV row is matched to a package by **`slug`**: an existing slug updates
that package's flat fields, a new slug creates one. Nothing is ever deleted
by a CSV upload, and a package's nested content (itinerary/gallery/
inclusions/hotel stays/group types) is never touched by an import even when
its flat fields change -- keep editing that in admin as before.

### CSV columns per archetype

All four start with `slug` (required, the match/upsert key). `*_slug`
columns reference another model's `slug` field and must already exist.

| Archetype | Columns |
|---|---|
| **Hajj** | `slug, name, package_type, strap, blurb, image_url, nights, from_price_gbp, quota_text, application_deadline, transport_text, meals_text, guide_text` |
| **International Tours** | `slug, name, country_slug, strap, blurb, image_url, duration_days, from_price_gbp, season, featured` |
| **Pakistan Tours** | `slug, name, region_slug, strap, blurb, image_url, duration_days, from_price_gbp, season, featured, card_tag` |
| **Umrah** | `slug, name, strap, blurb, image_url, category_slug, duration_days, makkah_hotel_slug, madinah_hotel_slug, room_sharing_slug, transport_tier_slug, season, from_price_gbp, popular` |

Field notes:

- **`package_type`** (Hajj): `Government Scheme` / `Private Economy` / `Private Premium` (case-insensitive).
- **`season`** (Tours/Pakistan Tours/Umrah): `Ramadan` / `Winter` / `Spring` / `Summer` / `Autumn` / `Year-round`.
- **`card_tag`** (Pakistan Tours, optional): `Family` / `Honeymoon` / `Group`, or blank.
- **`featured`** / **`popular`**: `true`/`false` (also accepts `yes`/`no`, `1`/`0`; blank = `false`).
- **`country_slug`** / **`region_slug`**: must match an existing `TourCountry` / `PakistanRegion` slug.
- **Umrah's `*_slug` columns**: must match existing `UmrahCategory` / `UmrahHotel` / `UmrahRoomSharingOption` /
  `UmrahTransportTier` slugs. `makkah_hotel_slug` must be a hotel whose city is Makkah, and
  `madinah_hotel_slug` one whose city is Madinah -- an importer-level check beyond what the schema itself enforces.

The importer engine (`packages/importer.py`) is the source of truth if this
list and `models.py` ever drift -- every field it validates reuses the
model's own `full_clean()`, so a rejected value's error message always names
the exact valid options.
