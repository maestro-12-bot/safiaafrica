import { Link } from "@tanstack/react-router";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";

import { CURRENCIES } from "@/data/currencies";
import { LANGUAGES, type TranslationKey } from "@/data/i18n";
import { useLocale } from "@/lib/locale";

const LINKS = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/luxury", key: "nav.luxury" },
  { to: "/collections", key: "nav.collections" },
  { to: "/countries", key: "nav.countries" },
  { to: "/heritage", key: "nav.heritage" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/order", key: "nav.order" },
  { to: "/track", key: "nav.track" },
  { to: "/contact", key: "nav.contact" },
] as const satisfies readonly { to: string; key: TranslationKey }[];

const selectClass =
  "rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[10px] tracking-luxe text-muted-foreground outline-none hover:border-gold/50 focus:border-gold";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, currency, setCurrency, t, rtl } = useLocale();

  const selectors = (
    <div className="flex items-center gap-2" dir={rtl ? "rtl" : "ltr"}>
      <Globe className="size-3.5 text-gold" aria-hidden />
      <select
        aria-label={t("label.language")}
        className={selectClass}
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="bg-card">
            {l.native}
          </option>
        ))}
      </select>
      <select
        aria-label={t("label.currency")}
        className={selectClass}
        value={currency.code}
        onChange={(e) => setCurrency(e.target.value)}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="bg-card">
            {c.code}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-10">
          <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
            <span className="font-display text-xl tracking-[0.2em] text-gradient-sunset">SAFIA</span>
            <span className="hidden text-[10px] tracking-luxe text-muted-foreground sm:block">
              Africa
            </span>
          </Link>

          <nav className="hidden items-center gap-5 xl:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[11px] tracking-luxe text-muted-foreground transition-colors hover:text-gold"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">{selectors}</div>
            <Link
              to="/order"
              className="hidden rounded-full bg-sunset px-5 py-2 text-[11px] font-semibold tracking-luxe text-primary-foreground transition-transform hover:scale-[1.03] lg:inline-block"
            >
              {t("cta.order")}
            </Link>
            <button
              aria-label="Toggle menu"
              className="text-gold xl:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="grid gap-1 border-t border-border px-5 pb-5 pt-3 xl:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-xs tracking-luxe text-muted-foreground hover:bg-secondary hover:text-gold"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {t(l.key)}
              </Link>
            ))}
            <div className="mt-3 md:hidden">{selectors}</div>
          </nav>
        )}
      </div>
    </header>
  );
}
