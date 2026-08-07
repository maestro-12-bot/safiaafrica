import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/collections", label: "Collections" },
  { to: "/heritage", label: "Heritage" },
  { to: "/gallery", label: "Gallery" },
  { to: "/order", label: "Order" },
  { to: "/track", label: "Track Order" },
  { to: "/contact", label: "Contact" },

] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
            <span className="font-display text-xl tracking-[0.2em] text-gradient-sunset">SAFIA</span>
            <span className="hidden text-[10px] tracking-luxe text-muted-foreground sm:block">
              Africa
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[11px] tracking-luxe text-muted-foreground transition-colors hover:text-gold"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/collections"
              className="hidden rounded-full bg-sunset px-5 py-2 text-[11px] font-semibold tracking-luxe text-primary-foreground transition-transform hover:scale-[1.03] sm:inline-block"
            >
              Order Artwork
            </Link>
            <button
              aria-label="Toggle menu"
              className="text-gold lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="grid gap-1 border-t border-border px-5 pb-5 pt-3 lg:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-xs tracking-luxe text-muted-foreground hover:bg-secondary hover:text-gold"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
