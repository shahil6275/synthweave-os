import { createFileRoute, Link } from "@tanstack/react-router";
import { AuroraBackdrop, Reveal } from "@/components/aios/primitives";

const title = "Privacy Policy — AIOS";
const description =
  "AIOS privacy practices: what data we collect, how we use it, and the choices you have.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            This page is maintained by AIOS to answer common privacy questions about the
            platform. It describes current practices and platform capabilities, not independent
            verification or legal advice.
          </p>
        </Reveal>

        <div className="mt-12 space-y-10">
          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">What this page covers</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This policy explains how AIOS handles personal information in the AIOS workspace,
              including data you provide directly, data generated while using models and agents,
              and data processed by the platform on your behalf.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Data we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Account information such as email address and workspace profile.</li>
              <li>Usage data including prompts, agent runs, and feature interactions.</li>
              <li>Billing and subscription information where applicable.</li>
              <li>Communications such as support requests and feedback.</li>
            </ul>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">How we use data</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>To provide, operate, and improve the AIOS platform and models.</li>
              <li>To authenticate users, enforce access controls, and keep the workspace secure.</li>
              <li>To send product updates, with consent, which you can withdraw at any time.</li>
              <li>To respond to support requests and troubleshoot issues.</li>
            </ul>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Sharing and subprocessors</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              AIOS relies on trusted infrastructure and AI providers to host and process data.
              Subprocessors include cloud hosting, authentication, payment, and model providers.
              A current list is available on request.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Your choices</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Update or delete your account from workspace settings.</li>
              <li>Unsubscribe from marketing emails using the link in every email.</li>
              <li>Request a copy or deletion of your data by contacting support.</li>
            </ul>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Security</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              AIOS uses encryption in transit, access controls, and regular security reviews. No
              system is completely secure, and we encourage users to protect their credentials and
              report suspected vulnerabilities.
            </p>
          </section>

          <section className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              For privacy questions or data requests, contact the AIOS team at{" "}
              <a
                href="mailto:privacy@aios.example"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-accent"
              >
                privacy@aios.example
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
