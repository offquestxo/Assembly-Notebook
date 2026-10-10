// join: checks the family code and adds the caller's anonymous auth user to `members`.
// Secret: FAMILY_CODE (set by the owner; never committed).
import { admin, caller, cors, json } from "../_shared/common.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const user = await caller(req);
  if (!user) return json({ error: "not_signed_in" }, 401);

  const expected = (Deno.env.get("FAMILY_CODE") ?? "").trim().toLowerCase();
  if (!expected) return json({ error: "no_code_set" }, 500);
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code ?? "").trim().toLowerCase().slice(0, 100);
  if (code !== expected) {
    await new Promise((r) => setTimeout(r, 1500)); // slow down guessing
    return json({ error: "wrong_code" }, 403);
  }

  const { error } = await admin.from("members").upsert({ user_id: user.id });
  if (error) return json({ error: "server_error" }, 500);
  return json({ ok: true });
});
