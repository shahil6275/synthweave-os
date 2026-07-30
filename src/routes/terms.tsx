import { createFileRoute, Link } from "@tanstack/react-router";
import { AuroraBackdrop, Reveal } from "@/components/aios/primitives";

const title = "Terms of Service — AIOS";
const description =
  "AIOS terms of service: the rules and responsibilities for using the AIOS platform.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AuroraBackdrop className="opacity-40" />

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav
          aria-label="Main"
          className="mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 glass-strong"
        >
          <Link to="/" className="flex items-center gap-2.5">
            <span className="relative grid size-8 place-items-center rounded-xl bg-primary/20">
              <span className="absolute inset-0 rounded-xl border border-primary/50" />
              <span className="size-2 rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
            </span>
            <span className="text-base font-semibold tracking-[-0.02em]">AIOS</span>
          </Link>
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back home
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-36 md:pt-44">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            App-owned editable content
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            This page is maintained by AIOS to describe the rules and responsibilities for using
            the platform. It is app-owned editable content, not independent legal advice.
          </p>
        </Reveal>

        <div className="mt-12 space-y-10">
          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Acceptance</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              By accessing or using AIOS, you agree to these terms. If you do not agree, do not use
              the platform.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Accounts</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You are responsible for keeping your account credentials secure and for all activity
              under your account. AIOS reserves the right to suspend accounts that violate these
              terms.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Acceptable use</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Do not use AIOS for illegal, harmful, or abusive purposes.</li>
              <li>Do not attempt to bypass access controls or scrape the platform.</li>
              <li>Respect the intellectual property rights of others.</li>
              <li>Do not upload or process sensitive data you are not authorized to handle.</li>
            </ul>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Subscriptions and billing</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Some AIOS features require a paid subscription. Fees are billed in advance and are
              non-refundable unless required by law or stated otherwise at checkout.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Intellectual property</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              AIOS owns the platform, branding, and underlying software. You retain ownership of the
              content you create, and you grant AIOS only the rights necessary to operate the
              service for you.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Limitation of liability</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              AIOS is provided as-is. To the extent permitted by law, AIOS is not liable for
              indirect, incidental, or consequential damages arising from your use of the platform.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Changes and termination</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              AIOS may update these terms or the platform at any time. Continued use after changes
              means you accept the updated terms. Either party may terminate the account relationship
              at any time.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              For questions about these terms, contact{" "}
              <a
                href="mailto:legal@aios.example"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
              >
                legal@aios.example
              </a>
              .
            </p>
          </section>

          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}.
          </p>
        </div>
      </main>
    </div>
  );
}
