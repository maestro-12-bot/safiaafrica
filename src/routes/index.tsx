import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Compass, Gem, Landmark, Sparkles } from "lucide-react";

import heroImage from "@/assets/hero-imigongo.jpg";
import { PRODUCTS, SIZE_TIERS, formatRWF, tierBasePrice } from "@/data/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAFIA Africa — Preserving Africa's Heritage Through Innovation" },
      {
        name: "description",
        content:
          "Luxury Pan-African 3D heritage artwork for presidencies, embassies, hotels and collectors. Commission bespoke Imigongo, Umukenyero and Umugara masterpieces.",
      },
      { property: "og:title", content: "SAFIA Africa — Luxury African Heritage Artwork" },
      {
        property: "og:description",
        content:
          "Preserving, documenting and licensing Africa's heritage through innovative luxury craft.",
      },
    ],
  }),
  component: Home,
});

const PILLARS = [
  {
    icon: Landmark,
    title: "Heritage Preservation",
    body: "Digital archives, heritage licensing and protection of cultural sites with governments and institutions.",
  },
  {
    icon: Gem,
    title: "Luxury 3D Production",
    body: "Museum-grade relief artwork from A4 premium editions to A0 presidential installations.",
  },
  {
    icon: Sparkles,
    title: "Artisan Empowerment",
    body: "Cooperatives, master craftsmen and young designers earning globally from African skill.",
  },
  {
    icon: Compass,
    title: "Cultural Tourism",
    body: "Experiences, exhibitions and virtual galleries that carry Africa's story to the world.",
  },
];

const TIMELINE = [
  { year: "Vision", text: "Unify Africa by championing cultural heritage, creative innovation and political collaboration." },
  { year: "Mission", text: "Drive African unity through heritage preservation, promotion of African arts and policy advocacy." },
  { year: "Today", text: "A Pan-African platform documenting, branding and licensing Africa's cultural legacy." },
  { year: "Next", text: "Continental expansion — heritage studios and archives across African capitals." },
];

function Home() {
  return (
    <>
      <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Monumental gilded Imigongo 3D heritage artwork in a luxury gallery"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/40" />
        <div className="absolute inset-0 bg-aurora" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 lg:px-10">
          <p className="reveal text-[10px] tracking-luxe text-gold">
            Sustainable African Fashion, Innovation &amp; Arts
          </p>
          <h1 className="reveal mt-6 max-w-4xl font-display text-5xl leading-[1.05] sm:text-6xl lg:text-8xl">
            Preserving Africa&apos;s Heritage&nbsp;
            <span className="text-gradient-sunset">Through Innovation.</span>
          </h1>
          <p className="reveal mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            SAFIA Africa is a Pan-African company dedicated to preserving, documenting, licensing
            and promoting Africa&apos;s cultural and historical heritage — transforming it into
            museum-grade luxury artwork and sustainable economic opportunity.
          </p>

          <div className="reveal mt-10 flex flex-wrap gap-3">
            <Link
              to="/collections"
              className="group inline-flex items-center gap-2 rounded-full bg-sunset px-7 py-3.5 text-[11px] tracking-luxe text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              Explore Collections
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center rounded-full border border-gold/40 px-7 py-3.5 text-[11px] tracking-luxe text-gold hover:bg-secondary"
            >
              Request Custom Artwork
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center rounded-full border border-border px-7 py-3.5 text-[11px] tracking-luxe text-muted-foreground hover:text-foreground"
            >
              Virtual Gallery
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-border px-7 py-3.5 text-[11px] tracking-luxe text-muted-foreground hover:text-foreground"
            >
              Book Consultation
            </Link>
          </div>

          <dl className="reveal mt-20 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              ["54", "African nations"],
              ["7", "Size collections"],
              ["100%", "Artisan-made"],
              ["24h", "Quotation time"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="font-display text-3xl text-gold">{k}</dt>
                <dd className="mt-1 text-[10px] tracking-luxe text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-28 lg:px-10">
        <p className="text-[10px] tracking-luxe text-gold">What we do</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl lg:text-5xl">
          A continental platform for heritage, craft and commerce.
        </h2>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="glass group rounded-lg p-7 transition-transform duration-500 hover:-translate-y-1.5"
            >
              <p.icon className="size-6 text-gold" />
              <h3 className="mt-5 font-display text-2xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-5 py-28 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">Signature collections</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl lg:text-5xl">Masterpieces in relief.</h2>
            <Link
              to="/collections"
              className="text-[11px] tracking-luxe text-gold hover:text-gold-soft"
            >
              View all &amp; order →
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PRODUCTS.slice(0, 3).map((p) => (
              <Link
                key={p.slug}
                to="/collections"
                className="group overflow-hidden rounded-lg border border-border bg-background/50"
              >
                <div className="overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] tracking-luxe text-gold">{p.collection}</p>
                  <h3 className="mt-2 font-display text-2xl">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-28 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-[10px] tracking-luxe text-gold">Our story</p>
            <h2 className="mt-4 font-display text-4xl lg:text-5xl">
              Built to protect the past, and fund the future.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              SAFIA Africa works with governments, cultural institutions, local communities,
              artisans and the private sector to protect heritage sites, strengthen cultural
              identity, and transform African heritage into sustainable economic opportunities.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-[11px] tracking-luxe text-gold"
            >
              Read the full story <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <ol className="relative space-y-8 border-l border-gold/25 pl-8">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[38px] top-1.5 size-2.5 rounded-full bg-sunset" />
                <p className="text-[10px] tracking-luxe text-gold">{t.year}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-5 py-28 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">Official Rwanda pricing</p>
          <h2 className="mt-4 font-display text-4xl lg:text-5xl">Luxury brand 3D production.</h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-[10px] tracking-luxe text-muted-foreground">
                  <th className="pb-4">Collection</th>
                  <th className="pb-4">Size</th>
                  <th className="pb-4">Target client</th>
                  <th className="pb-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_TIERS.map((t) => (
                  <tr key={t.code} className="border-t border-border/70">
                    <td className="py-4 font-display text-lg">{t.collection}</td>
                    <td className="py-4 text-muted-foreground">{t.dimensions}</td>
                    <td className="py-4 text-muted-foreground">{t.targetClient}</td>
                    <td className="py-4 text-right text-gold">
                      {t.price === null ? "On request" : formatRWF(tierBasePrice(t.price)!)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Quotations vary with size and type of printing / drawing. Frame, material and finish
            options are calculated live in the Customisation Studio.
          </p>
        </div>
      </section>
    </>
  );
}
