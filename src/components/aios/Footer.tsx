import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Github, Linkedin, Loader2, Twitter, Youtube } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuroraBackdrop, MagneticButton, Reveal } from "./primitives";

const emailSchema = z
  .string()
  .trim()
  .min(3, { message: "Please enter your email" })
  .max(255, { message: "Email must be less than 255 characters" })
  .email({ message: "Please enter a valid email address" });

const columns = [
  { title: "Product", links: ["Features", "Agents", "Marketplace", "Workspace", "Pricing"] },
  { title: "Developers", links: ["Docs", "API", "Changelog", "Status", "SDK"] },
  { title: "Company", links: ["Blog", "Careers", "Security", "Privacy", "Terms"] },
];

const socials = [
  { icon: Twitter, label: "AIOS on X" },
  { icon: Github, label: "AIOS on GitHub" },
  { icon: Linkedin, label: "AIOS on LinkedIn" },
  { icon: Youtube, label: "AIOS on YouTube" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    if (!consent) {
      setError("Please accept the privacy policy to continue.");
      return;
    }

    setError(null);
    setStatus("loading");

    const { error: insertError } = await supabase.from("leads").insert({
      email: parsed.data.toLowerCase(),
      source: "footer",
      consent: true,
      consent_at: new Date().toISOString(),
    });

    if (insertError && insertError.code !== "23505") {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
  };

  return (
    <footer id="footer" className="relative overflow-hidden">
      <AuroraBackdrop className="opacity-60" />

      <div className="mx-auto max-w-7xl px-6 pb-14 pt-24 md:pt-32">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] px-8 py-16 text-center md:px-16 md:py-24">
            <h2 className="mx-auto max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-6xl">
              Boot your <span className="text-aurora">intelligence layer</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground md:text-base">
              Join 50,000+ builders running everything AI inside one workspace.
            </p>

            <div className="mx-auto mt-9 min-h-[6rem] max-w-md">
              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="glass flex items-center gap-3 rounded-full py-3 pl-3 pr-6 text-left"
                    role="status"
                    aria-live="polite"
                  >
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 320, damping: 18 }}
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/20 text-accent ring-1 ring-accent/40"
                    >
                      <Check className="size-4" />
                    </motion.span>
                    <span className="text-sm text-foreground">
                      You&apos;re on the list.
                      <span className="block text-xs text-muted-foreground">
                        We&apos;ll email {email.trim().toLowerCase()} when your workspace is ready.
                      </span>
                    </span>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-2.5 sm:flex-row"
                    noValidate
                  >
                    <label htmlFor="newsletter" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      maxLength={255}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "newsletter-error" : undefined}
                      placeholder="you@company.com"
                      className="h-12 flex-1 rounded-full border border-input bg-secondary/40 px-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
                    />
                    <MagneticButton
                      type="submit"
                      strength={0.15}
                      className="h-12"
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          Joining
                        </span>
                      ) : (
                        "Start Free"
                      )}
                    </MagneticButton>
                  </motion.form>
                )}
              </AnimatePresence>

              {error && (
                <p
                  id="newsletter-error"
                  className="mt-3 text-xs text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

          </div>
        </Reveal>

        <div className="mt-20 grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative grid size-8 place-items-center rounded-xl bg-primary/20 ring-1 ring-primary/50">
                <span className="size-2 rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
              </span>
              <span className="text-base font-semibold tracking-[-0.02em]">AIOS</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The operating system for artificial intelligence.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#footer"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full glass text-muted-foreground transition-colors hover:text-foreground"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {c.title}
              </p>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#footer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="hairline mt-16" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} AIOS. All rights reserved.</p>
          <p>Built for people who ship.</p>
        </div>
      </div>
    </footer>
  );
}
