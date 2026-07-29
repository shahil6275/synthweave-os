import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { AuroraBackdrop, MagneticButton, Reveal } from "./primitives";

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
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-9 flex max-w-md flex-col gap-2.5 sm:flex-row"
            >
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                required
                placeholder="you@company.com"
                className="h-12 flex-1 rounded-full border border-input bg-secondary/40 px-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
              />
              <MagneticButton type="submit" strength={0.15} className="h-12">
                Start Free
              </MagneticButton>
            </form>
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
