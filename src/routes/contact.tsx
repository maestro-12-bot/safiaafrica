import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SAFIA Africa — Consultations, Quotations & Partnerships" },
      {
        name: "description",
        content:
          "Speak to SAFIA Africa about commissions, corporate and government installations, hospitality projects and heritage partnerships.",
      },
      { property: "og:title", content: "Contact SAFIA Africa" },
      {
        property: "og:description",
        content: "Book a consultation or request a formal quotation from our Kigali atelier.",
      },
    ],
  }),
  component: Contact,
});

const CLIENTS = [
  "Government & Presidency",
  "Embassies & Diplomatic Missions",
  "Five-star Hotels & Resorts",
  "Banks & Corporate HQs",
  "Luxury Homes & Collectors",
  "Tourism & Cultural Institutions",
];

function Contact() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">Contact</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl lg:text-7xl">
            Let&apos;s build something <span className="text-gradient-sunset">monumental.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="glass rounded-lg p-8">
            <MapPin className="size-5 text-gold" />
            <h2 className="mt-4 font-display text-2xl">Atelier</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Kigali, Rwanda — visits by appointment
            </p>
          </div>
          <div className="glass rounded-lg p-8">
            <Mail className="size-5 text-gold" />
            <h2 className="mt-4 font-display text-2xl">Email</h2>
            <a
              href="mailto:orders@safia.africa"
              className="mt-2 block text-sm text-muted-foreground hover:text-gold"
            >
              orders@safia.africa
            </a>
          </div>
          <div className="glass rounded-lg p-8">
            <Phone className="size-5 text-gold" />
            <h2 className="mt-4 font-display text-2xl">Consultations</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Corporate, government and hospitality briefings on request
            </p>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-[10px] tracking-luxe text-gold">Who we serve</p>
          <h2 className="mt-4 font-display text-4xl">Clients &amp; sectors.</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLIENTS.map((c) => (
              <li
                key={c}
                className="flex items-center gap-3 rounded-lg border border-border bg-card/40 px-5 py-4 text-sm text-muted-foreground"
              >
                <Building2 className="size-4 shrink-0 text-gold" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-16 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          For quotations, use the Customisation Studio on the Collections page — it generates an
          instant price and registers your order with our team. For bespoke or multi-site projects,
          email us with your brief and dimensions.
        </p>
      </section>
    </>
  );
}
