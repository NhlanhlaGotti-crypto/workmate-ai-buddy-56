import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SYSTEM_PROMPTS, SIMPLE_MODE } from "./prompts";

const schema = z.object({
  feature: z.enum(["email", "meeting", "planner", "research"]),
  input: z.string().trim().min(1, "Input is empty").max(20000),
  simple: z.boolean().optional(),
});

// The API key is configured as the server secret LOVABLE_API_KEY (never in browser code).
export const generateAI = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { ok: false as const, error: "AI is not configured (missing LOVABLE_API_KEY)." };

    const instructions = SYSTEM_PROMPTS[data.feature] + (data.simple ? SIMPLE_MODE : "");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        instructions,
        input: data.input,
      }),
    });

    if (!res.ok || !res.body) {
      let msg = "The AI service returned an error.";
      if (res.status === 429) msg = "Too many requests right now. Please wait a moment and try again.";
      else if (res.status === 402) msg = "AI credits have run out for this workspace. Please add credits to continue.";
      else {
        try {
          const j = await res.json();
          msg = j?.error?.message || j?.message || msg;
        } catch {}
      }
      return { ok: false as const, error: msg };
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    let failure: string | null = null;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "response.output_text.delta") text += ev.delta;
          else if (ev.type === "response.failed" || ev.type === "error")
            failure = ev.response?.error?.message || ev.message || "Generation failed.";
        } catch {}
      }
    }
    if (failure) return { ok: false as const, error: failure };
    if (!text.trim()) return { ok: false as const, error: "The AI returned no content for this request." };
    return { ok: true as const, text };
  });
