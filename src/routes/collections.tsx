import { Link, createFileRoute } from "@tanstack/react-router";
import { Crown, Star } from "lucide-react";
import { useState } from "react";

import { OrderDialog } from "@/components/OrderDialog";
import { ProductBadges } from "@/components/ProductBadges";
import { Button } from "@/components/ui/button";
import {
  LUXURY_PRODUCTS,
  MDF_TIERS,
  PRODUCTS,
  SIZE_TIERS,
  calculatePrice,
  formatRWF,
  type Product,
} from "@/data/catalog";

const A4_PRICE = SIZE_TIERS.find((t) => t.code === "A4")!.price!;
const A0_PRICE = SIZE_TIERS.find((t) => t.code === "A0")!.price!;


export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections & Pricing — SAFIA Africa Luxury 3D Artwork" },
      {
        name: "description",
        content:
          "Browse SAFIA Africa's Imigongo, Umukenyero, Umugara and botanical 3D collections. Customise size, frame, material and finish with instant RWF pricing.",
      },
      { property: "og:title", content: "SAFIA Africa Collections & Pricing" },
      {
        property: "og:description",
        content: "Customise your heritage artwork with instant pricing from A6 to A0 presidential scale.",
      },
    ],
  }),
  component: Collections,
});

function Collections() {
  const [active, setActive] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const order = (p: Product) => {
    setActive(p);
    setOpen(true);
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">Collections</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl lg:text-7xl">
            Every piece, <span className="text-gradient-sunset">made for you.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Choose a collection, then configure size, frame, material, finish, colour and quantity in
            the Customisation Studio. Your total updates instantly — no page refresh.
          </p>
        </div>
      </section>

      <section className="border-b border-gold/20 bg-card/20">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] tracking-luxe text-gold">
                <Crown className="size-3.5" /> Luxury Collection
              </p>
              <h2 className="mt-3 font-display text-4xl">Above the collections.</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Presidential, museum-grade, limited and one-of-one commissions — our most exclusive
                tier, priced for institutions and collectors.
              </p>
            </div>
            <Link
              to="/luxury"
              className="rounded-full border border-gold/50 px-5 py-2 text-[11px] tracking-luxe text-gold hover:bg-secondary"
            >
              Explore the Luxury Collection
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LUXURY_PRODUCTS.slice(0, 3).map((p) => (
              <article
                key={p.slug}
                className="group overflow-hidden rounded-xl border border-gold/25 bg-background/40"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={`${p.name} — ${p.artworkType}`}
                    loading="lazy"
                    width={800}
                    height={640}
                    className="aspect-[5/4] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]"
                  />
                  <ProductBadges product={p} className="absolute left-3 top-3" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] tracking-luxe text-gold">{p.luxuryCategory}</p>
                  <h3 className="mt-2 font-display text-2xl">{p.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    From{" "}
                    {formatRWF(
                      calculatePrice({
                        sizeCode: "A4",
                        quantity: 1,
                        frameId: "gold-leaf",
                        materialId: "mdf-3d",
                        finishId: "matte",
                        shippingId: "kigali",
                        productMultiplier: p.priceMultiplier ?? 1,
                      }).unitPrice,
                    )}
                  </p>
                  <Button
                    onClick={() => order(p)}
                    className="mt-4 w-full bg-sunset text-primary-foreground hover:opacity-90"
                  >
                    Commission
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <h2 className="mb-10 font-display text-4xl">Heritage collections</h2>
        <div className="grid gap-10 md:grid-cols-2">

          {PRODUCTS.map((p) => (
            <article
              key={p.slug}
              className="group overflow-hidden rounded-xl border border-border bg-card/40 shadow-luxe"
            >
              <div className="overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.artworkType}`}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="aspect-[5/4] w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.06]"
                />
              </div>
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] tracking-luxe text-gold">{p.collection}</p>
                    <h2 className="mt-2 font-display text-3xl">{p.name}</h2>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-gold">
                    <Star className="size-3.5 fill-current" />
                    {p.rating} <span className="text-muted-foreground">({p.reviews})</span>
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <Meta label="Artwork type" value={p.artworkType} />
                  <Meta label="Origin" value={p.origin} />
                  <Meta label="Artist" value={p.artist} />
                  <Meta label="Lead time" value={p.leadTime} />
                  <Meta label="Materials" value={p.materials.join(", ")} />
                  <Meta label="Availability" value={p.stock} />
                </dl>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => order(p)}
                    className="bg-sunset text-primary-foreground hover:opacity-90"
                  >
                    Order Now
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    From {formatRWF(SIZE_TIERS[6]!.price!)} · up to{" "}
                    {formatRWF(SIZE_TIERS[0]!.price!)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">MDF 3D reference range</p>
          <h2 className="mt-4 font-display text-4xl">Indicative market pricing.</h2>
          <ul className="mt-10 divide-y divide-border">
            {MDF_TIERS.map((t) => (
              <li key={t.label} className="flex flex-wrap justify-between gap-3 py-4 text-sm">
                <span className="text-muted-foreground">{t.label}</span>
                <span className="text-gold">{t.range}</span>
              </li>
            ))}
          </ul>
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
