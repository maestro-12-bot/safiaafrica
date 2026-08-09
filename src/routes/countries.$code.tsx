import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { COUNTRIES, countryByCode } from "@/data/africa";

export const Route = createFileRoute("/countries/$code")({
  loader: ({ params }) => {
    const country = countryByCode(params.code);
    if (!country) throw notFound();
    return { country };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Country not found — SAFIA Africa" }, { name: "robots", content: "noindex" }],
      };
    }
    const { country } = loaderData;
    const title = `${country.name} — Heritage, Craft & Luxury Commissions | SAFIA Africa`;
    const description = `Discover ${country.name}: ${country.dress}, ${country.crafts} and heritage sites including ${country.sites}. Commission ${country.name}-inspired luxury artwork with SAFIA Africa.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: `${country.name} — SAFIA Africa` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CountryPage,
});

function CountryPage() {
  const { country } = Route.useLoaderData();
  const siblings = COUNTRIES.filter((c) => c.region === country.region && c.code !== country.code);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <Link to="/countries" className="text-[10px] tracking-luxe text-gold">
            ← All 54 nations
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-5xl" aria-hidden>
              {country.flag}
            </span>
            <div>
              <h1 className="font-display text-5xl lg:text-6xl">{country.name}</h1>
              <p className="mt-2 text-[10px] tracking-luxe text-muted-foreground">
                {country.region} · {country.capital}
              </p>
            </div>
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {country.note}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <article className="glass rounded-xl p-9">
            <p className="text-[10px] tracking-luxe text-gold">Heritage archive</p>
            <dl className="mt-8 grid gap-8 sm:grid-cols-2">
              <Item label="Traditional dress" value={country.dress} />
              <Item label="Languages" value={country.languages} />
              <Item label="Crafts & artforms" value={country.crafts} />
              <Item label="Heritage sites" value={country.sites} />
              <Item label="Festivals" value={country.festival} />
              <Item label="Capital" value={country.capital} />
            </dl>
          </article>

          <aside className="h-fit rounded-xl border border-gold/30 bg-card/60 p-7">
            <p className="text-[10px] tracking-luxe text-gold">Commission</p>
            <h2 className="mt-3 font-display text-2xl">{country.name} inspired masterpiece</h2>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Our atelier interprets {country.crafts.split(",")[0]} into museum-grade 3D relief
              artwork, framed and finished to your specification.
            </p>
            <Link
              to="/order"
              className="mt-6 inline-block rounded-full bg-sunset px-5 py-2 text-[11px] font-semibold tracking-luxe text-primary-foreground"
            >
              Start a commission
            </Link>
            <Link
              to="/luxury"
              className="mt-3 block text-[10px] tracking-luxe text-gold hover:underline"
            >
              View luxury tiers →
            </Link>
          </aside>
        </div>

        <div className="mt-16">
          <p className="text-[10px] tracking-luxe text-gold">More from {country.region}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {siblings.map((c) => (
              <Link
                key={c.code}
                to="/countries/$code"
                params={{ code: c.code }}
                className="rounded-full border border-border px-4 py-1.5 text-[10px] tracking-luxe text-muted-foreground hover:border-gold/50 hover:text-gold"
              >
                {c.flag} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-luxe text-gold">{label}</dt>
      <dd className="mt-2 text-sm text-foreground/90">{value}</dd>
    </div>
  );
}
