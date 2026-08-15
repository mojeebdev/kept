# Build Checklist

## Build Preferences

- **Build mode:** Handoff — Grok implements the MVP first; Codex performs the audit-and-finish pass.
- **Comprehension checks:** N/A during Grok’s bulk build; Codex must report material decisions and blockers.
- **Git:** Commit at each stable slice: bootstrap, database/auth, core scan, dashboard/actions, release polish.
- **Verification:** Required after auth/data, scan engine, and deployment.
- **Check-in cadence:** Speed-run, with one enforced handoff report before Codex begins.
- **Wow moment:** A live scan turns a forgotten “I’ll send the template tomorrow” promise into evidence, an overdue action, and a ready-to-use reply.

## Checklist

- [x] **1. Bootstrap the new Kept project and quality gates**
  Spec ref: `spec.md > Stack` and `spec.md > Suggested File Structure`
  What to build: Create a clean TypeScript Next.js project, Tailwind styling, lint/typecheck/build scripts, base layout, `.env.example`, and the planning docs copied into the repo.
  Acceptance: `npm run lint`, `npm run typecheck`, and `npm run build` are available; no secret is committed.
  Verify: Run all three commands on a fresh install.

- [x] **2. Provision Neon database and write migrations**
  Spec ref: `spec.md > Database Schema`
  What to build: Configure Neon connection, Drizzle/current chosen data layer, and migrations for `profiles`, `content_items`, `promises`, and `follow_up_drafts` with owner indexes and constraints.
  Acceptance: A migration creates the four app tables; due-today/overdue remains derived rather than stored.
  Verify: Run migration against a development Neon database and inspect the tables.

- [x] **3. Implement Neon Auth and protected workspace access**
  Spec ref: `spec.md > Components And Responsibilities > Authentication and access control`
  What to build: Add current official Neon Auth Next.js integration, Google OAuth and magic-link entry points, session-aware middleware/server guards, and a profile upsert path.
  Acceptance: Signed-out users cannot load `/dashboard`; a signed-in user reaches a private workspace with a stable auth ID.
  Verify: Test sign-in, sign-out, direct protected-route access, and a second browser session.

- [x] **4. Build secure repositories and cross-device persistence**
  Spec ref: `spec.md > Architecture` and `spec.md > Data Flow`
  What to build: Implement server-side repositories/actions that derive `user_id` from the session and scope every query/mutation to it.
  Acceptance: A user can create one test content item, reload, then see it in another authenticated browser; browser-supplied owner IDs are ignored.
  Verify: Create data in Browser A, sign into Browser B, compare; test signed-out route requests.

- [x] **5. Build the landing page and honest guest demo**
  Spec ref: `prd.md > Epic 1: Understand and try Kept`
  What to build: Create an intentional, non-generic marketing page and a seeded `/demo` workspace that visibly states it is temporary.
  Acceptance: A judge can understand the promise-debt idea and start a working demo within two clicks; demo writes do not reach production tables.
  Verify: Test demo in an incognito/private browser and refresh it.

- [x] **6. Implement manual entry and CSV import**
  Spec ref: `prd.md > Epic 3: Add source content`
  What to build: Add manual content form and a small CSV import path with client/server Zod validation, row-level error reporting, and persistence for valid rows.
  Acceptance: A signed-in user can add content with platform/date; a mixed-validity CSV does not discard valid rows.
  Verify: Test one manually entered post, valid CSV, malformed CSV, and missing body text.

- [x] **7. Implement the deterministic scan engine and AI enrichment**
  Spec ref: `spec.md > Components And Responsibilities > Promise scan engine`
  What to build: Build promise cue matching, relative-date interpretation, duplicate guard, Zod output schema, optional server-side AI enrichment, and explicit fallback behavior.
  Acceptance: The phrase “Comment TEMPLATE and I’ll send it tomorrow” produces a candidate with evidence, action, date/status, and confidence even with AI disabled.
  Verify: Run extraction against at least five fixture strings: clear promise, no promise, no-date promise, duplicate, and ambiguous sentence.

- [x] **8. Build the actionable promise ledger and detail view**
  Spec ref: `prd.md > Epic 5: Work the promise ledger`
  What to build: Implement dashboard ordering, source evidence, due/overdue derivation, empty state, edit/dismiss/reopen controls, and responsive cards.
  Acceptance: Overdue items appear before due-today/open work; false positives can be dismissed; no-date promises are never falsely overdue.
  Verify: Seed all statuses and inspect desktop plus narrow mobile viewport.

- [x] **9. Build follow-up draft and fulfilment actions**
  Spec ref: `prd.md > Epic 6: Close a public loop`
  What to build: Generate/edit/save a draft, copy it, optionally form an X intent, and transition a promise between `open`, `drafted`, and `fulfilled`.
  Acceptance: A fulfilled item remains completed after reload and on a second device; opening X does not mark the item published or fulfilled automatically.
  Verify: Draft, copy, fulfil, reload, reopen in a second browser, and reopen the promise.

- [ ] **10. Run the Codex audit-and-finish pass**
  Spec ref: `spec.md > Risks And Verification`
  What to build: Give Codex `CODEX_FINISH_PROMPT.md`; it must inspect Grok’s implementation before changing it, fix real defects, remove unsupported claims, improve mobile/layout quality, and document exact setup.
  Acceptance: All quality commands pass; core flows work against real auth/database; there are no mock-only claims or exposed secrets.
  Verify: Codex provides a concise audit report with commands run, changed files, remaining known limitations, and deploy readiness.

- [ ] **11. Deploy, record proof, and prepare the Devpost handoff**
  Spec ref: `prd.md > Submission Proof Points` and `spec.md > Demo And Submission Flow`
  What to build: Deploy the app, verify production auth/callback URL, capture screenshots, record a 2–4 minute live demo, and update README with setup, architecture, privacy, and test instructions.
  Acceptance: The repository, deployed URL, demo video, and proof screenshots are ready; the live scan is visible in the video.
  Verify: Run the production flow from sign-in through fulfilment, then review all Devpost materials before `$prepare-submission`.
