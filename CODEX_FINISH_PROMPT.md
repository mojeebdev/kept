# Codex Finish Prompt — Kept

You are the senior finishing engineer for **Kept**. Grok has already attempted the first implementation. Your job is not to rewrite everything blindly. Audit what exists, preserve working code, fix real gaps, make the core loop reliable, and leave it submission-ready.

## Read first

Read these files before touching code:

1. `BUILD_STATUS.md` if it exists
2. `docs/hackathon-build/learner-profile.md`
3. `docs/hackathon-build/scope.md`
4. `docs/hackathon-build/prd.md`
5. `docs/hackathon-build/spec.md`
6. `docs/hackathon-build/checklist.md`

Inspect git status and the current project structure. Preserve unrelated user changes. Do not reset, force-push, or delete work to make the audit easier.

## Product truth

Kept is a private, cross-device public-promise ledger for creators. It must prove this exact loop:

```text
sign in -> save content -> scan promise evidence -> generate follow-up -> mark fulfilled -> return from another device
```

It is **not** a generic AI content generator, social scheduler, or automatic publishing tool.

## Audit checklist

### 1. Reality check

- Identify every feature that is a mock, hard-coded as live, or unsupported by the backend.
- Remove misleading claims or wire the missing functionality properly.
- Ensure demo data is visibly temporary and separate from authenticated user data.

### 2. Authentication and storage

- Verify the project uses the current official Neon Auth setup, not Clerk, NextAuth/Auth.js, or custom passwords.
- Verify Google and/or magic-link paths are correctly configured/documented.
- Ensure every protected read/write derives user identity on the server.
- Confirm no client-supplied owner ID can access or mutate another user’s content.
- Confirm schema/migrations exist for profiles, content items, promises, and follow-up drafts.
- Test cross-browser persistence with a real authenticated account if environment access is available; otherwise leave exact owner steps in `BUILD_STATUS.md`.

### 3. Core scan loop

- Test a clear sentence: `Comment TEMPLATE and I'll send it tomorrow.`
- Ensure it yields a promise with the exact evidence quote, a meaningful summary, due-date behavior, and confidence.
- Test no-promise input, ambiguous input, duplicate input, and AI-provider failure.
- Ensure deterministic extraction works without an AI key.
- Validate all model output with Zod and prevent malformed output from breaking the UI.

### 4. Product UX

- Make the landing page communicate the value in seconds.
- Improve the dashboard until it feels like a trustworthy ledger, not a generic cards-and-gradient AI dashboard.
- Ensure urgency order is correct: overdue, due today, open, drafted, fulfilled/dismissed.
- Show source evidence before model-generated claims.
- Ensure users can edit/dismiss/reopen/fulfil promises.
- Make the follow-up draft editable, copyable, and honest: opening an X intent is not confirmation of publishing.
- Test a narrow mobile viewport and fix overflow, hit areas, focus states, loading states, empty states, and errors.

### 5. Engineering quality

Run and fix:

```bash
npm run lint
npm run typecheck
npm run build
```

Add or repair a focused test/script for deterministic extraction and urgency calculation if that is missing. Check that `.env.example`, migrations, README, and deployment instructions match actual code. Ensure no secret is exposed to the client or committed.

### 6. Deployment and handoff

- Prepare the app for Vercel with correctly documented environment variables and auth callback URL requirements.
- Do not deploy, push, or create external resources unless the user asks or credentials are already configured for that exact task.
- Create or update `BUILD_STATUS.md` with what you verified, fixes made, commands run, remaining owner configuration, and known limitations.
- Update the README with the live-demo path, setup, architecture, privacy boundary, and Devpost demo instructions.

## Scope discipline

Do not add direct social OAuth, auto-publishing, team accounts, billing, scheduled digests, media storage, or analytics. If the app is imperfect, make the core promise loop flawless instead of expanding it.

At the end, give a concise report with changed files, test results, real blockers, and whether Kept is ready for screenshots/video/submission prep.
