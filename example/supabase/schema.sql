-- ═══════════════════════════════════════════════════════
--  Travocom — Run this once in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- ── Hajj / Umrah daily rates ────────────────────────────
-- Each row is one price point. The admin updates these daily.
-- Unique constraint ensures upsert replaces cleanly.
create table if not exists hajj_umrah_rates (
  id               uuid primary key default gen_random_uuid(),
  travel_type      text not null check (travel_type in ('hajj', 'umrah')),
  zone             text not null,           -- walking_5 | walking_15 | shuttle | bus
  comfort_level    text not null,           -- basic | comfortable | premium | luxury
  duration_days    int  not null,           -- 10 | 14 | 21 | 30
  group_type       text not null check (group_type in ('group', 'private')),
  price_per_person numeric(12,2) not null default 0,
  updated_at       timestamptz default now(),
  unique (travel_type, zone, comfort_level, duration_days, group_type)
);

-- ── Customer enquiries ──────────────────────────────────
-- Every submitted form is captured here.
create table if not exists enquiries (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  lead_name       text,
  lead_phone      text,
  lead_email      text,
  travel_type     text,
  destination     text,
  males           int default 0,
  females         int default 0,
  children        int default 0,
  infants         int default 0,
  estimated_price numeric(12,2),
  package_data    jsonb,        -- full Zustand state snapshot
  status          text default 'new' check (status in ('new', 'contacted', 'booked', 'cancelled')),
  notes           text
);

-- ── Row Level Security ──────────────────────────────────
alter table hajj_umrah_rates enable row level security;
alter table enquiries        enable row level security;

-- Service role key (used by admin panel) can do everything
create policy "admin_all_rates"     on hajj_umrah_rates to service_role using (true) with check (true);
create policy "admin_all_enquiries" on enquiries        to service_role using (true) with check (true);

-- Anonymous users (customer form) can insert enquiries only
create policy "anon_insert_enquiry" on enquiries for insert to anon with check (true);

-- ── Trigger: keep updated_at fresh ─────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger rates_updated_at
  before update on hajj_umrah_rates
  for each row execute function update_updated_at();
