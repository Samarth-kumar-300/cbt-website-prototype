# Nav, Pricing, Try Demo and FAQs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the conversion path from the 2026-11-03 spec: a "Pricing" nav item and page, a rebuilt Try Demo (form, then Calendly, then confirmation), an FAQs page, and the nav and footer changes that link them.

**Architecture:** Pure logic lives in `lib/` (launch gates, FAQ sets, demo form rules, demo-flow reducer, Calendly helpers) and is unit-tested first. Page components follow the existing `components/pages/<slug>/` layout (`content.ts` copy, `sections/SectionN.tsx`) and reuse shared primitives (`Button`, `Eyebrow`, `TextReveal`, `RevealStagger`, `FAQ`). New shared pieces: `Chips` (tabs), `JsonLd`, `CtaPanel`, `QuoteCard`, `QuoteRow`. Nav links are built by one function that applies launch gates.

**Tech Stack:** Next.js 16.4 (App Router), React 19.3, Tailwind v4, GSAP (via `TextReveal`), Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-03-nav-pricing-demo-pages-design.md`

**Scope:** This is plan 1 of 2. Plan 2 (Blog, Case Studies, Testimonials, the `/resources` redirect, moving home testimonials onto the shared data) is written after real content exists. Until then those pages are gated off.

## Deviations from the spec (flagged for the reviewer)

1. **Nav fallback.** The spec hides gated Stories rows. With only FAQs live, a one-row "Stories" dropdown is odd, so the nav shows the existing **Resources** link until at least **two** Stories pages are live, then switches to the **Stories** dropdown. `/resources` is not redirected in this plan.
2. **Dropdown ARIA.** The Stories button is a disclosure (`aria-expanded` plus `aria-controls`), not `aria-haspopup="menu"`. A `menu` role would require full menu keyboard handling. It opens on click only, like the Sign-in menu.
3. **Pricing testimonials** use a CSS swipe row (grid on desktop), not the dotted carousel. Try Demo does use the dotted carousel.
4. **FAQ JSON-LD** de-duplicates questions that appear in two sets (for example the research question).
5. **Testimonials:** the repo already holds 4 quotes (3 parents, 1 therapist director) in `TestimonialRail.tsx`, not 2. They move to `lib/testimonials.ts`.
6. **Calendly URL and lead endpoint are not known.** `lib/demo-config.ts` ships `CALENDLY_URL = ''`: with it empty the flow skips the booking step and ends on "Request received". `lib/demo-submit.ts` is a stub like the contact form. Both are launch blockers in the spec's open items.
7. `/try-demo` reads `?plan=` through the page `searchParams` prop, so it renders per request (static rendering is lost for that one route).

## Global Constraints

- Never `git push`. Commit locally only. Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Next.js 16 differs from older versions. `searchParams` in a page is a `Promise`. JSON-LD is a `<script type="application/ld+json">` with `<` replaced by `<`.
- Tailwind v4 compiles through the Turbopack loader rule in `next.config.ts`. Do not add a postcss config.
- No API routes and no environment variables.
- Page components return only `<section>` elements. `app/layout.tsx` owns `<main>`, Header, Footer.
- Copy follows lean-copy: sentence case, no em dashes, no exclamation marks, buttons name the action, titles at most 8 words.
- Reuse `Reveal`, `RevealStagger`, `TextReveal`, `MotionImage`. No one-off animations.
- Nav order (desktop): `THERAPY CENTRES | SCHOOLS | PARENTS | PRICING | STORIES ▾ | ABOUT US | GET IN TOUCH`.
- Stories dropdown rows and helpers: Case studies "How centres and schools use CognitiveBotics"; FAQs "Quick answers before you book"; Blog "Guides on autism and early support"; Testimonials "Families and professionals, in their words".
- Pricing: Basic is "₹2,000" "/user/month", "Up to 5 users", "5 users: ₹10,000 per month", "Excluding taxes". Custom is "Custom pricing", "For 6 or more users". CTAs: "Book a demo" to `/try-demo?plan=basic`, "Talk to sales" to `/try-demo?plan=custom`.
- Try Demo fields: Name, Email, Phone number (dial code), I am a (Therapist, Parent, Therapy centre admin, School, Other), Centre or school name (only for Therapy centre admin and School), How many users (1, 2, 3, 4, 5, 6 or more). No message field, no captcha, honeypot field. Button "Submit & Book". Consent line "By submitting, you agree we may contact you about your demo."
- Try Demo states: "Demo request received" with helper "Pick a time that suits you." and a "Book later" link; then "Demo booked" or "Request received" with "Our team will get back to you in 2 to 3 business days."
- Analytics events: `demo_submitted`, `demo_booked`, `demo_skipped`.
- FAQ chips: General (home), Therapy centres, Schools, Parents, Pricing. `/faqs` H1 "Frequently asked questions", subline "Answers for parents, therapy centres and schools.", closing panel "Still have a question?" with button "Get in touch".
- Before declaring done: `npm run lint`, `npm test`, `npm run build`.

## Review Focus

Inputs and conditions the spec implies but does not spell out. Each has a pinned test in the task that owns the code.

1. `?plan=` that is upper case, padded, empty, unknown or repeated must never crash. Only the exact strings `basic` and `custom` count (the first one if repeated); anything else preselects nothing. (Task 7 `parsePlan`, Task 8 e2e)
2. `/faqs#unknown-id` must fall back to General, and a hash change after load must switch the tab. (Task 5 `FaqTabs`)
3. A double click on "Submit & Book" must send one request and fire one event. (Task 8 `DemoForm`)
4. A `message` event from another origin, or the same booking event twice, must not mark the demo booked twice. (Task 7 `isScheduledEvent`, Task 8 `Calendly`, `DemoFlow`)
5. Typing a school name and then switching the role to Parent must drop the school name from the request and from validation. (Task 7 `toRequest`, Task 8 `DemoForm`)

---

### Task 0: Branch and baseline

**Files:**
- Modify: `tests/unit/stubs.test.ts`

`npm test` currently has one failing test: `stubs.test.ts` expects `/try-demo` to be a stub route, but it is a real page.

- [ ] **Step 1: Create the branch**

```bash
cd /Users/samarthkumar/CBT/cbt-site
git switch -c nav-pricing-demo-pages
```

- [ ] **Step 2: Confirm the known failure**

Run: `npx vitest run tests/unit/stubs.test.ts`
Expected: FAIL with `expected [...] to include '/try-demo'`

- [ ] **Step 3: Fix the test**

In `tests/unit/stubs.test.ts`, change the first list from
`['/try-demo', '/developmental-checklist', '/privacy-policy',`
to
`['/developmental-checklist', '/privacy-policy',`
and change the second list from
`['/', '/therapy-centres', '/schools', '/parents', '/resources', '/about', '/contact-us', '/careers']`
to
`['/', '/therapy-centres', '/schools', '/parents', '/resources', '/about', '/contact-us', '/careers', '/try-demo', '/pricing', '/faqs']`.

- [ ] **Step 4: Run it**

Run: `npx vitest run tests/unit/stubs.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/unit/stubs.test.ts
git commit -m "test: try-demo is a real page, not a stub" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 1: Launch gates and nav data

**Files:**
- Create: `lib/launch-gates.ts`
- Modify: `components/shared/nav-links.ts`
- Test: `tests/unit/site-nav.test.ts`

**Interfaces:**
- Produces: `LIVE_PAGES`, `LivePages` (from `lib/launch-gates`); `buildPrimaryNav(live?)`, `livePages(live?)`, `isActivePath(pathname, href)`, types `NavItem`, `NavLinkItem`, `NavMenuItem`, `StoriesPage`, const `STORIES_PAGES` (from `components/shared/nav-links`).
- `tools/lib/nav-config.mjs` reads `href: '...'` (single quotes) from `nav-links.ts` by regex. Keep hrefs single-quoted.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/site-nav.test.ts
import { describe, expect, it } from 'vitest';
import { buildPrimaryNav, isActivePath, livePages, STORIES_PAGES } from '@/components/shared/nav-links';
import { LIVE_PAGES } from '@/lib/launch-gates';

const none = { caseStudies: false, faqs: false, blog: false, testimonials: false };
const all = { caseStudies: true, faqs: true, blog: true, testimonials: true };

describe('buildPrimaryNav', () => {
  it('puts Pricing after Parents and keeps About Us and Get in Touch last', () => {
    const labels = buildPrimaryNav(none).map((i) => i.label);
    expect(labels).toEqual(['Therapy Centres', 'Schools', 'Parents', 'Pricing', 'Resources', 'About Us', 'Get in Touch']);
  });

  it('falls back to the Resources link while fewer than two Stories pages are live', () => {
    for (const live of [none, { ...none, faqs: true }, { ...none, blog: true }]) {
      expect(buildPrimaryNav(live)[4]).toEqual({ kind: 'link', label: 'Resources', href: '/resources' });
    }
  });

  it('switches to the Stories menu once two pages are live', () => {
    const item = buildPrimaryNav({ ...none, faqs: true, blog: true })[4];
    expect(item.kind).toBe('menu');
    expect(item.label).toBe('Stories');
    if (item.kind === 'menu') expect(item.pages.map((p) => p.href)).toEqual(['/faqs', '/blog']);
  });

  it('keeps the menu order case studies, FAQs, blog, testimonials', () => {
    const item = buildPrimaryNav(all)[4];
    if (item.kind !== 'menu') throw new Error('expected a menu');
    expect(item.pages.map((p) => p.label)).toEqual(['Case studies', 'FAQs', 'Blog', 'Testimonials']);
  });

  it('ships with only FAQs live', () => {
    expect(LIVE_PAGES).toEqual({ caseStudies: false, faqs: true, blog: false, testimonials: false });
    expect(livePages().map((p) => p.href)).toEqual(['/faqs']);
  });

  it('gives every Stories page a helper line of at most 10 words', () => {
    for (const p of Object.values(STORIES_PAGES)) expect(p.helper.split(' ').length).toBeLessThanOrEqual(10);
  });
});

describe('isActivePath', () => {
  it('matches the exact path and nested paths only', () => {
    expect(isActivePath('/faqs', '/faqs')).toBe(true);
    expect(isActivePath('/blog/some-post', '/blog')).toBe(true);
    expect(isActivePath('/blogger', '/blog')).toBe(false);
    expect(isActivePath('/', '/blog')).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/site-nav.test.ts`
Expected: FAIL (`buildPrimaryNav` is not exported)

- [ ] **Step 3: Create the gates**

```ts
// lib/launch-gates.ts
/**
 * A Stories page is linked from the nav and footer only once it has enough real content
 * (spec 2026-11-03, "Launch gates"): case studies 2, testimonials 6, blog 6 posts with bodies.
 * Flip a flag when its page is ready to be linked.
 */
export const LIVE_PAGES = {
  caseStudies: false,
  faqs: true,
  blog: false,
  testimonials: false,
} as const;

export type LivePages = { readonly [K in keyof typeof LIVE_PAGES]: boolean };
```

- [ ] **Step 4: Rewrite `components/shared/nav-links.ts`**

Keep the legacy `NAV_LINKS` export so `Header.tsx` keeps compiling until Task 9.

```ts
import { LIVE_PAGES, type LivePages } from '@/lib/launch-gates';

export type NavLinkItem = { readonly kind: 'link'; readonly label: string; readonly href: string };
export type StoriesPage = { readonly label: string; readonly href: string; readonly helper: string };
export type NavMenuItem = { readonly kind: 'menu'; readonly label: string; readonly pages: readonly StoriesPage[] };
export type NavItem = NavLinkItem | NavMenuItem;

// Hrefs stay single-quoted: tools/lib/nav-config.mjs reads them from this file.
export const STORIES_PAGES: Record<keyof LivePages, StoriesPage> = {
  caseStudies: { label: 'Case studies', href: '/case-studies', helper: 'How centres and schools use CognitiveBotics' },
  faqs: { label: 'FAQs', href: '/faqs', helper: 'Quick answers before you book' },
  blog: { label: 'Blog', href: '/blog', helper: 'Guides on autism and early support' },
  testimonials: { label: 'Testimonials', href: '/testimonials', helper: 'Families and professionals, in their words' },
};

const STORIES_ORDER: readonly (keyof LivePages)[] = ['caseStudies', 'faqs', 'blog', 'testimonials'];

export function livePages(live: LivePages = LIVE_PAGES): StoriesPage[] {
  return STORIES_ORDER.filter((k) => live[k]).map((k) => STORIES_PAGES[k]);
}

/** Stories needs two live pages to be worth a dropdown; until then the legacy Resources link stays. */
export function buildPrimaryNav(live: LivePages = LIVE_PAGES): NavItem[] {
  const pages = livePages(live);
  const stories: NavItem =
    pages.length >= 2
      ? { kind: 'menu', label: 'Stories', pages }
      : { kind: 'link', label: 'Resources', href: '/resources' };
  return [
    { kind: 'link', label: 'Therapy Centres', href: '/therapy-centres' },
    { kind: 'link', label: 'Schools', href: '/schools' },
    { kind: 'link', label: 'Parents', href: '/parents' },
    { kind: 'link', label: 'Pricing', href: '/pricing' },
    stories,
    { kind: 'link', label: 'About Us', href: '/about' },
    { kind: 'link', label: 'Get in Touch', href: '/contact-us' },
  ];
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

/** Legacy list read by Header.tsx until Task 9 switches it to buildPrimaryNav. */
export const NAV_LINKS = [
  { label: 'Therapy Centres', href: '/therapy-centres' },
  { label: 'Schools', href: '/schools' },
  { label: 'Parents', href: '/parents' },
  { label: 'Resources', href: '/resources' },
  { label: 'About Us', href: '/about' },
  { label: 'Get in Touch', href: '/contact-us' },
] as const;
```

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/unit/site-nav.test.ts tests/unit/nav-config.test.ts tests/unit/header.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/launch-gates.ts components/shared/nav-links.ts tests/unit/site-nav.test.ts
git commit -m "feat: launch gates and nav builder for the Stories menu" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Testimonials data and quote components

**Files:**
- Create: `lib/testimonials.ts`, `components/shared/QuoteCard.tsx`, `components/shared/QuoteRow.tsx`
- Move: `components/pages/home/TestimonialCarousel.tsx` to `components/shared/TestimonialCarousel.tsx`
- Modify: `components/pages/home/sections/Section5.tsx` (import path), `components/pages/home/TestimonialRail.tsx` (use shared data)
- Test: `tests/unit/testimonials.test.ts`, `tests/unit/quote-card.test.tsx`

**Interfaces:**
- Produces: `Testimonial` type, `TESTIMONIALS: readonly Testimonial[]`; `QuoteCard({ quote, clamp? })`; `QuoteRow({ quotes })`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/unit/testimonials.test.ts
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TESTIMONIALS } from '@/lib/testimonials';

describe('TESTIMONIALS', () => {
  it('holds the four quotes shown on the home page, in order', () => {
    expect(TESTIMONIALS.map((t) => t.id)).toEqual(['tejaswi', 'mounila', 'chandrashekhar', 'pavani']);
  });
  it('has unique ids, non-empty text and an avatar file for each', () => {
    expect(new Set(TESTIMONIALS.map((t) => t.id)).size).toBe(TESTIMONIALS.length);
    for (const t of TESTIMONIALS) {
      expect(t.text.length).toBeGreaterThan(40);
      expect(existsSync(`public/images/homepage/avatars/${t.avatar}.webp`), t.avatar).toBe(true);
    }
  });
  it('marks the therapist director as a therapist', () => {
    expect(TESTIMONIALS.find((t) => t.id === 'chandrashekhar')?.audience).toBe('therapist');
  });
});
```

```tsx
// tests/unit/quote-card.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { QuoteCard } from '@/components/shared/QuoteCard';
import { QuoteRow } from '@/components/shared/QuoteRow';
import { TESTIMONIALS } from '@/lib/testimonials';

afterEach(cleanup);

describe('QuoteCard', () => {
  it('shows the quote, name, role and avatar', () => {
    const q = TESTIMONIALS[2];
    const { container } = render(<QuoteCard quote={q} />);
    expect(screen.getByText(q.text)).toBeInTheDocument();
    expect(screen.getByText(q.name)).toBeInTheDocument();
    expect(screen.getByText(q.role)).toBeInTheDocument();
    const img = container.querySelector('img')!;
    expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain('/images/homepage/avatars/chandrashekhar.webp');
    expect(img).toHaveAttribute('alt', '');
  });
  it('clamps the text with CSS only, so the full quote stays in the page', () => {
    const q = TESTIMONIALS[0];
    render(<QuoteCard quote={q} clamp />);
    const block = screen.getByText(q.text);
    expect(block.className).toContain('line-clamp-6');
    expect(block.textContent).toBe(q.text);
  });
});

describe('QuoteRow', () => {
  it('renders one card per quote', () => {
    render(<QuoteRow quotes={TESTIMONIALS.slice(0, 3)} />);
    expect(screen.getAllByRole('figure')).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/unit/testimonials.test.ts tests/unit/quote-card.test.tsx`
Expected: FAIL (modules not found)

- [ ] **Step 3: Create the data (text is verbatim from `TestimonialRail.tsx`)**

```ts
// lib/testimonials.ts
export type Testimonial = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly audience: 'parent' | 'therapist' | 'school';
  /** File name (no extension) in public/images/homepage/avatars. */
  readonly avatar: string;
  /** Colour of the opening quote mark. */
  readonly color: string;
  readonly text: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'tejaswi',
    name: 'Tejaswi Kumar',
    role: 'Parent',
    audience: 'parent',
    avatar: 'tejaswi',
    color: '#a85923',
    text: 'We haven’t seen such a variety of activities in other apps or cartoons. He enjoys them and has even started using the app independently. Over the past two months, he has begun saying his name, answering questions and responding to people.',
  },
  {
    id: 'mounila',
    name: 'Mounila Thustam',
    role: 'Parent',
    audience: 'parent',
    avatar: 'mounila',
    color: '#4ca154',
    text: 'Nyra’s attention span has improved. The app fits well with her ongoing therapies as it gives her extra practice at home, and it has helped us spend more structured and meaningful time together.',
  },
  {
    id: 'chandrashekhar',
    name: 'Dr Chandrashekhar',
    role: 'Therapist Director, Resplice Child Development Center',
    audience: 'therapist',
    avatar: 'chandrashekhar',
    color: '#2d679c',
    text: 'In our therapy center, maintaining continuity was a challenge. CognitiveBotics has helped us address this with engaging, user-friendly activities that support parents, educators and therapists in building children’s independence.',
  },
  {
    id: 'pavani',
    name: 'Pavani',
    role: 'Parent',
    audience: 'parent',
    avatar: 'pavani',
    color: '#a95fb5',
    text: 'CognitiveBotics has been very helpful in continuing my child’s learning at home, especially with pointing and imitation skills. He has also started communicating his needs and I feel the app supports faster learning when used alongside therapy.',
  },
];
```

- [ ] **Step 4: Create the components**

```tsx
// components/shared/QuoteCard.tsx
import Image from 'next/image';
import type { Testimonial } from '@/lib/testimonials';

export function QuoteCard({ quote, clamp = false }: { quote: Testimonial; clamp?: boolean }) {
  return (
    <figure className="m-0 flex h-full w-full flex-col gap-[14px] rounded-[20px] bg-white px-5 pb-[22px] pt-[34px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)] lg:px-6">
      <span
        aria-hidden="true"
        className="block h-[17px] w-[21px] font-heading text-[54px] font-extrabold leading-[17px]"
        style={{ color: quote.color }}
      >
        “
      </span>
      <blockquote className={`m-0 text-[14px] leading-[22px] text-text-default lg:text-[16px] lg:leading-[24px] ${clamp ? 'line-clamp-6' : ''}`}>
        {quote.text}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <Image
          src={`/images/homepage/avatars/${quote.avatar}.webp`}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full ring-1 ring-[#e4ded4]"
        />
        <span className="flex flex-col gap-[2px]">
          <span className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal">{quote.name}</span>
          <span className="text-[14px] leading-[21px] text-[#646871]">{quote.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
```

```tsx
// components/shared/QuoteRow.tsx
import type { Testimonial } from '@/lib/testimonials';
import { QuoteCard } from './QuoteCard';
import { RevealStagger } from './RevealStagger';

// One DOM for every width: a swipe row below lg (native scroll and snap), a three-column grid from lg.
export function QuoteRow({ quotes }: { quotes: readonly Testimonial[] }) {
  return (
    <RevealStagger className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
      {quotes.map((q) => (
        <div key={q.id} className="w-[85%] shrink-0 snap-center lg:w-auto">
          <QuoteCard quote={q} />
        </div>
      ))}
    </RevealStagger>
  );
}
```

- [ ] **Step 5: Move the carousel and point the rail at the shared data**

```bash
git mv components/pages/home/TestimonialCarousel.tsx components/shared/TestimonialCarousel.tsx
```

In `components/pages/home/sections/Section5.tsx` change
`import { TestimonialCarousel } from "../TestimonialCarousel";`
to
`import { TestimonialCarousel } from "@/components/shared/TestimonialCarousel";`.

In `components/pages/home/TestimonialRail.tsx`: delete the whole `const QUOTES = [ ... ];` block (it starts at `const QUOTES = [` near line 12 and ends with `];` just before the `// Slow enough to read along with` comment), add `import { TESTIMONIALS } from "@/lib/testimonials";` with the other imports, and change `QUOTES.map((q) => (` to `TESTIMONIALS.map((q) => (`. The card markup already reads `q.color`, `q.name`, `q.avatar`, `q.role`, `q.text`, so nothing else changes.

- [ ] **Step 6: Run tests and lint**

Run: `npx vitest run && npx eslint components lib`
Expected: all PASS, no lint errors

- [ ] **Step 7: Commit**

```bash
git add -A lib components tests
git commit -m "feat: shared testimonials data, quote card and quote row" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Chips, JsonLd and CtaPanel

**Files:**
- Create: `components/shared/Chips.tsx`, `components/shared/JsonLd.tsx`, `components/shared/CtaPanel.tsx`
- Test: `tests/unit/chips.test.tsx`, `tests/unit/json-ld.test.tsx`, `tests/unit/cta-panel.test.tsx`

**Interfaces:**
- Produces: `Chips({ items, value, onChange, label, idPrefix, className? })` with `ChipItem = { id; label }`. Tab id is `${idPrefix}-tab-${id}`, panel id is `${idPrefix}-panel-${id}`. `JsonLd({ data })`. `CtaPanel({ heading, label, href })`.

- [ ] **Step 1: Write the failing tests**

```tsx
// tests/unit/chips.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Chips } from '@/components/shared/Chips';

afterEach(cleanup);

const ITEMS = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma' },
];

function Harness() {
  const [v, setV] = useState('a');
  return <Chips items={ITEMS} value={v} onChange={setV} label="Topics" idPrefix="t" />;
}

describe('Chips', () => {
  it('renders a tab list with the selected tab marked and wired to its panel', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist', { name: 'Topics' })).toBeInTheDocument();
    const alpha = screen.getByRole('tab', { name: 'Alpha' });
    expect(alpha).toHaveAttribute('aria-selected', 'true');
    expect(alpha).toHaveAttribute('id', 't-tab-a');
    expect(alpha).toHaveAttribute('aria-controls', 't-panel-a');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'false');
  });
  it('selects a chip on click', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('tab', { name: 'Gamma' }));
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveAttribute('aria-selected', 'true');
  });
  it('moves with the arrow keys, wraps, and supports Home and End', async () => {
    render(<Harness />);
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
  });
  it('keeps only the selected tab in the tab order', () => {
    render(<Harness />);
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('tabindex', '-1');
  });
});
```

```tsx
// tests/unit/json-ld.test.tsx
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { JsonLd } from '@/components/shared/JsonLd';

afterEach(cleanup);

describe('JsonLd', () => {
  it('renders the data as an ld+json script', () => {
    const { container } = render(<JsonLd data={{ '@type': 'Thing', name: 'A' }} />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(JSON.parse(script.textContent ?? '')).toEqual({ '@type': 'Thing', name: 'A' });
  });
  it('escapes "<" so a value cannot close the script tag', () => {
    const { container } = render(<JsonLd data={{ name: '</script><b>x' }} />);
    const raw = container.querySelector('script')!.textContent ?? '';
    expect(raw).not.toContain('</script>');
    expect(raw).toContain('\\u003c');
    expect(JSON.parse(raw).name).toBe('</script><b>x');
  });
});
```

```tsx
// tests/unit/cta-panel.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/shared/TextReveal', () => ({
  TextReveal: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

import { CtaPanel } from '@/components/shared/CtaPanel';

afterEach(cleanup);

describe('CtaPanel', () => {
  it('shows the heading and a link to the target', () => {
    render(<CtaPanel heading="Not sure which fits?" label="Book a demo" href="/try-demo" />);
    expect(screen.getByRole('heading', { name: 'Not sure which fits?' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /book a demo/i })).toHaveAttribute('href', '/try-demo');
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/unit/chips.test.tsx tests/unit/json-ld.test.tsx tests/unit/cta-panel.test.tsx`
Expected: FAIL (modules not found)

- [ ] **Step 3: Implement**

```tsx
// components/shared/Chips.tsx
'use client';

import { useRef } from 'react';

export type ChipItem = { readonly id: string; readonly label: string };

type Props = {
  items: readonly ChipItem[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name of the tab list. */
  label: string;
  /** Tab ids are `${idPrefix}-tab-${id}`; the panel for each is `${idPrefix}-panel-${id}`. */
  idPrefix: string;
  className?: string;
};

export function Chips({ items, value, onChange, label, idPrefix, className = '' }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % items.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className={`flex flex-wrap gap-2 lg:gap-3 ${className}`}>
      {items.map((it, i) => {
        const selected = it.id === value;
        return (
          <button
            key={it.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${it.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${it.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(it.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border-[1.5px] border-brand-teal px-5 text-[16px] font-semibold transition-colors ${
              selected ? 'bg-brand-teal text-content-knockout' : 'bg-transparent text-content-brand hover:bg-brand-subtle-bg'
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
```

```tsx
// components/shared/JsonLd.tsx
// Structured data for search engines. "<" is escaped so no value can close the script tag
// (Next.js docs, "How to implement JSON-LD").
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
```

```tsx
// components/shared/CtaPanel.tsx
import { Button } from './Button';
import { TextReveal } from './TextReveal';

// The closing gradient panel used at the bottom of a page.
export function CtaPanel({ heading, label, href }: { heading: string; label: string; href: string }) {
  return (
    <section className="px-5 pb-14 pt-8 lg:px-[84px] lg:pb-[76px] lg:pt-0">
      <div className="mx-auto max-w-[1248px]">
        <div
          className="flex flex-col items-center gap-5 rounded-[24px] px-[22px] py-9 text-center lg:rounded-[32px] lg:py-[52px]"
          style={{ background: 'linear-gradient(90deg, #f6e8f7 0%, #ead3ee 55%, #ddecea 100%)' }}
        >
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[28px] font-semibold leading-[40px] text-brand-teal lg:text-[40px] lg:leading-[48px]">
            {heading}
          </TextReveal>
          <Button href={href} arrow>
            {label}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run tests/unit/chips.test.tsx tests/unit/json-ld.test.tsx tests/unit/cta-panel.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/shared tests/unit
git commit -m "feat: shared Chips tabs, JsonLd and CtaPanel" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Pricing content and structured data

**Files:**
- Create: `components/pages/pricing/content.ts`, `components/pages/pricing/seo.ts`
- Test: `tests/unit/pricing-content.test.ts`

**Interfaces:**
- Produces: `pricingContent`, `pricingFaq: readonly { q: string; a: string }[]` (from `content.ts`); `pricingJsonLd()` (from `seo.ts`). Task 5 imports `pricingFaq`. Task 6 imports `pricingContent`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/pricing-content.test.ts
import { describe, expect, it } from 'vitest';
import { pricingContent as c, pricingFaq } from '@/components/pages/pricing/content';
import { pricingJsonLd } from '@/components/pages/pricing/seo';
import { faq as therapyFaq } from '@/components/pages/therapy-centres/content';

describe('pricingContent', () => {
  it('has the Basic and Custom plans with the spec CTAs', () => {
    const [basic, custom] = c.plans;
    expect(basic).toMatchObject({ id: 'basic', price: '₹2,000', unit: '/user/month', note: 'Up to 5 users', total: '5 users: ₹10,000 per month', taxes: 'Excluding taxes' });
    expect(basic.cta).toEqual({ label: 'Book a demo', href: '/try-demo?plan=basic' });
    expect(custom).toMatchObject({ id: 'custom', price: 'Custom pricing', audience: 'For 6 or more users' });
    expect(custom.cta).toEqual({ label: 'Talk to sales', href: '/try-demo?plan=custom' });
  });
  it('lists 7 Basic and 3 Custom feature rows, each at most 8 words', () => {
    expect(c.plans[0].features).toHaveLength(7);
    expect(c.plans[1].features).toHaveLength(3);
    for (const p of c.plans) for (const f of p.features) expect(f.split(' ').length, f).toBeLessThanOrEqual(8);
  });
  it('uses no em dashes or exclamation marks in any copy', () => {
    const all = JSON.stringify(c) + JSON.stringify(pricingFaq);
    expect(all).not.toMatch(/[—–!]/);
  });
});

describe('pricingFaq', () => {
  it('has four questions and reuses the Therapy Centres answers verbatim', () => {
    expect(pricingFaq).toHaveLength(4);
    for (const q of ['Is there published research behind this?', 'Is CognitiveBotics suitable for NGOs, not just private therapy centres?']) {
      const mine = pricingFaq.find((f) => f.q === q);
      const theirs = therapyFaq.find((f) => f.q === q);
      expect(mine?.a).toBe(theirs?.a);
    }
  });
  it('answers the user-count question as pending and the demo question with the 2 to 3 day promise', () => {
    expect(pricingFaq[0]).toEqual({ q: 'Who counts as a user?', a: 'We’ll confirm the exact count in your demo.' });
    expect(pricingFaq[1].a).toContain('2 to 3 business days');
  });
});

describe('pricingJsonLd', () => {
  it('describes the Basic price in INR', () => {
    const data = pricingJsonLd() as { offers: { price: string; priceCurrency: string } };
    expect(data.offers.price).toBe('2000');
    expect(data.offers.priceCurrency).toBe('INR');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/pricing-content.test.ts`
Expected: FAIL (modules not found)

- [ ] **Step 3: Implement**

```ts
// components/pages/pricing/content.ts
import { faq as therapyFaq } from '../therapy-centres/content';

// Feature rows come from claims already on the Therapy Centres, Schools and Home pages.
// Bloom programme items (1,800+ tasks, social stories, specialist mentoring) are left out on purpose.
export const pricingContent = {
  eyebrow: 'PRICING',
  title: 'One plan for centres and schools',
  subtitle: 'The same price for both.',
  plans: [
    {
      id: 'basic',
      name: 'Basic',
      audience: 'For centres and schools',
      price: '₹2,000',
      unit: '/user/month',
      note: 'Up to 5 users',
      total: '5 users: ₹10,000 per month',
      taxes: 'Excluding taxes',
      features: [
        'Personalised learning plans for each child',
        'AI-guided games that adapt to progress',
        '10 skill areas, 450+ learning objectives',
        'Guided videos for home practice',
        'Progress tracking and outcome reports',
        'One view of your whole caseload',
        'Shared goals for therapists, teachers and parents',
      ],
      cta: { label: 'Book a demo', href: '/try-demo?plan=basic' },
    },
    {
      id: 'custom',
      name: 'Custom',
      audience: 'For 6 or more users',
      price: 'Custom pricing',
      unit: null,
      note: 'Volume pricing for larger teams',
      total: null,
      taxes: null,
      features: ['Everything in Basic', 'Volume pricing for 6 or more users', 'Rollout planned around your team'],
      cta: { label: 'Talk to sales', href: '/try-demo?plan=custom' },
    },
  ],
  testimonialsHeading: 'What our users say',
  faqHeading: 'Frequently asked questions',
  cta: { heading: 'Not sure which fits?', label: 'Book a demo', href: '/try-demo' },
} as const;

function reuse(question: string) {
  const hit = therapyFaq.find((f) => f.q === question);
  if (!hit) throw new Error(`FAQ not found on Therapy Centres: ${question}`);
  return { q: hit.q, a: hit.a };
}

export const pricingFaq: readonly { q: string; a: string }[] = [
  { q: 'Who counts as a user?', a: 'We’ll confirm the exact count in your demo.' },
  {
    q: 'What happens after I book a demo?',
    a: 'You pick a time right after you submit the form. Our team will get back to you in 2 to 3 business days.',
  },
  reuse('Is there published research behind this?'),
  reuse('Is CognitiveBotics suitable for NGOs, not just private therapy centres?'),
];
```

```ts
// components/pages/pricing/seo.ts
export function pricingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CognitiveBotics',
    applicationCategory: 'HealthApplication',
    offers: {
      '@type': 'Offer',
      price: '2000',
      priceCurrency: 'INR',
      description: 'Basic plan, per user per month, up to 5 users. Taxes excluded.',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '2000',
        priceCurrency: 'INR',
        billingDuration: 'P1M',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'user' },
      },
    },
  };
}
```

- [ ] **Step 4: Run it**

Run: `npx vitest run tests/unit/pricing-content.test.ts`
Expected: PASS. If the apostrophe test fails on the `reuse` answers, those use the Therapy Centres text as written. Only the two own questions use the typographic `’`.

- [ ] **Step 5: Commit**

```bash
git add components/pages/pricing tests/unit/pricing-content.test.ts
git commit -m "feat: pricing copy, FAQ and structured data" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: FAQs page

**Files:**
- Create: `lib/faq-sets.ts`, `components/pages/faqs/FaqTabs.tsx`, `components/pages/faqs/FaqsPage.tsx`, `components/pages/faqs/content.ts`, `app/faqs/page.tsx`
- Test: `tests/unit/faq-sets.test.ts`, `tests/unit/faq-tabs.test.tsx`, `tests/e2e/faqs.spec.ts`

**Interfaces:**
- Consumes: `pricingFaq` (Task 4), `Chips` (Task 3), `JsonLd`, `CtaPanel` (Task 3), `FAQ` (existing, `{ items: readonly { q; a }[] }`).
- Produces: `FaqSet = { id; label; items }`, `FAQ_SETS`, `FAQ_LAST_UPDATED`, `faqPageJsonLd(sets?)` (from `lib/faq-sets`); `FaqTabs({ sets })`.

- [ ] **Step 1: Write the failing unit tests**

```ts
// tests/unit/faq-sets.test.ts
import { describe, expect, it } from 'vitest';
import { FAQ_SETS, faqPageJsonLd } from '@/lib/faq-sets';

describe('FAQ_SETS', () => {
  it('has the five chips in order with the expected sizes', () => {
    expect(FAQ_SETS.map((s) => [s.id, s.label, s.items.length])).toEqual([
      ['general', 'General', 6],
      ['therapy-centres', 'Therapy centres', 5],
      ['schools', 'Schools', 9],
      ['parents', 'Parents', 5],
      ['pricing', 'Pricing', 4],
    ]);
  });
  it('gives every question a non-empty answer', () => {
    for (const s of FAQ_SETS) for (const i of s.items) expect(i.a.trim().length, i.q).toBeGreaterThan(0);
  });
});

describe('faqPageJsonLd', () => {
  it('is an FAQPage with one entry per unique question', () => {
    const data = faqPageJsonLd() as { '@type': string; mainEntity: { '@type': string; name: string; acceptedAnswer: { text: string } }[] };
    const unique = new Set(FAQ_SETS.flatMap((s) => s.items.map((i) => i.q)));
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(unique.size);
    expect(new Set(data.mainEntity.map((q) => q.name)).size).toBe(unique.size);
    expect(data.mainEntity[0]['@type']).toBe('Question');
  });
});
```

```tsx
// tests/unit/faq-tabs.test.tsx
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FaqTabs } from '@/components/pages/faqs/FaqTabs';

const SETS = [
  { id: 'general', label: 'General', items: [{ q: 'G1?', a: 'Answer G1' }] },
  { id: 'schools', label: 'Schools', items: [{ q: 'S1?', a: 'Answer S1' }] },
  { id: 'parents', label: 'Parents', items: [{ q: 'P1?', a: 'Answer P1' }] },
];

beforeEach(() => window.history.replaceState(null, '', '/faqs'));
afterEach(cleanup);

const panel = (id: string) => document.getElementById(`faq-panel-${id}`)!;

describe('FaqTabs', () => {
  it('starts on the first set and keeps every panel in the page', () => {
    render(<FaqTabs sets={SETS} />);
    expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-selected', 'true');
    expect(panel('general')).not.toHaveAttribute('hidden');
    expect(panel('schools')).toHaveAttribute('hidden');
    expect(screen.getByText('Answer S1', { exact: false })).toBeInTheDocument();
  });
  it('switches set on click and writes the hash', async () => {
    render(<FaqTabs sets={SETS} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Schools' }));
    expect(panel('schools')).not.toHaveAttribute('hidden');
    expect(panel('general')).toHaveAttribute('hidden');
    expect(window.location.hash).toBe('#schools');
  });
  it('opens the set named in the URL hash', () => {
    window.history.replaceState(null, '', '/faqs#parents');
    render(<FaqTabs sets={SETS} />);
    expect(screen.getByRole('tab', { name: 'Parents' })).toHaveAttribute('aria-selected', 'true');
  });
  it('ignores a hash that names no set', () => {
    window.history.replaceState(null, '', '/faqs#nope');
    render(<FaqTabs sets={SETS} />);
    expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-selected', 'true');
  });
  it('follows a hash change after load', () => {
    render(<FaqTabs sets={SETS} />);
    act(() => {
      window.history.replaceState(null, '', '/faqs#schools');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByRole('tab', { name: 'Schools' })).toHaveAttribute('aria-selected', 'true');
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/unit/faq-sets.test.ts tests/unit/faq-tabs.test.tsx`
Expected: FAIL (modules not found)

- [ ] **Step 3: Implement the data module**

```ts
// lib/faq-sets.ts
import { faq as homeFaq } from '@/components/pages/home/content';
import { faq as parentsFaq } from '@/components/pages/parents/content';
import { pricingFaq } from '@/components/pages/pricing/content';
import { faq as schoolsFaq } from '@/components/pages/schools/content';
import { faq as therapyFaq } from '@/components/pages/therapy-centres/content';

export type FaqSet = {
  readonly id: string;
  readonly label: string;
  readonly items: readonly { readonly q: string; readonly a: string }[];
};

/** Shown at the foot of /faqs. Update when any answer changes. */
export const FAQ_LAST_UPDATED = 'November 2026';

// Each set reads from the same content file as its source page, so one edit updates both.
export const FAQ_SETS: readonly FaqSet[] = [
  { id: 'general', label: 'General', items: homeFaq },
  { id: 'therapy-centres', label: 'Therapy centres', items: therapyFaq },
  { id: 'schools', label: 'Schools', items: schoolsFaq },
  { id: 'parents', label: 'Parents', items: parentsFaq },
  { id: 'pricing', label: 'Pricing', items: pricingFaq },
];

export function faqPageJsonLd(sets: readonly FaqSet[] = FAQ_SETS) {
  const seen = new Set<string>();
  const mainEntity = sets
    .flatMap((s) => s.items)
    .filter((i) => (seen.has(i.q) ? false : (seen.add(i.q), true)))
    .map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } }));
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity };
}
```

- [ ] **Step 4: Implement the tabs and page**

```tsx
// components/pages/faqs/FaqTabs.tsx
'use client';

import { useEffect, useState } from 'react';
import { Chips } from '@/components/shared/Chips';
import { FAQ } from '@/components/shared/FAQ';
import type { FaqSet } from '@/lib/faq-sets';

export function FaqTabs({ sets }: { sets: readonly FaqSet[] }) {
  const [active, setActive] = useState(sets[0].id);

  // The server renders the first set; the hash is applied after mount so the HTML never mismatches.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (sets.some((s) => s.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [sets]);

  const select = (id: string) => {
    setActive(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <Chips items={sets} value={active} onChange={select} label="FAQ topics" idPrefix="faq" />
      {sets.map((s) => (
        // Hidden panels stay in the HTML so crawlers read every answer.
        <div key={s.id} role="tabpanel" id={`faq-panel-${s.id}`} aria-labelledby={`faq-tab-${s.id}`} hidden={s.id !== active}>
          <FAQ items={s.items} />
        </div>
      ))}
    </div>
  );
}
```

```ts
// components/pages/faqs/content.ts
export const faqsContent = {
  title: 'Frequently asked questions',
  subtitle: 'Answers for parents, therapy centres and schools.',
  cta: { heading: 'Still have a question?', label: 'Get in touch', href: '/contact-us' },
} as const;
```

```tsx
// components/pages/faqs/FaqsPage.tsx
import { CtaPanel } from '@/components/shared/CtaPanel';
import { JsonLd } from '@/components/shared/JsonLd';
import { TextReveal } from '@/components/shared/TextReveal';
import { FAQ_LAST_UPDATED, FAQ_SETS, faqPageJsonLd } from '@/lib/faq-sets';
import { faqsContent as c } from './content';
import { FaqTabs } from './FaqTabs';

export function FaqsPage() {
  return (
    <>
      <section
        className="px-5 pb-9 pt-[116px] lg:px-[84px] lg:pb-[72px] lg:pt-[142px]"
        style={{ background: 'linear-gradient(100deg, #e7f1ef 0%, #f3eef5 45%, #fbece9 100%)' }}
      >
        <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-3 lg:gap-4">
          <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[40px] lg:leading-[56px]">
            {c.title}
          </TextReveal>
          <p className="text-[16px] leading-[26px] text-text-default lg:text-[20px] lg:leading-[29px]">{c.subtitle}</p>
        </div>
      </section>
      <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-8">
          <FaqTabs sets={FAQ_SETS} />
          <p className="text-[14px] text-content-secondary">Last updated: {FAQ_LAST_UPDATED}</p>
        </div>
      </section>
      <CtaPanel heading={c.cta.heading} label={c.cta.label} href={c.cta.href} />
      <JsonLd data={faqPageJsonLd()} />
    </>
  );
}
```

```tsx
// app/faqs/page.tsx
import type { Metadata } from 'next';
import { FaqsPage } from '@/components/pages/faqs/FaqsPage';

export const metadata: Metadata = {
  title: 'FAQs | CognitiveBotics',
  description: 'Answers for parents, therapy centres and schools about CognitiveBotics, pricing and getting started.',
};

export default function Page() {
  return <FaqsPage />;
}
```

- [ ] **Step 5: Run the unit tests**

Run: `npx vitest run tests/unit/faq-sets.test.ts tests/unit/faq-tabs.test.tsx`
Expected: PASS. If `faq-sets.test.ts` fails on a count, a source page's `faq` array changed. Fix the expected count, not the data.

- [ ] **Step 6: Write the e2e spec**

```ts
// tests/e2e/faqs.spec.ts
import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('faqs: chips switch the visible set and sync the hash', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/faqs');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frequently asked questions');
  await expect(page.getByRole('tab')).toHaveCount(5);
  await expect(page.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'Schools' }).click();
  await expect(page).toHaveURL(/#schools$/);
  await expect(page.getByRole('button', { name: /What is CognitiveBotics Bloom\?/ })).toBeVisible();
  await expect(page.getByText('Last updated:')).toBeVisible();
});

test('faqs: a deep link opens its set and the page carries FAQPage data', async ({ page }) => {
  await page.goto('/faqs#parents');
  await expect(page.getByRole('tab', { name: 'Parents' })).toHaveAttribute('aria-selected', 'true');
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join('')).toContain('FAQPage');
});

test('faqs: no horizontal overflow at any width', async ({ page }) => {
  for (const w of [375, 768, 1024, 1440]) {
    expect(await overflowAt(page, '/faqs', w), `${w}px`).toBeLessThanOrEqual(0);
  }
});
```

- [ ] **Step 7: Run lint and the e2e spec**

Run: `npx eslint app components lib && npx playwright test tests/e2e/faqs.spec.ts --reporter=line`
Expected: no lint errors; 3 passed (the first run builds the site and takes a few minutes)

- [ ] **Step 8: Commit**

```bash
git add lib components app tests
git commit -m "feat: FAQs page with page-name chips" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Pricing page

**Files:**
- Create: `components/pages/pricing/PricingPage.tsx`, `components/pages/pricing/sections/Section0.tsx` (hero), `Section1.tsx` (plans), `Section2.tsx` (testimonials), `Section3.tsx` (FAQ), `app/pricing/page.tsx`
- Test: `tests/unit/pricing-plans.test.tsx`, `tests/e2e/pricing.spec.ts`

**Interfaces:**
- Consumes: `pricingContent`, `pricingFaq` (Task 4), `pricingJsonLd` (Task 4), `QuoteRow` (Task 2), `TESTIMONIALS`, `CtaPanel`, `JsonLd` (Task 3), `FAQ`, `Button`, `Eyebrow`, `TextReveal`, `RevealStagger`.

- [ ] **Step 1: Write the failing unit test for the plans section**

```tsx
// tests/unit/pricing-plans.test.tsx
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Section1 } from '@/components/pages/pricing/sections/Section1';

afterEach(cleanup);

describe('Pricing plans', () => {
  it('renders Basic and Custom as labelled articles', () => {
    render(<Section1 />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('article', { name: 'Basic' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Custom' })).toBeInTheDocument();
  });
  it('shows the Basic price, user limit, total and tax line', () => {
    render(<Section1 />);
    const basic = within(screen.getByRole('article', { name: 'Basic' }));
    expect(basic.getByText('₹2,000')).toBeInTheDocument();
    expect(basic.getByText('/user/month')).toBeInTheDocument();
    expect(basic.getByText('Up to 5 users')).toBeInTheDocument();
    expect(basic.getByText('5 users: ₹10,000 per month')).toBeInTheDocument();
    expect(basic.getByText('Excluding taxes')).toBeInTheDocument();
    expect(basic.getAllByRole('listitem')).toHaveLength(7);
  });
  it('links each CTA to the demo form with the plan', () => {
    render(<Section1 />);
    expect(screen.getByRole('link', { name: /book a demo/i })).toHaveAttribute('href', '/try-demo?plan=basic');
    expect(screen.getByRole('link', { name: /talk to sales/i })).toHaveAttribute('href', '/try-demo?plan=custom');
  });
  it('does not show a tax line or per-user unit on the Custom plan', () => {
    render(<Section1 />);
    const custom = within(screen.getByRole('article', { name: 'Custom' }));
    expect(custom.queryByText('Excluding taxes')).toBeNull();
    expect(custom.queryByText('/user/month')).toBeNull();
    expect(custom.getAllByRole('listitem')).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/pricing-plans.test.tsx`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement the sections**

```tsx
// components/pages/pricing/sections/Section0.tsx
import { Eyebrow } from '@/components/shared/Eyebrow';
import { TextReveal } from '@/components/shared/TextReveal';
import { pricingContent as c } from '../content';

export function Section0() {
  return (
    <section
      className="px-5 pb-9 pt-[116px] lg:px-[84px] lg:pb-[72px] lg:pt-[142px]"
      style={{ background: 'linear-gradient(100deg, #e7f1ef 0%, #f3eef5 45%, #fbece9 100%)' }}
    >
      <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-3 lg:gap-4">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[40px] lg:leading-[56px]">
          {c.title}
        </TextReveal>
        <p className="text-[16px] leading-[26px] text-text-default lg:text-[20px] lg:leading-[29px]">{c.subtitle}</p>
      </div>
    </section>
  );
}
```

```tsx
// components/pages/pricing/sections/Section1.tsx
import { Button } from '@/components/shared/Button';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { pricingContent as c } from '../content';

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-[2px] shrink-0 text-brand-teal">
      <path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Section1() {
  return (
    <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
      <RevealStagger className="mx-auto grid max-w-[1248px] grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {c.plans.map((p) => (
          <article
            key={p.id}
            aria-labelledby={`plan-${p.id}`}
            className="flex flex-col rounded-[24px] border-[1.5px] border-brand-teal-100 bg-white p-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] lg:p-8"
          >
            <h2 id={`plan-${p.id}`} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[32px] lg:leading-[40px]">
              {p.name}
            </h2>
            <p className="mt-1 text-[16px] leading-[24px] text-text-secondary lg:text-[18px]">{p.audience}</p>
            <div className="mt-6 flex flex-col gap-1">
              <p className="flex items-baseline gap-1 font-heading text-brand-dark">
                <span className={`font-bold ${p.unit ? 'text-[40px] leading-[48px] lg:text-[48px] lg:leading-[56px]' : 'text-[32px] leading-[40px] lg:text-[40px] lg:leading-[48px]'}`}>
                  {p.price}
                </span>
                {p.unit ? <span className="text-[18px] font-semibold text-content-secondary">{p.unit}</span> : null}
              </p>
              <p className="text-[16px] font-semibold leading-[24px] text-content-brand">{p.note}</p>
              {p.total ? <p className="text-[16px] leading-[24px] text-text-secondary">{p.total}</p> : null}
              {p.taxes ? <p className="text-[14px] leading-[22px] text-content-secondary">{p.taxes}</p> : null}
            </div>
            <hr className="my-6 border-border-subtle" />
            <ul className="flex flex-1 flex-col gap-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href={p.cta.href} size="lg" arrow className="w-full">
                {p.cta.label}
              </Button>
            </div>
          </article>
        ))}
      </RevealStagger>
    </section>
  );
}
```

```tsx
// components/pages/pricing/sections/Section2.tsx
import { QuoteRow } from '@/components/shared/QuoteRow';
import { TextReveal } from '@/components/shared/TextReveal';
import { TESTIMONIALS } from '@/lib/testimonials';
import { pricingContent as c } from '../content';

export function Section2() {
  return (
    <section className="bg-brand-subtle-bg px-5 py-12 lg:px-[84px] lg:py-[84px]">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-8 lg:gap-10">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[40px] lg:leading-[48px]">
          {c.testimonialsHeading}
        </TextReveal>
        <QuoteRow quotes={TESTIMONIALS.slice(0, 3)} />
      </div>
    </section>
  );
}
```

```tsx
// components/pages/pricing/sections/Section3.tsx
import { FAQ } from '@/components/shared/FAQ';
import { TextReveal } from '@/components/shared/TextReveal';
import { pricingContent as c, pricingFaq } from '../content';

export function Section3() {
  return (
    <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[40px] lg:leading-[48px]">
          {c.faqHeading}
        </TextReveal>
        <FAQ items={pricingFaq} />
      </div>
    </section>
  );
}
```

```tsx
// components/pages/pricing/PricingPage.tsx
import { CtaPanel } from '@/components/shared/CtaPanel';
import { JsonLd } from '@/components/shared/JsonLd';
import { pricingContent as c } from './content';
import { pricingJsonLd } from './seo';
import { Section0 } from './sections/Section0';
import { Section1 } from './sections/Section1';
import { Section2 } from './sections/Section2';
import { Section3 } from './sections/Section3';

export function PricingPage() {
  return (
    <>
      <Section0 />
      <Section1 />
      <Section2 />
      <Section3 />
      <CtaPanel heading={c.cta.heading} label={c.cta.label} href={c.cta.href} />
      <JsonLd data={pricingJsonLd()} />
    </>
  );
}
```

```tsx
// app/pricing/page.tsx
import type { Metadata } from 'next';
import { PricingPage } from '@/components/pages/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Pricing | CognitiveBotics',
  description: 'One plan for therapy centres and schools: ₹2,000 per user per month for up to 5 users. Custom pricing for larger teams.',
};

export default function Page() {
  return <PricingPage />;
}
```

- [ ] **Step 4: Run the unit test**

Run: `npx vitest run tests/unit/pricing-plans.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the e2e spec**

```ts
// tests/e2e/pricing.spec.ts
import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('pricing: one H1, two plans, structured data in INR', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One plan for centres and schools');
  await expect(page.getByRole('article')).toHaveCount(2);
  await expect(page.getByText('₹2,000')).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join('')).toContain('INR');
});

test('pricing: both CTAs open the demo form with the plan', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await page.getByRole('link', { name: /book a demo/i }).first().click();
  await expect(page).toHaveURL(/\/try-demo\?plan=basic$/);
  await page.goto('/pricing');
  await page.getByRole('link', { name: /talk to sales/i }).click();
  await expect(page).toHaveURL(/\/try-demo\?plan=custom$/);
});

test('pricing: no horizontal overflow at any width', async ({ page }) => {
  for (const w of [375, 768, 1024, 1440]) {
    expect(await overflowAt(page, '/pricing', w), `${w}px`).toBeLessThanOrEqual(0);
  }
});
```

- [ ] **Step 6: Run lint and the e2e spec**

Run: `npx eslint app components lib && npx playwright test tests/e2e/pricing.spec.ts --reporter=line`
Expected: no lint errors. The e2e run fails on the second test until Task 8 builds the demo page, because `/try-demo?plan=basic` still serves the old page (the URL assertion still passes). If all 3 pass, good.

- [ ] **Step 7: Commit**

```bash
git add components app tests
git commit -m "feat: pricing page with Basic and Custom plans" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Try Demo logic (no UI)

**Files:**
- Create: `lib/demo-form.ts`, `lib/demo-flow.ts`, `lib/calendly.ts`, `lib/analytics.ts`, `lib/demo-config.ts`, `lib/demo-submit.ts`, `lib/dial-codes.ts`
- Modify: `components/pages/contact-us/ContactForm.tsx` (move `DIAL_CODES` to the shared file)
- Test: `tests/unit/demo-form.test.ts`, `tests/unit/demo-flow-reducer.test.ts`, `tests/unit/calendly.test.ts`, `tests/unit/analytics.test.ts`

**Interfaces:**
- Consumes: `validateFields`, `Field` from `lib/contact-form`.
- Produces: from `lib/demo-form`: `Plan`, `DemoValues`, `DemoRequest`, `EMPTY_DEMO`, `ROLE_OPTIONS`, `USER_OPTIONS`, `parsePlan(value)`, `initialValues(plan)`, `showsOrganisation(role)`, `validateDemo(values)`, `toRequest(values, dialCode, plan)`, `isSpam(values)`, `usersHelper(plan, users)`. From `lib/demo-flow`: `DemoState`, `DemoEvent`, `INITIAL_DEMO_STATE`, `demoReducer`. From `lib/calendly`: `CALENDLY_ORIGIN`, `isScheduledEvent(e)`, `loadCalendly()`, global `window.Calendly`. From `lib/analytics`: `track(event, params?)`. From `lib/demo-config`: `CALENDLY_URL`. From `lib/demo-submit`: `submitDemoRequest(request)`. From `lib/dial-codes`: `DIAL_CODES`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/unit/demo-form.test.ts
import { describe, expect, it } from 'vitest';
import {
  EMPTY_DEMO,
  initialValues,
  isSpam,
  parsePlan,
  showsOrganisation,
  toRequest,
  usersHelper,
  validateDemo,
  type DemoValues,
} from '@/lib/demo-form';

const valid: DemoValues = { ...EMPTY_DEMO, name: 'Asha Rao', email: 'asha@example.com', phone: '9876543210', role: 'Parent', users: '2' };

describe('parsePlan', () => {
  it('accepts exactly basic and custom', () => {
    expect(parsePlan('basic')).toBe('basic');
    expect(parsePlan('custom')).toBe('custom');
  });
  it('rejects anything else without throwing', () => {
    for (const v of [undefined, null, '', 'BASIC', ' basic', 'pro', 'basic ', [], ['nope']]) {
      expect(parsePlan(v as string | string[] | null | undefined), String(v)).toBeNull();
    }
  });
  it('uses the first value when the parameter is repeated', () => {
    expect(parsePlan(['custom', 'basic'])).toBe('custom');
  });
});

describe('initialValues', () => {
  it('preselects "6 or more" for the custom plan only', () => {
    expect(initialValues('custom').users).toBe('6 or more');
    expect(initialValues('basic').users).toBe('');
    expect(initialValues(null).users).toBe('');
  });
});

describe('showsOrganisation', () => {
  it('is true for centre admins and schools only', () => {
    expect(showsOrganisation('Therapy centre admin')).toBe(true);
    expect(showsOrganisation('School')).toBe(true);
    for (const r of ['Therapist', 'Parent', 'Other', '']) expect(showsOrganisation(r), r).toBe(false);
  });
});

describe('validateDemo', () => {
  it('accepts a complete parent request', () => {
    expect(validateDemo(valid)).toEqual({});
  });
  it('asks for every required field on an empty form, and not for the school name', () => {
    expect(validateDemo(EMPTY_DEMO)).toEqual({
      name: 'Name is required',
      email: 'Email is required',
      phone: 'Phone number is required',
      role: 'Your role is required',
      users: 'Number of users is required',
    });
  });
  it('rejects a bad email and a phone number with too few digits', () => {
    expect(validateDemo({ ...valid, email: 'asha@' }).email).toBe('Enter a valid email address');
    expect(validateDemo({ ...valid, phone: '12 34' }).phone).toBe('Enter a valid phone number');
    expect(validateDemo({ ...valid, phone: '98765 43210' }).phone).toBeUndefined();
  });
  it('checks the school name length only when the role shows that field', () => {
    const long = 'x'.repeat(121);
    expect(validateDemo({ ...valid, role: 'School', organisation: long }).organisation).toBe('Centre or school name must be 120 characters or fewer');
    expect(validateDemo({ ...valid, role: 'Parent', organisation: long }).organisation).toBeUndefined();
  });
});

describe('toRequest', () => {
  it('trims values and joins the dial code and phone', () => {
    const r = toRequest({ ...valid, name: '  Asha Rao ', email: ' asha@example.com ', phone: ' 9876543210 ' }, '+91', 'basic');
    expect(r).toEqual({ name: 'Asha Rao', email: 'asha@example.com', phone: '+91 9876543210', role: 'Parent', organisation: '', users: '2', plan: 'basic' });
  });
  it('drops a school name typed earlier when the role no longer shows that field', () => {
    expect(toRequest({ ...valid, role: 'Parent', organisation: 'Sunrise School' }, '+91', null).organisation).toBe('');
    expect(toRequest({ ...valid, role: 'School', organisation: ' Sunrise School ' }, '+91', null).organisation).toBe('Sunrise School');
  });
});

describe('isSpam', () => {
  it('flags a filled honeypot and ignores whitespace', () => {
    expect(isSpam({ ...valid, website: 'http://spam.example' })).toBe(true);
    expect(isSpam({ ...valid, website: '   ' })).toBe(false);
    expect(isSpam(valid)).toBe(false);
  });
});

describe('usersHelper', () => {
  const confirm = 'We’ll confirm the exact count in your demo.';
  it('always ends with the confirmation line', () => {
    expect(usersHelper(null, '')).toBe(confirm);
  });
  it('shows the Basic price when the Basic plan was chosen', () => {
    expect(usersHelper('basic', '')).toBe(`Basic: up to 5 users, ₹2,000 each. ${confirm}`);
  });
  it('says custom pricing applies for 6 or more, whatever the plan', () => {
    expect(usersHelper('custom', '6 or more')).toBe(`Custom pricing applies. ${confirm}`);
    expect(usersHelper('basic', '6 or more')).toBe(`Custom pricing applies. ${confirm}`);
  });
});
```

```ts
// tests/unit/demo-flow-reducer.test.ts
import { describe, expect, it } from 'vitest';
import { demoReducer, INITIAL_DEMO_STATE } from '@/lib/demo-flow';

describe('demoReducer', () => {
  it('moves to scheduling after submit when booking is available', () => {
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'submitted', canBook: true })).toEqual({ step: 'schedule', booked: false });
  });
  it('goes straight to done when booking is not available', () => {
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'submitted', canBook: false })).toEqual({ step: 'done', booked: false });
  });
  it('finishes as booked or skipped from the scheduling step', () => {
    const schedule = { step: 'schedule', booked: false } as const;
    expect(demoReducer(schedule, { type: 'booked' })).toEqual({ step: 'done', booked: true });
    expect(demoReducer(schedule, { type: 'skipped' })).toEqual({ step: 'done', booked: false });
  });
  it('ignores events that do not fit the current step', () => {
    const done = { step: 'done', booked: true } as const;
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'booked' })).toBe(INITIAL_DEMO_STATE);
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'skipped' })).toBe(INITIAL_DEMO_STATE);
    expect(demoReducer(done, { type: 'skipped' })).toBe(done);
    expect(demoReducer(done, { type: 'submitted', canBook: true })).toBe(done);
    const schedule = { step: 'schedule', booked: false } as const;
    expect(demoReducer(schedule, { type: 'submitted', canBook: true })).toBe(schedule);
  });
});
```

```ts
// tests/unit/calendly.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isScheduledEvent } from '@/lib/calendly';

const SRC = 'https://assets.calendly.com/assets/external/widget.js';

describe('isScheduledEvent', () => {
  it('is true for the booking event from calendly.com', () => {
    expect(isScheduledEvent({ origin: 'https://calendly.com', data: { event: 'calendly.event_scheduled' } })).toBe(true);
  });
  it('ignores the same event from another origin', () => {
    expect(isScheduledEvent({ origin: 'https://evil.example', data: { event: 'calendly.event_scheduled' } })).toBe(false);
    expect(isScheduledEvent({ origin: 'https://calendly.com.evil.example', data: { event: 'calendly.event_scheduled' } })).toBe(false);
  });
  it('ignores other Calendly events and malformed data', () => {
    expect(isScheduledEvent({ origin: 'https://calendly.com', data: { event: 'calendly.date_and_time_selected' } })).toBe(false);
    for (const data of [null, undefined, 'calendly.event_scheduled', 42, {}]) {
      expect(isScheduledEvent({ origin: 'https://calendly.com', data }), String(data)).toBe(false);
    }
  });
});

describe('loadCalendly', () => {
  beforeEach(() => {
    vi.resetModules();
    document.head.innerHTML = '';
    Reflect.deleteProperty(window, 'Calendly');
  });
  it('adds the script once for concurrent calls and resolves on load', async () => {
    const { loadCalendly } = await import('@/lib/calendly');
    const a = loadCalendly();
    const b = loadCalendly();
    const scripts = document.querySelectorAll(`script[src="${SRC}"]`);
    expect(scripts).toHaveLength(1);
    scripts[0].dispatchEvent(new Event('load'));
    await expect(Promise.all([a, b])).resolves.toBeDefined();
  });
  it('rejects, removes the script and lets a later call try again after an error', async () => {
    const { loadCalendly } = await import('@/lib/calendly');
    const first = loadCalendly();
    document.querySelector(`script[src="${SRC}"]`)!.dispatchEvent(new Event('error'));
    await expect(first).rejects.toThrow();
    expect(document.querySelectorAll(`script[src="${SRC}"]`)).toHaveLength(0);
    void loadCalendly();
    expect(document.querySelectorAll(`script[src="${SRC}"]`)).toHaveLength(1);
  });
  it('resolves at once, without a script, when Calendly is already on the page', async () => {
    (window as unknown as { Calendly: unknown }).Calendly = { initInlineWidget() {} };
    const { loadCalendly } = await import('@/lib/calendly');
    await expect(loadCalendly()).resolves.toBeUndefined();
    expect(document.querySelectorAll('script')).toHaveLength(0);
  });
});
```

```ts
// tests/unit/analytics.test.ts
import { afterEach, describe, expect, it } from 'vitest';
import { track } from '@/lib/analytics';

afterEach(() => Reflect.deleteProperty(window, 'dataLayer'));

describe('track', () => {
  it('pushes the event and params to dataLayer when it exists', () => {
    const layer: unknown[] = [];
    (window as unknown as { dataLayer: unknown[] }).dataLayer = layer;
    track('demo_submitted', { plan: 'basic' });
    expect(layer).toEqual([{ event: 'demo_submitted', plan: 'basic' }]);
  });
  it('does nothing, and does not throw, when there is no dataLayer', () => {
    expect(() => track('demo_booked')).not.toThrow();
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/unit/demo-form.test.ts tests/unit/demo-flow-reducer.test.ts tests/unit/calendly.test.ts tests/unit/analytics.test.ts`
Expected: FAIL (modules not found)

- [ ] **Step 3: Implement `lib/demo-form.ts`**

```ts
// lib/demo-form.ts
import { validateFields, type Field } from '@/lib/contact-form';

export const ROLE_OPTIONS = ['Therapist', 'Parent', 'Therapy centre admin', 'School', 'Other'] as const;
export const USER_OPTIONS = ['1', '2', '3', '4', '5', '6 or more'] as const;
const MORE_USERS = '6 or more';
const ORG_ROLES: readonly string[] = ['Therapy centre admin', 'School'];
const CONFIRM = 'We’ll confirm the exact count in your demo.';

export type Plan = 'basic' | 'custom';

export type DemoValues = {
  name: string;
  email: string;
  phone: string;
  role: string;
  organisation: string;
  users: string;
  /** Honeypot: real visitors never see this field, so it stays empty. */
  website: string;
};

export type DemoRequest = {
  name: string;
  email: string;
  phone: string;
  role: string;
  organisation: string;
  users: string;
  plan: Plan | null;
};

export const EMPTY_DEMO: DemoValues = { name: '', email: '', phone: '', role: '', organisation: '', users: '', website: '' };

/** Reads the `plan` query value. Only the exact strings `basic` and `custom` count; a repeated parameter uses its first value. */
export function parsePlan(value: string | string[] | null | undefined): Plan | null {
  const v = Array.isArray(value) ? value[0] : value;
  return v === 'basic' || v === 'custom' ? v : null;
}

export function initialValues(plan: Plan | null): DemoValues {
  return { ...EMPTY_DEMO, users: plan === 'custom' ? MORE_USERS : '' };
}

export function showsOrganisation(role: string): boolean {
  return ORG_ROLES.includes(role);
}

// "Your role" and "Number of users" are the names used in error messages; the visible labels are "I am a" and "How many users".
const FIELDS: Field[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 120 },
  { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 254 },
  { name: 'phone', label: 'Phone number', type: 'tel', required: true, maxLength: 20 },
  { name: 'role', label: 'Your role', type: 'select', required: true },
  { name: 'users', label: 'Number of users', type: 'select', required: true },
];
const ORG_FIELD: Field = { name: 'organisation', label: 'Centre or school name', type: 'text', required: false, maxLength: 120 };

export function validateDemo(values: DemoValues): Record<string, string> {
  const fields = showsOrganisation(values.role) ? [...FIELDS, ORG_FIELD] : FIELDS;
  const errors = validateFields(values, fields);
  if (!errors.phone && values.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone number';
  return errors;
}

export function toRequest(values: DemoValues, dialCode: string, plan: Plan | null): DemoRequest {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: `${dialCode} ${values.phone.trim()}`,
    role: values.role,
    organisation: showsOrganisation(values.role) ? values.organisation.trim() : '',
    users: values.users,
    plan,
  };
}

export function isSpam(values: DemoValues): boolean {
  return values.website.trim() !== '';
}

export function usersHelper(plan: Plan | null, users: string): string {
  if (users === MORE_USERS) return `Custom pricing applies. ${CONFIRM}`;
  if (plan === 'basic') return `Basic: up to 5 users, ₹2,000 each. ${CONFIRM}`;
  return CONFIRM;
}
```

- [ ] **Step 4: Implement the flow, Calendly, analytics, config and submit modules**

```ts
// lib/demo-flow.ts
export type DemoStep = 'details' | 'schedule' | 'done';
export type DemoState = { readonly step: DemoStep; readonly booked: boolean };
export type DemoEvent = { type: 'submitted'; canBook: boolean } | { type: 'booked' } | { type: 'skipped' };

export const INITIAL_DEMO_STATE: DemoState = { step: 'details', booked: false };

// Each event only applies from the step it belongs to, so a repeated or late event changes nothing.
export function demoReducer(state: DemoState, event: DemoEvent): DemoState {
  switch (event.type) {
    case 'submitted':
      return state.step === 'details' ? { step: event.canBook ? 'schedule' : 'done', booked: false } : state;
    case 'booked':
      return state.step === 'schedule' ? { step: 'done', booked: true } : state;
    case 'skipped':
      return state.step === 'schedule' ? { step: 'done', booked: false } : state;
  }
}
```

```ts
// lib/calendly.ts
export const CALENDLY_ORIGIN = 'https://calendly.com';
const SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string; email?: string };
      }): void;
    };
  }
}

/** True only for the "booked" message that Calendly's own origin sends. */
export function isScheduledEvent(e: { origin: string; data: unknown }): boolean {
  if (e.origin !== CALENDLY_ORIGIN) return false;
  const data = e.data;
  return typeof data === 'object' && data !== null && (data as { event?: unknown }).event === 'calendly.event_scheduled';
}

let loading: Promise<void> | null = null;

/** Adds Calendly's widget script once. Called only when the booking step opens, so no other page loads it. */
export function loadCalendly(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loading = null;
        script.remove();
        reject(new Error('Calendly failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}
```

```ts
// lib/analytics.ts
export type DemoEventName = 'demo_submitted' | 'demo_booked' | 'demo_skipped';

/** Pushes to the page's dataLayer if a tag manager has created one; otherwise does nothing. */
export function track(event: DemoEventName, params: Record<string, string> = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer?.push({ event, ...params });
}
```

```ts
// lib/demo-config.ts
/**
 * The Calendly event link for demo bookings (open item 1 in the spec). While it is empty the demo
 * flow skips the booking step and ends on "Request received". Set it before launch.
 */
export const CALENDLY_URL = '' as string;
```

```ts
// lib/demo-submit.ts
import type { DemoRequest } from '@/lib/demo-form';

/**
 * Stub, like the contact form: nothing leaves the browser. Replace the body with a call to the
 * lead endpoint (open item 2 in the spec) and keep the signature so the form does not change.
 */
export async function submitDemoRequest(request: DemoRequest): Promise<void> {
  void request;
  await new Promise((resolve) => setTimeout(resolve, 600));
}
```

- [ ] **Step 5: Move `DIAL_CODES` to a shared file**

Create `lib/dial-codes.ts`:

```ts
// lib/dial-codes.ts
/* Compact replacement for the captured intl-tel-input country list (~244 entries). */
export const DIAL_CODES = [
  { iso: 'IN', name: 'India', code: '+91' },
  { iso: 'US', name: 'United States', code: '+1' },
  { iso: 'GB', name: 'United Kingdom', code: '+44' },
  { iso: 'AE', name: 'United Arab Emirates', code: '+971' },
  { iso: 'SA', name: 'Saudi Arabia', code: '+966' },
  { iso: 'QA', name: 'Qatar', code: '+974' },
  { iso: 'SG', name: 'Singapore', code: '+65' },
  { iso: 'AU', name: 'Australia', code: '+61' },
  { iso: 'CA', name: 'Canada', code: '+1' },
  { iso: 'DE', name: 'Germany', code: '+49' },
] as const;
```

In `components/pages/contact-us/ContactForm.tsx`, delete the `/* Compact replacement ... */ const DIAL_CODES = [ ... ] as const;` block and add `import { DIAL_CODES } from "@/lib/dial-codes";` after the `import { Select } from "./Select";` line. Nothing else in the file changes.

- [ ] **Step 6: Run the tests, type check and lint**

Run: `npx vitest run && npx tsc --noEmit && npx eslint app components lib`
Expected: all PASS (this also covers the contact form tests after the `DIAL_CODES` move)

- [ ] **Step 7: Commit**

```bash
git add lib components tests
git commit -m "feat: demo form rules, flow reducer and Calendly helpers" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Try Demo UI

**Files:**
- Create: `components/pages/try-demo/form-styles.ts`, `DemoForm.tsx`, `Calendly.tsx`, `DemoSchedule.tsx`, `DemoDone.tsx`, `DemoFlow.tsx`
- Rewrite: `components/pages/try-demo/content.ts`, `TryDemoPage.tsx`, `sections/Section0.tsx`, `app/try-demo/page.tsx`
- Delete: `components/pages/try-demo/sections/Section1.tsx`, `Section2.tsx`, `Thumb.tsx`
- Modify: `tests/e2e/motion-homepage.spec.ts` (remove the games-card hover test)
- Test: `tests/unit/demo-helpers.tsx` (helper, not a test), `tests/unit/demo-form-component.test.tsx`, `tests/unit/calendly-component.test.tsx`, `tests/unit/demo-flow.test.tsx`, `tests/unit/demo-flow-nobooking.test.tsx`, `tests/e2e/try-demo.spec.ts`

**Interfaces:**
- Consumes: everything produced in Task 7; `Select` (`components/pages/contact-us/Select`, props `{ id, label, placeholder, options, value, onChange, error? }`); `TestimonialCarousel` (`slides: ReactNode[]`), `QuoteCard`, `TESTIMONIALS`, `LIVE_PAGES`.
- Produces: `DemoForm({ plan, onSubmitted })`, `Calendly({ url, name, email, onBooked, onFailed })`, `DemoSchedule`, `DemoDone`, `DemoFlow({ plan })`, `TryDemoPage({ plan })`.

- [ ] **Step 1: Write the test helper and the failing component tests**

```tsx
// tests/unit/demo-helpers.tsx
import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

export async function pick(user: UserEvent, button: RegExp, option: string) {
  await user.click(screen.getByRole('button', { name: button }));
  await user.click(screen.getByRole('option', { name: option }));
}

/** Fills the always-visible fields. Pass `users: ''` to leave "How many users" empty. */
export async function fillDemoForm(user: UserEvent, opts: { role?: string; users?: string } = {}) {
  await user.type(screen.getByLabelText(/^Name/), 'Asha Rao');
  await user.type(screen.getByLabelText(/^Email/), 'asha@example.com');
  await user.type(screen.getByLabelText(/^Phone number/), '9876543210');
  await pick(user, /^I am a:/, opts.role ?? 'Parent');
  if (opts.users !== '') await pick(user, /^How many users:/, opts.users ?? '3');
}
```

```tsx
// tests/unit/demo-form-component.test.tsx
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fillDemoForm, pick } from './demo-helpers';

vi.mock('@/lib/demo-submit', () => ({ submitDemoRequest: vi.fn() }));

import { DemoForm } from '@/components/pages/try-demo/DemoForm';
import { submitDemoRequest } from '@/lib/demo-submit';

const submit = vi.mocked(submitDemoRequest);
const onSubmitted = vi.fn();
const sendButton = () => screen.getByRole('button', { name: 'Submit & Book' });

beforeEach(() => {
  submit.mockReset();
  submit.mockResolvedValue(undefined);
  onSubmitted.mockReset();
});
afterEach(cleanup);

describe('DemoForm', () => {
  it('shows what is missing and sends nothing when the form is empty', async () => {
    const user = userEvent.setup();
    render(<DemoForm plan={null} onSubmitted={onSubmitted} />);
    await user.click(sendButton());
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Number of users is required')).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
    expect(onSubmitted).not.toHaveBeenCalled();
  });

  it('sends the request with the dial code and plan', async () => {
    const user = userEvent.setup();
    render(<DemoForm plan="basic" onSubmitted={onSubmitted} />);
    await fillDemoForm(user);
    await user.click(sendButton());
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(submit).toHaveBeenCalledWith({ name: 'Asha Rao', email: 'asha@example.com', phone: '+91 9876543210', role: 'Parent', organisation: '', users: '3', plan: 'basic' });
  });

  it('shows the school name field only for school and centre roles, and drops it when the role changes', async () => {
    const user = userEvent.setup();
    render(<DemoForm plan={null} onSubmitted={onSubmitted} />);
    expect(screen.queryByLabelText(/^Centre or school name/)).toBeNull();
    await fillDemoForm(user, { role: 'School' });
    await user.type(screen.getByLabelText(/^Centre or school name/), 'Sunrise School');
    await pick(user, /^I am a:/, 'Parent');
    expect(screen.queryByLabelText(/^Centre or school name/)).toBeNull();
    await user.click(sendButton());
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(onSubmitted.mock.calls[0][0]).toMatchObject({ role: 'Parent', organisation: '' });
  });

  it('sends one request and fires one event on a double click', async () => {
    const user = userEvent.setup();
    let release!: () => void;
    submit.mockReturnValue(new Promise<void>((resolve) => (release = resolve)));
    render(<DemoForm plan={null} onSubmitted={onSubmitted} />);
    await fillDemoForm(user);
    await user.dblClick(sendButton());
    release();
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('treats a filled honeypot as success without sending anything', async () => {
    const user = userEvent.setup();
    const { container } = render(<DemoForm plan={null} onSubmitted={onSubmitted} />);
    await fillDemoForm(user);
    fireEvent.change(container.querySelector('input[name="website"]')!, { target: { value: 'spam' } });
    await user.click(sendButton());
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(submit).not.toHaveBeenCalled();
  });

  it('preselects "6 or more" and says custom pricing applies for the custom plan', () => {
    render(<DemoForm plan="custom" onSubmitted={onSubmitted} />);
    expect(screen.getByRole('button', { name: /^How many users: 6 or more/ })).toBeInTheDocument();
    expect(screen.getByText(/Custom pricing applies/)).toBeInTheDocument();
  });

  it('shows the Basic price line for the Basic plan', () => {
    render(<DemoForm plan="basic" onSubmitted={onSubmitted} />);
    expect(screen.getByText(/Basic: up to 5 users, ₹2,000 each/)).toBeInTheDocument();
  });
});
```

```tsx
// tests/unit/calendly-component.test.tsx
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/calendly', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/lib/calendly')>();
  return { ...real, loadCalendly: vi.fn() };
});

import { Calendly } from '@/components/pages/try-demo/Calendly';
import { loadCalendly } from '@/lib/calendly';

const load = vi.mocked(loadCalendly);
const init = vi.fn();
const URL = 'https://calendly.com/cognitivebotics/demo';
const fromCalendly = (data: unknown, origin = 'https://calendly.com') =>
  window.dispatchEvent(new MessageEvent('message', { origin, data }));

beforeEach(() => {
  init.mockReset();
  load.mockReset();
  load.mockResolvedValue(undefined);
  (window as unknown as { Calendly: unknown }).Calendly = { initInlineWidget: init };
});
afterEach(() => {
  cleanup();
  Reflect.deleteProperty(window, 'Calendly');
});

describe('Calendly', () => {
  it('starts the inline widget with the link and the visitor details', async () => {
    render(<Calendly url={URL} name="Asha" email="asha@example.com" onBooked={vi.fn()} onFailed={vi.fn()} />);
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    expect(init.mock.calls[0][0]).toMatchObject({ url: URL, prefill: { name: 'Asha', email: 'asha@example.com' } });
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
  });

  it('reports a booking from calendly.com', async () => {
    const onBooked = vi.fn();
    render(<Calendly url={URL} name="A" email="a@b.co" onBooked={onBooked} onFailed={vi.fn()} />);
    fromCalendly({ event: 'calendly.event_scheduled' });
    expect(onBooked).toHaveBeenCalledTimes(1);
  });

  it('ignores the booking message from another origin and other Calendly events', () => {
    const onBooked = vi.fn();
    render(<Calendly url={URL} name="A" email="a@b.co" onBooked={onBooked} onFailed={vi.fn()} />);
    fromCalendly({ event: 'calendly.event_scheduled' }, 'https://evil.example');
    fromCalendly({ event: 'calendly.page_height' });
    fromCalendly('calendly.event_scheduled');
    expect(onBooked).not.toHaveBeenCalled();
  });

  it('reports a failed load', async () => {
    load.mockRejectedValue(new Error('blocked'));
    const onFailed = vi.fn();
    render(<Calendly url={URL} name="A" email="a@b.co" onBooked={vi.fn()} onFailed={onFailed} />);
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));
  });
});
```

```tsx
// tests/unit/demo-flow.test.tsx
import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fillDemoForm } from './demo-helpers';

const h = vi.hoisted(() => ({ onBooked: () => {}, onFailed: () => {} }));
const gates = vi.hoisted(() => ({ LIVE_PAGES: { caseStudies: false } }));

vi.mock('@/lib/demo-config', () => ({ CALENDLY_URL: 'https://calendly.com/test/demo' }));
vi.mock('@/lib/demo-submit', () => ({ submitDemoRequest: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));
vi.mock('@/lib/launch-gates', () => gates);
vi.mock('@/components/pages/try-demo/Calendly', () => ({
  Calendly: ({ onBooked, onFailed }: { onBooked: () => void; onFailed: () => void }) => {
    h.onBooked = onBooked;
    h.onFailed = onFailed;
    return <p>calendar</p>;
  },
}));

import { DemoFlow } from '@/components/pages/try-demo/DemoFlow';
import { track } from '@/lib/analytics';

const tracked = (name: string) => vi.mocked(track).mock.calls.filter(([e]) => e === name);

async function reachSchedule(plan: 'basic' | 'custom' | null = null) {
  const user = userEvent.setup();
  render(<DemoFlow plan={plan} />);
  await fillDemoForm(user);
  await user.click(screen.getByRole('button', { name: 'Submit & Book' }));
  await screen.findByRole('heading', { name: 'Demo request received' });
  return user;
}

beforeEach(() => {
  vi.mocked(track).mockClear();
  gates.LIVE_PAGES.caseStudies = false;
});
afterEach(cleanup);

describe('DemoFlow', () => {
  it('moves from the form to the booking step, focuses its heading and tracks the submit', async () => {
    await reachSchedule('basic');
    expect(screen.getByRole('heading', { name: 'Demo request received' })).toHaveFocus();
    expect(screen.getByText('Pick a time that suits you.')).toBeInTheDocument();
    expect(screen.getByText('calendar')).toBeInTheDocument();
    expect(track).toHaveBeenCalledWith('demo_submitted', { plan: 'basic' });
    const steps = within(screen.getByRole('list', { name: 'Progress' })).getAllByRole('listitem');
    expect(steps).toHaveLength(3);
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
  });

  it('shows "Demo booked" once when the booking message arrives twice', async () => {
    await reachSchedule();
    act(() => {
      h.onBooked();
      h.onBooked();
    });
    expect(await screen.findByRole('heading', { name: 'Demo booked' })).toBeInTheDocument();
    expect(screen.getByText('Our team will get back to you in 2 to 3 business days.')).toBeInTheDocument();
    expect(tracked('demo_booked')).toHaveLength(1);
    expect(tracked('demo_skipped')).toHaveLength(0);
  });

  it('ends on "Request received" when the visitor chooses Book later', async () => {
    const user = await reachSchedule();
    await user.click(screen.getByRole('button', { name: 'Book later' }));
    expect(await screen.findByRole('heading', { name: 'Request received' })).toBeInTheDocument();
    expect(tracked('demo_skipped')).toHaveLength(1);
  });

  it('treats a failed Calendly load like Book later', async () => {
    await reachSchedule();
    act(() => h.onFailed());
    expect(await screen.findByRole('heading', { name: 'Request received' })).toBeInTheDocument();
  });

  it('sends the visitor home while case studies are not live, and to them once they are', async () => {
    await reachSchedule();
    act(() => h.onBooked());
    expect(await screen.findByRole('link', { name: 'Back to homepage' })).toHaveAttribute('href', '/');
    cleanup();
    gates.LIVE_PAGES.caseStudies = true;
    await reachSchedule();
    act(() => h.onBooked());
    expect(await screen.findByRole('link', { name: 'Read case studies' })).toHaveAttribute('href', '/case-studies');
  });
});
```

```tsx
// tests/unit/demo-flow-nobooking.test.tsx
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fillDemoForm } from './demo-helpers';

vi.mock('@/lib/demo-config', () => ({ CALENDLY_URL: '' }));
vi.mock('@/lib/demo-submit', () => ({ submitDemoRequest: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));

import { DemoFlow } from '@/components/pages/try-demo/DemoFlow';

afterEach(cleanup);

describe('DemoFlow without a Calendly link', () => {
  it('skips the booking step and ends on "Request received"', async () => {
    const user = userEvent.setup();
    render(<DemoFlow plan={null} />);
    expect(within(screen.getByRole('list', { name: 'Progress' })).getAllByRole('listitem')).toHaveLength(2);
    await fillDemoForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit & Book' }));
    expect(await screen.findByRole('heading', { name: 'Request received' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Demo request received' })).toBeNull();
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/unit/demo-form-component.test.tsx tests/unit/calendly-component.test.tsx tests/unit/demo-flow.test.tsx tests/unit/demo-flow-nobooking.test.tsx`
Expected: FAIL (components not found)

- [ ] **Step 3: Write the copy and shared styles**

```ts
// components/pages/try-demo/content.ts
export const tryDemoContent = {
  title: 'See CognitiveBotics in action',
  subtitle: 'Tell us about your team, then pick a time for your demo.',
  trust: ['NIEPID validated', 'JMIR-published outcomes', 'ISO 27001 certified'],
  submit: 'Submit & Book',
  consent: 'By submitting, you agree we may contact you about your demo.',
  schedule: { title: 'Demo request received', helper: 'Pick a time that suits you.', later: 'Book later' },
  done: { booked: 'Demo booked', received: 'Request received', line: 'Our team will get back to you in 2 to 3 business days.' },
} as const;
```

```ts
// components/pages/try-demo/form-styles.ts
// Same look as the contact form's private LABEL and CONTROL classes.
export const LABEL = 'mb-1 flex items-start gap-[2px] font-heading text-[16px] font-bold text-brand-teal';
export const CONTROL =
  'min-h-[48px] w-full scroll-mt-[96px] rounded-[8px] border bg-brand-subtle-bg px-3 py-2 text-[16px] text-text-secondary shadow-[0px_1px_1px_0px_rgba(10,13,18,0.05)] placeholder:text-[#9ca3af] focus:border-brand-teal focus:outline-none';
```

- [ ] **Step 4: Implement the form**

```tsx
// components/pages/try-demo/DemoForm.tsx
'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { Select } from '@/components/pages/contact-us/Select';
import { useGuardedSubmit } from '@/lib/contact-form';
import { DIAL_CODES } from '@/lib/dial-codes';
import {
  initialValues,
  isSpam,
  ROLE_OPTIONS,
  showsOrganisation,
  toRequest,
  USER_OPTIONS,
  usersHelper,
  validateDemo,
  type DemoRequest,
  type DemoValues,
  type Plan,
} from '@/lib/demo-form';
import { submitDemoRequest } from '@/lib/demo-submit';
import { tryDemoContent as c } from './content';
import { CONTROL, LABEL } from './form-styles';

type Props = { plan: Plan | null; onSubmitted: (request: DemoRequest) => void };

function Star() {
  return <span className="text-[14px] font-medium text-[#207d82]">*</span>;
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={`${id}-error`} role="alert" className="mt-1 text-[14px] text-error">
      {message}
    </p>
  ) : null;
}

export function DemoForm({ plan, onSubmitted }: Props) {
  const [values, setValues] = useState<DemoValues>(() => initialValues(plan));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dial, setDial] = useState<string>(DIAL_CODES[0].iso);

  const send = useCallback(async (request: DemoRequest | null) => {
    // A filled honeypot is a bot: behave as if it worked, but send nothing.
    if (request) await submitDemoRequest(request);
  }, []);
  const { submitting, run } = useGuardedSubmit(send);

  const set = (name: keyof DemoValues) => (value: string) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'role' && !showsOrganisation(value)) next.organisation = '';
      return next;
    });
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const field = (name: keyof DemoValues) => ({
    id: name,
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(name)(e.target.value),
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `${CONTROL} ${errors[name] ? 'border-error' : 'border-brand-teal-100'}`,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateDemo(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const code = DIAL_CODES.find((d) => d.iso === dial)?.code ?? DIAL_CODES[0].code;
    const request = toRequest(values, code, plan);
    const ok = await run(isSpam(values) ? null : request);
    if (ok) onSubmitted(request);
  };

  return (
    <form className="relative flex flex-col gap-[18px] lg:gap-6" noValidate onSubmit={onSubmit}>
      <div className="flex flex-col gap-[18px] sm:flex-row sm:gap-5">
        <div className="flex flex-1 flex-col">
          <label htmlFor="name" className={LABEL}>
            Name
            <Star />
          </label>
          <input type="text" autoComplete="name" enterKeyHint="next" {...field('name')} />
          <ErrorText id="name" message={errors.name} />
        </div>
        <div className="flex flex-1 flex-col">
          <label htmlFor="email" className={LABEL}>
            Email
            <Star />
          </label>
          <input type="email" autoComplete="email" inputMode="email" enterKeyHint="next" {...field('email')} />
          <ErrorText id="email" message={errors.email} />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="phone" className={LABEL}>
          Phone number
          <Star />
        </label>
        <div className="flex gap-2">
          <select
            aria-label="Country code"
            value={dial}
            onChange={(e) => setDial(e.target.value)}
            className={`${CONTROL} w-[112px] shrink-0 border-brand-teal-100`}
          >
            {DIAL_CODES.map((d) => (
              <option key={d.iso} value={d.iso}>
                {d.iso} {d.code}
              </option>
            ))}
          </select>
          <input type="tel" autoComplete="tel-national" inputMode="tel" enterKeyHint="next" {...field('phone')} />
        </div>
        <ErrorText id="phone" message={errors.phone} />
      </div>

      <div className="flex flex-col">
        <label htmlFor="role" className={LABEL}>
          I am a
          <Star />
        </label>
        <Select id="role" label="I am a" placeholder="Choose one" options={ROLE_OPTIONS} value={values.role} onChange={set('role')} error={errors.role} />
      </div>

      {showsOrganisation(values.role) ? (
        <div className="flex flex-col">
          <label htmlFor="organisation" className={LABEL}>
            Centre or school name
          </label>
          <input type="text" autoComplete="organization" enterKeyHint="next" {...field('organisation')} />
          <ErrorText id="organisation" message={errors.organisation} />
        </div>
      ) : null}

      <div className="flex flex-col">
        <label htmlFor="users" className={LABEL}>
          How many users
          <Star />
        </label>
        <Select id="users" label="How many users" placeholder="Choose one" options={USER_OPTIONS} value={values.users} onChange={set('users')} error={errors.users} />
        <p className="mt-2 text-[14px] leading-[22px] text-content-secondary">{usersHelper(plan, values.users)}</p>
      </div>

      {/* Honeypot: off-screen and out of the tab order. Real visitors never fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website')(e.target.value)} />
        </label>
      </div>

      <p className="text-[14px] leading-[22px] text-content-secondary">
        {c.consent}{' '}
        <Link href="/privacy-policy" className="font-semibold text-content-brand underline underline-offset-2">
          Privacy policy
        </Link>
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full cursor-pointer items-center justify-center gap-[10px] rounded-full bg-brand-teal py-4 text-[18px] font-semibold text-content-knockout transition-colors hover:bg-[#0f4548] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand-teal"
      >
        {c.submit}
      </button>
    </form>
  );
}
```

- [ ] **Step 5: Implement Calendly, the schedule and done states, and the flow**

```tsx
// components/pages/try-demo/Calendly.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { isScheduledEvent, loadCalendly } from '@/lib/calendly';

type Props = { url: string; name: string; email: string; onBooked: () => void; onFailed: () => void };

export function Calendly({ url, name, email, onBooked, onFailed }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (isScheduledEvent(e)) onBooked();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onBooked]);

  useEffect(() => {
    let cancelled = false;
    loadCalendly()
      .then(() => {
        if (cancelled || !host.current || !window.Calendly) return;
        window.Calendly.initInlineWidget({ url, parentElement: host.current, prefill: { name, email } });
        host.current.querySelector('iframe')?.setAttribute('title', 'Pick a time for your demo');
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) onFailed();
      });
    return () => {
      cancelled = true;
    };
    // name and email only prefill the widget. Re-running on a change would reload it mid-booking.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div className="relative min-h-[660px] w-full">
      {ready ? null : (
        <p role="status" className="absolute inset-0 flex items-center justify-center text-[16px] text-content-secondary">
          Loading available times
        </p>
      )}
      <div ref={host} className="h-[660px] w-full" />
    </div>
  );
}
```

```tsx
// components/pages/try-demo/DemoSchedule.tsx
import type { RefObject } from 'react';
import { Calendly } from './Calendly';
import { tryDemoContent as c } from './content';

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  url: string;
  name: string;
  email: string;
  onBooked: () => void;
  onSkipped: () => void;
};

export function DemoSchedule({ headingRef, url, name, email, onBooked, onSkipped }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 ref={headingRef} tabIndex={-1} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none lg:text-[32px] lg:leading-[40px]">
          {c.schedule.title}
        </h2>
        <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">{c.schedule.helper}</p>
      </div>
      <Calendly url={url} name={name} email={email} onBooked={onBooked} onFailed={onSkipped} />
      <button
        type="button"
        onClick={onSkipped}
        className="min-h-[44px] self-start text-[16px] font-semibold text-content-brand underline-offset-4 hover:underline focus-visible:underline"
      >
        {c.schedule.later}
      </button>
    </div>
  );
}
```

```tsx
// components/pages/try-demo/DemoDone.tsx
import type { RefObject } from 'react';
import { Button } from '@/components/shared/Button';
import { LIVE_PAGES } from '@/lib/launch-gates';
import { tryDemoContent as c } from './content';

type Props = { headingRef: RefObject<HTMLHeadingElement | null>; booked: boolean };

export function DemoDone({ headingRef, booked }: Props) {
  // Case studies are linked only once that page is live; until then the visitor goes home.
  const next = LIVE_PAGES.caseStudies ? { label: 'Read case studies', href: '/case-studies' } : { label: 'Back to homepage', href: '/' };
  return (
    <div role="status" className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-3 lg:gap-4">
        <h2 ref={headingRef} tabIndex={-1} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none lg:text-[32px] lg:leading-[40px]">
          {booked ? c.done.booked : c.done.received}
        </h2>
        <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">{c.done.line}</p>
      </div>
      <Button href={next.href} className="w-full">
        {next.label}
      </Button>
    </div>
  );
}
```

```tsx
// components/pages/try-demo/DemoFlow.tsx
'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { CALENDLY_URL } from '@/lib/demo-config';
import { demoReducer, INITIAL_DEMO_STATE } from '@/lib/demo-flow';
import type { DemoRequest, Plan } from '@/lib/demo-form';
import { DemoDone } from './DemoDone';
import { DemoForm } from './DemoForm';
import { DemoSchedule } from './DemoSchedule';

const STEPS_WITH_BOOKING = ['Your details', 'Pick a time', 'Done'] as const;
const STEPS_WITHOUT_BOOKING = ['Your details', 'Done'] as const;

function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <ol aria-label="Progress" className="flex items-center gap-3 text-[14px] font-semibold">
      {steps.map((label, i) => (
        <li key={label} aria-current={i === current ? 'step' : undefined} className="flex items-center gap-3">
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[14px] ${
              i <= current ? 'bg-brand-teal text-content-knockout' : 'bg-brand-subtle-bg text-content-secondary'
            }`}
          >
            {i + 1}
          </span>
          <span className={`${i === current ? 'text-brand-teal' : 'hidden text-content-secondary sm:inline'}`}>{label}</span>
          {i < steps.length - 1 ? <span aria-hidden="true" className="h-px w-6 bg-brand-teal/28 lg:w-10" /> : null}
        </li>
      ))}
    </ol>
  );
}

export function DemoFlow({ plan }: { plan: Plan | null }) {
  const canBook = CALENDLY_URL !== '';
  const [state, dispatch] = useReducer(demoReducer, INITIAL_DEMO_STATE);
  const [request, setRequest] = useState<DemoRequest | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Calendly can send the booking message more than once. Only the first outcome counts.
  const settled = useRef(false);

  // After the form, move focus to the new heading so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (state.step !== 'details') headingRef.current?.focus();
  }, [state.step]);

  const onSubmitted = useCallback(
    (req: DemoRequest) => {
      track('demo_submitted', { plan: req.plan ?? 'none' });
      setRequest(req);
      dispatch({ type: 'submitted', canBook });
    },
    [canBook],
  );
  const onBooked = useCallback(() => {
    if (settled.current) return;
    settled.current = true;
    track('demo_booked');
    dispatch({ type: 'booked' });
  }, []);
  const onSkipped = useCallback(() => {
    if (settled.current) return;
    settled.current = true;
    track('demo_skipped');
    dispatch({ type: 'skipped' });
  }, []);

  const steps = canBook ? STEPS_WITH_BOOKING : STEPS_WITHOUT_BOOKING;
  const current = state.step === 'details' ? 0 : state.step === 'schedule' ? 1 : steps.length - 1;

  return (
    <div className="flex flex-col gap-6 rounded-[24px] border-[1.5px] border-border-subtle bg-white px-5 py-6 shadow-[0px_6px_18px_0px_rgba(15,48,48,0.06)] lg:gap-8 lg:px-8 lg:py-9">
      <Stepper steps={steps} current={current} />
      {state.step === 'details' ? <DemoForm plan={plan} onSubmitted={onSubmitted} /> : null}
      {state.step === 'schedule' && request ? (
        <DemoSchedule headingRef={headingRef} url={CALENDLY_URL} name={request.name} email={request.email} onBooked={onBooked} onSkipped={onSkipped} />
      ) : null}
      {state.step === 'done' ? <DemoDone headingRef={headingRef} booked={state.booked} /> : null}
    </div>
  );
}
```

- [ ] **Step 6: Run the component tests**

Run: `npx vitest run tests/unit/demo-form-component.test.tsx tests/unit/calendly-component.test.tsx tests/unit/demo-flow.test.tsx tests/unit/demo-flow-nobooking.test.tsx`
Expected: PASS. If a `getByLabelText(/^Name/)` query matches more than one element, check that no other label starts with "Name".

- [ ] **Step 7: Replace the page**

```bash
git rm components/pages/try-demo/sections/Section1.tsx components/pages/try-demo/sections/Section2.tsx components/pages/try-demo/sections/Thumb.tsx
```

```tsx
// components/pages/try-demo/sections/Section0.tsx
import { QuoteCard } from '@/components/shared/QuoteCard';
import { TestimonialCarousel } from '@/components/shared/TestimonialCarousel';
import { TextReveal } from '@/components/shared/TextReveal';
import type { Plan } from '@/lib/demo-form';
import { TESTIMONIALS } from '@/lib/testimonials';
import { tryDemoContent as c } from '../content';
import { DemoFlow } from '../DemoFlow';

// Mobile order: headline, form card, proof. From lg the headline and proof sit in the left column beside the card.
export function Section0({ plan }: { plan: Plan | null }) {
  const quotes = TESTIMONIALS.slice(0, 3);
  return (
    <section
      className="px-5 pb-12 pt-[116px] lg:px-[84px] lg:pb-[84px] lg:pt-[142px]"
      style={{ background: 'linear-gradient(100deg, #e7f1ef 0%, #f3eef5 45%, #fbece9 100%)' }}
    >
      <div className="mx-auto grid max-w-[1248px] grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
        <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:row-start-1 lg:gap-4">
          <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[40px] lg:leading-[56px]">
            {c.title}
          </TextReveal>
          <p className="text-[16px] leading-[26px] text-text-default lg:text-[20px] lg:leading-[29px]">{c.subtitle}</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <DemoFlow plan={plan} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5 lg:row-start-2">
          <TestimonialCarousel slides={quotes.map((q) => <QuoteCard key={q.id} quote={q} clamp />)} />
          <ul aria-label="Credentials" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-semibold text-content-brand">
            {c.trust.map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
```

```tsx
// components/pages/try-demo/TryDemoPage.tsx
import type { Plan } from '@/lib/demo-form';
import { Section0 } from './sections/Section0';

export function TryDemoPage({ plan }: { plan: Plan | null }) {
  return <Section0 plan={plan} />;
}
```

```tsx
// app/try-demo/page.tsx
import type { Metadata } from 'next';
import { TryDemoPage } from '@/components/pages/try-demo/TryDemoPage';
import { parsePlan } from '@/lib/demo-form';

export const metadata: Metadata = {
  title: 'Book a demo | CognitiveBotics',
  description: 'Tell us about your team and pick a time for your CognitiveBotics demo.',
};

// `plan` comes from the pricing CTAs (?plan=basic or ?plan=custom). Reading searchParams makes this route render per request.
export default async function Page({ searchParams }: { searchParams: Promise<{ plan?: string | string[] }> }) {
  const { plan } = await searchParams;
  return <TryDemoPage plan={parsePlan(plan)} />;
}
```

- [ ] **Step 8: Update the e2e tests**

In `tests/e2e/motion-homepage.spec.ts`, delete the whole test that starts `test('try demo cards look like previews: hover changes nothing', async ({ page }) => {` and ends at its closing `});` (about 14 lines). The games cards no longer exist.

Replace the contents of `tests/e2e/try-demo.spec.ts`:

```ts
// tests/e2e/try-demo.spec.ts
import { expect, test, type Page } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

async function pick(page: Page, button: RegExp, option: string) {
  await page.getByRole('button', { name: button }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

async function fill(page: Page) {
  await page.getByLabel(/^Name/).fill('Asha Rao');
  await page.getByLabel(/^Email/).fill('asha@example.com');
  await page.getByLabel(/^Phone number/).fill('9876543210');
  await pick(page, /^I am a:/, 'Parent');
  await pick(page, /^How many users:/, '3');
}

test('try-demo: headline, form and testimonials', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/try-demo');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('See CognitiveBotics in action');
  await expect(page.getByRole('button', { name: 'Submit & Book' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Testimonials' })).toBeVisible();
  await expect(page.getByText('ISO 27001 certified')).toBeVisible();
});

test('try-demo: ?plan=custom preselects 6 or more, a bad plan preselects nothing', async ({ page }) => {
  await page.goto('/try-demo?plan=custom');
  await expect(page.getByRole('button', { name: /^How many users: 6 or more/ })).toBeVisible();
  await page.goto('/try-demo?plan=%20bad');
  await expect(page.getByRole('button', { name: /^How many users: Choose one/ })).toBeVisible();
  await page.goto('/try-demo?plan=basic');
  await expect(page.getByText(/Basic: up to 5 users, ₹2,000 each/)).toBeVisible();
});

test('try-demo: required fields block the submit', async ({ page }) => {
  await page.goto('/try-demo');
  await page.getByRole('button', { name: 'Submit & Book' }).click();
  await expect(page.getByText('Name is required')).toBeVisible();
  await expect(page.getByRole('heading', { name: /request received/i })).toHaveCount(0);
});

test('try-demo: the school name field appears for School only', async ({ page }) => {
  await page.goto('/try-demo');
  await expect(page.getByLabel(/^Centre or school name/)).toHaveCount(0);
  await pick(page, /^I am a:/, 'School');
  await expect(page.getByLabel(/^Centre or school name/)).toBeVisible();
  await pick(page, /^I am a:/, 'Parent');
  await expect(page.getByLabel(/^Centre or school name/)).toHaveCount(0);
});

test('try-demo: submitting moves to the request-received step', async ({ page }) => {
  await page.goto('/try-demo');
  await fill(page);
  await page.getByRole('button', { name: 'Submit & Book' }).click();
  // "Demo request received" with a Calendly link configured, "Request received" without one.
  await expect(page.getByRole('heading', { name: /request received/i })).toBeFocused();
});

test('try-demo: no horizontal overflow at any width', async ({ page }) => {
  for (const w of [375, 768, 1024, 1440]) {
    expect(await overflowAt(page, '/try-demo', w), `${w}px`).toBeLessThanOrEqual(0);
  }
});
```

- [ ] **Step 9: Run lint, type check and the e2e specs**

Run: `npx eslint app components lib && npx tsc --noEmit && npx playwright test tests/e2e/try-demo.spec.ts tests/e2e/pricing.spec.ts tests/e2e/motion-homepage.spec.ts --reporter=line`
Expected: no lint or type errors; all e2e tests pass. If a Next build error mentions `useSearchParams` or prerendering, the cause is a client component reading search params; this plan reads them in the server page, so check the page file against Step 7.

- [ ] **Step 10: Commit**

```bash
git add -A components app lib tests
git commit -m "feat: rebuild Try Demo as form, Calendly booking and confirmation" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Nav dropdown, Pricing link and footer

**Files:**
- Create: `components/shared/NavMenu.tsx`
- Modify: `components/shared/Header.tsx`, `components/shared/Footer.tsx`, `components/shared/nav-links.ts` (remove the legacy export)
- Test: `tests/unit/header.test.tsx` (update), `tests/unit/header-stories.test.tsx` (new), `tests/unit/footer.test.tsx` (add), `tests/e2e/nav.spec.ts` (new), `tests/e2e/integration.spec.ts` and `tests/e2e/mobile.spec.ts` (update)

**Interfaces:**
- Consumes: `buildPrimaryNav`, `livePages`, `isActivePath`, `NavItem`, `NavMenuItem` (Task 1), `LIVE_PAGES`.
- Produces: `NavMenu({ item, pathname })`, `MobileNavMenu({ item, pathname, onNavigate })`.

- [ ] **Step 1: Update and add the failing tests**

In `tests/unit/header.test.tsx`, replace the first test (`renders the six nav links in order with the right hrefs`) with:

```tsx
  it('renders the seven nav links in order with the right hrefs', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const links = Array.from(nav.querySelectorAll('a')).map((a) => [a.textContent, a.getAttribute('href')]);
    expect(links).toEqual([
      ['Therapy Centres', '/therapy-centres'],
      ['Schools', '/schools'],
      ['Parents', '/parents'],
      ['Pricing', '/pricing'],
      ['Resources', '/resources'],
      ['About Us', '/about'],
      ['Get in Touch', '/contact-us'],
    ]);
  });
```

Create `tests/unit/header-stories.test.tsx`:

```tsx
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/launch-gates', () => ({
  LIVE_PAGES: { caseStudies: true, faqs: true, blog: true, testimonials: true },
}));
vi.mock('@/components/shared/nav-config.generated', () => ({
  SIGN_IN_ITEMS: [],
  DRAWER_LINKS: [],
  HEADER_SCROLLED_BG: 'rgba(255, 255, 255, 0.8)',
  HEADER_BG_IMAGE: 'none',
}));
const pathnameMock = vi.hoisted(() => ({ value: '/' as string | null }));
vi.mock('next/navigation', () => ({ usePathname: () => pathnameMock.value }));

import { Header } from '@/components/shared/Header';

beforeEach(() => {
  pathnameMock.value = '/';
  document.body.style.overflow = '';
});
afterEach(cleanup);

const primary = () => screen.getByRole('navigation', { name: 'Primary' });

describe('Header with the Stories menu', () => {
  it('shows Stories as a button after Pricing and no Resources link', () => {
    render(<Header />);
    const labels = Array.from(primary().querySelectorAll('a, button')).map((el) => el.textContent?.trim());
    expect(labels.slice(0, 5)).toEqual(['Therapy Centres', 'Schools', 'Parents', 'Pricing', 'Stories']);
    expect(within(primary()).queryByRole('link', { name: 'Resources' })).toBeNull();
  });

  it('keeps the four links in the page even while the menu is closed', () => {
    render(<Header />);
    const hrefs = Array.from(primary().querySelectorAll('ul a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/case-studies', '/faqs', '/blog', '/testimonials']);
    expect(within(primary()).queryByRole('link', { name: /FAQs/ })).toBeNull(); // hidden, so out of the accessibility tree
  });

  it('opens on click, closes on Escape and on an outside click', async () => {
    render(<Header />);
    const button = within(primary()).getByRole('button', { name: /^stories/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(within(primary()).getByRole('link', { name: /FAQs/ })).toHaveAttribute('href', '/faqs');
    await userEvent.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await userEvent.click(document.body);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the helper line under each label', async () => {
    render(<Header />);
    await userEvent.click(within(primary()).getByRole('button', { name: /^stories/i }));
    expect(within(primary()).getByText('Quick answers before you book')).toBeInTheDocument();
  });

  it('marks Stories and the current page active on a child route', async () => {
    pathnameMock.value = '/faqs';
    render(<Header />);
    const button = within(primary()).getByRole('button', { name: /^stories/i });
    expect(button.className).toContain('text-content-brand-secondary');
    await userEvent.click(button);
    expect(within(primary()).getByRole('link', { name: /FAQs/ })).toHaveAttribute('aria-current', 'page');
  });

  it('shows Stories as an accordion in the mobile drawer and closes the drawer on a link', async () => {
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: /open menu/i }));
    const drawer = screen.getByRole('navigation', { name: 'Mobile' });
    const stories = within(drawer).getByRole('button', { name: /^stories/i });
    expect(stories).toHaveAttribute('aria-expanded', 'false');
    expect(within(drawer).queryByRole('link', { name: 'Blog' })).toBeNull();
    await userEvent.click(stories);
    expect(stories).toHaveAttribute('aria-expanded', 'true');
    expect(within(drawer).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(
      expect.arrayContaining(['/pricing', '/case-studies', '/faqs', '/blog', '/testimonials']),
    );
    await userEvent.click(within(drawer).getByRole('link', { name: 'Blog' }));
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
  });
});
```

Add this test inside the `describe('Footer', ...)` block of `tests/unit/footer.test.tsx`:

```tsx
  it('links Pricing and the live Stories pages, and keeps the Blog link until the blog is live', () => {
    const { container } = render(<Footer />);
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/pricing');
    expect(hrefs).toContain('/faqs');
    expect(hrefs).toContain('/resources#blog');
    expect(hrefs).not.toContain('/case-studies');
  });
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/unit/header.test.tsx tests/unit/header-stories.test.tsx tests/unit/footer.test.tsx`
Expected: FAIL (Header still reads the legacy six links; no `NavMenu`)

- [ ] **Step 3: Create `components/shared/NavMenu.tsx`**

```tsx
// components/shared/NavMenu.tsx
'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { isActivePath, type NavMenuItem } from './nav-links';

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = { item: NavMenuItem; pathname: string };

// Disclosure, not an ARIA menu: a button that shows a list of links. The links stay in the page HTML
// while it is closed (the `hidden` attribute only hides them), so crawlers see every page.
export function NavMenu({ item, pathname }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const active = item.pages.some((p) => isActivePath(pathname, p.href));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`nav-link inline-flex items-center gap-1 whitespace-nowrap text-[12px] uppercase tracking-[0.5px] transition-colors min-[1440px]:text-[13px] min-[1440px]:tracking-[0.6px] ${
          active ? 'font-bold text-content-brand-secondary' : 'font-semibold text-content-brand hover:text-brand-dark'
        }`}
      >
        {item.label}
        <Chevron />
      </button>
      <ul
        id={panelId}
        hidden={!open}
        className={`absolute left-1/2 top-full z-10 mt-4 w-[300px] -translate-x-1/2 rounded-2xl bg-white p-2 shadow-[0px_0px_20px_rgba(10,13,18,0.14)] ${open ? 'menu-in' : ''}`}
      >
        {item.pages.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              aria-current={isActivePath(pathname, p.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-brand-subtle-bg"
            >
              <span className="block text-[14px] font-semibold normal-case tracking-normal text-content-brand">{p.label}</span>
              <span className="block text-[13px] font-normal normal-case leading-[20px] tracking-normal text-content-secondary">{p.helper}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type MobileProps = { item: NavMenuItem; pathname: string; onNavigate: () => void };

export function MobileNavMenu({ item, pathname, onNavigate }: MobileProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const active = item.pages.some((p) => isActivePath(pathname, p.href));

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-[16px] uppercase tracking-[0.6px] transition-colors hover:bg-brand-subtle-bg active:bg-brand-subtle-bg ${
          active ? 'font-bold text-content-brand-secondary' : 'font-semibold text-content-brand'
        }`}
      >
        {item.label}
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <Chevron />
        </span>
      </button>
      {open ? (
        <ul id={panelId} className="flex flex-col gap-1 pb-1 pl-4">
          {item.pages.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                onClick={onNavigate}
                aria-current={isActivePath(pathname, p.href) ? 'page' : undefined}
                className="block rounded-xl px-4 py-3 text-[16px] font-semibold text-content-brand hover:bg-brand-subtle-bg active:bg-brand-subtle-bg"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
```

The 12px text below 1440px is deliberate. Seven items no longer fit at 13px between the logo and the buttons at 1280px. Step 7 checks this.

- [ ] **Step 4: Edit `components/shared/Header.tsx`**

Replace the import line `import { NAV_LINKS } from './nav-links';` with:

```tsx
import { MobileNavMenu, NavMenu } from './NavMenu';
import { buildPrimaryNav, isActivePath, type NavItem } from './nav-links';
```

Right after the `function Chevron() { ... }` definition, add:

```tsx
const NAV = buildPrimaryNav();
const DRAWER_ITEMS: NavItem[] = [
  ...NAV,
  ...DRAWER_LINKS.map((l) => ({ kind: 'link' as const, label: l.label, href: l.href })),
];
```

Replace the desktop `<nav aria-label="Primary" ...> ... </nav>` block (the one that maps `NAV_LINKS`) with:

```tsx
        <nav aria-label="Primary" className="hidden items-center justify-center gap-2 min-[1440px]:gap-3 xl:flex">
          {NAV.map((item, i) => (
            <span key={item.label} className="flex items-center gap-2 min-[1440px]:gap-3">
              {i > 0 ? <span aria-hidden="true" className="h-4 w-px bg-brand-teal/28" /> : null}
              {item.kind === 'menu' ? (
                <NavMenu item={item} pathname={pathname} />
              ) : (
                <Link
                  href={item.href}
                  aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
                  className={`nav-link inline-block whitespace-nowrap text-[12px] uppercase tracking-[0.5px] transition-colors min-[1440px]:text-[13px] min-[1440px]:tracking-[0.6px] ${
                    isActivePath(pathname, item.href)
                      ? 'font-bold text-content-brand-secondary'
                      : 'font-semibold text-content-brand hover:text-brand-dark'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
```

Replace the mobile block `{[...NAV_LINKS, ...DRAWER_LINKS].map((l) => { ... })}` inside `<nav id="mobile-nav" ...>` with:

```tsx
          {DRAWER_ITEMS.map((item) =>
            item.kind === 'menu' ? (
              <MobileNavMenu key={item.label} item={item} pathname={pathname} onNavigate={() => setDrawer(false)} />
            ) : (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setDrawer(false)}
                aria-current={isActivePath(pathname, item.href) ? 'page' : undefined}
                className={`rounded-xl px-4 py-3 text-[16px] uppercase tracking-[0.6px] transition-colors hover:bg-brand-subtle-bg active:bg-brand-subtle-bg ${
                  isActivePath(pathname, item.href) ? 'font-bold text-content-brand-secondary' : 'font-semibold text-content-brand'
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
```

Then delete the legacy `NAV_LINKS` export (the last block, with its comment) from `components/shared/nav-links.ts`.

- [ ] **Step 5: Edit `components/shared/Footer.tsx`**

Add the imports with the existing ones:

```tsx
import { LIVE_PAGES } from "@/lib/launch-gates";
import { livePages } from "./nav-links";
```

Replace the `COLUMNS` constant's PLATFORM and RESOURCES entries (keep COMPANY as is) with:

```tsx
function resourceLinks(): L[] {
  return [
    ...livePages().map(({ label, href }) => ({ label, href })),
    {
      label: "Knowledge base",
      href: "https://support.cognitivebotics.com/support/solutions",
      external: true,
    },
    // The blog has no page yet: keep the old link until it is live.
    ...(LIVE_PAGES.blog ? [] : [{ label: "Blog", href: "/resources#blog" }]),
    { label: "Development checklist", href: "/developmental-checklist" },
  ];
}

const COLUMNS: { heading: string; links: L[] }[] = [
  {
    heading: "PLATFORM",
    links: [
      { label: "For parents", href: "/parents" },
      { label: "For therapy centres", href: "/therapy-centres" },
      { label: "For schools", href: "/schools" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  { heading: "RESOURCES", links: resourceLinks() },
  // ...the existing COMPANY entry follows here, unchanged.
];
```

Only the PLATFORM and RESOURCES entries change. Keep the existing `{ heading: "COMPANY", ... }` object exactly as it is: paste the code above in place of the first two entries and leave COMPANY and the closing `];` of the original array where they are (so drop the `// ...` line and the extra `];` from the snippet).

- [ ] **Step 6: Update and add e2e specs**

In `tests/e2e/integration.spec.ts`: add `'/pricing', '/faqs', '/try-demo'` to the `ROUTES` array, rename the drawer test to say "seven", and change its label list to `['Therapy Centres', 'Schools', 'Parents', 'Pricing', 'Resources', 'About Us', 'Get in Touch']`. In `tests/e2e/mobile.spec.ts` add `'/pricing', '/faqs', '/try-demo'` to `PAGES`.

Create `tests/e2e/nav.spec.ts`:

```ts
// tests/e2e/nav.spec.ts
import { expect, test } from '@playwright/test';
import { noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('desktop nav fits on one line between the logo and the sign-in button', async ({ page }) => {
  for (const width of [1280, 1366, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    const logo = await page.getByRole('link', { name: /cognitivebotics home/i }).boundingBox();
    const box = await nav.boundingBox();
    const signIn = await page.getByRole('button', { name: /^sign in/i }).first().boundingBox();
    expect(box!.x, `${width}px: nav starts after the logo`).toBeGreaterThanOrEqual(logo!.x + logo!.width);
    expect(box!.x + box!.width, `${width}px: nav ends before Sign in`).toBeLessThanOrEqual(signIn!.x);
    const rows = await nav.locator('a').evaluateAll((els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size);
    expect(rows, `${width}px: one row`).toBe(1);
  }
});

test('Pricing is in the nav and opens the pricing page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Pricing' }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole('link', { name: 'Pricing', exact: true }).first()).toHaveAttribute('aria-current', 'page');
});
```

- [ ] **Step 7: Run unit tests, lint and the nav e2e**

Run: `npx vitest run && npx eslint app components lib && npx playwright test tests/e2e/nav.spec.ts tests/e2e/integration.spec.ts tests/e2e/mobile.spec.ts --reporter=line`
Expected: all PASS. If the 1280px row in `nav.spec.ts` fails, the nav is still too wide there. Lower the nav text to `text-[11.5px]` below 1440px in both `Header.tsx` and `NavMenu.tsx` and re-run. Do not wrap the links.

- [ ] **Step 8: Commit**

```bash
git add -A components tests
git commit -m "feat: Pricing in the nav, Stories dropdown behind launch gates, footer links" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Docs and full verification

**Files:**
- Modify: `CLAUDE.md` (the Layout line that lists routes)

- [ ] **Step 1: Update the route list in `CLAUDE.md`**

In the "Layout" section, change the `app/<route>/page.tsx` line so it also lists `pricing`, `faqs` and `try-demo`. For example, replace
`routes: `/`, `about`, `careers` (+`[slug]` job pages), `contact-us`, `parents`, `resources`, `schools`, `therapy-centres`, plus `kit` (component showcase) and `coming-soon`.`
with
`routes: `/`, `about`, `careers` (+`[slug]` job pages), `contact-us`, `faqs`, `parents`, `pricing`, `resources`, `schools`, `therapy-centres`, `try-demo`, plus `kit` (component showcase) and `coming-soon`. Stories pages (case studies, blog, testimonials) are gated by `lib/launch-gates.ts`.`

- [ ] **Step 2: Run the full unit suite, lint and production build**

Run: `npm test && npm run lint && npm run build`
Expected: all unit tests pass (the earlier baseline failure is fixed), no lint errors, build succeeds. A plain retry has fixed transient build failures before.

- [ ] **Step 3: Run the full e2e suite**

Run: `npm run e2e`
Expected: all specs pass. If a spec this plan did not touch fails, run it on the base branch to see whether it already failed: `git switch motion-arrival-cues && npx playwright test tests/e2e/<spec> && git switch nav-pricing-demo-pages`. Fix only failures this plan caused.

- [ ] **Step 4: Check by hand in a browser (`npm run dev`)**

- `/pricing`: two cards, both CTAs open `/try-demo?plan=...` and the users field matches.
- `/try-demo`: fill the form, submit, see "Request received" (Calendly is off while `CALENDLY_URL` is empty).
- `/faqs`: chips switch sets, the URL hash follows, `/faqs#schools` opens Schools.
- Nav at 1280, 1366 and 1440 wide, and the mobile drawer at 375.
- Report what you saw, including anything that looked off, before saying the work is done.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: list the new routes and the launch gates" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

## Self-review

**Spec coverage**

| Spec section | Task |
|---|---|
| Nav (order, Stories dropdown, mobile accordion, SEO links in HTML, Pricing item) | 1, 9 |
| Footer (Pricing, Stories links) | 9 |
| Routes `/pricing`, `/faqs`, `/try-demo` | 4 to 8 |
| Routes `/blog`, `/case-studies`, `/testimonials`, `/resources` redirect | Plan 2 |
| Pricing layout, copy, JSON-LD, FAQ, CTAs | 4, 6 |
| Try Demo fields, plan carry-through, states, Calendly, analytics | 7, 8 |
| FAQs chips, hash sync, JSON-LD, last updated | 5 |
| Launch gates | 1 (and used by 8, 9) |
| Reuse map (`Chips`, `CtaPanel`, `QuoteRow`, carousel, `Select`, `contact-form`) | 2, 3, 8 |
| Testing section | tests in every task |
| Open items 1 and 2 (Calendly link, lead endpoint) | `lib/demo-config.ts`, `lib/demo-submit.ts` |

**Placeholder scan.** No TBD or "similar to Task N". The two deliberate empty or stub values (`CALENDLY_URL`, `submitDemoRequest`) are real, tested behaviour for unknown inputs and are named as launch blockers.

**Type consistency.** `FaqSet` (Task 5) is used by `FaqTabs`. `Plan`, `DemoValues` and `DemoRequest` (Task 7) are used by Task 8. `NavMenuItem.pages` (Task 1) is used by `NavMenu`. `Chips` ids (`faq-tab-<id>`, `faq-panel-<id>`) match `FaqTabs` and its test. `DemoEvent` names match `DemoFlow` dispatches.
