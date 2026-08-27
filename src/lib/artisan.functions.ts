import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

type ArtisanSession = { artisanId?: string };

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "safia-artisan",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function hash(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

async function requireArtisan() {
  const session = await useSession<ArtisanSession>(sessionConfig());
  if (!session.data.artisanId) throw new Error("UNAUTHORIZED");
  return session;
}

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** 50% artisan / 50% platform split of net profit. */
export const COMMISSION_RATE = 0.5;
export function splitCommission(gross: number) {
  const artisanShare = Math.round(gross * COMMISSION_RATE);
  return { artisanShare, platformShare: Math.max(0, Math.round(gross) - artisanShare) };
}

// ── Auth ────────────────────────────────────────────────────────────────────
export const artisanRegister = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        phone: z.string().trim().min(6).max(40),
        fullName: z.string().trim().min(2).max(120),
        password: z.string().min(6).max(200),
        bio: z.string().max(2000).optional().default(""),
        photoUrl: z.string().max(1000).optional().default(""),
        location: z.string().trim().max(160).optional().default(""),
        skills: z.array(z.string().max(80)).max(20).optional().default([]),
        yearsExperience: z.number().int().min(0).max(90).optional().default(0),
        socialLinks: z.record(z.string(), z.string().max(300)).optional().default({}),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = await getAdmin();
    const { data: existing } = await supabase
      .from("artisans")
      .select("id")
      .eq("email", data.email.toLowerCase())
      .maybeSingle();
    if (existing) throw new Error("An artisan with this email already exists.");

    const insert = {
      email: data.email.toLowerCase(),
      phone: data.phone,
      full_name: data.fullName,
      password_hash: hash(data.password),
      bio: data.bio || null,
      photo_url: data.photoUrl || null,
      location: data.location || null,
      skills: data.skills,
      years_experience: data.yearsExperience,
      social_links: data.socialLinks,
      status: "pending",
      verified: false,
    };
    const { data: row, error } = await supabase
      .from("artisans")
      .insert(insert)
      .select("id")
      .single();
    if (error) throw new Error("Could not create your artisan account.");
    return { ok: true as const, id: row!.id };
  });

export const artisanLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ email: z.string().trim().email(), password: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = await getAdmin();
    const { data: artisan } = await supabase
      .from("artisans")
      .select("id, email, password_hash, status, full_name")
      .eq("email", data.email.toLowerCase())
      .maybeSingle();
    if (!artisan || !matches(data.password, artisan.password_hash)) {
      return { ok: false as const };
    }
    if (artisan.status === "suspended") throw new Error("Your artisan account is suspended.");
    const session = await useSession<ArtisanSession>(sessionConfig());
    await session.update({ artisanId: artisan.id });
    return { ok: true as const, status: artisan.status };
  });

export const artisanLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<ArtisanSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const artisanSessionStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<ArtisanSession>(sessionConfig());
  if (!session.data.artisanId) return { authenticated: false as const };
  const supabase = await getAdmin();
  const { data: artisan } = await supabase
    .from("artisans")
    .select("id, full_name, email, status, photo_url, location")
    .eq("id", session.data.artisanId)
    .maybeSingle();
  if (!artisan) return { authenticated: false as const };
  return { authenticated: true as const, artisan };
});

// ── Profile ──────────────────────────────────────────────────────────────────
export const artisanGetProfile = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireArtisan();
  const supabase = await getAdmin();
  const { data, error } = await supabase
    .from("artisans")
    .select("*")
    .eq("id", session.data.artisanId!)
    .maybeSingle();
  if (error) throw new Error("Could not load your profile.");
  return { profile: data };
});

export const artisanUpdateProfile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        fullName: z.string().trim().min(2).max(120),
        bio: z.string().max(2000).optional().default(""),
        photoUrl: z.string().max(1000).optional().default(""),
        location: z.string().trim().max(160).optional().default(""),
        skills: z.array(z.string().max(80)).max(20).optional().default([]),
        yearsExperience: z.number().int().min(0).max(90).optional().default(0),
        socialLinks: z.record(z.string(), z.string().max(300)).optional().default({}),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const session = await requireArtisan();
    const supabase = await getAdmin();
  const { error } = await supabase
    .from("artisans")
    .update({
      full_name: data.fullName,
      bio: data.bio || null,
      photo_url: data.photoUrl || null,
      location: data.location || null,
      skills: data.skills,
      years_experience: data.yearsExperience,
      social_links: data.socialLinks,
    })
    .eq("id", session.data.artisanId!);
    if (error) throw new Error("Could not update your profile.");
    return { ok: true as const };
  });

// ── Products ──────────────────────────────────────────────────────────────────
const productInput = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().max(4000).optional().default(""),
  images: z.array(z.string().max(2000)).max(12).optional().default([]),
  dimensions: z.string().trim().max(120).optional().default(""),
  materials: z.string().trim().max(200).optional().default(""),
  frameType: z.string().trim().max(120).optional().default(""),
  designStyle: z.string().trim().max(120).optional().default(""),
  price: z.number().min(0).max(100_000_000),
  inventory: z.number().int().min(0).max(1_000_000).optional().default(0),
});

export const artisanListProducts = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireArtisan();
  const supabase = await getAdmin();
  const { data, error } = await supabase
    .from("artisan_products")
    .select("*")
    .eq("artisan_id", session.data.artisanId!)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load your products.");
  return { products: data ?? [] };
});

export const artisanCreateProduct = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => productInput.parse(data))
  .handler(async ({ data }) => {
    const session = await requireArtisan();
    const supabase = await getAdmin();
    const { error } = await supabase.from("artisan_products").insert({
      artisan_id: session.data.artisanId!,
      name: data.name,
      description: data.description || null,
      images: data.images,
      dimensions: data.dimensions || null,
      materials: data.materials || null,
      frame_type: data.frameType || null,
      design_style: data.designStyle || null,
      price: data.price,
      inventory: data.inventory,
      status: "pending",
    });
    if (error) throw new Error("Could not create the product.");
    return { ok: true as const };
  });

export const artisanUpdateProduct = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), ...productInput.shape }).parse(data),
  )
  .handler(async ({ data }) => {
    const session = await requireArtisan();
    const supabase = await getAdmin();
    const { error } = await supabase
      .from("artisan_products")
      .update({
        name: data.name,
        description: data.description || null,
        images: data.images,
        dimensions: data.dimensions || null,
        materials: data.materials || null,
        frame_type: data.frameType || null,
        design_style: data.designStyle || null,
        price: data.price,
        inventory: data.inventory,
      })
      .eq("id", data.id)
      .eq("artisan_id", session.data.artisanId!);
    if (error) throw new Error("Could not update the product.");
    return { ok: true as const };
  });

export const artisanDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const session = await requireArtisan();
    const supabase = await getAdmin();
    const { error } = await supabase
      .from("artisan_products")
      .delete()
      .eq("id", data.id)
      .eq("artisan_id", session.data.artisanId!);
    if (error) throw new Error("Could not delete the product.");
    return { ok: true as const };
  });

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const artisanDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireArtisan();
  const supabase = await getAdmin();
  const aid = session.data.artisanId!;

  const { data: products } = await supabase
    .from("artisan_products")
    .select("id, status, views, likes")
    .eq("artisan_id", aid);
  const { data: commissions } = await supabase
    .from("commissions")
    .select("id, gross, artisan_share, status, created_at")
    .eq("artisan_id", aid)
    .order("created_at", { ascending: true });

  const list = products ?? [];
  const comms = commissions ?? [];

  const totalProducts = list.length;
  const activeProducts = list.filter((p: any) => p.status === "active").length;
  const pendingProducts = list.filter((p: any) => p.status === "pending").length;
  const totalOrders = comms.length;
  const totalSales = comms.reduce((s: number, c: any) => s + Number(c.gross ?? 0), 0);
  const commissionEarned = comms.reduce((s: number, c: any) => s + Number(c.artisan_share ?? 0), 0);
  const productViews = list.reduce((s: number, p: any) => s + Number(p.views ?? 0), 0);
  const productLikes = list.reduce((s: number, p: any) => s + Number(p.likes ?? 0), 0);

  // Monthly revenue (last 12 months) from artisan share.
  const months: { label: string; revenue: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en", { month: "short" });
    const revenue = comms
      .filter((c: any) => {
        const cd = new Date(c.created_at);
        return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
      })
      .reduce((s: number, c: any) => s + Number(c.artisan_share ?? 0), 0);
    months.push({ label, revenue });
  }

  return {
    stats: {
      totalProducts,
      activeProducts,
      pendingProducts,
      totalOrders,
      totalSales,
      commissionEarned,
      monthlyRevenue: months[months.length - 1]?.revenue ?? 0,
      productViews,
      productLikes,
      customerMessages: 0,
    },
    revenueSeries: months,
  };
});

// ── Earnings & withdrawals ─────────────────────────────────────────────────────
export const artisanEarnings = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireArtisan();
  const supabase = await getAdmin();
  const aid = session.data.artisanId!;

  const { data: commissions } = await supabase
    .from("commissions")
    .select("id, order_number, gross, artisan_share, platform_share, status, created_at")
    .eq("artisan_id", aid)
    .order("created_at", { ascending: false })
    .limit(200);
  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("id, amount, status, created_at")
    .eq("artisan_id", aid)
    .order("created_at", { ascending: false })
    .limit(100);

  const comms = commissions ?? [];
  const totalEarnings = comms.reduce((s: number, c: any) => s + Number(c.artisan_share ?? 0), 0);
  const pendingEarnings = comms
    .filter((c: any) => c.status === "pending")
    .reduce((s: number, c: any) => s + Number(c.artisan_share ?? 0), 0);
  const paidEarnings = comms
    .filter((c: any) => c.status === "paid")
    .reduce((s: number, c: any) => s + Number(c.artisan_share ?? 0), 0);

  return {
    commissions: comms,
    withdrawals: withdrawals ?? [],
    summary: { totalEarnings, pendingEarnings, paidEarnings },
  };
});

export const artisanRequestWithdrawal = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ amount: z.number().min(1000).max(1_000_000_000) }).parse(data),
  )
  .handler(async ({ data }) => {
    const session = await requireArtisan();
    const supabase = await getAdmin();
    const { error } = await supabase.from("withdrawals").insert({
      artisan_id: session.data.artisanId!,
      amount: data.amount,
      status: "pending",
    });
    if (error) throw new Error("Could not submit your withdrawal request.");
    return { ok: true as const };
  });

// ── Advertising analytics ─────────────────────────────────────────────────────
export const artisanAdvertising = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireArtisan();
  const supabase = await getAdmin();
  const aid = session.data.artisanId!;

  const { data: products } = await supabase
    .from("artisan_products")
    .select("id, name, status, featured, views, likes, images")
    .eq("artisan_id", aid)
    .order("views", { ascending: false });
  const { data: artisan } = await supabase
    .from("artisans")
    .select("featured, status")
    .eq("id", aid)
    .maybeSingle();

  const list = products ?? [];
  const impressions = list.reduce((s: number, p: any) => s + Number(p.views ?? 0), 0);
  const clicks = list.reduce((s: number, p: any) => s + Math.round(Number(p.likes ?? 0) * 1.5), 0);
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  return {
    featuredArtisan: artisan?.featured ?? false,
    stats: {
      impressions,
      clicks,
      ctr: Math.round(ctr * 10) / 10,
      engagement: list.reduce((s: number, p: any) => s + Number(p.likes ?? 0), 0),
    },
    topProducts: list.slice(0, 6),
    trending: [...list].sort((a: any, b: any) => Number(b.views ?? 0) - Number(a.views ?? 0)).slice(0, 5),
  };
});
