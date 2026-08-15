# Codex Finish Prompt — Kept

You are the senior finishing engineer for **Kept**. Grok already built the MVP. Do not rewrite it. Audit what exists, preserve working code, fix real gaps, prove the core loop on the live Neon account, and leave it submission-ready.

Repo: https://github.com/mojeebdev/kept  
Local workspace already has `.env.local`. Never print, commit, or log secrets.

## Read first

1. `BUILD_STATUS.md`
2. `docs/hackathon-build/scope.md`
3. `docs/hackathon-build/prd.md`
4. `docs/hackathon-build/spec.md`
5. `docs/hackathon-build/checklist.md`
6. `README.md`
7. `git status` and the current tree

Preserve unrelated user changes. Do not reset, force-push, or delete work to make the audit easier.

## Product truth

Kept is a private, cross-device public-promise ledger for creators.

```text
sign in -> save content -> scan promise evidence -> generate follow-up -> mark fulfilled -> return from another device
```

It is not a generic AI content generator, social scheduler, or auto-publisher.

## What Grok already did

Treat this as done unless you prove otherwise:

- Next.js 16 + TypeScript + Tailwind v4
- Landing + honest `/demo` (5 seeded posts, 3 promises, in-memory only)
- Neon Auth via `@neondatabase/auth` (`createNeonAuth`, handler, `proxy.ts`)
- Google first, magic-link / email OTP fallback. No Clerk, no Auth.js, no password UI
- Drizzle schema pushed to the owner’s Neon project: `profiles`, `content_items`, `promises`, `follow_up_drafts`
- Server-derived `user_id` on every query/mutation
- Deterministic scanner + optional NVIDIA NIM enrichment
- Ledger, promise detail, draft, copy, X intent, fulfil / dismiss / reopen
- `npm run lint`, `typecheck`, `test`, and `build` passed on the Grok pass

## Current AI setup (do not change unless broken)

```bash
AI_BASE_URL=https://integrate.api.nvidia.com/v1
AI_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
```

Key is already in `.env.local` as `AI_API_KEY` / `NVIDIA_API_KEY`.

NVIDIA notes from the Grok pass:

- The model rejects `extra_body`
- It often writes a thinking preamble before JSON
- It returns loose fields (`dueAt: "Tomorrow"`, numeric confidence, free-text `promiseType`)
- `lib/scan/ai.ts` already strips thinking text and `lib/scan/schema.ts` normalizes those fields
- A live enrichment call returned `used: true` after that fix

Deterministic extraction must still work if the key is missing or NVIDIA fails.

## What is still unverified

`BUILD_STATUS.md` is stale on this point. Neon + schema + NVIDIA key now exist locally. These were **not** proven end-to-end:

- Google sign-in and magic-link on this Neon Auth branch
- Signed-out user blocked from `/dashboard`
- Create content → scan → draft → fulfil → reload
- Same records in a second browser/session
- Demo data never writing to production tables
- Narrow mobile layout of landing, demo, dashboard, and promise detail

## Your job

Checklist item 10 only. Do not start Devpost video/screenshots unless the core loop is proven.

1. Inspect before editing. Prefer the smallest safe patch.
2. Live-verify auth, persistence, scan, draft, and fulfil against the existing `.env.local`.
3. Fix real defects only: auth/session bugs, owner-scope leaks, scan/date/Zod failures, demo/data leakage, broken empty/error states, mobile overflow, README/BUILD_STATUS drift.
4. Keep the editorial ledger look. Do not turn it into a generic AI dashboard.
5. Run and fix:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

6. Update `BUILD_STATUS.md` with what you actually verified, commands run, remaining owner steps, and known limits.
7. Align README with reality, including the NVIDIA model and base URL.

## Do not do

- Direct social OAuth, scraping, auto-publishing, billing, teams, analytics, file upload, scheduled digests
- Swap Neon Auth for Clerk / Auth.js
- Swap the NVIDIA model unless it is actually broken
- Commit `.env.local` or any secret
- Deploy, push, or open a PR unless the owner asks
- Expand scope to make the audit look bigger

## Done when

- Core loop works on a real signed-in account and survives reload
- Demo stays temporary and isolated
- Quality commands pass
- `BUILD_STATUS.md` is honest
- You report: files changed, tests run, blockers, and whether Kept is ready for screenshots/video/deploy
