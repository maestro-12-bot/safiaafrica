import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2, PackageSearch } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRWF } from "@/data/catalog";
import { trackOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Order — SAFIA Africa" },
      {
        name: "description",
        content:
          "Follow your SAFIA Africa commission from confirmation through production, quality check and delivery using your order number.",
      },
      { property: "og:title", content: "Track Your SAFIA Africa Order" },
      {
        property: "og:description",
        content: "Enter your order number to see live production status.",
      },
    ],
  }),
  component: Track,
});

const STATUSES = [
  "Pending",
  "Confirmed",
  "In Production",
  "Quality Check",
  "Ready",
  "Shipped",
  "Delivered",
  "Completed",
];

function Track() {
  const [orderNumber, setOrderNumber] = useState("");

  const mutation = useMutation({
    mutationFn: () => trackOrder({ data: { orderNumber } }),
  });

  const result = mutation.data;
  const currentIndex =
    result?.found === true ? Math.max(0, STATUSES.indexOf(result.order.status)) : -1;

  return (
    <section className="mx-auto max-w-3xl px-5 py-24 lg:px-10">
      <p className="text-[10px] tracking-luxe text-gold">Order tracking</p>
      <h1 className="mt-5 font-display text-5xl">Where is my artwork?</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Enter the order number you received when placing your commission, e.g. SAFIA-2026-XXXXX.
      </p>

      <form
        className="mt-10 flex flex-wrap gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (orderNumber.trim().length >= 6) mutation.mutate();
        }}
      >
        <Input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
          placeholder="SAFIA-2026-..."
          className="max-w-xs border-input bg-secondary/50"
        />
        <Button
          type="submit"
          disabled={mutation.isPending || orderNumber.trim().length < 6}
          className="bg-sunset text-primary-foreground"
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <PackageSearch className="mr-2 size-4" />
          )}
          Track
        </Button>
      </form>

      {mutation.isError && (
        <p className="mt-8 text-sm text-destructive">
          We could not look up that order. Please try again.
        </p>
      )}

      {result?.found === false && (
        <p className="mt-8 text-sm text-muted-foreground">
          No order found with that number. Check the spelling, or contact our team.
        </p>
      )}

      {result?.found === true && (
        <div className="mt-12 rounded-xl border border-border bg-card/40 p-8">
          <p className="text-[10px] tracking-luxe text-gold">{result.order.order_number}</p>
          <h2 className="mt-2 font-display text-3xl">{result.order.product_name}</h2>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <Row label="Collection" value={result.order.collection} />
            <Row label="Size" value={result.order.size_code} />
            <Row label="Quantity" value={String(result.order.quantity)} />
            <Row label="Total" value={formatRWF(Number(result.order.total))} />
          </dl>

          <ol className="mt-10 space-y-3">
            {STATUSES.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span
                  className={`size-2.5 rounded-full ${
                    i <= currentIndex ? "bg-sunset" : "bg-secondary"
                  }`}
                />
                <span className={i <= currentIndex ? "text-foreground" : "text-muted-foreground"}>
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-luxe text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
