-- SAFIA Africa — full database setup for a fresh Supabase project.
-- Paste this entire script into the Supabase Dashboard SQL Editor (New query) and Run.
-- It is the 4 repo migrations concatenated in chronological order.

-- ════════════════════════════════════════════════════════════════════════════
-- From: supabase/migrations/20260806152656_be26daa6-4855-4445-a0e3-68cd36d99223.sql
-- ════════════════════════════════════════════════════════════════════════════
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'Pending',
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  province TEXT,
  district TEXT,
  address TEXT NOT NULL,
  postal_code TEXT,
  company_name TEXT,
  product_name TEXT NOT NULL,
  collection TEXT NOT NULL,
  artwork_type TEXT,
  size_code TEXT NOT NULL,
  custom_size TEXT,
  frame_type TEXT,
  material TEXT,
  color TEXT,
  finish TEXT,
  orientation TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price BIGINT NOT NULL DEFAULT 0,
  subtotal BIGINT NOT NULL DEFAULT 0,
  tax BIGINT NOT NULL DEFAULT 0,
  shipping BIGINT NOT NULL DEFAULT 0,
  total BIGINT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'RWF',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- ════════════════════════════════════════════════════════════════════════════
-- From: supabase/migrations/20260827130000_artisan_portal.sql
-- ════════════════════════════════════════════════════════════════════════════
-- Artisan Portal & Admin Portal schema for SAFIA Africa.
-- Run this once in the Supabase Dashboard (SQL Editor → New query → Run).
-- All access is through server functions using the service-role key (RLS bypass),
-- so no RLS policies are defined here.

-- ── Artisans ────────────────────────────────────────────────────────────────
create table if not exists public.artisans (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  phone           text,
  password_hash   text not null,
  full_name       text not null,
  bio             text,
  photo_url       text,
  location        text,
  skills          text[] default '{}',
  years_experience int  default 0,
  social_links    jsonb default '{}'::jsonb,
  verified        boolean default false,
  status          text default 'pending',   -- pending | approved | rejected | suspended
  featured        boolean default false,
  created_at      timestamptz default now()
);

-- ── Artisan products ────────────────────────────────────────────────────────
create table if not exists public.artisan_products (
  id           uuid primary key default gen_random_uuid(),
  artisan_id   uuid references public.artisans(id) on delete cascade,
  name         text not null,
  description  text,
  images       text[] default '{}',
  dimensions   text,
  materials    text,
  frame_type   text,
  design_style text,
  price        numeric default 0,
  inventory    int default 0,
  status       text default 'pending',  -- pending | active | rejected
  featured     boolean default false,
  views        int default 0,
  likes        int default 0,
  created_at   timestamptz default now()
);

-- ── Commission ledger (50% artisan / 50% platform of net profit) ────────────
create table if not exists public.commissions (
  id            uuid primary key default gen_random_uuid(),
  artisan_id    uuid references public.artisans(id) on delete cascade,
  product_id    uuid references public.artisan_products(id) on delete set null,
  order_number  text,
  gross         numeric default 0,
  artisan_share numeric default 0,
  platform_share numeric default 0,
  status        text default 'pending',  -- pending | paid
  created_at    timestamptz default now()
);

-- ── Withdrawal requests ─────────────────────────────────────────────────────
create table if not exists public.withdrawals (
  id         uuid primary key default gen_random_uuid(),
  artisan_id uuid references public.artisans(id) on delete cascade,
  amount     numeric default 0,
  status     text default 'pending',  -- pending | approved | paid | rejected
  note       text,
  created_at timestamptz default now()
);

-- Indexes for dashboard queries
create index if not exists idx_artisan_products_artisan on public.artisan_products(artisan_id);
create index if not exists idx_artisan_products_status on public.artisan_products(status);
create index if not exists idx_commissions_artisan on public.commissions(artisan_id);
create index if not exists idx_commissions_status on public.commissions(status);
create index if not exists idx_withdrawals_artisan on public.withdrawals(artisan_id);
create index if not exists idx_artisans_status on public.artisans(status);

-- ════════════════════════════════════════════════════════════════════════════
-- From: supabase/migrations/20260901101926_ca5388f3-7fae-4811-8c09-a04ea63630d8.sql
-- ════════════════════════════════════════════════════════════════════════════
-- Artisan Portal & Admin Portal schema for SAFIA Africa.

create table if not exists public.artisans (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  phone           text,
  password_hash   text,
  full_name       text not null,
  bio             text,
  photo_url       text,
  location        text,
  skills          text[] default '{}',
  years_experience int  default 0,
  social_links    jsonb default '{}'::jsonb,
  verified        boolean default false,
  status          text default 'pending',
  featured        boolean default false,
  auth_user_id    uuid,
  provider        text default 'password',
  created_at      timestamptz default now()
);

create table if not exists public.artisan_products (
  id           uuid primary key default gen_random_uuid(),
  artisan_id   uuid references public.artisans(id) on delete cascade,
  name         text not null,
  description  text,
  images       text[] default '{}',
  dimensions   text,
  materials    text,
  frame_type   text,
  design_style text,
  price        numeric default 0,
  inventory    int default 0,
  status       text default 'pending',
  featured     boolean default false,
  views        int default 0,
  likes        int default 0,
  created_at   timestamptz default now()
);

create table if not exists public.commissions (
  id            uuid primary key default gen_random_uuid(),
  artisan_id    uuid references public.artisans(id) on delete cascade,
  product_id    uuid references public.artisan_products(id) on delete set null,
  order_number  text,
  gross         numeric default 0,
  artisan_share numeric default 0,
  platform_share numeric default 0,
  status        text default 'pending',
  created_at    timestamptz default now()
);

create table if not exists public.withdrawals (
  id         uuid primary key default gen_random_uuid(),
  artisan_id uuid references public.artisans(id) on delete cascade,
  amount     numeric default 0,
  status     text default 'pending',
  note       text,
  created_at timestamptz default now()
);

create table if not exists public.page_views (
  id         uuid primary key default gen_random_uuid(),
  path       text not null,
  referrer   text,
  country    text,
  session_id text,
  created_at timestamptz default now()
);

create index if not exists idx_artisan_products_artisan on public.artisan_products(artisan_id);
create index if not exists idx_artisan_products_status on public.artisan_products(status);
create index if not exists idx_commissions_artisan on public.commissions(artisan_id);
create index if not exists idx_commissions_status on public.commissions(status);
create index if not exists idx_withdrawals_artisan on public.withdrawals(artisan_id);
create index if not exists idx_artisans_status on public.artisans(status);
create index if not exists idx_artisans_auth_user on public.artisans(auth_user_id);
create index if not exists idx_page_views_created on public.page_views(created_at);

grant all on public.artisans to service_role;
grant all on public.artisan_products to service_role;
grant all on public.commissions to service_role;
grant all on public.withdrawals to service_role;
grant all on public.page_views to service_role;
grant insert on public.page_views to anon, authenticated;

alter table public.artisans enable row level security;
alter table public.artisan_products enable row level security;
alter table public.commissions enable row level security;
alter table public.withdrawals enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "Anyone may record a page view" on public.page_views;
create policy "Anyone may record a page view"
  on public.page_views for insert to anon, authenticated
  with check (true);

-- ════════════════════════════════════════════════════════════════════════════
-- From: supabase/migrations/20260904120000_portal_updates.sql
-- ════════════════════════════════════════════════════════════════════════════
-- Portal updates: order codes, payment plans, artisan galleries, agreements.
-- Run this in the Supabase Dashboard (SQL Editor → New query → Run).

-- ── Orders: add order code, payment plan, payment method, source ───────────
alter table public.orders
  add column if not exists order_code     text,
  add column if not exists payment_plan    text default 'full',   -- full | half
  add column if not exists payment_method  text,                   -- momo | bank
  add column if not exists source          text default 'company'; -- company | artisan

-- ── Artisans: add gallery images and agreement flag ───────────────────────
alter table public.artisans
  add column if not exists gallery_images     text[]  default '{}',
  add column if not exists agreement_accepted boolean default false;

-- ── Storage bucket for artisan profile & gallery photos ───────────────────
insert into storage.buckets (id, name, public)
  values ('artisan-artwork', 'artisan-artwork', false)
  on conflict (id) do nothing;

