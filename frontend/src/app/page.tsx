import { Button } from "@/components/ui/button";
import { Train, BarChart3, Map, Zap, Leaf, GitBranch } from "lucide-react";
import Link from "next/link";

const TECH_STACK = [
  "Python",
  "FastAPI",
  "LangChain",
  "LangGraph",
  "PostgreSQL",
  "Next.js 15",
  "TypeScript",
  "Tailwind CSS",
  "SSE Streaming",
  "GitHub Actions",
];

const FEATURES = [
  {
    icon: Zap,
    title: "Natural Language Queries",
    description: "Ask about train routes in plain English — AI translates to SQL and fetches results.",
  },
  {
    icon: BarChart3,
    title: "Smart Visualizations",
    description: "Automatic chart generation for comparing routes, emissions, and transit times.",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description: "GeoJSON-powered route visualization on Leaflet maps with terminal markers.",
  },
  {
    icon: Leaf,
    title: "CO2 Analysis",
    description: "Compare train vs truck emissions and find the greenest freight routes across Europe.",
  },
  {
    icon: GitBranch,
    title: "Agentic AI Workflow",
    description: "LangGraph orchestrates NL→SQL→Execute→Validate→Fix with conditional retry loops.",
  },
  {
    icon: Train,
    title: "European Coverage",
    description: "Data spanning terminals across 15+ European countries with real operator schedules.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <Train className="h-6 w-6 text-[var(--primary)]" />
          <span className="text-xl font-bold">FR8 Tools</span>
        </div>
        <Link href="/chat">
          <Button size="sm">Open Chat</Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-32">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Intermodal Rail Freight
          <br />
          <span className="text-[var(--primary)]">Intelligence</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted-foreground)]">
          AI-powered platform for querying European intermodal train connections,
          analyzing CO2 emissions, and optimizing freight routes — all through
          natural language.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/chat">
            <Button size="lg">Try the Demo</Button>
          </Link>
          <a
            href="https://github.com/zebra-doom/fr8-tools"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">
              View Source
            </Button>
          </a>
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-6 font-mono text-sm leading-relaxed">
          <pre className="overflow-x-auto">{`
  User ──► Next.js 15 (Vercel) ──SSE──► FastAPI (Railway)
           + shadcn/ui                   + LangGraph agents
           + Recharts            ◄───    + LangChain + GPT-4o
           + Leaflet             stream  + PostgreSQL
          `}</pre>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-10 text-center text-2xl font-bold">Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[var(--border)] p-5 transition-colors hover:bg-[var(--muted)]"
            >
              <f.icon className="mb-3 h-6 w-6 text-[var(--primary)]" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
        <h2 className="mb-6 text-2xl font-bold">Tech Stack</h2>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-6 text-center text-sm text-[var(--muted-foreground)]">
        Built as a portfolio showcase — demonstrating Python, AI/ML, LangChain,
        LangGraph, and full-stack deployment.
      </footer>
    </main>
  );
}
