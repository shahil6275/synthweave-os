import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { AuroraBackdrop, MagneticButton, Particles, TextReveal } from "./primitives";

const orbit = [
  "GPT",
  "Claude",
  "Gemini",
  "Llama",
  "Mistral",
  "Groq",
  "Qwen",
  "DeepSeek",
];

const subLines = [
  "Access 100+ AI models.",
  "Build apps. Generate images. Create videos.",
  "Write code, research faster, automate everything —",
  "and collaborate with your team.",
];

export function Hero() {
  const reduce = useReducedMotion();
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      setParallax({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  return (
    <section id="home" className="relative overflow-hidden pb-24 pt-40 md:pb-32 md:pt-52">
      <AuroraBackdrop />
      <Particles count={40} />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          <motion.a
            href="#models"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.2 }}
            className="glass mb-9 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-tight text-muted-foreground transition-colors hover:text-foreground"
          >
            <Sparkles className="size-3.5 text-accent" />
            The world&apos;s first AI operating system
            <ArrowRight className="size-3.5" />
          </motion.a>

          <h1 className="max-w-5xl text-[clamp(3rem,10vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
            <TextReveal text="One Platform." delay={2.25} />
            <br />
            <span className="text-aurora">
              <TextReveal text="Every AI." delay={2.45} />
            </span>
          </h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 max-w-2xl space-y-1.5 text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {subLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-11 flex flex-wrap items-center justify-center gap-3"
          >
            <MagneticButton>
              Start Free <ArrowRight className="size-4" />
            </MagneticButton>
            <MagneticButton variant="glass">
              <Play className="size-3.5 text-accent" /> Watch Demo
            </MagneticButton>
          </motion.div>
        </div>

        {/* Holographic AI core + orbiting models */}
        <motion.div
          style={{
            transform: `translate3d(${parallax.x * -14}px, ${parallax.y * -14}px, 0)`,
          }}
          className="pointer-events-none relative mx-auto mt-24 h-[320px] w-full max-w-3xl md:h-[420px]"
          aria-hidden
        >
          <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-primary/40 blur-[90px] md:size-80" />
          <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-[70px]" />

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

          <div className="absolute left-1/2 top-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] glass-strong">
            <span className="text-sm font-semibold tracking-[0.28em]">AIOS</span>
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
          initial={reduce ? false : { opacity: 0, y: 60, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.4, delay: 3.05, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto -mt-16 max-w-5xl"
          style={{
            transform: `perspective(1400px) translate3d(${parallax.x * 8}px, ${parallax.y * 8}px, 0)`,
          }}
        >
          <div className="overflow-hidden rounded-3xl glass-strong shadow-[var(--shadow-elevated)]">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-chart-5/70" />
              <span className="size-2.5 rounded-full bg-accent/70" />
              <span className="ml-3 font-mono text-[11px] text-muted-foreground">
                aios://workspace/live
              </span>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-3">
              {[
                { k: "Active agents", v: "12", d: "running" },
                { k: "Requests today", v: "48,201", d: "+18%" },
                { k: "Latency", v: "212ms", d: "p95" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-secondary/40 p-4">
                  <p className="text-xs text-muted-foreground">{s.k}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{s.v}</p>
                  <p className="mt-1 text-[11px] text-accent">{s.d}</p>
                </div>
              ))}
              <div className="md:col-span-3">
                <div className="flex h-28 items-end gap-1.5 rounded-2xl bg-secondary/40 p-4">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-primary/30 to-accent/80"
                      style={{
                        height: `${Math.round(18 + Math.abs(Math.sin(i / 3)) * 78)}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
