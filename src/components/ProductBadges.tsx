import type { Product } from "@/data/catalog";

export function ProductBadges({ product, className = "" }: { product: Product; className?: string }) {
  if (!product.badges?.length) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {product.badges.map((b) => (
        <span
          key={b}
          className="rounded-full border border-gold/50 bg-background/40 px-2.5 py-0.5 text-[9px] tracking-luxe text-gold backdrop-blur"
        >
          {b}
        </span>
      ))}
    </div>
  );
}
