import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ClipboardList, LogOut, Package, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ORDER_STATUSES,
  artisanStatusClasses,
  mockPortal,
  orderStatusClasses,
  useMockPortal,
  type OrderStatus,
} from "@/lib/mock-portal";

const ADMIN_USERNAME = "Roben Mawuwa";
const ADMIN_PASSWORD = "roben@1234";

export const Route = createFileRoute("/portals/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal Preview — SAFIA Africa" },
      {
        name: "description",
        content: "Preview of the SAFIA Africa admin portal: review artisan requests and track order statuses.",
      },
      { property: "og:title", content: "Admin Portal Preview — SAFIA Africa" },
      {
        property: "og:description",
        content: "Review artisan requests and update order tracking statuses in the SAFIA Africa admin preview.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPreviewPortal,
});

function AdminPreviewPortal() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<"requests" | "orders">("requests");

  if (!authed) return <AdminLogin onAuthed={() => setAuthed(true)} />;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-luxe text-gold">Admin Portal — Preview</p>
          <h1 className="mt-2 font-display text-3xl">Welcome, {ADMIN_USERNAME}</h1>
        </div>
        <Button variant="outline" onClick={() => setAuthed(false)}>
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </div>

      <nav className="mt-8 flex flex-wrap gap-1.5 border-b border-border pb-3">
        {([
          ["requests", "Requests", ClipboardList],
          ["orders", "Orders", Package],
        ] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] tracking-luxe transition-colors ${
              view === id
                ? "bg-sunset text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-gold"
            }`}
          >
            <Icon className="size-3.5" /> {label}
          </button>
        ))}
      </nav>

      <div className="mt-8">{view === "requests" ? <RequestsView /> : <OrdersView />}</div>

      <p className="mt-8 text-[11px] text-muted-foreground">
        Artisan side:{" "}
        <Link to="/portals/artisan" className="text-gold hover:underline">
          open the artisan preview
        </Link>
      </p>
    </div>
  );
}

function AdminLogin({ onAuthed }: { onAuthed: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="mx-auto max-w-md px-5 py-16 lg:px-10">
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-5 text-gold" />
        <p className="text-[10px] tracking-luxe text-gold">Admin Portal — Preview</p>
      </div>
      <h1 className="mt-3 font-display text-3xl">Restricted access</h1>
      <Card className="mt-7 p-5 sm:p-7">
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>Those credentials are not recognised.</span>
          </div>
        )}
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
              setError(false);
              onAuthed();
            } else {
              setError(true);
            }
          }}
        >
          <div>
            <Label className="text-[11px] tracking-luxe text-muted-foreground">Username</Label>
            <Input className="mt-2" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <Label className="text-[11px] tracking-luxe text-muted-foreground">Password</Label>
            <Input
              className="mt-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Sign in</Button>
        </form>
      </Card>
    </div>
  );
}

function RequestsView() {
  const { artisans } = useMockPortal();
  const pending = artisans.filter((a) => a.status === "Pending");
  const decided = artisans.filter((a) => a.status !== "Pending");

  return (
    <div className="grid gap-5">
      <h2 className="font-display text-xl">Pending artisan requests ({pending.length})</h2>
      {pending.length === 0 && (
        <Card className="p-6 text-sm text-muted-foreground">No requests awaiting review.</Card>
      )}
      {pending.map((a) => (
        <Card key={a.id} className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            {a.profilePhoto ? (
              <img
                src={a.profilePhoto}
                alt={a.fullName}
                className="size-20 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-secondary text-gold">
                <UserRound className="size-7" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg">{a.fullName}</h3>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] tracking-luxe ${artisanStatusClasses(a.status)}`}
                >
                  {a.status}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{a.email}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {a.biography || "No biography provided."}
              </p>

              {a.gallery.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {a.gallery.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${a.fullName} artwork ${i + 1}`}
                      className="aspect-square w-full rounded-lg border border-border object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    mockPortal.setArtisanStatus(a.id, "Approved");
                    toast.success("Success: Email notification dispatched to artisan marking approval.");
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    mockPortal.setArtisanStatus(a.id, "Dismissed");
                    toast("Notification email dispatched marking dismissal.");
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {decided.length > 0 && (
        <>
          <h2 className="mt-4 font-display text-xl">Reviewed</h2>
          <Card className="divide-y divide-border">
            {decided.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm">{a.fullName}</p>
                  <p className="text-[11px] text-muted-foreground">{a.email}</p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] tracking-luxe ${artisanStatusClasses(a.status)}`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}

function OrdersView() {
  const { orders } = useMockPortal();

  return (
    <div>
      <h2 className="font-display text-xl">Orders ({orders.length})</h2>

      <div className="mt-5 hidden overflow-x-auto rounded-xl border border-border lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/60 text-[10px] uppercase tracking-luxe text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Origin</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 text-gold">{o.reference}</td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.item}</td>
                <td className="px-4 py-3">
                  <OriginTag origin={o.origin} />
                </td>
                <td className="px-4 py-3">{o.total.toLocaleString()} RWF</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3">
                  <StatusSelect id={o.id} status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 lg:hidden">
        {orders.map((o) => (
          <Card key={o.id} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gold">{o.reference}</span>
              <StatusBadge status={o.status} />
            </div>
            <p className="mt-2 text-sm">{o.item}</p>
            <p className="text-[11px] text-muted-foreground">
              {o.customer} · {o.total.toLocaleString()} RWF
            </p>
            <div className="mt-3">
              <OriginTag origin={o.origin} />
            </div>
            <div className="mt-4">
              <StatusSelect id={o.id} status={o.status} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OriginTag({ origin }: { origin: "Artisan's Art" | "Company Stock" }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] tracking-luxe ${
        origin === "Artisan's Art"
          ? "border-gold/40 bg-gold/10 text-gold"
          : "border-border bg-secondary text-muted-foreground"
      }`}
    >
      {origin}
    </span>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] tracking-luxe ${orderStatusClasses(status)}`}
    >
      {status}
    </span>
  );
}

function StatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  return (
    <select
      value={status}
      onChange={(e) => mockPortal.setOrderStatus(id, e.target.value as OrderStatus)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-gold lg:w-auto"
      aria-label={`Update status for order ${id}`}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
