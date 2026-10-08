import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Field, Output, PageHeader, Panel, Shell, useAI } from "@/components/workmate";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant – WorkMate AI" },
      { name: "description", content: "Get simple explanations, key points and insights on any topic." },
      { property: "og:title", content: "AI Research Assistant – WorkMate AI" },
      { property: "og:description", content: "Get simple explanations, key points and insights on any topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [text, setText] = useState("");
  const [simple, setSimple] = useState(false);
  const ai = useAI("research");
  const submit = () => {
    if (text.trim().length < 3) return toast.error("Please enter a topic or paste some information.");
    ai.run(text, simple);
  };
  return (
    <Shell>
      <PageHeader icon={Search} title="AI Research Assistant" desc="Enter a topic or paste information to understand it quickly." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="space-y-4">
          <Field label="Topic or information">
            <textarea className="input-base min-h-64" value={text} onChange={(e) => setText(e.target.value)} maxLength={15000} placeholder="e.g. How does hybrid work affect team productivity?" />
          </Field>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-secondary p-3 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[var(--accent-strong)]" checked={simple} onChange={(e) => setSimple(e.target.checked)} />
            <span><strong>Explain in simple language</strong> — no jargon, easy to understand</span>
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" onClick={submit} disabled={ai.loading}><Sparkles className="h-4 w-4" /> Research</button>
            <button className="btn-ghost" onClick={() => { setText(""); ai.setOutput(""); }}>Clear</button>
          </div>
        </Panel>
        <Output title="Findings" text={ai.output} loading={ai.loading} />
      </div>
    </Shell>
  );
}
