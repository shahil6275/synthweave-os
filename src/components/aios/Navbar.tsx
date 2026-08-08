import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "./primitives";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Agents", href: "#agents" },
  { label: "Marketplace", href: "#marketplace" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#faq" },
  { label: "Blog", href: "#footer" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "glass shadow-[0_18px_50px_-30px_oklch(0_0_0/90%)]"
            : "border border-transparent bg-transparent",
        )}
      >
        <a href="#home" className="flex items-center gap-2.5">
          <span className="relative grid size-8 place-items-center rounded-xl bg-primary/20">
            <span className="absolute inset-0 rounded-xl border border-primary/50" />
            <span className="size-2 rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
          </span>
          <span className="text-base font-semibold tracking-[-0.02em]">AIOS</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <MagneticButton variant="ghost" className="px-4 py-2" strength={0.2}>
            Login
          </MagneticButton>
          <MagneticButton className="px-5 py-2.5" strength={0.25}>
            Get Started
          </MagneticButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid size-11 place-items-center rounded-full glass md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <motion.div
        aria-hidden
        style={{ width: barWidth }}
        className="mx-auto mt-2 h-px max-w-6xl bg-gradient-to-r from-primary/70 to-accent/70"
      />

      {open ? (
        <div className="glass-strong mx-auto mt-3 max-w-6xl rounded-3xl p-4 md:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <MagneticButton variant="glass" className="w-full" strength={0}>
              Login
            </MagneticButton>
            <MagneticButton className="w-full" strength={0}>
              Get Started
            </MagneticButton>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
