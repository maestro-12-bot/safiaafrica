import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MasterpiecePreview } from "@/components/MasterpiecePreview";
import {
  COLOR_OPTIONS,
  FINISH_OPTIONS,
  FRAME_OPTIONS,
  MATERIAL_OPTIONS,
  ORIENTATION_OPTIONS,
  SERVICE_OPTIONS,
  SHIPPING_OPTIONS,
  SIZE_TIERS,
  calculatePrice,
  configurationAdvice,
  formatRWF,
  isLuxury,
  productMultiplier,
  type Product,
  type SizeCode,
} from "@/data/catalog";
import { createOrder } from "@/lib/orders.functions";


interface Props {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputClass = "bg-secondary/50 border-input text-sm";

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] tracking-luxe text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </Label>
      {children}
    </div>
  );
}

function Selector({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
    >
      {options.map((o) => (
        <option key={o.id} value={o.id} className="bg-card">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function OrderDialog({ product, open, onOpenChange }: Props) {
  const [size, setSize] = useState<SizeCode>("A3");
  const [customSize, setCustomSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [frame, setFrame] = useState(FRAME_OPTIONS[0]!.id);
  const [material, setMaterial] = useState(MATERIAL_OPTIONS[0]!.id);
  const [finish, setFinish] = useState(FINISH_OPTIONS[0]!.id);
  const [color, setColor] = useState(COLOR_OPTIONS[0]!);
  const [orientation, setOrientation] = useState<string>(ORIENTATION_OPTIONS[0]!);
  const [services, setServices] = useState<string[]>([]);

  const [shipping, setShipping] = useState(SHIPPING_OPTIONS[0]!.id);
  const [notes, setNotes] = useState("");

  const [customer, setCustomer] = useState({
    customerName: "",
    email: "",
    phone: "",
    country: "Rwanda",
    province: "",
    district: "",
    address: "",
    postalCode: "",
    companyName: "",
  });

  const [placed, setPlaced] = useState<{ orderNumber: string } | null>(null);

  const price = useMemo(
    () =>
      calculatePrice({
        sizeCode: size,
        quantity,
        frameId: frame,
        materialId: material,
        finishId: finish,
        shippingId: shipping,
        productMultiplier: productMultiplier(product),
        serviceIds: services,
      }),
    [size, quantity, frame, material, finish, shipping, product, services],
  );

  const advice = useMemo(
    () =>
      configurationAdvice({
        product,
        sizeCode: size,
        frameId: frame,
        finishId: finish,
        materialId: material,
      }),
    [product, size, frame, finish, material],
  );


  const tier = SIZE_TIERS.find((t) => t.code === size)!;
  const frameLabel = FRAME_OPTIONS.find((f) => f.id === frame)!.label;
  const materialLabel = MATERIAL_OPTIONS.find((m) => m.id === material)!.label;
  const finishLabel = FINISH_OPTIONS.find((f) => f.id === finish)!.label;
  const shippingLabel = SHIPPING_OPTIONS.find((s) => s.id === shipping)!.label;

  const estimatedDelivery = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (size === "CUSTOM" ? 60 : 35));
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }, [size]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("No product selected");
      return createOrder({
        data: {
          ...customer,
          productName: product.name,
          collection: tier.collection,
          artworkType: product.artworkType,
          sizeCode: size,
          customSize: size === "CUSTOM" ? customSize : "",
          frameType: frameLabel,
          material: materialLabel,
          color,
          finish: finishLabel,
          orientation,
          quantity,
          unitPrice: price.unitPrice,
          subtotal: price.subtotal,
          tax: price.tax,
          shipping: price.shipping,
          total: price.total,
          notes: [notes, `Shipping: ${shippingLabel}`].filter(Boolean).join(" | "),
        },
      });
    },
    onSuccess: (res) => {
      setPlaced({ orderNumber: res.orderNumber });
      toast.success(`Order ${res.orderNumber} registered`);
    },
    onError: (e: Error) => toast.error(e.message || "Something went wrong"),
  });

  const missing =
    !customer.customerName.trim() ||
    !customer.email.trim() ||
    !customer.phone.trim() ||
    !customer.country.trim() ||
    !customer.address.trim() ||
    (size === "CUSTOM" && !customSize.trim());

  if (!product) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setPlaced(null);
      }}
    >
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto border-border bg-card/95 backdrop-blur-xl">
        {placed ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto size-12 text-gold" />
            <h2 className="mt-5 font-display text-3xl">Order registered</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our atelier team will confirm your commission within one business day.
            </p>
            <p className="mt-6 text-[10px] tracking-luxe text-muted-foreground">Order number</p>
            <p className="font-display text-2xl text-gold">{placed.orderNumber}</p>
            <p className="mt-6 text-xs text-muted-foreground">
              Keep this number — you can follow production status on the Track Order page.
            </p>
            <Button
              className="mt-6 bg-sunset text-primary-foreground"
              onClick={() => {
                onOpenChange(false);
                setPlaced(null);
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <p className="text-[10px] tracking-luxe text-gold">
                {isLuxury(product) ? "Luxury Customisation Studio" : "Customisation Studio"}
              </p>
              <DialogTitle className="font-display text-3xl">{product.name}</DialogTitle>
              {product.badges?.length ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-gold/50 px-2.5 py-0.5 text-[9px] tracking-luxe text-gold"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              ) : null}
              <DialogDescription>
                Configure your commission — the preview and pricing update instantly.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-7">
                <MasterpiecePreview
                  config={{
                    image: product.image,
                    name: product.name,
                    sizeCode: size,
                    frameId: frame,
                    materialId: material,
                    finishId: finish,
                    color,
                    orientation,
                  }}
                />

                {advice.length > 0 && (
                  <ul className="space-y-1.5 rounded-lg border border-gold/25 bg-secondary/40 p-3">
                    {advice.map((tip) => (
                      <li key={tip} className="text-[11px] leading-relaxed text-muted-foreground">
                        <span className="text-gold">·</span> {tip}
                      </li>
                    ))}
                  </ul>
                )}

                <section className="space-y-3">
                  <p className="text-[10px] tracking-luxe text-gold">Size selection</p>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {SIZE_TIERS.map((t) => (
                      <button
                        key={t.code}
                        type="button"
                        onClick={() => setSize(t.code)}
                        className={`rounded-md border px-2 py-2.5 text-left transition-colors ${
                          size === t.code
                            ? "border-gold bg-secondary text-foreground"
                            : "border-border text-muted-foreground hover:border-gold/50"
                        }`}
                      >
                        <span className="block text-xs font-semibold">
                          {t.code === "CUSTOM" ? "Custom" : t.code}
                        </span>
                        <span className="block text-[10px] opacity-70">{t.dimensions}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tier.collection} — {tier.targetClient}
                  </p>
                  {size === "CUSTOM" && (
                    <Input
                      className={inputClass}
                      placeholder="Describe your dimensions, e.g. 240 × 150 cm"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                    />
                  )}
                </section>

                <section className="grid gap-4 sm:grid-cols-2">
                  <Field label="Frame type">
                    <Selector value={frame} onChange={setFrame} options={FRAME_OPTIONS} />
                  </Field>
                  <Field label="Material">
                    <Selector value={material} onChange={setMaterial} options={MATERIAL_OPTIONS} />
                  </Field>
                  <Field label="Finish">
                    <Selector value={finish} onChange={setFinish} options={FINISH_OPTIONS} />
                  </Field>
                  <Field label="Colour">
                    <Selector
                      value={color}
                      onChange={setColor}
                      options={COLOR_OPTIONS.map((c) => ({ id: c, label: c }))}
                    />
                  </Field>
                  <Field label="Orientation">
                    <Selector
                      value={orientation}
                      onChange={setOrientation}
                      options={ORIENTATION_OPTIONS.map((o) => ({ id: o, label: o }))}
                    />
                  </Field>
                  <Field label="Quantity">
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      className={inputClass}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Shipping">
                      <Selector value={shipping} onChange={setShipping} options={SHIPPING_OPTIONS} />
                    </Field>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-[10px] tracking-luxe text-muted-foreground">
                      Optional services
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {SERVICE_OPTIONS.map((s) => {
                        const on = services.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() =>
                              setServices((prev) =>
                                prev.includes(s.id)
                                  ? prev.filter((id) => id !== s.id)
                                  : [...prev, s.id],
                              )
                            }
                            className={`rounded-full border px-3 py-1 text-[10px] tracking-luxe transition-colors ${
                              on
                                ? "border-gold text-gold"
                                : "border-border text-muted-foreground hover:border-gold/50"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>


                <section className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <p className="text-[10px] tracking-luxe text-gold">Customer information</p>
                  </div>
                  <Field label="Full name" required>
                    <Input
                      className={inputClass}
                      value={customer.customerName}
                      onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                    />
                  </Field>
                  <Field label="Email" required>
                    <Input
                      type="email"
                      className={inputClass}
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                  </Field>
                  <Field label="Phone" required>
                    <Input
                      className={inputClass}
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    />
                  </Field>
                  <Field label="Country" required>
                    <Input
                      className={inputClass}
                      value={customer.country}
                      onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                    />
                  </Field>
                  <Field label="Province">
                    <Input
                      className={inputClass}
                      value={customer.province}
                      onChange={(e) => setCustomer({ ...customer, province: e.target.value })}
                    />
                  </Field>
                  <Field label="District">
                    <Input
                      className={inputClass}
                      value={customer.district}
                      onChange={(e) => setCustomer({ ...customer, district: e.target.value })}
                    />
                  </Field>
                  <Field label="Address" required>
                    <Input
                      className={inputClass}
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    />
                  </Field>
                  <Field label="Postal code">
                    <Input
                      className={inputClass}
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Company (optional)">
                      <Input
                        className={inputClass}
                        value={customer.companyName}
                        onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Notes for the atelier">
                      <Textarea
                        className={inputClass}
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </Field>
                  </div>
                </section>
              </div>

              <aside className="h-fit rounded-lg border border-border bg-background/60 p-5 lg:sticky lg:top-2">
                <p className="text-[10px] tracking-luxe text-gold">Order summary</p>
                <p className="mt-2 font-display text-xl">{product.name}</p>
                <dl className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <Row label="Collection" value={tier.collection} />
                  <Row
                    label="Size"
                    value={size === "CUSTOM" ? customSize || "Custom" : `${size} · ${tier.dimensions}`}
                  />
                  <Row label="Frame" value={frameLabel} />
                  <Row label="Material" value={materialLabel} />
                  <Row label="Finish" value={finishLabel} />
                  <Row label="Colour" value={color} />
                  <Row label="Orientation" value={orientation} />
                  <Row label="Quantity" value={String(quantity)} />
                  <Row label="Shipping" value={shippingLabel} />
                </dl>

                <div className="my-4 hairline" />

                {price.quotable ? (
                  <dl className="space-y-2 text-sm">
                    <Row label="Unit price" value={formatRWF(price.unitPrice)} strong />
                    {price.discount > 0 && (
                      <Row label="Volume discount" value={`− ${formatRWF(price.discount)}`} />
                    )}
                    <Row label="Subtotal" value={formatRWF(price.subtotal)} />
                    <Row label="VAT (18%)" value={formatRWF(price.tax)} />
                    <Row label="Shipping" value={formatRWF(price.shipping)} />
                    <div className="my-3 hairline" />
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] tracking-luxe text-muted-foreground">Total</span>
                      <span className="font-display text-2xl text-gold">
                        {formatRWF(price.total)}
                      </span>
                    </div>
                  </dl>
                ) : (
                  <p className="rounded-md border border-gold/30 bg-secondary/50 p-3 text-xs text-muted-foreground">
                    Custom dimensions are quoted individually. Submit your request and our team will
                    return a formal quotation within 24 hours.
                  </p>
                )}

                <p className="mt-4 text-[11px] text-muted-foreground">
                  Estimated delivery: <span className="text-foreground">{estimatedDelivery}</span>
                </p>

                <Button
                  className="mt-5 w-full bg-sunset text-primary-foreground hover:opacity-90"
                  disabled={missing || mutation.isPending}
                  onClick={() => mutation.mutate()}
                >
                  {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {price.quotable ? "Place Order" : "Request Quotation"}
                </Button>
                {missing && (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Complete the required fields marked * to continue.
                  </p>
                )}
                <p className="mt-4 flex items-center gap-2 text-[10px] tracking-luxe text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-gold" /> Secure order registration
                </p>
              </aside>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0">{label}</dt>
      <dd className={`text-right ${strong ? "text-foreground" : ""}`}>{value}</dd>
    </div>
  );
}
