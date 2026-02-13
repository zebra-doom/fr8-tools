import { Button } from "@/components/ui/button";
import {
  Train,
  BarChart3,
  Map,
  Zap,
  Leaf,
  GitBranch,
  ArrowRight,
  Github,
  Database,
  Cpu,
  Globe,
} from "lucide-react";
import Link from "next/link";

const TECH_STACK = [
  { name: "Python", icon: Cpu },
  { name: "FastAPI", icon: Zap },
  { name: "LangChain", icon: GitBranch },
  { name: "LangGraph", icon: GitBranch },
  { name: "SQLite", icon: Database },
  { name: "Next.js 15", icon: Globe },
  { name: "TypeScript", icon: Cpu },
  { name: "Tailwind CSS", icon: Zap },
  { name: "SSE Streaming", icon: Globe },
  { name: "GitHub Actions", icon: Github },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Natural Language Queries",
    description:
      "Ask about train routes in plain English. The AI translates your question to SQL, executes it, and formats the results.",
  },
  {
    icon: BarChart3,
    title: "Smart Visualizations",
    description:
      "Auto-generated charts for comparing routes, emissions, and transit times using Recharts.",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description:
      "GeoJSON-powered route visualization on Leaflet maps with terminal markers across Europe.",
  },
  {
    icon: Leaf,
    title: "CO2 Emission Analysis",
    description:
      "Compare train vs truck emissions. Find the greenest freight routes and quantify CO2 savings.",
  },
  {
    icon: GitBranch,
    title: "Agentic AI Workflow",
    description:
      "LangGraph StateGraph with conditional routing, SQL retry loops, and parallel response formatting.",
  },
  {
    icon: Train,
    title: "European Coverage",
    description:
      "12,000+ terminals, 7,000+ train connections, 50+ operators across 15+ European countries.",
  },
];

const WORKFLOW_STEPS = [
  { label: "Question", desc: "Natural language input" },
  { label: "SQL Gen", desc: "LLM generates query" },
  { label: "Execute", desc: "Run against database" },
  { label: "Validate", desc: "Check results or fix" },
  { label: "Format", desc: "Markdown + chart + map" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]">
              <Train className="h-4 w-4 text-[var(--primary-foreground)]" />
            </div>
            <span className="text-lg font-bold tracking-tight">FR8 Tools</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/zebra-doom/fr8-tools"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm">
                <Github className="mr-1.5 h-4 w-4" />
                Source
              </Button>
            </a>
            <Link href="/chat">
              <Button size="sm">
                Open Chat
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-gradient">
        <div className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center md:pb-32 md:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm text-[var(--muted-foreground)]">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            AI-Powered Freight Intelligence
          </div>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Intermodal Rail
            <br />
            <span className="gradient-text">Freight Intelligence</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
            Query European train connections, analyze CO2 emissions, and
            visualize freight routes — all through natural language conversation
            powered by LangGraph agents.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/chat">
              <Button size="lg" className="gap-2 px-8">
                Try the Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://github.com/zebra-doom/fr8-tools"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2 px-8">
                <Github className="h-4 w-4" />
                View Source
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-y border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
            How It Works
          </h2>
          <h3 className="mb-10 text-center text-2xl font-bold">
            Agentic AI Workflow
          </h3>
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-0">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                    Step {i + 1}
                  </span>
                  <span className="font-semibold">{step.label}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {step.desc}
                  </span>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <ArrowRight className="mx-2 hidden h-4 w-4 shrink-0 text-[var(--muted-foreground)] md:block" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            If SQL execution fails, the workflow automatically routes to a
            fix node and retries — up to 2 attempts with error-aware correction.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
          Capabilities
        </h2>
        <h3 className="mb-12 text-center text-2xl font-bold">
          Built for the Full Stack
        </h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)]/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                <f.icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <h4 className="font-semibold">{f.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="border-y border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
            Architecture
          </h2>
          <h3 className="mb-8 text-center text-2xl font-bold">
            System Overview
          </h3>
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted)] p-6 font-mono text-xs leading-relaxed md:text-sm">
            <pre className="overflow-x-auto">{`
              Vercel                          Railway
        ┌─────────────────┐           ┌──────────────────────┐
 User ─►│  Next.js 15     │── SSE ───►│  FastAPI             │
        │  + Tailwind CSS │  /api/chat│  + LangGraph agents  │
        │  + Recharts     │◄──────────│  + LangChain + GPT-4o│
        │  + Leaflet      │  stream   │  + SQLite            │
        └─────────────────┘           └──────────────────────┘`}</pre>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
          Technology
        </h2>
        <h3 className="mb-8 text-2xl font-bold">Tech Stack</h3>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {TECH_STACK.map((tech) => (
            <span
              key={tech.name}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--primary)]/30"
            >
              <tech.icon className="h-3.5 w-3.5 text-[var(--primary)]" />
              {tech.name}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--accent)] p-10 text-center">
          <h2 className="text-2xl font-bold">Ready to explore?</h2>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Ask about freight routes, compare CO2 emissions, or discover
            terminals across Europe.
          </p>
          <Link href="/chat">
            <Button size="lg" className="mt-6 gap-2 px-8">
              Start a Conversation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-sm font-semibold">FR8 Tools</span>
          </div>
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            Portfolio showcase — Python, AI/ML, LangChain, LangGraph, and
            full-stack deployment
          </p>
          <a
            href="https://github.com/zebra-doom/fr8-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
