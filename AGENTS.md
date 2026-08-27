<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in the
> editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Base44 dev notes

## Stack
- TanStack Start (SSR via nitro) + Vite + React 19, Tailwind v4, package manager is **bun**.
- Dev command: `bun run dev` (runs `vite dev`). Live reload is on; edits appear in the preview without a rebuild.

## Running here
- `docker compose -f docker-compose.base44.yml up -d` — single `web` service on `oven/bun:1`, source bind-mounted at `/app`.
- The Lovable vite config (`@lovable.dev/vite-tanstack-config`) hardcodes the dev server to **port 8080** with `strictPort: true`. The compose maps the platform's public port **3000 → container 8080**.
- Vite's host check blocks the preview's external proxy hostname, so `vite.config.ts` sets `server.allowedHosts: true` (the hostname changes whenever the environment is recreated).
- `node_modules` lives in a named volume (not on the host), so `bun install` runs inside the container on startup.

## Secrets / Supabase
- The public site uses Supabase **publishable** keys, already committed in `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, plus their non-VITE SSR mirrors). These are safe public keys.
- The `/admin` route additionally needs server-side secrets: `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`. The `supabaseAdmin` client is a lazy Proxy — the app **boots and renders the public site fine without them**; it only throws if you actually hit `/admin`. Placeholders are in `.env.base44-defaults` so boot never blocks; real values are delivered via `/run/base44/app.env` (last `env_file` entry, always wins).

## Artisan & Admin portals (wired to Supabase)
- `/artisan` — Artisan Portal: register/login, dashboard (stats + revenue chart), product CRUD, earnings & 50/50 commission, withdrawal requests, advertising analytics. Server functions in `src/lib/artisan.functions.ts`.
- `/admin` — Admin Portal (enhanced): tabs for Overview (charts), Orders (existing), Artisans (approve/suspend/feature/record sale), Products (approve/reject/feature), Withdrawals (approve/pay/reject). New functions in `src/lib/admin-portal.functions.ts`; original order functions in `src/lib/admin.functions.ts` are unchanged.
- Both portals use `supabaseAdmin` (service-role key) via server functions, and `ADMIN_SESSION_SECRET` for session cookies (artisan uses cookie name `safia-artisan`, admin `safia-admin`).
- **One-time DB migration required:** run `supabase/migrations/20260827130000_artisan_portal.sql` in the Supabase Dashboard SQL Editor (the service-role key can read/write tables but cannot run DDL). Until it is run, portal pages still load but their data queries return an error.

## Pricing rules (updated)
- `calculatePrice` is now VAT-inclusive: VAT is embedded in displayed prices; the OrderDialog no longer shows a separate VAT/subtotal line — only the final payable total. The embedded VAT is still stored in the `tax` field for records.
- Frame pricing clamp: standard (non-luxury) products are clamped to 100,000–1,000,000 RWF (`clampFramePrice`); luxury products honour the floor but may exceed the ceiling.
- Materials are now MDF-only (`Premium/Luxury/Decorative/Moisture Resistant/High Density MDF`) plus a new `DESIGN_OPTIONS` selector (Modern/Luxury/Minimalist/Executive/Classic/Contemporary) driving the design-complexity price factor.

## Language system
- Already persists to `localStorage` (`safia.lang`, `safia.currency`) and switches instantly via React context — no page reload. No change was needed.

## Verifying it works
- `curl -sf -H "Host: 3000-$BASE44_PUBLIC_HOST_SUFFIX" http://localhost:3000/` → 200 with `SAFIA Africa` in the body.
- Routes: `/`, `/about`, `/collections`, `/gallery`, `/heritage`, `/luxury`, `/contact`, `/track`, `/order`, `/artisan`, `/admin`.
