# Homepage Motion System Implementation Plan (v2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the CBT homepage and its shared chrome (header, footer, cookie banner) feel alive through one calm, consistent motion language, with a forward-only Journey that draws a coded path and carries an orchid marker.

**Architecture:** Two engines on one timing scale. CSS plus a small `RevealStagger` observer handles entries, cards, icons, images, buttons and nav. GSAP handles headings (`TextReveal`), the Journey (`DrawSVG`, `MotionPath`, `ScrollTrigger`), the Section 2 illustration and the CTA gradient shift. Everything respects reduced motion and is visible without JavaScript.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, GSAP 3.15 (`gsap`, `ScrollTrigger`, `SplitText`, `DrawSVGPlugin`, `MotionPathPlugin`, `@gsap/react`), Vitest with jsdom and Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-13-motion-system-design.md` (v2). Read it first. This plan replaces the earlier plan, which used a wrong inventory.

**Scope:** the homepage plus the shared header, footer and cookie banner. Other segment pages get their own plan after the homepage is reviewed.

## Global Constraints

- Entry 600ms, `cubic-bezier(0.16, 1, 0.3, 1)` (GSAP: `power2.out`). Hover 200ms, `ease`. Press 150ms.
- Entry distance 24px up. Hover lift 4px up. Arrow nudge 4px right. Press scale 0.98 (buttons), 0.95 (carousel controls).
- Stagger 80ms between siblings, at most 6 siblings staggered per group.
- Icon pop: scale 0.8 to 1, `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Cookie banner: slides up 24px and fades in after 600ms; slides down and fades out in 250ms on a choice.
- Each element plays its entry once. No looping or time-based idle motion.
- Calm: at most two or three things move on screen at once.
- `transform` is used for entry and `translate` or `scale` for hover and press, so they never conflict on one element.
- Under `prefers-reduced-motion: reduce`, every element shows its final state with no transition.
- Without JavaScript, every element is visible in the server HTML.
- Copy stays verbatim. No layout or information architecture change. Left-aligned text stays as it is.
- Working tree stays uncommitted. Replace every "commit" with a checkpoint.

## Review Focus

1. **No-JS and crawlers see hidden content.** Pending state may only be set after mount. Test: Task 2 (unit) and Task 11 (no-JS HTML check).
2. **Reduced motion shows the final state immediately, and the cookie banner does not linger.** With reduced motion, choosing a cookie option must remove the banner at once. Test: Task 4 (unit) and Task 11.
3. **Scrolling back up must not hide Journey content.** Forward-only progress. Test: Task 11 (scroll to the end, scroll to the top, assert every Journey piece is still shown).
4. **Hidden desktop or mobile copies of a heading are never split.** SplitText on a `display: none` element measures zero. Test: Task 5 (unit) and Task 11 (only the visible heading has an `aria-label`).
5. **Screen readers hear full sentences and keyboard users get the hover cue.** Test: Task 11 (`aria-label` equals the heading text; focus shows the nav underline and the arrow nudge).

## File Structure

New:
- `components/shared/RevealStagger.tsx`: groups siblings and sets `data-reveal-group` after mount.
- `components/shared/ScrollGradient.tsx`: a panel wrapper whose gradient shifts with scroll (Sections 3 and 7).
- `components/shared/ScrollIllustration.tsx`: an illustration wrapper that slides in and scales slowly with scroll (Section 2).
- `components/pages/home/sections/JourneyPath.tsx`: the inline SVG path (track, drawn path, marker).
- `tests/unit/reveal-stagger.test.tsx`, `tests/unit/text-reveal-media.test.tsx`.
- `tests/e2e/motion-homepage.spec.ts`.

Modified:
- `app/globals.css`, `components/shared/{Button,TextReveal,CookieBanner,Header,Footer,FaqCards}.tsx`, `components/pages/home/sections/{Section0,Section1,Section2,Section3,Section4,Section5,Section6,Section7,JourneyTimeline}.tsx`, and the existing tests `tests/unit/{cookie-banner,header,footer,faq-cards}.test.tsx` where their assertions pinned old markup.

## Task 1: Shared motion CSS and the single CTA rule

**Files:**
- Modify: `app/globals.css`
- Modify: `components/shared/Button.tsx`

**Interfaces:**
- Consumes: none
- Produces: CSS names used by later tasks: `.reveal-group`, `[data-motion-image]`, `[data-icon]`, `.hero-settle`, `.menu-in`, `.cookie-in`, `.cookie-out`, `.faq-card`, `.faq-icon`, `.nav-link`, `.social-lift`, and the `.btn` arrow nudge and press.

- [ ] **Step 1: Replace the old `.btn:not(.group)` block**

In `app/globals.css`, delete this block (it exists from the earlier arrow fix):

```css
/* Arrow nudge for the hand-written CTA links on the segment pages. The shared Button
   component does its own nudge (group-hover), so it's excluded here to avoid doubling. */
@media (prefers-reduced-motion: no-preference) {
  .btn:not(.group) svg {
    transition: transform 200ms ease;
  }
  .btn:not(.group):hover svg,
  .btn:not(.group):focus-visible svg {
    transform: translateX(4px);
  }
}
```

- [ ] **Step 2: Add the shared motion rules**

Append to `app/globals.css`, after the reduced-motion block:

```css
/* ===== Motion system (spec 2026-10-13) ===== */
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Group entry: children rise once, staggered by position (max 6). */
.reveal-group > * {
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
}
.reveal-group[data-reveal-group="pending"] > * {
  opacity: 0;
  transform: translateY(24px);
}
.reveal-group[data-reveal-group="shown"] > * {
  opacity: 1;
  transform: none;
}
.reveal-group > :nth-child(2) { transition-delay: 80ms; }
.reveal-group > :nth-child(3) { transition-delay: 160ms; }
.reveal-group > :nth-child(4) { transition-delay: 240ms; }
.reveal-group > :nth-child(5) { transition-delay: 320ms; }
.reveal-group > :nth-child(6) { transition-delay: 400ms; }

/* Images inside a revealed block fade in and settle from a slight zoom. */
[data-motion-image] {
  transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out);
}
.reveal-group[data-reveal-group="pending"] [data-motion-image],
.reveal[data-reveal="pending"] [data-motion-image] {
  opacity: 0;
  transform: scale(1.04);
}

/* Hero illustration: settles in on load. */
@keyframes settle-in {
  from { opacity: 0; transform: scale(1.04); }
  to { opacity: 1; transform: none; }
}
.hero-settle {
  animation: settle-in 800ms var(--ease-out) both;
}

/* Icons pop in once when the block around them is shown. "backwards" so a hover or
   open-state transform on the same element takes over afterwards. */
@keyframes icon-pop {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
.reveal-group[data-reveal-group="shown"] [data-icon],
.reveal[data-reveal="shown"] [data-icon] {
  animation: icon-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

/* Sign-in dropdown and cookie banner. */
@keyframes menu-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: none; }
}
.menu-in {
  animation: menu-in 200ms var(--ease-out) both;
}
@keyframes cookie-in {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: none; }
}
@keyframes cookie-out {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateY(24px); }
}
.cookie-in {
  animation: cookie-in 400ms var(--ease-out) 600ms both;
}
.cookie-out {
  animation: cookie-out 250ms ease-in both;
}

/* FAQ cards: colour changes fade, and the icon grows a little when its card is open. */
.faq-card {
  transition: background-color 250ms ease, border-color 250ms ease;
}
.faq-icon {
  transition: transform 200ms var(--ease-out);
}
button[aria-expanded="true"] .faq-icon {
  transform: scale(1.1);
}

/* Nav and footer links: underline draws from the left. The underline is a state, so it shows
   instantly under reduced motion. */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 200ms ease;
}
.nav-link:hover::after,
.nav-link:focus-visible::after {
  transform: scaleX(1);
}

/* Hover and press motion applies only when the visitor has not asked for less motion. */
@media (prefers-reduced-motion: no-preference) {
  .btn {
    transition-property: color, background-color, border-color, scale;
    transition-duration: 150ms;
  }
  .btn svg {
    transition: transform 200ms ease;
  }
  .btn:hover svg,
  .btn:focus-visible svg {
    transform: translateX(4px);
  }
  .btn:active {
    scale: 0.98;
  }
  .social-lift {
    transition: translate 200ms ease;
  }
  .social-lift:hover,
  .social-lift:focus-visible {
    translate: 0 -4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal-group > *,
  .reveal-group[data-reveal-group="pending"] > *,
  .reveal-group > :nth-child(n) {
    opacity: 1;
    transform: none;
    transition: none;
    transition-delay: 0ms;
  }
  [data-motion-image],
  .reveal-group[data-reveal-group="pending"] [data-motion-image],
  .reveal[data-reveal="pending"] [data-motion-image] {
    opacity: 1;
    transform: none;
    transition: none;
  }
  [data-icon],
  .hero-settle,
  .menu-in,
  .cookie-in,
  .cookie-out {
    animation: none !important;
  }
  .nav-link::after,
  .faq-card,
  .faq-icon {
    transition: none;
  }
}
```

- [ ] **Step 3: Remove the per-component arrow code from `Button`**

In `components/shared/Button.tsx`, replace the `ArrowRight` function with:

```tsx
function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

And change `const cls = \`btn group inline-flex` to `const cls = \`btn inline-flex`.

- [ ] **Step 4: Verify**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx tsc --noEmit && npx vitest run && npm run build 2>&1 | grep -E "Compiled|rror"`
Expected: no type errors, all existing tests pass (if a Button test asserted the `group` class, change that assertion to `btn`), build compiles.

- [ ] **Step 5: Checkpoint (no commit)**

## Task 2: `RevealStagger`

**Files:**
- Create: `components/shared/RevealStagger.tsx`
- Test: `tests/unit/reveal-stagger.test.tsx`

**Interfaces:**
- Consumes: CSS from Task 1 (`.reveal-group`, `data-reveal-group`)
- Produces: `RevealStagger({ children: ReactNode, className?: string })`. Renders `<div class="reveal-group {className}" data-reveal-group="pending|shown">`; the attribute is absent before mount and without `IntersectionObserver`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/reveal-stagger.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RevealStagger } from '@/components/shared/RevealStagger';

type Cb = (entries: { isIntersecting: boolean }[]) => void;
let trigger: Cb | null = null;

beforeEach(() => {
  trigger = null;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: Cb) {
        trigger = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
});

describe('RevealStagger', () => {
  it('renders every child in the markup and marks the group pending after mount', () => {
    render(
      <RevealStagger>
        <p>One</p>
        <p>Two</p>
      </RevealStagger>,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('One').parentElement!.getAttribute('data-reveal-group')).toBe('pending');
  });

  it('moves to shown when the group intersects', () => {
    render(
      <RevealStagger>
        <p>One</p>
      </RevealStagger>,
    );
    act(() => trigger!([{ isIntersecting: true }]));
    expect(screen.getByText('One').parentElement!.getAttribute('data-reveal-group')).toBe('shown');
  });

  it('adds no attribute when IntersectionObserver is unavailable, so children stay visible', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(
      <RevealStagger>
        <p>One</p>
      </RevealStagger>,
    );
    expect(screen.getByText('One').parentElement!.getAttribute('data-reveal-group')).toBeNull();
  });

  it('keeps the className alongside reveal-group', () => {
    render(
      <RevealStagger className="grid gap-4">
        <p>One</p>
      </RevealStagger>,
    );
    const group = screen.getByText('One').parentElement!;
    expect(group.className).toContain('reveal-group');
    expect(group.className).toContain('grid gap-4');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/unit/reveal-stagger.test.tsx`
Expected: FAIL, "Cannot find module '@/components/shared/RevealStagger'".

- [ ] **Step 3: Implement**

Create `components/shared/RevealStagger.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = { children: ReactNode; className?: string };

// Groups siblings so the CSS in globals.css (.reveal-group) staggers their entry. The pending
// state is set only after mount, so the server HTML shows every child. Without
// IntersectionObserver the group is left alone and stays visible.
export function RevealStagger({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'pending' | 'shown'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    setState('pending');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown');
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal-group={state === 'idle' ? undefined : state} className={`reveal-group ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run tests/unit/reveal-stagger.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 5: Checkpoint (no commit)**

## Task 3: Header and footer (shared chrome)

**Files:**
- Modify: `components/shared/Header.tsx`
- Modify: `components/shared/Footer.tsx`
- Test: existing `tests/unit/header.test.tsx`, `tests/unit/footer.test.tsx`

**Interfaces:**
- Consumes: `.nav-link`, `.menu-in`, `.social-lift` (Task 1), `RevealStagger` (Task 2), `Reveal` (existing)
- Produces: nav and footer links with the shared underline, a header pill with a transition and a stronger shadow once scrolled, an animated dropdown, a staggered footer.

- [ ] **Step 1: Header pill transition and scrolled shadow**

In `Header.tsx`, replace the pill `className` (the `<div data-testid="header-pill" ...>` one) with a template string:

```tsx
        className={`flex w-full bg-[image:var(--header-bg)] max-w-[1392px] items-center justify-between rounded-full border-[1.5px] border-white/65 px-4 py-3 backdrop-blur-[14px] transition-[background-color,box-shadow] duration-300 ${
          scrolled
            ? 'shadow-[0px_12px_34px_-8px_rgba(16,73,76,0.22)]'
            : 'shadow-[0px_12px_34px_-8px_rgba(214,251,254,0.16)]'
        }`}
```

- [ ] **Step 2: Header nav links get the underline**

In the desktop nav `Link`, change its `className` from:

```
"inline-block whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.6px] text-content-brand transition-all hover:scale-[1.03] hover:text-brand-dark"
```

to:

```
"nav-link inline-block whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.6px] text-content-brand transition-colors hover:text-brand-dark"
```

- [ ] **Step 3: Animated dropdown**

Change the dropdown `<div role="menu" className="absolute right-0 top-full mt-2 ...">` so its `className` starts with `menu-in `:

```tsx
              <div role="menu" className="menu-in absolute right-0 top-full mt-2 min-w-[220px] rounded-2xl bg-white p-2 shadow-[0px_0px_20px_rgba(10,13,18,0.14)]">
```

- [ ] **Step 4: Footer imports and the column stagger**

In `Footer.tsx`, add at the top:

```tsx
import { RevealStagger } from './RevealStagger';
import { Reveal } from './Reveal';
```

Run these edits from `cbt-site/`:

```bash
perl -0pi -e 's|<div className="flex flex-wrap gap-16">|<RevealStagger className="flex flex-wrap gap-16">|; s|(\)\)\}\s*)</div>(\s*</div>\s*<div className="relative z-10 hidden w-full max-w-\[1248px\] justify-end lg:flex">)|$1</RevealStagger>$2|' components/shared/Footer.tsx
```

- [ ] **Step 5: Footer links, social icons and ISO badge**

```bash
perl -0pi -e 's|<A key=\{l.href\} l=\{l\} className="whitespace-nowrap" />|<A key={l.href} l={l} className="nav-link inline-block whitespace-nowrap" />|g; s|className="text-content-knockout/80 hover:text-content-knockout"|className="social-lift text-content-knockout/80 hover:text-content-knockout"|; s|<IsoBadge />|<Reveal><IsoBadge /></Reveal>|' components/shared/Footer.tsx
grep -c "nav-link" components/shared/Footer.tsx; grep -c "social-lift" components/shared/Footer.tsx; grep -c "<RevealStagger" components/shared/Footer.tsx; grep -c "</RevealStagger>" components/shared/Footer.tsx
```

Expected: `nav-link` at least 1, `social-lift` 1, and `<RevealStagger` and `</RevealStagger>` both 1. If the opening or closing count is 0, the Footer desktop columns block differs from the pattern: open the file around `COLUMNS.map` and wrap that container by hand.

- [ ] **Step 6: Verify the existing tests**

Run: `npx vitest run tests/unit/header.test.tsx tests/unit/footer.test.tsx`
Expected: PASS. If a test asserted `hover:scale` or the old social class, update that assertion to the new class (`nav-link`, `social-lift`) and keep the rest of the test unchanged.

- [ ] **Step 7: Browser check**

Run `npm run dev`, open `/` at 1440px. Hover each nav link: an underline draws from the left. Scroll 100px: the pill shadow strengthens smoothly. Open Sign in: the menu fades and slides down. Scroll to the footer: columns rise in order; hover a social icon: it lifts 4px.

- [ ] **Step 8: Checkpoint (no commit)**

## Task 4: Cookie banner entry and exit

**Files:**
- Modify: `components/shared/CookieBanner.tsx`
- Test: existing `tests/unit/cookie-banner.test.tsx`

**Interfaces:**
- Consumes: `.cookie-in`, `.cookie-out` (Task 1)
- Produces: a banner that animates in after 600ms and out for 250ms on a choice. Under reduced motion it leaves at once.

- [ ] **Step 1: Write the failing test**

Append to `tests/unit/cookie-banner.test.tsx` (keep the file's existing imports and setup; add `act` and `vi` to its imports if they are not there):

```tsx
describe('CookieBanner exit', () => {
  it('keeps the banner mounted with the leaving class for 250ms, then removes it', async () => {
    vi.useFakeTimers();
    try {
      localStorage.clear();
      render(<CookieBanner />);
      await act(async () => {});
      const dialog = screen.getByRole('dialog', { name: 'Cookie preferences' });
      await act(async () => {
        screen.getByRole('button', { name: 'Accept all' }).click();
      });
      expect(screen.getByRole('dialog', { name: 'Cookie preferences' }).className).toContain('cookie-out');
      expect(dialog.isConnected).toBe(true);
      await act(async () => {
        vi.advanceTimersByTime(260);
      });
      expect(screen.queryByRole('dialog', { name: 'Cookie preferences' })).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('removes the banner at once when the visitor prefers reduced motion', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));
    localStorage.clear();
    render(<CookieBanner />);
    await act(async () => {});
    await act(async () => {
      screen.getByRole('button', { name: 'Accept all' }).click();
    });
    expect(screen.queryByRole('dialog', { name: 'Cookie preferences' })).toBeNull();
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/unit/cookie-banner.test.tsx`
Expected: the two new tests FAIL (no `cookie-out` class yet; banner removed instantly).

- [ ] **Step 3: Implement**

In `CookieBanner.tsx`, add a leaving state, change `choose`, and add the animation classes:

```tsx
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
```

```tsx
  const choose = (value: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch {
      /* storage blocked: still dismiss for this visit */
    }
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(false);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 250);
  };
```

Change the dialog `className` to start with the animation class:

```tsx
      className={`${leaving ? 'cookie-out' : 'cookie-in'} fixed bottom-6 left-6 right-6 z-50 flex max-w-[390px] flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0px_0px_20px_rgba(10,13,18,0.14),0px_0px_2.5px_rgba(10,13,18,0.04)] sm:right-auto`}
```

Add `transition-transform motion-safe:active:scale-95` to the close button, and `transition-transform motion-safe:active:scale-[0.98]` to the Reject and Accept buttons.

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run tests/unit/cookie-banner.test.tsx`
Expected: PASS. If an older test in this file asserted the banner is gone right after a click, change it to `await waitFor(() => expect(queryByRole(...)).toBeNull())` (import `waitFor`).

- [ ] **Step 5: Checkpoint (no commit)**

## Task 5: `TextReveal` media and style props, and the homepage headings

**Files:**
- Modify: `components/shared/TextReveal.tsx`
- Modify: `components/pages/home/sections/{Section0,Section2,Section4,Section5,Section6,Section7}.tsx`
- Test: `tests/unit/text-reveal-media.test.tsx`

**Interfaces:**
- Consumes: existing `TextReveal` behaviour
- Produces: `TextReveal` props `media?: string` (split runs only while that media query matches) and `style?: CSSProperties`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/text-reveal-media.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextReveal } from '@/components/shared/TextReveal';

describe('TextReveal props', () => {
  it('renders the heading text unchanged when media is set', () => {
    render(
      <TextReveal as="h2" split="words" trigger="scroll" media="(min-width: 1024px)">
        Growth looks different for every child
      </TextReveal>,
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Growth looks different for every child');
  });

  it('passes className and style through to the heading', () => {
    render(
      <TextReveal as="h2" split="words" trigger="scroll" className="text-brand-teal" style={{ color: 'rgb(1, 2, 3)' }}>
        Frequently Asked Questions
      </TextReveal>,
    );
    const h = screen.getByRole('heading', { level: 2 });
    expect(h.className).toBe('text-brand-teal');
    expect(h.style.color).toBe('rgb(1, 2, 3)');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/unit/text-reveal-media.test.tsx`
Expected: FAIL (the `media` and `style` props are not accepted; the type check fails or `style` is dropped).

- [ ] **Step 3: Replace `TextReveal.tsx`**

```tsx
'use client';

import { useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Props = {
  as: 'h1' | 'h2';
  split: 'lines' | 'words' | 'sentences';
  trigger: 'load' | 'scroll';
  /** Only split while this media query matches, so a hidden desktop or mobile copy is never split. */
  media?: string;
  className?: string;
  style?: CSSProperties;
  children: string;
};

// Reveals a heading's lines, words or sentences once. The heading is plain text in the server
// HTML, so it reads without JavaScript. Reduced-motion users never get the split. aria: 'auto'
// keeps the full sentence as the accessible name so screen readers don't read the pieces.
export function TextReveal({ as: Tag, split, trigger, media, className, style, children }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const query = media
        ? `(prefers-reduced-motion: no-preference) and ${media}`
        : '(prefers-reduced-motion: no-preference)';
      mm.add(query, () => {
        const scrollTrigger = trigger === 'scroll' ? { trigger: el, start: 'top 85%', once: true } : undefined;
        // This SplitText version has no sentence type, so sentences are split as words and grouped below.
        const splitText = SplitText.create(el, {
          type: split === 'lines' ? 'lines' : 'words',
          mask: split === 'lines' ? 'lines' : undefined,
          aria: 'auto',
          autoSplit: true,
          onSplit(self) {
            if (split === 'lines') {
              return gsap.from(self.lines, { yPercent: 100, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger });
            }
            if (split === 'words') {
              return gsap.from(self.words, { opacity: 0, y: 14, duration: 0.6, stagger: 0.05, ease: 'power2.out', scrollTrigger });
            }
            // Sentence reveal: each sentence starts after the previous one, words inside it stagger.
            const tl = gsap.timeline({ scrollTrigger });
            let sentence = 0;
            let inSentence = 0;
            self.words.forEach((word) => {
              tl.from(word, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, sentence * 0.4 + inSentence * 0.05);
              inSentence++;
              if (/[.?!]$/.test(word.textContent ?? '')) {
                sentence++;
                inSentence = 0;
              }
            });
            return tl;
          },
        });
        return () => splitText.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run tests/unit/text-reveal-media.test.tsx && npx tsc --noEmit`
Expected: PASS and no type errors.

- [ ] **Step 5: Apply `TextReveal` to the homepage headings**

Run from `cbt-site/`. Each command replaces one heading with the same classes and the exact same text, and adds the import. The `media` prop is set on the headings that exist in both a desktop and a mobile copy.

```bash
S=components/pages/home/sections
IMP='import { TextReveal } from "@/components/shared/TextReveal";'

# Section 0: What is CognitiveBotics?
perl -0pi -e 's|<h2 className="(font-heading text-\[24px\] font-semibold leading-\[32px\] text-content-brand-secondary lg:text-\[48px\] lg:leading-\[58px\])">\s*What is CognitiveBotics\?\s*</h2>|<TextReveal as="h2" split="words" trigger="scroll" className="$1">{"What is CognitiveBotics?"}</TextReveal>|s' $S/Section0.tsx

# Section 2: desktop and mobile copies
perl -0pi -e 's|<h2 className="(font-heading text-\[40px\] font-semibold leading-\[48px\] text-text-secondary)">\s*Growth looks different for every child\s*</h2>|<TextReveal as="h2" split="words" trigger="scroll" media="(min-width: 1024px)" className="$1">{"Growth looks different for every child"}</TextReveal>|s; s|<h2 className="(font-heading text-\[20px\] font-bold leading-\[30px\] text-text-secondary)">\s*Growth looks different for every child\s*</h2>|<TextReveal as="h2" split="words" trigger="scroll" media="(max-width: 1023px)" className="$1">{"Growth looks different for every child"}</TextReveal>|s' $S/Section2.tsx
perl -0pi -e "s|^|$IMP\n|" $S/Section2.tsx

# Section 4
perl -0pi -e 's|<h2 className="(font-heading text-\[20px\] font-bold leading-\[30px\] text-content-brand lg:text-\[40px\] lg:font-semibold lg:leading-\[48px\])">\s*Find your path\s*</h2>|<TextReveal as="h2" split="words" trigger="scroll" className="$1">{"Find your path"}</TextReveal>|s' $S/Section4.tsx
perl -0pi -e "s|^|$IMP\n|" $S/Section4.tsx

# Section 5: desktop and mobile copies
perl -0pi -e 's|<h2 className="(text-center font-heading text-\[48px\] font-semibold leading-\[58px\] text-brand-teal)">\s*Real experiences from the families we support\s*</h2>|<TextReveal as="h2" split="words" trigger="scroll" media="(min-width: 1024px)" className="$1">{"Real experiences from the families we support"}</TextReveal>|s; s|<h2 className="(font-heading text-\[24px\] font-semibold leading-\[32px\] text-brand-teal)">\s*Real experiences from the families we support\s*</h2>|<TextReveal as="h2" split="words" trigger="scroll" media="(max-width: 1023px)" className="$1">{"Real experiences from the families we support"}</TextReveal>|s' $S/Section5.tsx
perl -0pi -e "s|^|$IMP\n|" $S/Section5.tsx

# Section 6 (keeps its style custom properties)
perl -0pi -e 's|<h2\s+className="([^"]*)"\s+style=\{\{(.*?)\}\}\s*>\s*Frequently Asked Questions\s*</h2>|<TextReveal as="h2" split="words" trigger="scroll" className="$1" style={{$2}}>{"Frequently Asked Questions"}</TextReveal>|s' $S/Section6.tsx
perl -0pi -e "s|^|$IMP\n|" $S/Section6.tsx

# Section 7
perl -0pi -e 's|<h2 className="(font-heading text-\[20px\] font-bold leading-\[30px\] text-brand-teal lg:text-\[28px\] lg:font-semibold lg:leading-\[36px\])">\s*Better outcomes begin when everyone works from the same\s+understanding\s*</h2>|<TextReveal as="h2" split="words" trigger="scroll" className="$1">{"Better outcomes begin when everyone works from the same understanding"}</TextReveal>|s' $S/Section7.tsx
perl -0pi -e "s|^|$IMP\n|" $S/Section7.tsx

grep -c "<TextReveal" $S/Section0.tsx $S/Section2.tsx $S/Section4.tsx $S/Section5.tsx $S/Section6.tsx $S/Section7.tsx
```

Expected counts: Section0 `2` (the H1 from before plus What-is), Section2 `2`, Section4 `1`, Section5 `2`, Section6 `1`, Section7 `1`. `Section3` already has its heading done. If any count is lower, that heading's markup differs: open the file, find the `<h2` with that text, and convert it by hand to the same `TextReveal` form.

Section 0 only needs the import if it does not already have one. Check: `grep -c "TextReveal\"" $S/Section0.tsx` should be at least 1, and it already does (the H1).

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit && npx vitest run`
Expected: no type errors, all tests pass.

- [ ] **Step 7: Checkpoint (no commit)**

## Task 6: Hero (trust pills, What-is card, illustration)

**Files:**
- Modify: `components/pages/home/sections/Section0.tsx`

**Interfaces:**
- Consumes: `RevealStagger` (Task 2), `Reveal` (existing), `[data-icon]`, `[data-motion-image]`, `.hero-settle` (Task 1)

- [ ] **Step 1: Imports**

Add to the top of `Section0.tsx`:

```tsx
import { RevealStagger } from "@/components/shared/RevealStagger";
import { Reveal } from "@/components/shared/Reveal";
```

- [ ] **Step 2: Apply the edits**

Run from `cbt-site/`:

```bash
F=components/pages/home/sections/Section0.tsx
perl -0pi -e '
  # Trust pill row becomes a stagger group
  s|<div className="(grid grid-cols-2 gap-x-4 gap-y-5 rounded-\[20px\] border border-\[#f1eef3\][^"]*)">|<RevealStagger className="$1">|;
  s|(</a>\s*)</div>(\s*</div>\s*<div className="mx-auto mt-6 max-w-\[1440px\] px-6 lg:px-24">)|$1</RevealStagger>$2|;
  # Each pill icon circle pops in
  s|(\n\s*)className="(flex shrink-0 items-center justify-center rounded-full  size-12 lg:size-14)"|$1data-icon$1className="$2"|g;
  # What-is card rises as a block
  s|<div className="mx-auto mt-6 max-w-\[1440px\] px-6 lg:px-24">|<Reveal><div className="mx-auto mt-6 max-w-[1440px] px-6 lg:px-24">|;
  s|(</div>\s*)</section>|$1</Reveal>\n    </section>|;
  # What-is illustration settles in with its card
  s|<div className="relative h-\[188px\] w-full max-w-\[310px\] shrink-0 lg:h-\[258px\] lg:w-\[426px\] lg:max-w-none">|<div data-motion-image className="relative h-[188px] w-full max-w-[310px] shrink-0 lg:h-[258px] lg:w-[426px] lg:max-w-none">|;
  # Hero illustration settles instead of rising
  s|hero-enter hero-delay-2 relative order-2|hero-settle hero-delay-2 relative order-2|;
' $F
echo "RevealStagger open/close: $(grep -c '<RevealStagger' $F)/$(grep -c '</RevealStagger>' $F)"
echo "data-icon: $(grep -c 'data-icon' $F)  motion-image: $(grep -c 'data-motion-image' $F)  hero-settle: $(grep -c 'hero-settle' $F)  Reveal: $(grep -c '<Reveal>' $F)/$(grep -c '</Reveal>' $F)"
```

Expected: `1/1`, `data-icon: 4`, `motion-image: 1`, `hero-settle: 1`, `Reveal: 1/1`.

Note: `hero-delay-2` keeps its 300ms delay, which also applies to `hero-settle` because both use `animation-delay`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build 2>&1 | grep -E "Compiled|rror"`
Expected: no errors.

Browser: `npm run dev`, open `/`. The hero illustration settles in. Scroll: the four pills rise one after another with their icons popping in; the What-is card rises and its illustration settles.

- [ ] **Step 4: Checkpoint (no commit)**

## Task 7: Section 2 (rows, icons, illustration)

**Files:**
- Create: `components/shared/ScrollIllustration.tsx`
- Modify: `components/pages/home/sections/Section2.tsx`

**Interfaces:**
- Consumes: `RevealStagger` (Task 2), `[data-icon]` (Task 1)
- Produces: `ScrollIllustration({ children, className? })`. Slides in once from the right (`x: 40`, fades) and scales from 0.96 to 1.04 with scroll. Static under reduced motion.

- [ ] **Step 1: Create `ScrollIllustration`**

```tsx
'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Slides an illustration in once, then lets it scale slowly with scroll. Visible and static
// without JavaScript and under reduced motion.
export function ScrollIllustration({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(el, {
          x: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
        gsap.fromTo(
          el,
          { scale: 0.96 },
          {
            scale: 1.04,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
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

- [ ] **Step 2: Apply the Section 2 edits**

Run from `cbt-site/`:

```bash
F=components/pages/home/sections/Section2.tsx
perl -0pi -e '
  # Desktop rows: stagger group
  s|<div className="flex w-full flex-col">|<RevealStagger className="flex w-full flex-col">|;
  s|(\n\s*)</div>(\n\s*</div>\n\s*<div className="relative h-\[620px\])|$1</RevealStagger>$2|;
  # Mobile rows: stagger group
  s|<div className="flex w-full flex-col items-start gap-6">|<RevealStagger className="flex w-full flex-col items-start gap-6">|;
  s|(\n\s*)</div>(\n\s*</div>\n\s*</section>)|$1</RevealStagger>$2|;
  # Every icon circle (5 desktop size-12, 5 mobile size-10) pops in
  s|(\n\s*)className="(flex shrink-0 items-center justify-center rounded-full  size-(?:12\|10))"|$1data-icon$1className="$2"|g;
  # Desktop illustration slides in and scales with scroll
  s|<div className="relative h-\[620px\] w-full max-w-\[600px\] shrink-0">|<ScrollIllustration className="relative h-[620px] w-full max-w-[600px] shrink-0">|;
' $F
perl -0pi -e 's|(sizes="600px"\s*className="absolute inset-0 h-full w-full object-contain"\s*/>\s*)</div>|$1</ScrollIllustration>|' $F
perl -0pi -e 's|^|import { RevealStagger } from "\@/components/shared/RevealStagger";\nimport { ScrollIllustration } from "\@/components/shared/ScrollIllustration";\n|' $F
echo "stagger open/close: $(grep -c '<RevealStagger' $F)/$(grep -c '</RevealStagger>' $F)  data-icon: $(grep -c 'data-icon' $F)  illustration open/close: $(grep -c '<ScrollIllustration' $F)/$(grep -c '</ScrollIllustration>' $F)"
npx tsc --noEmit && echo TSC_OK
```

Expected: `2/2`, `data-icon: 10`, `1/1`, then `TSC_OK`. If a count is off, open the file and make the matching manual edit for that block (the patterns assume the structures read in the spec).

The mobile illustration (`h-[280px]`) keeps the plain Reveal fade from the section wrapper. That is intentional: the slide-and-scale is a desktop treatment.

- [ ] **Step 3: Browser check**

`npm run dev`, open `/` at 1440px. Scroll to Section 2: the badge and heading arrive, five rows rise in order with icons popping, the illustration slides in from the right and scales slowly as you scroll past. At 390px the mobile rows rise in order.

- [ ] **Step 4: Checkpoint (no commit)**

## Task 8: Sections 3 and 7 (CTA panels with a scroll-linked gradient)

**Files:**
- Create: `components/shared/ScrollGradient.tsx`
- Modify: `components/pages/home/sections/Section3.tsx`, `Section7.tsx`

**Interfaces:**
- Consumes: none new
- Produces: `ScrollGradient({ children, className?, style? })`. Renders the panel `div` with a gradient that is 160% wide and drifts left to right as the panel crosses the screen. Static under reduced motion.

- [ ] **Step 1: Create `ScrollGradient`**

```tsx
'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { children: ReactNode; className?: string; style?: CSSProperties };

// A panel whose gradient drifts gently while it crosses the screen. The gradient is 160% wide
// so there is room to move. Under reduced motion, and without JavaScript, it stays put.
export function ScrollGradient({ children, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el,
          { backgroundPosition: '0% 50%' },
          {
            backgroundPosition: '100% 50%',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      data-scroll-gradient
      className={className}
      style={{ backgroundSize: '160% 100%', backgroundPosition: '0% 50%', ...style }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Apply to both panels**

The two panels share the same opening markup (a `div` with `[background:var(--cta-bg-mobile)]` and a `style` holding the two gradient variables). Run from `cbt-site/`:

```bash
for F in components/pages/home/sections/Section3.tsx components/pages/home/sections/Section7.tsx; do
  perl -0pi -e '
    s|<div\s+className="(flex flex-col \[background:var\(--cta-bg-mobile\)\][^"]*)"\s+style=\{\{|<ScrollGradient className="$1" style={{|;
    s|(</Link>\s*)</div>(\s*</div>\s*</section>)|$1</ScrollGradient>$2|;
  ' $F
  perl -0pi -e 's|^|import { ScrollGradient } from "\@/components/shared/ScrollGradient";\n|' $F
  echo "$F gradient open/close: $(grep -c '<ScrollGradient' $F)/$(grep -c '</ScrollGradient>' $F)"
done
npx tsc --noEmit && echo TSC_OK
```

Expected: `1/1` for each file, then `TSC_OK`.

- [ ] **Step 3: Browser check**

`npm run dev`, scroll past Section 3 and Section 7. The panel gradient drifts a little while the panel crosses the screen. The headline word reveal and CTA behave as before. Check at 390px that the panel looks unchanged when stationary.

- [ ] **Step 4: Checkpoint (no commit)**

## Task 9: Sections 4 and 5, and FAQ cards

**Files:**
- Modify: `components/pages/home/sections/Section4.tsx`, `Section5.tsx`
- Modify: `components/shared/FaqCards.tsx`
- Test: existing `tests/unit/faq-cards.test.tsx`

**Interfaces:**
- Consumes: `RevealStagger` (Task 2), `.faq-card`, `.faq-icon`, `[data-icon]` (Task 1)

- [ ] **Step 1: Section 4 rows**

Run from `cbt-site/`:

```bash
F=components/pages/home/sections/Section4.tsx
perl -0pi -e '
  # Rows become a stagger group
  s|<div className="flex flex-1 flex-col gap-3 lg:gap-4">|<RevealStagger className="flex flex-1 flex-col gap-3 lg:gap-4">|;
  s|(</Link>\s*)</div>(\s*</div>\s*</section>)|$1</RevealStagger>$2|;
  # Each row carries its label colour, tints to it on hover, and slides its arrow
  s|(<Link\s+href="/therapy-centres")|$1 style={{ "--row-color": "#15803d" }}|;
  s|(<Link\s+href="/parents")|$1 style={{ "--row-color": "#b45309" }}|;
  s|(<Link\s+href="/schools")|$1 style={{ "--row-color": "#0369a1" }}|;
  s|className="flex items-center gap-\[14px\] rounded-\[16px\]|className="group flex items-center gap-[14px] rounded-[16px]|g;
  s|hover:bg-background-brand-subtle|hover:bg-[color-mix(in_srgb,var(--row-color)_7%,white)]|g;
  s|className="shrink-0"|className="shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"|g;
' $F
perl -0pi -e 's|^|import { RevealStagger } from "\@/components/shared/RevealStagger";\n|' $F
echo "stagger: $(grep -c '<RevealStagger' $F)/$(grep -c '</RevealStagger>' $F)  row-color: $(grep -c '\-\-row-color' $F)  group rows: $(grep -c 'className="group flex' $F)  arrows: $(grep -c 'group-hover:translate-x-1' $F)"
npx tsc --noEmit && echo TSC_OK
```

Expected: `1/1`, `row-color` at least `6` (three style attributes plus three `var(--row-color)` hover classes), `group rows: 3`, `arrows: 3`, `TSC_OK`.

- [ ] **Step 2: Section 5 cards and carousel controls**

```bash
F=components/pages/home/sections/Section5.tsx
perl -0pi -e '
  # Desktop testimonial cards become a stagger group
  s|<div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">|<RevealStagger className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">|;
  s|(</div>\s*)</div>(\s*<div className="flex items-center gap-5">)|$1</RevealStagger>$2|;
  # Prev and next controls: grow on hover and shrink on press, only when enabled
  s|className="flex size-12 items-center justify-center rounded-full border-\[1\.5px\]|className="transition-transform motion-safe:enabled:hover:scale-105 motion-safe:enabled:active:scale-95 flex size-12 items-center justify-center rounded-full border-[1.5px]|g;
' $F
perl -0pi -e 's|^|import { RevealStagger } from "\@/components/shared/RevealStagger";\n|' $F
echo "stagger: $(grep -c '<RevealStagger' $F)/$(grep -c '</RevealStagger>' $F)  controls: $(grep -c 'enabled:hover:scale-105' $F)"
npx tsc --noEmit && echo TSC_OK
```

Expected: `1/1`, `controls: 2`, `TSC_OK`.

- [ ] **Step 3: FAQ cards**

Run from `cbt-site/`:

```bash
F=components/shared/FaqCards.tsx
perl -0pi -e '
  # Cards enter as a stagger group
  s|<div className="flex flex-1 flex-col items-start gap-3 lg:gap-\[14px\]">|<RevealStagger className="flex flex-1 flex-col items-start gap-3 lg:gap-[14px]">|;
  s|(\}\)\}\s*)</div>(\s*\);\s*\}\s*)$|$1</RevealStagger>$2|;
  # Colour changes fade
  s|className=\{`w-full rounded-\[14px\] border p-4|className={`faq-card w-full rounded-[14px] border p-4|;
  # Icon pops in with its card and grows when the card is open
  s|(\n\s*)className="(flex size-7 shrink-0 items-center justify-center rounded-full lg:size-\[38px\])"|$1data-icon$1className="faq-icon $2"|;
' $F
perl -0pi -e 's|^(import \{ useId)|import { RevealStagger } from "./RevealStagger";\n$1|' $F
echo "stagger: $(grep -c '<RevealStagger' $F)/$(grep -c '</RevealStagger>' $F)  faq-card: $(grep -c 'faq-card' $F)  faq-icon: $(grep -c 'faq-icon' $F)  data-icon: $(grep -c 'data-icon' $F)"
npx tsc --noEmit && echo TSC_OK
```

Expected: `1/1`, `faq-card: 1`, `faq-icon: 1`, `data-icon: 1`, `TSC_OK`. The import line must sit above the `import { useId, useState ... }` line; if `RevealStagger` is imported twice or not at all, fix it by hand.

- [ ] **Step 4: Update the FaqCards test for the new markup and add one assertion**

Add to `tests/unit/faq-cards.test.tsx`, inside the `FaqCards accessibility` describe:

```tsx
  it("marks each card for the colour fade and each icon for the open-state growth", async () => {
    const FaqCards = await load("single");
    const { container } = render(<FaqCards items={ITEMS} icons={ICONS} />);
    expect(container.querySelectorAll(".faq-card").length).toBe(ITEMS.length);
    expect(container.querySelectorAll(".faq-icon").length).toBe(ITEMS.length);
  });
```

Run: `npx vitest run tests/unit/faq-cards.test.tsx`
Expected: PASS. If other tests in this file fail because the root element is now `RevealStagger`'s `div`, they should still pass because the markup is the same `div`; if a test pinned the root's exact class string, update it to include `reveal-group`.

- [ ] **Step 5: Browser check**

`npm run dev`. Section 4: rows slide up in order, each tints to its label colour on hover and its arrow slides. Section 5: cards rise in order, controls scale up only when enabled (the disabled ones don't). Section 6: cards rise in order with icons popping; opening one fades its background and grows its icon.

- [ ] **Step 6: Checkpoint (no commit)**

## Task 10: Journey (forward-only, path, marker, node rings)

**Files:**
- Create: `components/pages/home/sections/JourneyPath.tsx`
- Modify: `components/pages/home/sections/JourneyTimeline.tsx` (replace)
- Modify: `components/pages/home/sections/Section1.tsx`

**Interfaces:**
- Consumes: existing `data-journey-card`, `data-journey-connector`, `data-journey-node`, `data-journey-image` attributes
- Produces: `JourneyPath()` (server component) rendering the SVG with `[data-journey-path]` and `[data-journey-marker]`; nodes get a child `[data-journey-ring]`.

- [ ] **Step 1: Create `JourneyPath.tsx`**

```tsx
// The growth path: a light track plus a foreground line through the five step nodes, drawn in
// the container's own coordinate space (1248 x 1939, the same aspect ratio as the section).
// GSAP draws [data-journey-path] and moves [data-journey-marker] along it. Without JavaScript
// or under reduced motion the path is fully drawn and the marker stays hidden.
// The line passes through the node centres: (672,168) (593,576) (620,959) (648,1378) (575,1775).
const PATH_D =
  "M672 0 L672 168 C700 372 565 372 593 576 C560 767 655 767 620 959 C590 1168 685 1168 648 1378 C690 1576 545 1576 575 1775 L575 1939";

export function JourneyPath() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1248 1939"
      preserveAspectRatio="none"
      fill="none"
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
    >
      <path d={PATH_D} stroke="#f0dff2" strokeWidth="6" strokeLinecap="round" />
      <path data-journey-path d={PATH_D} stroke="#c79acc" strokeWidth="6" strokeLinecap="round" />
      <g data-journey-marker opacity="0">
        <circle r="9" fill="#b55aba" stroke="#ffffff" strokeWidth="3" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Replace the placeholder in `Section1.tsx` and add node rings**

Run from `cbt-site/`:

```bash
F=components/pages/home/sections/Section1.tsx
perl -0pi -e '
  # The centre placeholder strip becomes the real path
  s|<div\s+className="pointer-events-none absolute select-none"\s+style=\{\{[^}]*\}\}\s*>\s*<Placeholder label="Image" className="object-fill" />\s*</div>|<JourneyPath />|;
  # No other Placeholder use remains, so drop its import and add the path import
  s|import \{ Placeholder \} from "\@/components/shared/Placeholder";\n|import { JourneyPath } from "./JourneyPath";\n|;
  # Each numbered node gets a ring that pulses once when the line reaches it
  s|(data-journey-node\s+className="[^"]*"\s+style=\{\{[^}]*\}\}\s*>\s*)(<span)|$1<span aria-hidden="true" data-journey-ring className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#c79acc] opacity-0" />\n            $2|g;
' $F
echo "JourneyPath: $(grep -c '<JourneyPath' $F)  Placeholder left: $(grep -c 'Placeholder' $F)  rings: $(grep -c 'data-journey-ring' $F)"
npx tsc --noEmit && echo TSC_OK
```

Expected: `JourneyPath: 1`, `Placeholder left: 0`, `rings: 5`, `TSC_OK`.

`JourneyPath` renders first inside the container, so the later absolutely positioned cards, connectors, nodes and images paint above it.

- [ ] **Step 3: Replace `JourneyTimeline.tsx`**

```tsx
'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, useGSAP);

type Props = { children: ReactNode; className?: string; style?: CSSProperties };

const PATH_DURATION = 5; // timeline units; the path and marker run the whole timeline

// Desktop only. Walks the five growth steps as the reader scrolls: each card rises, its dashed
// connector draws, the illustration and numbered node land with a one-time ring, while a line
// is drawn through the nodes and an orchid marker travels along it. Progress only ever moves
// forward, so scrolling back up never hides content. Mobile and reduced-motion users get the
// static layout (path fully drawn, marker hidden).
export function JourneyTimeline({ children, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)' },
        (ctx) => {
          const { isDesktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean };
          if (!isDesktop || reduce || !ref.current) return;

          const q = gsap.utils.selector(ref.current);
          const cards = q('[data-journey-card]');
          const connectors = q('[data-journey-connector]');
          const nodes = q('[data-journey-node]');
          const rings = q('[data-journey-ring]');
          const images = q('[data-journey-image]');
          const path = q('[data-journey-path]')[0];
          const marker = q('[data-journey-marker]')[0];

          const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });

          cards.forEach((card, i) => {
            tl.from(card, { opacity: 0, y: 24, duration: 0.6 }, i)
              .from(connectors[i], { scaleX: 0, transformOrigin: 'left center', duration: 0.8 }, i + 0.3)
              .from(images[i], { opacity: 0, y: 16, duration: 0.6 }, i + 0.4)
              .from(nodes[i], { scale: 0, duration: 0.4, ease: 'back.out(2)' }, i + 0.7)
              .fromTo(rings[i], { scale: 1, opacity: 0.6 }, { scale: 1.8, opacity: 0, duration: 0.6 }, i + 0.85);
          });

          if (path && marker) {
            tl.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', duration: PATH_DURATION }, 0);
            tl.set(marker, { autoAlpha: 1 }, 0);
            tl.to(
              marker,
              {
                motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
                ease: 'none',
                duration: PATH_DURATION,
              },
              0,
            );
            tl.to(marker, { autoAlpha: 0, duration: 0.3 }, PATH_DURATION - 0.3);
            gsap.set(marker, { autoAlpha: 0 });
          }

          // Forward only: remember the furthest scroll progress and never go back from it.
          let furthest = 0;
          const st = ScrollTrigger.create({
            trigger: ref.current,
            start: 'top 75%',
            end: 'bottom 65%',
            onUpdate(self) {
              if (self.progress > furthest) {
                furthest = self.progress;
                gsap.to(tl, { progress: furthest, duration: 0.6, ease: 'power1.out', overwrite: true });
              }
            },
          });
          if (st.progress > 0) {
            furthest = st.progress;
            tl.progress(furthest);
          }

          return () => {
            st.kill();
            tl.kill();
          };
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Verify types and build**

Run: `npx tsc --noEmit && npm run build 2>&1 | grep -E "Compiled|rror"`
Expected: no errors. If `gsap/DrawSVGPlugin` or `gsap/MotionPathPlugin` has no type declarations, add `declare module 'gsap/DrawSVGPlugin'` and `declare module 'gsap/MotionPathPlugin'` to a `types/gsap-plugins.d.ts` file (this folder already exists in the project root: `ls types`), each exporting the plugin as `export const DrawSVGPlugin: object;` and `export const MotionPathPlugin: object;`.

- [ ] **Step 5: Browser check**

`npm run dev`, open `/` at 1440px. Scroll slowly through the Journey. Expected: cards rise in order; the dashed connectors draw; a line draws through the five numbered nodes while an orchid dot travels along it; each node pulses one ring once; scrolling back up leaves everything visible. Judge the path shape and tell me if it needs a tuning pass. At 390px the mobile layout is unchanged.

- [ ] **Step 6: Checkpoint (no commit)**

## Task 11: End-to-end checks

**Files:**
- Create: `tests/e2e/motion-homepage.spec.ts`

**Interfaces:**
- Consumes: everything from Tasks 1 to 10

- [ ] **Step 1: Write the e2e spec**

Create `tests/e2e/motion-homepage.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const scrollThrough = async (page: import('@playwright/test').Page) => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(1500);
};

test('every animated group reaches its final state after a scroll', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  expect(await page.locator('[data-reveal-group="pending"], [data-reveal="pending"]').count()).toBe(0);
  expect(errors).toEqual([]);
});

test('Journey is forward only: scrolling back up leaves every piece visible', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  const hidden = await page
    .locator('[data-journey-card], [data-journey-node], [data-journey-image]')
    .evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
  expect(hidden).toBe(0);
  const connectors = await page
    .locator('[data-journey-connector]')
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).transform));
  for (const t of connectors) expect(t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);
});

test('Journey path is fully drawn at the end and the marker is gone', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const drawn = await page.locator('[data-journey-path]').evaluate((p) => {
    const len = (p as SVGPathElement).getTotalLength();
    const dash = getComputedStyle(p).strokeDasharray;
    const off = parseFloat(getComputedStyle(p).strokeDashoffset);
    return { len, dash, off };
  });
  expect(drawn.off).toBeLessThanOrEqual(1);
  const markerOpacity = await page.locator('[data-journey-marker]').evaluate((m) => getComputedStyle(m).opacity);
  expect(parseFloat(markerOpacity)).toBe(0);
});

test('reduced motion: groups are final, path is drawn, marker hidden, cookie banner leaves at once', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  const notFinal = await page
    .locator('[data-reveal-group] > *')
    .evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
  expect(notFinal).toBe(0);
  const dash = await page.locator('[data-journey-path]').evaluate((p) => getComputedStyle(p).strokeDasharray);
  expect(dash === 'none' || dash === '0px' || dash === '').toBe(true);
  expect(parseFloat(await page.locator('[data-journey-marker]').evaluate((m) => getComputedStyle(m).opacity))).toBe(0);
  await page.getByRole('button', { name: 'Accept all' }).click();
  await expect(page.getByRole('dialog', { name: 'Cookie preferences' })).toHaveCount(0, { timeout: 200 });
  await ctx.close();
});

test('no JavaScript: server HTML keeps headings and the full path', async ({ request }) => {
  const html = await (await request.get('/')).text();
  for (const text of [
    'AI-powered early intervention platform for neurodivergent children',
    'What is CognitiveBotics?',
    'Growth looks different for every child',
    'Could Your Child Benefit from Extra Support?',
    'Find your path',
    'Real experiences from the families we support',
    'Frequently Asked Questions',
    'Better outcomes begin when everyone works from the same understanding',
  ]) {
    expect(html, text).toContain(text);
  }
  expect(html).toContain('data-journey-path');
});

test('only the visible copy of a duplicated heading is split', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const labelled = await page
    .locator('h2:has-text("Growth looks different")')
    .evaluateAll((els) => els.map((e) => ({ visible: (e as HTMLElement).offsetParent !== null, aria: e.getAttribute('aria-label') })));
  for (const h of labelled) {
    if (h.visible) expect(h.aria).toBe('Growth looks different for every child');
    else expect(h.aria).toBeNull();
  }
});

test('keyboard focus shows the same cue as hover on nav links and CTAs', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const link = page.locator('.nav-link').first();
  await link.focus();
  await page.waitForTimeout(300);
  const scale = await link.evaluate((el) => getComputedStyle(el, '::after').transform);
  expect(scale).not.toBe('matrix(0, 0, 0, 1, 0, 0)');
  const cta = page.locator('a.btn:has(svg)').first();
  await cta.scrollIntoViewIfNeeded();
  await cta.focus();
  await page.waitForTimeout(300);
  const nudge = await cta.locator('svg').first().evaluate((el) => getComputedStyle(el).transform);
  expect(nudge).toBe('matrix(1, 0, 0, 1, 4, 0)');
});

test('calm: no more than four animation owners are mid-entry at once while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  let max = 0;
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 200) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
    const owners = await page.evaluate(() => {
      const set = new Set<Element>();
      const q = '[data-reveal-group] > *, .reveal, h1 *, h2 *, [data-motion-image], [data-journey-card]';
      for (const el of Array.from(document.querySelectorAll(q))) {
        const o = parseFloat(getComputedStyle(el).opacity);
        if (o > 0.02 && o < 0.98) {
          const owner = el.closest('h1, h2, [data-reveal-group], .reveal, [data-journey-card]');
          if (owner) set.add(owner);
        }
      }
      return set.size;
    });
    max = Math.max(max, owners);
  }
  console.log('max concurrent animation owners:', max);
  expect(max).toBeLessThanOrEqual(4);
});

test('no horizontal overflow at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over).toBe(0);
});

test('coverage: at least 60% of the inventory has a motion hook at 1440px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const count = await page.evaluate(() => {
    const sel = [
      '.nav-link', '.btn', '[data-reveal-group] > *', '[data-icon]', '[data-motion-image]',
      '[data-journey-card]', '[data-journey-connector]', '[data-journey-node]', '[data-journey-image]',
      '[data-journey-path]', 'h1[aria-label]', 'h2[aria-label]', '.social-lift', '.faq-card',
      '.hero-settle', '[data-scroll-gradient]', '.reveal',
    ].join(',');
    const seen = new Set<Element>();
    for (const el of Array.from(document.querySelectorAll(sel))) {
      const r = (el as HTMLElement).getBoundingClientRect();
      const visible = r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none';
      if (visible) seen.add(el);
    }
    return seen.size;
  });
  console.log('animated units with a motion hook (desktop, de-duplicated):', count, 'of 118 in the spec inventory');
  expect(count).toBeGreaterThanOrEqual(71);
});
```

- [ ] **Step 2: Run the spec**

Run: `npx playwright test tests/e2e/motion-homepage.spec.ts`
Expected: all tests PASS. If browsers are missing: `npx playwright install chromium`, then rerun. The "coverage" and "calm" tests print their numbers, so record them for the final report.

Known sensitivity: the calm test and the reduced-motion cookie test depend on timing. If the calm number is at most 4 on a rerun but fails once, rerun twice before treating it as a real failure, and report the measured maximum either way.

- [ ] **Step 3: If a test fails, fix the cause**

Do not loosen an assertion to pass. A failing forward-only test means the Journey is still reversing: re-check the `furthest` logic in `JourneyTimeline`. A failing `aria-label` test means SplitText is running on a hidden copy: re-check the `media` props from Task 5.

- [ ] **Step 4: Checkpoint (no commit)**

## Task 12: Full verification and report

**Files:** none modified

- [ ] **Step 1: Type-check, unit tests, build**

Run:

```bash
cd /Users/samarthkumar/CBT/cbt-site && npx tsc --noEmit && npx vitest run && npm run build 2>&1 | grep -E "Compiled|rror"
```

Expected: no type errors, all unit tests pass, build compiles.

- [ ] **Step 2: The rest of the e2e suite**

Run: `npx playwright test`
Expected: the same results as before this work, plus the new spec. Any other existing e2e test that fails because it depended on old markup (for example the header nav hover or the cookie banner disappearing at once) should be updated to the new behaviour, with each change listed in the report.

- [ ] **Step 3: Browser pass at both widths**

At 1440px and 390px: scroll the whole page once and confirm each element type in the spec's section 6 moves on entry, hover and focus cues work, the Journey path and orchid dot behave as in Task 10 Step 5, and there are no console errors.

- [ ] **Step 4: Report**

Report to the user: the coverage and calm numbers from Task 11, any existing tests changed and why, the Journey path shape (so they can request a tuning pass), and anything that failed or was skipped.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-13-motion-system-homepage.md`. Please review the plan. Which execution approach would you prefer?

- **Subagent-driven:** a fresh subagent implements each task and a fresh reviewer checks it before the next one starts, then a whole-branch review at the end. Most thorough, but it costs a fresh context per task and per review.
- **Native:** I implement every task myself in this session, then one fresh reviewer checks the whole branch. Cheapest and fastest, with no independent review until the end.

For this plan I recommend **Native**: the twelve tasks share CSS class names and several edit the same files (`globals.css`, `Section0`, `Section2`), so one context keeps them consistent, and nothing is committed, so a mistake is easy to revert. Does the plan capture what you want, and which approach should we use?
