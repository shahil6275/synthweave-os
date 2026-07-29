import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/components/aios/Loader";
import { Cursor, SmoothScroll } from "@/components/aios/Chrome";
import { Navbar } from "@/components/aios/Navbar";
import { Hero } from "@/components/aios/Hero";
import { Models } from "@/components/aios/Models";
import { Features } from "@/components/aios/Features";
import { Workspace } from "@/components/aios/Workspace";
import { Agents } from "@/components/aios/Agents";
import { Marketplace } from "@/components/aios/Marketplace";
import { Integrations } from "@/components/aios/Integrations";
import { Collaboration } from "@/components/aios/Collaboration";
import { Testimonials } from "@/components/aios/Testimonials";
import { Pricing } from "@/components/aios/Pricing";
import { Faq } from "@/components/aios/Faq";
import { Footer } from "@/components/aios/Footer";

const title = "AIOS — One Platform. Every AI.";
const description =
  "AIOS is the operating system for AI: 100+ models, agents, workflows, code, images, video and team collaboration in one premium workspace.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AIOS",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background">
      <Loader />
      <SmoothScroll />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Models />
        <Features />
        <Workspace />
        <Agents />
        <Marketplace />
        <Integrations />
        <Collaboration />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
