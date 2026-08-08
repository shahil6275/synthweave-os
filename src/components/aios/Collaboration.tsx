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

      <div className="grid gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
        {collab.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05}>
            <GlowCard className="h-full">
              <c.icon className="size-5 text-accent" strokeWidth={1.5} />
              <p className="mt-10 text-[15px] font-medium tracking-tight">{c.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {c.desc}
              </p>
            </GlowCard>
          </Reveal>
        ))}
      </div>

      <div className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4 md:mt-28">
        {stats.map((s, i) => (
          <div
            key={s.l}
            className="bg-background/80 px-8 py-14 text-center backdrop-blur md:py-16"
          >
            <Reveal delay={i * 0.06} y={16}>
              <p className="text-[clamp(2.75rem,5vw,4rem)] font-semibold leading-none tracking-[-0.045em] text-aurora">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </p>
            </Reveal>
            <Reveal delay={i * 0.06 + 0.18} y={10}>
              <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                {s.l}
              </p>
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}
