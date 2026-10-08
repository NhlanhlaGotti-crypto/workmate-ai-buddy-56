import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Output, PageHeader, Panel, Shell, useAI } from "@/components/workmate";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner – WorkMate AI" },
      { name: "description", content: "Prioritize tasks and generate daily and weekly schedules." },
      { property: "og:title", content: "AI Task Planner – WorkMate AI" },
      { property: "og:description", content: "Prioritize tasks and generate daily and weekly schedules." },
    ],
  }),
  component: PlannerPage,
});

type Task = { name: string; deadline: string; priority: "High" | "Medium" | "Low"; hours: string };
const blank: Task = { name: "", deadline: "", priority: "Medium", hours: "1" };
const badge = { High: "bg-destructive/10 text-destructive", Medium: "bg-accent text-accent-foreground", Low: "bg-secondary text-muted-foreground" };

function PlannerPage() {
  const [draft, setDraft] = useState<Task>(blank);
  const [tasks, setTasks] = useState<Task[]>([]);
  const ai = useAI("planner");

  const add = () => {
    if (!draft.name.trim()) return toast.error("Please enter a task name.");
    if (!(Number(draft.hours) > 0)) return toast.error("Estimated time must be greater than 0.");
    setTasks([...tasks, { ...draft, name: draft.name.trim() }]);
    setDraft(blank);
  };
  const plan = () => {
    if (!tasks.length) return toast.error("Add at least one task first.");
    const today = new Date().toISOString().slice(0, 10);
    ai.run(`Today's date: ${today}\nTasks:\n` + tasks.map((t, i) => `${i + 1}. ${t.name} | Deadline: ${t.deadline || "none"} | Priority: ${t.priority} | Estimated: ${t.hours}h`).join("\n"));
  };

  return (
    <Shell>
      <PageHeader icon={CalendarCheck} title="AI Task Planner" desc="Add your tasks, then let AI build a practical schedule." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input-base sm:col-span-2" placeholder="Task name" value={draft.name} maxLength={200} onChange={(e) => setDraft({ ...draft, name: e.target.value })} onKeyDown={(e) => e.key === "Enter" && add()} />
            <input type="date" className="input-base" value={draft.deadline} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })} aria-label="Deadline" />
            <select className="input-base" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as Task["priority"] })} aria-label="Priority">
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
            <input type="number" min="0.25" step="0.25" className="input-base" value={draft.hours} onChange={(e) => setDraft({ ...draft, hours: e.target.value })} aria-label="Estimated hours" />
            <button className="btn-ghost" onClick={add}><Plus className="h-4 w-4" /> Add task</button>
          </div>
          <ul className="space-y-2">
            {tasks.length === 0 && <li className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">No tasks yet.</li>}
            {tasks.map((t, i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm">
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${badge[t.priority]}`}>{t.priority}</span>
                <span className="flex-1 font-medium">{t.name}</span>
                <span className="text-muted-foreground">{t.hours}h{t.deadline && ` · ${t.deadline}`}</span>
                <button aria-label="Remove task" onClick={() => setTasks(tasks.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" onClick={plan} disabled={ai.loading}><Sparkles className="h-4 w-4" /> Generate Plan</button>
            <button className="btn-ghost" onClick={() => { setTasks([]); ai.setOutput(""); }}>Clear</button>
          </div>
        </Panel>
        <Output title="Your plan" text={ai.output} loading={ai.loading} />
      </div>
    </Shell>
  );
}
