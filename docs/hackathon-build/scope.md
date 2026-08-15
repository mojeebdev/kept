# Project Scope

## Project Name Candidates

- **Kept** — selected.
- Tagline: **Keep the promises your content makes.**

## One-Line Summary

Kept is a private, cross-device promise ledger for creators that scans their content for public commitments, tells them what is due, and creates the next follow-up they need to make good on it.

## Target User

Solo educators, indie founders, and small creators who publish helpful content several times per week and make informal commitments to their audience: links, templates, answers, “part two,” promised replies, and future updates.

## Problem

Creators lose audience trust through small forgotten commitments, not only through missed posting schedules. Their promises live across captions, transcripts, and comment threads, so there is no single place to see what they owe their audience or to act on it.

Existing content tools focus on making more posts. Kept focuses on **closing the public loops already opened**.

## Core Workflow

1. A creator signs in on any device.
2. They paste one or more posts/transcripts, or import a small CSV of content.
3. Kept scans the text and extracts promise candidates with the original evidence quote, a human-readable action, an inferred or selected due date, and confidence.
4. The creator reviews an “Open / Due today / Overdue” ledger.
5. They choose one promise, generate a platform-ready follow-up, edit it if necessary, then mark it fulfilled.
6. The same account is opened on another phone or browser and the ledger is still there.

## What We Are Building

- A polished public landing page explaining the “promise debt” problem.
- Google and magic-link sign-in through Neon Auth.
- A private cloud workspace backed by Neon Postgres.
- A guest demo workspace with seeded content; it is visibly labeled as temporary and does not persist.
- Manual text entry and small CSV import for source content.
- Promise extraction using structured AI output, with a deterministic phrase-based fallback.
- A ledger with statuses: `open`, `due_today`, `overdue`, `drafted`, `fulfilled`, and `dismissed`.
- Evidence-backed promise cards: original quote, source, suggested due date, confidence, and next action.
- Follow-up draft generation, copy-to-clipboard, optional X intent opening, and “mark fulfilled.”
- Basic responsive mobile experience and a clear empty state.
- README, migration instructions, `.env.example`, and a deployable public URL.

## What We Are Not Building

- Direct social-platform OAuth or scraping.
- Automatic posting, sending DMs, or background comment moderation.
- Social passwords, API tokens, browser cookies, or private-message ingestion.
- Billing, subscriptions, organizations, teams, invitations, or collaboration.
- File/blob storage, video upload, thumbnails, analytics, scheduling, or a general-purpose content calendar.
- A generic AI chat screen.
- “Always-on” scheduled digests; this can be a credible post-hackathon extension only.

## Inspiration And References

- A personal task manager’s clarity: every obligation has a concrete state.
- A financial ledger’s accountability: evidence, status, and resolution are visible.
- A calm editorial workspace rather than a noisy AI dashboard: warm neutral surface, ink-like typography, one distinctive trust/status accent, strong hierarchy, and restrained motion.

## Demo Path

1. Open **Try the demo** with five seeded creator posts and audience replies.
2. Click **Scan promise debt** live.
3. Kept surfaces three overdue promises, including the exact quote: “Comment TEMPLATE and I’ll send it tomorrow.”
4. Open one card, show its evidence and date logic, then click **Draft follow-up**.
5. Copy/open the finished reply and mark the promise fulfilled.
6. Sign in on a second browser/device and show that a real user’s saved workspace persists.

## Submission Story

Creators should not have to choose between publishing consistently and keeping the promises their content already made. Kept automates the invisible follow-up work that protects audience trust.

## Scope Guard

The build budget is 12–16 focused hours. If anything slips, keep this exact minimum:

`sign in -> save content -> scan -> see evidence-backed promise -> generate draft -> mark fulfilled -> return on another device`

Cut visual extras and secondary filters before cutting that loop.
