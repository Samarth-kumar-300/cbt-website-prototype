# Journey Rail (Option 2) Design

Status: approved in conversation 2026-10-13 (research, direction and "keep both options" confirmed by the owner). Written spec for the plan `docs/superpowers/plans/2026-10-13-journey-rail.md`.

## Problem

Home Section 1, "A CHILD'S GROWTH PATH", spends about 1,940px (desktop) and about 2,400px (mobile) of height on five titles, five one-line descriptions and five illustrations (about 60 words). Reading it takes 4-5 scrolls. Two causes:

1. Layout. Desktop is a 1248x1939 canvas with absolutely-positioned, percentage-placed cards in a zig-zag around a winding SVG line. Mobile stacks five cards of about 510px each.
2. Reveal. `JourneyTimeline` scrubs the reveal to scroll progress and finishes at `bottom 65%`, so content is hidden until the reader has scrolled all the way through.

## Decision

Duplicate the section on the home page. The current section (the winding path, `Section1`) stays exactly as it is, and the **new rail section is placed directly below it**, in the same home page, so the owner can scroll between the two and decide later which one to keep. There is no switch, no flag and no separate compare page (revised by the owner on 2026-10-13).

The new section (rail):

- **Desktop (>= 1280px, the project's `xl`):** five equal columns. Per column: illustration, a numbered node on one shared horizontal line, then the pastel card. All five steps visible at once, no hidden content, no horizontal scroll.
- **Below 1280px:** one compact vertical list. Per row: numbered badge on a vertical rail, an 80px illustration on its step colour, title and description.
- **One DOM** for both layouts (an ordered list); CSS reorders it. No duplicated markup, no duplicated headings for assistive technology.
- **Motion:** plays once when the section scrolls into view. Not scrubbed, not pinned, never hijacks scroll.

Rejected (research in conversation): pinned or scroll-driven wheel (scrolljacking, NN/g), tabs or stepper (hides 4 of 5 steps), swipe carousel (poor discoverability), accordion (all content is needed), shrinking the existing layout (absolute percentages overlap).

## Success criteria

| Measure | Current section (above it on the page) | New rail section target |
|---|---|---|
| Section height at 1440x900 | about 2,300px | <= 760px, and under 40% of the current section |
| Step list height at 390 wide | about 2,400px | <= 720px |
| Steps visible without scrolling (after the section is brought to the top) at 1440x900 | 2 of 5 | 5 of 5 |
| Horizontal overflow at 320, 375, 768, 1023, 1279, 1280, 1440 | none | none |
| Copy, alt text, step order | n/a | identical to `content.ts` |
| Reduced motion, no JavaScript | static final state | static final state (line drawn, everything visible) |

## Motion language ("the child's path lights up")

One timeline, played once, about 3s end to end. Content is readable from the first 0.5s of each step; nothing waits for the end.

1. A light route (pale lilac) is always visible. A saturated line draws along it and an orchid orb travels at the head of the line.
2. As the orb reaches each node: the node pops (overshoot) and a ring ripples out; the illustration settles in from slightly small, tilted and blurred; the card rises and sharpens; title then body follow 100ms apart; a short dashed stub connects node to card (desktop).
3. Step N+1 starts while step N is still settling. The result reads as one travelling wave, left to right (top to bottom on mobile).
4. Finale: when the orb reaches step 5 ("Monitor growth") ten small sparks in the card palette burst from the node and fade. Thematically, "thriving".
5. After the entry, the only motion is hover on a fine pointer: the illustration wiggles (scale 1.06, rotate 2deg) and the ring pulses once. No card lift or shadow: the cards are not links, and the project rule is that lift implies clickable.

Direction axis: horizontal at >= 1280px, vertical below.

## Non-goals

- No change to copy, routes, navigation or the classic section's files.
- No pinned scroll, no auto-advance, no looping or ambient motion, no pointer-follow parallax (YAGNI; neurodivergent audience, motion sensitivity).
- No new dependencies. GSAP core and ScrollTrigger only (already installed).
- No decision on which section to keep. Removing the loser later is a one-line change in `HomePage.tsx`.

## Placement

`HomePage` renders `<Section1 />` (current) then `<JourneyRail />` (new) back to back. Consequences accepted by the owner: the home page temporarily shows the growth path twice, and the existing "home matches the reference structure" test (which counts top-level sections) is told to expect one extra section.
