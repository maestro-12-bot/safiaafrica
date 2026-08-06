import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: "African Heritage Map — Culture, Craft & Cultural Sites | SAFIA Africa" },
      {
        name: "description",
        content:
          "Explore African heritage nation by nation: culture, traditional dress, languages, crafts, festivals and heritage sites documented by SAFIA Africa.",
      },
      { property: "og:title", content: "African Heritage — SAFIA Africa" },
      {
        property: "og:description",
        content: "A living archive of African culture, craft, languages and heritage sites.",
      },
    ],
  }),
  component: Heritage,
});

interface Nation {
  name: string;
  dress: string;
  languages: string;
  crafts: string;
  sites: string;
  festival: string;
  note: string;
}

const NATIONS: Nation[] = [
  {
    name: "Rwanda",
    dress: "Umushanana, Umukenyero",
    languages: "Kinyarwanda, French, English, Swahili",
    crafts: "Imigongo relief art, Agaseke peace baskets",
    sites: "Nyanza King's Palace, Nyungwe, Volcanoes",
    festival: "Umuganura harvest festival",
    note: "Home of Imigongo — geometric relief painting from the Eastern Province, and SAFIA's founding atelier.",
  },
  {
    name: "Ethiopia",
    dress: "Habesha kemis, Netela shawl",
    languages: "Amharic, Oromo, Tigrinya",
    crafts: "Illuminated manuscripts, silver crosses",
    sites: "Lalibela, Aksum, Fasil Ghebbi",
    festival: "Timkat, Meskel",
    note: "One of the world's oldest continuous artistic traditions in stone, parchment and silver.",
  },
  {
    name: "Nigeria",
    dress: "Agbada, Aso Oke, Gele",
    languages: "Yoruba, Igbo, Hausa, English",
    crafts: "Benin bronzes, Adire textiles, Nok terracotta",
    sites: "Sukur Cultural Landscape, Osun-Osogbo Grove",
    festival: "Eyo, Argungu, Osun-Osogbo",
    note: "Ife and Benin casting traditions set a global benchmark for African sculpture.",
  },
  {
    name: "Morocco",
    dress: "Djellaba, Kaftan",
    languages: "Arabic, Amazigh, French",
    crafts: "Zellige tilework, cedar carving, Berber rugs",
    sites: "Medina of Fez, Aït Benhaddou, Volubilis",
    festival: "Fes Festival of Sacred Music",
    note: "Geometric tile mathematics that resonate directly with Imigongo composition.",
  },
  {
    name: "Ghana",
    dress: "Kente cloth, Batakari",
    languages: "Twi, Ga, Ewe, English",
    crafts: "Kente weaving, Adinkra symbols, brass Akuaba",
    sites: "Cape Coast Castle, Asante traditional buildings",
    festival: "Homowo, Akwasidae",
    note: "Adinkra symbolism is a complete visual language of proverbs and philosophy.",
  },
  {
    name: "Egypt",
    dress: "Galabeya",
    languages: "Arabic",
    crafts: "Papyrus, alabaster, khayamiya appliqué",
    sites: "Giza, Luxor, Abu Simbel, Islamic Cairo",
    festival: "Abu Simbel Sun Festival",
    note: "The continent's oldest monumental relief tradition — the ancestor of carved storytelling.",
  },
  {
    name: "Kenya",
    dress: "Shuka, Kanga, Maasai beadwork",
    languages: "Swahili, English, 40+ local languages",
    crafts: "Beadwork, Kisii soapstone, Kiondo baskets",
    sites: "Lamu Old Town, Fort Jesus, Mijikenda Kayas",
    festival: "Lamu Cultural Festival, Lake Turkana Festival",
    note: "Beadwork colour grammar encodes age, status and clan with remarkable precision.",
  },
  {
    name: "South Africa",
    dress: "Isicholo, Xhosa umbhaco, Ndebele blankets",
    languages: "Zulu, Xhosa, Afrikaans, English, +7",
    crafts: "Ndebele wall painting, Zulu telephone-wire baskets",
    sites: "Robben Island, Mapungubwe, Cradle of Humankind",
    festival: "Umhlanga, Cape Town Carnival",
    note: "Ndebele geometric murals are a direct conversation partner to Rwandan Imigongo.",
  },
];

function Heritage() {
  const [selected, setSelected] = useState(NATIONS[0]!);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">African Heritage</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl lg:text-7xl">
            One continent, <span className="text-gradient-sunset">countless legacies.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Select a nation to explore its culture, traditional dress, languages, crafts, heritage
            sites and festivals as documented in the SAFIA archive.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {NATIONS.map((n) => (
              <button
                key={n.name}
                onClick={() => setSelected(n)}
                className={`rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                  selected.name === n.name
                    ? "border-gold bg-secondary text-gold"
                    : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
                }`}
              >
                {n.name}
              </button>
            ))}
          </nav>

          <article className="glass rounded-xl p-9">
            <h2 className="font-display text-4xl">{selected.name}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {selected.note}
            </p>
            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              <Item label="Traditional dress" value={selected.dress} />
              <Item label="Languages" value={selected.languages} />
              <Item label="Crafts & artforms" value={selected.crafts} />
              <Item label="Heritage sites" value={selected.sites} />
              <Item label="Festivals" value={selected.festival} />
            </dl>
          </article>
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
