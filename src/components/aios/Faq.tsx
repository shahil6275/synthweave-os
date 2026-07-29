import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What makes AIOS an operating system and not another AI wrapper?",
    a: "Wrappers proxy a single model. AIOS runs a shared kernel: one memory layer, one permission model, one billing surface, and a scheduler that routes any task to the best of 100+ models across every provider.",
  },
  {
    q: "Do I need my own API keys?",
    a: "No. Every model is included in your plan. Bring your own keys if you prefer — AIOS will route through them and keep the same fallback and cost controls.",
  },
  {
    q: "Can agents act on my real tools?",
    a: "Yes. Agents get scoped tool access to GitHub, Slack, Notion, Docker, n8n, Zapier and more, with per-role permissions and full audit logs.",
  },
  {
    q: "How is my data handled?",
    a: "Your prompts and files are never used for training. Enterprise workspaces support private model hosting, region pinning, SSO/SCIM and retention policies.",
  },
  {
    q: "Can I move my team over without disruption?",
    a: "Import prompts, docs and chat history in a single migration step. Roles, permissions and spend limits map to your existing structure.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <SectionHeading eyebrow="FAQ" title="Questions, answered." />

      <div className="mx-auto max-w-3xl">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={cn(
                      "text-[15px] font-medium tracking-tight transition-colors md:text-lg",
                      isOpen ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {f.q}
                  </span>
                  <Plus
                    className={cn(
                      "size-4 shrink-0 text-accent transition-transform duration-500",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
