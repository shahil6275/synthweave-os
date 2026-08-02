import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuroraBackdrop } from "@/components/aios/primitives";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — AIOS Admin" },
      { name: "description", content: "Sign in to the AIOS admin workspace to manage captured leads and consent records." },
      { property: "og:title", content: "Sign in — AIOS Admin" },
      { property: "og:description", content: "Sign in to the AIOS admin workspace to manage captured leads and consent records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    if (mode === "signin") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      navigate({ to: "/admin/leads", replace: true });
      return;
    }

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin/leads` },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setNotice("Check your inbox to confirm your email, then sign in.");
    setLoading(false);
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 py-20">
      <AuroraBackdrop className="opacity-60" />
      <div className="glass-strong w-full max-w-md rounded-[2rem] p-8">
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">
          {mode === "signin" ? "Sign in to AIOS" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Admin access is required to view lead records.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="h-12 rounded-full border border-input bg-secondary/40 px-5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
          />
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-12 rounded-full border border-input bg-secondary/40 px-5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        {error && <p className="mt-3 text-xs text-destructive" role="alert">{error}</p>}
        {notice && <p className="mt-3 text-xs text-accent" role="status">{notice}</p>}

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-6 text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
