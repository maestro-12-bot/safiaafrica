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

## Verifying it works
- `curl -sf -H "Host: 3000-$BASE44_PUBLIC_HOST_SUFFIX" http://localhost:3000/` → 200 with `SAFIA Africa` in the body.
- Routes: `/`, `/about`, `/collections`, `/gallery`, `/heritage`, `/luxury`, `/contact`, `/track`, `/order`, `/admin`.
