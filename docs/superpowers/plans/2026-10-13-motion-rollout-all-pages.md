# Motion Rollout to All Pages + Therapy Skills Scroller Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **The project is not connected to GitHub: never run `git commit`, `git add` or any push.** Work stays in the working tree.

**Goal:** Give About, Contact Us, Parents, Resources, Schools and Therapy Centres the same calm motion language the homepage has, and turn Therapy Centres "Skills empowering every child's journey" into a horizontal scroller.

**Architecture:** No new motion primitives. Apply the existing `TextReveal`, `RevealStagger`, `Reveal`, `ScrollGradient`, `ScrollIllustration` and `.btn`/`data-icon`/`data-motion-image` hooks to each page, add one CSS class (`.card-lift`) and one new client component (`HorizontalScroller`). One entry layer per block: a page-level `Reveal` wrapper is removed from every section whose body is converted to inner `Reveal`/`RevealStagger` blocks, and kept on CTA and form sections.

**Tech Stack:** Next.js 16 app router, React 19, Tailwind 4, GSAP 3.15 (`@gsap/react`, ScrollTrigger, SplitText), Vitest + Testing Library (unit), Playwright (e2e, runs against `npm run build && npm run start`).

**Spec:** `docs/superpowers/specs/2026-10-13-motion-rollout-all-pages-design.md` (approved). Parent spec: `docs/superpowers/specs/2026-10-13-motion-system-design.md`. All commands run from `/Users/samarthkumar/CBT/cbt-site`.

## Global Constraints

- Entry: 600ms, `var(--ease-out)` = `cubic-bezier(0.16, 1, 0.3, 1)`, 24px up. Stagger 80ms, max 6 per group (CSS already caps at the 6th).
- Hover lift 4px via the `translate` property (never `transform`); arrow nudge 4px; press scale 0.98 (buttons) and 0.95 (carousel controls).
- Everything plays once. Nothing loops. No motion on body paragraphs, inputs, selects or form errors.
- Content must be in the server HTML. Pending state is set only after mount (existing primitives already do this).
- `prefers-reduced-motion: reduce` shows final states with no transition; hover motion lives inside `@media (prefers-reduced-motion: no-preference)`.
- No copy, route, navigation or information-architecture change. Heading text content must stay identical (e2e compares h1/h2/h3 text with `reference/*/copy.json`).
- No `git commit` and no GitHub. At most 3 elements mid-animation at once while scrolling.
- Do not lift (`card-lift`) cards that are not links or buttons: a lift implies clickable.
- Deviation from spec §5.3, deliberate: person cards on About S2/S3 get **no hover lift** (they are not interactive). Everything else in the spec stands.

## Review Focus

Failure modes the spec implies but no single task's feature tests cover most directly (each is pinned by a test in the owning task):

1. A heading whose content is not a single string (a span, an accent word) is wrongly converted to `TextReveal` and loses styling. Expected: left as is. Pinned by `tsc` (children is `string`) in each page task and the grep in Task 5.
2. Hover lift on a card inside a stagger group waits for the stagger delay (320ms on the 5th card) or fights the entry transition. Expected: hover responds within 200ms with no delay. Pinned in Task 1 (e2e).
3. `HorizontalScroller` last card unreachable, or arrows enabled when everything fits. Pinned in Task 2 (unit) and Task 3 (e2e).
4. A section dropped from page-level `Reveal` is left with nothing animating at all. Pinned by the coverage check in Task 11.
5. Anchor links (`#get-in-touch`) or back-navigation land on a section whose children are still hidden. Pinned in Task 11.

---

## Files

| File | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | `--stagger` var refactor, `.card-lift`, `.hscroll` layout and reduced-motion rules |
| `components/shared/HorizontalScroller.tsx` | Create | Native scroll-snap row + arrows + progress thumb |
| `tests/unit/horizontal-scroller.test.tsx` | Create | Unit tests for the scroller |
| `tests/e2e/motion-pages.spec.ts` | Create | Table-driven checks over all 7 routes, plus card-lift and scroller behaviour |
| `components/pages/home/HomePage.tsx` | Modify | Layering fix |
| `components/pages/{about,contact-us,parents,resources,schools,therapy-centres}/*Page.tsx` | Modify | Drop page-level `Reveal` where sections are converted |
| `components/pages/*/sections/SectionN.tsx` | Modify | Apply recipes below |

## Recipes (read first; every page task refers to them by letter)

**Recipe A: heading reveal.** Only when the heading's whole content is one text node.
```tsx
// before
<h2 className="font-heading text-[24px] ...">
  Leadership
</h2>
// after (add: import { TextReveal } from "@/components/shared/TextReveal";)
<TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] ...">{"Leadership"}</TextReveal>
```
H1 in a hero (section 0): `as="h1" split="lines" trigger="load"`. Keep the class string byte-for-byte. If the heading contains any element (`<span>`, `<br>`, `<AccentUnderline>`) or several `{}` parts, **do not convert**; leave it, and list it in your task notes. `tsc` enforces this because `children` is `string`.

**Recipe B: group stagger.** Swap the grid/list container's tag; keep its classes.
```tsx
// before
<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-10 lg:gap-6 lg:grid-cols-3">
// after (add: import { RevealStagger } from "@/components/shared/RevealStagger";)
<RevealStagger className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-10 lg:gap-6 lg:grid-cols-3">
```
and change the matching closing `</div>` to `</RevealStagger>`. Children must be direct children of the container (the CSS is `.reveal-group > *`). If a card has an icon wrapper, add `data-icon` to it; if it has an image or portrait wrapper, add `data-motion-image` to it.

**Recipe C: single block rise.** Swap a lone block's tag (layout-neutral because `Reveal` renders a `div` with your class).
```tsx
<Reveal className="mt-16 hidden grid-cols-1 items-center gap-10 lg:grid lg:grid-cols-2"> ... </Reveal>
```
Add `data-motion-image` on an image container inside it to get the settle.

**Recipe D: CTA panel gradient.** Where the panel `div` has `style={{ "--cta-bg": ..., "--cta-bg-mobile": ... }}` (as on Therapy S7 and homepage Section 7), replace that `div` by `ScrollGradient` with the same className and style:
```tsx
<ScrollGradient className="flex flex-col [background:var(--cta-bg-mobile)] ..." style={{ "--cta-bg": "...", "--cta-bg-mobile": "..." }}> ... </ScrollGradient>
```
Closing tag becomes `</ScrollGradient>`. Page-level `Reveal` stays on CTA sections. If the panel has no `--cta-bg` gradient style, skip this recipe.

**Recipe E: hero image settle.** On the hero illustration container add `hero-settle hero-delay-2` to its className (as homepage `Section0.tsx:39`). No wrapper change.

**Recipe F: standalone illustration beside content** (an image block that is not inside a group): replace its container `div` by `ScrollIllustration`, same className (as homepage Section 2). Use only when the section was dropped from page-level `Reveal` and the image would otherwise sit static next to animated cards.

**Recipe G: linked card lift.** On cards that are `<Link>`, `<a>` or `<button>` add the class `card-lift` (defined in Task 1). Never on non-interactive cards.

**Page-level `Reveal` rule.** Remove `<Reveal>` around a section when its body uses Recipe B/C/F. Keep it on CTA sections, form sections, and prose-only sections.

---

### Task 1: Shared CSS (`--stagger`, `.card-lift`, `.hscroll`)

**Files:**
- Modify: `app/globals.css` (the `.reveal-group` block near line 108 and the `no-preference` block near line 218)
- Test: `tests/e2e/motion-pages.spec.ts` (created here, extended later)

**Interfaces:**
- Produces: CSS classes `.card-lift` (hover/focus lift for linked cards, works inside `.reveal-group`), `.hscroll` (the scroller row; used only by `HorizontalScroller`), and custom property `--stagger` set by the nth-child rules.

- [ ] **Step 1: Write the failing e2e test**

Create `tests/e2e/motion-pages.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import { noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('a linked card inside a stagger group lifts on hover without the stagger delay', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/resources', { waitUntil: 'networkidle' });
  const card = page.locator('.card-lift').nth(4); // a later child: the old stagger delay would be 320ms
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // entry finished
  await card.hover();
  await page.waitForTimeout(260); // hover is 200ms; a 320ms delay would not have started
  const ty = await card.evaluate((el) => getComputedStyle(el).translate);
  expect(ty).toMatch(/-4px/);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test tests/e2e/motion-pages.spec.ts -g "lifts on hover"`
Expected: FAIL (no `.card-lift` elements yet, locator times out).

- [ ] **Step 3: Refactor the stagger delay into a variable and add `.card-lift` and `.hscroll`**

In `app/globals.css`, replace the six `transition-delay` lines and the group transition so the delay is a variable:
```css
.reveal-group > * {
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
  transition-delay: var(--stagger, 0ms);
}
.reveal-group > :nth-child(2) { --stagger: 80ms; }
.reveal-group > :nth-child(3) { --stagger: 160ms; }
.reveal-group > :nth-child(4) { --stagger: 240ms; }
.reveal-group > :nth-child(5) { --stagger: 320ms; }
.reveal-group > :nth-child(n+6) { --stagger: 400ms; }
```
(The old file had rules only up to the 6th child; `n+6` extends the cap to every later child so a 10 or 20 card group never waits longer than 400ms.)

Inside `@media (prefers-reduced-motion: no-preference)` add:
```css
  .card-lift,
  .reveal-group > .card-lift {
    transition-property: opacity, transform, translate, box-shadow, background-color, border-color;
    transition-duration: 600ms, 600ms, 200ms, 200ms, 250ms, 250ms;
    transition-timing-function: var(--ease-out), var(--ease-out), ease, ease, ease, ease;
    transition-delay: var(--stagger, 0ms), var(--stagger, 0ms), 0ms, 0ms, 0ms, 0ms;
  }
  .card-lift:hover,
  .card-lift:focus-visible {
    translate: 0 -4px;
    box-shadow: 0px 10px 28px -8px rgba(23, 94, 99, 0.18);
  }
```
In the existing `@media (prefers-reduced-motion: reduce)` block extend the group reset so `--stagger` cannot delay anything: add `--stagger: 0ms;` to the `.reveal-group > :nth-child(n)` rule (change that selector to `.reveal-group > :nth-child(n)` already present; add the declaration).

Add the scroller layout (top level, after the motion system block):
```css
/* Horizontal scroller: a native scroll-snap row. --visible cards show at once (the fraction hints at
   more); --gaps is the count of full gaps in view (floor of --visible). */
.hscroll {
  --gap: 12px;
  --visible: 1.5;
  --gaps: 1;
  display: flex;
  gap: var(--gap);
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
  scroll-behavior: smooth;
}
.hscroll::-webkit-scrollbar { display: none; }
.hscroll > * {
  flex: 0 0 auto;
  width: calc((100% - var(--gap) * var(--gaps)) / var(--visible));
  scroll-snap-align: start;
}
.hscroll:focus-visible { outline: 2px solid var(--color-brand-teal, #175f63); outline-offset: 4px; }
@media (min-width: 1024px) {
  .hscroll { --gap: 20px; --visible: 4.5; --gaps: 4; }
}
@media (prefers-reduced-motion: reduce) {
  .hscroll { scroll-behavior: auto; }
}
@media (hover: none) {
  .hscroll-arrows { display: none; }
}
```

- [ ] **Step 4: Add `card-lift` to the Resources blog cards so the test has a target**

In `components/pages/resources/sections/Section5.tsx`, add `card-lift` to the className of each of the six `<Link` cards (lines 14, 74, 133, 193, 252, 311) and convert the grid at line 13 with Recipe B. (The full Resources task is Task 7; doing the Section5 grid now is part of it. Do not redo it later.)

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx playwright test tests/e2e/motion-pages.spec.ts -g "lifts on hover"`
Expected: PASS. Then confirm nothing else regressed: `npx vitest run` → all pass.

---

### Task 2: `HorizontalScroller` component

**Files:**
- Create: `components/shared/HorizontalScroller.tsx`
- Test: `tests/unit/horizontal-scroller.test.tsx`

**Interfaces:**
- Produces: `export function HorizontalScroller({ label, children, className }: { label: string; children: ReactNode; className?: string })`. `children` are the cards (direct children of the row; each gets width and snap from `.hscroll > *`). `label` is the accessible name of the region and the prefix of the button labels.

- [ ] **Step 1: Write the failing tests**

`tests/unit/horizontal-scroller.test.tsx`:
```tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HorizontalScroller } from '@/components/shared/HorizontalScroller';

function setGeometry(el: HTMLElement, g: { scrollWidth: number; clientWidth: number; scrollLeft: number }) {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: g.scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: g.clientWidth });
  Object.defineProperty(el, 'scrollLeft', { configurable: true, writable: true, value: g.scrollLeft });
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

const cards = [1, 2, 3, 4, 5, 6].map((n) => <div key={n}>Card {n}</div>);

describe('HorizontalScroller', () => {
  it('renders every card and a labelled, focusable region', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('Card 6')).toBeInTheDocument();
  });

  it('shows no controls when everything fits', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 500, clientWidth: 500, scrollLeft: 0 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.queryByRole('button', { name: 'Next Skills' })).not.toBeInTheDocument();
  });

  it('disables Previous at the start and Next at the end, enables both in between', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.getByRole('button', { name: 'Previous Skills' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next Skills' })).toBeEnabled();
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 300 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.getByRole('button', { name: 'Previous Skills' })).toBeEnabled();
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 600 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.getByRole('button', { name: 'Next Skills' })).toBeDisabled();
  });

  it('Next scrolls forward by one card step, smoothly unless reduced motion is on', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    region.scrollBy = vi.fn();
    Object.defineProperty(region.children[0], 'offsetLeft', { configurable: true, value: 0 });
    Object.defineProperty(region.children[1], 'offsetLeft', { configurable: true, value: 100 });
    act(() => { fireEvent.scroll(region); });
    fireEvent.click(screen.getByRole('button', { name: 'Next Skills' }));
    expect(region.scrollBy).toHaveBeenCalledWith({ left: 100, behavior: 'smooth' });
  });

  it('uses behavior auto under reduced motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    region.scrollBy = vi.fn();
    Object.defineProperty(region.children[0], 'offsetLeft', { configurable: true, value: 0 });
    Object.defineProperty(region.children[1], 'offsetLeft', { configurable: true, value: 100 });
    act(() => { fireEvent.scroll(region); });
    fireEvent.click(screen.getByRole('button', { name: 'Next Skills' }));
    expect(region.scrollBy).toHaveBeenCalledWith({ left: 100, behavior: 'auto' });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/unit/horizontal-scroller.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

`components/shared/HorizontalScroller.tsx`:
```tsx
"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = { label: string; children: ReactNode; className?: string };

const ARROW_BTN =
  "transition-transform motion-safe:enabled:hover:scale-105 motion-safe:enabled:active:scale-95 flex size-12 items-center justify-center rounded-full border-[1.5px] border-brand-teal-100 bg-white shadow-[0px_4px_10px_0px_rgba(23,94,99,0.1)] disabled:cursor-not-allowed disabled:opacity-40";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-content-brand">
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

// A row of cards the visitor scrolls sideways. The row is plain overflow with CSS scroll-snap
// (.hscroll in globals.css), so it works without JavaScript. JavaScript only adds the arrows and
// the progress thumb, and only when the content does not fit. Arrows are hidden on touch devices
// by CSS (hover: none), where swiping is the norm.
export function HorizontalScroller({ label, children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ overflow: false, canPrev: false, canNext: false, thumb: 100, left: 0 });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const overflow = max > 1;
    setM({
      overflow,
      canPrev: overflow && el.scrollLeft > 1,
      canNext: overflow && el.scrollLeft < max - 1,
      thumb: overflow ? (el.clientWidth / el.scrollWidth) * 100 : 100,
      left: overflow ? (el.scrollLeft / el.scrollWidth) * 100 : 0,
    });
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    const card = first && second ? second.offsetLeft - first.offsetLeft : el.clientWidth * 0.8;
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * card, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={className}>
      <div ref={ref} role="region" aria-label={label} tabIndex={0} onScroll={measure} className="hscroll">
        {children}
      </div>
      {m.overflow && (
        <div className="hscroll-arrows mt-5 flex items-center gap-5 lg:mt-8">
          <button type="button" aria-label={`Previous ${label}`} disabled={!m.canPrev} onClick={() => step(-1)} className={ARROW_BTN}>
            <Chevron dir="left" />
          </button>
          <button type="button" aria-label={`Next ${label}`} disabled={!m.canNext} onClick={() => step(1)} className={ARROW_BTN}>
            <Chevron dir="right" />
          </button>
        </div>
      )}
      {m.overflow && (
        <div aria-hidden="true" className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-brand-teal-100">
          <div className="absolute inset-y-0 rounded-full bg-brand-teal" style={{ width: `${m.thumb}%`, left: `${m.left}%` }} />
        </div>
      )}
    </div>
  );
}
```
Note: the arrows wrapper uses `.hscroll-arrows` so touch devices hide only the arrows; the progress thumb stays on every device. Placing arrows and thumb on separate rows is deliberate: the thumb spans the full width.

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run tests/unit/horizontal-scroller.test.tsx`
Expected: PASS (5 tests). Then `npx tsc --noEmit` → no errors.

---

### Task 3: Therapy Centres "Skills empowering every child's journey" becomes a scroller

**Files:**
- Modify: `components/pages/therapy-centres/sections/Section2.tsx`
- Modify: `components/pages/therapy-centres/TherapyCentresPage.tsx` (drop the `Reveal` around `Section2`)
- Test: `tests/e2e/motion-pages.spec.ts`

**Interfaces:**
- Consumes: `HorizontalScroller({ label, children, className })` from Task 2; `Reveal`, `TextReveal` (Recipe A).

- [ ] **Step 1: Write the failing e2e tests** (append to `motion-pages.spec.ts`)
```ts
const SKILLS_LAST = 'Expressive Skill';

test('therapy skills: one row, every card reachable, no page overflow (desktop and mobile)', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const region = page.getByRole('region', { name: 'Skills' });
    await region.scrollIntoViewIfNeeded();
    const tops = await region.locator('> *').evaluateAll((els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size);
    expect(tops, `cards sit on one row at ${width}px`).toBe(1);
    await region.evaluate((el) => { el.scrollLeft = el.scrollWidth; });
    await expect(region.getByText(SKILLS_LAST)).toBeInViewport();
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(over).toBeLessThanOrEqual(0);
  }
});

test('therapy skills: arrows move the row on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
  const region = page.getByRole('region', { name: 'Skills' });
  await region.scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Previous Skills' })).toBeDisabled();
  await page.getByRole('button', { name: 'Next Skills' }).click();
  await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBeGreaterThan(50);
  await expect(page.getByRole('button', { name: 'Previous Skills' })).toBeEnabled();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/e2e/motion-pages.spec.ts -g "therapy skills"`
Expected: FAIL (no region named Skills).

- [ ] **Step 3: Convert the section**

In `Section2.tsx`: add imports `HorizontalScroller`, `Reveal`, `TextReveal`. Replace the `<h2>` with Recipe A (text "Skills empowering every child’s journey", keep its class). Replace the grid wrapper
`<div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-6 lg:gap-5 lg:grid-cols-5">` … `</div>` with
```tsx
<Reveal className="mt-6">
  <HorizontalScroller label="Skills">
    {/* the ten existing card divs, unchanged, as direct children */}
  </HorizontalScroller>
</Reveal>
```
Leave all ten card `div`s as they are (hover tint, copy, placeholders). Add `data-motion-image` to each card's image container (`relative h-[137px] w-full ... overflow-hidden`) so it settles when the row is revealed. Remove the now-unused grid classes only (they go with the old wrapper).

In `TherapyCentresPage.tsx` change `<Reveal><Section2 /></Reveal>` to `<Section2 />`.

- [ ] **Step 4: Run to verify it passes**

Run: `npx playwright test tests/e2e/motion-pages.spec.ts -g "therapy skills"` → PASS. Then `npx playwright test tests/e2e/therapy-centres.spec.ts` → PASS (structure and heading text unchanged).

- [ ] **Step 5: Look at it**

Start `npm run dev`, open `/therapy-centres`, check at 1440px and 390px: half card visible at the right edge, arrows only on desktop, thumb moves, heading words reveal once, section is visibly shorter. Record the before/after section height in your task notes.

---

### Task 4: Homepage layering fix

**Files:**
- Modify: `components/pages/home/HomePage.tsx`

Sections 2, 4, 5 contain a `RevealStagger`, and Section 6 is a FAQ whose cards are a `RevealStagger`. Each is also wrapped in page-level `Reveal`, which stacks two entries.

- [ ] **Step 1: Capture the baseline**

Run: `npx playwright test tests/e2e/motion-homepage.spec.ts tests/e2e/home.spec.ts` → note PASS/FAIL (they must pass before and after).

- [ ] **Step 2: Edit**

```tsx
      <Section2 />
      <Reveal><Section3 /></Reveal>
      <Section4 />
      <Section5 />
      <Section6 />
      <Reveal><Section7 /></Reveal>
```
Update the comment above the component to: `// Section1 animates itself with GSAP. Sections 2, 4, 5 and 6 animate their own groups; Reveal wraps only the CTA panels.`

- [ ] **Step 3: Verify**

Re-run the two specs above → PASS. In the browser, scroll the homepage at 1440px and confirm Sections 2, 4, 5, 6 show their headings and groups once each (no double rise). Section 2's illustration still slides in (`ScrollIllustration`).

---

### Task 5: About

**Files:** Modify `components/pages/about/AboutPage.tsx`, `sections/Section0.tsx` to `Section3.tsx`. (Section 4 stays wrapped, no code change except Recipe D if applicable.)

| Section | Change |
|---|---|
| S0 | H1 "Our Story": Recipe A (`as="h1" split="lines" trigger="load"`). Page: no `Reveal` (already none). |
| S1 | H2 Recipe A. Grid line 8 (3 cols, 6 value cards): Recipe B. Icons: `data-icon` if a card has one. Page: drop `Reveal`. |
| S2 Leadership | H2 Recipe A. Grid line 10: Recipe B; add `data-motion-image` to each portrait container. No lift. Page: drop `Reveal`. |
| S3 Advisory Board | Same as S2. |
| S4 CTA | Keep `Reveal`. Recipe D if the panel has `--cta-bg` style. |

- [ ] **Step 1:** Run `npx playwright test tests/e2e/about.spec.ts` → PASS (baseline).
- [ ] **Step 2:** Apply the table; update `AboutPage.tsx` so only `<Section4 />` stays in `Reveal`.
- [ ] **Step 3:** Run `npx tsc --noEmit` → no errors (this is also the guard for Recipe A's string-only rule).
- [ ] **Step 4:** Run `npx playwright test tests/e2e/about.spec.ts` → PASS. Run `npx vitest run` → PASS.
- [ ] **Step 5:** Browser check at 1440px and 390px: nothing hidden, cards stagger once, portraits settle, no horizontal overflow.

---

### Task 6: Contact Us

**Files:** Modify `sections/Section0.tsx`, `ContactUsPage.tsx` (no change expected for the wrapper).

| Section | Change |
|---|---|
| S0 | H1 Recipe A (load). Illustration (the `Placeholder` at line 24, inside its container): Recipe E on that container. |
| S1 | None. Keep page-level `Reveal`. **No motion on inputs, selects or errors.** |

- [ ] **Step 1:** Run `npx playwright test tests/e2e/contact-us.spec.ts` and `npx vitest run tests/unit/contact-form.test.ts tests/unit/contact-select.test.tsx` → PASS (baseline).
- [ ] **Step 2:** Apply the table.
- [ ] **Step 3:** `npx tsc --noEmit`, then re-run the same tests → PASS. Submit the form in the browser: typing, selecting, validation errors feel exactly as before.

---

### Task 7: Resources

**Files:** Modify `ResourcesPage.tsx`, `sections/Section0.tsx` to `Section6.tsx`. (Section 5's grid and `card-lift` were done in Task 1 Step 4; verify, do not redo.)

| Section | Change |
|---|---|
| S0 | H1 Recipe A (load). |
| S1 Knowledge Base | H2 Recipe A. Panel line 10 (single feature block): Recipe C. Page: drop `Reveal`. |
| S2 Beyond the label | H2 Recipe A. Grid line 16 of `<button>` cards: Recipe B + Recipe G (`card-lift`). Page: drop `Reveal`. |
| S3 Research | H2 Recipe A. Row line 19 (three `<Link>` cards): Recipe B + Recipe G; `data-motion-image` on each card image. Page: drop `Reveal`. |
| S4 Achievements | H2 Recipe A. Grid line 8 of `<a>` cards: Recipe B + Recipe G if they are real links (`href` not `#`); otherwise no lift. Page: drop `Reveal`. |
| S5 Blog | H2 Recipe A. Done in Task 1 (grid + lift); add `data-motion-image` to each card image. Page: drop `Reveal`. |
| S6 CTA | Keep `Reveal`. Recipe D if applicable. |

- [ ] **Step 1:** Run `npx playwright test tests/e2e/resources.spec.ts` → PASS (baseline).
- [ ] **Step 2:** Apply the table. In `ResourcesPage.tsx` only `<Section6 />` stays in `Reveal`.
- [ ] **Step 3:** `npx tsc --noEmit` → clean; `npx playwright test tests/e2e/resources.spec.ts` → PASS.
- [ ] **Step 4:** Browser check at 1440px and 390px: hover and keyboard focus lift linked cards identically; keyboard tab order unchanged; no console errors.

---

### Task 8: Schools

**Files:** Modify `SchoolsPage.tsx`, `sections/Section0.tsx` to `Section8.tsx`.

| Section | Change |
|---|---|
| S0 | H1 contains an accent (`{"Making "}` + element): **not convertible**, leave as is. Illustration container (line 49): Recipe E. |
| S1 | H2 Recipe A. Text + image row: keep page-level `Reveal` (prose + image, one block). |
| S2 | H2 Recipe A. Grid line 18 (6 cards): Recipe B (+ `data-icon` on card icons). Page: drop `Reveal`. |
| S3 | H2 Recipe A. Prose + image: keep `Reveal`. |
| S4 | Five cards in a column (lines 8–84) + image (line 104, `Image`): the column container (line 7) Recipe B; image container Recipe F. Page: drop `Reveal`. |
| S5 | H2 contains `Bloom` span: **not convertible**. Grid line 13 (9 chips): Recipe B. CTA band (line 114): Recipe C. Page: drop `Reveal`. |
| S6 | H2 Recipe A. Grid line 15 (4 cards): Recipe B. Button row (line 136): leave. Page: drop `Reveal`. |
| S7 FAQ | H2 contains custom style, check: Recipe A if plain text. `FaqCards` already staggers. Page: drop `Reveal`. |
| S8 CTA | Keep `Reveal`. Recipe D if applicable. |

Because S0 and S5 headings are not convertible, give them the page-level fade that existed: S0 stays unwrapped (hero); for S5 wrap the heading element in `Reveal` (Recipe C) so it does not sit static above animated chips.

- [ ] **Step 1:** Run `npx playwright test tests/e2e/schools.spec.ts` → PASS (baseline).
- [ ] **Step 2:** Apply the table; in `SchoolsPage.tsx` only `Section1`, `Section3` and `Section8` stay in `Reveal`.
- [ ] **Step 3:** `npx tsc --noEmit` → clean; `npx playwright test tests/e2e/schools.spec.ts` → PASS.
- [ ] **Step 4:** Browser check at both widths, as in Task 5 Step 5. The FAQ opens and closes as before and does not rise twice.

---

### Task 9: Therapy Centres (remaining sections)

**Files:** Modify `TherapyCentresPage.tsx`, `sections/Section0.tsx`, `Section1.tsx`, `Section3.tsx` to `Section7.tsx`. (Section 2 was done in Task 3.)

| Section | Change |
|---|---|
| S0 | H1 Recipe A if plain text (check for spans); trust-pill row (line 25): Recipe B (pills are direct children) + `data-icon`; illustration (line 115, `Image`): Recipe E. |
| S1 | H2 Recipe A. Prose + image: keep `Reveal`. |
| S3 | CTA-like band with `Link`: keep `Reveal`; Recipe D if applicable. |
| S4 | H2 Recipe A. Text + image: keep `Reveal`. |
| S5 | Heading already `TextReveal split="sentences"`. Stat cards grid (line 24, 3 cards): Recipe B. Header row (line 8): Recipe C. Page: drop `Reveal`. |
| S6 FAQ | H2 Recipe A. Page: drop `Reveal`. |
| S7 CTA | Heading already `TextReveal`. Recipe D (panel has `--cta-bg`). Keep `Reveal`. |

- [ ] **Step 1:** Run `npx playwright test tests/e2e/therapy-centres.spec.ts` → PASS (baseline).
- [ ] **Step 2:** Apply the table.
- [ ] **Step 3:** `npx tsc --noEmit` → clean; re-run the spec → PASS.
- [ ] **Step 4:** Browser check at both widths, including the Task 3 scroller and the `#get-in-touch` anchor.

---

### Task 10: Parents

**Files:** Modify `ParentsPage.tsx`, `sections/Section0.tsx` to `Section7.tsx`.

| Section | Change |
|---|---|
| S0 | H1 has `AccentUnderline`: leave. The S0 `h2` (inside the trust card, line 35 area): Recipe A if plain text, `trigger="scroll"`. Illustration (line 27): Recipe E. |
| S1 | H2 Recipe A. Desktop grid (line 9, 4 sign cards, icons in each): Recipe B + `data-icon`, image (line 22): Recipe F. Mobile block (line 181): Recipe C on its container (`mt-6 flex flex-col gap-6 lg:hidden`) and Recipe B on the inner grid (line 185). Page: drop `Reveal`. |
| S2 | CTA-like (Link): keep `Reveal`; Recipe D if applicable. |
| S3 | H2 Recipe A. Grid line 28 (4 stage columns, children use `contents` on mobile): Recipe B. **Check at 390px**: `.reveal-group > *` applies to the `contents` wrappers, which have no box; if they do not animate on mobile, wrap the whole grid in `Reveal` instead (Recipe C) on that page only and note it. Closing line 176: Recipe C. Page: drop `Reveal`. |
| S4 | H2 Recipe A. Grid line 15 (3 cards): Recipe B. Mobile block line 72 and desktop block line 164: Recipe C each; image containers `data-motion-image`. Note box line 209: Recipe C. Page: drop `Reveal`. |
| S5 | H2 Recipe A. Two-column grid line 10: left column (line 11) Recipe C, right illustration (line 163) Recipe F. Page: drop `Reveal`. |
| S6 FAQ | H2 Recipe A if plain text. Page: drop `Reveal`. |
| S7 CTA | Heading already `TextReveal`. Recipe D. Keep `Reveal`. |

Journey reuse for S3 is **not planned**: S3 is four age-stage columns, not a five-step sequence with a connecting path, and the spec only allows reuse if it is a sequence. Confirm this by looking at the section; if it is a true sequence, stop and ask before adding any GSAP timeline.

- [ ] **Step 1:** Run `npx playwright test tests/e2e/parents.spec.ts` → PASS (baseline).
- [ ] **Step 2:** Apply the table.
- [ ] **Step 3:** `npx tsc --noEmit` → clean; re-run the spec → PASS.
- [ ] **Step 4:** Browser check at both widths. Count blocks moving at once: at most 3.

---

### Task 11: Cross-page verification

**Files:** Extend `tests/e2e/motion-pages.spec.ts`.

- [ ] **Step 1: Add the table-driven checks**
```ts
const ROUTES = ['/', '/about', '/contact-us', '/parents', '/resources', '/schools', '/therapy-centres'];

const scrollThrough = async (page: import('@playwright/test').Page) => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(1500);
};

for (const route of ROUTES) {
  test(`${route}: every rendered group reaches its final state, no console errors, no overflow at 390px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: 'networkidle' });
    await scrollThrough(page);
    const stuck = await page
      .locator('[data-reveal-group="pending"], [data-reveal="pending"]')
      .evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent !== null).length);
    expect(stuck).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test(`${route}: with JavaScript off every heading is in the HTML`, async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(route);
    expect(await page.locator('h1').count()).toBeGreaterThan(0);
    const hidden = await page.locator('[data-reveal="pending"], [data-reveal-group="pending"]').count();
    expect(hidden).toBe(0);
    await ctx.close();
  });

  test(`${route}: reduced motion shows final state immediately`, async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(route, { waitUntil: 'networkidle' });
    const faded = await page
      .locator('.reveal, .reveal-group > *')
      .evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent !== null && getComputedStyle(e).opacity !== '1').length);
    expect(faded).toBe(0);
    await ctx.close();
  });
}

test('an anchor jump lands on visible content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/therapy-centres#get-in-touch', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await expect(page.locator('#get-in-touch h2')).toBeInViewport();
  const op = await page.locator('#get-in-touch').evaluate((el) => getComputedStyle(el.closest('.reveal') ?? el).opacity);
  expect(op).toBe('1');
});
```

- [ ] **Step 2: Run everything**

Run in order and expect all to pass:
`npx tsc --noEmit` · `npm run lint` · `npx vitest run` · `npm run build` · `npx playwright test`
If an existing structure test fails, it means a heading's text or a section count changed: undo that edit; do not edit the test.

- [ ] **Step 3: Coverage report**

For each page, count animated units (headings with `TextReveal`, `RevealStagger` children, `Reveal` blocks, `ScrollGradient`, `ScrollIllustration`, `HorizontalScroller`) against total units, using the counting method in the homepage spec §3. Write the table into `docs/superpowers/reports/2026-10-13-motion-rollout-report.md` along with the Therapy S2 before/after height.

- [ ] **Step 4: Performance check**

Run `npm run build` and record the First Load JS per route from the build table. Compare with the numbers you saved before Task 1 (run `npm run build` once at the very start and keep them). Any route more than 5% larger: lazy-load the GSAP plugin in the component that adds it (dynamic `import()` inside `useGSAP`) and re-measure. Add the before/after table to the report.

- [ ] **Step 5: Final visual pass**

Scroll all 7 pages top to bottom at 1440px and 390px with the dev server. Note anything that moves more than three things at once, anything static among moving siblings, or any lift on a non-clickable card. Fix, re-run Step 2, then report.

---

## Self-review (done against the spec)

- **Spec §5.1 layering rule:** Tasks 4 to 10 apply "page-level `Reveal` only on CTA, form, prose sections".
- **§5.2 element rules:** Recipes A to G; `.card-lift` is Task 1; buttons/nav/FAQ are global already.
- **§5.3 per-page plans:** Tasks 5 to 10 (About, Contact, Resources, Schools, Therapy, Parents). The About person-card lift is a deliberate deviation (see Global Constraints).
- **§5.5 scroller:** Tasks 1 to 3. One refinement from the spec text: the progress element is a thumb (width = visible share, position = scroll share) rather than a growing bar, because a bar at 0% reads as "empty".
- **§7 testing:** Task 11 covers JS-off, reduced motion, overflow at 390px, console errors, anchors, coverage and performance. The "no more than 3 moving at once" check is the manual count in Tasks 5 to 11 (not automated, because sampling mid-animation in Playwright is flaky).
- **Types and names:** `HorizontalScroller({ label, children, className })`, `.card-lift`, `.hscroll`, `.hscroll-arrows`, `--stagger` are used consistently across Tasks 1 to 3.
- **Not planned on purpose:** Journey reuse on Parents S3 (see Task 10), motion on form inputs, auto-advance.
