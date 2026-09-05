import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AlertTriangle, ImagePlus, Loader2, LogOut, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  artisanStatusClasses,
  fileToDataUrl,
  useMockPortal,
  mockPortal,
  type MockArtisan,
} from "@/lib/mock-portal";

export const Route = createFileRoute("/portals/artisan")({
  head: () => ({
    meta: [
      { title: "Artisan Request Portal (Preview) — SAFIA Africa" },
      {
        name: "description",
        content:
          "Preview of the SAFIA Africa artisan request portal: submit a biography, profile photo and arts gallery for review.",
      },
      { property: "og:title", content: "Artisan Request Portal (Preview) — SAFIA Africa" },
      {
        property: "og:description",
        content: "Submit an artisan request with biography, profile photo and arts gallery for SAFIA Africa review.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ArtisanRequestPortal,
});

function ArtisanRequestPortal() {
  const [mode, setMode] = useState<"request" | "signin">("request");
  const [signedIn, setSignedIn] = useState<MockArtisan | null>(null);

  if (signedIn) return <ArtisanHome artisan={signedIn} onSignOut={() => setSignedIn(null)} />;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-10">
      <p className="text-[10px] tracking-luxe text-gold">Artisan Portal — Preview</p>
      <h1 className="mt-2 font-display text-3xl lg:text-4xl">Join the SAFIA atelier</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Send a request with your story and artwork. Our curators review every submission before your portal
        access opens.
      </p>

      <div className="mt-8 flex gap-1.5 border-b border-border pb-3">
        {(["request", "signin"] as const).map((id) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`rounded-full px-4 py-1.5 text-[11px] tracking-luxe transition-colors ${
              mode === id
                ? "bg-sunset text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-gold"
            }`}
          >
            {id === "request" ? "Request" : "Sign in"}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {mode === "request" ? (
          <RequestForm onSubmitted={() => setMode("signin")} />
        ) : (
          <SignInForm onSignedIn={setSignedIn} />
        )}
      </div>
    </div>
  );
}

function PhotoZone({
  label,
  hint,
  multiple,
  values,
  onAdd,
  onRemove,
}: {
  label: string;
  hint: string;
  multiple?: boolean;
  values: string[];
  onAdd: (urls: string[]) => void;
  onRemove: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(Array.from(files).map(fileToDataUrl));
      onAdd(urls);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <Label className="text-[11px] tracking-luxe text-muted-foreground">{label}</Label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFiles(e.dataTransfer.files);
        }}
        className="mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/40 bg-secondary/40 px-4 py-8 text-center transition-colors hover:border-gold hover:bg-secondary"
      >
        {busy ? (
          <Loader2 className="size-5 animate-spin text-gold" />
        ) : (
          <ImagePlus className="size-5 text-gold" />
        )}
        <span className="text-xs text-foreground">Tap to choose from your device gallery</span>
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {values.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {values.map((src, i) => (
            <div key={`${src.slice(-12)}-${i}`} className="group relative overflow-hidden rounded-lg border border-border">
              <img src={src} alt={`${label} ${i + 1}`} className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove photo"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RequestForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [biography, setBiography] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  const canSubmit = agreed && fullName.trim().length > 1 && email.includes("@") && password.length >= 6;

  return (
    <Card className="p-5 sm:p-7">
      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          mockPortal.submitRequest({ fullName, email, password, biography, profilePhoto, gallery });
          toast.success("Request submitted — your account status is Pending review.");
          onSubmitted();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-[11px] tracking-luxe text-muted-foreground">Full name</Label>
            <Input className="mt-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <Label className="text-[11px] tracking-luxe text-muted-foreground">Email</Label>
            <Input
              className="mt-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label className="text-[11px] tracking-luxe text-muted-foreground">Password</Label>
          <Input
            className="mt-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <div>
          <Label className="text-[11px] tracking-luxe text-muted-foreground">Biography</Label>
          <Textarea
            className="mt-2 min-h-28"
            placeholder="Your craft, heritage, materials and years of practice…"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
          />
        </div>

        <PhotoZone
          label="Profile photo"
          hint="One portrait image"
          values={profilePhoto ? [profilePhoto] : []}
          onAdd={(urls) => setProfilePhoto(urls[0] ?? null)}
          onRemove={() => setProfilePhoto(null)}
        />

        <PhotoZone
          label="Arts gallery"
          hint="Up to a dozen artwork photos"
          multiple
          values={gallery}
          onAdd={(urls) => setGallery((g) => [...g, ...urls].slice(0, 12))}
          onRemove={(i) => setGallery((g) => g.filter((_, idx) => idx !== i))}
        />

        <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-4">
          <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
          <span className="text-xs leading-relaxed text-foreground">
            I agree to split all product profits 50/50 with the company.
          </span>
        </label>

        <div>
          <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
            Submit request
          </Button>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            By submitting this request, you consent to receive an immediate automated confirmation email and
            follow-up status alerts.
          </p>
        </div>
      </form>
    </Card>
  );
}

function SignInForm({ onSignedIn }: { onSignedIn: (artisan: MockArtisan) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  useMockPortal();

  return (
    <Card className="p-5 sm:p-7">
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const artisan = mockPortal.findArtisan(email, password);
          if (!artisan) {
            setError("We could not find an artisan account with those details.");
            return;
          }
          if (artisan.status !== "Approved") {
            setError(
              "Your request is currently pending review or has been dismissed. Only approved artisans may log in.",
            );
            return;
          }
          setError(null);
          onSignedIn(artisan);
        }}
      >
        <div>
          <Label className="text-[11px] tracking-luxe text-muted-foreground">Email</Label>
          <Input className="mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
        <Button type="submit" className="w-full sm:w-auto">
          Sign in
        </Button>
      </form>
    </Card>
  );
}

function ArtisanHome({ artisan, onSignOut }: { artisan: MockArtisan; onSignOut: () => void }) {
  const state = useMockPortal();
  const live = state.artisans.find((a) => a.id === artisan.id) ?? artisan;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {live.profilePhoto ? (
            <img src={live.profilePhoto} alt={live.fullName} className="size-14 rounded-full object-cover" />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-gold">
              <UserRound className="size-6" />
            </div>
          )}
          <div>
            <p className="text-[10px] tracking-luxe text-gold">Artisan Portal — Preview</p>
            <h1 className="mt-1 font-display text-2xl">{live.fullName}</h1>
            <span
              className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[10px] tracking-luxe ${artisanStatusClasses(live.status)}`}
            >
              {live.status}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </div>

      <Card className="mt-8 p-5 sm:p-7">
        <h2 className="font-display text-lg">Biography</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {live.biography || "No biography submitted yet."}
        </p>
      </Card>

      <Card className="mt-5 p-5 sm:p-7">
        <h2 className="font-display text-lg">Arts gallery</h2>
        {live.gallery.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {live.gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Artwork ${i + 1}`}
                className="aspect-square w-full rounded-lg border border-border object-cover"
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No artwork uploaded yet.</p>
        )}
      </Card>

      <p className="mt-6 text-[11px] text-muted-foreground">
        Reviewing requests?{" "}
        <Link to="/portals/admin" className="text-gold hover:underline">
          Open the admin preview
        </Link>
      </p>
    </div>
  );
}
