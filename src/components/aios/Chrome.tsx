import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** Lenis smooth scrolling, loaded client-side only. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;

    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}

/** Interactive glow cursor (pointer-fine devices only). */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 400, damping: 32, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHot(Boolean(el?.closest("a, button, input, [role='button']")));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
    >
      <motion.span
        animate={{ scale: hot ? 2.4 : 1, opacity: hot ? 0.55 : 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/70 blur-[1px] mix-blend-screen"
      />
      <span className="absolute left-0 top-0 block size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
    </motion.div>
  );
}
