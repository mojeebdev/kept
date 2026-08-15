# Build Notes

## 2026-08-15 — Core direction locked

- Chosen project: **Kept**.
- Positioning: “Kept makes sure creators keep the promises their content makes.”
- The winning demo moment is a live scan that finds forgotten promises, shows evidence, and creates a usable follow-up draft.
- The app must be account-backed and cloud-persistent. IP address is irrelevant; a verified account and database identity are what make the same workspace available on another device.
- Storage decision: **Neon Auth + Neon Postgres**. There is no binary/media-storage requirement in the MVP; CSV parsing happens in the browser and normalized text is saved to Postgres.
- Login: Google OAuth first, magic-link email fallback. The canonical identity is the Neon Auth user ID.
- Privacy: Never save social-media passwords, session cookies, or publishing tokens. Save only user-provided text/content and Kept’s generated outputs.
- Handoff decision: Grok builds the first complete MVP from this pack. Codex follows with a deliberate audit-and-finish pass.
- Scope decision: no direct X/Instagram/YouTube connection, no auto-posting, no billing, no teams, no automated daily emails for the hackathon submission.

## Planning method

This planning pack was consolidated from the project decisions already made in chat so the team can preserve credits and begin implementation immediately. The 12–16 hour build budget is an explicit operating assumption; it should be reduced, not expanded, if time gets tight.
