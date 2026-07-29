import { Reveal, Section, SectionHeading } from "./primitives";

const testimonials = [
  {
    quote:
      "We replaced nine subscriptions with AIOS in a week. The model router alone cut our inference bill by 41%.",
    name: "Mara Lindqvist",
    role: "CTO, Northwind Labs",
  },
  {
    quote:
      "The coding agent opens PRs I'd actually approve. It reads the repo like a senior who's been here two years.",
    name: "Devan Rao",
    role: "Principal Engineer, Fielded",
  },
  {
    quote:
      "Research that took my team three days now lands before lunch — fully cited, fully auditable.",
    name: "Alice Bertrand",
    role: "Head of Strategy, Verge Capital",
  },
  {
    quote:
      "It's the first AI product that feels designed rather than assembled. Everything is where I expect it.",
    name: "Kenji Watanabe",
    role: "Design Director, Studio Atlas",
  },
  {
    quote:
      "Permissions and analytics made it an easy yes for security. Rolled out to 400 seats without a fight.",
    name: "Priya Nair",
    role: "VP Platform, Cobalt",
  },
];

function Card({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <figure className="glass-strong flex w-[340px] shrink-0 flex-col justify-between rounded-3xl p-7 md:w-[420px]">
      <blockquote className="text-[15px] leading-relaxed text-foreground/90">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-primary/20 text-[11px] font-medium">
          {t.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <span>
          <span className="block text-sm">{t.name}</span>
          <span className="block text-xs text-muted-foreground">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const row = [...testimonials, ...testimonials];

  return (
    <Section id="testimonials" className="max-w-none px-0">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Signal"
          title="Loved by the teams shipping fastest."
        />
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="marquee-track-slow flex w-max gap-5 px-6">
          {row.map((t, i) => (
            <Card key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </Section>
  );
}
