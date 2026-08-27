import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CheckCircle2,
  Loader2,
  LogOut,
  ShieldCheck,
  Star,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRWF } from "@/data/catalog";
import { adminLogin, adminLogout, adminSessionStatus, listOrders, updateOrderStatus } from "@/lib/admin.functions";
import {
  adminFeatureArtisan,
  adminFeatureProduct,
  adminListArtisans,
  adminListProducts,
  adminListWithdrawals,
  adminOverview,
  adminProcessWithdrawal,
  adminRecordSale,
  adminSetArtisanStatus,
  adminSetProductStatus,
} from "@/lib/admin-portal.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — SAFIA Africa" },
      {
        name: "description",
        content: "Private SAFIA Africa admin console: orders, artisans, products and platform management.",
      },
      { property: "og:title", content: "SAFIA Africa Admin Console" },
      { property: "og:description", content: "Internal management for SAFIA Africa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
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
  "Cancelled",
] as const;

type Tab = "overview" | "orders" | "artisans" | "products" | "withdrawals";

function Admin() {
  const qc = useQueryClient();
  const session = useQuery({ queryKey: ["admin-session"], queryFn: () => adminSessionStatus() });

  if (session.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-gold" />
      </div>
    );
  }

  return session.data?.authenticated === true ? (
    <Dashboard onSignedOut={() => qc.invalidateQueries()} />
  ) : (
    <LoginCard onSignedIn={() => qc.invalidateQueries()} />
  );
}

function LoginCard({ onSignedIn }: { onSignedIn: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: () => adminLogin({ data: { username, password } }),
    onSuccess: (res) => {
      if (res.ok) onSignedIn();
      else toast.error("Incorrect username or password.");
    },
    onError: () => toast.error("Sign-in is unavailable right now."),
  });

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-24">
      <div className="rounded-xl border border-border bg-card/40 p-8 shadow-luxe">
        <ShieldCheck className="size-6 text-gold" />
        <p className="mt-5 text-[10px] tracking-luxe text-gold">Restricted</p>
        <h1 className="mt-2 font-display text-3xl">Admin console</h1>
        <p className="mt-3 text-xs text-muted-foreground">Sign in to manage SAFIA Africa.</p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (username && password) login.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label className="text-[10px] tracking-luxe text-muted-foreground">Username</Label>
            <Input value={username} autoComplete="username" onChange={(e) => setUsername(e.target.value)} className="border-input bg-secondary/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] tracking-luxe text-muted-foreground">Password</Label>
            <Input type="password" value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} className="border-input bg-secondary/50" />
          </div>
          <Button type="submit" disabled={login.isPending || !username || !password} className="w-full bg-sunset text-primary-foreground">
            {login.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </div>
    </section>
  );
}

function Dashboard({ onSignedOut }: { onSignedOut: () => void }) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");
  const logout = useMutation({ mutationFn: () => adminLogout(), onSuccess: onSignedOut });

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-luxe text-gold">Admin console</p>
          <h1 className="mt-3 font-display text-4xl">Platform management</h1>
        </div>
        <Button variant="outline" onClick={() => logout.mutate()}>
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </div>

      <nav className="mt-8 flex flex-wrap gap-1.5 border-b border-border pb-3">
        {([
          ["overview", "Overview"],
          ["orders", "Orders"],
          ["artisans", "Artisans"],
          ["products", "Products"],
          ["withdrawals", "Withdrawals"],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-1.5 text-[11px] tracking-luxe transition-colors ${
              tab === id ? "bg-sunset text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-gold"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "overview" && <OverviewTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "artisans" && <ArtisansTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "withdrawals" && <WithdrawalsTab />}
      </div>
    </section>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function OverviewTab() {
  const q = useQuery({ queryKey: ["admin-overview"], queryFn: () => adminOverview() });
  if (q.isLoading) return <Spinner />;
  if (q.isError) return <ErrorBox />;

  const s = q.data!.stats;
  const cards = [
    { label: "Total Revenue", value: formatRWF(s.totalRevenue) },
    { label: "Total Orders", value: String(s.totalOrders) },
    { label: "Total Customers", value: String(s.totalCustomers) },
    { label: "Total Artisans", value: String(s.totalArtisans) },
    { label: "Active Artisans", value: String(s.activeArtisans) },
    { label: "Pending Orders", value: String(s.pendingOrders) },
    { label: "Completed Orders", value: String(s.completedOrders) },
    { label: "Active Products", value: String(s.activeProducts) },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Stat key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card/40 p-6">
        <p className="text-[10px] tracking-luxe text-gold">Sales trend</p>
        <h3 className="mt-1 font-display text-2xl">Revenue over the last 12 months</h3>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={q.data!.salesTrend}>
              <defs>
                <linearGradient id="adm-rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a227" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#c9a227" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v: number) => formatRWF(v)} contentStyle={{ background: "#1b1b1f", border: "1px solid #333" }} />
              <Area type="monotone" dataKey="revenue" stroke="#c9a227" fill="url(#adm-rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Orders ────────────────────────────────────────────────────────────────────
function OrdersTab() {
  const qc = useQueryClient();
  const orders = useQuery({ queryKey: ["admin-orders"], queryFn: () => listOrders() });
  const [q, setQ] = useState("");

  const setStatus = useMutation({
    mutationFn: (vars: { id: string; status: (typeof STATUSES)[number] }) => updateOrderStatus({ data: vars }),
    onSuccess: () => {
      toast.success("Order status updated.");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: () => toast.error("Could not update that order."),
  });

  if (orders.isLoading) return <Spinner />;
  if (orders.isError) return <ErrorBox />;

  const all = orders.data?.orders ?? [];
  const stats = orders.data?.stats;
  const rows = q
    ? all.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q.toLowerCase()) ||
          o.customer_name.toLowerCase().includes(q.toLowerCase()) ||
          o.email.toLowerCase().includes(q.toLowerCase()),
      )
    : all;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total orders" value={String(stats?.count ?? 0)} />
        <Stat label="Pending" value={String(stats?.pending ?? 0)} />
        <Stat label="Pieces ordered" value={String(stats?.pieces ?? 0)} />
        <Stat label="Order value" value={formatRWF(stats?.revenue ?? 0)} />
      </div>

      <Input
        placeholder="Search order number, customer or email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-md border-input bg-secondary/50"
      />

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders match.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-card/60 text-[10px] tracking-luxe text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Artwork</th>
                <th className="px-4 py-3">Size / Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((o) => (
                <tr key={o.id} className="align-top">
                  <td className="px-4 py-4 text-gold">{o.order_number}</td>
                  <td className="px-4 py-4">
                    <p>{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{o.email}</p>
                    <p className="text-xs text-muted-foreground">{o.phone} · {o.country}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p>{o.product_name}</p>
                    <p className="text-xs text-muted-foreground">{o.collection}</p>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{o.size_code} · ×{o.quantity}</td>
                  <td className="px-4 py-4">{formatRWF(Number(o.total))}</td>
                  <td className="px-4 py-4 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <select
                      value={o.status}
                      disabled={setStatus.isPending}
                      onChange={(e) => setStatus.mutate({ id: o.id, status: e.target.value as (typeof STATUSES)[number] })}
                      className="rounded-md border border-input bg-secondary/50 px-2 py-1.5 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Artisans ──────────────────────────────────────────────────────────────────
function ArtisansTab() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-artisans"], queryFn: () => adminListArtisans() });
  const [saleFor, setSaleFor] = useState<string | null>(null);
  const [gross, setGross] = useState("");

  const statusMut = useMutation({
    mutationFn: (vars: { id: string; status: "approved" | "rejected" | "suspended" | "pending" }) =>
      adminSetArtisanStatus({ data: vars }),
    onSuccess: () => {
      toast.success("Artisan updated");
      qc.invalidateQueries({ queryKey: ["admin-artisans"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const featureMut = useMutation({
    mutationFn: (vars: { id: string; featured: boolean }) => adminFeatureArtisan({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-artisans"] }),
  });
  const saleMut = useMutation({
    mutationFn: (vars: { artisanId: string; gross: number }) =>
      adminRecordSale({ data: { artisanId: vars.artisanId, gross: vars.gross } }),
    onSuccess: (res) => {
      toast.success(`Sale recorded · artisan ${formatRWF(res.artisanShare)}`);
      setSaleFor(null);
      setGross("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isLoading) return <Spinner />;
  if (q.isError) return <ErrorBox />;

  const artisans = q.data!.artisans ?? [];
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl">Artisan management</h2>
      {artisans.length === 0 ? (
        <p className="text-sm text-muted-foreground">No artisans registered yet. The Artisan Portal lives at <a className="text-gold" href="/artisan">/artisan</a>.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-card/40 text-[10px] tracking-luxe text-muted-foreground">
              <tr>
                <th className="p-3">Artisan</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Featured</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artisans.map((a: any) => (
                <tr key={a.id} className="border-t border-border align-top">
                  <td className="p-3">
                    <p className="font-medium">{a.full_name}</p>
                    <p className="text-xs text-muted-foreground">{a.email} · {a.phone ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">Exp: {a.years_experience ?? 0} yrs</p>
                  </td>
                  <td className="p-3 text-muted-foreground">{a.location || "—"}</td>
                  <td className="p-3"><StatusPill status={a.status} /></td>
                  <td className="p-3">
                    <button
                      onClick={() => featureMut.mutate({ id: a.id, featured: !a.featured })}
                      className={a.featured ? "text-gold" : "text-muted-foreground hover:text-gold"}
                    >
                      <Star className={`size-4 ${a.featured ? "fill-current" : ""}`} />
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {a.status !== "approved" && (
                        <MiniBtn onClick={() => statusMut.mutate({ id: a.id, status: "approved" })} icon={<CheckCircle2 className="size-3.5" />}>Approve</MiniBtn>
                      )}
                      {a.status !== "suspended" && (
                        <MiniBtn onClick={() => statusMut.mutate({ id: a.id, status: "suspended" })}>Suspend</MiniBtn>
                      )}
                      <MiniBtn onClick={() => { setSaleFor(saleFor === a.id ? null : a.id); setGross(""); }}>Record sale</MiniBtn>
                    </div>
                    {saleFor === a.id && (
                      <div className="mt-2 flex justify-end gap-2">
                        <Input type="number" min={0} placeholder="Gross RWF" value={gross} onChange={(e) => setGross(e.target.value)} className="w-32 border-input bg-secondary/50 text-xs" />
                        <Button size="sm" className="bg-sunset text-primary-foreground" disabled={!gross || saleMut.isPending} onClick={() => saleMut.mutate({ artisanId: a.id, gross: Number(gross) })}>
                          Save
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Products ──────────────────────────────────────────────────────────────────
function ProductsTab() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-products"], queryFn: () => adminListProducts() });
  const statusMut = useMutation({
    mutationFn: (vars: { id: string; status: "active" | "rejected" | "pending" }) => adminSetProductStatus({ data: vars }),
    onSuccess: () => {
      toast.success("Product updated");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const featureMut = useMutation({
    mutationFn: (vars: { id: string; featured: boolean }) => adminFeatureProduct({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  if (q.isLoading) return <Spinner />;
  if (q.isError) return <ErrorBox />;

  const products = q.data!.products ?? [];
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl">Product management</h2>
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">No artisan products submitted yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-card/40 text-[10px] tracking-luxe text-muted-foreground">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Artisan</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Featured</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.artisan?.full_name ?? "—"}</td>
                  <td className="p-3 text-gold">{formatRWF(Number(p.price))}</td>
                  <td className="p-3"><StatusPill status={p.status} /></td>
                  <td className="p-3">
                    <button onClick={() => featureMut.mutate({ id: p.id, featured: !p.featured })} className={p.featured ? "text-gold" : "text-muted-foreground hover:text-gold"}>
                      <Star className={`size-4 ${p.featured ? "fill-current" : ""}`} />
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1.5">
                      {p.status !== "active" && (
                        <MiniBtn onClick={() => statusMut.mutate({ id: p.id, status: "active" })} icon={<CheckCircle2 className="size-3.5" />}>Approve</MiniBtn>
                      )}
                      {p.status !== "rejected" && (
                        <MiniBtn onClick={() => statusMut.mutate({ id: p.id, status: "rejected" })} icon={<XCircle className="size-3.5" />}>Reject</MiniBtn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Withdrawals ─────────────────────────────────────────────────────────────────
function WithdrawalsTab() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-withdrawals"], queryFn: () => adminListWithdrawals() });
  const mut = useMutation({
    mutationFn: (vars: { id: string; status: "approved" | "paid" | "rejected" }) =>
      adminProcessWithdrawal({ data: vars }),
    onSuccess: () => {
      toast.success("Withdrawal updated");
      qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isLoading) return <Spinner />;
  if (q.isError) return <ErrorBox />;

  const rows = q.data!.withdrawals ?? [];
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl">Withdrawal requests</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No withdrawal requests.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-card/40 text-[10px] tracking-luxe text-muted-foreground">
              <tr>
                <th className="p-3">Artisan</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((w: any) => (
                <tr key={w.id} className="border-t border-border">
                  <td className="p-3">{w.artisan?.full_name ?? "—"}</td>
                  <td className="p-3 text-gold">{formatRWF(Number(w.amount))}</td>
                  <td className="p-3"><StatusPill status={w.status} /></td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1.5">
                      {w.status === "pending" && (
                        <>
                          <MiniBtn onClick={() => mut.mutate({ id: w.id, status: "approved" })}>Approve</MiniBtn>
                          <MiniBtn onClick={() => mut.mutate({ id: w.id, status: "rejected" })} icon={<XCircle className="size-3.5" />}>Reject</MiniBtn>
                        </>
                      )}
                      {w.status === "approved" && (
                        <MiniBtn onClick={() => mut.mutate({ id: w.id, status: "paid" })} icon={<CheckCircle2 className="size-3.5" />}>Mark paid</MiniBtn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-6">
      <p className="text-[10px] tracking-luxe text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-3xl text-gradient-sunset">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-300",
    active: "bg-emerald-500/15 text-emerald-300",
    approved: "bg-emerald-500/15 text-emerald-300",
    paid: "bg-emerald-500/15 text-emerald-300",
    rejected: "bg-red-500/15 text-red-300",
    suspended: "bg-red-500/15 text-red-300",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-luxe capitalize ${map[status] ?? "bg-secondary text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function MiniBtn({ children, onClick, icon }: { children: React.ReactNode; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[10px] tracking-luxe text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
    >
      {icon}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <Loader2 className="size-5 animate-spin text-gold" />
    </div>
  );
}
function ErrorBox() {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-300">
      Could not load this section. Make sure the artisan portal migration has been run in Supabase and the service-role key is set.
    </div>
  );
}
