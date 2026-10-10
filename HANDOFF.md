# Assembly Notebook — Handoff to Claude Code

**Owner:** offquestxo · **Repo:** `offquestxo/assembly-notebook` (public)
**Deadline:** working on the family's phones/iPads **tonight (Sat Oct 10, 2026)** for the circuit assembly **Sun Oct 11, 2026**.
**Live site (once Pages is on):** `https://offquestxo.github.io/assembly-notebook/`
**Supabase project:** `Assembly-Notebook` · URL `https://fahzmhatfjvaeaaqcioj.supabase.co` (project ref `fahzmhatfjvaeaaqcioj`)

---

## 1. What this is

A family notebook + listening-games app for a one-day Jehovah's Witnesses **Circuit Assembly (with the Circuit Overseer), 2026–2027**, theme **"Happy Is the One Trusting In Jehovah" — Proverbs 16:20** / **"Người tin cậy Đức Giê-hô-va thật hạnh phúc!" — Châm ngôn 16:20**.

Users: a family of 4 (dad, mom, daughters 17 and 12), room for up to 7 profiles. Vietnamese level: beginner/intermediate. They use it on iPhones and iPads during the sessions, where **cell service is poor** and **everything must be silent**.

A working single-file prototype already exists: **`prototype/tin-cay-notebook.html`**. It was built as a claude.ai artifact (it uses `window.claude.use('db')` and `use('sample')`, which do NOT exist outside claude.ai). Reuse its **content data, UI, styling, and game logic**; replace its storage and AI layers with Supabase as described below.

## 2. Hard requirements

1. **Plain website on GitHub Pages.** No claude.ai dependency. Works in iOS Safari, iPadOS Safari, Android Chrome, desktop.
2. **Works with bad/no signal.**
   - Installable PWA (manifest + service worker). Opened once on Wi-Fi, "Add to Home Screen", then it must open and be fully usable offline.
   - **Local-first writes:** every note/game action saves to `localStorage` immediately, goes into an outbox, and syncs to Supabase when online (retry on `online` event + every ~15 s). The prototype already has this pattern (`write()` / `flush()` / `pending`); keep it.
   - Cache the last-known shared data locally so family notes/chat show offline.
   - Show a sync pill: Synced / Saved here · will sync / No signal · saved here.
3. **Silent.** No sound, no speech input. (Optional stretch only: a muted-by-default "🎧 Earbuds" toggle using the device's built-in `speechSynthesis` vi-VN voice for vocab. No Google/PhoWhisper — owner decided to skip those.)
4. **Language toggle:** `EN` · `EN+VI` · `VI` (VI = Vietnamese only, including UI labels). Per-device, remembered.
5. **Profiles:** in-app profiles (name + color), 1–7 per family. Each device remembers its current profile; anyone can switch. Profiles are NOT auth accounts.
6. **Family code gate:** first open asks for the family code. **The code is set by the owner as a Supabase secret `FAMILY_CODE`. Never commit the code to this public repo.**
7. **Secrets never in the repo or the browser:** Anthropic key lives only in Supabase Edge Function secrets. The Supabase URL + anon/publishable key are public by design and may be committed (RLS protects the data).
8. **Phone-first layout**, both light and dark themes, works at ~375 px width, safe-area insets respected.

## 3. Architecture

```
Phones/iPads ──► GitHub Pages (static: index.html, app.js, data.js, sw.js, manifest)
                    │  supabase-js (vendored locally so it's cached offline)
                    ├─ Supabase Auth: anonymous sign-in per device
                    ├─ Edge Function `join`  : checks FAMILY_CODE → adds auth.uid() to `members`
                    ├─ Postgres + RLS        : only members read/write; Realtime on all tables
                    └─ Edge Function `ai`    : member-only proxy to Anthropic Messages API
```

**No build step** preferred (plain HTML/CSS/ES modules) so GitHub Pages serves the repo root directly and there's nothing extra to break tonight. Use **relative paths** everywhere (site lives under `/assembly-notebook/`). Vendor `@supabase/supabase-js` v2 as a local ESM file (e.g. `vendor/supabase.js`) so the service worker can cache it; or pin a CDN URL and cache it in the SW — but local is safer offline.

Starter files are in `supabase/` (written without running them — **review and test**):
- `supabase/migrations/0001_init.sql` — tables, RLS, realtime, 7-profile limit
- `supabase/functions/join/index.ts`
- `supabase/functions/ai/index.ts`

### Data model (see SQL)
| Table | Key | Notes |
|---|---|---|
| `members` | `user_id` | anon auth users who entered the right code |
| `profiles` | `id` (text) | name, color; max 7 (trigger) |
| `notes` | `(part, profile_id)` | one note per talk part per person; also review answers (`rq1`..`rq5`) |
| `game_state` | `profile_id` | jsonb: bingo marks, verses, custom verses, word-match rounds, badges, etc. |
| `chat` | `id` | family chat messages (client-generated id for idempotent retry) |
| `predictions` | `(part, profile_id)` | Prediction Cards words |
| `live_quiz` / `quiz_answers` | | Live Family Quiz |

Client flow: `signInAnonymously()` → if not a member, show family-code screen → call `join` → load data → subscribe to Realtime `postgres_changes` → render. Upserts from the outbox. Last-writer-wins is fine.

## 4. Features (priority order — ship top-down, stop where time runs out)

**P0 — must work tonight**
1. Family code + profiles picker (port from prototype).
2. **Program tab:** all parts in order with times, "Now" banner by clock, song links (wol.jw.org), review question "listen for" box per talk, vocab chips, **my note** (ruled textarea, autosave) + **family notes** for each part (live).
3. **Family chat** (live) with optional AI "Translate" per message.
4. **Ask AI** (private per profile, history in localStorage) via `ai` function; quick-prompt chips; "Help me say my note in Vietnamese" button on each note.
5. **Games already in prototype:** Bingo (AM/PM cards, per-person shuffle), Scripture Hunt, Word Match, Review Questions; family points board.
6. **Words tab** with source badges and N/S notes; VI mode hides English until tapped.
7. PWA offline + outbox sync + GitHub Pages deploy.

**P1 — new quiet games (in this order)**
8. **Prediction Cards:** before a talk, each person picks/types 3 words they expect; tap when heard; +points per hit. Reveal everyone's after the talk.
9. **Live Family Quiz:** any profile posts a multiple-choice question (2–4 options, marks the right one); others answer silently; poster taps Reveal; points for correct.
10. **Lunch Quiz (AI):** button at lunch builds 5 multiple-choice questions from the family's morning notes (`ai` returns JSON), playable by everyone, EN or VI per toggle. Same for afternoon ("Ride-home Quiz").
11. **Bible Book Race:** match Vietnamese ↔ English Bible book names against a timer. **Get the Vietnamese book names from the Vietnamese Bible index on wol.jw.org** (`https://wol.jw.org/vi/wol/binav/r47/lp-vt`) — do not guess them. Already verified from the program: Châm ngôn (Proverbs), Lu-ca (Luke), Thi thiên (Psalms), 1 Cô-rinh-tô (1 Corinthians).
12. **Memory Flip:** concentration grid of VI/EN vocab pairs; best time per person.
13. **Who Am I?:** guess the Bible character (Barak, Deborah, the Shunammite woman, Elisha, Daniel, Hananiah, Mishael, Azariah) from 3 progressive clues; clues in the current language; names use the program's Vietnamese spellings. Keep clues accurate to Judges 4–5, 2 Kings 4, Daniel 1–3.
14. **Tone Marks (visual):** show a word, pick its tone (ngang, huyền `, sắc ´, hỏi ̉, ngã ~, nặng ̣); or show a tone name and pick the matching word.
15. **Badges** (e.g. Bingo!, Scripture Hunter, Note Taker ×5, Predictor) + **end-of-day AI recap** of the family's best notes.

## 5. Content rules (from the owner's project instructions — follow these)

- Official JW Vietnamese terminology takes priority. Source order: **jw.org (Vietnamese) → wol.jw.org (Vietnamese) → JW Language app**. Fallback: general dictionary, **clearly labeled "not verified against JW usage."**
- Vocab format: Vietnamese · easy English-style pronunciation (not IPA) · English meaning · source label · Northern/Southern note when relevant (Gi/D ≈ "z" North, "y" South; Tr ≈ "ch" North).
- Pronunciation spellings are approximations — say so in the UI.
- Tone: respectful, congregation-level (anh/chị), not slang, not archaic.
- **Do not reproduce publication text or song lyrics.** Titles/terms from the program are fine. Link to wol.jw.org for scriptures and songs instead of quoting them.
- All program content (titles, times, songs, review questions, verse links, vocab with source flags, bingo words) is already in the prototype's `<script>` constants: `THEME`, `PROGRAM`, `RQ`, `VERSES`, `VOCAB`, `BINGO`, `BINGO_EN`, `UI`. Move them into `data.js` unchanged. They were copied from:
  - Program EN: https://wol.jw.org/en/wol/d/r1/lp-e/1102027246 · VI: https://wol.jw.org/vi/wol/d/r47/lp-vt/1102027246
  - Review questions EN: https://wol.jw.org/en/wol/d/r1/lp-e/1102027247 · VI: https://wol.jw.org/vi/wol/d/r47/lp-vt/1102027247

## 6. AI (`ai` Edge Function)

- Caller must be signed in and in `members`; otherwise 403.
- Model from secret `AI_MODEL` (default `claude-haiku-5-5`, fast and cheap — confirm the current model id in Anthropic's docs). `max_tokens` capped (~1200). Reject oversized input (~40 KB).
- Modes the client uses: `chat`, `translate`, `quiz` (expects JSON back), `recap`. The client sends `system` + `messages`; reuse the prototype's `rules()` and `glossary()` for the system prompt. Key rule: label wording from the verified glossary "per wol.jw.org (program)"; anything else "Not verified against JW publications — check wol.jw.org or the JW Language app"; never invent quotations.
- Show friendly errors: no signal, rate limited, etc. AI needs signal; everything else must not.
- Streaming is nice-to-have, not required.

## 7. What the OWNER must do (Claude Code: walk him through these; never ask him to paste keys into chat)

1. **Supabase → Authentication → Sign In / Providers → enable "Anonymous sign-ins".**
2. **Supabase → Project Settings → API Keys:** copy the **anon / publishable** key (public, safe to commit) into `config.js`.
3. **Secrets** — he types these himself, either in Supabase dashboard **Edge Functions → Secrets**, or in his own terminal:
   ```
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...   # he pastes
   supabase secrets set FAMILY_CODE=....                # he types the family code
   supabase secrets set AI_MODEL=claude-haiku-5-5
   ```
4. **Database:** run `supabase/migrations/0001_init.sql` (dashboard **SQL Editor** paste-and-run, or `supabase db push` after `supabase link --project-ref fahzmhatfjvaeaaqcioj`).
5. **Deploy functions:** `supabase functions deploy join` and `supabase functions deploy ai` (needs `brew install supabase/tap/supabase` and `supabase login` on the Mac).
6. **GitHub → repo Settings → Pages → Deploy from a branch → `main` / root.**
7. On each phone/iPad: open the site on Wi-Fi, enter family code, pick profile, **Share → Add to Home Screen**, open from the icon once.

## 8. Test checklist before bed

- [ ] Site loads at the Pages URL on iPhone and iPad.
- [ ] Wrong family code is rejected; right code joins; the code does not appear anywhere in the repo or page source.
- [ ] Add 4 profiles; each device remembers its profile; switching works.
- [ ] Note typed on phone A appears on phone B within seconds.
- [ ] **Airplane mode:** app opens from home-screen icon, notes and games still work, pill shows "saved here"; turning airplane mode off syncs them.
- [ ] Family chat works both ways; Translate works.
- [ ] Ask AI answers and labels sources; works on two profiles separately.
- [ ] Bingo/Scripture Hunt/Word Match/Review Qs score correctly on the points board.
- [ ] EN / EN+VI / VI toggle changes titles and UI labels; VI hides English in Words until tapped.
- [ ] Light and dark mode both readable; no horizontal scrolling at phone width.
- [ ] No sound plays anywhere by default.
