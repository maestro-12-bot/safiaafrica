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
