import { motion, useInView, useReducedMotion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ---------------- Reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(10px)" }}
      animate={
        inView || reduce ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
      }
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Word-by-word text reveal ---------------- */

export function TextReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden py-[0.06em]">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 1,
              delay: delay + i * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ---------------- Magnetic button ---------------- */

type MagneticProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "ghost" | "glass";
  strength?: number;
};

export function MagneticButton({
  children,
  className,
  variant = "primary",
  strength = 0.35,
  ...props
}: MagneticProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setOffset({
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.4 }}
      className={cn(
        "sheen relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "primary" &&
          "bg-primary text-primary-foreground glow-ring hover:bg-primary/90",
        variant === "glass" &&
          "glass-strong text-foreground hover:border-primary/40",
        variant === "ghost" &&
          "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  );
}

/* ---------------- Spotlight glass card ---------------- */

export function GlowCard({
  children,
  className,
  as: _as,
}: {
  children: ReactNode;
  className?: string;
  as?: never;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 0, active: false });

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
          active: true,
        });
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, active: false }))}
      className={cn(
        "group relative overflow-hidden rounded-3xl glass-strong p-5 transition-[transform,border-color,box-shadow] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-32px_color-mix(in_oklab,var(--primary)_60%,transparent)] sm:p-7",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------------- Section shell ---------------- */

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 md:py-32 lg:py-44",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-16",
        align === "center" ? "items-center text-center" : "items-start text-left",
      )}
    >
      <Reveal>
        <span className="inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground md:text-xs">
          <span className="size-1 rounded-full bg-accent" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="max-w-3xl text-balance text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "max-w-[640px] text-pretty text-[17px] leading-[1.7] text-muted-foreground md:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}


/* ---------------- Ambient background layers ---------------- */

export function AuroraBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="aurora-field animate-drift absolute -inset-[20%] opacity-[0.34]" />
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(70% 60% at 50% 30%, black, transparent 80%)",
        }}
      />
    </div>
  );
}

export function Particles({ count = 22 }: { count?: number }) {
  const reduce = useReducedMotion();
  const [seeds, setSeeds] = useState<
    { left: number; top: number; delay: number; dur: number; size: number }[]
  >([]);

  useEffect(() => {
    if (reduce) return;
    const mobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    const n = mobile ? Math.max(5, Math.round(count / 3)) : count;
    setSeeds(
      Array.from({ length: n }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 8 + Math.random() * 12,
        size: 1 + Math.random() * 2.4,
      })),
    );
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {seeds.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-accent/70 animate-float"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            boxShadow: "0 0 12px color-mix(in oklab, var(--accent) 70%, transparent)",
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- Animated counter ---------------- */

export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1600,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
