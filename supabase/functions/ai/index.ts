// ai: member-only proxy to the Anthropic Messages API. The key never reaches the browser.
// Secrets: ANTHROPIC_API_KEY, AI_MODEL (optional).
// Request body: { system: string, messages: [{role:"user"|"assistant", content:string}], max_tokens?: number }
// Response: { text: string } or { error: string }
import { caller, cors, isMember, json } from "../_shared/common.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const user = await caller(req);
  if (!user) return json({ error: "not_signed_in" }, 401);
  if (!(await isMember(user.id))) return json({ error: "not_member" }, 403);

  const raw = await req.text();
  if (raw.length > 40_000) return json({ error: "too_large" }, 413);
  let body: { system?: string; messages?: { role: string; content: string }[]; max_tokens?: number };
  try { body = JSON.parse(raw); } catch { return json({ error: "bad_json" }, 400); }
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-24)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 8000) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "bad_messages" }, 400);

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "no_api_key" }, 500);

  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("AI_MODEL") || "claude-haiku-5-5",
        max_tokens: Math.min(Math.max(Number(body.max_tokens) || 800, 50), 1200),
        system: String(body.system ?? "").slice(0, 20_000),
        messages,
      }),
    });
  } catch {
    return json({ error: "upstream_error" }, 502);
  }
  if (res.status === 429) return json({ error: "rate_limited" }, 429);
  if (res.status === 529) return json({ error: "busy" }, 503);
  if (!res.ok) {
    console.error("anthropic", res.status, (await res.text()).slice(0, 500));
    return json({ error: "upstream_error" }, 502);
  }
  const data = await res.json();
  const text = (data.content ?? []).filter((c: { type: string }) => c.type === "text")
    .map((c: { text: string }) => c.text).join("");
  if (!text) return json({ error: "empty_completion" }, 502);
  return json({ text, truncated: data.stop_reason === "max_tokens" });
});
