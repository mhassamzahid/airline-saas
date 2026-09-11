# Halcyon CMS (Wagtail)

The static-content half of the [CMS Architecture Plan](../design/DESIGN.md) --
Django + Wagtail, managing the site's editable copy (homepage sections, the
three service pages, the help page, footer text) behind a read-only JSON API.

**Not in this app:** the listings engine (CSV/XLSX product upload, diff/preview/
confirm flow) and the Next.js frontend integration are separate, not-yet-built
pieces of the plan. This backend runs standalone; the live site at the repo
root still reads its own static `src/data/*.ts` files and doesn't call this
API yet.

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

- Admin: <http://127.0.0.1:8000/admin/>
- Content API: <http://127.0.0.1:8000/api/v2/pages/>

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
