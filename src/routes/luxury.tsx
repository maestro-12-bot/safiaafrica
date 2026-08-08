import { createFileRoute } from "@tanstack/react-router";
import { Crown, Star } from "lucide-react";
import { useState } from "react";

import { OrderDialog } from "@/components/OrderDialog";
import { ProductBadges } from "@/components/ProductBadges";
import { Button } from "@/components/ui/button";
import {
  LUXURY_CATEGORIES,
  LUXURY_PRODUCTS,
  SIZE_TIERS,
  calculatePrice,
  formatRWF,
  type Product,
} from "@/data/catalog";

export const Route = createFileRoute("/luxury")({
  head: () => ({
    meta: [
      { title: "Luxury Collection — SAFIA Africa Presidential & Museum Artwork" },
      {
        name: "description",
        content:
          "SAFIA Africa's Luxury Collection: Presidential, Heritage Masterpiece, African Legacy, Executive, Museum, Limited Edition and Bespoke commissions in RWF.",
      },
      { property: "og:title", content: "SAFIA Africa Luxury Collection" },
      {
        property: "og:description",
        content:
          "Ultra-premium African heritage artwork for presidencies, embassies, museums, banks and private collectors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LuxuryPage,
});

function fromPrice(p: Product) {
  const price = calculatePrice({
    sizeCode: "A4",
    quantity: 1,
    frameId: "gold-leaf",
    materialId: "mdf-3d",
    finishId: "matte",
    shippingId: "kigali",
    productMultiplier: p.priceMultiplier ?? 1,
  });
  return price.unitPrice;
}

function topPrice(p: Product) {
  const price = calculatePrice({
    sizeCode: "A0",
    quantity: 1,
    frameId: "premium-gold",
    materialId: "brass-inlay",
    finishId: "gilded",
    shippingId: "kigali",
    productMultiplier: p.priceMultiplier ?? 1,
  });
  return price.unitPrice;
}

function LuxuryPage() {
  const [active, setActive] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>("All");

  const shown =
    category === "All"
      ? LUXURY_PRODUCTS
      : LUXURY_PRODUCTS.filter((p) => p.luxuryCategory === category);

  const commission = (p: Product) => {
    setActive(p);
    setOpen(true);
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <p className="inline-flex items-center gap-2 text-[10px] tracking-luxe text-gold">
            <Crown className="size-3.5" /> Luxury Collection
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl lg:text-7xl">
            The pieces we make <span className="text-gradient-sunset">for history.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Our most exclusive tier: monumental, limited and one-of-one commissions built for
            presidencies, embassies, museums, banks and private collectors. Configure any piece in
            the studio and watch it take shape before you commit.
          </p>
          <p className="mt-8 text-xs text-muted-foreground">
            Luxury commissions range from {formatRWF(fromPrice(LUXURY_PRODUCTS[3]!))} to over{" "}
            <span className="text-gold">{formatRWF(topPrice(LUXURY_PRODUCTS[6]!))}</span> per piece.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
        <div className="flex flex-wrap gap-2">
          {["All", ...LUXURY_CATEGORIES.map((c) => c.name)].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-[10px] tracking-luxe transition-colors ${
                category === c
                  ? "border-gold text-gold"
                  : "border-border text-muted-foreground hover:border-gold/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {shown.map((p) => (
            <article
              key={p.slug}
              className="group overflow-hidden rounded-xl border border-gold/25 bg-card/40 shadow-luxe"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.artworkType}`}
                  loading="lazy"
                  width={1024}
                  height={820}
                  className="aspect-[5/4] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06]"
                />
                <ProductBadges product={p} className="absolute left-4 top-4" />
              </div>
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] tracking-luxe text-gold">{p.luxuryCategory}</p>
                    <h2 className="mt-2 font-display text-3xl">{p.name}</h2>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-gold">
                    <Star className="size-3.5 fill-current" />
                    {p.rating} <span className="text-muted-foreground">({p.reviews})</span>
                  </span>
                </div>

                <p className="mt-3 text-sm italic text-muted-foreground">{p.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <Meta label="Artwork type" value={p.artworkType} />
                  <Meta label="Origin" value={p.origin} />
                  <Meta label="Master artist" value={p.artist} />
                  <Meta label="Lead time" value={p.leadTime} />
                  <Meta label="Availability" value={p.stock} />
                  {p.edition ? <Meta label="Edition" value={p.edition} /> : null}
                </dl>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => commission(p)}
                    className="bg-sunset text-primary-foreground hover:opacity-90"
                  >
                    Commission this piece
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    From {formatRWF(fromPrice(p))} · up to {formatRWF(topPrice(p))}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">Luxury tiers</p>
          <h2 className="mt-4 font-display text-4xl">Seven ways to commission a legacy.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LUXURY_CATEGORIES.map((c) => (
              <div key={c.name} className="rounded-xl border border-border bg-background/40 p-6">
                <p className="font-display text-xl">{c.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.blurb}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-xs text-muted-foreground">
            Standard sizes available: {SIZE_TIERS.filter((t) => t.price).map((t) => t.code).join(" · ")}{" "}
            and bespoke dimensions.
          </p>
        </div>
      </section>

      <OrderDialog product={active} open={open} onOpenChange={setOpen} />
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-luxe text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground/90">{value}</dd>
    </div>
  );
}
