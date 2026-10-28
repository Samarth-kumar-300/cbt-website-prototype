# Image Motion System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the CBT site's standalone images calm, scroll- and hover-only motion through one typed `MotionImage` component built on GSAP.

**Architecture:** `components/shared/image-motion.ts` holds the tuning numbers, media queries and pure helpers. `components/shared/MotionImage.tsx` is a drop-in replacement for the sized `div` around an image: a frame, a `layer` element (drift, parallax, tilt) and an `enter` element (rise, curtain). All GSAP work runs inside `gsap.matchMedia`, so reduced motion and touch devices get a plain, fully visible image. Images already inside a `Reveal` or `RevealStagger` keep their CSS fade and only get CSS hover.

**Tech Stack:** Next.js 16 (App Router), React 19, GSAP 3.15 with `@gsap/react` and ScrollTrigger, Tailwind 4, Vitest (jsdom), Playwright.

**Spec:** `cbt-site/docs/superpowers/specs/2026-10-14-image-motion-design.md`

## Global Constraints

- Motion responds only to scroll or hover. No idle or looping animation anywhere.
- One `enter` (`rise` | `curtain` | `none`) plus at most one `layer` (`drift` | `parallax` | `tilt` | `none`) per image.
- `prefers-reduced-motion: reduce` means the image is visible and untransformed. Touch devices get the enter only.
- Server HTML shows every image fully. Nothing is hidden until JS runs a GSAP tween.
- Animate only `transform`, `opacity` and `clip-path`. No layout shift: every frame already has reserved dimensions.
- `.svg` and `.webp` are transparent illustrations: never `curtain`, never in-frame `parallax`. `.png` and `.jpeg` are photos: `curtain`, `parallax` and hover-zoom are safe.
- Do not touch the journey rail, `TextReveal`, icon, `HorizontalScroller` or hero-settle animations.
- `git add` explicit paths only. The working tree has 100+ unrelated modified and untracked files that must not be swept into these commits.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Before touching anything `next/image` related, `AGENTS.md` says to read `node_modules/next/dist/docs/`. This plan wraps `next/image` and does not change its props, so no docs change is expected, but check if a build warning appears.

## Review Focus

- A frame whose `className` already sets a position (`absolute`, `sticky`) must not also gain `relative`, which would break the parents and schools layouts. Task 1 tests this.
- A `MotionImage` with `enter="none"` and `layer="none"` must register no GSAP media query at all. Task 2 tests this.
- React strict-mode double mount and route changes must not leave a hidden image behind: cleanup uses `mm.revert()`. Task 2 mounts, unmounts and re-mounts.
- JavaScript disabled: the server HTML must contain no inline `opacity` or `transform` on the wrapped image. Task 3 tests the HTML.
- Pointer leaves the tilt frame mid-gesture: rotation must ease back to 0, not stay tilted. Task 3 tests it in a real browser.

---

## File Structure

- Create `components/shared/image-motion.ts`: constants, `frameClass`, `normalizedOffset`, `tiltAngles`, `parallaxScale`. No React, no GSAP import.
- Create `components/shared/MotionImage.tsx`: the component and all GSAP calls.
- Create `tests/unit/image-motion.test.ts` and `tests/unit/motion-image.test.tsx`.
- Create `tests/e2e/image-motion.spec.ts`.
- Modify `app/globals.css`: `.img-hover-zoom` and `.avatar-hover`.
- Modify page sections (listed per task).
- Delete `components/shared/ScrollIllustration.tsx` once unused (Task 7).

---

### Task 1: Pure motion helpers

**Files:**
- Create: `components/shared/image-motion.ts`
- Test: `tests/unit/image-motion.test.ts`

**Interfaces:**
- Produces (used by Task 2):
  - `MOTION_OK`, `DESKTOP`, `POINTER_FINE`, `SCROLL_LAYER_QUERY`, `TILT_QUERY`: media query strings
  - `type Enter = 'rise' | 'curtain' | 'none'`, `type Layer = 'drift' | 'parallax' | 'tilt' | 'none'`
  - `RISE`, `CURTAIN`: tween configs
  - `DRIFT_PERCENT = 4`, `PARALLAX_PERCENT = 5`, `TILT_MAX_DEG = 3`
  - `frameClass(className: string, clips: boolean): string`
  - `normalizedOffset(pos: number, start: number, size: number): number` (returns -1 to 1)
  - `tiltAngles(nx: number, ny: number, max?: number): { rotationX: number; rotationY: number }`
  - `parallaxScale(percent: number): number`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/image-motion.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  frameClass,
  normalizedOffset,
  parallaxScale,
  tiltAngles,
  TILT_MAX_DEG,
  PARALLAX_PERCENT,
  SCROLL_LAYER_QUERY,
  TILT_QUERY,
} from '@/components/shared/image-motion';

describe('frameClass', () => {
  it('adds relative when the caller set no position', () => {
    expect(frameClass('h-[200px] w-full', false)).toBe('relative h-[200px] w-full');
  });

  it('does not add relative when the caller already positions the frame', () => {
    expect(frameClass('absolute w-1/2', false)).toBe('absolute w-1/2');
    expect(frameClass('relative h-10 lg:sticky', false)).toBe('relative h-10 lg:sticky');
  });

  it('treats a prefixed position class as a position', () => {
    expect(frameClass('lg:sticky h-10', false)).toBe('lg:sticky h-10');
  });

  it('adds overflow-hidden only when the frame must clip', () => {
    expect(frameClass('h-10', true)).toBe('relative overflow-hidden h-10');
    expect(frameClass('h-10', false)).not.toContain('overflow-hidden');
  });

  it('copes with an empty className', () => {
    expect(frameClass('', false)).toBe('relative');
  });
});

describe('normalizedOffset', () => {
  it('maps the near edge to -1, the centre to 0 and the far edge to 1', () => {
    expect(normalizedOffset(100, 100, 200)).toBe(-1);
    expect(normalizedOffset(200, 100, 200)).toBe(0);
    expect(normalizedOffset(300, 100, 200)).toBe(1);
  });

  it('clamps a pointer outside the box', () => {
    expect(normalizedOffset(0, 100, 200)).toBe(-1);
    expect(normalizedOffset(999, 100, 200)).toBe(1);
  });

  it('returns 0 for a zero-size box instead of NaN', () => {
    expect(normalizedOffset(50, 50, 0)).toBe(0);
  });
});

describe('tiltAngles', () => {
  it('turns around Y with horizontal offset and around X (inverted) with vertical offset', () => {
    expect(tiltAngles(1, 0).rotationY).toBeCloseTo(TILT_MAX_DEG);
    expect(tiltAngles(0, 1).rotationX).toBeCloseTo(-TILT_MAX_DEG);
  });

  it('is flat at the centre', () => {
    const { rotationX, rotationY } = tiltAngles(0, 0);
    expect(rotationX).toBeCloseTo(0);
    expect(rotationY).toBeCloseTo(0);
  });

  it('never exceeds the maximum, even for out-of-range input', () => {
    expect(Math.abs(tiltAngles(5, -5).rotationY)).toBeLessThanOrEqual(TILT_MAX_DEG);
    expect(Math.abs(tiltAngles(5, -5).rotationX)).toBeLessThanOrEqual(TILT_MAX_DEG);
  });
});

describe('parallaxScale', () => {
  it('oversizes the image just enough to cover the travel on both sides', () => {
    expect(parallaxScale(PARALLAX_PERCENT)).toBeCloseTo(1.1);
    expect(parallaxScale(0)).toBe(1);
  });
});

describe('media queries', () => {
  it('limits scroll layers to desktop, fine pointer and motion-ok, and tilt to fine pointer and motion-ok', () => {
    expect(SCROLL_LAYER_QUERY).toContain('prefers-reduced-motion: no-preference');
    expect(SCROLL_LAYER_QUERY).toContain('min-width: 1024px');
    expect(SCROLL_LAYER_QUERY).toContain('hover: hover');
    expect(TILT_QUERY).toContain('pointer: fine');
    expect(TILT_QUERY).not.toContain('min-width');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/image-motion.test.ts`
Expected: FAIL, module `@/components/shared/image-motion` cannot be resolved.

- [ ] **Step 3: Write minimal implementation**

Create `components/shared/image-motion.ts`:

```ts
// Tuning numbers, media queries and pure helpers for MotionImage. No React and no GSAP here, so
// "how subtle is it" is a one-file change and the maths is unit-testable.

export type Enter = 'rise' | 'curtain' | 'none';
export type Layer = 'drift' | 'parallax' | 'tilt' | 'none';

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const DESKTOP = '(min-width: 1024px)';
export const POINTER_FINE = '(hover: hover) and (pointer: fine)';
// Scroll-linked layers need a mouse-class device at desktop width. Tilt needs only a fine pointer.
export const SCROLL_LAYER_QUERY = `${MOTION_OK} and ${DESKTOP} and ${POINTER_FINE}`;
export const TILT_QUERY = `${MOTION_OK} and ${POINTER_FINE}`;

// Transparent illustrations ease up and in. They never use a rectangular clip.
export const RISE = {
  from: { y: 24, opacity: 0, scale: 0.97 },
  to: { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
} as const;

// Photos open top to bottom while the image settles from a slight zoom.
export const CURTAIN = {
  frameFrom: { clipPath: 'inset(0% 0% 100% 0%)' },
  frameTo: { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.out' },
  innerFrom: { scale: 1.12 },
  innerTo: { scale: 1, duration: 1.1, ease: 'power3.out' },
} as const;

export const DRIFT_PERCENT = 4; // whole illustration shifts +-4% of its height across the scroll
export const PARALLAX_PERCENT = 5; // photo shifts +-5% inside its frame
export const TILT_MAX_DEG = 3;

const HAS_POSITION = /(^|\s)(\S+:)*(relative|absolute|fixed|sticky)(\s|$)/;

// The frame must be a positioned box for the layers inside it. Add `relative` only when the caller
// has not already positioned it (an `absolute` or `sticky` frame must keep that position).
export function frameClass(className: string, clips: boolean) {
  const parts: string[] = [];
  if (!HAS_POSITION.test(className)) parts.push('relative');
  if (clips) parts.push('overflow-hidden');
  if (className) parts.push(className);
  return parts.join(' ');
}

// Pointer position inside a box as -1 (near edge) to 1 (far edge). A zero-size box gives 0.
export function normalizedOffset(pos: number, start: number, size: number) {
  if (size <= 0) return 0;
  return Math.max(-1, Math.min(1, ((pos - start) / size) * 2 - 1));
}

export function tiltAngles(nx: number, ny: number, max = TILT_MAX_DEG) {
  const cx = Math.max(-1, Math.min(1, nx));
  const cy = Math.max(-1, Math.min(1, ny));
  return { rotationX: -cy * max, rotationY: cx * max };
}

// Scale that leaves `percent` of the image spare on each side, so a +-percent shift never exposes an edge.
export function parallaxScale(percent: number) {
  return 1 + (2 * percent) / 100;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/image-motion.test.ts`
Expected: PASS, all tests green.

- [ ] **Step 5: Commit**

```bash
cd /Users/samarthkumar/CBT && git add cbt-site/components/shared/image-motion.ts cbt-site/tests/unit/image-motion.test.ts && git commit -m "feat(motion): add image motion config and pure helpers

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -- cbt-site/components/shared/image-motion.ts cbt-site/tests/unit/image-motion.test.ts
```

---

### Task 2: MotionImage component

**Files:**
- Create: `components/shared/MotionImage.tsx`
- Test: `tests/unit/motion-image.test.tsx`

**Interfaces:**
- Consumes (from Task 1): everything exported by `image-motion.ts`.
- Produces (used by Tasks 3 to 7): `MotionImage` with props `{ children: ReactNode; className?: string; style?: CSSProperties; enter?: Enter; layer?: Layer }`. Defaults: `enter = 'rise'`, `layer = 'none'`. Renders a frame `div` carrying `data-mi-enter` and `data-mi-layer`, containing two absolutely positioned parts: `data-mi-part="layer"` (outer) and `data-mi-part="enter"` (inner) wrapping `children`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/motion-image.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SCROLL_LAYER_QUERY, TILT_QUERY, MOTION_OK } from '@/components/shared/image-motion';

const mm = vi.hoisted(() => ({ queries: [] as string[], reverts: 0 }));

vi.mock('gsap', () => {
  const gsap = {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    fromTo: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    matchMedia: () => ({
      add: (query: string) => {
        mm.queries.push(query);
      },
      revert: () => {
        mm.reverts += 1;
      },
    }),
  };
  return { default: gsap };
});
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
vi.mock('@gsap/react', async () => {
  const { useEffect } = await import('react');
  return {
    useGSAP: (fn: () => (() => void) | void) =>
      useEffect(() => {
        const cleanup = fn();
        return typeof cleanup === 'function' ? cleanup : undefined;
      }, []),
  };
});

import { MotionImage } from '@/components/shared/MotionImage';

beforeEach(() => {
  mm.queries.length = 0;
  mm.reverts = 0;
});

describe('MotionImage', () => {
  it('renders its children visibly with no inline hiding styles', () => {
    render(
      <MotionImage className="h-10 w-10">
        <img alt="art" src="/x.webp" />
      </MotionImage>,
    );
    const img = screen.getByAltText('art');
    expect(img).toBeInTheDocument();
    const frame = img.closest('[data-mi-enter]') as HTMLElement;
    expect(frame.getAttribute('style')).toBeNull();
    expect(frame.querySelector('[data-mi-part="enter"]')?.getAttribute('style')).toBeNull();
    expect(frame.querySelector('[data-mi-part="layer"]')?.getAttribute('style')).toBeNull();
  });

  it('defaults to a rise enter and no layer', () => {
    render(<MotionImage><span>x</span></MotionImage>);
    const frame = screen.getByText('x').closest('[data-mi-enter]')!;
    expect(frame.getAttribute('data-mi-enter')).toBe('rise');
    expect(frame.getAttribute('data-mi-layer')).toBe('none');
  });

  it('registers only a motion-ok query for a plain rise', () => {
    render(<MotionImage><span>x</span></MotionImage>);
    expect(mm.queries).toEqual([MOTION_OK]);
  });

  it('registers no query at all for enter none and layer none', () => {
    render(<MotionImage enter="none"><span>x</span></MotionImage>);
    expect(mm.queries).toEqual([]);
  });

  it('gates drift and parallax on desktop, fine pointer and motion-ok', () => {
    render(<MotionImage layer="drift"><span>a</span></MotionImage>);
    expect(mm.queries).toContain(SCROLL_LAYER_QUERY);
    mm.queries.length = 0;
    render(<MotionImage layer="parallax" enter="none"><span>b</span></MotionImage>);
    expect(mm.queries).toEqual([SCROLL_LAYER_QUERY]);
  });

  it('gates tilt on a fine pointer, not on width', () => {
    render(<MotionImage enter="none" layer="tilt"><span>x</span></MotionImage>);
    expect(mm.queries).toEqual([TILT_QUERY]);
  });

  it('clips the frame for curtain and parallax, but not for rise', () => {
    const { rerender } = render(<MotionImage enter="curtain"><span>x</span></MotionImage>);
    expect(screen.getByText('x').closest('[data-mi-enter]')!.className).toContain('overflow-hidden');
    rerender(<MotionImage enter="none" layer="parallax"><span>x</span></MotionImage>);
    expect(screen.getByText('x').closest('[data-mi-enter]')!.className).toContain('overflow-hidden');
    rerender(<MotionImage enter="rise"><span>x</span></MotionImage>);
    expect(screen.getByText('x').closest('[data-mi-enter]')!.className).not.toContain('overflow-hidden');
  });

  it('keeps an absolute frame absolute and passes style through', () => {
    render(
      <MotionImage className="absolute" style={{ left: '10%', aspectRatio: '766 / 538' }}>
        <span>x</span>
      </MotionImage>,
    );
    const frame = screen.getByText('x').closest('[data-mi-enter]') as HTMLElement;
    expect(frame.className).not.toContain('relative');
    expect(frame.style.left).toBe('10%');
  });

  it('reverts its GSAP context on unmount and survives a re-mount', () => {
    const { unmount } = render(<MotionImage><span>x</span></MotionImage>);
    unmount();
    expect(mm.reverts).toBe(1);
    render(<MotionImage><span>y</span></MotionImage>);
    expect(screen.getByText('y')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/motion-image.test.tsx`
Expected: FAIL, `@/components/shared/MotionImage` cannot be resolved.

- [ ] **Step 3: Write minimal implementation**

Create `components/shared/MotionImage.tsx`:

```tsx
'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  CURTAIN,
  DRIFT_PERCENT,
  MOTION_OK,
  PARALLAX_PERCENT,
  RISE,
  SCROLL_LAYER_QUERY,
  TILT_QUERY,
  frameClass,
  normalizedOffset,
  parallaxScale,
  tiltAngles,
  type Enter,
  type Layer,
} from './image-motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  enter?: Enter;
  layer?: Layer;
};

// Drop-in for the sized div around an image. Server HTML shows the image fully; every tween runs
// inside gsap.matchMedia, so reduced motion (and touch, for the layers) leaves it plain and visible.
// `enter` plays once as the frame scrolls in; `layer` is the scroll- or pointer-linked motion after.
// Two inner parts keep the two from fighting over the same transform: the layer part moves, the
// enter part reveals.
export function MotionImage({ children, className = '', style, enter = 'rise', layer = 'none' }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const layerPart = useRef<HTMLDivElement>(null);
  const enterPart = useRef<HTMLDivElement>(null);
  const clips = enter === 'curtain' || layer === 'parallax';

  useGSAP(
    () => {
      const f = frame.current;
      const l = layerPart.current;
      const e = enterPart.current;
      if (!f || !l || !e) return;
      const mm = gsap.matchMedia();
      const once = { trigger: f, start: 'top 88%', once: true } as const;

      if (enter !== 'none') {
        mm.add(MOTION_OK, () => {
          if (enter === 'rise') {
            gsap.fromTo(e, RISE.from, { ...RISE.to, scrollTrigger: once });
          } else {
            gsap.fromTo(f, CURTAIN.frameFrom, { ...CURTAIN.frameTo, scrollTrigger: once });
            gsap.fromTo(e, CURTAIN.innerFrom, { ...CURTAIN.innerTo, scrollTrigger: once });
          }
        });
      }

      if (layer === 'drift' || layer === 'parallax') {
        mm.add(SCROLL_LAYER_QUERY, () => {
          const percent = layer === 'drift' ? DRIFT_PERCENT : PARALLAX_PERCENT;
          if (layer === 'parallax') gsap.set(l, { scale: parallaxScale(PARALLAX_PERCENT) });
          gsap.fromTo(
            l,
            { yPercent: -percent },
            {
              yPercent: percent,
              ease: 'none',
              scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      }

      if (layer === 'tilt') {
        mm.add(TILT_QUERY, () => {
          gsap.set(l, { transformPerspective: 900 });
          const rotateX = gsap.quickTo(l, 'rotationX', { duration: 0.6, ease: 'power3.out' });
          const rotateY = gsap.quickTo(l, 'rotationY', { duration: 0.6, ease: 'power3.out' });
          const move = (ev: PointerEvent) => {
            const r = f.getBoundingClientRect();
            const a = tiltAngles(normalizedOffset(ev.clientX, r.left, r.width), normalizedOffset(ev.clientY, r.top, r.height));
            rotateX(a.rotationX);
            rotateY(a.rotationY);
          };
          const leave = () => {
            rotateX(0);
            rotateY(0);
          };
          f.addEventListener('pointermove', move);
          f.addEventListener('pointerleave', leave);
          return () => {
            f.removeEventListener('pointermove', move);
            f.removeEventListener('pointerleave', leave);
          };
        });
      }

      return () => mm.revert();
    },
    { scope: frame, dependencies: [enter, layer] },
  );

  return (
    <div ref={frame} className={frameClass(className, clips)} style={style} data-mi-enter={enter} data-mi-layer={layer}>
      <div ref={layerPart} data-mi-part="layer" className="absolute inset-0">
        <div ref={enterPart} data-mi-part="enter" className="absolute inset-0">
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/motion-image.test.tsx tests/unit/image-motion.test.ts`
Expected: PASS. Also run `npx eslint components/shared/MotionImage.tsx components/shared/image-motion.ts` and expect no errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/samarthkumar/CBT && git add cbt-site/components/shared/MotionImage.tsx cbt-site/tests/unit/motion-image.test.tsx && git commit -m "feat(motion): add MotionImage with rise, curtain, drift, parallax and tilt

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -- cbt-site/components/shared/MotionImage.tsx cbt-site/tests/unit/motion-image.test.tsx
```

---

### Task 3: Therapy-centres migration and the e2e suite

**Files:**
- Create: `tests/e2e/image-motion.spec.ts`
- Modify: `components/pages/therapy-centres/sections/Section0.tsx` (hero, lines 113-122 and imports)
- Modify: `components/pages/therapy-centres/sections/Section1.tsx` (photo placeholder, lines 40-45 and imports)
- Modify: `components/pages/therapy-centres/sections/Section4.tsx` (dashboard, lines 22-31 and imports)

**Interfaces:**
- Consumes (from Task 2): `MotionImage`, with the `data-mi-enter`, `data-mi-layer` and `data-mi-part` attributes.
- Produces: the e2e spec file, which Tasks 4 to 6 extend with further tests.

- [ ] **Step 1: Write the failing e2e tests**

Create `tests/e2e/image-motion.spec.ts`:

```ts
import { test, expect, type Page } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

// Reads the 2D/3D transform of an element as a DOMMatrix.
async function matrixOf(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => {
    const t = getComputedStyle(el).transform;
    const m = new DOMMatrix(t === 'none' ? undefined : t);
    return { a: m.a, d: m.d, ty: m.m42, m13: m.m13, opacity: getComputedStyle(el).opacity };
  });
}

test.describe('motion allowed', () => {
  test('a rising illustration ends fully visible and untransformed after it scrolls in', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const frame = page.locator('[data-mi-enter="rise"]').first();
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const m = await matrixOf(page, '[data-mi-enter="rise"] [data-mi-part="enter"]');
    expect(m.opacity).toBe('1');
    expect(Math.abs(m.ty)).toBeLessThan(0.5);
    expect(m.a).toBeCloseTo(1, 2);
  });

  test('a curtain photo opens fully after it scrolls in', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const frame = page.locator('[data-mi-enter="curtain"]').first();
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    const clip = await frame.evaluate((el) => getComputedStyle(el).clipPath);
    expect(clip === 'none' || /^inset\(0(%|px)?( 0(%|px)?){0,3}\)$/.test(clip), `clip-path was ${clip}`).toBe(true);
  });

  test('the device hero tilts toward the pointer and settles flat when it leaves', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const frame = page.locator('[data-mi-layer="tilt"]').first();
    await frame.scrollIntoViewIfNeeded();
    const box = (await frame.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.92, box.y + box.height * 0.5, { steps: 6 });
    await page.waitForTimeout(900);
    const tilted = await matrixOf(page, '[data-mi-layer="tilt"] [data-mi-part="layer"]');
    expect(Math.abs(tilted.m13), 'rotated around Y while hovered').toBeGreaterThan(0.01);
    await page.mouse.move(5, 5, { steps: 4 });
    await page.waitForTimeout(900);
    const flat = await matrixOf(page, '[data-mi-layer="tilt"] [data-mi-part="layer"]');
    expect(Math.abs(flat.m13), 'back to flat after the pointer leaves').toBeLessThan(0.002);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('every image part is visible and untransformed with no scrolling at all', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const parts = await page.locator('[data-mi-part]').evaluateAll((els) =>
      els.map((el) => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform })),
    );
    expect(parts.length).toBeGreaterThan(0);
    for (const p of parts) {
      expect(p.opacity).toBe('1');
      expect(p.transform).toBe('none');
    }
  });

  test('the curtain photo is not clipped', async ({ page }) => {
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const clip = await page.locator('[data-mi-enter="curtain"]').first().evaluate((el) => getComputedStyle(el).clipPath);
    expect(clip).toBe('none');
  });
});

test('server HTML carries no hiding styles on wrapped images (works without JavaScript)', async ({ request }) => {
  const html = await (await request.get('/therapy-centres')).text();
  expect(html).toContain('data-mi-enter=');
  const parts = html.match(/<div[^>]*data-mi-part[^>]*>/g) ?? [];
  expect(parts.length).toBeGreaterThan(0);
  for (const tag of parts) expect(tag, tag).not.toMatch(/style="[^"]*(opacity|transform)/);
});

test('no horizontal overflow on a migrated page at phone and desktop widths', async ({ page }) => {
  for (const w of [375, 1440]) {
    expect(await overflowAt(page, '/therapy-centres', w), `overflow at ${w}px`).toBeLessThanOrEqual(0);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/samarthkumar/CBT/cbt-site && PORT=3100 npx playwright test tests/e2e/image-motion.spec.ts`
Expected: FAIL. The page has no `[data-mi-*]` elements yet (the "parts.length > 0" and locator waits fail). Note: this runs `npm run build` first and takes a few minutes.

- [ ] **Step 3: Migrate the three therapy-centres sections**

Section0 (hero). Add the import after the existing imports:

```tsx
import { MotionImage } from "@/components/shared/MotionImage";
```

Replace in `components/pages/therapy-centres/sections/Section0.tsx`:

```tsx
        <div className="hero-settle hero-delay-2 relative h-[257px] w-full max-w-[320px] shrink-0 lg:h-[470px] lg:max-w-[600px]">
          <Image
            src="/images/therapy-centres/hero-devices.webp"
            alt="Therapy centre dashboard shown across tablet and phone devices"
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
```

with:

```tsx
        <MotionImage enter="none" layer="tilt" className="hero-settle hero-delay-2 relative h-[257px] w-full max-w-[320px] shrink-0 lg:h-[470px] lg:max-w-[600px]">
          <Image
            src="/images/therapy-centres/hero-devices.webp"
            alt="Therapy centre dashboard shown across tablet and phone devices"
            fill
            sizes="100vw"
            className="object-contain"
          />
        </MotionImage>
```

Section1 (therapist photo placeholder). Add `import { MotionImage } from "@/components/shared/MotionImage";` after the existing imports, then replace:

```tsx
      <div className="relative h-[238px] w-full max-w-[300px] shrink-0 lg:h-[403px] lg:max-w-[508px]">
        <Placeholder
          label="A therapist working with a child"
          className="object-contain"
        />
      </div>
```

with:

```tsx
      <MotionImage enter="curtain" className="relative h-[238px] w-full max-w-[300px] shrink-0 lg:h-[403px] lg:max-w-[508px]">
        <Placeholder
          label="A therapist working with a child"
          className="object-contain"
        />
      </MotionImage>
```

Section4 (dashboard). Add the same import after the existing imports, then replace:

```tsx
          <div className="relative aspect-[340/242] w-full lg:aspect-[669/476]">
            <Image
              src="/images/therapy-centres/extending-development.webp"
              alt="CognitiveBotics dashboard"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
```

with:

```tsx
          <MotionImage enter="rise" className="relative aspect-[340/242] w-full lg:aspect-[669/476]">
            <Image
              src="/images/therapy-centres/extending-development.webp"
              alt="CognitiveBotics dashboard"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </MotionImage>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run && npx eslint app components lib && PORT=3100 npx playwright test tests/e2e/image-motion.spec.ts tests/e2e/therapy-centres.spec.ts`
Expected: all pass. If the tilt assertion is flaky on timing, lengthen the waits to 1200 ms; do not loosen the `m13` thresholds.

- [ ] **Step 5: Commit**

```bash
cd /Users/samarthkumar/CBT && git add cbt-site/tests/e2e/image-motion.spec.ts cbt-site/components/pages/therapy-centres/sections/Section0.tsx cbt-site/components/pages/therapy-centres/sections/Section1.tsx cbt-site/components/pages/therapy-centres/sections/Section4.tsx && git commit -m "feat(therapy-centres): add tilt, curtain and rise image motion

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -- cbt-site/tests/e2e/image-motion.spec.ts cbt-site/components/pages/therapy-centres/sections/Section0.tsx cbt-site/components/pages/therapy-centres/sections/Section1.tsx cbt-site/components/pages/therapy-centres/sections/Section4.tsx
```

---

### Task 4: Home, replace the growth image's ScrollIllustration

**Files:**
- Modify: `components/pages/home/sections/Section2.tsx` (lines 1-4 imports, 178-186 desktop, 195-203 mobile)
- Modify: `tests/e2e/image-motion.spec.ts` (append one test)

**Interfaces:**
- Consumes: `MotionImage` (Task 2).

- [ ] **Step 1: Write the failing test**

Append to `tests/e2e/image-motion.spec.ts`:

```ts
test('home: the growth illustration drifts with scroll on desktop and ends visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const frame = page.locator('[data-mi-layer="drift"]').first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const enter = await matrixOf(page, '[data-mi-layer="drift"] [data-mi-part="enter"]');
  expect(enter.opacity).toBe('1');
  const y1 = (await matrixOf(page, '[data-mi-layer="drift"] [data-mi-part="layer"]')).ty;
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(600);
  const y2 = (await matrixOf(page, '[data-mi-layer="drift"] [data-mi-part="layer"]')).ty;
  expect(y2, 'the layer moves as the page scrolls').not.toBeCloseTo(y1, 1);
});

test('home: the growth illustration gets no scroll-linked layer on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const frames = page.locator('[data-mi-enter="rise"][data-mi-layer="none"]');
  expect(await frames.count()).toBeGreaterThan(0);
  expect(await overflowAt(page, '/', 390)).toBeLessThanOrEqual(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/samarthkumar/CBT/cbt-site && PORT=3100 npx playwright test tests/e2e/image-motion.spec.ts -g "home:"`
Expected: FAIL (no `data-mi-layer="drift"` on `/`).

- [ ] **Step 3: Migrate**

In `components/pages/home/sections/Section2.tsx`, replace the line `import { ScrollIllustration } from "@/components/shared/ScrollIllustration";` with `import { MotionImage } from "@/components/shared/MotionImage";`.

Replace the desktop block:

```tsx
        <ScrollIllustration className="relative h-[620px] w-full max-w-[600px] shrink-0">
          <Image
            src="/images/homepage/growthlooksdiff.webp"
            alt="Growth_Looks_Diff"
            fill
            sizes="600px"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </ScrollIllustration>
```

with:

```tsx
        <MotionImage enter="rise" layer="drift" className="relative h-[620px] w-full max-w-[600px] shrink-0">
          <Image
            src="/images/homepage/growthlooksdiff.webp"
            alt="Growth_Looks_Diff"
            fill
            sizes="600px"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </MotionImage>
```

Replace the mobile block:

```tsx
        <div className="relative h-[280px] w-full max-w-[340px] shrink-0">
          <Image
            src="/images/homepage/growthlooksdiff.webp"
            alt="Growth_Looks_Diff"
            fill
            sizes="340px"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
```

with:

```tsx
        <MotionImage enter="rise" className="relative h-[280px] w-full max-w-[340px] shrink-0">
          <Image
            src="/images/homepage/growthlooksdiff.webp"
            alt="Growth_Looks_Diff"
            fill
            sizes="340px"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </MotionImage>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx eslint app components lib && PORT=3100 npx playwright test tests/e2e/image-motion.spec.ts tests/e2e/home.spec.ts tests/e2e/motion-homepage.spec.ts`
Expected: all pass. If `motion-homepage.spec.ts` asserts on the old `ScrollIllustration` slide or scale, update that assertion to the new behaviour (rise, then drift), and say so in the commit message.

- [ ] **Step 5: Commit**

```bash
cd /Users/samarthkumar/CBT && git add cbt-site/components/pages/home/sections/Section2.tsx cbt-site/tests/e2e/image-motion.spec.ts && git commit -m "feat(home): rise and drift on the growth illustration

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -- cbt-site/components/pages/home/sections/Section2.tsx cbt-site/tests/e2e/image-motion.spec.ts
```

---

### Task 5: CSS hover for card images and avatars

**Files:**
- Modify: `app/globals.css` (inside the existing `@media (prefers-reduced-motion: no-preference)` block that holds `.card-lift`, after `.social-lift:hover`)
- Modify: `components/pages/resources/sections/Section2.tsx` (line 21)
- Modify: `components/pages/about/sections/Section2.tsx` and `components/pages/about/sections/Section3.tsx` (avatar frames)
- Modify: `tests/e2e/image-motion.spec.ts` (append two tests)

**Interfaces:**
- Produces: CSS classes `.img-hover-zoom` (put on an `overflow-hidden` frame holding an `img` or the placeholder) and `.avatar-hover` (put on the circular frame).

- [ ] **Step 1: Write the failing tests**

Append to `tests/e2e/image-motion.spec.ts`:

```ts
test('resources: a card image zooms slightly on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/resources', { waitUntil: 'networkidle' });
  const frame = page.locator('.img-hover-zoom').first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await frame.hover();
  await page.waitForTimeout(700);
  const scale = await frame.locator('> *').first().evaluate((el) => new DOMMatrix(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform).a);
  expect(scale).toBeCloseTo(1.05, 2);
});

test.describe('reduced motion hover', () => {
  test.use({ reducedMotion: 'reduce' });
  test('about: an avatar does not scale on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/about', { waitUntil: 'networkidle' });
    const avatar = page.locator('.avatar-hover').first();
    await avatar.scrollIntoViewIfNeeded();
    await avatar.hover();
    await page.waitForTimeout(400);
    expect(await avatar.evaluate((el) => getComputedStyle(el).scale)).toMatch(/^(none|1)$/);
  });
});

test('about: an avatar grows slightly and gains a ring on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about', { waitUntil: 'networkidle' });
  const avatar = page.locator('.avatar-hover').first();
  await avatar.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await avatar.hover();
  await page.waitForTimeout(500);
  const s = await avatar.evaluate((el) => ({ scale: getComputedStyle(el).scale, shadow: getComputedStyle(el).boxShadow }));
  expect(parseFloat(s.scale)).toBeCloseTo(1.04, 2);
  expect(s.shadow).not.toBe('none');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/samarthkumar/CBT/cbt-site && PORT=3100 npx playwright test tests/e2e/image-motion.spec.ts -g "resources:|about:"`
Expected: FAIL (no `.img-hover-zoom` or `.avatar-hover` elements).

- [ ] **Step 3: Implement**

In `app/globals.css`, inside the `@media (prefers-reduced-motion: no-preference)` block, directly after the `.social-lift:hover, .social-lift:focus-visible { ... }` rule and before the block's closing brace, add:

```css
  .img-hover-zoom > * {
    transition: transform 500ms var(--ease-out);
  }
  .img-hover-zoom:hover > * {
    transform: scale(1.05);
  }
  /* Avatars keep the reveal fade from [data-motion-image] and add a small scale and ring. */
  .avatar-hover {
    transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out), scale 250ms var(--ease-out), box-shadow 250ms ease;
  }
  .avatar-hover:hover {
    scale: 1.04;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-teal) 25%, transparent);
  }
```

Resources, `components/pages/resources/sections/Section2.tsx`: change

```tsx
            <div data-motion-image className="relative aspect-[400/246] w-full shrink-0">
```

to

```tsx
            <div data-motion-image className="img-hover-zoom relative aspect-[400/246] w-full shrink-0 overflow-hidden">
```

About avatars (22 frames across `Section2.tsx` and `Section3.tsx`): every avatar frame starts with exactly `<div data-motion-image className="relative size-14 shrink-0 overflow-hidden rounded-full`. Add the class to all of them:

```bash
cd /Users/samarthkumar/CBT/cbt-site && sed -i '' 's|<div data-motion-image className="relative size-14 |<div data-motion-image className="avatar-hover relative size-14 |' components/pages/about/sections/Section2.tsx components/pages/about/sections/Section3.tsx && grep -c 'avatar-hover' components/pages/about/sections/Section2.tsx components/pages/about/sections/Section3.tsx
```

Expected output: counts equal to the earlier `data-motion-image` counts in each file (check with `grep -c 'data-motion-image' ...` first; do not change frames that are not avatars).

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/css-vars.test.ts && PORT=3100 npx playwright test tests/e2e/image-motion.spec.ts tests/e2e/about.spec.ts tests/e2e/resources.spec.ts`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
cd /Users/samarthkumar/CBT && git add cbt-site/app/globals.css cbt-site/components/pages/resources/sections/Section2.tsx cbt-site/components/pages/about/sections/Section2.tsx cbt-site/components/pages/about/sections/Section3.tsx cbt-site/tests/e2e/image-motion.spec.ts && git commit -m "feat(motion): hover zoom on resource images and a soft ring on avatars

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -- cbt-site/app/globals.css cbt-site/components/pages/resources/sections/Section2.tsx cbt-site/components/pages/about/sections/Section2.tsx cbt-site/components/pages/about/sections/Section3.tsx cbt-site/tests/e2e/image-motion.spec.ts
```

Note: `globals.css`, the about files and `resources/Section2.tsx` already carry unrelated uncommitted edits in the working tree. If `git diff` for these files shows changes beyond this task's lines, stage only this task's hunks with `git add -p` instead of whole files.

---

### Task 6: Parents and Schools, then remove ScrollIllustration

**Files:**
- Modify: `components/pages/parents/sections/Section5.tsx` (import line 1, desktop block lines 153-155)
- Modify: `components/pages/schools/sections/Section1.tsx` (lines 35-37 and imports)
- Modify: `components/pages/schools/sections/Section3.tsx` (lines 23-25 and imports)
- Modify: `components/pages/schools/sections/Section4.tsx` (import line 1, wrapper lines 115-133)
- Delete: `components/shared/ScrollIllustration.tsx`
- Modify: `tests/e2e/image-motion.spec.ts` (append tests)

**Interfaces:**
- Consumes: `MotionImage` (Task 2).

- [ ] **Step 1: Write the failing tests**

Append to `tests/e2e/image-motion.spec.ts`:

```ts
test('schools: the flower illustration rises in and the petal rotation still works', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/schools', { waitUntil: 'networkidle' });
  const frame = page.locator('[data-mi-enter="rise"]:has(img[src*="tailored-implementation"])').first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const m = await matrixOf(page, '[data-mi-enter="rise"]:has(img[src*="tailored-implementation"]) > [data-mi-part="layer"] > [data-mi-part="enter"]');
  expect(m.opacity).toBe('1');
  expect(Math.abs(m.ty)).toBeLessThan(0.5);
});

test('schools: the future photo placeholder uses a curtain and keeps its size', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/schools', { waitUntil: 'networkidle' });
  const frame = page.locator('[data-mi-enter="curtain"]').first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  const box = (await frame.boundingBox())!;
  expect(box.width).toBeGreaterThan(100);
  expect(box.height).toBeGreaterThan(100);
});

test('parents: the desktop illustration drifts and no page overflows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/parents', { waitUntil: 'networkidle' });
  expect(await page.locator('[data-mi-layer="drift"]').count()).toBeGreaterThan(0);
  for (const route of ['/parents', '/schools', '/']) {
    for (const w of [375, 1440]) {
      expect(await overflowAt(page, route, w), `${route} overflow at ${w}px`).toBeLessThanOrEqual(0);
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/samarthkumar/CBT/cbt-site && PORT=3100 npx playwright test tests/e2e/image-motion.spec.ts -g "schools:|parents:"`
Expected: FAIL (no `MotionImage` on those pages).

- [ ] **Step 3: Migrate**

Parents `Section5.tsx`: replace the import line `import { ScrollIllustration } from "@/components/shared/ScrollIllustration";` with `import { MotionImage } from "@/components/shared/MotionImage";`, then replace:

```tsx
          <ScrollIllustration className="relative hidden min-h-[400px] lg:block">
            <Placeholder label="Image" className="object-contain" />
          </ScrollIllustration>
```

with:

```tsx
          <MotionImage enter="rise" layer="drift" className="relative hidden min-h-[400px] lg:block">
            <Placeholder label="Image" className="object-contain" />
          </MotionImage>
```

Schools `Section1.tsx`: add `import { MotionImage } from "@/components/shared/MotionImage";` after the existing imports, then replace:

```tsx
      <div className="relative h-[260px] w-full shrink-0 lg:h-[451px] lg:max-w-[608px]">
        <Placeholder label="Image" className="object-contain" />
      </div>
```

with:

```tsx
      <MotionImage enter="rise" className="relative h-[260px] w-full shrink-0 lg:h-[451px] lg:max-w-[608px]">
        <Placeholder label="Image" className="object-contain" />
      </MotionImage>
```

Schools `Section3.tsx`: add the same import, then replace:

```tsx
        <div className="relative h-[200px] w-full max-w-[300px] shrink-0 lg:h-[372px] lg:min-w-0 lg:max-w-[558px] lg:shrink lg:basis-[558px]">
          <Placeholder label="Image" className="object-cover" />
        </div>
```

with:

```tsx
        <MotionImage enter="curtain" className="relative h-[200px] w-full max-w-[300px] shrink-0 lg:h-[372px] lg:min-w-0 lg:max-w-[558px] lg:shrink lg:basis-[558px]">
          <Placeholder label="Image" className="object-cover" />
        </MotionImage>
```

Schools `Section4.tsx`: replace the import `import { ScrollIllustration } from "@/components/shared/ScrollIllustration";` with `import { MotionImage } from "@/components/shared/MotionImage";`. Change the opening tag `<ScrollIllustration className="relative order-1 ...` to `<MotionImage enter="rise" className="relative order-1 ...` (keep the entire existing className string unchanged) and the closing `</ScrollIllustration>` to `</MotionImage>`. Leave the `ScrollStepRotate` and both `Image` children untouched.

Then confirm nothing else uses the old component and delete it:

```bash
cd /Users/samarthkumar/CBT/cbt-site && grep -rn "ScrollIllustration" app components lib tests && echo "STOP: still used" || git rm -q components/shared/ScrollIllustration.tsx
```

Expected: no grep matches, then the file is removed. If anything still references it, migrate that reference the same way before deleting.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run && npx eslint app components lib && PORT=3100 npx playwright test`
Expected: the full unit and e2e suites pass. If a pre-existing e2e test asserted on `ScrollIllustration` behaviour, update it to the new rise/drift behaviour and mention that in the commit message.

- [ ] **Step 5: Commit**

```bash
cd /Users/samarthkumar/CBT && git add cbt-site/components/pages/parents/sections/Section5.tsx cbt-site/components/pages/schools/sections/Section1.tsx cbt-site/components/pages/schools/sections/Section3.tsx cbt-site/components/pages/schools/sections/Section4.tsx cbt-site/tests/e2e/image-motion.spec.ts && git add -u cbt-site/components/shared/ScrollIllustration.tsx && git commit -m "feat(parents,schools): MotionImage on standalone images; remove ScrollIllustration

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -- cbt-site/components/pages/parents/sections/Section5.tsx cbt-site/components/pages/schools/sections/Section1.tsx cbt-site/components/pages/schools/sections/Section3.tsx cbt-site/components/pages/schools/sections/Section4.tsx cbt-site/tests/e2e/image-motion.spec.ts cbt-site/components/shared/ScrollIllustration.tsx
```

---

### Task 7: Whole-feature verification

**Files:** none changed unless a check fails.

- [ ] **Step 1: Run the full automated suite**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run && npx eslint app components lib && npm run build && PORT=3100 npx playwright test`
Expected: all green. Report the actual counts.

- [ ] **Step 2: Visual regression at rest**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npm run verify`
Expected: no new diffs versus the reference on the five pages touched (home, therapy-centres, parents, schools, about, resources). Animations only change entering and hover states, so resting pixels must match. If a diff appears, a frame lost its size or position: check `frameClass` output for that call site.

- [ ] **Step 3: Eyeball it in a real browser**

Run `npm run dev`, then in a desktop browser check by hand:
1. Therapy-centres: move the mouse across the device hero (tilts up to 3 degrees, eases flat on leave); the dashboard rises once on scroll.
2. Home: the growth illustration rises once, then drifts slowly while scrolling.
3. Schools: the flower rises and the petals still turn in 72-degree steps.
4. Resources: hover a card image (slight zoom); About: hover an avatar (small scale and ring).
5. DevTools, Rendering, "Emulate prefers-reduced-motion: reduce": reload each page. Nothing should move, fade or tilt.
6. DevTools device mode (phone): no tilt or drift, only the one-time rise.

- [ ] **Step 4: Final commit (only if Step 2 or 3 needed fixes)**

Commit any fix with explicit paths and a message describing what was wrong.

- [ ] **Step 5: Report**

State plainly what passed, anything skipped, and any follow-ups (for example: real photos will pick up `curtain` automatically once the placeholders become `.png` or `.jpeg` images).
