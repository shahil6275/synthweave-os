import { Reveal, Section, SectionHeading } from "./primitives";

const files = [
  "app/",
  "  layout.tsx",
  "  page.tsx",
  "components/",
  "  agent-card.tsx",
  "  model-switcher.tsx",
  "lib/",
  "  aios.ts",
];

const code = [
  { n: 1, t: "import { agent } from \"@aios/core\";" },
  { n: 2, t: "" },
  { n: 3, t: "export const research = agent({" },
  { n: 4, t: "  model: \"auto\"," },
  { n: 5, t: "  tools: [browser, memory, pdf]," },
  { n: 6, t: "  goal: \"Summarize competitor pricing\"," },
  { n: 7, t: "});" },
  { n: 8, t: "" },
  { n: 9, t: "await research.run({ stream: true });" },
];

export function Workspace() {
  return (
    <Section id="workspace">
      <SectionHeading
        eyebrow="Workspace"
        title="An IDE, a chat and a browser — fused."
        description="Edit, prompt, preview and deploy without ever leaving the glass."
      />

      <Reveal>
        <div className="overflow-hidden rounded-3xl glass-strong shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-chart-5/70" />
            <span className="size-2.5 rounded-full bg-accent/70" />
            <span className="ml-3 font-mono text-[11px] text-muted-foreground">
              aios — studio
            </span>
          </div>

          <div className="grid lg:grid-cols-[180px_1fr_320px]">
            {/* File explorer */}
            <aside className="border-b border-border p-4 lg:border-b-0 lg:border-r">
              <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Explorer
              </p>
              <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                {files.map((f) => (
                  <li
                    key={f}
                    className="whitespace-pre rounded px-2 py-1 transition-colors hover:bg-secondary/60 hover:text-foreground"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </aside>

            {/* Editor + terminal */}
            <div className="border-b border-border lg:border-b-0 lg:border-r">
              <div className="flex gap-1 border-b border-border px-4 py-2 text-[11px]">
                <span className="rounded-md bg-secondary/70 px-2.5 py-1 font-mono">
                  aios.ts
                </span>
                <span className="rounded-md px-2.5 py-1 font-mono text-muted-foreground">
                  agent-card.tsx
                </span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-6">
                {code.map((l) => (
                  <div key={l.n} className="flex gap-4">
                    <span className="w-4 select-none text-right text-muted-foreground/50">
                      {l.n}
                    </span>
                    <span className="text-foreground/90">{l.t}</span>
                  </div>
                ))}
              </pre>
              <div className="border-t border-border bg-secondary/30 p-4 font-mono text-[11px] leading-relaxed">
                <p className="text-muted-foreground">$ aios dev</p>
                <p className="text-accent">▲ agent runtime ready on :3000</p>
                <p className="text-muted-foreground">✓ 4 tools mounted · memory synced</p>
              </div>
            </div>

            {/* Chat + preview */}
            <div className="flex flex-col">
              <div className="flex-1 space-y-3 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  AI Chat
                </p>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary/20 px-3.5 py-2.5 text-xs">
                  Add streaming to the research agent.
                </div>
                <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-secondary/60 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
                  Done — enabled token streaming and wired a fallback to Groq for
                  sub-200ms first token.
                </div>
              </div>
              <div className="border-t border-border p-4">
                <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Live preview
                </p>
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/25 via-secondary/40 to-accent/20 ring-1 ring-border" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
