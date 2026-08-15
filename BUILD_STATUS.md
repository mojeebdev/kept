# BUILD_STATUS — Kept

Grok implementation pass. Ready for Codex audit with `CODEX_FINISH_PROMPT.md`.

## What is fully working

- Next.js 16 + TypeScript + Tailwind v4 app scaffolded in this repo.
- Public landing page that explains **public promise debt**.
- Guest `/demo` with five seeded posts and three detectable promises, including “Comment TEMPLATE and I’ll send it tomorrow.” Demo state is in-memory only and is labeled temporary.
- Neon Auth integration using the current official stack:
  - `@neondatabase/auth` `createNeonAuth` / `createAuthClient`
  - `app/api/auth/[...path]/route.ts` handler
  - `proxy.ts` middleware protecting `/dashboard/*`
  - Google OAuth primary + magic-link / email OTP fallback
- Server-derived identity on every repository call. Client-supplied `user_id` is ignored.
- Drizzle schema + SQL migration for `profiles`, `content_items`, `promises`, `follow_up_drafts` with owner indexes and a unique guard on `(user_id, content_item_id, evidence_quote)`.
- Manual content form and CSV import with Zod + row-level errors.
- Deterministic scanner for `I'll` / `I will` / tomorrow / next post|video / `comment KEYWORD` / send / share / link. Optional server-only AI enrichment.
- Ledger ordered overdue → due today → open → drafted → fulfilled/dismissed. No-date promises are never overdue.
- Promise detail: evidence first, editable summary/date, dismiss / reopen / fulfil, follow-up draft, copy, safe X intent.
- README, `.env.example`, tests for extraction and urgency.

## Commands run and results

| Command | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm test` | Pass — 10 tests (5 extraction, 5 urgency) |
| `npm run build` | Pass (Next.js 16.3.1). Auth catch-all no longer prerenders cookies. |

Demo seed check: 5 contents → 3 promises.

## Database / auth setup still required from the owner

This machine does not have a live Neon project wired for end-to-end sign-in.

1. Create a Neon project and enable **Auth**.
2. Copy `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and generate `NEON_AUTH_COOKIE_SECRET`.
3. Enable Google on the Auth branch. Register `{NEON_AUTH_BASE_URL}/callback/google` for production.
4. Enable Magic Link (or Email OTP).
5. Add `http://localhost:3000` and the Vercel domain to trusted domains.
6. Apply `drizzle/0000_kept_schema.sql` or run `npx drizzle-kit push`.
7. Sign in on two browsers and confirm the same ledger.

Until those exist, `/` and `/demo` work; `/dashboard` redirects to sign-in and cannot persist.

## Intentionally deferred

- Deploy, screenshots, and demo video (checklist items 10–11 — Codex / owner).
- Direct social OAuth, publishing, billing, teams, analytics, file upload, scheduled digests.
- `drizzle-kit pull` of `neon_auth.*` (needs a live Auth-enabled database). App tables use `user_id` UUID without a hard FK to `neon_auth.user`.
- Password sign-up UI (out of spec).

## Known defects / rough edges

- Cross-device persistence and Google/magic-link were **not** live-verified here. Do not treat them as proven until the owner env is connected.
- `lucide-react` is installed per spec but barely used; the visual language is type + stamps, not icon chrome.
- Auth UI provider still wraps the tree so Neon AuthView works for magic-link callback paths. Custom `/auth/sign-in` is the primary screen.
- AI enrichment is best-effort. Invalid or missing provider output falls back to deterministic matches.

## Local run

```bash
cp .env.example .env.local   # then fill Neon values
npx drizzle-kit push
npm install
npm run dev
```

Open `http://localhost:3000`, then `/demo` for the judge path.

## Deploy

Vercel-compatible. Set the same env vars. Re-apply the SQL schema. Add the production origin to Neon Auth trusted domains. Do not deploy from this pass unless asked.

## Design note

Editorial ledger, not an AI dashboard: recycled-stone paper, IBM Plex Serif/Sans/Mono, oxide-teal seal, rubber-stamp statuses, perforated evidence tickets.
