---
name: "Kept Design System"
product: "Kept"
source: "Adapted from a user-supplied visual reference"
status: "applied"
confidence: "high"
generated_by: "StyleGraft"
---

## Product Context

Kept is a private promise ledger for solo creators. Its primary action is to preserve source evidence, prepare an honest follow-up, and record the creator’s completion. The interface must feel accountable and calm on desktop and mobile.

## Translation Summary

| Reference principle | Decision | Kept expression |
| --- | --- | --- |
| Decisive black framing | Preserve | Compact ink public navigation. |
| Large editorial hierarchy | Adapt | Instrument Serif headlines around specific creator obligations. |
| Illustrated story | Adapt | Original Promise Relay: source → proof → draft → kept. |
| High-contrast section rhythm | Adapt | Blush hero, paper evidence field, butter process band. |
| Source machinery and branded composition | Exclude | No robot, copied layout, source text, logos, or artwork. |

## Design Intent

Make follow-through visible without making the workspace feel punitive. Evidence ranks alongside any generated text. Orange asks for attention; teal confirms a genuinely kept promise.

## Colour System

Selected semantic surfaces are paper, raised paper, blush hero, butter explainer, and inverse ink. Ink is the anchor; signal orange is the sole primary action; kept teal is completion only. Body text uses ink or ink-soft, never orange on blush.

## Typography

Instrument Serif carries hero and section display language. DM Sans handles navigation, controls, and body text. IBM Plex Mono denotes source, timing, status, and evidence metadata. Display text remains out of dense forms and tables.

## Layout and Rhythm

Content caps at 1200px with 24px desktop and 16px mobile gutters. The hero splits text/illustration above 900px and moves copy first below that point. Evidence cards are compact records; sections use contrast changes rather than repeated floating cards.

## Composition Grammar

Landing pages move from promise statement to proof to action. Workspace pages lead with status and exact quote, then the editable next action. Borders are thin by default; the proof card and primary CTA use a 2px ink edge and short offset shadow.

## Imagery and Art Direction

The only landing image is the original SVG Promise Relay. It uses simple card, ledger, ribbon, and checkmark objects with no words, people, social logos, robot, product screenshot, stock photography, glow, or gradient.

## Shape and Material Language

Use 8–16px corners, restrained pills only for status, and 2–4px ink offset shadows only when a card needs emphasis. Paper is the resting surface; no glass, blur, glow, or soft-elevation treatment.

## Components

Public navigation is inverse ink. Primary controls are signal orange with clear labels; secondary controls are outlined paper actions. Evidence cards show exact excerpts. Status stamps always include text, not colour alone. Empty, success, and error states use short plain language and a visible next action.

## Responsive Behaviour

At 1440px and 1024px, hero columns retain breathing room. Below 900px, hero copy appears before the illustration. Below 720px, process cards stack. At 390px and 360px, navigation preserves the wordmark, menu anchor, and account action; promise detail stacks evidence above draft.

## Motion and Interaction

The Promise Relay ribbon can draw once on first view; fulfilled states may stamp once. Both respect reduced motion. Hover movement is limited to 1px and never hides a keyboard focus ring.

## Accessibility

Focus uses the signal token. The hero has meaningful alternate text. Controls have visible labels and status labels do not depend on colour. Keep body text at 16px minimum, targets near 44px, and verify AA contrast when token values change.

## Anti-Slop Constraints

- No generic AI dashboard metrics or fake activity feed.
- No gradients, glows, glass panels, floating blobs, or excessive pill controls.
- No robot, social logo, stock creator, or fabricated product screenshot.
- No claim that Kept publishes, schedules, or connects social accounts.
- No evidence card without its original excerpt.
- No teal outside fulfilled/kept meaning.

## Do / Don't

Do pair orange with a specific unresolved action; do not use it as decorative text. Do use contrast between editorial landing sections; do not flood every view with cards. Do treat source evidence as a record; do not turn it into an AI recommendation panel.

## Implementation Guidance

Use `app/tokens.css` as the token source and consume semantic variables or mapped Tailwind names. Keep current server actions, repositories, and auth boundaries unchanged. Prefer existing `PromiseCard`, `StatusStamp`, and workspace components for state presentation.

## Uncertain Decisions

The reference did not expose its motion or responsive details, so Kept uses minimal inferred motion and explicit breakpoints. A hand-finished illustration can replace the SVG later without changing its alt text or layout.
