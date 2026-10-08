import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Briefcase, Copy, Loader2, ShieldAlert, Menu, X, type LucideIcon } from "lucide-react";
import { generateAI } from "@/lib/ai.functions";
import type { Feature } from "@/lib/prompts";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/email", label: "Email" },
  { to: "/meetings", label: "Meetings" },
  { to: "/planner", label: "Planner" },
  { to: "/research", label: "Research" },
  { to: "/about", label: "Responsible AI" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-5 w-5" />
          </span>
          WorkMate <span className="text-accent-strong">AI</span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="nav-link" activeProps={{ className: "nav-link-active" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: true }} className="nav-link" activeProps={{ className: "nav-link-active" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-foreground">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
      <p>
        <strong>Responsible AI:</strong> AI-generated content should be reviewed and verified before being used for important
        workplace decisions or communications. Do not enter confidential, private, or sensitive company information.
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">WorkMate AI</p>
          <p className="mt-2 text-sm opacity-75">Save time. Work smarter. Get more done.</p>
        </div>
        <div className="flex flex-col gap-1 text-sm opacity-90">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="hover:underline">{n.label}</Link>
          ))}
        </div>
        <p className="text-sm opacity-75">
          Always review AI output before use. © {new Date().getFullYear()} WorkMate AI.
        </p>
      </div>
    </footer>
  );
}

export function PageHeader({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card p-6 shadow-card ${className}`}>{children}</div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

export function useAI(feature: Feature) {
  const fn = useServerFn(generateAI);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const run = async (input: string, simple?: boolean) => {
    setLoading(true);
    try {
      const r = await fn({ data: { feature, input, simple } });
      if (r.ok) setOutput(r.text);
      else toast.error(r.error);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return { output, setOutput, loading, run };
}

export function Output({ text, loading, title }: { text: string; loading: boolean; title: string }) {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  return (
    <Panel className="min-h-[360px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <button className="btn-ghost" disabled={!text || loading} onClick={copy}>
          <Copy className="h-4 w-4" /> Copy
        </button>
      </div>
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-accent-strong" />
          Generating with AI…
        </div>
      ) : text ? (
        <div className="ai-output">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
          Your AI-generated result will appear here.
        </div>
      )}
    </Panel>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {children}
      <div className="mt-8"><Disclaimer /></div>
    </main>
  );
}
