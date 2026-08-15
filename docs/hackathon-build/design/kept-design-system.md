# Kept Design System

## Design position

Kept is a private trust workspace for creators: it helps someone find the promises their public content makes, preserve the source evidence, write the follow-up, and close the loop. It should feel **calm, accountable, and unusually clear**—not like a generic AI dashboard or a social-media scheduler.

The supplied Super Hello image is a *structural* reference only. Borrow its decisive hierarchy, black navigation bar, high-contrast editorial blocks, bold headline scale, illustrated storytelling, and short three-step explanation. Do not reproduce its robot, colour palette, copy, cards, wavy divider, or layout literally.

## The one visual idea: Promise Relay

The hero illustration is called **Promise Relay**. It depicts one clear story instead of decorative AI imagery:

```text
source post / comment  →  evidence card  →  follow-up draft  →  kept seal
```

A thin signal ribbon begins at a small source card, passes through an illustrated “promise ledger” device, and leaves as a clean draft card with a green check seal. It makes Kept understandable before anyone reads a feature list.

The relay is a compact, flat editorial vector—not a robot, phone mock-up, 3D render, screenshot collage, or stock-photo scene. It may have a few small human-scale marks for warmth, but the product truth must remain the focus.

## Product feeling

| Need | Design response |
| --- | --- |
| Private, cross-device workspace | Warm paper surface, stable layout, strong ownership cues, no noisy social feed treatment. |
| Evidence before AI claims | Source excerpts look like first-class records, with quote marks, origin metadata, and a clear link/open action. |
| A promise needs action | Orange signals an unresolved promise; teal signals genuinely kept; black ink gives authority. |
| A solo creator needs relief | Generous breathing room, plain language, one primary next action, restrained motion. |

## Reference translation

### Keep from the reference

- A slim black top navigation that frames the page.
- A headline that is visually unmistakable from several feet away.
- A hero divided into type on the left and an illustrative story on the right.
- Clear section-to-section colour rhythm rather than a single grey SaaS canvas.
- Three simple “how it works” steps with one action per card.
- Hand-drawn black outlines used sparingly to make the illustration feel authored.

### Do not carry over

- The robot/industrial machine concept.
- Pink + yellow as the exact palette, the specific wavy separator, or Super Hello’s words.
- Dense decorative objects, random tiny people, or a screen full of disconnected floating cards.
- Rounded white dashboard cards everywhere.
- Gradient/glow treatment, generic AI sparkles, or an image that does not explain Kept.

## Visual language

### Colour logic

- **Paper** is the everyday backdrop. It keeps long-form source text comfortable to read.
- **Ink** anchors titles, borders, navigation, and evidence. It should be almost black, never pure default black.
- **Signal orange** means a promise needs attention and powers the primary call-to-action.
- **Kept teal** is reserved for completed/fulfilled states so it retains meaning.
- **Blush** is the hero story canvas. **Butter** carries the explanatory lower landing-page band. They echo the reference’s confidence without copying it.

Use status colour in combination with a text label and icon; colour alone must never communicate state.

### Typography

| Role | Font | Use |
| --- | --- | --- |
| Display | Instrument Serif | Hero headline, major section headings, one emotionally weighted sentence. |
| Interface/body | DM Sans | Navigation, buttons, form labels, body copy, controls. |
| Metadata/evidence | IBM Plex Mono | Source platform, dates, counts, state labels, promise IDs. |

Do not use Inter, Roboto, or a default system stack as the visual identity. Keep display serif out of dense app tables and form controls.

### Shape and line

- Borders are ink-like and mostly `1px`; use a `2px` edge only on key cards, the primary CTA, and illustration outlines.
- Corners are modest (`12px` for standard surfaces, `16px` for hero feature cards), not pill-heavy.
- Buttons can have a `10px` radius; status chips are the only full pills.
- Shadows are short, offset, and coloured like ink—not blurry elevation shadows.

## Landing-page composition

### 1. Navigation

Black background; wordmark **Kept** at left; three anchors at desktop: `What it catches`, `How it works`, `Why it matters`; a compact `Sign in` button on the right. On mobile, retain wordmark + one menu trigger + sign-in only.

### 2. Hero: blush editorial field

- Two columns from `1024px` upward: copy 55%, illustration 45%.
- Eyebrow: `A private promise ledger for creators` in mono uppercase.
- H1: **Keep the promises your content makes.**
- Supporting copy: explain that Kept scans pasted posts, threads, transcripts, or comments and leaves the evidence attached to every suggested follow-up.
- Primary CTA: `Try the live example` (orange). Secondary text action: `See how it works`.
- Trust line: `No passwords, social credentials, or auto-posting.`
- Promise Relay illustration sits right-aligned and never obscures hero copy.

### 3. Proof strip

One calm line beneath the hero: `Post → proof → draft → kept.` It can be a thin chronological rail with four labeled points. This replaces a generic logo cloud.

### 4. “What Kept catches” on paper

Three evidence-led examples: `“Template tomorrow”`, `“Part 2 next week”`, `“Comment GUIDE and I’ll send it”`. Each is a quote card with a status/action label—not generic feature cards.

### 5. “How it works” on butter

Three code-built steps, in this order:

1. **Paste** — Add a post, thread, transcript, or comment.
2. **See the proof** — Kept pulls out a possible commitment and preserves the exact source excerpt.
3. **Close the loop** — Edit the follow-up, copy/open it in the right place, then mark it kept.

Use `Upload`, `Quote`, and `BadgeCheck` from `lucide-react`; do not create or fetch three separate illustrations.

### 6. Product truth / final CTA

Return to paper. A large editorial line: `Trust is built in the follow-through.` Show a compact, real product capture only after the app is functional. Do not use fake dashboard screenshots.

## Authenticated workspace direction

The landing page can be playful and illustrated. The authenticated workspace should be quieter: paper surface, ink typography, thin dividers, clear status signals, and a strong task order.

- Sidebar on desktop: Kept wordmark, `Promises`, `Sources`, `Settings`; collapse on smaller laptops.
- Mobile: one compact top bar, then tab navigation or bottom-safe action sheet. Do not squeeze a desktop sidebar onto a phone.
- Default list order: **overdue → due today → open → drafted → fulfilled/dismissed**.
- Every promise row exposes: status, exact evidence excerpt, source, intended timing, and one next action.
- The promise-detail view uses a two-column split at wide widths: evidence on the left, editable follow-up draft on the right. Stack evidence first on mobile.
- Empty state: a simple outlined evidence card and one `Paste content` button—not an illustration-heavy dead end.

## Interaction and motion

- Hero signal ribbon may draw once over 700–900ms on first view; respect `prefers-reduced-motion`.
- A scan should reveal evidence in a deliberate sequence: source highlight, promise card, then draft suggestion. No fake percentage counters.
- When marked fulfilled, the check seal gently stamps in once; pair it with a text confirmation.
- Buttons move at most `1–2px` on hover. No bouncy or continuous animation.

## Responsive rules

- Main content max width: `1200px`; page gutters: `24px` desktop, `18px` tablet, `16px` mobile.
- Hero collapses to one column below `900px`; copy is first, illustration follows and is capped at `420px` tall.
- Hero display heading: fluid from `3.25rem` mobile to `7rem` desktop. Never let a word wrap into isolated letters.
- Three how-it-works cards become a single vertical stack below `720px`.
- Do not hide critical text in the illustration. It must remain fully understandable with the image disabled.

## Required asset inventory

Only create or download these assets for the MVP:

1. `public/illustrations/hero-promise-relay.svg` — the one original hero illustration; use the dedicated Canva brief.
2. `public/og/kept-og.png` — a later Open Graph image using the real wordmark and Promise Relay crop.
3. Optional `public/favicon.svg` — a simple outlined check inside a bookmark/promise tag.

Everything else is code: Lucide icons, CSS quotation marks, status dots, rails, and cards. Do not download a robot, social-media logos, stock creator photos, or dashboard mock-ups.

## Accessibility and QA

- The hero image gets meaningful alt text: `An illustrated relay turns a source post into evidence, a follow-up draft, and a kept checkmark.`
- Body copy and UI text must meet AA contrast on its surface; do not place orange text on blush.
- Visible focus ring uses the orange focus token on light surfaces and cream on ink surfaces.
- Verify desktop at 1440px and 1024px; mobile at 390px and 360px; keyboard navigation; reduced motion; empty/loading/error states.
