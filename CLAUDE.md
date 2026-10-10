# CLAUDE.md

Read **HANDOFF.md** first — it is the full spec, deadline, architecture, owner steps and test checklist.

Quick rules:
- Deadline is tonight; ship P0 features first (HANDOFF §4), then P1 games in order.
- Start from `prototype/tin-cay-notebook.html` — reuse its content constants, UI and game logic. Replace `window.claude.*` storage/AI calls with Supabase (see `supabase/`).
- Static site on GitHub Pages, no build step, relative paths, PWA offline, local-first outbox sync.
- Never commit secrets or the family code. Never ask the owner to paste API keys into chat; have him set them as Supabase secrets himself.
- Silent app: no sound by default, no speech input.
- Vietnamese content: official JW wording first (jw.org → wol.jw.org → JW Language app); label anything else "not verified against JW usage"; give easy pronunciation + N/S notes; don't reproduce publication text or song lyrics.
- The `supabase/` SQL and functions are untested drafts — review and test them.
