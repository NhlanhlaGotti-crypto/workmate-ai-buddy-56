import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Field, Output, PageHeader, Panel, Shell, useAI } from "@/components/workmate";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer – WorkMate AI" },
      { name: "description", content: "Summarize meeting notes into decisions, action items and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer – WorkMate AI" },
      { property: "og:description", content: "Summarize meeting notes into decisions, action items and deadlines." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const ai = useAI("meeting");
  const submit = () => {
    if (notes.trim().length < 20) { toast.error("Please paste your meeting notes (at least 20 characters)."); return; }
    ai.run(notes);
  };
  return (
    <Shell>
      <PageHeader icon={FileText} title="Meeting Notes Summarizer" desc="Paste raw notes and get a clean, structured summary." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="space-y-4">
          <Field label="Meeting notes">
            <textarea className="input-base min-h-80" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={15000}
              placeholder={"e.g. Weekly sync – Thabo, Lerato, James\n- Launch moved to 15 Nov\n- Lerato to finalize budget by Friday…"} />
          </Field>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" onClick={submit} disabled={ai.loading}><Sparkles className="h-4 w-4" /> Summarize</button>
            <button className="btn-ghost" onClick={() => { setNotes(""); ai.setOutput(""); }}>Clear</button>
          </div>
        </Panel>
        <Output title="Summary" text={ai.output} loading={ai.loading} />
      </div>
    </Shell>
  );
}
