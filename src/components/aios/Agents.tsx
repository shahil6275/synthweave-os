import { Bot, Briefcase, Cpu, LineChart, Megaphone, Search } from "lucide-react";
import { GlowCard, Reveal, Section, SectionHeading } from "./primitives";

const agents = [
  { icon: Cpu, name: "Coding Agent", desc: "Reads your repo, ships PRs, writes tests.", stat: "4.2k tasks/day" },
  { icon: Search, name: "Research Agent", desc: "Crawls, verifies and cites at scale.", stat: "180 sources/run" },
  { icon: Megaphone, name: "Marketing Agent", desc: "Campaigns, copy and creative on brand.", stat: "12 channels" },
  { icon: LineChart, name: "Trading Agent", desc: "Signals, backtests and risk guardrails.", stat: "Realtime feeds" },
  { icon: Briefcase, name: "Business Agent", desc: "Reports, forecasts and board decks.", stat: "SOC2 ready" },
  { icon: Bot, name: "Automation Agent", desc: "Chains tools across your whole stack.", stat: "300+ actions" },
];

export function Agents() {
  return (
    <Section id="agents">
      <SectionHeading
        eyebrow="Autonomy"
        title="Agents that finish the work."
        description="Give them a goal, tools and memory. They plan, execute and report back."
      />

      <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 hidden size-full lg:block"
          viewBox="0 0 1200 620"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M200 160 H1000 M200 460 H1000 M200 160 V460 M600 160 V460 M1000 160 V460"
            stroke="color-mix(in oklab, var(--color-primary) 45%, transparent)"
            strokeWidth="1"
            className="animate-dash"
          />
        </svg>
        {agents.map((a, i) => (
          <Reveal key={a.name} delay={(i % 3) * 0.07}>
            <GlowCard className="h-full p-7">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
                  <a.icon className="size-5 text-accent" strokeWidth={1.5} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {a.stat}
                </span>
              </div>
              <p className="mt-10 text-xl font-medium tracking-tight">{a.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              <div className="hairline mt-7" />
              <p className="mt-4 text-xs text-accent">Deploy in one click →</p>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
