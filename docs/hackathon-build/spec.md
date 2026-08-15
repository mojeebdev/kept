# Technical Spec

## Overview

Kept is a Next.js web application with a public demo mode and a protected account-backed workspace. The product’s core data is text, structured promise records, and generated drafts. It does **not** require binary/media storage in the MVP.

The system must make one thing unambiguous: the same authenticated user can return from another phone or browser and see the same workspace because every saved record belongs to their Neon Auth identity.

## Stack

- **Framework:** Next.js App Router, TypeScript, latest stable release selected by the implementation agent.
- **UI:** Tailwind CSS, accessible native controls or small audited UI primitives, `lucide-react` icons.
- **Database:** Neon Postgres.
- **Authentication:** Current official Neon Auth integration for Next.js; Google OAuth primary, magic-link email fallback. Do not use Clerk, NextAuth/Auth.js, or a custom password system.
- **Database access:** Drizzle ORM plus Neon’s serverless driver, or the current official Neon data-access pattern if the latest Auth starter requires it. Choose one and document it.
- **Validation:** Zod for all browser input, route input, CSV rows, and AI structured output.
- **AI:** A server-only OpenAI-compatible provider adapter configured by `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL`. Never expose the key in `NEXT_PUBLIC_*` variables.
- **Fallback:** Deterministic promise-pattern extraction so the central demo works when the AI provider is unavailable.
- **Hosting:** Vercel deployment with Neon environment variables. If a hosting quota blocks a deploy, keep the architecture Vercel-compatible and document the blocked step instead of inventing a fallback.

## Architecture

### Public area

- `/` — landing page with project story, demo entry point, and sign-in call to action.
- `/demo` — seeded, in-memory sample workspace. It uses the same extraction and ledger UI but never saves to a real account.

### Protected area

- `/dashboard` — actionable promise ledger and source-content history.
- `/dashboard/add` — manual content entry and CSV import.
- `/dashboard/promise/[id]` — promise evidence, edit state, follow-up draft, and completion controls.

### Server boundary

- Every write and read is performed by a server action or route handler that first resolves the Neon Auth session.
- The server, never the browser, chooses `user_id` for app records.
- All repository methods accept a server-derived `userId` and filter by it.
- Client components receive only data already authorized for that user.

### Guest demo boundary

- Seed data lives in code or an isolated read-only fixture.
- It must not use a real user ID or write to production tables.
- A clear banner explains that demo data resets and must be saved through sign-in.

## Database Schema

Use migrations. UUID primary keys are preferred. Use `timestamptz` for dates.

### `profiles`

| Column | Notes |
|---|---|
| `user_id` | Primary key; canonical ID from Neon Auth |
| `display_name` | Nullable creator name |
| `timezone` | Default `Africa/Lagos` for the founder’s test account; user-editable later |
| `created_at`, `updated_at` | Audit fields |

### `content_items`

| Column | Notes |
|---|---|
| `id` | UUID primary key |
| `user_id` | Indexed owner ID |
| `body` | Source text, required |
| `platform` | `x`, `instagram`, `youtube`, `linkedin`, `other` |
| `source_url` | Optional; do not fetch/scrape it in MVP |
| `published_at` | Optional date used for deadline inference |
| `created_at` | Audit field |

### `promises`

| Column | Notes |
|---|---|
| `id` | UUID primary key |
| `user_id` | Indexed owner ID |
| `content_item_id` | Source foreign key |
| `evidence_quote` | Exact source phrase that triggered the record |
| `summary` | Human-readable commitment |
| `promise_type` | `link`, `template`, `reply`, `part_two`, `resource`, `update`, `other` |
| `due_at` | Nullable; no deadline means it remains open |
| `status` | `open`, `drafted`, `fulfilled`, `dismissed` |
| `confidence` | Numeric 0–1 or enum `high`, `medium`, `low` |
| `created_at`, `updated_at`, `fulfilled_at` | Audit fields |

“Due today” and “overdue” are derived in queries/UI from `status`, `due_at`, and the user timezone; do not persist them as separate mutable statuses.

### `follow_up_drafts`

| Column | Notes |
|---|---|
| `id` | UUID primary key |
| `user_id` | Indexed owner ID |
| `promise_id` | Promise foreign key |
| `channel` | `x`, `instagram`, `youtube`, `linkedin`, `generic` |
| `body` | Editable generated draft |
| `created_at`, `updated_at` | Audit fields |

## Data Flow

```text
Authenticated user
  -> server resolves Neon Auth session
  -> user submits text/CSV rows
  -> Zod validates and normalizes rows
  -> content_items saved with server-derived user_id
  -> scan service runs deterministic parser + optional AI extraction
  -> Zod validates PromiseCandidate[]
  -> duplicate guard checks source + evidence quote
  -> promises saved with server-derived user_id
  -> dashboard queries only that user’s data
  -> user generates/edits a follow-up draft
  -> follow_up_drafts saved; promise transitions to drafted/fulfilled
```

## Components And Responsibilities

### Authentication and access control

Implements: `prd.md > Epic 2: Sign in and retain a private workspace`

- Configure the current official Neon Auth Next.js server and client helpers.
- Provide Google OAuth and magic-link entry points.
- Protect `/dashboard/*` with middleware/server checks.
- Create or upsert `profiles` after a valid session.
- Make no assumption that a Neon Auth profile record appears synchronously; handle a first-login race gracefully.

### Content intake

Implements: `prd.md > Epic 3: Add source content`

- Manual form with content body, platform, date, and optional URL.
- Client-side CSV parse with a visible validation report.
- Server action validates accepted rows again before saving.

### Promise scan engine

Implements: `prd.md > Epic 4: Scan promise debt`

- `extractPromiseCandidates(text, publishedAt)` runs deterministic extraction first.
- Optional AI enrichment turns candidates/ambiguous language into structured `PromiseCandidate` objects.
- Required output fields: `evidenceQuote`, `summary`, `promiseType`, `dueAt | null`, `confidence`, `reason`.
- Never let the model decide `user_id`, database IDs, or raw SQL.
- Validate model output with Zod and fall back safely when parsing fails.

### Ledger and promise detail

Implements: `prd.md > Epic 5: Work the promise ledger`

- Derive urgency based on user timezone and due date.
- Dashboard order: overdue, due today, open, drafted, fulfilled/dismissed.
- Promise detail shows source evidence before any AI-generated claim.
- Actions: edit summary/date, dismiss, draft follow-up, mark fulfilled, reopen.

### Follow-up composer

Implements: `prd.md > Epic 6: Close a public loop`

- Generate an editable concise response grounded only in the promise and source content.
- Support a user-supplied delivery link in the draft form; do not fabricate links.
- Copy to clipboard and offer a safe X intent link when channel is X.
- “Open in X” is a draft handoff, not proof of publication.

## Suggested File Structure

```text
kept/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── demo/page.tsx
│   ├── (app)/dashboard/
│   │   ├── page.tsx
│   │   ├── add/page.tsx
│   │   └── promise/[id]/page.tsx
│   ├── api/
│   │   ├── scan/route.ts
│   │   └── promises/[id]/draft/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── marketing/
│   ├── dashboard/
│   ├── promises/
│   └── ui/
├── lib/
│   ├── auth/
│   ├── db/
│   │   ├── schema.ts
│   │   ├── client.ts
│   │   └── repositories/
│   ├── scan/
│   │   ├── deterministic.ts
│   │   ├── ai.ts
│   │   └── schema.ts
│   ├── demo/
│   └── utils/
├── drizzle/
├── public/
├── docs/hackathon-build/
├── .env.example
├── README.md
└── package.json
```

Adapt the exact directories to the chosen starter, but preserve the separation of auth, database, scan logic, demo fixtures, and UI.

## External APIs And Dependencies

- Neon Postgres and Neon Auth — use the current official integration and record setup steps in `README.md`.
- OpenAI-compatible AI endpoint — server-only. The app must remain useful when it is absent.
- Optional X web intent URL only; no X API and no publishing credential.

### Environment variables

At minimum, include the following conceptual variables in `.env.example`:

```bash
DATABASE_URL=
# Add the exact Neon Auth variables generated by the current official Neon Auth setup.
AI_BASE_URL=
AI_API_KEY=
AI_MODEL=
NEXT_PUBLIC_APP_URL=
```

Do not guess or commit real auth/AI secrets. Never prefix a secret with `NEXT_PUBLIC_`.

## AI Usage

The model performs narrowly bounded language work:

1. Determine whether text contains a creator-to-audience commitment.
2. Extract evidence and an actionable summary.
3. Infer a due date only when the text and published date justify it.
4. Draft a concise follow-up when asked.

The deterministic parser is the reliability floor. The model is an enhancer, not the product’s only proof of functionality.

## Risks And Verification

| Risk | Guard | Verification |
|---|---|---|
| Auth/data mismatch across devices | Server-derived identity on every repository call | Sign in in a second browser and confirm identical records |
| Data leak | Every query filters by `user_id`; add RLS if using client-side data access | Attempt direct route access as a signed-out user; inspect repository calls |
| AI returns malformed JSON | Zod parse and fallback | Simulate invalid provider response and confirm deterministic output |
| False positives | Evidence, confidence, dismiss/edit controls | Scan a non-promise post and a mixed post |
| Deadline logic wrong | Date-only helper tests with a fixed timezone | Test no date, today, yesterday, and future date |
| Generic/fake demo | Real scan UI and a visible demo-data label | Record a live demo with a newly typed promise |

Required checks before handoff:

```bash
npm run lint
npm run typecheck
npm run build
```

Add a focused test or small script for deterministic extraction and due-date classification if the selected stack makes it practical.

## Demo And Submission Flow

1. Landing page: explain the problem in one sentence.
2. Demo: add a fresh line containing “I’ll share the template tomorrow.”
3. Scan: show a persisted evidence-backed promise candidate.
4. Ledger: show its urgency.
5. Draft: show generated follow-up.
6. Fulfil: mark it complete.
7. Auth: show a real account’s state on another browser/device.
8. README: explain the privacy boundary and how to run locally.
