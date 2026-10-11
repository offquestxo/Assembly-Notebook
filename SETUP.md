# Setup — do these once, tonight

You type every secret yourself. Never paste the Anthropic key or the family code into a chat or into this repo.

## 1. Supabase dashboard (project `Assembly-Notebook`)

1. **Authentication → Sign In / Providers → turn on "Allow anonymous sign-ins"** → Save.
2. **SQL Editor → New query** → paste all of `supabase/migrations/0001_init.sql` → **Run**. It's safe to run again if something fails partway.
3. **Project Settings → API Keys** → copy the **anon / publishable** key (starts `eyJ…` or `sb_publishable_…`). Open `config.js` and replace `PASTE_PUBLISHABLE_KEY_HERE` with it. This key is public by design, so committing it is fine. **Never** use the `service_role` / secret key here.

## 2. Secrets + Edge Functions (Terminal on the Mac)

```bash
brew install supabase/tap/supabase
supabase login
cd assembly-notebook
supabase link --project-ref fahzmhatfjvaeaaqcioj
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...      # paste your key here, in your own terminal
supabase secrets set FAMILY_CODE=your-family-code       # not case-sensitive; make it 8+ characters
supabase secrets set AI_MODEL=claude-haiku-5-5
supabase functions deploy join --no-verify-jwt
supabase functions deploy ai --no-verify-jwt
```

`--no-verify-jwt` is intentional. Both functions check the caller's token themselves, so this works with Supabase's old and new key systems.

(If you'd rather not use the CLI, you can set the same three secrets in the dashboard under **Edge Functions → Secrets**. The functions still have to be deployed with the CLI because they share `supabase/functions/_shared/common.ts`.)

## 3. GitHub Pages

Commit and push to `main`, then go to **GitHub → repo Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)`** → Save.
After a minute or two the site is at `https://offquestxo.github.io/Assembly-Notebook/`.

## 4. Each phone / iPad (on Wi-Fi)

1. Open the site in **Safari**.
2. **Share → Add to Home Screen** *first*. On iPhone and iPad, the home-screen app keeps its own data, separate from Safari's.
3. Open it **from the new icon**, enter the family code, and pick (or add) your name.
4. Switch through every tab once while you're on Wi-Fi so everything is cached.

## Shipping a fix later tonight

Change `VERSION` in `sw.js` (e.g. `v1-2026-10-10b`) and push. Phones show a gold **"Update ready · tap to reload"** button the next time they open the app with signal.

## Test checklist

See HANDOFF.md §8. The quickest offline test: open the app from the icon, turn on Airplane mode, write a note and tap some bingo squares. The pill should say "No signal · saved here". Turn Airplane mode off and it changes to "Synced with family" within about 15 s.
