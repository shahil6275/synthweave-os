import { Reveal, Section, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const shelves = [
  {
    title: "Prompt Marketplace",
    tag: "18,400 prompts",
    items: ["Cinematic image prompts", "Cold outreach that converts", "Legal clause auditor"],
  },
  {
    title: "Workflow Marketplace",
    tag: "6,200 workflows",
    items: ["Lead → CRM → Slack", "Repo audit → Jira tickets", "Podcast → clips → posts"],
  },
  {
    title: "Agent Marketplace",
    tag: "2,900 agents",
    items: ["SEO growth agent", "Support triage agent", "Financial analyst agent"],
  },
];

export function Marketplace() {
  return (
    <Section id="marketplace">
      <SectionHeading
        eyebrow="Marketplace"
        title="Install intelligence, don't build it."
        description="Thousands of community and studio-grade assets, one click from your workspace."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {shelves.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="group h-full overflow-hidden rounded-3xl glass-strong p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-medium tracking-tight">{s.title}</h3>
                <span className="text-[11px] text-muted-foreground">{s.tag}</span>
              </div>
              <ul className="mt-7 space-y-2.5">
                {s.items.map((item, j) => (
                  <li
                    key={item}
                    className={cn(
                      "flex items-center justify-between rounded-2xl bg-secondary/40 px-4 py-3 text-sm transition-all duration-500",
                      "group-hover:bg-secondary/70",
                    )}
                    style={{ transitionDelay: `${j * 60}ms` }}
                  >
                    <span className="text-muted-foreground group-hover:text-foreground">
                      {item}
                    </span>
                    <span className="text-[11px] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      Install
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
