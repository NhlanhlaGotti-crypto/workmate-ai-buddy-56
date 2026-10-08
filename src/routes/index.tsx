import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarCheck, Search, ArrowRight, Layers } from "lucide-react";
import { Disclaimer, Panel } from "@/components/workmate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkMate AI – Your AI-powered workplace productivity assistant" },
      { name: "description", content: "Save time. Work smarter. Get more done. Generate emails, summarize meetings, plan tasks and research topics." },
      { property: "og:title", content: "WorkMate AI – Workplace Productivity Assistant" },
      { property: "og:description", content: "Save time. Work smarter. Get more done." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft polished emails for any audience and tone in seconds." },
  { to: "/meetings", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn messy notes into decisions, action items and deadlines." },
  { to: "/planner", icon: CalendarCheck, title: "AI Task Planner", desc: "Prioritize tasks and get a realistic daily and weekly plan." },
  { to: "/research", icon: Search, title: "AI Research Assistant", desc: "Understand any topic with key points, insights and next questions." },
] as const;

const STEPS = ["Role", "Task", "Context", "Output format", "Tone", "Constraints"];

function Index() {
  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-4 inline-block rounded-full border border-primary-foreground/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-strong">
            Workplace Productivity Assistant
          </p>
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">WorkMate AI</h1>
          <p className="mt-4 max-w-2xl text-xl opacity-90 md:text-2xl">Your AI-powered workplace productivity assistant</p>
          <p className="mt-2 text-lg text-accent-strong">Save time. Work smarter. Get more done.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/email" className="btn-accent">Get started <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/about" className="inline-flex items-center rounded-lg border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold hover:bg-primary-foreground/10">Responsible AI</Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 font-display text-2xl font-bold">Your tools</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link key={f.to} to={f.to} className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-accent-strong">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground"><f.icon className="h-6 w-6" /></span>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-foreground">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>

        <Panel className="mt-12">
          <div className="flex items-center gap-3">
            <Layers className="h-6 w-6 text-accent-strong" />
            <h2 className="font-display text-2xl font-bold">How it works</h2>
          </div>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Each tool sends your input to an AI model together with a carefully structured prompt. The prompt clearly
            defines six parts, so the results are consistent, well-formatted and useful at work.
          </p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {STEPS.map((s, i) => (
              <li key={s} className="rounded-xl bg-secondary p-4">
                <span className="font-display text-2xl font-bold text-accent-strong">{i + 1}</span>
                <p className="mt-1 text-sm font-semibold">{s}</p>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="mt-8"><Disclaimer /></div>
      </main>
    </>
  );
}
