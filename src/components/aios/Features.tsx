import {
  Bot,
  Braces,
  Brain,
  Camera,
  Code2,
  FileText,
  Film,
  Globe,
  Layers,
  Library,
  MessageSquare,
  Mic,
  MonitorSmartphone,
  Search,
  Users,
  Workflow,
} from "lucide-react";
import { GlowCard, Reveal, Section, SectionHeading } from "./primitives";

const features = [
  { icon: MessageSquare, title: "AI Chat", desc: "Multi-model conversations with shared memory." },
  { icon: Code2, title: "AI Coding", desc: "Repo-aware pair programming and refactors." },
  { icon: Search, title: "AI Research", desc: "Cited, deep-web research in seconds." },
  { icon: Camera, title: "AI Images", desc: "Generate, edit and upscale visual assets." },
  { icon: Film, title: "AI Videos", desc: "Text-to-video with scene continuity." },
  { icon: Mic, title: "AI Voice", desc: "Realtime speech in 40+ languages." },
  { icon: FileText, title: "AI Documents", desc: "Draft, summarize and restructure docs." },
  { icon: Bot, title: "AI Agents", desc: "Autonomous workers with tools and goals." },
  { icon: Library, title: "Prompt Library", desc: "Versioned prompts your whole team reuses." },
  { icon: Workflow, title: "Workflow Marketplace", desc: "Install automations in one click." },
  { icon: Globe, title: "Website Builder", desc: "Ship production sites from a brief." },
  { icon: MonitorSmartphone, title: "App Builder", desc: "Full-stack apps, generated and deployed." },
  { icon: Braces, title: "Browser Agent", desc: "Agents that click, scrape and verify." },
  { icon: Brain, title: "Memory", desc: "Persistent context across every surface." },
  { icon: Layers, title: "PDF Chat", desc: "Query thousand-page documents instantly." },
  { icon: Users, title: "Team Workspace", desc: "Roles, permissions and shared history." },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Capabilities"
        title="Everything you'd install, already running."
        description="Sixteen native systems sharing one memory, one billing surface and one interface."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 4) * 0.05}>
            <GlowCard className="h-full p-5">
              <f.icon className="size-5 text-accent" strokeWidth={1.5} />
              <p className="mt-8 text-[15px] font-medium tracking-tight">{f.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
