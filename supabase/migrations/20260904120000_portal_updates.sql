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
