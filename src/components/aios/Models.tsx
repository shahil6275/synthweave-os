import { useState } from "react";
import { motion } from "motion/react";
import { GlowCard, Reveal, Section, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const providers = [
  { name: "Gemini", models: 14, tag: "Multimodal" },
  { name: "OpenRouter", models: 220, tag: "Router" },
  { name: "Groq", models: 9, tag: "Ultra-fast" },
  { name: "Claude", models: 8, tag: "Reasoning" },
  { name: "GPT", models: 12, tag: "General" },
  { name: "DeepSeek", models: 6, tag: "Coding" },
  { name: "Llama", models: 11, tag: "Open" },
  { name: "Mistral", models: 10, tag: "Efficient" },
  { name: "Qwen", models: 13, tag: "Long context" },
  { name: "Hugging Face", models: 400, tag: "Community" },
  { name: "Cloudflare AI", models: 24, tag: "Edge" },
  { name: "Ollama", models: 60, tag: "Local" },
];

const switcher = [
  { name: "Claude Sonnet", meta: "Reasoning · 200k ctx", speed: 92 },
  { name: "GPT-5 Turbo", meta: "General · 128k ctx", speed: 86 },
  { name: "Groq Llama 70B", meta: "Realtime · 32k ctx", speed: 99 },
  { name: "Gemini Ultra", meta: "Multimodal · 1M ctx", speed: 78 },
];

export function Models() {
  const [active, setActive] = useState(0);

  return (
    <Section id="models">
      <SectionHeading
        eyebrow="Model layer"
        title="100+ models. One runtime."
        description="Route any prompt to any provider. AIOS handles keys, fallbacks, streaming and cost — you just pick the brain."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.03}>
            <GlowCard className="h-full p-5">
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary/60 text-xs font-semibold tracking-tight">
                  {p.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-accent">
                  {p.tag}
                </span>
              </div>
              <p className="mt-6 text-base font-medium tracking-tight">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.models}+ models available
              </p>
            </GlowCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-14 grid gap-0 overflow-hidden rounded-3xl glass-strong md:grid-cols-[minmax(0,320px)_1fr]">
          <div className="border-b border-border p-5 md:border-b-0 md:border-r">
            <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Model switcher
            </p>
            <ul className="space-y-1.5">
              {switcher.map((m, i) => (
                <li key={m.name}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={cn(
                      "relative w-full rounded-2xl px-4 py-3 text-left transition-colors",
                      active === i ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active === i ? (
                      <motion.span
                        layoutId="model-pill"
                        className="absolute inset-0 rounded-2xl bg-secondary/70 ring-1 ring-primary/40"
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      />
                    ) : null}
                    <span className="relative block text-sm font-medium">{m.name}</span>
                    <span className="relative block text-[11px] text-muted-foreground">
                      {m.meta}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-medium tracking-tight">{switcher[active].name}</p>
                <p className="text-xs text-muted-foreground">{switcher[active].meta}</p>
              </div>
              <span className="glass rounded-full px-3 py-1.5 text-[11px] text-accent">
                Streaming · live
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: "Throughput", v: switcher[active].speed },
                { label: "Reasoning depth", v: 100 - switcher[active].speed / 2 },
                { label: "Cost efficiency", v: (switcher[active].speed + 40) % 100 },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
                    <span>{bar.label}</span>
                    <span>{Math.round(bar.v)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      animate={{ width: `${bar.v}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-secondary/40 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
              <span className="text-accent">aios</span> run --model{" "}
              {switcher[active].name.toLowerCase().replace(/\s+/g, "-")} --stream
              <br />
              <span className="text-foreground">
                ✓ connected · 12ms handshake · fallback chain armed
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
