import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

import { resolveImages, splitCommission } from "@/lib/artisan.functions";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "safia-admin",
    maxAge: 60 * 60 * 8,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("UNAUTHORIZED");
  return session;
}

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ── Overview ──────────────────────────────────────────────────────────────────
export const adminOverview = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const supabase = await getAdmin();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, status, email, created_at")
    .order("created_at", { ascending: true })
    .limit(2000);
  const { data: artisans } = await supabase.from("artisans").select("id, status, created_at");
  const { data: products } = await supabase.from("artisan_products").select("id, status");

  const orderList = orders ?? [];
  const artisanList = artisans ?? [];
  const productList = products ?? [];

  const totalRevenue = orderList.reduce((s: number, o: any) => s + Number(o.total ?? 0), 0);
  const totalOrders = orderList.length;
  const customers = new Set(orderList.map((o: any) => o.email).filter(Boolean));
  const pendingOrders = orderList.filter((o: any) => o.status === "Pending").length;
  const completedOrders = orderList.filter(
    (o: any) => o.status === "Completed" || o.status === "Delivered",
  ).length;

  // Monthly sales trend (last 12 months)
  const trends: { label: string; revenue: number; orders: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en", { month: "short" });
    const monthOrders = orderList.filter((o: any) => {
      const od = new Date(o.created_at);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    });
    trends.push({
      label,
      revenue: monthOrders.reduce((s: number, o: any) => s + Number(o.total ?? 0), 0),
      orders: monthOrders.length,
    });
  }

  return {
    stats: {
      totalRevenue,
      totalOrders,
      totalCustomers: customers.size,
      totalArtisans: artisanList.length,
      activeArtisans: artisanList.filter((a: any) => a.status === "approved").length,
      pendingOrders,
      completedOrders,
      totalProducts: productList.length,
      activeProducts: productList.filter((p: any) => p.status === "active").length,
    },
    salesTrend: trends,
  };
});

// ── Artisan management ─────────────────────────────────────────────────────────
export const adminListArtisans = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const supabase = await getAdmin();
  const { data, error } = await supabase
    .from("artisans")
    .select("id, email, phone, full_name, location, status, verified, featured, created_at, skills, years_experience")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load artisans.");
  return { artisans: data ?? [] };
});

export const adminSetArtisanStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["approved", "rejected", "suspended", "pending"]) }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await getAdmin();
    const patch: any = { status: data.status };
    if (data.status === "approved") patch.verified = true;
    const { error } = await supabase.from("artisans").update(patch).eq("id", data.id);
    if (error) throw new Error("Could not update the artisan.");
    return { ok: true as const };
  });

export const adminFeatureArtisan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), featured: z.boolean() }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await getAdmin();
    const { error } = await supabase.from("artisans").update({ featured: data.featured }).eq("id", data.id);
    if (error) throw new Error("Could not update the artisan.");
    return { ok: true as const };
  });

// ── Product management ─────────────────────────────────────────────────────────
export const adminListProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const supabase = await getAdmin();
  const { data, error } = await supabase
    .from("artisan_products")
    .select(
      "id, name, description, images, dimensions, materials, status, featured, price, views, likes, created_at, artisan_id, artisan:artisans(full_name, email)",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load products.");
  const products = await Promise.all(
    (data ?? []).map(async (p: any) => ({ ...p, imageUrls: await resolveImages(supabase, p.images) })),
  );
  return { products };
});

export const adminSetProductStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["active", "rejected", "pending"]) }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await getAdmin();
    const { error } = await supabase.from("artisan_products").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error("Could not update the product.");
    return { ok: true as const };
  });

export const adminFeatureProduct = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), featured: z.boolean() }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await getAdmin();
    const { error } = await supabase.from("artisan_products").update({ featured: data.featured }).eq("id", data.id);
    if (error) throw new Error("Could not update the product.");
    return { ok: true as const };
  });

// ── Commission / sales ─────────────────────────────────────────────────────────
export const adminRecordSale = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        artisanId: z.string().uuid(),
        productId: z.string().uuid().optional(),
        orderNumber: z.string().trim().max(60).optional().default(""),
        gross: z.number().min(0).max(100_000_000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await getAdmin();
    const { artisanShare, platformShare } = splitCommission(data.gross);
    const { error } = await supabase.from("commissions").insert({
      artisan_id: data.artisanId,
      product_id: data.productId ?? null,
      order_number: data.orderNumber || null,
      gross: data.gross,
      artisan_share: artisanShare,
      platform_share: platformShare,
      status: "pending",
    });
    if (error) throw new Error("Could not record the sale.");
    return { ok: true as const, artisanShare, platformShare };
  });

export const adminPayCommission = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await getAdmin();
    const { error } = await supabase.from("commissions").update({ status: "paid" }).eq("id", data.id);
    if (error) throw new Error("Could not update the commission.");
    return { ok: true as const };
  });

// ── Withdrawals ────────────────────────────────────────────────────────────────
export const adminListWithdrawals = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const supabase = await getAdmin();
  const { data, error } = await supabase
    .from("withdrawals")
    .select("id, amount, status, created_at, artisan_id, artisan:artisans(full_name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load withdrawals.");
  return { withdrawals: data ?? [] };
});

export const adminProcessWithdrawal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["approved", "paid", "rejected"]) }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await getAdmin();
    const { error } = await supabase.from("withdrawals").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error("Could not update the withdrawal.");
    return { ok: true as const };
  });

// ── Visitors / traffic ─────────────────────────────────────────────────────────
export const adminVisitors = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const supabase = await getAdmin();

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("page_views")
    .select("id, path, referrer, session_id, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) throw new Error("Could not load visitor analytics.");

  const views = data ?? [];
  const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);
  const todayKey = new Date().toISOString().slice(0, 10);

  const daily: { label: string; views: number; visitors: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    const rows = views.filter((v: any) => dayKey(v.created_at) === key);
    daily.push({
      label: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      views: rows.length,
      visitors: new Set(rows.map((v: any) => v.session_id).filter(Boolean)).size,
    });
  }

  const pathCounts = new Map<string, number>();
  const refCounts = new Map<string, number>();
  for (const v of views as any[]) {
    pathCounts.set(v.path, (pathCounts.get(v.path) ?? 0) + 1);
    const ref = v.referrer ? new URL(v.referrer, "http://x").host || "direct" : "direct";
    refCounts.set(ref, (refCounts.get(ref) ?? 0) + 1);
  }
  const sortDesc = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([label, count]) => ({ label, count }));

  return {
    stats: {
      totalViews: views.length,
      uniqueVisitors: new Set(views.map((v: any) => v.session_id).filter(Boolean)).size,
      viewsToday: views.filter((v: any) => dayKey(v.created_at) === todayKey).length,
      visitorsToday: new Set(
        views.filter((v: any) => dayKey(v.created_at) === todayKey).map((v: any) => v.session_id).filter(Boolean),
      ).size,
    },
    daily,
    topPages: sortDesc(pathCounts),
    topReferrers: sortDesc(refCounts),
    recent: views.slice(0, 25),
  };
});
