import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import hero from "@/assets/hero-imigongo.jpg";
import imigongo from "@/assets/collection-imigongo.jpg";
import umugara from "@/assets/collection-umugara.jpg";
import umukenyero from "@/assets/collection-umukenyero.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Virtual Gallery — Walk Through SAFIA Africa's Heritage Collection" },
      {
        name: "description",
        content:
          "An immersive virtual gallery of SAFIA Africa's luxury 3D heritage artwork, with hotspots, historical notes and direct commissioning.",
      },
      { property: "og:title", content: "SAFIA Africa Virtual Gallery" },
      {
        property: "og:description",
        content: "Explore gilded Imigongo, Umukenyero and Umugara masterpieces room by room.",
      },
    ],
  }),
  component: Gallery,
});

const ROOMS = [
  {
    id: "presidential",
    title: "Presidential Hall",
    image: hero,
    caption:
      "A0 scale installations for presidencies, ministries and five-star lobbies. 180 × 120 cm, gilded relief.",
  },
  {
    id: "imigongo",
    title: "Imigongo Room",
    image: imigongo,
    caption:
      "Spiral and chevron geometry from Nyarubuye, hand-built in clay and sealed with 24k highlights.",
  },
  {
    id: "textile",
    title: "Textile Wing",
    image: umukenyero,
    caption:
      "The Umukenyero rendered as sculptural drapery — ceremony translated into permanent relief.",
  },
  {
    id: "agaseke",
    title: "Agaseke Rotunda",
    image: umugara,
    caption: "Concentric peace-basket rhythms carved in deep relief and finished in antique brass.",
  },
];

function Gallery() {
  const [active, setActive] = useState(ROOMS[0]!);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">Virtual Gallery</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl lg:text-7xl">
            Step inside the <span className="text-gradient-sunset">museum.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
        <div className="relative overflow-hidden rounded-xl border border-border shadow-luxe">
          <img
            src={active.image}
            alt={active.title}
            loading="lazy"
            width={1920}
            height={1088}
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 lg:p-10">
            <p className="text-[10px] tracking-luxe text-gold">Now viewing</p>
            <h2 className="mt-2 font-display text-3xl lg:text-4xl">{active.title}</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">{active.caption}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ROOMS.map((r) => (
            <button
              key={r.id}
              onClick={() => setActive(r)}
              className={`group overflow-hidden rounded-lg border text-left transition-colors ${
                active.id === r.id ? "border-gold" : "border-border hover:border-gold/50"
              }`}
            >
              <img
                src={r.image}
                alt={r.title}
                loading="lazy"
                width={1024}
                height={1280}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="block px-3 py-2.5 text-[10px] tracking-luxe text-muted-foreground group-hover:text-foreground">
                {r.title}
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
