import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Boxes,
  CheckCircle2,
  Eye,
  Heart,
  Image as ImageIcon,
  Loader2,
  LogOut,
  LogIn,
  Package,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatRWF } from "@/data/catalog";
import { useLocale } from "@/lib/locale";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import {
  artisanAdvertising,
  artisanCreateProduct,
  artisanDashboard,
  artisanDeleteProduct,
  artisanEarnings,
  artisanGetProfile,
  artisanListProducts,
  artisanLogin,
  artisanLogout,
  artisanOAuthSync,
  artisanRegister,
  artisanRequestWithdrawal,
  artisanSessionStatus,
  artisanUpdateProduct,
  artisanUpdateProfile,
  artisanUploadArtwork,
  artisanUploadProfilePhoto,
  artisanUploadGalleryImage,
  artisanRegistrationUpload,
} from "@/lib/artisan.functions";
import { Checkbox } from "@/components/ui/checkbox";


export const Route = createFileRoute("/artisan")({
  head: () => ({
    meta: [
      { title: "Artisan Portal — SAFIA Africa" },
      {
        name: "description",
        content: "Artisan portal for SAFIA Africa artisans: manage products, track earnings and commissions.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ArtisanPortal,
});

type Tab = "dashboard" | "products" | "earnings" | "advertising" | "profile";

function ArtisanPortal() {
  const qc = useQueryClient();
  const { t } = useLocale();
  const session = useQuery({ queryKey: ["artisan-session"], queryFn: () => artisanSessionStatus() });
  const [tab, setTab] = useState<Tab>("dashboard");

  if (session.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-gold" />
      </div>
    );
  }

  const authed = session.data?.authenticated === true;
  if (!authed) return <AuthScreen onSignedIn={() => qc.invalidateQueries()} />;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-luxe text-gold">Artisan Portal</p>
          <h1 className="mt-2 font-display text-3xl">
            {t("portal.welcome")}, {session.data?.artisan?.full_name ?? "Artisan"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Status: <span className="text-gold">{session.data?.artisan?.status ?? "pending"}</span>
          </p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await artisanLogout();
            qc.invalidateQueries();
          }}
        >
          <LogOut className="mr-2 size-4" /> {t("portal.signout")}
        </Button>
      </div>

      <nav className="mt-8 flex flex-wrap gap-1.5 border-b border-border pb-3">
        {([
          ["dashboard", t("portal.dashboard")],
          ["products", t("portal.products")],
          ["earnings", t("portal.earnings")],
          ["advertising", t("portal.advertising")],
          ["profile", t("portal.profile")],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-1.5 text-[11px] tracking-luxe transition-colors ${
              tab === id
                ? "bg-sunset text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-gold"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "earnings" && <EarningsTab />}
        {tab === "advertising" && <AdvertisingTab />}
        {tab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function AuthScreen({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<"login" | "request">("login");
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <p className="text-center text-[10px] tracking-luxe text-gold">Artisan Portal</p>
      <h1 className="mt-3 text-center font-display text-4xl">Join the SAFIA atelier.</h1>

      <GoogleSignIn onSignedIn={onSignedIn} />

      <div className="mt-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-luxe text-muted-foreground">or use email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {(["login", "request"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-5 py-2 text-[11px] tracking-luxe capitalize transition-colors ${
              mode === m ? "bg-sunset text-primary-foreground" : "border border-border text-muted-foreground hover:text-gold"
            }`}
          >
            {m === "login" ? "Sign in" : "Request"}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {mode === "login" ? <LoginForm onSignedIn={onSignedIn} /> : <RegisterForm onSignedIn={onSignedIn} />}
      </div>
    </div>
  );
}

/**
 * Google sign-in for artisans. After the provider returns, the Supabase
 * identity is linked to (or creates) an artisan record and the portal session
 * is opened server-side.
 */
function GoogleSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [busy, setBusy] = useState(false);
  const sync = useMutation({
    mutationFn: () => artisanOAuthSync(),
    onSuccess: (res) => {
      toast.success(res.isNew ? "Artisan account created — awaiting approval" : "Signed in");
      onSignedIn();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // If the user is already signed in with a provider (e.g. just came back from
  // the Google redirect), link that identity to the artisan portal.
  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) sync.mutate();
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-8">
      <Button
        variant="outline"
        className="w-full"
        disabled={busy || sync.isPending}
        onClick={async () => {
          setBusy(true);
          try {
            await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/artisan" });
            sync.mutate();
          } catch (e) {
            toast.error((e as Error).message || "Google sign-in failed.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {(busy || sync.isPending) && <Loader2 className="mr-2 size-4 animate-spin" />}
        Continue with Google
      </Button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        New artisans are reviewed by the SAFIA team before their artwork goes live.
      </p>
    </div>
  );
}


function LoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mut = useMutation({
    mutationFn: () => artisanLogin({ data: { email, password } }),
    onSuccess: (res) => {
      if (!res.ok) {
        if (res.reason === "not_approved") {
          toast.error("Your request has not been approved yet. You will be notified by email once reviewed.");
        } else {
          toast.error("Invalid email or password.");
        }
        return;
      }
      toast.success("Signed in");
      onSignedIn();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form
      className="space-y-4 rounded-lg border border-border bg-card/40 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
    >
      <Field label="Email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field label="Password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      <Button type="submit" className="w-full bg-sunset text-primary-foreground" disabled={mut.isPending}>
        {mut.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
        <LogIn className="mr-2 size-4" /> Sign in
      </Button>
    </form>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function RegisterForm({ onSignedIn }: { onSignedIn: () => void }) {
  const [f, setF] = useState({
    email: "",
    phone: "",
    fullName: "",
    password: "",
    bio: "",
    location: "",
    skills: "",
    yearsExperience: "0",
    productPrice: "",
    instagram: "",
    facebook: "",
    website: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [agreement, setAgreement] = useState(false);
  const [uploading, setUploading] = useState(false);

  const mut = useMutation({
    mutationFn: async () => {
      // 1. Register the artisan account.
      const res = await artisanRegister({
        data: {
          email: f.email,
          phone: f.phone,
          fullName: f.fullName,
          password: f.password,
          bio: f.bio,
          photoUrl: "",
          galleryImages: [],
          location: f.location,
          skills: f.skills.split(",").map((s) => s.trim()).filter(Boolean),
          yearsExperience: Number(f.yearsExperience) || 0,
          socialLinks: {
            ...(f.instagram && { instagram: f.instagram }),
            ...(f.facebook && { facebook: f.facebook }),
            ...(f.website && { website: f.website }),
          },
          productPrice: Number(f.productPrice) || 0,
          agreementAccepted: agreement,
        },
      });

      // 2. Upload profile photo (if selected).
      setUploading(true);
      try {
        if (profilePhoto) {
          const base64 = await fileToBase64(profilePhoto);
          await artisanRegistrationUpload({
            data: {
              email: f.email,
              password: f.password,
              kind: "profile",
              fileName: profilePhoto.name,
              contentType: profilePhoto.type || "image/jpeg",
              base64,
            },
          });
        }
        // 3. Upload gallery photos.
        for (const file of galleryFiles.slice(0, 8)) {
          const base64 = await fileToBase64(file);
          await artisanRegistrationUpload({
            data: {
              email: f.email,
              password: f.password,
              kind: "gallery",
              fileName: file.name,
              contentType: file.type || "image/jpeg",
              base64,
            },
          });
        }
      } finally {
        setUploading(false);
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Request submitted! You will be notified by email once reviewed.");
      onSignedIn();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      className="space-y-4 rounded-lg border border-border bg-card/40 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name *"><Input value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} required /></Field>
        <Field label="Email *"><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required /></Field>
        <Field label="Phone *"><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} required /></Field>
        <Field label="Password *"><Input type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required /></Field>
        <Field label="Location"><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="City, Country" /></Field>
        <Field label="Years of experience"><Input type="number" min={0} value={f.yearsExperience} onChange={(e) => setF({ ...f, yearsExperience: e.target.value })} /></Field>
        <Field label="Skills (comma separated)"><Input value={f.skills} onChange={(e) => setF({ ...f, skills: e.target.value })} placeholder="Imigongo, Carving, Gilding" /></Field>
        <Field label="Artwork price (RWF) *"><Input type="number" min={1000} value={f.productPrice} onChange={(e) => setF({ ...f, productPrice: e.target.value })} placeholder="e.g. 1000000" required /></Field>
        <Field label="Instagram"><Input value={f.instagram} onChange={(e) => setF({ ...f, instagram: e.target.value })} placeholder="@handle" /></Field>
        <Field label="Facebook"><Input value={f.facebook} onChange={(e) => setF({ ...f, facebook: e.target.value })} /></Field>
        <Field label="Website"><Input value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} /></Field>
      </div>
      <Field label="Biography"><Textarea rows={3} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></Field>

      <Field label="Profile photo (from your device)">
        <div className="flex items-center gap-3">
          {profilePreview && <img src={profilePreview} alt="Profile preview" className="size-16 rounded-full object-cover" />}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setProfilePhoto(file);
                setProfilePreview(URL.createObjectURL(file));
              }
              e.target.value = "";
            }}
          />
        </div>
      </Field>

      <Field label="Art gallery photos (from your device)">
        <div className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setGalleryFiles((prev) => [...prev, ...files].slice(0, 8));
              setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 8));
              e.target.value = "";
            }}
          />
          {galleryPreviews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {galleryPreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt={`Gallery ${i + 1}`} className="size-16 rounded-md object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryFiles((prev) => prev.filter((_, j) => j !== i));
                      setGalleryPreviews((prev) => prev.filter((_, j) => j !== i));
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-background p-1 text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Field>

      <div className="rounded-lg border border-gold/25 bg-secondary/40 p-4">
        <label className="flex items-start gap-3">
          <Checkbox
            checked={agreement}
            onCheckedChange={(v) => setAgreement(v === true)}
            className="mt-0.5"
          />
          <span className="text-xs leading-relaxed text-muted-foreground">
            I accept the <span className="text-gold font-medium">50/50 profit-split agreement</span> with SAFIA Africa.
            The company and I will split the net profit from each sale equally (50% each).
          </span>
        </label>
      </div>

      <div className="rounded-lg border border-border bg-card/30 p-3 text-[11px] text-muted-foreground">
        After submitting your request, the SAFIA admin team will review your biography and gallery.
        You will receive an <span className="text-foreground">email notification</span> telling you whether
        you have been approved or dismissed. Only approved artisans can sign in.
      </div>

      <Button type="submit" className="w-full bg-sunset text-primary-foreground" disabled={mut.isPending || uploading || !agreement}>
        {(mut.isPending || uploading) && <Loader2 className="mr-2 size-4 animate-spin" />}
        <UserPlus className="mr-2 size-4" /> Submit request
      </Button>
    </form>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardTab() {
  const q = useQuery({ queryKey: ["artisan-dashboard"], queryFn: () => artisanDashboard() });
  if (q.isLoading) return <Spinner />;
  if (q.isError) return <ErrorBox message={(q.error as Error).message} />;

  const s = q.data!.stats;
  const cards = [
    { label: "Total Products", value: s.totalProducts, icon: Package },
    { label: "Active Products", value: s.activeProducts, icon: CheckCircle2 },
    { label: "Pending Approval", value: s.pendingProducts, icon: Boxes },
    { label: "Total Orders", value: s.totalOrders, icon: TrendingUp },
    { label: "Total Sales", value: formatRWF(s.totalSales), icon: Wallet },
    { label: "Commission Earned", value: formatRWF(s.commissionEarned), icon: Wallet },
    { label: "Monthly Revenue", value: formatRWF(s.monthlyRevenue), icon: TrendingUp },
    { label: "Product Views", value: s.productViews, icon: Eye },
    { label: "Product Likes", value: s.productLikes, icon: Heart },
    { label: "Customer Messages", value: s.customerMessages, icon: Eye },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card/40 p-6">
        <p className="text-[10px] tracking-luxe text-gold">Monthly revenue</p>
        <h3 className="mt-1 font-display text-2xl">Commission earned over time</h3>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={q.data!.revenueSeries}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a227" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#c9a227" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v: number) => formatRWF(v)} contentStyle={{ background: "#1b1b1f", border: "1px solid #333" }} />
              <Area type="monotone" dataKey="revenue" stroke="#c9a227" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Products ──────────────────────────────────────────────────────────────────
function ProductsTab() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["artisan-products"], queryFn: () => artisanListProducts() });
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (q.isLoading) return <Spinner />;
  if (q.isError) return <ErrorBox message={(q.error as Error).message} />;

  const products = q.data!.products ?? [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="font-display text-2xl">My products</h2>
        <Button
          className="bg-sunset text-primary-foreground"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 size-4" /> Add product
        </Button>
      </div>

      {showForm && (
        <ProductForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            qc.invalidateQueries({ queryKey: ["artisan-products"] });
          }}
        />
      )}

      {products.length === 0 ? (
        <p className="rounded-lg border border-border bg-card/40 p-6 text-sm text-muted-foreground">
          You have no products yet. Add your first piece — it will be reviewed by an admin before going live.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/40 text-[10px] tracking-luxe text-muted-foreground">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Inventory</th>
                <th className="p-3">Status</th>
                <th className="p-3">Views / Likes</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.imageUrls?.[0] ? (
                        <img src={p.imageUrls[0]} alt={p.name} className="size-12 rounded-md object-cover" />
                      ) : (

                        <div className="flex size-12 items-center justify-center rounded-md bg-secondary"><ImageIcon className="size-4 text-muted-foreground" /></div>
                      )}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.dimensions || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-gold">{formatRWF(Number(p.price))}</td>
                  <td className="p-3">{p.inventory}</td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                  <td className="p-3 text-xs text-muted-foreground">{p.views} / {p.likes}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setShowForm(true);
                        }}
                        className="text-muted-foreground hover:text-gold"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <DeleteButton id={p.id} onDone={() => qc.invalidateQueries({ queryKey: ["artisan-products"] })} />
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

function ProductForm({ initial, onClose, onSaved }: { initial: any; onClose: () => void; onSaved: () => void }) {
  const initialImages: string[] = initial?.images ?? [];
  const initialUrls: string[] = initial?.imageUrls ?? [];
  const [f, setF] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    images: initialImages.filter((s) => /^https?:\/\//i.test(s)).join("\n"),
    dimensions: initial?.dimensions ?? "",
    materials: initial?.materials ?? "",
    frameType: initial?.frame_type ?? "",
    designStyle: initial?.design_style ?? "",
    price: String(initial?.price ?? ""),
    inventory: String(initial?.inventory ?? "0"),
  });
  // Uploaded artwork: stored private path + a signed preview URL.
  const [uploads, setUploads] = useState<{ ref: string; url: string }[]>(
    initialImages
      .map((ref, i) => ({ ref, url: initialUrls[i] ?? "" }))
      .filter((u) => !/^https?:\/\//i.test(u.ref)),
  );
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 6)) {
        if (file.size > 15 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 15MB.`);
          continue;
        }
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
          reader.onerror = () => reject(new Error("Could not read that file."));
          reader.readAsDataURL(file);
        });
        const res = await artisanUploadArtwork({
          data: { fileName: file.name, contentType: file.type || "image/jpeg", base64 },
        });
        setUploads((prev) => [...prev, { ref: res.path, url: res.url ?? "" }]);
      }
      toast.success("Artwork uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const mut = useMutation({
    mutationFn: () => {
      const payload = {
        name: f.name,
        description: f.description,
        images: [
          ...uploads.map((u) => u.ref),
          ...f.images.split("\n").map((s: string) => s.trim()).filter(Boolean),
        ],

        dimensions: f.dimensions,
        materials: f.materials,
        frameType: f.frameType,
        designStyle: f.designStyle,
        price: Number(f.price) || 0,
        inventory: Number(f.inventory) || 0,
      };
      return initial
        ? artisanUpdateProduct({ data: { id: initial.id, ...payload } })
        : artisanCreateProduct({ data: payload });
    },
    onSuccess: () => {
      toast.success(initial ? "Product updated" : "Product submitted for review");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      className="space-y-4 rounded-lg border border-gold/25 bg-card/40 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
    >
      <h3 className="font-display text-xl">{initial ? "Edit product" : "New product"}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name *"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></Field>
        <Field label="Price (RWF) *"><Input type="number" min={100000} max={1000000} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} required /></Field>
        <Field label="Dimensions"><Input value={f.dimensions} onChange={(e) => setF({ ...f, dimensions: e.target.value })} placeholder="90 × 60 cm" /></Field>
        <Field label="Inventory"><Input type="number" min={0} value={f.inventory} onChange={(e) => setF({ ...f, inventory: e.target.value })} /></Field>
        <Field label="Materials"><Input value={f.materials} onChange={(e) => setF({ ...f, materials: e.target.value })} placeholder="Premium MDF, Gold leaf" /></Field>
        <Field label="Frame type"><Input value={f.frameType} onChange={(e) => setF({ ...f, frameType: e.target.value })} /></Field>
        <Field label="Design style"><Input value={f.designStyle} onChange={(e) => setF({ ...f, designStyle: e.target.value })} placeholder="Modern, Luxury…" /></Field>
      </div>
      <Field label="Upload artwork images">
        <div className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => {
              void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          {uploading && (
            <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Uploading…
            </p>
          )}
          {uploads.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {uploads.map((u) => (
                <div key={u.ref} className="relative">
                  {u.url ? (
                    <img src={u.url} alt="Uploaded artwork" className="size-20 rounded-md object-cover" />
                  ) : (
                    <div className="flex size-20 items-center justify-center rounded-md bg-secondary">
                      <ImageIcon className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setUploads((prev) => prev.filter((x) => x.ref !== u.ref))}
                    className="absolute -right-2 -top-2 rounded-full bg-background p-1 text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Field>
      <Field label="Or image URLs (one per line)"><Textarea rows={3} value={f.images} onChange={(e) => setF({ ...f, images: e.target.value })} placeholder="https://…" /></Field>

      <Field label="Description"><Textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
      <p className="text-[11px] text-muted-foreground">Standard products are priced between 100,000 and 1,000,000 RWF (VAT included).</p>
      <div className="flex gap-3">
        <Button type="submit" className="bg-sunset text-primary-foreground" disabled={mut.isPending}>
          {mut.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {initial ? "Save changes" : "Submit product"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

function DeleteButton({ id, onDone }: { id: string; onDone: () => void }) {
  const mut = useMutation({
    mutationFn: () => artisanDeleteProduct({ data: { id } }),
    onSuccess: () => {
      toast.success("Product deleted");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <button onClick={() => mut.mutate()} className="text-muted-foreground hover:text-red-400">
      <Trash2 className="size-4" />
    </button>
  );
}

// ── Earnings ──────────────────────────────────────────────────────────────────
function EarningsTab() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["artisan-earnings"], queryFn: () => artisanEarnings() });
  const [amount, setAmount] = useState("");
  const wdMut = useMutation({
    mutationFn: () => artisanRequestWithdrawal({ data: { amount: Number(amount) } }),
    onSuccess: () => {
      toast.success("Withdrawal requested");
      setAmount("");
      qc.invalidateQueries({ queryKey: ["artisan-earnings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isLoading) return <Spinner />;
  if (q.isError) return <ErrorBox message={(q.error as Error).message} />;

  const { summary, commissions, withdrawals } = q.data!;
  const cards = [
    { label: "Total Earnings", value: formatRWF(summary.totalEarnings), icon: Wallet },
    { label: "Pending Earnings", value: formatRWF(summary.pendingEarnings), icon: Boxes },
    { label: "Paid Earnings", value: formatRWF(summary.paidEarnings), icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="rounded-lg border border-gold/25 bg-card/40 p-6">
        <p className="text-[10px] tracking-luxe text-gold">Withdrawal request</p>
        <p className="mt-1 text-xs text-muted-foreground">Commission split: 50% artisan / 50% platform of net profit.</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <Field label="Amount (RWF)">
            <Input type="number" min={1000} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Button className="bg-sunset text-primary-foreground" disabled={wdMut.isPending || !amount} onClick={() => wdMut.mutate()}>
            {wdMut.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Request withdrawal
          </Button>
        </div>
      </div>

      <Section title="Commission history">
        <Table>
          <thead>
            <tr><Th>Order</Th><Th>Gross</Th><Th>Your share</Th><Th>Platform</Th><Th>Status</Th><Th>Date</Th></tr>
          </thead>
          <tbody>
            {(commissions ?? []).map((c: any) => (
              <tr key={c.id} className="border-t border-border">
                <Td>{c.order_number || "—"}</Td>
                <Td className="text-gold">{formatRWF(Number(c.gross))}</Td>
                <Td>{formatRWF(Number(c.artisan_share))}</Td>
                <Td>{formatRWF(Number(c.platform_share))}</Td>
                <Td><StatusBadge status={c.status} /></Td>
                <Td className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</Td>
              </tr>
            ))}
            {!commissions?.length && (
              <tr><Td className="text-muted-foreground">No commissions yet.</Td><Td /><Td /><Td /><Td /><Td /></tr>
            )}
          </tbody>
        </Table>
      </Section>

      <Section title="Withdrawal requests">
        <Table>
          <thead><tr><Th>Amount</Th><Th>Status</Th><Th>Date</Th></tr></thead>
          <tbody>
            {(withdrawals ?? []).map((w: any) => (
              <tr key={w.id} className="border-t border-border">
                <Td className="text-gold">{formatRWF(Number(w.amount))}</Td>
                <Td><StatusBadge status={w.status} /></Td>
                <Td className="text-xs text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</Td>
              </tr>
            ))}
            {!withdrawals?.length && (
              <tr><Td className="text-muted-foreground">No withdrawal requests yet.</Td><Td /><Td /></tr>
            )}
          </tbody>
        </Table>
      </Section>
    </div>
  );
}

// ── Advertising ───────────────────────────────────────────────────────────────
function AdvertisingTab() {
  const q = useQuery({ queryKey: ["artisan-advertising"], queryFn: () => artisanAdvertising() });
  if (q.isLoading) return <Spinner />;
  if (q.isError) return <ErrorBox message={(q.error as Error).message} />;

  const { stats, topProducts, trending, featuredArtisan } = q.data!;
  const cards = [
    { label: "Impressions", value: stats.impressions, icon: Eye },
    { label: "Click-throughs", value: stats.clicks, icon: TrendingUp },
    { label: "CTR %", value: stats.ctr, icon: TrendingUp },
    { label: "Engagement", value: stats.engagement, icon: Heart },
  ];
  const chartData = (topProducts ?? []).map((p: any) => ({ name: p.name?.slice(0, 14), views: Number(p.views ?? 0), likes: Number(p.likes ?? 0) }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card/40 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-luxe text-gold">Featured Artisan Program</p>
            <h3 className="mt-1 font-display text-xl">{featuredArtisan ? "You are a featured artisan" : "Not featured yet"}</h3>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] tracking-luxe ${featuredArtisan ? "bg-gold/20 text-gold" : "bg-secondary text-muted-foreground"}`}>
            {featuredArtisan ? "Featured" : "Standard"}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Featured artisans receive homepage promotion slots and appear in trending & recommended sections, managed by the SAFIA team.
        </p>
      </div>

      {chartData.length > 0 && (
        <div className="rounded-lg border border-border bg-card/40 p-6">
          <p className="text-[10px] tracking-luxe text-gold">Product performance</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1b1b1f", border: "1px solid #333" }} />
                <Bar dataKey="views" fill="#c9a227" radius={[4, 4, 0, 0]} />
                <Bar dataKey="likes" fill="#e8cf7d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <Section title="Most viewed products">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(trending ?? []).map((p: any) => (
            <div key={p.id} className="rounded-lg border border-border bg-card/30 p-4">
              <p className="font-medium">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.views} views · {p.likes} likes</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ── Profile ────────────────────────────────────────────────────────────────────
function ProfileTab() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["artisan-profile"], queryFn: () => artisanGetProfile() });
  const [f, setF] = useState<null | {
    fullName: string;
    bio: string;
    photoUrl: string;
    location: string;
    skills: string;
    yearsExperience: string;
    instagram: string;
    facebook: string;
    website: string;
  }>(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [galleryUploads, setGalleryUploads] = useState<{ ref: string; url: string }[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const p: any = q.data?.profile;
  const galleryUrls: string[] = q.data?.galleryUrls ?? [];
  useEffect(() => {
    if (!p || f) return;
    const social = (p.social_links ?? {}) as Record<string, string>;
    setF({
      fullName: p.full_name ?? "",
      bio: p.bio ?? "",
      photoUrl: p.photo_url ?? "",
      location: p.location ?? "",
      skills: (p.skills ?? []).join(", "),
      yearsExperience: String(p.years_experience ?? 0),
      instagram: social["instagram"] ?? "",
      facebook: social["facebook"] ?? "",
      website: social["website"] ?? "",
    });
    const existingGalleryPaths: string[] = p.gallery_images ?? [];
    setGalleryUploads(
      existingGalleryPaths.map((ref, i) => ({ ref, url: galleryUrls[i] ?? "" })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const mut = useMutation({
    mutationFn: () =>
      artisanUpdateProfile({
        data: {
          fullName: f!.fullName,
          bio: f!.bio,
          photoUrl: f!.photoUrl,
          galleryImages: galleryUploads.map((u) => u.ref),
          location: f!.location,
          skills: f!.skills.split(",").map((s) => s.trim()).filter(Boolean),
          yearsExperience: Number(f!.yearsExperience) || 0,
          socialLinks: {
            ...(f!.instagram && { instagram: f!.instagram }),
            ...(f!.facebook && { facebook: f!.facebook }),
            ...(f!.website && { website: f!.website }),
          },
        },
      }),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["artisan-profile"] });
      qc.invalidateQueries({ queryKey: ["artisan-session"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (q.isLoading) return <Spinner />;
  if (q.isError) return <ErrorBox message={(q.error as Error).message} />;
  if (!f) return <Spinner />;

  return (
    <form
      className="space-y-4 rounded-lg border border-border bg-card/40 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate();
      }}
    >
      <h2 className="font-display text-2xl">My profile</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name *"><Input value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} required /></Field>
        <Field label="Location"><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="City, Country" /></Field>
        <Field label="Years of experience"><Input type="number" min={0} value={f.yearsExperience} onChange={(e) => setF({ ...f, yearsExperience: e.target.value })} /></Field>
        <Field label="Skills (comma separated)"><Input value={f.skills} onChange={(e) => setF({ ...f, skills: e.target.value })} /></Field>

        <Field label="Instagram"><Input value={f.instagram} onChange={(e) => setF({ ...f, instagram: e.target.value })} /></Field>
        <Field label="Facebook"><Input value={f.facebook} onChange={(e) => setF({ ...f, facebook: e.target.value })} /></Field>
        <Field label="Website"><Input value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} /></Field>
      </div>

      <Field label="Profile photo (from your device)">
        <div className="flex items-center gap-3">
          {profilePreview && <img src={profilePreview} alt="Profile" className="size-16 rounded-full object-cover" />}
          <Input
            type="file"
            accept="image/*"
            disabled={photoUploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPhotoUploading(true);
              try {
                const base64 = await fileToBase64(file);
                const res = await artisanUploadProfilePhoto({ data: { fileName: file.name, contentType: file.type || "image/jpeg", base64 } });
                setF((prev) => (prev ? { ...prev, photoUrl: res.path } : prev));
                setProfilePreview(res.url ?? URL.createObjectURL(file));
                toast.success("Profile photo uploaded");
              } catch (err) {
                toast.error((err as Error).message);
              } finally {
                setPhotoUploading(false);
              }
              e.target.value = "";
            }}
          />
          {photoUploading && <Loader2 className="size-4 animate-spin text-gold" />}
        </div>
      </Field>

      <Field label="Art gallery photos (from your device)">
        <div className="space-y-3">
          <Input
            type="file"
            accept="image/*"
            multiple
            disabled={galleryUploading}
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []).slice(0, 8);
              if (!files.length) return;
              setGalleryUploading(true);
              try {
                for (const file of files) {
                  const base64 = await fileToBase64(file);
                  const res = await artisanUploadGalleryImage({ data: { fileName: file.name, contentType: file.type || "image/jpeg", base64 } });
                  setGalleryUploads((prev) => [...prev, { ref: res.path, url: res.url ?? URL.createObjectURL(file) }]);
                }
                toast.success("Gallery photos uploaded");
              } catch (err) {
                toast.error((err as Error).message);
              } finally {
                setGalleryUploading(false);
              }
              e.target.value = "";
            }}
          />
          {galleryUploading && <p className="flex items-center gap-2 text-[11px] text-muted-foreground"><Loader2 className="size-3.5 animate-spin" /> Uploading…</p>}
          {galleryUploads.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {galleryUploads.map((u) => (
                <div key={u.ref} className="relative">
                  {u.url ? (
                    <img src={u.url} alt="Gallery" className="size-16 rounded-md object-cover" />
                  ) : (
                    <div className="flex size-16 items-center justify-center rounded-md bg-secondary"><ImageIcon className="size-4 text-muted-foreground" /></div>
                  )}
                  <button
                    type="button"
                    onClick={() => setGalleryUploads((prev) => prev.filter((x) => x.ref !== u.ref))}
                    className="absolute -right-2 -top-2 rounded-full bg-background p-1 text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Field>

      <Field label="Biography"><Textarea rows={4} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></Field>
      <Button type="submit" className="bg-sunset text-primary-foreground" disabled={mut.isPending}>
        {mut.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Save profile
      </Button>
    </form>
  );
}


// ── Shared ────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon: any }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-luxe text-muted-foreground">{label}</p>
        <Icon className="size-4 text-gold" />
      </div>
      <p className="mt-2 font-display text-2xl text-gold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] tracking-luxe text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-display text-xl">{title}</h3>
      {children}
    </div>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="bg-card/40 p-3 text-[10px] tracking-luxe text-muted-foreground">{children}</th>;
}
function Td({ children = null, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`p-3 ${className}`}>{children}</td>;
}

function Spinner() {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <Loader2 className="size-5 animate-spin text-gold" />
    </div>
  );
}
function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-300">
      {message}. Make sure the artisan portal migration has been run in Supabase.
    </div>
  );
}
