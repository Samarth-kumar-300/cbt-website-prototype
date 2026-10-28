# Journey Rail (duplicate section below the current one) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **The project is not connected to GitHub: never run `git commit`, `git add` or any push.** Work stays in the working tree. A "checkpoint" below means "the named tests are green".

**Goal:** Duplicate the home "A CHILD'S GROWTH PATH" section, place the duplicate directly below the current one, and rebuild the duplicate as an equal-column rail (desktop) / compact list (below 1280px) with a choreographed one-time entry animation. The current section is not edited.

**Architecture:** One data module feeds one server component (`JourneyRail`) that renders a single ordered list; CSS (in `globals.css`) lays it out as five columns at `xl` and as a compact vertical list below. A small client component (`JourneyRailMotion`) builds one GSAP timeline and plays it once from a ScrollTrigger (`start: top 78%`, not scrubbed). `HomePage` renders `<Section1 />` then `<JourneyRail />`. No flag, no switch, no compare page.

**Tech Stack:** Next.js 16 app router (read `node_modules/next/dist/docs/` before touching framework APIs, per `AGENTS.md`), React 19, Tailwind 4 plus plain CSS in `app/globals.css`, GSAP 3.15 (`gsap`, `ScrollTrigger`, `@gsap/react`; no paid plugins), Vitest (unit), Playwright (e2e).

**Spec:** `docs/superpowers/specs/2026-10-13-journey-rail-design.md` (approved, revised 2026-10-13: duplicate below, no switching). All commands run from `/Users/samarthkumar/CBT/cbt-site`.

## Global Constraints

- The current section is not edited: `components/pages/home/sections/Section1.tsx`, `JourneyPath.tsx`, `JourneyTimeline.tsx` get **zero** changes from this work. (They already show as modified in `git status` from earlier work; this work adds nothing to them.)
- Copy, alt text and step order identical to `components/pages/home/content.ts` (a unit test enforces it).
- `JourneyRail` renders exactly one top-level `<section data-journey="rail">`. It is the **next sibling** of the current section inside `<main>`, so `HomePage` must render `<Section1 />` immediately followed by `<JourneyRail />` with nothing between.
- Breakpoint: rail layout at `min-width: 1280px` (Tailwind `xl`, the breakpoint the header uses). Below it, the compact list.
- Animation: plays **once**, from ScrollTrigger, **never scrubbed or pinned**, total <= about 3s, `play()` is guarded so a re-run is impossible; nothing loops; no ambient motion; hover motion only inside `@media (hover: hover) and (prefers-reduced-motion: no-preference)`.
- No lift or shadow on cards on hover (they are not links; the project rule is that lift implies clickable). Hover is limited to the illustration wiggle and the node ring pulse.
- Content is in the server HTML and visible without JavaScript. Hidden start states are applied by GSAP after mount, only when `prefers-reduced-motion: no-preference`. Under reduced motion and with no JS the line is fully drawn and everything is visible.
- GSAP: `gsap` core and `ScrollTrigger` only. The rail uses DOM lines, not SVG (no `DrawSVG`, `MotionPath`, `SplitText`).
- No new npm dependencies. No `git commit`.
- Existing e2e specs may be edited **only** to account for the extra home section (Task 3), and every such edit is reported.

## Review Focus

The five conditions the spec implies that a happy-path test would not catch, each pinned by a test or check in the owning task:

1. **Arriving past the section** (anchor link, reload with scroll restore, back navigation): the section must show its final state, not stay hidden. Pinned in Task 4.
2. **Crossing the 1280px breakpoint** (rotate a tablet, resize a window) before or after the animation: no hidden items left behind, no replay. Pinned in Task 4.
3. **Long or wrapped titles** ("PERSONALISE LEARNING" at 1280 and at 320 wide): text must not overflow its card or the viewport. Pinned in Task 2.
4. **Reduced motion and no JavaScript**: fully visible final state, line drawn, no orb or sparks. Pinned in Task 4 and Task 2 (server HTML).
5. **Images slower than the animation**: a hidden-then-revealed illustration must not pop in as an empty frame. Pinned in Task 5, Step 3 (throttled-network visual check; the fix is `loading="eager"` on the five images).

---

## Execution protocol (subagent-driven, parallel-safe)

This section is for the orchestrating session. Subagents are told only their own task plus the rules below.

### Shared environment (the part that makes parallel work safe)

- **One dev server, already running, owned by the orchestrator/user:** `next dev` is listening on **port 3000** for this project (pid seen at plan time). Next 16 holds a lockfile, so a second `next dev` in this directory fails. **No subagent starts, stops or restarts a dev server.** Everyone runs Playwright against it: `PORT=3000 npx playwright test <file>`. Playwright's `reuseExistingServer` then skips the build.
- **No `npm run build`, no `npm run e2e`, no `npm run start`** in any implementation task. Those belong only to the final review agent (Task 6), which uses port 3100 and `.next` (the dev server uses `.next/dev`; Next 16 separates them).
- **Hot reload noise:** while another agent edits files, the dev server may show a transient compile error. If a test fails with a compile or hydration error that mentions a file you do not own, wait 20 seconds and rerun once before investigating.
- **No git writes.** Read-only git (`git status`, `git diff`) is fine.

### File ownership (no two concurrent agents own the same file)

| Task | Agent owns (may edit) | May read, must not edit |
|---|---|---|
| 1 Data | `components/pages/home/journey/steps.ts`, `tests/unit/journey.test.ts` | everything else |
| 2 Layout | `components/pages/home/sections/JourneyRail.tsx`, `components/pages/home/sections/JourneyRailMotion.tsx` (pass-through stub only), `components/pages/home/HomePage.tsx`, `app/globals.css` (append the layout block only), `tests/e2e/journey-rail.spec.ts` (create) | Task 1 files |
| 3 Existing suite | `tests/e2e/helpers.ts`, `tests/e2e/home.spec.ts`, other existing `tests/e2e/*.spec.ts` except `journey-rail.spec.ts`, `notes/home.md` | all source, `journey-rail.spec.ts` |
| 4 Motion | `components/pages/home/sections/JourneyRailMotion.tsx`, `app/globals.css` (append the hover block only), `tests/e2e/journey-rail.spec.ts` (append the motion tests only) | all other files |
| 5 Polish | `tools/record-journey.mjs` (create), `MOTION` object in `JourneyRailMotion.tsx`, `loading="eager"` in `JourneyRail.tsx`, CSS values inside the Task 2 `.jr-*` block | everything else |
| 6 Review | nothing (read-only review; runs commands, writes a report in its final message) | everything |

### Phases

1. **Phase 1 (sequential):** Task 1, then Task 2. Task 2 imports Task 1's module, so they do not overlap.
2. **Phase 2 (parallel, exactly two agents):** Task 3 and Task 4 together. Their file sets are disjoint (table above). `globals.css` is touched only by Task 4 in this phase.
3. **Phase 3 (sequential):** Task 5, after both Phase 2 agents have reported. Never during Phase 2.
4. **Phase 4:** Task 6, a fresh review agent, after Task 5.

The orchestrator reviews each agent's report and the files it owns before starting the next phase. If an agent reports it touched a file it does not own, the orchestrator stops and reconciles before continuing.

---

## Files

| File | Action | Responsibility |
|---|---|---|
| `components/pages/home/journey/steps.ts` | Create | The five steps (title, body, image, alt, colours), eyebrow, heading, spark colours |
| `components/pages/home/sections/JourneyRail.tsx` | Create | Server component: heading plus the single ordered list |
| `components/pages/home/sections/JourneyRailMotion.tsx` | Create | Client component: the timeline and ScrollTrigger |
| `components/pages/home/HomePage.tsx` | Modify | Render `<JourneyRail />` directly after `<Section1 />` |
| `app/globals.css` | Modify | `.jr-*` layout, geometry, hover and reduced-motion rules (appended blocks) |
| `tests/unit/journey.test.ts` | Create | Data parity with `content.ts` |
| `tests/e2e/journey-rail.spec.ts` | Create | Layout, size, motion and robustness tests (all against `/`) |
| `tests/e2e/helpers.ts`, `tests/e2e/home.spec.ts` | Modify | Allow one extra home section in the structure check |
| `tools/record-journey.mjs` | Create | Records videos and frame stills for visual QA |
| `notes/home.md` | Modify | A short "Growth path: two versions" section |

---

### Task 1: Data module

**Files:**
- Create: `components/pages/home/journey/steps.ts`
- Test: `tests/unit/journey.test.ts`

**Interfaces:**
- Produces: `JOURNEY_STEPS: readonly JourneyStep[]` where `JourneyStep = { id: string; title: string; body: string; src: string; alt: string; bg: string; border: string }`; `JOURNEY_EYEBROW: string`; `JOURNEY_HEADING: string`; `JOURNEY_SPARK_COLORS: readonly string[]` (length 10).

- [ ] **Step 1: Write the failing test**

Create `tests/unit/journey.test.ts`:

```ts
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { sections } from '@/components/pages/home/content';
import {
  JOURNEY_EYEBROW,
  JOURNEY_HEADING,
  JOURNEY_SPARK_COLORS,
  JOURNEY_STEPS,
} from '@/components/pages/home/journey/steps';

const growth = sections.find((s) =>
  (s.h2 as readonly string[]).includes('One shared path, from first questions to thriving'),
)!;
const p = growth.p as readonly string[];

describe('journey steps', () => {
  it('match the home copy exactly, in order', () => {
    expect(JOURNEY_EYEBROW).toBe(p[0]);
    expect(JOURNEY_HEADING).toBe(growth.h2[0]);
    expect(JOURNEY_STEPS.map((s) => s.title)).toEqual([1, 3, 5, 7, 9].map((i) => p[i]));
    expect(JOURNEY_STEPS.map((s) => s.body)).toEqual([2, 4, 6, 8, 10].map((i) => p[i]));
  });

  it('use the alt text of the five step images', () => {
    expect(JOURNEY_STEPS.map((s) => s.alt)).toEqual(growth.imgs.slice(1).map((i) => i.alt));
  });

  it('point at image files that exist', () => {
    for (const s of JOURNEY_STEPS) expect(existsSync(`public${s.src}`), s.src).toBe(true);
  });

  it('have unique ids and hex colours', () => {
    expect(new Set(JOURNEY_STEPS.map((s) => s.id)).size).toBe(5);
    for (const s of JOURNEY_STEPS) {
      expect(s.bg).toMatch(/^#[0-9a-f]{6}$/i);
      expect(s.border).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('has ten spark colours', () => {
    expect(JOURNEY_SPARK_COLORS).toHaveLength(10);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/journey.test.ts`
Expected: FAIL (cannot resolve `@/components/pages/home/journey/steps`).

- [ ] **Step 3: Write the implementation**

Create `components/pages/home/journey/steps.ts`:

```ts
export type JourneyStep = {
  id: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  bg: string;
  border: string;
};

export const JOURNEY_EYEBROW = "A CHILD'S GROWTH PATH";
export const JOURNEY_HEADING = 'One shared path, from first questions to thriving';

export const JOURNEY_STEPS: readonly JourneyStep[] = [
  {
    id: 'meet',
    title: 'MEET THE CHILD',
    body: 'Observe and understand each child’s unique needs and way of learning',
    src: '/images/homepage/steps01.webp',
    alt: 'Observing and understanding a child’s unique needs',
    bg: '#e9f5f2',
    border: '#cfe4de',
  },
  {
    id: 'answer',
    title: 'ANSWER QUESTIONS',
    body: 'Turn observations into clearer insights about the child’s development',
    src: '/images/homepage/steps02.webp',
    alt: 'Turning observations into clearer developmental insights',
    bg: '#f4e4f5',
    border: '#e4c9e7',
  },
  {
    id: 'plan',
    title: 'ASSIGN PLAN',
    body: 'Build the right learning activities around each child’s developmental goals',
    src: '/images/homepage/steps03.webp',
    alt: 'Building learning activities around developmental goals',
    bg: '#fff7de',
    border: '#efe3be',
  },
  {
    id: 'personalise',
    title: 'PERSONALISE LEARNING',
    body: 'Adapt learning to each child’s pace, needs, and progress',
    src: '/images/homepage/steps04.webp',
    alt: 'Adapting learning to a child’s pace and progress',
    bg: '#fce8e2',
    border: '#f0cfc2',
  },
  {
    id: 'monitor',
    title: 'MONITOR GROWTH',
    body: 'Track meaningful progress and understand how skills are developing over time',
    src: '/images/homepage/steps05.webp',
    alt: 'Tracking meaningful progress over time',
    bg: '#e9fae5',
    border: '#cfe8c6',
  },
];

// The finale burst at the last node: the five card hues, alternating light and strong.
export const JOURNEY_SPARK_COLORS: readonly string[] = [
  '#7fc8bd', '#c79acc', '#f2c14e', '#f08a6a', '#7cc96b',
  '#b55aba', '#5fb3a6', '#f6d77a', '#f4a58b', '#a3dc94',
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/unit/journey.test.ts`
Expected: PASS.

**Checkpoint:** `npx vitest run tests/unit/journey.test.ts` is green.

---

### Task 2: Static layout (no motion) and placement on the home page

This task delivers the finished layout with no animation, directly below the current section, so the height win is already visible. Motion is Task 4. Until Task 3 lands, the existing "home matches the reference structure" test fails on the extra section; that is expected and is Task 3's job.

**Files:**
- Create: `components/pages/home/sections/JourneyRail.tsx`
- Create: `components/pages/home/sections/JourneyRailMotion.tsx` (pass-through, replaced in Task 4)
- Modify: `components/pages/home/HomePage.tsx`
- Modify: `app/globals.css` (append the layout block at the end)
- Test: `tests/e2e/journey-rail.spec.ts` (create)

**Interfaces:**
- Consumes: `JOURNEY_STEPS`, `JOURNEY_EYEBROW`, `JOURNEY_HEADING`, `JOURNEY_SPARK_COLORS` from Task 1.
- Produces (the DOM contract Task 4's motion code and the tests rely on):
  - `section[data-journey="rail"]` containing `ol.jr-list[role=list]` with five `li.jr-step[data-jr-step][data-pos="first|mid|last"]`.
  - Each `li` has, in DOM order: `.jr-rail` (contains `.jr-track > [data-jr-line].jr-line`, `.jr-path > [data-jr-orb].jr-orb`, `[data-jr-node].jr-node > [data-jr-ring].jr-ring + .jr-num`; the last step also contains ten `[data-jr-spark].jr-spark`), then `[data-jr-image].jr-image`, then `[data-jr-card].jr-card > [data-jr-stub].jr-stub + [data-jr-title].jr-title + [data-jr-body].jr-body`.
  - `JourneyRailMotion({ children, className }: { children: ReactNode; className?: string })`.

- [ ] **Step 1: Write the failing e2e tests (layout and size)**

Create `tests/e2e/journey-rail.spec.ts`:

```ts
import { expect, test, type Page } from '@playwright/test';
import { JOURNEY_STEPS } from '../../components/pages/home/journey/steps';
import { noConsentBanner, overflowAt } from './helpers';

const RAIL = 'section[data-journey="rail"]';
const inRail = (sel: string) => sel.split(', ').map((s) => `${RAIL} ${s}`).join(', ');

async function open(page: Page, width: number, height: number) {
  await noConsentBanner(page);
  await page.setViewportSize({ width, height });
  await page.goto('/', { waitUntil: 'networkidle' });
}

const railHeight = (page: Page) => page.locator(RAIL).evaluate((el) => el.getBoundingClientRect().height);
// The current section is the sibling directly above the rail on the home page.
const currentHeight = (page: Page) =>
  page.locator(RAIL).evaluate((el) => el.previousElementSibling!.getBoundingClientRect().height);

test.describe('journey rail: placement and size', () => {
  test('sits directly below the current growth path section', async ({ page }) => {
    await open(page, 1440, 900);
    expect(await page.locator(RAIL).count()).toBe(1);
    const currentCards = await page.locator(RAIL).evaluate((el) => el.previousElementSibling!.querySelectorAll('[data-journey-card]').length);
    expect(currentCards, 'the section above is the current growth path').toBe(5);
  });

  test('desktop 1440: the rail section is short', async ({ page }) => {
    await open(page, 1440, 900);
    const rail = await railHeight(page);
    expect(rail, 'rail section height').toBeLessThanOrEqual(760);
    expect(rail / (await currentHeight(page)), 'rail as a share of the current section').toBeLessThan(0.4);
  });

  test('desktop 1440: all five steps are inside the viewport when the section sits under the header', async ({ page }) => {
    await open(page, 1440, 900);
    await page.locator(RAIL).evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80));
    const boxes = await page.locator(inRail('[data-jr-card]')).evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom };
      }),
    );
    expect(boxes).toHaveLength(5);
    for (const b of boxes) {
      expect(b.top).toBeGreaterThanOrEqual(0);
      expect(b.bottom).toBeLessThanOrEqual(900);
    }
  });

  test('mobile 390: the step list is compact', async ({ page }) => {
    await open(page, 390, 844);
    const list = await page.locator(`${RAIL} ol`).evaluate((el) => el.getBoundingClientRect().height);
    expect(list, 'rail list height').toBeLessThanOrEqual(720);
    expect(list / (await currentHeight(page))).toBeLessThan(0.4);
  });
});

test.describe('journey rail: layout', () => {
  for (const w of [320, 375, 768, 1023, 1279, 1280, 1440]) {
    test(`no horizontal overflow at ${w}px`, async ({ page }) => {
      await noConsentBanner(page);
      expect(await overflowAt(page, '/', w)).toBeLessThanOrEqual(0);
    });
  }

  for (const w of [320, 1280]) {
    test(`titles and bodies stay inside their step at ${w}px`, async ({ page }) => {
      await open(page, w, 900);
      const overflowing = await page.locator(inRail('[data-jr-title], [data-jr-body]')).evaluateAll((els) =>
        els.filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent),
      );
      expect(overflowing).toEqual([]);
    });
  }

  test('1280 shows five columns; 1279 shows the stacked list', async ({ page }) => {
    await open(page, 1280, 900);
    const tops = (p: Page) => p.locator(inRail('[data-jr-step]')).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    expect(new Set(await tops(page)).size, 'one row of columns').toBe(1);
    await page.setViewportSize({ width: 1279, height: 900 });
    expect(new Set(await tops(page)).size, 'five stacked rows').toBe(5);
  });

  test('desktop: step columns have equal width and nodes share one horizontal line', async ({ page }) => {
    await open(page, 1440, 900);
    const widths = await page.locator(inRail('[data-jr-step]')).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
    const centres = await page.locator(inRail('[data-jr-node]')).evaluateAll((els) => els.map((e) => {
      const r = e.getBoundingClientRect();
      return Math.round(r.top + r.height / 2);
    }));
    expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(1);
  });

  test('mobile: node badges share one vertical line', async ({ page }) => {
    await open(page, 390, 844);
    const centres = await page.locator(inRail('[data-jr-node]')).evaluateAll((els) => els.map((e) => {
      const r = e.getBoundingClientRect();
      return Math.round(r.left + r.width / 2);
    }));
    expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(1);
  });
});

test.describe('journey rail: content and semantics', () => {
  test('five steps, in order, with the original copy', async ({ page }) => {
    await open(page, 1440, 900);
    expect(await page.locator(`${RAIL} ol > li`).count()).toBe(5);
    expect(await page.locator(inRail('[data-jr-title]')).allTextContents()).toEqual(JOURNEY_STEPS.map((s) => s.title));
    expect(await page.locator(inRail('[data-jr-body]')).allTextContents()).toEqual(JOURNEY_STEPS.map((s) => s.body));
  });

  test('is an ordered list with one heading and five described images', async ({ page }) => {
    await open(page, 1440, 900);
    await expect(page.locator(`${RAIL} ol`)).toHaveAttribute('role', 'list');
    expect(await page.locator(`${RAIL} h2`).count()).toBe(1);
    const alts = await page.locator(inRail('[data-jr-image] img')).evaluateAll((els) => els.map((e) => e.getAttribute('alt')));
    expect(alts).toEqual(JOURNEY_STEPS.map((s) => s.alt));
  });

  test('the server HTML contains every title and body (no JavaScript needed)', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('data-journey="rail"');
    for (const s of JOURNEY_STEPS) {
      expect(html, s.title).toContain(s.title);
      expect(html, s.id).toContain(s.body.slice(0, 20));
    }
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `PORT=3000 npx playwright test tests/e2e/journey-rail.spec.ts`
Expected: FAIL (no `section[data-journey="rail"]` on the home page yet).

- [ ] **Step 3: Create the component**

Create `components/pages/home/sections/JourneyRail.tsx`:

```tsx
import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  JOURNEY_EYEBROW,
  JOURNEY_HEADING,
  JOURNEY_SPARK_COLORS,
  JOURNEY_STEPS,
} from '../journey/steps';
import { JourneyRailMotion } from './JourneyRailMotion';

const LAST = JOURNEY_STEPS.length - 1;

// The growth path, rebuilt: one ordered list, two layouts (CSS only, see the .jr-* block in
// globals.css): five equal columns from 1280px, a compact vertical list below. The data-jr-* hooks
// are the contract JourneyRailMotion animates; it never moves layout.
export function JourneyRail() {
  return (
    <section data-journey="rail" className="mx-auto max-w-[1440px] px-6 pt-14 pb-14 lg:px-24 lg:pt-24 lg:pb-16">
      <p className="font-heading text-[14px] font-bold leading-[normal] text-content-brand-secondary lg:text-[20px] lg:leading-[26px]">
        {JOURNEY_EYEBROW}
      </p>
      <h2 className="mt-3 font-heading text-[20px] font-bold leading-[30px] text-content-brand lg:text-[40px] lg:font-semibold lg:leading-[48px]">
        {JOURNEY_HEADING}
      </h2>
      <JourneyRailMotion className="mt-8 xl:mt-14">
        <ol role="list" className="jr-list">
          {JOURNEY_STEPS.map((step, i) => (
            <li
              key={step.id}
              data-jr-step
              data-pos={i === 0 ? 'first' : i === LAST ? 'last' : 'mid'}
              className="jr-step"
              style={{ '--jr-bg': step.bg, '--jr-border': step.border } as CSSProperties}
            >
              <div className="jr-rail" aria-hidden="true">
                <span className="jr-track">
                  <span data-jr-line className="jr-line" />
                </span>
                <span className="jr-path">
                  <span data-jr-orb className="jr-orb" />
                </span>
                <span data-jr-node className="jr-node">
                  <span data-jr-ring className="jr-ring" />
                  <span className="jr-num">{i + 1}</span>
                </span>
                {i === LAST &&
                  JOURNEY_SPARK_COLORS.map((color, k) => (
                    <span key={k} data-jr-spark className="jr-spark" style={{ background: color }} />
                  ))}
              </div>
              <div data-jr-image className="jr-image">
                <Image
                  src={step.src}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 1280px) 208px, 80px"
                  className="object-contain"
                />
              </div>
              <div data-jr-card className="jr-card">
                <span data-jr-stub className="jr-stub" aria-hidden="true" />
                <p data-jr-title className="jr-title">
                  {step.title}
                </p>
                <p data-jr-body className="jr-body">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </JourneyRailMotion>
    </section>
  );
}
```

Create `components/pages/home/sections/JourneyRailMotion.tsx` (real final signature; Task 4 replaces the body):

```tsx
'use client';

import type { ReactNode } from 'react';

// Task 2 ships the layout only. Task 4 adds the timeline inside this same component.
export function JourneyRailMotion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
```

- [ ] **Step 4: Place it on the home page**

Modify `components/pages/home/HomePage.tsx`: add `import { JourneyRail } from "./sections/JourneyRail";` after the `Section1` import, and render `<JourneyRail />` **immediately after** `<Section1 />` with nothing between. Update the comment to: `// Section1 animates itself with GSAP; JourneyRail (the rebuilt growth path, directly below it) animates itself too. Sections 2, 4, 5 and 6 animate their own groups; Reveal wraps only the CTA panels.`

- [ ] **Step 5: Append the layout CSS**

Append to the end of `app/globals.css`:

```css
/* ===== Journey rail (home growth path, rebuilt) =====
   One <ol>, two layouts. Below 1280px: a compact vertical list, columns [rail | illustration | text].
   From 1280px: five equal columns, illustration over a shared horizontal line over the card.
   Each step owns the stretch of line that passes through its own node, so the geometry never depends
   on image or text heights. JourneyRailMotion animates [data-jr-*] hooks only; it does not move layout. */
.jr-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
}
.jr-step {
  --jr-thumb: 80px;
  position: relative;
  display: grid;
  grid-template-columns: 40px var(--jr-thumb) minmax(0, 1fr);
  column-gap: 12px;
  align-items: stretch;
}
.jr-rail {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* The line a step owns: the whole row height, trimmed to the node centre on the first and last step. */
.jr-track,
.jr-path {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  translate: -50% 0;
  pointer-events: none;
}
.jr-track {
  background: #f0dff2;
  border-radius: 9999px;
}
.jr-path {
  z-index: 2;
}
.jr-step[data-pos="first"] .jr-track,
.jr-step[data-pos="first"] .jr-path {
  top: 50%;
}
.jr-step[data-pos="last"] .jr-track,
.jr-step[data-pos="last"] .jr-path {
  bottom: 50%;
}
.jr-line {
  position: absolute;
  inset: 0;
  background: #c79acc;
  border-radius: inherit;
  transform-origin: top center;
}
.jr-orb {
  position: absolute;
  left: 50%;
  top: 0;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 9999px;
  background: #b55aba;
  box-shadow: 0 0 0 3px #fff, 0 0 0 9px rgba(181, 90, 186, 0.22);
  opacity: 0;
}
.jr-node {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: #b55aba;
  color: #fff;
  font-family: var(--font-nunito), "Nunito Fallback", Arial, sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
}
.jr-ring {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 2px solid #c79acc;
  opacity: 0;
  pointer-events: none;
}
.jr-spark {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 3;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 9999px;
  opacity: 0;
  pointer-events: none;
}
.jr-image {
  position: relative;
  align-self: center;
  width: var(--jr-thumb);
  aspect-ratio: 1 / 1;
  margin: 8px 0;
  padding: 4px;
  border-radius: 16px;
  background: var(--jr-bg);
}
.jr-card {
  align-self: center;
  min-width: 0;
  padding: 12px 0;
}
.jr-title {
  font-family: var(--font-nunito), "Nunito Fallback", Arial, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: var(--color-brand-teal);
  overflow-wrap: anywhere;
}
.jr-body {
  margin-top: 4px;
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-default);
  overflow-wrap: anywhere;
}
.jr-stub {
  display: none;
}

@media (min-width: 1280px) {
  .jr-list {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    column-gap: 20px;
  }
  .jr-step {
    display: flex;
    flex-direction: column;
  }
  .jr-image {
    order: 1;
    width: 100%;
    max-width: 208px;
    margin: 0 auto;
    padding: 0;
    background: transparent;
    border-radius: 0;
  }
  .jr-rail {
    order: 2;
    height: 56px;
    margin-top: 8px;
  }
  .jr-card {
    order: 3;
    position: relative;
    flex: 1;
    margin-top: 16px;
    padding: 20px 18px;
    border: 4px solid var(--jr-border);
    border-radius: 20px;
    background: var(--jr-bg);
    align-self: stretch;
  }
  /* The line runs left to right through the node row, half a column gap past each column edge so
     neighbouring steps meet exactly. */
  .jr-track,
  .jr-path {
    top: 50%;
    bottom: auto;
    left: -10px;
    right: -10px;
    width: auto;
    height: 3px;
    translate: 0 -50%;
  }
  .jr-step[data-pos="first"] .jr-track,
  .jr-step[data-pos="first"] .jr-path {
    top: 50%;
    left: 50%;
  }
  .jr-step[data-pos="last"] .jr-track,
  .jr-step[data-pos="last"] .jr-path {
    bottom: auto;
    right: 50%;
  }
  .jr-line {
    transform-origin: left center;
  }
  .jr-orb {
    left: 0;
    top: 50%;
  }
  .jr-node {
    width: 56px;
    height: 56px;
    background: #fff;
    border: 3px solid #c79acc;
    color: #9a3fa0;
    font-size: 28px;
    box-shadow: 0 3px 8px 0 rgba(107, 64, 128, 0.16);
  }
  .jr-stub {
    display: block;
    position: absolute;
    left: 50%;
    top: -16px;
    height: 12px;
    margin-left: -1px;
    border-left: 2px dashed #9ca3af;
    transform-origin: top center;
  }
  .jr-title {
    font-size: 20px;
    line-height: 26px;
  }
  .jr-body {
    margin-top: 8px;
    font-size: 16px;
    line-height: 24px;
    color: var(--color-text-secondary);
  }
}

/* Under reduced motion there is no orb, no sparks and no hover motion: the line is simply drawn. */
@media (prefers-reduced-motion: reduce) {
  .jr-orb,
  .jr-spark {
    display: none;
  }
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `PORT=3000 npx playwright test tests/e2e/journey-rail.spec.ts`
Expected: PASS. If a height or overflow test fails, tune the numbers in the CSS block (thumb size, paddings). Do not loosen the thresholds to make a layout pass (spec targets: rail section <= 760px at 1440, list <= 720px at 390, rail < 40% of the current section).

- [ ] **Step 7: Look at it**

Open `http://localhost:3000/` at 1440 wide and at 390 wide and scroll to the new section under the current one. Confirm: five equal columns with one horizontal line through the nodes (desktop); a compact list with a vertical line through numbered badges (mobile); step colours match the section above. Fix anything visibly off.

**Checkpoint:** `npx vitest run tests/unit/journey.test.ts` and `PORT=3000 npx playwright test tests/e2e/journey-rail.spec.ts` are green. (`home.spec.ts` is expected to fail on the section count until Task 3.)

---

### Task 3: Existing suite accounts for the extra home section (runs in parallel with Task 4)

**Files (owned):**
- Modify: `tests/e2e/helpers.ts`
- Modify: `tests/e2e/home.spec.ts`
- Modify (only if a run proves it necessary): other existing `tests/e2e/*.spec.ts` except `journey-rail.spec.ts`
- Modify: `notes/home.md`

**Interfaces:**
- Consumes: the home page now renders one more top-level `<section>` than `reference/home/copy.json` has.
- Produces: `expectPageMatchesReference(page, route, opts?: { extraSections?: number })`, backward compatible (default 0).

- [ ] **Step 1: Confirm the failure**

Run: `PORT=3000 npx playwright test tests/e2e/home.spec.ts -g "reference structure"`
Expected: FAIL on `top-level section count` (one more than the reference).

- [ ] **Step 2: Add the allowance**

In `tests/e2e/helpers.ts` change the signature to `export async function expectPageMatchesReference(page: Page, route: string, opts: { extraSections?: number } = {})` and the count assertion to `expect(sectionCount, 'top-level section count').toBe(ref.length + (opts.extraSections ?? 0));`. Leave everything else unchanged.

In `tests/e2e/home.spec.ts` change the call to:

```ts
// The home page temporarily carries the growth path twice (the original, then the rebuilt rail section
// directly below it). Remove the allowance when one of the two is deleted.
await expectPageMatchesReference(page, "/", { extraSections: 1 });
```

- [ ] **Step 3: Run the neighbours**

Run: `PORT=3000 npx playwright test tests/e2e/home.spec.ts tests/e2e/motion-homepage.spec.ts tests/e2e/motion-pages.spec.ts tests/e2e/integration.spec.ts`
Expected: PASS. If a test fails because of the extra section (and not because of a compile error from another agent's in-progress edit; see the protocol), make the smallest change that accounts for the extra section, in the test file only, and list each change in your report. If a failure is a real regression in application code, do not fix it: report it.

- [ ] **Step 4: Add the note**

Append to `notes/home.md`:

```markdown

## Growth path: two versions (temporary)

Home shows the growth path twice. The original (`sections/Section1.tsx`, winding path, scroll-scrubbed) is unchanged. Directly below it,
`sections/JourneyRail.tsx` is the rebuilt version: five equal columns from 1280px, a compact list below, one-time entry animation in
`JourneyRailMotion.tsx`. To keep only one, delete the other's line in `HomePage.tsx`, then remove `extraSections: 1` from `home.spec.ts`.
`npm run verify` (visual diff against the original site) will report the extra section's height until one is removed; that is expected.
Spec: `docs/superpowers/specs/2026-10-13-journey-rail-design.md`.
```

**Checkpoint:** the four spec files in Step 3 are green.

---

### Task 4: The animation (runs in parallel with Task 3)

**Files (owned):**
- Modify (replace body): `components/pages/home/sections/JourneyRailMotion.tsx`
- Modify: `app/globals.css` (append the hover block at the end, after the Task 2 block)
- Modify: `tests/e2e/journey-rail.spec.ts` (append the motion tests; do not change the Task 2 tests)

**Interfaces:**
- Consumes: the DOM contract from Task 2 (`[data-jr-step]`, `.jr-track`, `[data-jr-line]`, `[data-jr-orb]`, `[data-jr-node]`, `[data-jr-ring]`, `[data-jr-spark]`, `[data-jr-image]`, `[data-jr-card]`, `[data-jr-stub]`, `[data-jr-title]`, `[data-jr-body]`).
- Produces: `JourneyRailMotion({ children, className })`, same signature as the Task 2 stub, so `JourneyRail` does not change.

Every number that shapes the feel sits in one `MOTION` object so Task 5 can tune it without touching logic.

- [ ] **Step 1: Write the failing tests**

Append to `tests/e2e/journey-rail.spec.ts` (the file already defines `RAIL`, `inRail` and `open` from Task 2):

```ts
const HOOKS = '[data-jr-image], [data-jr-card], [data-jr-node], [data-jr-title], [data-jr-body]';

async function bringIntoView(page: Page) {
  await page.locator(RAIL).evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90));
}

const opacities = (page: Page, selector: string) =>
  page.locator(inRail(selector)).evaluateAll((els) => els.map((e) => parseFloat(getComputedStyle(e).opacity)));

async function expectFinalState(page: Page) {
  const notShown = await page.locator(inRail(HOOKS)).evaluateAll((els) =>
    els.filter((e) => getComputedStyle(e).opacity !== '1').length,
  );
  expect(notShown, 'elements not fully visible').toBe(0);
  const unfilled = await page.locator(inRail('[data-jr-line]')).evaluateAll((els) =>
    els.filter((e) => { const t = getComputedStyle(e).transform; return t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)'; }).length,
  );
  expect(unfilled, 'lines not fully drawn').toBe(0);
  const orbs = await opacities(page, '[data-jr-orb]');
  expect(Math.max(...orbs), 'orb gone').toBe(0);
}

test.describe('journey rail: motion', () => {
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    test(`plays once and ends in the full final state at ${w}px`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await open(page, w, h);
      await bringIntoView(page);
      await page.waitForTimeout(4500);
      await expectFinalState(page);
      expect(errors).toEqual([]);
    });
  }

  test('starts hidden, then reveals step by step, first step first', async ({ page }) => {
    await open(page, 1440, 900);
    await bringIntoView(page);
    await page.waitForTimeout(250);
    const early = await opacities(page, '[data-jr-image]');
    expect(Math.min(...early), 'something is still to reveal at 250ms').toBeLessThan(1);
    expect(early[0], 'first step leads').toBeGreaterThanOrEqual(early[4]);
    // Sample the wave: step i must never be further along than step i-1.
    for (let n = 0; n < 6; n++) {
      const o = await opacities(page, '[data-jr-image]');
      for (let i = 1; i < o.length; i++) expect(o[i], `step ${i + 1} ahead of step ${i}`).toBeLessThanOrEqual(o[i - 1] + 0.05);
      await page.waitForTimeout(400);
    }
  });

  test('does not replay: scrolling away and back leaves it fully shown', async ({ page }) => {
    await open(page, 1440, 900);
    await bringIntoView(page);
    await page.waitForTimeout(4500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await bringIntoView(page);
    const o = await opacities(page, '[data-jr-image]');
    expect(Math.min(...o)).toBe(1);
  });

  test('arriving past the section (reload or anchor with restored scroll) still ends fully shown', async ({ page }) => {
    await open(page, 1440, 900);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(4500);
    await expectFinalState(page);
  });

  test('crossing the 1280px breakpoint before or after the animation never hides content', async ({ page }) => {
    await open(page, 1440, 900);
    await bringIntoView(page);
    await page.waitForTimeout(500);
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.waitForTimeout(4500);
    await expectFinalState(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(800);
    await expectFinalState(page);
  });

  test('reduced motion: final state at once, no orb, no sparks', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await noConsentBanner(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    await bringIntoView(page);
    await page.waitForTimeout(150);
    await expectFinalState(page);
    const hidden = await page.locator(inRail('[data-jr-orb], [data-jr-spark]')).evaluateAll((els) =>
      els.every((e) => getComputedStyle(e).display === 'none'),
    );
    expect(hidden).toBe(true);
    await ctx.close();
  });
});
```

- [ ] **Step 2: Run them to verify the right ones fail**

Run: `PORT=3000 npx playwright test tests/e2e/journey-rail.spec.ts -g "motion"`
Expected: FAIL on "starts hidden, then reveals step by step" (nothing animates yet, so nothing starts hidden). The "final state" and "reduced motion" tests pass already; they are regression guards for the change.

- [ ] **Step 3: Write the timeline**

Replace the whole contents of `components/pages/home/sections/JourneyRailMotion.tsx`:

```tsx
'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Every number that shapes the feel lives here, so tuning never touches the logic below.
const MOTION = {
  speed: 720, // px per second the orb travels along the line
  minSegment: 0.3, // seconds: shortest stretch of line, so short mobile rows still read as travel
  image: { duration: 0.9, ease: 'back.out(1.5)', scale: 0.84, tilt: 5, blur: 8, lead: 0.05 },
  node: { duration: 0.5, ease: 'back.out(2.6)' },
  ring: { duration: 0.7, to: 1.9, from: 0.55, delay: 0.1 },
  card: { duration: 0.7, delay: 0.1, blur: 6, riseX: 34, riseY: 18 },
  copy: { duration: 0.5, titleDelay: 0.25, bodyDelay: 0.35, rise: 10 },
  stub: { duration: 0.3, delay: 0.2 },
  spark: { duration: 0.9, radius: 52, jitter: 14, delay: 0.25 },
  triggerStart: 'top 78%',
} as const;

type Axis = 'x' | 'y';

// Builds the whole entry as one paused timeline. Called only when motion is allowed. The axis is
// 'x' at >= 1280px (five columns, line runs left to right) and 'y' below (list, line runs down).
function build(root: HTMLElement, axis: Axis) {
  const horizontal = axis === 'x';
  const steps = gsap.utils.toArray<HTMLElement>('[data-jr-step]', root);
  const last = steps.length - 1;
  const one = (el: HTMLElement, sel: string) => el.querySelector<HTMLElement>(sel)!;

  // Hidden start states. The CSS default is "final", so reduced motion and no JavaScript need no code.
  steps.forEach((step, i) => {
    const tilt = (i % 2 === 0 ? -1 : 1) * MOTION.image.tilt;
    gsap.set(one(step, '[data-jr-line]'), horizontal ? { scaleX: 0 } : { scaleY: 0 });
    gsap.set(one(step, '[data-jr-orb]'), { autoAlpha: 0, x: 0, y: 0 });
    gsap.set(one(step, '[data-jr-node]'), { scale: 0, opacity: 0 });
    gsap.set(one(step, '[data-jr-image]'), {
      opacity: 0,
      scale: MOTION.image.scale,
      rotate: tilt,
      filter: `blur(${MOTION.image.blur}px)`,
      ...(horizontal ? { y: 30 } : { x: -14, y: 8 }),
    });
    gsap.set(one(step, '[data-jr-card]'), {
      opacity: 0,
      filter: `blur(${MOTION.card.blur}px)`,
      ...(horizontal ? { y: MOTION.card.riseX } : { x: MOTION.card.riseY }),
    });
    gsap.set([one(step, '[data-jr-title]'), one(step, '[data-jr-body]')], { opacity: 0, y: MOTION.copy.rise });
    gsap.set(one(step, '[data-jr-stub]'), { scaleY: 0 });
  });

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  let cursor = 0;
  let arrivedLast = 0;

  steps.forEach((step, i) => {
    const track = one(step, '.jr-track');
    const length = horizontal ? track.offsetWidth : track.offsetHeight;
    const dur = Math.max(MOTION.minSegment, length / MOTION.speed);
    const start = cursor;
    cursor += dur;
    // The first step's line starts at its node, the last step's line ends at its node, the others
    // pass through it halfway.
    const arrive = i === 0 ? start : i === last ? start + dur : start + dur / 2;
    if (i === last) arrivedLast = arrive;

    const line = one(step, '[data-jr-line]');
    const orb = one(step, '[data-jr-orb]');
    const node = one(step, '[data-jr-node]');
    const ring = one(step, '[data-jr-ring]');
    const image = one(step, '[data-jr-image]');
    const card = one(step, '[data-jr-card]');

    // The line and the orb travel together, linear, so the orb always sits at the head of the line.
    tl.to(line, { [horizontal ? 'scaleX' : 'scaleY']: 1, duration: dur, ease: 'none' }, start);
    tl.set(orb, { autoAlpha: 1 }, start);
    tl.to(
      orb,
      { [horizontal ? 'x' : 'y']: () => (horizontal ? track.offsetWidth : track.offsetHeight), duration: dur, ease: 'none' },
      start,
    );
    if (i !== last) tl.set(orb, { autoAlpha: 0 }, start + dur);

    tl.to(
      image,
      { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)', clearProps: 'filter', duration: MOTION.image.duration, ease: MOTION.image.ease },
      Math.max(0, arrive - MOTION.image.lead),
    );
    tl.to(node, { scale: 1, opacity: 1, duration: MOTION.node.duration, ease: MOTION.node.ease }, arrive);
    tl.fromTo(
      ring,
      { scale: 1, opacity: MOTION.ring.from },
      { scale: MOTION.ring.to, opacity: 0, duration: MOTION.ring.duration, ease: 'power2.out', immediateRender: false },
      arrive + MOTION.ring.delay,
    );
    tl.to(card, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', clearProps: 'filter', duration: MOTION.card.duration }, arrive + MOTION.card.delay);
    tl.to(one(step, '[data-jr-title]'), { opacity: 1, y: 0, duration: MOTION.copy.duration }, arrive + MOTION.copy.titleDelay);
    tl.to(one(step, '[data-jr-body]'), { opacity: 1, y: 0, duration: MOTION.copy.duration }, arrive + MOTION.copy.bodyDelay);
    tl.to(one(step, '[data-jr-stub]'), { scaleY: 1, duration: MOTION.stub.duration, ease: 'power2.out' }, arrive + MOTION.stub.delay);
  });

  // Finale: ten sparks burst from the last node ("thriving"), after its own pop has landed.
  const sparks = gsap.utils.toArray<HTMLElement>('[data-jr-spark]', root);
  sparks.forEach((spark, k) => {
    const angle = (k / sparks.length) * Math.PI * 2 - Math.PI / 2;
    const r = MOTION.spark.radius + (k % 2) * MOTION.spark.jitter;
    tl.fromTo(
      spark,
      { x: 0, y: 0, scale: 0.4, autoAlpha: 1 },
      { x: Math.cos(angle) * r, y: Math.sin(angle) * r, scale: 1, autoAlpha: 0, duration: MOTION.spark.duration, ease: 'power2.out', immediateRender: false },
      arrivedLast + MOTION.spark.delay,
    );
  });

  return tl;
}

// Plays the growth path entry once, from a plain ScrollTrigger (never scrubbed, never pinned): the
// reader keeps full control of the scroll. Motion is built only when the visitor allows it, so the
// server HTML and reduced-motion view are simply the final state. A breakpoint change before the
// entry has played rebuilds it on the right axis; after it has played nothing is rebuilt.
export function JourneyRailMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ rail: '(min-width: 1280px)', allowed: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
        const { rail, allowed } = ctx.conditions as { rail: boolean; allowed: boolean };
        const root = ref.current;
        if (!allowed || !root || played.current) return;

        const tl = build(root, rail ? 'x' : 'y');
        const play = () => {
          if (played.current) return;
          played.current = true;
          tl.play();
        };
        const st = ScrollTrigger.create({
          trigger: root,
          start: MOTION.triggerStart,
          end: 'bottom top',
          onEnter: play,
          // Arriving past the section (anchor, reload with restored scroll): play straight away.
          onRefresh: (self) => {
            if (self.progress > 0) play();
          },
        });
        return () => {
          st.kill();
          if (!played.current) tl.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Append the hover and ring-pulse CSS**

Append to `app/globals.css` (after the Task 2 block):

```css
/* Journey rail hover (fine pointer, motion allowed). The illustration wiggles and the node ring pulses
   once. No lift or shadow: these cards are not links, and lift implies clickable. The individual
   transform properties (scale, rotate) stack with the transform GSAP sets during the entry. */
@keyframes jr-ring-pulse {
  from { transform: scale(1); opacity: 0.5; }
  to { transform: scale(1.7); opacity: 0; }
}
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .jr-image {
    transition: scale 350ms cubic-bezier(0.34, 1.56, 0.64, 1), rotate 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .jr-step:hover .jr-image {
    scale: 1.06;
    rotate: 2deg;
  }
  .jr-step:hover .jr-ring {
    animation: jr-ring-pulse 700ms var(--ease-out);
  }
}
```

- [ ] **Step 5: Run the whole journey file**

Run: `PORT=3000 npx playwright test tests/e2e/journey-rail.spec.ts`
Expected: PASS. If "starts hidden, then reveals step by step" is flaky on the monotonic-wave assertion (step i ahead of step i-1 by more than the 0.05 tolerance), the cause is a real ordering bug in the timeline offsets, not test noise: fix the timeline, not the tolerance.

**Checkpoint:** `tests/e2e/journey-rail.spec.ts` is green. (Do not run the other specs here; Task 3 owns them.)

---

### Task 5: Make it crazy good: motion review and polish (after Tasks 3 and 4 have both reported)

A deliberate craft pass: look at it, tune it, lock the result. It has a hard stop so it cannot drift.

**Files (owned):**
- Create: `tools/record-journey.mjs`
- Modify: the `MOTION` object in `components/pages/home/sections/JourneyRailMotion.tsx` (logic only if a frame reveals a real bug)
- Modify: `loading="eager"` on the `<Image>` in `components/pages/home/sections/JourneyRail.tsx` (only if Step 3 finds the empty-frame pop)
- Modify: CSS values inside the Task 2 `.jr-*` block (only if a frame shows a layout flaw)

- [ ] **Step 1: Write the recorder**

Create `tools/record-journey.mjs`:

```js
// Records the rebuilt growth path's entry animation for review: a .webm per viewport plus stills at
// fixed moments. Each viewport loads the home page fresh, so the animation always plays from the start.
// Usage: BASE=http://localhost:3000 node tools/record-journey.mjs   (output: test-results/journey/)
import { chromium } from '@playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const OUT = process.env.OUT ?? 'test-results/journey';
const SIZES = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];
const FRAMES_MS = [250, 700, 1200, 1800, 2400, 3200, 4200];

const browser = await chromium.launch();
for (const s of SIZES) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    recordVideo: { dir: `${OUT}/${s.name}`, size: { width: s.width, height: s.height } },
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem('cb-cookie-consent', 'rejected'));
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const t0 = Date.now();
  await page.locator('section[data-journey="rail"]').evaluate((el) => {
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90);
  });
  for (const ms of FRAMES_MS) {
    const wait = ms - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await page.screenshot({ path: `${OUT}/${s.name}/frame-${String(ms).padStart(4, '0')}.png` });
  }
  await ctx.close(); // flushes the video
}
await browser.close();
console.log(`Wrote ${OUT}/<viewport>/*.png and *.webm`);
```

- [ ] **Step 2: Record and review every frame**

Run: `BASE=http://localhost:3000 node tools/record-journey.mjs`
Read the PNGs in `test-results/journey/desktop-1440/` in order (and the other viewports). Check, and write down any failure:

1. 250ms: line has begun, first illustration is fading in, first node popped; steps 2-5 invisible (no flash of final content).
2. 700-1200ms: a clear travelling wave; step N+1 starts before step N finishes settling; the orb sits at the head of the drawn line.
3. 1800-2400ms: steps 4 and 5 arriving; no two steps look like they are fighting.
4. 3200ms: sparks visible around node 5 and fading; everything else static.
5. 4200ms: clean final state; nothing blurred, tilted or offset.
6. Mobile 390: the wave runs top to bottom, the orb travels down the badge rail, thumbnails slide in from the left, text from the right, nothing overflows.
7. 768 and 1280-wide frames: list layout at 768, columns at 1280, same quality.

- [ ] **Step 3: Check the empty-frame pop (Review Focus 5)**

Look at each illustration as it appears in the 250-700ms frames at 1440: it must appear with its artwork, not as an empty square that fills in later. Throttle once to be sure: in `tools/record-journey.mjs` temporarily add `await page.route('**/*.webp', async (r) => { await new Promise((x) => setTimeout(x, 700)); r.continue(); })` after `newPage()`, rerun, then remove it. If any illustration pops in empty, add `loading="eager"` to the `<Image>` in `JourneyRail.tsx` (five small images, about 440KB total) and re-record.

- [ ] **Step 4: Tune, at most three passes**

Adjust only the `MOTION` object (and the `.jr-*` CSS values if a frame shows a layout flaw). Levers:

| If it looks | Change |
|---|---|
| Too slow or dragging | `speed` up (900), `image.duration` to 0.75 |
| Too frantic, steps blur together | `speed` down (560), `copy.bodyDelay` up |
| Illustration overshoots too much | `image.ease` to `back.out(1.2)` |
| Not enough personality | `image.tilt` up (7), `node.ease` to `back.out(3.2)` |
| Blur reads as a rendering glitch | `image.blur` and `card.blur` down (4 and 3) |

After each pass, rerun the recorder and `PORT=3000 npx playwright test tests/e2e/journey-rail.spec.ts`. Stop after three passes or when every point in Step 2 holds, whichever comes first. Total runtime must stay under about 3.2s at 1440.

**Checkpoint:** all seven review points hold and `journey-rail.spec.ts` is green.

---

### Task 6: Independent review and full verification (fresh review agent, read-only)

The reviewer edits no files. It verifies, then reports findings ranked by severity. The orchestrator decides what to fix.

- [ ] **Step 1: Static checks**

Run: `npm test && npm run lint && npx tsc --noEmit`
Expected: all pass. Report any failure with its output; a failure in a file this work did not touch is reported, not fixed.

- [ ] **Step 2: Confirm the current section was never edited**

Run: `grep -n "jr-\|JourneyRail\|data-jr" components/pages/home/sections/Section1.tsx components/pages/home/sections/JourneyPath.tsx components/pages/home/sections/JourneyTimeline.tsx` and expect no output. Also read `git diff -- components/pages/home/HomePage.tsx` and confirm the only change from this work is the import plus `<JourneyRail />` directly after `<Section1 />`.

- [ ] **Step 3: Production build, full suite**

The dev server on port 3000 keeps running (Next 16 builds into `.next`, dev uses `.next/dev`). Run: `npm run e2e` (Playwright builds and starts production on port 3100). Expected: the whole suite passes, including `home.spec.ts`, `motion-homepage.spec.ts`, `motion-pages.spec.ts`, `integration.spec.ts` and `journey-rail.spec.ts`. If a motion test is flaky only in production, rerun it three times and report the pass rate; do not edit it.

- [ ] **Step 4: Review against the spec and the five Review Focus lines**

Read the spec, then `JourneyRail.tsx`, `JourneyRailMotion.tsx`, `steps.ts` and the appended CSS. Check each, with evidence (a command output, a measured number, or a quoted line):

1. Spec success criteria: measured heights at 1440 and 390 versus the current section above it.
2. Each Review Focus line 1-5 has a passing test or a recorded check.
3. No scrub, no pin, no loop; `play()` cannot run twice; hover has no lift or shadow.
4. Copy, alt text and order identical to `content.ts`; one `<section data-journey="rail">`; semantic list; no duplicated headings for assistive tech.
5. Reduced motion and no-JS produce the full final state.
6. Anything in the code that would surprise a maintainer: dead code, hidden coupling between `JourneyRail` and `JourneyRailMotion`, magic numbers outside `MOTION`.

- [ ] **Step 5: Visual spot check**

Run `BASE=http://localhost:3000 node tools/record-journey.mjs` and read the 1440 and 390 frames at 700ms, 1800ms and 4200ms. Report anything visibly broken.

- [ ] **Step 6: Report**

The final message lists: commands run with pass/fail counts, measured numbers, findings ranked Critical / Important / Minor with file and line, and an explicit "verified" or "not verified" for each Review Focus line.

---

## Self-review

- **Spec coverage:** duplicate placed directly below the current section (Task 2 Step 4, placement test), current section untouched (Global Constraints, Task 6 Step 2), equal-column rail >= 1280px and compact list below (Task 2 CSS, tests), one DOM (Task 2 contract), play once and not scrubbed (Task 4 `played` guard, ScrollTrigger without `scrub`), the five motion-language items (Task 4 timeline and CSS), reduced motion and no-JS (Task 2 CSS and server-HTML test, Task 4 test), size targets (Task 2 tests), copy parity (Task 1 test), no card lift (Task 4 CSS comment, Global Constraints), existing home structure test (Task 3). No gaps.
- **Placeholder scan:** no TBD, "handle edge cases" or "similar to" in the steps. The Task 2 `JourneyRailMotion` stub is real, complete code with the final signature, replaced in Task 4.
- **Name consistency:** `JOURNEY_STEPS`, `JOURNEY_SPARK_COLORS`, `JourneyRailMotion({ children, className })`, `RAIL`, `inRail`, `open`, `bringIntoView`, `opacities`, `expectFinalState`, and every `data-jr-*` hook and `.jr-*` class are spelled the same wherever they appear. `[data-jr-line]` and `.jr-track` are both used by `build()` and both exist in the Task 2 markup.
- **Parallel safety:** Task 3 and Task 4 share no file (Task 3: `helpers.ts`, `home.spec.ts`, `notes/home.md`, other existing specs; Task 4: `JourneyRailMotion.tsx`, `globals.css`, `journey-rail.spec.ts`). Task 5 starts only after both report. No agent starts or stops a dev server; only Task 6 builds.
