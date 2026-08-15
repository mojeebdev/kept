# Kept Hero Illustration Brief

## Decision

Do **not** download several random images or reuse anything from the Super Hello reference. Kept needs one ownable visual: a Canva-made or illustrator-made vector called **Promise Relay**. The app then builds every supporting visual from CSS and Lucide icons.

This gives the landing page one memorable moment without slowing the hackathon build or making the product look like a stock-template SaaS.

## What the illustration must communicate

Kept transforms a promise made in public content into a private, accountable next action.

```text
public source → saved evidence → follow-up draft → fulfilled promise
```

It should read even when it is small. It must never imply that Kept automatically posts to a social platform.

## Art direction

- **Style:** flat, editorial, hand-drawn vector; controlled black outlines; slightly tactile paper/print feeling.
- **Composition:** a compact horizontal relay from lower left to upper right. It should sit comfortably in a right-side hero column.
- **Key objects:**
  1. a small source/post card, represented by quotation marks and horizontal lines only;
  2. a single orange signal ribbon/line;
  3. a central promise ledger or gentle “sorting press” that catches the signal;
  4. an evidence card with a small magnifier/quote mark;
  5. an outgoing draft card with a teal check seal.
- **Palette:** ink `#181813`, paper `#F8F4EA`, blush `#F5B6A7`, butter `#F8D05B`, signal orange `#ED5C2F`, kept teal `#24745F`.
- **Background:** transparent. If transparency is unavailable, use solid blush `#F5B6A7` with no vignette or texture at the edges.
- **Tone:** warm and intelligent, a little playful, never childish or futuristic.

## Canva Magic Media prompt

Paste this into Canva’s image/vector generation prompt, then simplify the result manually if it contains extra noise:

> Create an original editorial vector illustration for a creator tool called Kept. Show a clear “promise relay”: a small public-post card made only of quotation marks and simple lines feeds a thin orange signal ribbon into a compact hand-drawn promise ledger device. The device outputs an evidence card with a magnifying glass and a clean follow-up draft card with a small teal check seal. Use an off-white paper, blush, butter-yellow, signal-orange, deep near-black, and muted teal palette. Use crisp imperfect ink outlines, flat shapes, subtle print texture, balanced negative space, and a compact horizontal composition that works on the right side of a web hero. No words, letters, logos, UI screenshots, people, robots, phones, social-media logos, gradients, 3D rendering, glossy effects, neon, or photorealism. Transparent background.

## Export instructions

1. Create it as one composition; do not export individual scattered objects.
2. Remove any generated lettering. Kept’s actual words must be rendered in HTML, not baked into an image.
3. Prefer editable SVG. If Canva cannot export a clean SVG, export a transparent PNG at **1600 × 1200 px** (2× the intended CSS display area).
4. Name it `hero-promise-relay.svg` or `hero-promise-relay.png`.
5. Put it in `public/illustrations/` and give it the alt text: `An illustrated relay turns a source post into evidence, a follow-up draft, and a kept checkmark.`

## Assets Codex should use instead of images

| Interface moment | Use | Why |
| --- | --- | --- |
| How it works: Paste | `Upload` Lucide icon | A simple action, not an art moment. |
| How it works: See the proof | `Quote` or `SearchCheck` Lucide icon | Reinforces evidence, not AI magic. |
| How it works: Close the loop | `BadgeCheck` Lucide icon | Matches fulfillment state. |
| Promise status | CSS dot + text label + small icon | Accessible and data-driven. |
| Social-source labels | Plain text platform name / generic link icon | No need for brand assets or API claims. |
| Product proof later | Real app screenshot | Stronger and more truthful than a mock-up. |

## What the three steps mean in the product

1. **Paste** — the creator adds a post, thread, transcript, or comment to Kept.
2. **See the proof** — Kept finds a possible public commitment and keeps the exact excerpt tied to it. The creator can correct or dismiss it.
3. **Close the loop** — Kept drafts a follow-up. The creator edits it, copies or opens it in the intended place, posts it themselves, then marks the promise fulfilled.

The design must state this truth plainly: Kept helps users follow through; it does not sign into accounts or publish on their behalf.
