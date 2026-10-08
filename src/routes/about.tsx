import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Eye, Lock, KeyRound } from "lucide-react";
import { PageHeader, Panel, Shell } from "@/components/workmate";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Responsible AI – WorkMate AI" },
      { name: "description", content: "How WorkMate AI uses structured prompts and our responsible AI guidelines." },
      { property: "og:title", content: "About & Responsible AI – WorkMate AI" },
      { property: "og:description", content: "How WorkMate AI uses structured prompts and our responsible AI guidelines." },
    ],
  }),
  component: AboutPage,
});

const ITEMS = [
  { icon: Eye, title: "Review everything", desc: "AI can make mistakes. Check facts, names, dates and numbers before sending or acting." },
  { icon: Lock, title: "Protect your data", desc: "Do not enter confidential, private, or sensitive company or personal information." },
  { icon: ShieldCheck, title: "You stay in charge", desc: "WorkMate AI drafts and suggests. Final decisions and communications are yours." },
  { icon: KeyRound, title: "Secure setup", desc: "The AI key is stored safely on the server (LOVABLE_API_KEY) and is never exposed in the browser." },
];

function AboutPage() {
  return (
    <Shell>
      <PageHeader icon={ShieldCheck} title="About & Responsible AI" desc="WorkMate AI helps employees, students, job seekers and professionals save time on everyday work." />
      <div className="grid gap-5 sm:grid-cols-2">
        {ITEMS.map((i) => (
          <Panel key={i.title}>
            <i.icon className="h-6 w-6 text-accent-strong" />
            <h2 className="mt-3 font-display text-lg font-semibold">{i.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{i.desc}</p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-6">
        <h2 className="font-display text-xl font-bold">Structured prompts</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every tool uses a prompt with a defined <strong>Role</strong>, <strong>Task</strong>, <strong>Context</strong>,{" "}
          <strong>Output format</strong>, <strong>Tone</strong> and <strong>Constraints</strong>. For example, the email
          tool tells the AI to act as a business communication writer, write one email under 250 words, match the
          requested tone, and never invent facts.
        </p>
      </Panel>
    </Shell>
  );
}
