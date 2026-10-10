// ai: member-only proxy to the Anthropic Messages API. The key never reaches the browser.
// Secrets: ANTHROPIC_API_KEY, AI_MODEL (optional, default below — confirm current model id).
// Request body: { system: string, messages: [{role:"user"|"assistant", content:string}], max_tokens?: number }
// Response: { text: string } or { error: string }
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const userClient = createClient(url, anon, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: "not_signed_in" }, 401);
  const { data: isMember } = await userClient.rpc("is_member");
  if (!isMember) return json({ error: "not_member" }, 403);

  const raw = await req.text();
  if (raw.length > 40_000) return json({ error: "too_large" }, 413);
  let body: { system?: string; messages?: { role: string; content: string }[]; max_tokens?: number };
  try { body = JSON.parse(raw); } catch { return json({ error: "bad_json" }, 400); }
  const messages = (body.messages ?? []).filter((m) =>
    (m.role === "user" || m.role === "assistant") && typeof m.content === "string");
  if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "bad_messages" }, 400);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: Deno.env.get("AI_MODEL") || "claude-haiku-5-5",
      max_tokens: Math.min(Number(body.max_tokens) || 800, 1200),
      system: String(body.system ?? "").slice(0, 20_000),
      messages,
    }),
  });
  if (res.status === 429) return json({ error: "rate_limited" }, 429);
  if (!res.ok) return json({ error: "upstream_error" }, 502);
  const data = await res.json();
  const text = (data.content ?? []).filter((c: { type: string }) => c.type === "text")
    .map((c: { text: string }) => c.text).join("");
  return json({ text });
});
