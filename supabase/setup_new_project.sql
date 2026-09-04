-- SAFIA Africa — consolidated database setup for a fresh Supabase project.
--
-- Paste this entire script into the Supabase Dashboard SQL Editor (New query)
-- and Run. It is safe to re-run: every statement is idempotent, and the
-- ALTER ... ADD COLUMN IF NOT EXISTS blocks repair tables left in an older
-- shape by a previous partial run.
--
-- It consolidates the repo's migrations:
--   20260806152656 (orders), 20260827130000 (artisan portal),
--   20260901101926 (artisan portal v2 + page views),
--   20260904120000 (order codes, payment plans, galleries, storage bucket).

-- ═══════════════════════════════════════════════════════════════════════════
-- Orders
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  order_code TEXT,
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
  payment_plan TEXT DEFAULT 'full',    -- full | half
  payment_method TEXT,                 -- momo | bank
  source TEXT DEFAULT 'company',        -- company | artisan
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Repair older shapes (no-op when the columns already exist).
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_code TEXT,
  ADD COLUMN IF NOT EXISTS payment_plan TEXT DEFAULT 'full',
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'company';

GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- Artisans
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.artisans (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT UNIQUE NOT NULL,
  phone            TEXT,
  password_hash    TEXT,
  full_name        TEXT NOT NULL,
  bio              TEXT,
  photo_url        TEXT,
  location         TEXT,
  skills           TEXT[] DEFAULT '{}',
  years_experience INT DEFAULT 0,
  social_links     JSONB DEFAULT '{}'::jsonb,
  verified         BOOLEAN DEFAULT false,
  status           TEXT DEFAULT 'pending',   -- pending | approved | rejected | suspended
  featured         BOOLEAN DEFAULT false,
  auth_user_id     UUID,
  provider         TEXT DEFAULT 'password',
  gallery_images   TEXT[] DEFAULT '{}',
  agreement_accepted BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Repair older shapes (no-op when the columns already exist).
ALTER TABLE public.artisans
  ADD COLUMN IF NOT EXISTS auth_user_id UUID,
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'password',
  ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS agreement_accepted BOOLEAN DEFAULT false;
ALTER TABLE public.artisans ALTER COLUMN password_hash DROP NOT NULL;

-- ═══════════════════════════════════════════════════════════════════════════
-- Artisan products
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.artisan_products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id   UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  images       TEXT[] DEFAULT '{}',
  dimensions   TEXT,
  materials    TEXT,
  frame_type   TEXT,
  design_style TEXT,
  price        NUMERIC DEFAULT 0,
  inventory    INT DEFAULT 0,
  status       TEXT DEFAULT 'pending',   -- pending | active | rejected
  featured     BOOLEAN DEFAULT false,
  views        INT DEFAULT 0,
  likes        INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- Commission ledger (50% artisan / 50% platform)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.commissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id     UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
  product_id     UUID REFERENCES public.artisan_products(id) ON DELETE SET NULL,
  order_number   TEXT,
  gross          NUMERIC DEFAULT 0,
  artisan_share  NUMERIC DEFAULT 0,
  platform_share NUMERIC DEFAULT 0,
  status         TEXT DEFAULT 'pending', -- pending | paid
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- Withdrawal requests
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
  amount     NUMERIC DEFAULT 0,
  status     TEXT DEFAULT 'pending',     -- pending | approved | paid | rejected
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- Page views (public site analytics)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.page_views (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path       TEXT NOT NULL,
  referrer   TEXT,
  country    TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_artisan_products_artisan ON public.artisan_products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_artisan_products_status ON public.artisan_products(status);
CREATE INDEX IF NOT EXISTS idx_commissions_artisan ON public.commissions(artisan_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_artisan ON public.withdrawals(artisan_id);
CREATE INDEX IF NOT EXISTS idx_artisans_status ON public.artisans(status);
CREATE INDEX IF NOT EXISTS idx_artisans_auth_user ON public.artisans(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views(created_at);

-- ═══════════════════════════════════════════════════════════════════════════
-- Grants, RLS and the one public-insert policy
-- ═══════════════════════════════════════════════════════════════════════════
GRANT ALL ON public.artisans TO service_role;
GRANT ALL ON public.artisan_products TO service_role;
GRANT ALL ON public.commissions TO service_role;
GRANT ALL ON public.withdrawals TO service_role;
GRANT ALL ON public.page_views TO service_role;
GRANT INSERT ON public.page_views TO anon, authenticated;

ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone may record a page view" ON public.page_views;
CREATE POLICY "Anyone may record a page view"
  ON public.page_views FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- Storage bucket for artisan profile & gallery photos
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
  VALUES ('artisan-artwork', 'artisan-artwork', false)
  ON CONFLICT (id) DO NOTHING;
