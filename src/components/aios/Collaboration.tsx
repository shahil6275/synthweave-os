import { BarChart3, KeyRound, MessagesSquare, ShieldCheck, Users } from "lucide-react";
import { Counter, GlowCard, Reveal, Section, SectionHeading } from "./primitives";

const collab = [
  { icon: MessagesSquare, title: "Shared Chats", desc: "Every conversation is a team artifact." },
  { icon: Users, title: "Shared Projects", desc: "Workspaces with unified context." },
  { icon: ShieldCheck, title: "Roles", desc: "Owner, admin, builder, viewer." },
  { icon: KeyRound, title: "Permissions", desc: "Per-model and per-tool access control." },
  { icon: BarChart3, title: "Analytics", desc: "Spend, usage and impact per seat." },
];

const stats = [
  { value: 100, suffix: "+", decimals: 0, l: "AI models" },
  { value: 1, suffix: "M+", decimals: 0, l: "AI requests" },
  { value: 50, suffix: "K+", decimals: 0, l: "Users" },
  { value: 99.99, suffix: "%", decimals: 2, l: "Uptime" },
];

export function Collaboration() {
  return (
    <Section id="teams">
      <SectionHeading
        eyebrow="Teams"
        title="Built for how teams actually work."
        description="Context, governance and spend — shared across everyone, not trapped in tabs."
        align="left"
      />

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {collab.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05}>
            <GlowCard className="h-full p-5">
              <c.icon className="size-5 text-accent" strokeWidth={1.5} />
              <p className="mt-8 text-[15px] font-medium tracking-tight">{c.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
            </GlowCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-background/80 px-8 py-12 text-center backdrop-blur">
              <p className="text-4xl font-semibold tracking-[-0.03em] text-aurora md:text-5xl">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
