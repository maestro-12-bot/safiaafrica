import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "safia-admin",
    maxAge: 60 * 60 * 8,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("UNAUTHORIZED");
  return session;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        username: z.string().trim().min(1).max(80),
        password: z.string().min(1).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const user = process.env["ADMIN_USERNAME"];
    const pass = process.env["ADMIN_PASSWORD"];
    if (!user || !pass) throw new Error("Admin access is not configured.");

    if (!matches(data.username, user) || !matches(data.password, pass)) {
      return { ok: false as const };
    }

    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminSessionStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { authenticated: session.data.admin === true };
});

export const listOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, order_number, order_code, status, customer_name, email, phone, country, product_name, collection, size_code, quantity, total, currency, payment_plan, payment_method, source, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Admin order list failed", error);
    throw new Error("Could not load orders.");
  }

  const orders = data ?? [];
  const revenue = orders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const pending = orders.filter((o) => o.status === "Pending").length;
  const pieces = orders.reduce((sum, o) => sum + Number(o.quantity ?? 0), 0);

  return { orders, stats: { count: orders.length, revenue, pending, pieces } };
});

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum([
          "Pending",
          "Confirmed",
          "In Production",
          "Quality Check",
          "Ready",
          "Shipped",
          "Delivered",
          "Completed",
          "Cancelled",
        ]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("Could not update the order status.");
    return { ok: true as const };
  });
