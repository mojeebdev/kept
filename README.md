# Kept

**Keep the promises your content makes.**

Kept is a private, cross-device promise ledger for creators. It scans text you already published — posts, transcripts, comment replies — extracts public commitments with the original evidence quote, and helps you write the follow-up that closes the loop.

It is not a scheduler, scraper, or auto-publisher.

## Product loop

```text
Landing → try demo or sign in
→ paste or import CSV
→ scan promise debt
→ see evidence + due state
→ draft follow-up
→ copy / open X intent
→ mark fulfilled
→ return on another device and see the same workspace
```

## Privacy boundary

Kept stores only:

- the text you paste or import
- structured promise records and follow-up drafts
- your Neon Auth identity

Kept never asks for social passwords, never stores social tokens or browser cookies, and never connects to X, Instagram, YouTube, or LinkedIn.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Neon Postgres via Drizzle ORM and `@neondatabase/serverless`
- **Managed Better Auth** (`@neondatabase/auth`) — the current official Neon Auth for Next.js
- Google OAuth first, magic-link / email OTP fallback
- Optional OpenAI-compatible AI enrichment through NVIDIA NIM (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`)
- Deterministic promise detector as the reliability floor

## Local setup

1. Create a Neon project at [console.neon.tech](https://console.neon.tech).
2. Enable **Auth** on the branch: Project → Branch → Auth → Enable Auth.
3. Enable **Google** under Auth providers. Shared Google credentials work for development. For production, add your own OAuth client and register the callback:
   `{NEON_AUTH_BASE_URL}/callback/google`
4. Enable the **Magic Link** plugin (or Email OTP) as the passwordless fallback.
5. Add your app origin to **trusted domains** (`http://localhost:3000` locally, your Vercel URL in production).
6. Copy `.env.example` to `.env.local` and fill:

```bash
DATABASE_URL=                 # Neon pooled connection string
NEON_AUTH_BASE_URL=           # Auth URL from the Configuration tab
NEON_AUTH_COOKIE_SECRET=      # openssl rand -base64 32
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

7. Apply the app schema in the Neon SQL editor (`drizzle/0000_kept_schema.sql`) or run:

```bash
npx drizzle-kit push
```

8. Install and run:

```bash
npm install
npm run dev
```

Optional AI enrichment uses a free NVIDIA NIM preview model. Create a key at [build.nvidia.com/settings/api-keys](https://build.nvidia.com/settings/api-keys) and accept the model terms on the [Nemotron Lightning page](https://build.nvidia.com/nvidia/nemotron-3.5-lightning-30b-a3b):

```bash
AI_BASE_URL=https://integrate.api.nvidia.com/v1
AI_API_KEY=
AI_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
```

If those variables are missing, or the provider fails, the deterministic scanner still finds clear promises.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm test` covers deterministic extraction and due-date classification.

## Demo for judges

Open `/demo`. It is a temporary in-memory workspace with five seeded posts. Click **Scan promise debt**. Three commitments should appear, including:

> Comment TEMPLATE and I’ll send it tomorrow.

Nothing on `/demo` is written to a user table. Sign in to persist a real workspace.

## Auth setup (exact)

This repo uses the current official integration, not Clerk and not Auth.js:

- `createNeonAuth` from `@neondatabase/auth/next/server`
- `createAuthClient` from `@neondatabase/auth/next`
- API proxy at `app/api/auth/[...path]/route.ts`
- Route protection in `proxy.ts` (`auth.middleware`, Next.js 16)
- Session reads via `auth.getSession()` on the server
- Every database query/mutation scopes by that server-derived user id

Owner identity is never taken from the browser.

## Deploy (Vercel)

1. Import the repo and set the same environment variables.
2. Add the production domain to Neon Auth trusted domains.
3. For production Google OAuth, register `{NEON_AUTH_BASE_URL}/callback/google` on the Google client and paste the client id/secret into the Neon Auth console.
4. Re-apply `drizzle/0000_kept_schema.sql` if the production database is empty.

## Architecture

```text
Authenticated user
  → server resolves Neon Auth session
  → validated text/CSV is saved with server-derived user_id
  → deterministic parser (+ optional AI) emits PromiseCandidate[]
  → Zod validates model output
  → duplicate guard on user + source + evidence quote
  → ledger derives overdue / due today from due_at + timezone
  → follow-up draft is saved; fulfilment persists on the account
```

Planning documents live in `docs/hackathon-build/`.
