# Grok Build Prompt — Kept

You are the primary implementation engineer for **Kept**, a Devpost hackathon project. Build the complete MVP in this repository. Work carefully but move fast: this is a real, deployable product, not a design mockup.

## Start here

Read these files completely before changing code:

1. `docs/hackathon-build/learner-profile.md`
2. `docs/hackathon-build/scope.md`
3. `docs/hackathon-build/prd.md`
4. `docs/hackathon-build/spec.md`
5. `docs/hackathon-build/checklist.md`

The scope is intentional. Do not expand it without a concrete technical reason.

## Product in one sentence

**Kept helps creators keep the promises their content makes.** It turns text from posts/transcripts into an evidence-backed promise ledger, then helps a creator write and track the follow-up that fulfils each promise.

## Non-negotiables

- Build a new Next.js + TypeScript web app with a crisp, intentional design. It must not look like a generic AI dashboard.
- Use **Neon Postgres** for persistence and the **current official Neon Auth integration for Next.js** for authentication.
- Enable Google OAuth first and magic-link email as the fallback if the current Neon setup supports it. Do not use Clerk, NextAuth/Auth.js, a custom password system, or a duplicate user table.
- A user’s data must persist across a different browser/phone after signing into the same account. IP address is not identity.
- Every database read/write must derive the owner identity from the server-side session. Never trust `user_id` supplied by the client.
- Do not store social passwords, social tokens, browser cookies, or private messages.
- Do not connect to or scrape X, Instagram, YouTube, or LinkedIn. Use manual text/CSV input only.
- Do not build direct publishing, subscriptions, billing, teams, analytics, video upload, or a generic chatbot.
- Include a temporary seeded `/demo` mode for judges that does not write real user data.
- Build a deterministic promise detector as the reliability floor. Add optional server-only AI enrichment through an OpenAI-compatible provider; never make the demo depend entirely on a paid model call.
- Never expose AI or database secrets to the browser.

## Required user flow

```text
Landing page
→ Try demo OR sign in
→ add content by paste or CSV
→ scan promise debt
→ see original evidence quote + suggested promise + due state
→ draft follow-up
→ copy/open X intent if relevant
→ mark fulfilled
→ return on another device and see the same saved workspace
```

## Exact MVP features

1. Landing page that clearly explains “public promise debt.”
2. Guest demo with five seeded posts and three detectable promises.
3. Neon Auth-protected dashboard.
4. Cloud-persisted content items, promise records, and follow-up drafts.
5. Manual form and small CSV import.
6. Deterministic extraction of common phrases such as `I'll`, `I will`, `tomorrow`, `next post`, `next video`, `comment [keyword]`, `send`, `share`, `link`.
7. Optional AI enrichment using validated structured output.
8. Ledger ordering: overdue, due today, open, drafted, fulfilled/dismissed.
9. Evidence quote, confidence, editable summary/date, dismiss, reopen, and fulfil actions.
10. Editable follow-up draft with copy-to-clipboard and a safe X intent handoff.
11. Mobile-responsive UI, empty/error states, README, migrations, and `.env.example`.

## Implementation rules

1. Inspect the existing workspace before you create or overwrite files.
2. If the repo is empty, initialize it cleanly. If code exists, preserve working user changes and build around them.
3. Use the current official Neon Auth docs/setup generated for this project. Do not guess old package APIs. Document the exact auth setup in `README.md` and `.env.example`.
4. Use migrations for the schema in `spec.md`. Add owner indexes and a duplicate guard for a promise from the same source/evidence quote.
5. Implement only server-side database mutations and queries for authenticated user data.
6. Validate manual forms, CSV rows, route inputs, and model output with Zod.
7. Make AI optional. If no AI environment key exists or a provider request fails, deterministic extraction must still identify clear promises and keep the application usable.
8. Label all sample/demo data honestly. Never pass sample output off as a live social-platform integration.
9. Favor calm editorial hierarchy: readable typography, meaningful status colors, generous whitespace, strong evidence cards, and no overanimated glassmorphism.
10. Do not commit secrets. Create `.env.example` with placeholders only.

## Build order

Follow `docs/hackathon-build/checklist.md` in order. Make a focused commit after each stable slice where git is available. Do not jump to visual polish before auth/data and the scan loop work.

## Required verification before handoff

Run and fix failures for:

```bash
npm run lint
npm run typecheck
npm run build
```

Also manually verify:

- signed-out user cannot access a real dashboard;
- a signed-in user’s records survive reload and appear in another session;
- clear promise input works without AI configured;
- false positive can be dismissed;
- fulfilment persists;
- demo data does not leak into real data;
- core screen works at a narrow mobile width.

## Handoff to Codex

When you finish, create `BUILD_STATUS.md` in the repository with:

- what is fully working;
- commands run and their results;
- database/auth setup still required from the owner;
- any intentionally deferred features;
- known defects or rough edges;
- exact local run and deploy steps.

Do not claim completion if an important user flow was not actually verified. Leave the repo clean and ready for Codex to audit with `CODEX_FINISH_PROMPT.md`.
