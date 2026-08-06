import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(40),
  country: z.string().trim().min(2).max(80),
  province: z.string().trim().max(80).optional().default(""),
  district: z.string().trim().max(80).optional().default(""),
  address: z.string().trim().min(4).max(300),
  postalCode: z.string().trim().max(30).optional().default(""),
  companyName: z.string().trim().max(160).optional().default(""),
  productName: z.string().trim().min(1).max(160),
  collection: z.string().trim().min(1).max(160),
  artworkType: z.string().trim().max(160).optional().default(""),
  sizeCode: z.string().trim().min(1).max(20),
  customSize: z.string().trim().max(160).optional().default(""),
  frameType: z.string().trim().max(120).optional().default(""),
  material: z.string().trim().max(120).optional().default(""),
  color: z.string().trim().max(120).optional().default(""),
  finish: z.string().trim().max(120).optional().default(""),
  orientation: z.string().trim().max(60).optional().default(""),
  quantity: z.number().int().min(1).max(99),
  unitPrice: z.number().min(0).max(1_000_000_000),
  subtotal: z.number().min(0).max(1_000_000_000),
  tax: z.number().min(0).max(1_000_000_000),
  shipping: z.number().min(0).max(1_000_000_000),
  total: z.number().min(0).max(1_000_000_000),
  notes: z.string().trim().max(1200).optional().default(""),
});

export type OrderInput = z.infer<typeof orderSchema>;

function makeOrderNumber() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const stamp = Date.now().toString().slice(-5);
  return `SAFIA-${year}-${stamp}${rand}`;
}

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const orderNumber = makeOrderNumber();

    const { error } = await supabaseAdmin.from("orders").insert({
      order_number: orderNumber,
      status: "Pending",
      customer_name: data.customerName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      province: data.province || null,
      district: data.district || null,
      address: data.address,
      postal_code: data.postalCode || null,
      company_name: data.companyName || null,
      product_name: data.productName,
      collection: data.collection,
      artwork_type: data.artworkType || null,
      size_code: data.sizeCode,
      custom_size: data.customSize || null,
      frame_type: data.frameType || null,
      material: data.material || null,
      color: data.color || null,
      finish: data.finish || null,
      orientation: data.orientation || null,
      quantity: data.quantity,
      unit_price: Math.round(data.unitPrice),
      subtotal: Math.round(data.subtotal),
      tax: Math.round(data.tax),
      shipping: Math.round(data.shipping),
      total: Math.round(data.total),
      notes: data.notes || null,
    });

    if (error) {
      console.error("Order insert failed", error);
      throw new Error("We could not register your order. Please try again.");
    }

    return { orderNumber, status: "Pending" as const };
  });

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ orderNumber: z.string().trim().min(6).max(60) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .select(
        "order_number, status, product_name, collection, size_code, quantity, total, currency, created_at",
      )
      .eq("order_number", data.orderNumber.toUpperCase())
      .maybeSingle();

    if (error) {
      console.error("Order lookup failed", error);
      throw new Error("Order lookup is unavailable right now.");
    }
    if (!row) return { found: false as const };
    return { found: true as const, order: row };
  });
