# BUILD_STATUS — Kept

Codex audit-and-finish pass completed on 2026-08-15. The scope remains the private, cross-device public-promise ledger described in the planning docs.

## Confirmed in this audit

- The configured Neon database is reachable and contains the required app tables: `profiles`, `content_items`, `promises`, and `follow_up_drafts`.
- A signed-out visit to `/dashboard` redirects to `/auth/sign-in`.
- The Google sign-in action reaches the configured Google consent screen through Neon Auth's callback flow. No account was selected or authenticated during this audit.
- A temporary request to `/api/demo/scan` returned one candidate with the `deterministic+ai` engine while `persist` was `false`; the configured NVIDIA model responds.
- `/demo` is isolated from account persistence: its component uses only local React state and deterministic extraction; its route handler does not import database or auth code. The guest scan returns three seeded promises, draft/fulfil actions work in the browser, and a refresh resets the workspace.
- The demo scan now completes immediately rather than waiting for five sequential NVIDIA calls. Signed-in scanning retains optional NVIDIA enrichment with deterministic fallback.
- The root layout suppresses the expected `<html>` hydration mismatch emitted when Neon Auth UI applies its system-theme attributes after hydration.
- At a 375px viewport, landing, demo, sign-in, and the signed-out dashboard redirect had no horizontal overflow. Protected dashboard and promise-detail mobile checks still require an authenticated account.

## Commands run and results

| Command | Result |
|---|---|
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm test` | Pass — 10 tests in 2 files |
| `npm run build` | Pass — Next.js 16.3.1 production build generated `.next/BUILD_ID` |

The Vitest run emits a non-blocking future Vite config-loader warning; no test failed.

## StyleGraft design pass — 2026-08-15

### Files applied

- `app/tokens.css` — semantic colour, typography, spacing, geometry, and motion tokens sourced from the supplied Kept token document.
- `app/globals.css` and `app/layout.tsx` — global token import, semantic Tailwind mapping, reduced-motion baseline, and Instrument Serif / DM Sans / IBM Plex Mono loading.
- `components/site-header.tsx` and `components/marketing/landing.tsx` — black navigation, blush Promise Relay hero, proof rail, evidence-led cards, and butter process section.
- `app/dashboard/layout.tsx`, workspace, detail, intake, demo, and sign-in components — calmer paper workspace surfaces, proof-first detail treatment, token-based actions, and clearer success/error announcements.
- `public/illustrations/hero-promise-relay.svg` — original code-built SVG; no source artwork, source copy, stock assets, robot, or social logos were introduced.
- `DESIGN.md` and `docs/hackathon-build/design/kept-stylegraft-decisions.md` — reusable design system and concise applied-decision record.

### Verification

- `npm run lint` — pass.
- `npm run typecheck` — pass.
- `npm test` — pass, 10 tests in 2 files.
- `npm run build` — pass.
- Browser QA — landing and demo have no horizontal overflow at 1440px, 1024px, 390px, or 360px. The hero has two columns at 1440px/1024px and a single copy-first column at 390px/360px. The demo still finds three promises; signed-out `/dashboard` still redirects to `/auth/sign-in`.

### Asset and owner step

The included Promise Relay SVG is complete for the MVP. An optional hand-finished illustrator or Canva export may replace it later at the same path and alt text. The remaining owner-only authenticated persistence checks below are unchanged.

## Remaining owner-only verification

These steps require an actual Google account or mailbox and must be completed before claiming the full core loop is proven:

1. Complete Google sign-in, or request and open a magic-link / Email OTP sign-in.
2. In the resulting real account, add `Comment TEMPLATE and I’ll send it tomorrow.`, confirm scan output, save a follow-up draft, mark it fulfilled, and reload.
3. Open the same account in a second browser/device and confirm the content, promise, draft, and fulfilled state match.
4. Check `/dashboard` and `/dashboard/promise/[id]` at a narrow mobile viewport while signed in.

## Current limits

- No user-owned authenticated session was available to this audit, so real account persistence and cross-device continuity are not yet proven end-to-end.
- Magic-link / Email OTP delivery was not triggered because no owner email address was supplied.
- Kept does not deploy, publish content, scrape social platforms, or store social credentials.

## Setup and deployment

`README.md` reflects the current NVIDIA configuration:

```bash
AI_BASE_URL=https://integrate.api.nvidia.com/v1
AI_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
```

For deployment, configure the same database, Neon Auth, and AI variables; add the production origin to Neon Auth trusted domains; and complete the owner-only verification above before recording screenshots or video.
