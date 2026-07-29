import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export function Loader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(100, (elapsed / 1900) * 100);
      setProgress(p);
      if (p < 100) frame = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 260);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="aurora-field absolute inset-0 opacity-40" aria-hidden />
          <div className="relative flex flex-col items-center gap-10">
            <div className="relative size-40">
              <div className="absolute inset-0 animate-pulse-glow rounded-full bg-primary/30 blur-2xl" />
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_18px_var(--color-accent)]" />
              </motion.div>
              <motion.div
                className="absolute inset-5 rounded-full border border-accent/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              >
                <span className="absolute left-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_16px_var(--color-primary)]" />
              </motion.div>
              <div className="absolute inset-12 rounded-full glass-strong" />
              <motion.span
                className="absolute inset-0 flex items-center justify-center text-lg font-semibold tracking-[0.32em] text-foreground"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                AI
              </motion.span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-px w-56 overflow-hidden bg-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
                Booting AIOS {Math.round(progress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
