import { Reveal, Section } from "./primitives";

const integrations = [
  "Google",
  "GitHub",
  "Figma",
  "Slack",
  "Discord",
  "Notion",
  "Docker",
  "n8n",
  "Zapier",
  "VS Code",
];

export function Integrations() {
  const row = [...integrations, ...integrations];

  return (
    <Section id="integrations" className="py-20 md:py-24">
      <Reveal>
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Connected to the tools you already run
        </p>
      </Reveal>

      <div
        className="relative mt-10 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="marquee-track flex w-max gap-4">
          {row.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="glass flex min-w-[168px] items-center justify-center gap-3 rounded-2xl px-6 py-5"
            >
              <span className="size-2 rounded-full bg-accent/70" />
              <span className="text-sm text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
