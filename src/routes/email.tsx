import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Field, Output, PageHeader, Panel, Shell, useAI } from "@/components/workmate";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator – WorkMate AI" },
      { name: "description", content: "Generate professional emails by tone and audience." },
      { property: "og:title", content: "Smart Email Generator – WorkMate AI" },
      { property: "og:description", content: "Generate professional emails by tone and audience." },
    ],
  }),
  component: EmailPage,
});

const empty = { recipient: "", purpose: "", info: "", tone: "Formal", audience: "Manager" };

function EmailPage() {
  const [f, setF] = useState(empty);
  const ai = useAI("email");
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = () => {
    if (!f.recipient.trim() || !f.purpose.trim() || !f.info.trim()) {
      toast.error("Please fill in recipient, purpose and key information.");
      return;
    }
    ai.run(`Recipient: ${f.recipient}\nPurpose: ${f.purpose}\nKey information: ${f.info}\nTone: ${f.tone}\nAudience: ${f.audience}`);
  };

  return (
    <Shell>
      <PageHeader icon={Mail} title="Smart Email Generator" desc="Describe your email and get a ready-to-send draft." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="space-y-4">
          <Field label="Recipient"><input className="input-base" value={f.recipient} onChange={set("recipient")} placeholder="e.g. Sarah, Head of Marketing" maxLength={200} /></Field>
          <Field label="Purpose of the email"><input className="input-base" value={f.purpose} onChange={set("purpose")} placeholder="e.g. Request a deadline extension" maxLength={300} /></Field>
          <Field label="Key information"><textarea className="input-base min-h-32" value={f.info} onChange={set("info")} placeholder="Important details to include…" maxLength={3000} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tone">
              <select className="input-base" value={f.tone} onChange={set("tone")}>
                {["Formal", "Friendly", "Persuasive"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Audience">
              <select className="input-base" value={f.audience} onChange={set("audience")}>
                {["Manager", "Client", "Team", "Colleague"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="btn-primary" onClick={submit} disabled={ai.loading}><Sparkles className="h-4 w-4" /> Generate Email</button>
            <button className="btn-ghost" onClick={() => { setF(empty); ai.setOutput(""); }}>Clear</button>
          </div>
        </Panel>
        <Output title="Your email" text={ai.output} loading={ai.loading} />
      </div>
    </Shell>
  );
}
