import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { OrderDialog } from "@/components/OrderDialog";
import { ProductBadges } from "@/components/ProductBadges";
import { Button } from "@/components/ui/button";
import {
  ALL_PRODUCTS,
  SIZE_TIERS,
  calculatePrice,
  formatRWF,
  isLuxury,
  tierBasePrice,
  type Product,
} from "@/data/catalog";

const A4_PRICE = tierBasePrice(SIZE_TIERS.find((t) => t.code === "A4")!.price)!;


export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Place an Order — SAFIA Africa Custom 3D Artwork" },
      {
        name: "description",
        content:
          "Place your SAFIA Africa order in minutes: choose a collection, customise size, frame, material and finish, then receive your tracking code instantly.",
      },
      { property: "og:title", content: "Place an Order — SAFIA Africa" },
      {
        property: "og:description",
        content: "Configure your heritage artwork and receive a SAFIA order code you can track.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const [active, setActive] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const start = (p: Product) => {
    setActive(p);
    setOpen(true);
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-5xl px-5 py-24 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">Place your order</p>
          <h1 className="mt-5 font-display text-5xl lg:text-6xl">
            Commission your <span className="text-gradient-sunset">masterpiece.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Select a collection, configure every detail in the Customisation Studio, and confirm. You
            receive a SAFIA order code immediately — keep it to follow production on the Track Order
            page.
          </p>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              ["01", "Choose a collection", "Luxury and heritage series, A4 to A0 presidential scale."],
              ["02", "Customise & see the price", "Size, frame, material, finish, quantity, shipping."],
              ["03", "Get your order code", "Confirm and track your commission any time."],
            ].map(([n, t, d]) => (
              <li key={n} className="rounded-xl border border-border bg-card/40 p-6">
                <p className="text-[10px] tracking-luxe text-gold">{n}</p>
                <p className="mt-3 font-display text-xl">{t}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 lg:px-10">
        <h2 className="font-display text-3xl">Select your collection</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {ALL_PRODUCTS.map((p: Product) => (
            <article
              key={p.slug}
              className={`flex gap-5 rounded-xl border bg-card/40 p-5 ${
                p.tier === "luxury" ? "border-gold/30" : "border-border"
              }`}
            >
              <img
                src={p.image}
                alt={`${p.name} — ${p.artworkType}`}
                loading="lazy"
                width={160}
                height={160}
                className="size-24 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="text-[10px] tracking-luxe text-gold">{p.collection}</p>
                <h3 className="mt-1 font-display text-2xl">{p.name}</h3>
                <ProductBadges product={p} className="mt-2" />
                <p className="mt-1 text-xs text-muted-foreground">
                  From{" "}
                  {formatRWF(
                    calculatePrice({
                      sizeCode: "A4",
                      quantity: 1,
                      frameId: "frameless",
                      materialId: "mdf-3d",
                      finishId: "matte",
                      shippingId: "kigali",
                      productMultiplier: p.priceMultiplier ?? 1,
                      luxury: isLuxury(p),
                    }).unitPrice || A4_PRICE,
                  )}
                </p>

                <Button
                  onClick={() => start(p)}
                  className="mt-4 bg-sunset text-primary-foreground hover:opacity-90"
                >
                  Order this piece
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <OrderDialog product={active} open={open} onOpenChange={setOpen} />
    </>
  );
}
