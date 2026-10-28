# CBT Homepage Motion System — Design (v2)

Status: draft for review. No code written yet. This version replaces the first draft, which used a wrong element inventory.
Scope: the homepage and the shared header, footer and cookie banner. The other segment pages reuse the same primitives in a later spec.

## 1. Goal

Make the homepage feel alive in one consistent, calm motion language. Tiers A (consistent entrances and interactions) and B (a few signature moments) are in scope. Tier C (looping idle motion, header hide-on-scroll, page transitions) is out.

Success:
- At least 60% of homepage units react to motion. Today about 35 of 118 do (30%), and 20 of those are the Journey.
- The same element type moves the same way everywhere (one button rule, one card rule, one icon rule).
- Readable without JavaScript. Reduced-motion users see final states. No layout, copy or information architecture change.
- Calm: at most two or three things move on screen at once. No looping animation.

Decisions made during review: tiers A and B; the Journey plays forward only; the Journey path art is built in code.

## 2. Non-goals

- No new pages, routes, navigation items or copy.
- No animation on body paragraphs, FAQ answers, testimonial quotes, or disabled controls.
- No looping or time-based idle motion. The Journey marker is tied to scrolling and stops when scrolling stops.
- No smooth-scroll library.

## 3. How units are counted

A unit is a visible block or control: heading, card, row, panel, illustration or image, icon, badge, button or link styled as a button, nav link, carousel control. Paragraphs, divider lines and body text are not units. A hover effect counts as motion.

## 4. Corrected homepage inventory (desktop, de-duplicated)

| Section | Units | Today | After A+B |
|---|---|---|---|
| Header: logo, 6 nav links, Sign in, Try demo, header pill | 10 | hover colour only | 9 (logo stays static) |
| Cookie banner: panel, 2 buttons, close | 4 | none | 4 |
| Hero: H1, CTA, illustration, trust card, 4 pills, What-is card, its illustration, its H2 | 11 | 3 (H1, CTA, hero image) | 11 |
| Journey: eyebrow, H2, 5 cards, 5 connectors, 5 nodes, 5 illustrations, path, marker | 24 | 20 | 24 |
| Section 2: badge, H2, 5 rows, 5 icons, illustration | 13 | 0 | 13 |
| Section 3: panel, H2, CTA | 3 | 2 (H2, CTA) | 3 |
| Section 4: eyebrow, H2, 3 rows, 3 arrows | 8 | 3 (row lift) | 8 |
| Section 5: H2, 2 cards, 2 image stand-ins, 3 carousel controls | 8 | 0 | 8 |
| Section 6: H2, 6 FAQ cards, 6 icons | 13 | 6 (open/close) | 13 |
| Section 7: panel, H2, CTA | 3 | 1 (CTA) | 3 |
| Footer: logo, ISO badge, 3 column heads, 9 links, 4 social icons, 3 legal links | 21 | hover colour only | 20 |
| **Total** | **118** | **~35 (30%)** | **~116** |

The result is far above the 60% floor. That is fine because the real limit is the calm rule in section 3, not the count.

## 5. Motion rules (shared)

| Token | Value |
|---|---|
| Entry | 600ms, `cubic-bezier(0.16, 1, 0.3, 1)` (GSAP: `power2.out`) |
| Hover | 200ms, `ease` |
| Press | 150ms |
| Entry distance | 24px up |
| Hover lift | 4px up, plus the shadow `0px 10px 28px -8px rgba(23,94,99,0.18)` |
| Arrow nudge | 4px right |
| Press scale | 0.98 (buttons), 0.95 (carousel controls) |
| Stagger | 80ms between siblings, at most 6 per group |
| Icon pop | scale 0.8 to 1, `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Cookie banner | slides up 24px and fades in after 600ms; slides down and fades out in 250ms on choice |

Applies everywhere:
- Each element plays its entry once. Nothing loops.
- Hover and focus use the same visual change.
- Under `prefers-reduced-motion: reduce`, every element shows its final state with no transition.
- Without JavaScript, every element is visible in the server HTML.
- `transform` is used for entry and `translate` for hover, so the two never conflict on one element.

## 6. Element motion

| Element | Tier | Motion | Engine |
|---|---|---|---|
| Headings (H1, H2) | A | Line reveal (H1) or word reveal (H2), once | GSAP via `TextReveal` |
| Eyebrows and badges | A | Fade and rise | CSS |
| Buttons and CTAs (`.btn`) | A | Arrow nudge on hover and focus, press scale; one rule for every page | CSS |
| Cards, rows and panels | A | Rise on entry, staggered in groups | CSS via `RevealStagger` |
| Link rows and link cards | A | Lift on hover; Section 4 rows also tint to their label colour and slide the arrow | CSS |
| Icons | A | Pop in with their card or row | CSS |
| Images and illustrations | A | Fade in and settle from scale 1.04 | CSS |
| Trust pills | A | Stagger entry, icon pop, lift on hover | CSS |
| Carousel controls | A | Scale 1.05 on hover (enabled only), press 0.95 | CSS |
| FAQ cards | A | Stagger entry; open/close and plus bar as today; icon scales to 1.1 when its card opens; background and border fade in instead of switching | CSS |
| Nav links | A | Underline draws from the left on hover and focus | CSS |
| Footer | A | Columns stagger in once; links get the same underline; social icons lift | CSS |
| Header pill | A | The existing scrolled background change gets a transition and a soft shadow | CSS |
| Sign-in dropdown | A | Fades and slides down 8px on open | CSS |
| Cookie banner | B | Slides up after 600ms, slides out on choice | CSS plus a short leaving state |
| Hero illustration | B | Settles in (fade, scale 1.04 to 1) | CSS |
| What-is card | B | Card rises, illustration settles, H2 word reveal | CSS plus GSAP |
| Section 2 illustration | B | Slides in from the right and scales slowly with scroll | GSAP |
| Section 3 and 7 panels | B | Panel rises; its gradient shifts gently with scroll | GSAP via a small scroll-gradient wrapper |
| Journey: path art, marker, node rings | B | See section 7 | GSAP (DrawSVG, MotionPath) |

Two engines, one language. GSAP handles headings, the Journey, the Section 2 illustration and the gradient shift. CSS with IntersectionObserver handles everything else. Both use the tokens in section 5.

## 7. Journey changes

**Forward only.** The scrubbed timeline currently reverses when the reader scrolls up, which makes cards disappear. Change it so progress only ever increases. Implementation: keep the timeline paused, and on every `ScrollTrigger` update, if the scroll progress is greater than the highest progress so far, tween the timeline to it (about 0.6s, `power1.out`). Scrolling back up leaves everything visible.

**Path art in code.** Replace the "Image" placeholder (the centre strip at left 43.99%, width 12.02%, full height) with an inline SVG, `viewBox="0 0 1248 1939"` (the container's aspect ratio), positioned `inset-0` behind the cards. A light track path is always visible. A foreground path in the node border colour `#c79acc` is drawn by GSAP's DrawSVG as the reader scrolls. The path passes through the five node centres, computed from the existing node positions:

| Node | Centre (x, y) in viewBox units |
|---|---|
| 1 | (672, 168) |
| 2 | (593, 576) |
| 3 | (620, 959) |
| 4 | (648, 1378) |
| 5 | (575, 1775) |

It enters at the top (672, 0) and leaves at the bottom (575, 1939) in gentle S-curves. The draw runs on the same timeline as the cards and nodes, so each node appears just as the line reaches it.

**Travelling marker.** A small orchid dot (14px, white ring) travels along the path using GSAP MotionPath, tied to the same scroll progress. It fades out at the end. It is hidden by default and shown by JavaScript, so it never appears without JS or under reduced motion.

**Node rings.** Each numbered node gets a single ring pulse when the line reaches it. Once, not looping.

**Fallbacks.** With no JavaScript or reduced motion, the path is fully drawn, the marker is hidden and the nodes show their final state.

## 8. Components and files

New:
- `components/shared/RevealStagger.tsx` (client): groups siblings and sets `data-reveal-group` after mount (same safe pattern as `Reveal`).
- `components/pages/home/sections/JourneyPath.tsx`: the inline SVG (track, drawn path, marker).
- `components/shared/ScrollGradient.tsx` (client): scrubs a panel's `background-position` with GSAP, off under reduced motion.

Changed:
- `app/globals.css`: shared rules (group entry, images, icons, `.btn` arrow nudge and press, `.nav-link`, `.footer-link`, `.social-lift`, header transition and shadow, FAQ transitions, cookie banner, dropdown, Section 4 row tint) and the reduced-motion block.
- `components/shared/Button.tsx`: drop the per-component arrow code so `.btn` owns the nudge.
- `components/shared/TextReveal.tsx`: add a `media` prop so a heading's split runs only for the visible desktop or mobile copy.
- `components/shared/CookieBanner.tsx`: entry animation and a short leaving state.
- `components/shared/Header.tsx`, `Footer.tsx`: nav and footer link classes, header shadow transition, dropdown animation, footer column stagger.
- `components/shared/FaqCards.tsx`: icon scale on open, background and border transition, group entry.
- `components/pages/home/sections/JourneyTimeline.tsx`: forward-only progress, path draw, marker, node rings.
- `components/pages/home/sections/Section0.tsx` to `Section7.tsx`: apply the rules from section 6 to each element.

Unchanged: `Reveal`, `AccentUnderline`, the FAQ open/close behaviour and the existing Journey card, connector and node tweens (they only move onto the forward-only timeline).

## 9. State and data flow

No new global state. Each element's motion is decided by its own observer, its own CSS or its own GSAP tween. The Journey timeline is the only shared timeline, and it already was. The cookie banner adds one local `leaving` state.

## 10. Edge cases

- Hidden desktop or mobile copies: GSAP splits run only for the visible copy via the `media` prop. CSS entries run when the element is visible.
- Elements already in view on load show immediately with no flicker beyond one frame.
- Keyboard focus gets the same cue as hover. Touch devices lose hover cues, and nothing depends on hover.
- The Journey on screens narrower than `lg` keeps today's static mobile layout.
- Late-loading images use only opacity and transform, so layout does not shift.

## 11. Testing

Automated:
- Unit tests for `RevealStagger` (mocked IntersectionObserver): pending then shown, and no hiding without observer support.
- Unit tests for `TextReveal`'s `media` prop and the cookie banner's leaving state.
- The existing unit tests keep passing. `tsc --noEmit` and `npm run build` pass.

Browser (headless Chromium):
- Journey forward-only: scroll to the end, scroll back to the top, and assert every card, node and connector is still at its final state.
- Journey path: the drawn path reaches full length and the marker follows it; both are absent under reduced motion.
- Every element type moves on entry on desktop and at 390px.
- Hover and focus on each `.btn` show the arrow nudge on the homepage and the Kit page.
- Reduced motion: every group child shows its final state immediately.
- No JavaScript: the server HTML holds every heading and the full path.
- Calm check: sample the page while scrolling and confirm no more than three elements are mid-animation at once.
- No console errors. No horizontal overflow at 390px.
- Coverage: count animated units against section 4 and report the number.

## 12. Rollout

1. Shared CSS, `RevealStagger`, the `.btn` change. Verify on the homepage.
2. Header, footer and cookie banner.
3. Hero, Sections 2 to 7 in order.
4. Journey (forward-only, path, marker, rings).
5. Coverage and calm checks, then the other pages in a later spec.

Each step is checked in the browser before the next starts.

## 13. Open items for review

- The path is a hand-drawn S-curve through the five node centres. Its exact shape can only be judged visually after it is built. Expect one tuning pass.
- The marker is a plain orchid dot. A Cobo-coloured or teal variant is possible if you prefer.
- The Section 5 carousel has one page and disabled controls, so no slide transition is specced. Add one when more testimonials exist.
- The licence for GSAP's DrawSVG and MotionPath is the same "Standard no charge" licence already in use. Check the terms against how you plan to host the site.
