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
