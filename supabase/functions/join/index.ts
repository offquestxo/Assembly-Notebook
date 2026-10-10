// join: checks the family code and adds the caller's anonymous auth user to `members`.
// Secrets: FAMILY_CODE (set by the owner). SUPABASE_URL, SUPABASE_ANON_KEY and
// SUPABASE_SERVICE_ROLE_KEY are provided by Supabase — confirm the names for this project.
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
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const expected = (Deno.env.get("FAMILY_CODE") ?? "").trim();

  const userClient = createClient(url, anon, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: "not_signed_in" }, 401);

  const body = await req.json().catch(() => ({}));
  const code = String(body?.code ?? "").trim();
  if (!expected || code !== expected) {
    await new Promise((r) => setTimeout(r, 1500)); // slow down guessing
    return json({ error: "wrong_code" }, 403);
  }

  const admin = createClient(url, service);
  const { error } = await admin.from("members").upsert({ user_id: user.id });
  if (error) return json({ error: "server_error" }, 500);
  return json({ ok: true });
});
