import { useState } from "react";
import { Check } from "lucide-react";
import { MagneticButton, Reveal, Section, SectionHeading } from "./primitives";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: { m: 0, y: 0 },
    blurb: "Explore the operating system.",
    features: ["20 models", "500 requests / mo", "1 agent", "Community prompts"],
  },
  {
    name: "Pro",
    price: { m: 24, y: 19 },
    blurb: "For builders who ship daily.",
    features: [
      "100+ models",
      "Unlimited chats",
      "10 agents",
      "Website & app builder",
      "Memory + PDF chat",
    ],
    featured: true,
  },
  {
    name: "Business",
    price: { m: 69, y: 55 },
    blurb: "For teams with shared context.",
    features: [
      "Everything in Pro",
      "Shared workspaces",
      "Roles & permissions",
      "Usage analytics",
      "Priority routing",
    ],
  },
  {
    name: "Enterprise",
    price: null,
    blurb: "For scale, security and control.",
    features: ["SSO & SCIM", "Private model hosting", "Audit logs", "Dedicated support", "Custom SLA"],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="One subscription. Every model."
        description="No per-provider keys, no surprise invoices. Switch or cancel any time."
      />

      <Reveal>
        <div className="mb-12 flex justify-center">
          <div className="glass inline-flex items-center rounded-full p-1">
            {(["Monthly", "Yearly"] as const).map((label) => {
              const isYear = label === "Yearly";
              const active = isYear === yearly;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setYearly(isYear)}
                  className={cn(
                    "rounded-full px-5 py-2 text-xs font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                  {isYear ? <span className="ml-2 text-[10px] opacity-80">−20%</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-4">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <div
              className={cn(
                "relative flex h-full flex-col rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1.5",
                t.featured
                  ? "glass-strong glow-ring ring-1 ring-primary/40"
                  : "glass",
              )}
            >
              {t.featured ? (
                <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary-foreground">
                  Most popular
                </span>
              ) : null}

              <p className="text-sm font-medium tracking-tight">{t.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.blurb}</p>

              <p className="mt-7 flex items-baseline gap-1.5">
                {t.price ? (
                  <>
                    <span className="text-4xl font-semibold tracking-[-0.03em]">
                      ${yearly ? t.price.y : t.price.m}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </>
                ) : (
                  <span className="text-4xl font-semibold tracking-[-0.03em]">Custom</span>
                )}
              </p>

              <ul className="mt-8 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>

              <MagneticButton
                variant={t.featured ? "primary" : "glass"}
                strength={0.15}
                className="mt-8 w-full"
              >
                {t.price ? "Start Free" : "Talk to sales"}
              </MagneticButton>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
