import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SAFIA Africa — Vision, Mission & Impact" },
      {
        name: "description",
        content:
          "SAFIA Africa is a Pan-African institution preserving heritage, promoting African arts and advocating policy that safeguards the continent's shared history.",
      },
      { property: "og:title", content: "About SAFIA Africa" },
      {
        property: "og:description",
        content: "Our vision, mission, values and continental expansion strategy.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  ["Authenticity", "Every motif is sourced from a living cultural lineage, credited and licensed."],
  ["Excellence", "Museum-grade materials, finishes and archival standards on every commission."],
  ["Empowerment", "Artisans, cooperatives and young designers share in the value created."],
  ["Unity", "One continental identity, celebrated in fifty-four distinct voices."],
];

function About() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-aurora" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <p className="text-[10px] tracking-luxe text-gold">About SAFIA</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl lg:text-7xl">
            A political and cultural institution for{" "}
            <span className="text-gradient-sunset">African unity.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2">
          <article className="glass rounded-lg p-9">
            <p className="text-[10px] tracking-luxe text-gold">Vision</p>
            <p className="mt-5 font-display text-2xl leading-snug">
              To unify Africa by championing cultural heritage, creative innovation and political
              collaboration, ensuring sustainable development and a strong Pan-African identity.
            </p>
          </article>
          <article className="glass rounded-lg p-9">
            <p className="text-[10px] tracking-luxe text-gold">Mission</p>
            <p className="mt-5 font-display text-2xl leading-snug">
              To serve as a political and cultural institution that drives African unity through the
              preservation of heritage, promotion of African arts, and advocacy for policies that
              celebrate and safeguard the continent&apos;s shared history and future.
            </p>
          </article>
        </div>

        <div className="mt-24 grid gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-[10px] tracking-luxe text-gold">Who we are</p>
            <h2 className="mt-4 font-display text-4xl">The business of heritage.</h2>
            <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                SAFIA Africa is a Pan-African private company dedicated to preserving, documenting,
                licensing, branding and promoting Africa&apos;s cultural and historical heritage
                through innovative, technology-driven solutions.
              </p>
              <p>
                The company works with governments, cultural institutions, local communities,
                artisans and the private sector to protect heritage sites, strengthen cultural
                identity, and transform African heritage into sustainable economic opportunities.
              </p>
              <p>
                Through digital archives, heritage licensing, cultural tourism, creative industries,
                artisan empowerment, strategic partnerships and policy engagement, SAFIA Africa
                enhances the global visibility of Africa&apos;s rich legacy while creating
                employment, supporting local enterprises and advancing inclusive socio-economic
                development.
              </p>
              <p>
                By combining heritage preservation with innovation and commercial sustainability,
                SAFIA Africa is building a trusted continental platform that empowers Africans to
                preserve their past, celebrate their identity, and shape a prosperous future.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] tracking-luxe text-gold">Core values</p>
            {VALUES.map(([title, body]) => (
              <div key={title} className="rounded-lg border border-border bg-card/40 p-6">
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
