# Product Requirements Document

## Product Summary

**Kept** is a cross-device creator workflow that turns public promises into a private, actionable ledger. It does not generate content for content’s sake. It detects unfulfilled audience commitments, makes the obligation visible, and helps the creator close it with a useful follow-up.

## Target User

A solo creator, educator, or indie founder who publishes content and frequently writes things like “I’ll share the template,” “Part two tomorrow,” “Comment GUIDE,” or “I’ll answer this later.” They want a simple daily view of what their audience is waiting for.

## Core User Journey

1. **Discover:** A visitor understands that Kept tracks public promises, not posting frequency.
2. **Try:** They can run a clear guest demo without sharing credentials.
3. **Persist:** They sign in with Google to own a cloud workspace.
4. **Add content:** They paste content or import a small CSV.
5. **Scan:** Kept identifies possible promises and shows proof from the source text.
6. **Prioritize:** The user sees what is open, due, or overdue.
7. **Make good:** The user creates a response, copies/opens it, then records the promise as fulfilled.
8. **Resume anywhere:** The same logged-in workspace appears on another device.

## Epics And User Stories

### Epic 1: Understand and try Kept

- As a creator, I want to understand Kept’s value in one glance so that I know it is not another social scheduler.
- As a judge, I want to try a real example immediately so that I can see the loop work without an account.

Acceptance criteria:

- The landing page explains “public promise debt” in plain language.
- A visible **Try demo** action opens a seeded workspace.
- The demo is explicitly labeled temporary and does not claim to save data.
- The demo includes at least five source items and three detectable promises.

### Epic 2: Sign in and retain a private workspace

- As a creator, I want to sign in with a familiar method so that I can safely return from another phone or browser.
- As a creator, I want only my content and promises to load so that my private planning data stays private.

Acceptance criteria:

- Google sign-in is the only available account method.
- A signed-in user receives a stable workspace tied to the server-derived auth user ID.
- Reloading or signing in elsewhere shows the same saved source items, promises, and drafts.
- No database query trusts a `user_id` sent by the browser.
- A signed-out visitor cannot access a real user workspace.

### Epic 3: Add source content

- As a creator, I want to paste a post/transcript with a date and platform so that Kept can inspect it.
- As a creator, I want to import a small CSV so that I do not need to retype a content archive.

Acceptance criteria:

- Manual entry supports body text, optional source title/URL, platform, and published date.
- CSV import accepts documented columns: `body`, `platform`, `published_at`, and optional `source_url`.
- Invalid rows are identified clearly without losing valid rows.
- Imported content is stored only for a signed-in user; guest-demo content remains in memory.

### Epic 4: Scan promise debt

- As a creator, I want Kept to find likely commitments and show the exact source language so that I can trust the result.
- As a creator, I want uncertainty exposed rather than hidden so that I can correct a bad inference.

Acceptance criteria:

- Scan results include `evidence_quote`, a plain-language promise summary, promise type, suggested date, status, and confidence.
- The scan recognizes obvious forms such as “I’ll,” “I will,” “tomorrow,” “next post/video,” “comment [keyword],” “send,” “share,” and “link.”
- If the AI provider fails or is unavailable, deterministic matching still produces usable candidates for obvious promises.
- A user can dismiss a false positive.
- A user can edit the date and promise summary before relying on it.

### Epic 5: Work the promise ledger

- As a creator, I want to see the few promises that need action first so that I know what to do today.
- As a creator, I want to distinguish open, due, overdue, drafted, fulfilled, and dismissed work so that the ledger is trustworthy.

Acceptance criteria:

- Dashboard defaults to actionable items ordered `overdue -> due today -> open`.
- Every card shows the source quote and enough context to understand the promise.
- Empty states explain how to add content and run a scan.
- Users can filter by status only if it does not complicate the primary view.

### Epic 6: Close a public loop

- As a creator, I want a follow-up draft tailored to the promised action so that I can respond quickly without losing my voice.
- As a creator, I want to mark a commitment complete so that Kept stops nagging me about it.

Acceptance criteria:

- **Draft follow-up** produces an editable reply/post using the promise, source context, and optional supplied link.
- The user can copy the draft and optionally open a prefilled X intent; Kept never claims the post was published.
- The user can mark a promise `fulfilled`, `dismissed`, or return it to `open`.
- Completion state persists after reload and on another device.

## Edge Cases

- **No promise found:** show a clear “No promise debt found in this content” result and suggest what language Kept looks for.
- **No explicit date:** set the promise to `open` with “No deadline inferred,” and require/edit a date before it is called overdue.
- **Ambiguous language:** preserve low confidence and the exact quote; never silently invent a promise.
- **AI failure:** report that AI analysis was unavailable, run deterministic matching, and allow manual promise creation.
- **Duplicate scan:** avoid creating an identical promise for the same source/evidence/status; provide a clear duplicate result.
- **New device:** authenticated session leads to the same server-owned records; no IP comparison or device fingerprinting is used.
- **Guest demo:** reset data on refresh/new session; never blend it with a real workspace.

## What We Are Building

The six epics above, with the core loop fully working on desktop and mobile. The MVP is deliberately private, one user per workspace, and text-first.

## What We Would Add With More Time

- Direct YouTube/Instagram/X account connection with explicit authorization.
- Scheduled daily digest email or push notification.
- Multiple brands/workspaces and team collaboration.
- Direct publishing after a human approval step.
- Rich media/file storage and transcript extraction from uploads.
- Analytics showing trust debt cleared over time.

## Submission Proof Points

- A live demo that scans content in real time and returns structured promise evidence.
- A sign-in flow proving cross-device persistence.
- A before/after dashboard: three open promises become one fulfilled action.
- A short video showing the exact live scan, evidence, draft, and fulfilment flow.
- A README that explains the problem, architecture, privacy boundary, setup, tests, and demo mode.
