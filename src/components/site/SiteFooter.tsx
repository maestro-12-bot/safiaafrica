import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-4 lg:px-10">
        <div>
          <p className="font-display text-2xl tracking-[0.18em] text-gradient-sunset">SAFIA</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Sustainable African Fashion, Innovation and Arts. Preserving, documenting and licensing
            Africa&apos;s heritage through technology-driven luxury craft.
          </p>
        </div>

        <div>
          <p className="text-[10px] tracking-luxe text-gold">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/collections" className="hover:text-foreground">
                Collections &amp; Pricing
              </Link>
            </li>
            <li>
              <Link to="/heritage" className="hover:text-foreground">
                African Heritage
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-foreground">
                Virtual Gallery
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-foreground">
                Track an Order
              </Link>
            </li>
            <li>
              <Link to="/artisan" className="hover:text-foreground">
                Artisan Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] tracking-luxe text-gold">Clients</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Government &amp; Presidency</li>
            <li>Embassies &amp; Missions</li>
            <li>Five-star Hotels</li>
            <li>Luxury Homes &amp; Collectors</li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] tracking-luxe text-gold">Atelier</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Kigali, Rwanda</li>
            <li>
              <a href="mailto:orders@safia.africa" className="hover:text-foreground">
                orders@safia.africa
              </a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Book a consultation
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-5 py-6 text-center text-[11px] tracking-luxe text-muted-foreground lg:px-10">
        © {new Date().getFullYear()} SAFIA Africa — Pan-African Heritage &amp; Innovation
      </div>
    </footer>
  );
}
