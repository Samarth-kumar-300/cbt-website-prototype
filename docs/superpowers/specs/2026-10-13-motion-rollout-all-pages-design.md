# CBT Motion Rollout to All Pages — Design (draft for review)

Status: draft for review. **No code has been written for this spec.**
Builds on: `2026-10-13-motion-system-design.md` (the homepage spec). That spec's last rollout step says "the other pages in a later spec". This is that spec.
Scope: About, Contact Us, Parents, Resources, Schools, Therapy Centres (6 pages, 38 sections). The homepage and the shared header, footer, cookie banner and FAQ cards are the source, not the target.

## 1. Goal

Make every page move with the same calm language the homepage now has, so the site reads as one product. A visitor who moves from Home to Schools should not feel the motion change character.

Success, in the terms a product team would use:
- **Consistency:** the same element type moves the same way on every page (one button rule, one card rule, one heading rule). Checked by a coverage table per page, not by eye.
- **Calm:** at most 2–3 things moving on screen at once. No looping motion.
- **Safe:** readable without JavaScript; reduced-motion users see final states; no layout or copy change.
- **No regression in speed:** Largest Contentful Paint and JS weight on each page stay within 5% of today. Motion must not make the page feel slower. This is the guardrail metric, as in any product team's experiment.

Non-goals: new pages, copy changes, Tier C (looping, page transitions, header hide-on-scroll), and any motion on body paragraphs or form errors.

## 2. What the homepage actually does (the captured interaction language)

Read from `app/globals.css` and `components/shared/*`. These are the motion primitives that already exist and are in use.

### 2.1 Tokens

| Token | Value |
|---|---|
| Ease (CSS) | `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` |
| Entry | 600ms, 24px up, fade |
| Stagger | 80ms between siblings, max 6 per group |
| Hover | 200ms `ease`; lift 4px; arrow nudge 4px right |
| Press | 150ms; scale 0.98 on buttons |
| Icon pop | scale 0.8 → 1, 500ms, overshoot `cubic-bezier(0.34,1.56,0.64,1)` |
| Image settle | fade in from scale 1.04, 600ms |

### 2.2 Primitives

| Primitive | What the visitor sees | Engine | Trigger | Fallback |
|---|---|---|---|---|
| `Reveal` | Whole block fades up 24px, 700ms | CSS + IntersectionObserver | Scroll into view, once | Visible in server HTML; shown if no observer |
| `RevealStagger` | Children of a group rise one after another (80ms apart) | CSS + IntersectionObserver | Scroll, once | Same |
| `TextReveal` | H1 lines slide up from a mask; H2 words fade up in sequence; "sentences" mode reveals sentence by sentence | GSAP SplitText | H1 on load, H2 on scroll (top 85%), once | Plain text in HTML; no split under reduced motion; `media` prop splits only the visible desktop or mobile copy |
| `AccentUnderline` | Orchid underline draws under the accent word, 0.5s after load | GSAP | Load | Static underline |
| `ScrollGradient` | CTA panel's gradient drifts as the panel crosses the screen | GSAP ScrollTrigger scrub | Scroll, scrubbed | Static |
| `ScrollIllustration` | Illustration slides in 40px from the right, then scales 0.96 → 1.04 with scroll | GSAP ScrollTrigger | Scroll | Static |
| `JourneyTimeline` + `JourneyPath` | Five-step growth path: cards rise, connectors draw, nodes pop with a ring, a line draws and an orchid marker rides it. **Forward only.** Desktop only | GSAP timeline + DrawSVG + MotionPath | Scroll progress | Fully drawn static path |
| CSS-only `hero-enter` / `hero-settle` | Hero CTA and illustration enter on load with a delay | CSS | Load | `animation: none` |
| `[data-icon]`, `[data-motion-image]` | Icons pop and images settle when the block around them is shown | CSS keyed to parent state | Parent shown | Final state |
| `.btn` | Arrow nudges right on hover and focus; press scale 0.98 | CSS | Hover / focus / press | Hover-only, off under reduced motion |
| `.nav-link` | Underline draws from the left | CSS | Hover / focus | Underline is instant under reduced motion |
| `.social-lift` | Footer social icons lift 4px | CSS | Hover / focus | Off |
| `menu-in`, `cookie-in/out` | Sign-in dropdown drops in; cookie banner slides up after 600ms and slides away on choice | CSS | Open / load / choice | `animation: none` |
| `.faq-card`, `.faq-icon` | Background and border fade; icon grows 1.1× when open | CSS | Click | No transition |

### 2.3 Rules that make it feel calm

1. Everything plays once. Nothing loops. The Journey marker stops when scrolling stops.
2. Content is in the server HTML and is only hidden after JavaScript proves IntersectionObserver works.
3. `transform` for entry, `translate` for hover, so they never fight on one element.
4. Reduced motion shows final states with zero transition. GSAP is wrapped in `matchMedia`.
5. Hover and keyboard focus show the same cue.

## 3. Where each other page stands today

Counted from the code. "Reveal" = a section-level fade-up wrapper.

| Page | Sections | Section `Reveal` | Heading reveal | Stagger groups | Icon / image motion | Hero motion | Shared header, footer, cookie, `.btn`, FAQ |
|---|---|---|---|---|---|---|---|
| About | 5 | 4 | none | none | none | none | inherited |
| Contact Us | 2 | 1 | none | none | none | none | inherited |
| Parents | 8 | 7 | 1 (S7) | none | none | accent underline | inherited |
| Resources | 7 | 6 | none | none | none | none | inherited |
| Schools | 9 | 8 | none | none | none | none | inherited |
| Therapy Centres | 8 | 7 | 2 (S5, S7) | none | none | none | inherited |

Reading: every page already gets the global layer (nav underline, button arrow, cookie banner, FAQ cards, footer) for free, and each section already fades up as one block. What is missing is the **second layer** that makes the homepage feel designed: headings that reveal, card grids that stagger, icons and images that settle, hover lift on cards, and one signature moment per page.

## 4. UX audit of the current state (the "why")

Framed as an audit, because that is what decides the scope.

- **What works:** one calm fade per section is safe, accessible and cheap. Keep it as the floor.
- **Biggest problem:** the whole section arrives as one slab, so the eye gets no order. On card-heavy sections (Parents S1, S3, S4: about 10–16 rounded blocks each; Therapy Centres S2: 20; Schools S5: 10) the visitor cannot tell what to read first. Stagger exists to give reading order, not decoration.
- **Root cause:** the homepage primitives were applied only inside `home/`. Other pages got only the section wrapper.
- **Second problem, verify first:** on the homepage, Sections 2–7 are wrapped in `Reveal` **and** contain `RevealStagger`, so a block rises, then its children rise again. That is two stacked entries for one thing. The rollout must pick one layer per section (see 5.1). This needs a browser check before we copy the pattern to six pages.
- **What a senior designer would do differently:** decide the rule once ("section wrapper OR children stagger, never both"), then apply it mechanically, instead of tuning each page by feel.

**Right direction:** one rule per element type, applied by a table, verified by a coverage count.
**Wrong direction:** animating every element on every page because the homepage has it. Result: Resources (blog grid) and Contact (form) feel restless, the form feels slower to use, and calm is lost. This is "animation as decoration".

## 5. Design

### 5.1 Layering rule (decision needed, see section 9)

Per section, exactly one entry layer:
- **Card/grid/row sections:** no `Reveal` wrapper; use `RevealStagger` on the group, `TextReveal` on the heading.
- **Prose, hero, CTA and form sections:** keep `Reveal` as is.
- Never nest the two.

This changes the existing wrapper on card-heavy sections only. Homepage Sections 2–7 get the same fix so all pages match.

### 5.2 Element rules (apply identically on every page)

| Element | Motion | Primitive |
|---|---|---|
| H1 | Line reveal on load | `TextReveal as="h1" split="lines" trigger="load"` |
| H2 | Word reveal on scroll | `TextReveal as="h2" split="words" trigger="scroll"`, with `media` where desktop and mobile copies both exist |
| Card, row, tile grids | Staggered rise, max 6 per group (the 7th and later share the 6th's delay, the CSS already caps this) | `RevealStagger` |
| Icons | Pop with their card | `data-icon` |
| Images, illustrations | Settle from 1.04 | `data-motion-image` |
| CTA panel | Gradient drift | `ScrollGradient` |
| Buttons | Arrow nudge, press | `.btn` (already global) |
| Linked cards (resource, blog, article) | Lift 4px + shadow on hover and focus; arrow nudge | new shared `.card-lift` class (CSS only) |
| Trust / stat rows | Stagger, icon pop | `RevealStagger` + `data-icon` |

New CSS: `.card-lift` only. Everything else already exists.

### 5.3 Per-page plan

Section contents were read by heading and element counts, not line by line. Each line below is a proposal to confirm during implementation.

**About (5)**
- S0 H1 "Our Story": line reveal.
- S1 "What we stand for": value cards stagger + icon pop.
- S2 Leadership, S3 Advisory Board: person cards stagger, portrait settles, mild hover lift. No icon pop.
- S4 CTA: keep `Reveal`, add `ScrollGradient` only if the panel uses the shared gradient token.
- Signature moment: none. About should be the quietest page.

**Contact Us (2)**
- S0 H1 line reveal.
- S1 form: one `Reveal` on the form card. **Nothing on inputs, selects or errors.** The form must never feel slow.
- Signature moment: none.

**Parents (8)**
- S0 keeps the accent underline and H1 reveal (already there); add `hero-settle` to the illustration if one exists.
- S1 "Recognising Early…" (16 blocks): stagger the sign cards in groups, icon pop.
- S2 "Wondering what these signs could mean?": heading reveal, CTA stays.
- S3 "The years that shape…" and S4 (10 blocks each): stagger rows. Candidate for a Journey-style forward-only moment, see below.
- S5 "Learning that adapts…": image settle + heading.
- S6 FAQ: already covered by `FaqCards`; heading reveal only.
- S7 CTA: already has `TextReveal`; add `ScrollGradient`.
- Signature moment (proposed): reuse `JourneyTimeline` for the "years that shape" age stages **only if** S3 is a sequence. Confirm by looking at the section.

**Resources (7)**
- S0 H1 reveal.
- S1 Knowledge Base, S2 "Beyond the label": heading reveal + one Reveal each.
- S3 Research, S4 Achievements, S5 Blog (374 lines, the densest): stagger article cards, image settle, `.card-lift` on every linked card. This is where hover lift matters most.
- S6 CTA: `ScrollGradient`.
- Signature moment: none beyond card lift. Content-heavy pages should stay calm.

**Schools (9)**
- S0 H1 reveal, accent underline if the accent word exists, two CTAs already handled by `.btn`.
- S1–S3 headings reveal; S2 (6 blocks) stagger + icon pop.
- S4 image: settle (and optional `ScrollIllustration` slide-in).
- S5 "Every…" (10 blocks): stagger.
- S6 evidence (4 blocks): stagger.
- S7 FAQ: heading only. S8 CTA: `ScrollGradient`.

**Therapy Centres (8)**
- S0 H1 reveal + hero image settle (already uses `Image`).
- S1 "What we believe": heading + stagger.
- S2 "Skills empowering every child's journey" (10 cards): becomes a horizontal scroller (section 5.5) instead of a stagger grid. Heading reveal; the row gets one `Reveal`; no per-card stagger.
- S3 heading + CTA; S4 image settle.
- S5 stats ("12 months. 43 children…"): already uses sentence reveal; add stagger on the stat cards.
- S6 FAQ heading. S7 CTA already has `TextReveal`; add `ScrollGradient`.

### 5.4 Shared code changes

- Add `.card-lift` to `app/globals.css`, with reduced-motion off-switch inside the existing `no-preference` block.
- No new React primitives. Every page change is applying existing components. This keeps the diff boring and reviewable.
- Remove `Reveal` from card-heavy sections (5.1) on all pages including Home.
- Performance: today `TextReveal`, `ScrollGradient`, `ScrollIllustration` each register GSAP plugins at module load, and `JourneyTimeline` pulls DrawSVG and MotionPath. Rolling out to six pages makes more routes ship SplitText and ScrollTrigger. Mitigation: confirm Next.js already code-splits them per route (it does for client components used only on that route); measure first-load JS per route before and after. If a route grows more than 5%, lazy-load the plugin inside the component with a dynamic `import()`.

### 5.5 HorizontalScroller (Therapy Centres S2, decided)

Decisions from review: native swipe row; desktop and mobile; arrows plus progress bar; this section only for now.

- **Purpose:** the 10 skill cards are 2 rows on desktop and 5 rows on mobile. One row cuts the section height by about half on desktop and about 75% on mobile.
- **Mechanism:** a plain `overflow-x: auto` row with CSS `scroll-snap-type: x proximity`. No scroll-jacking, so page scroll is untouched. Works with no JavaScript.
- **Card width:** about 4.5 cards visible on desktop (the half card shows there is more), about 1.5 on mobile. Card design is unchanged; only its width becomes fixed.
- **Controls (client component):** previous and next round buttons that scroll by one card width, disabled at each end; a thin progress bar tracking `scrollLeft / (scrollWidth - clientWidth)`. Arrows are hidden on touch devices (`hover: none`). Uses the shared `.btn`-style press scale 0.95 and the same hover cue as other controls.
- **Accessibility:** the row is `role="region"` with an `aria-label`, focusable with the keyboard, and arrow keys scroll it. Buttons have labels. The progress bar is decorative (`aria-hidden`). Reduced motion: scrolling jumps instead of animating (`behavior: auto`).
- **Motion:** heading reveal and one `Reveal` on the row. Cards inside do not stagger, because off-screen cards would finish their entry before anyone sees them. Card hover tint stays as it is.
- **Reusable:** `components/shared/HorizontalScroller.tsx`. Not applied elsewhere until you approve other sections.
- **Edge cases:** content that fits (wide screens) hides the controls; resize recalculates; last card is fully reachable; no horizontal page overflow at 390px (the scroll is contained in the row).

## 6. Edge cases

- **Duplicate mobile and desktop copies** (the homepage has them in Sections 2 and 5): wherever a page renders both, pass `media` to `TextReveal`; CSS entries already skip hidden elements. Verify on each page at 1280px and 390px.
- **Card counts above 6:** later children share the 6th delay (cap), so a 20-card grid does not take 1.6s to finish.
- **Elements already on screen at load:** appear immediately; hero uses load-time animation.
- **Anchor links and back/forward navigation:** a section already scrolled past must show its final state; the observers only ever move forward (hide-then-show), so check anchor jumps (e.g. a footer link to a page section) land on visible content.
- **Touch devices:** nothing depends on hover.
- **Language of the page does not change:** no copy edits.

## 7. Testing

Automated:
- Extend `tests/e2e/motion-homepage.spec.ts` into a table-driven `motion-pages.spec.ts` that loops over all 7 routes and checks: all content visible with JavaScript disabled; all content in final state under `prefers-reduced-motion: reduce`; no console errors; no horizontal overflow at 390px; no more than 3 elements mid-animation at once while scrolling.
- Unit tests stay as they are (no new primitives). Existing tests keep passing; `tsc --noEmit` and `npm run build` pass.
- Coverage report per page: animated units / total units, in the same counting method as the homepage spec (section 3 there).

Visual (by me, in the browser, per page): scroll top to bottom at 1280px and 390px, and record what moved.

Performance: Lighthouse (or the Playwright trace) for LCP and first-load JS per route, before and after.

## 8. Rollout (each step verified in the browser before the next)

0. Fix the layering rule on the homepage first (5.1), so the pattern we copy is clean.
1. Add `.card-lift`. Verify on Resources.
2. Resources, then About, then Contact Us (the calm pages first, to confirm restraint).
3. Schools, then Therapy Centres.
4. Parents last (most blocks, plus the optional Journey reuse).
5. Table-driven e2e, coverage report, performance comparison.

No commits: the project is not connected to GitHub, so work stays in the working tree. To keep the diff reviewable, each page is finished and checked before the next starts.

## 9. Decisions needed from you

1. **Layering rule:** are you happy for me to remove the whole-section `Reveal` from card-heavy sections (including Home Sections 2–7) so cards stagger on their own? Recommended: yes. Alternative: keep both, which stacks two entries.
2. **Parents "years that shape" section:** reuse the Journey forward-only path if it is a sequence? Recommended: look at it with you first; skip if it is not a sequence.
3. **Calm pages:** confirm About, Contact and Resources should get the quieter treatment above (no signature moment).
4. ~~Homepage commit~~ Resolved: no commits at all (not connected to GitHub).
5. **GSAP licence:** DrawSVG, MotionPath and SplitText need the licence terms checked against where the site will be hosted. Not a blocker for the prototype; flag before production.

## 10. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Stacked entries make pages feel busy | Medium | Layering rule + calm check in the e2e |
| Per-route JS growth | Medium | Measure; lazy-load plugins if over 5% |
| Per-page proposals in 5.3 are wrong because sections were read by counts | Medium | Confirm each section visually as its page is done |
| Hidden duplicate copies double-run a reveal | Low | `media` prop, checked at both widths |
| Large diff | Medium | Finish and check one page at a time |

### 5.6 Amendment: wheel-linked pinned scroll-through (decided after review)

Decided with the user: on every `HorizontalScroller`, the mouse wheel drives the row. With a fine pointer and motion allowed, the block pins below the header and the page's downward scroll moves the cards 1:1; when the last card shows, the page carries on. Touch devices keep native swipe; reduced motion keeps the native row. Sideways trackpad swipes, the arrows and the arrow keys are routed through page scroll so they never fight the pin. In-page `#links` are re-aimed once after the wrapper grows. `HorizontalScroller` is the only horizontal scroller on the site, so this covers every instance.
