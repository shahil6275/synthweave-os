import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, type CSSProperties } from "react";
import { ArrowRight, Play } from "lucide-react";
import { AuroraBackdrop, MagneticButton, Particles, TextReveal } from "./primitives";

const orbit = ["GPT", "Claude", "Gemini", "Llama", "Mistral", "Groq", "Qwen", "DeepSeek"];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });

  const coreX = useTransform(sx, (v) => v * -14);
  const coreY = useTransform(sy, (v) => v * -14);
  const panelX = useTransform(sx, (v) => v * 7);
  const panelY = useTransform(sy, (v) => v * 7);

  useEffect(() => {
    if (reduce) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      px.set((e.clientX / window.innerWidth - 0.5) * 2);
      py.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, px, py]);

  return (
    <section
      id="home"
      className="relative overflow-hidden pb-28 pt-36 md:pb-40 md:pt-52 lg:pt-56"
    >
      <AuroraBackdrop />
      <Particles count={18} />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.a
            href="#models"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2, ease: EASE }}
            className="mb-10 inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground transition-colors duration-200 hover:text-foreground md:text-xs"
          >
            <span className="size-1 rounded-full bg-accent" />
            The world&apos;s first AI operating system
            <ArrowRight className="size-3" strokeWidth={1.5} />
          </motion.a>

          <h1 className="max-w-5xl text-[clamp(3.25rem,10vw,8.75rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
            <TextReveal text="One Platform." delay={2.3} />
            <br />
            <span className="text-aurora">
              <TextReveal text="Every AI." delay={2.62} />
            </span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 3.05, ease: EASE }}
            className="mt-10 max-w-[640px] text-pretty text-[17px] leading-[1.75] text-muted-foreground md:text-lg"
          >
            Access 100+ AI models to build apps, generate images and video, write code
            and automate your work — with your entire team in one workspace.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 3.2, ease: EASE }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            <MagneticButton>
              Start Free <ArrowRight className="size-4" strokeWidth={1.75} />
            </MagneticButton>
            <MagneticButton variant="glass">
              <Play className="size-3.5 text-accent" /> Watch Demo
            </MagneticButton>
          </motion.div>
        </div>

        {/* Holographic AI core + orbiting models */}
        <motion.div
          style={{ x: coreX, y: coreY }}
          className="pointer-events-none relative mx-auto mt-24 h-[320px] w-full max-w-3xl md:mt-32 md:h-[440px]"
          aria-hidden
        >
          {/* light beams */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            {[-30, 8, 36].map((a, i) => (
              <span
                key={a}
                className="animate-beam absolute left-0 top-0 h-[520px] w-[70px] origin-center -translate-x-1/2 -translate-y-1/2 blur-2xl"
                style={
                  {
                    "--beam-angle": `${a}deg`,
                    animationDelay: `${i * 1.8}s`,
                    background:
                      "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--primary) 40%, transparent), color-mix(in oklab, var(--accent) 28%, transparent), transparent)",
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-primary/30 blur-[90px] md:size-80" />
          <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[70px]" />

          {[0, 1, 2].map((ring) => (
            <div
              key={ring}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border"
              style={{
                width: 200 + ring * 130,
                height: 200 + ring * 130,
                animation: `spin-slow ${18 + ring * 12}s linear infinite ${ring % 2 ? "reverse" : ""}`,
              }}
            />
          ))}

          {/* animated connections from core to each model */}
          <svg
            className="absolute inset-0 size-full"
            viewBox="0 0 800 440"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="aios-link" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            {orbit.map((name, i) => {
              const angle = (i / orbit.length) * Math.PI * 2;
              return (
                <line
                  key={name}
                  x1={400}
                  y1={220}
                  x2={400 + Math.cos(angle) * 190}
                  y2={220 + Math.sin(angle) * 190 * 0.55}
                  stroke="url(#aios-link)"
                  strokeWidth="1"
                  className="animate-dash"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              );
            })}
          </svg>

          {/* core with glass reflection */}
          <div className="absolute left-1/2 top-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-[2rem] glass-strong shadow-[var(--shadow-glow)]">
            <span
              className="absolute inset-x-0 top-0 h-1/2 opacity-50"
              style={{
                background:
                  "linear-gradient(to bottom, color-mix(in oklab, white 18%, transparent), transparent)",
              }}
            />
            <span className="relative text-sm font-semibold tracking-[0.28em]">AIOS</span>
          </div>

          {orbit.map((name, i) => {
            const angle = (i / orbit.length) * Math.PI * 2;
            const radius = 190;
            return (
              <div
                key={name}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%,-50%) translate(${Math.round(Math.cos(angle) * radius)}px, ${Math.round(Math.sin(angle) * radius * 0.55)}px)`,
                }}
              >
                <span
                  className="glass animate-float block rounded-full px-3.5 py-1.5 text-[11px] font-medium text-muted-foreground"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  {name}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Live dashboard preview */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 3.4, ease: EASE }}
          className="relative mx-auto -mt-16 max-w-5xl"
        >
          <motion.div
            style={{ x: panelX, y: panelY }}
            className="overflow-hidden rounded-3xl glass-strong shadow-[var(--shadow-elevated)]"
          >
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <span className="size-2.5 rounded-full bg-destructive/50" />
              <span className="size-2.5 rounded-full bg-chart-5/50" />
              <span className="size-2.5 rounded-full bg-accent/50" />
              <span className="ml-3 font-mono text-[11px] text-muted-foreground">
                aios://workspace/live
              </span>
            </div>
            <div className="grid gap-4 p-5 sm:gap-5 sm:p-7 md:grid-cols-3">
              {[
                { k: "Active agents", v: "12", d: "running" },
                { k: "Requests today", v: "48,201", d: "+18%" },
                { k: "Latency", v: "212ms", d: "p95" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-secondary/30 p-5">
                  <p className="text-xs text-muted-foreground">{s.k}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{s.v}</p>
                  <p className="mt-1 text-[11px] text-accent">{s.d}</p>
                </div>
              ))}
              <div className="md:col-span-3">
                <div className="flex h-28 items-end gap-1.5 rounded-2xl bg-secondary/30 p-4">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary/20 to-accent/60"
                      style={{
                        height: `${Math.round(18 + Math.abs(Math.sin(i / 3)) * 78)}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
