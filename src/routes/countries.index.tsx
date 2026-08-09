import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { COUNTRIES, REGIONS, type Region } from "@/data/africa";
import { useLocale } from "@/lib/locale";

export const Route = createFileRoute("/countries")({
  head: () => ({
    meta: [
      { title: "54 African Countries — Heritage, Craft & Commissions | SAFIA Africa" },
      {
        name: "description",
        content:
          "Explore all 54 African nations with SAFIA Africa: traditional dress, languages, crafts, heritage sites, festivals and country-inspired luxury commissions.",
      },
      { property: "og:title", content: "All 54 African Countries — SAFIA Africa" },
      {
        property: "og:description",
        content:
          "A continental atelier: heritage, craft and luxury commissions from every African nation.",
      },
    ],
  }),
  component: CountriesPage,
});

function CountriesPage() {
  const { t } = useLocale();
  const [region, setRegion] = useState<Region | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        (region === "all" || c.region === region) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.capital.toLowerCase().includes(q) ||
          c.crafts.toLowerCase().includes(q)),
    );
  }, [region, query]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">Continental Atelier</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl lg:text-7xl">
            <span className="text-gradient-sunset">{t("countries.title")}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {t("countries.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <RegionChip active={region === "all"} onClick={() => setRegion("all")}>
              {t("countries.all")}
            </RegionChip>
            {REGIONS.map((r) => (
              <RegionChip key={r} active={region === r} onClick={() => setRegion(r)}>
                {r}
              </RegionChip>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("countries.search")}
            className="w-full rounded-full border border-input bg-secondary/50 px-4 py-2 text-sm outline-none focus:border-gold lg:w-72"
          />
        </div>

        <p className="mt-6 text-[10px] tracking-luxe text-muted-foreground">
          {filtered.length} nations
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.code}
              to="/countries/$code"
              params={{ code: c.code }}
              className="group rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-gold/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl" aria-hidden>
                  {c.flag}
                </span>
                <span className="text-[9px] tracking-luxe text-muted-foreground">{c.region}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl group-hover:text-gold">{c.name}</h2>
              <p className="mt-1 text-[11px] tracking-luxe text-muted-foreground">{c.capital}</p>
              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {c.crafts}
              </p>
              <span className="mt-4 inline-block text-[10px] tracking-luxe text-gold">
                {t("countries.explore")} →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function RegionChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-[10px] tracking-luxe transition-colors ${
        active ? "border-gold text-gold" : "border-border text-muted-foreground hover:border-gold/40"
      }`}
    >
      {children}
    </button>
  );
}
