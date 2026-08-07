import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRWF } from "@/data/catalog";
import { adminLogin, adminLogout, adminSessionStatus, listOrders, updateOrderStatus } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — SAFIA Africa Orders" },
      {
        name: "description",
        content: "Private SAFIA Africa admin console for reviewing and updating customer orders.",
      },
      { property: "og:title", content: "SAFIA Africa Admin Console" },
      { property: "og:description", content: "Internal order management for SAFIA Africa." },
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

function Admin() {
  const qc = useQueryClient();
  const session = useQuery({ queryKey: ["admin-session"], queryFn: () => adminSessionStatus() });

  const authed = session.data?.authenticated === true;

  if (session.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-gold" />
      </div>
    );
  }

  return authed ? <Dashboard onSignedOut={() => qc.invalidateQueries()} /> : <LoginCard onSignedIn={() => qc.invalidateQueries()} />;
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
        <p className="mt-3 text-xs text-muted-foreground">
          Sign in to review SAFIA Africa orders.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (username && password) login.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label className="text-[10px] tracking-luxe text-muted-foreground">Username</Label>
            <Input
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              className="border-input bg-secondary/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] tracking-luxe text-muted-foreground">Password</Label>
            <Input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="border-input bg-secondary/50"
            />
          </div>
          <Button
            type="submit"
            disabled={login.isPending || !username || !password}
            className="w-full bg-sunset text-primary-foreground"
          >
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
  const orders = useQuery({ queryKey: ["admin-orders"], queryFn: () => listOrders() });

  const logout = useMutation({
    mutationFn: () => adminLogout(),
    onSuccess: onSignedOut,
  });

  const setStatus = useMutation({
    mutationFn: (vars: { id: string; status: (typeof STATUSES)[number] }) =>
      updateOrderStatus({ data: vars }),
    onSuccess: () => {
      toast.success("Order status updated.");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: () => toast.error("Could not update that order."),
  });

  const stats = orders.data?.stats;

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-luxe text-gold">Admin console</p>
          <h1 className="mt-3 font-display text-4xl">Orders overview</h1>
        </div>
        <Button variant="outline" onClick={() => logout.mutate()}>
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total orders" value={stats ? String(stats.count) : "—"} />
        <Stat label="Pending" value={stats ? String(stats.pending) : "—"} />
        <Stat label="Pieces ordered" value={stats ? String(stats.pieces) : "—"} />
        <Stat label="Order value" value={stats ? formatRWF(stats.revenue) : "—"} />
      </div>

      {orders.isLoading && (
        <div className="mt-16 flex justify-center">
          <Loader2 className="size-5 animate-spin text-gold" />
        </div>
      )}

      {orders.isError && (
        <p className="mt-12 text-sm text-destructive">Could not load orders. Please refresh.</p>
      )}

      {orders.data && orders.data.orders.length === 0 && (
        <p className="mt-12 text-sm text-muted-foreground">No orders have been placed yet.</p>
      )}

      {orders.data && orders.data.orders.length > 0 && (
        <div className="mt-12 overflow-x-auto rounded-xl border border-border">
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
              {orders.data.orders.map((o) => (
                <tr key={o.id} className="align-top">
                  <td className="px-4 py-4 text-gold">{o.order_number}</td>
                  <td className="px-4 py-4">
                    <p>{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{o.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.phone} · {o.country}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p>{o.product_name}</p>
                    <p className="text-xs text-muted-foreground">{o.collection}</p>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {o.size_code} · ×{o.quantity}
                  </td>
                  <td className="px-4 py-4">{formatRWF(Number(o.total))}</td>
                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={o.status}
                      disabled={setStatus.isPending}
                      onChange={(e) =>
                        setStatus.mutate({
                          id: o.id,
                          status: e.target.value as (typeof STATUSES)[number],
                        })
                      }
                      className="rounded-md border border-input bg-secondary/50 px-2 py-1.5 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-6">
      <p className="text-[10px] tracking-luxe text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-3xl text-gradient-sunset">{value}</p>
    </div>
  );
}
