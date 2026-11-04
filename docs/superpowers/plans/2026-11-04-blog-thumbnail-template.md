# Blog Thumbnail Campaign Set Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render three on-brand thumbnails (1200 × 675 PNG) for three blog posts, built from one reusable template, in the layout system of Samarth's three reference images.

**Architecture:** A fixed-size React template (`ThumbnailFrame` plus one of three illustration modules chosen by a typed copy spec) is shown by a `noindex` render route under `/kit`. `tools/render-thumbnails.mjs` builds, serves, reads the slug list from an index page, screenshots each thumbnail with Playwright and writes one PNG per slug. The blog cards are not changed.

**Tech Stack:** Next.js 16.4.3 (App Router), React 19.3, Tailwind v4 (only for the `font-heading` / `font-sans` classes), TypeScript, Vitest + Testing Library (unit), Playwright (e2e and rendering), `sharp` (PNG recompression).

**Spec:** `docs/superpowers/specs/2026-11-04-blog-thumbnail-template-design.md`

**Reference images** (view with the Read tool): `/private/tmp/claude-501/-Users-samarthkumar-CBT-cbt-site/65ceaeea-6325-48be-892f-64aca5182c44/images/1.png` (ticket), `.../2.png` (split panel), `.../3.png` (band).

## Global Constraints

- Output: **3 PNGs**, **1200 × 675**, at `public/blog/thumbs/<slug>.png`, committed to the repo. No share image, no `og:image`, no change to `PostCard` or post pages.
- Posts and layouts: Early intervention → ticket; Screen time → split panel; Physical activities → band.
- Copy (exact):
  - `early-intervention-is-the-key-to-managing-autism`: eyebrow "Early intervention guide"; headline "Early support," / "more time to grow"; descriptor "What it is, and why timing matters"; ticket label "M-CHAT-R screening", "16" → "30" "months", checks "Spot early signs" and "Start support", tag "Start early".
  - `the-startling-truth-about-screen-time-and-autism`: eyebrow "Screen time guide"; headline "Screens work best" / "watched together"; descriptor "Three viewing strategies for parents"; rows "Restrictive", "Co-viewing", "Interactive" with row 3 highlighted, tag "Most effective".
  - `the-transformative-power-of-physical-activities-for-children-with-autism`: eyebrow "Physical activity guide"; headline "Movement that builds" / "more than muscle"; descriptor "How activity supports children with autism"; chips "Motor skills" (highlighted), "Sensory integration", "Social bonds", "Emotional wellness", "Focus", "Confidence".
- Canvas 1200 × 675. Outer frame `#eef9f9`; inner white card inset 20px, radius 32px, 1.5px `#e4edea` border, shadow `0 10px 30px rgba(16,73,76,0.06)`; card padding 56px (text starts at x = 76). Card-relative coordinates are canvas minus 20.
- Eyebrow: 36 × 5px rounded dash, 16px gap, Nunito 700 28px, `#a14da5`. Headline: Nunito 800 56px, line-height 1.12, plain line `#101319`, accent line `#207d82`, each part on one line (`white-space: nowrap`). Descriptor: Open Sans 400 30px / 1.4, `#374151`.
- Dark surface: `linear-gradient(135deg, #0c3b3e 0%, #10494c 35%, #175f63 70%, #207d82 100%)` plus a `rgba(161,77,165,0.35)` radial glow in the lower right. Highlight (tags, one chip): `#a14da5` fill, white Nunito 800 text. Chips and check rows on dark: white fill, `#10494c` text. No logo, no yellow.
- Headline parts and descriptor never overflow; text never overlaps the illustration (text right edge ≤ art left edge for ticket and split, text bottom ≤ band top for band); the illustration stays inside the card.
- No interaction on the image: no hover, no animation.
- Render route: `app/kit/thumbnail/[slug]/page.tsx`, `robots: { index: false, follow: false }`, 404 for an unknown slug, including inherited object keys like `constructor`; pinned over the header, footer and cookie banner. Index page `app/kit/thumbnail/page.tsx` lists every thumbnail slug with a `data-slug` attribute.
- Read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code (`AGENTS.md`).
- Git: **never `git push`**. **Do not commit** unless Samarth asks: `components/pages/blog/`, `app/blog/`, `tests/e2e/stories.spec.ts` and `tests/unit/stories-content.test.ts` are untracked work in progress on this branch, so a commit that stages them would sweep up unrelated work. Each task ends with a `git status` checkpoint instead.
- `npm run build` must pass before the work is called done (a plain retry has fixed transient failures before).
- Match surrounding code: comment density, naming, 2-space indent, single quotes, `@/` imports in app code.

## Review Focus

Failure modes the spec implies but its happy path does not exercise, most likely first. Each has a test in the task named.

1. Copy that is too long, or contains markup characters (`<b>`, `&`, quotes), must never overflow its box or inject HTML. (Task 1: copy-length unit tests; Task 2: markup unit test; Task 3: e2e headline-fit test)
2. A slug that is unknown, is a real post without a thumbnail, or is an inherited object key (`constructor`, `__proto__`) must fail loudly in the component and be a 404 on the route, never crash or render blank. (Task 2 unit; Task 3 e2e)
3. The sticky header and cookie banner must never appear in a screenshot, even when the visitor has not given cookie consent. (Task 3, e2e)
4. An illustration whose content spills out of its box (ticket text over the stub, chips past the band, rows past the panel), or text that collides with the illustration. (Task 3, e2e fit and overlap tests)
5. A thumbnail in the spec with no PNG, a wrong-size PNG, or a script that finds a different slug list than the app. (Task 4: file test, plus the script reads the same index page the e2e test checks)

## File Structure

| File | Responsibility |
|---|---|
| `components/pages/blog/thumbnail/tokens.ts` (create) | Colours, gradients, canvas and spacing constants |
| `components/pages/blog/thumbnail/thumbnails.ts` (create) | Typed copy spec per slug; `THUMBNAILS`, `hasThumbnail` |
| `components/pages/blog/thumbnail/ThumbnailFrame.tsx` (create) | Frame, glow, eyebrow, headline, descriptor, art slot |
| `components/pages/blog/thumbnail/TicketArt.tsx` (create) | Tilted notched ticket illustration |
| `components/pages/blog/thumbnail/SplitArt.tsx` (create) | Slanted panel with waveform rows illustration |
| `components/pages/blog/thumbnail/BandArt.tsx` (create) | Gradient band with chips illustration |
| `components/pages/blog/thumbnail/PostThumbnail.tsx` (create) | `Thumbnail({ spec })` and `PostThumbnail({ slug })` |
| `app/kit/thumbnail/[slug]/page.tsx` (create) | Render route, one thumbnail at exact size |
| `app/kit/thumbnail/page.tsx` (create) | Index of all thumbnails, read by the script |
| `tools/render-thumbnails.mjs` (create) | Builds, serves, screenshots, writes PNGs |
| `public/blog/thumbs/*.png` (create, generated) | The 3 committed outputs |
| `package.json` (modify) | `thumbnails` script |
| `CLAUDE.md` (modify) | Document `npm run thumbnails` |
| `tests/unit/blog-thumbnail-copy.test.ts` (create) | Copy spec rules |
| `tests/unit/blog-thumbnail-contrast.test.ts` (create) | WCAG contrast of every colour pair |
| `tests/unit/blog-thumbnail-template.test.tsx` (create) | Template render and campaign-consistency tests |
| `tests/unit/blog-thumbnail-files.test.ts` (create) | Each thumbnail has a 1200 × 675 PNG |
| `tests/e2e/blog-thumbnails.spec.ts` (create) | Render route, layout, overlap, fit, overlay, 404 |

Slugs used below:

```
early-intervention-is-the-key-to-managing-autism                           → ticket
the-startling-truth-about-screen-time-and-autism                           → split
the-transformative-power-of-physical-activities-for-children-with-autism   → band
```

Scratch directory for temporary screenshots (outside the repo): `/private/tmp/claude-501/-Users-samarthkumar-CBT-cbt-site/65ceaeea-6325-48be-892f-64aca5182c44/scratchpad`

---

### Task 1: Tokens and copy spec

**Files:**
- Create: `components/pages/blog/thumbnail/tokens.ts`
- Create: `components/pages/blog/thumbnail/thumbnails.ts`
- Test: `tests/unit/blog-thumbnail-copy.test.ts`
- Test: `tests/unit/blog-thumbnail-contrast.test.ts`

**Interfaces:**
- Consumes: `POSTS` (existing).
- Produces:
  - `COLORS`, `SURFACE_STOPS`, `SURFACE`, `SURFACE_BG`, `PAGE_GLOW`, `CANVAS`, `CARD`, `INSET`, `PAD` (from `tokens.ts`)
  - `type TicketData`, `SplitData`, `BandData`, `ThumbnailSpec` (copy fields `eyebrow, lead, accent, subtitle` plus one layout union member discriminated on `layout`)
  - `THUMBNAILS: Record<string, ThumbnailSpec>` (exactly the three slugs)
  - `hasThumbnail(slug: string): boolean` (own keys only)

- [ ] **Step 1: Write the failing copy test**

Create `tests/unit/blog-thumbnail-copy.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { POSTS } from '@/components/pages/blog/posts';
import { THUMBNAILS, hasThumbnail, type ThumbnailSpec } from '@/components/pages/blog/thumbnail/thumbnails';

const EARLY = 'early-intervention-is-the-key-to-managing-autism';
const SCREEN = 'the-startling-truth-about-screen-time-and-autism';
const PHYSICAL = 'the-transformative-power-of-physical-activities-for-children-with-autism';

/** The spec for `slug`, narrowed to one layout. */
function only<L extends ThumbnailSpec['layout']>(slug: string, layout: L) {
  const s = THUMBNAILS[slug];
  if (s.layout !== layout) throw new Error(`${slug} is ${s.layout}, expected ${layout}`);
  return s as Extract<ThumbnailSpec, { layout: L }>;
}

describe('thumbnail copy', () => {
  it('covers exactly the three campaign posts, and each is a real post', () => {
    expect(Object.keys(THUMBNAILS).sort()).toEqual([EARLY, PHYSICAL, SCREEN].sort());
    for (const slug of Object.keys(THUMBNAILS)) expect(POSTS.map((p) => p.slug)).toContain(slug);
  });

  it('uses three different layouts', () => {
    expect(new Set(Object.values(THUMBNAILS).map((s) => s.layout))).toEqual(new Set(['ticket', 'split', 'band']));
    expect(THUMBNAILS[EARLY].layout).toBe('ticket');
    expect(THUMBNAILS[SCREEN].layout).toBe('split');
    expect(THUMBNAILS[PHYSICAL].layout).toBe('band');
  });

  it.each(Object.entries(THUMBNAILS))('%s keeps its copy short enough to fit', (_slug, s) => {
    for (const part of [s.lead, s.accent]) {
      expect(part.length).toBeGreaterThan(0);
      expect(part.length, part).toBeLessThanOrEqual(20);
    }
    expect(s.eyebrow.length).toBeLessThanOrEqual(26);
    expect(s.subtitle.length).toBeLessThanOrEqual(44);
  });

  it('has the ticket content in range', () => {
    const t = only(EARLY, 'ticket');
    expect(t.checks.length).toBeGreaterThanOrEqual(1);
    expect(t.checks.length).toBeLessThanOrEqual(2);
    for (const text of [t.label, ...t.checks]) expect(text.length, text).toBeLessThanOrEqual(22);
    expect(t.from.length).toBeLessThanOrEqual(3);
    expect(t.to.length).toBeLessThanOrEqual(3);
    expect(t.tag.length).toBeLessThanOrEqual(12);
  });

  it('has three split rows, one highlighted', () => {
    const s = only(SCREEN, 'split');
    expect(s.rows).toHaveLength(3);
    expect(s.highlight).toBeGreaterThanOrEqual(0);
    expect(s.highlight).toBeLessThan(3);
    for (const row of s.rows) expect(row.length, row).toBeLessThanOrEqual(14);
    expect(s.tag.length).toBeLessThanOrEqual(16);
  });

  it('has at most six band chips, one highlighted', () => {
    const b = only(PHYSICAL, 'band');
    expect(b.chips.length).toBeGreaterThanOrEqual(1);
    expect(b.chips.length).toBeLessThanOrEqual(6);
    expect(b.highlight).toBeGreaterThanOrEqual(0);
    expect(b.highlight).toBeLessThan(b.chips.length);
    for (const chip of b.chips) expect(chip.length, chip).toBeLessThanOrEqual(20);
  });

  it('finds only its own slugs, never inherited object keys', () => {
    expect(hasThumbnail(EARLY)).toBe(true);
    for (const key of ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'not-a-post']) expect(hasThumbnail(key), key).toBe(false);
  });
});
```

- [ ] **Step 2: Write the failing contrast test**

Create `tests/unit/blog-thumbnail-contrast.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { COLORS, SURFACE_STOPS } from '@/components/pages/blog/thumbnail/tokens';

const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const PAIRS: [string, string, string][] = [
  ['headline on the card', COLORS.ink, COLORS.white],
  ['headline accent on the card', COLORS.accent, COLORS.white],
  ['eyebrow on the card', COLORS.purple, COLORS.white],
  ['descriptor on the card', COLORS.body, COLORS.white],
  ['highlight text on purple', COLORS.white, COLORS.purple],
  ['chip text on white', COLORS.deep, COLORS.white],
  ...SURFACE_STOPS.map((stop): [string, string, string] => [`white text on the surface at ${stop}`, COLORS.white, stop]),
];

describe('thumbnail colour contrast', () => {
  it.each(PAIRS)('%s is at least 4.5:1', (_name, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
```

- [ ] **Step 3: Run both to verify they fail**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/blog-thumbnail-copy.test.ts tests/unit/blog-thumbnail-contrast.test.ts`
Expected: FAIL, "Failed to resolve import ... thumbnail/thumbnails" and "... thumbnail/tokens".

- [ ] **Step 4: Write `tokens.ts`**

Create `components/pages/blog/thumbnail/tokens.ts`:

```ts
/** Colours and sizes shared by the thumbnail components and the contrast test. Colours come from the site palette (app/globals.css). */
export const COLORS = {
  ink: '#101319', // text-default
  accent: '#207d82', // content-brand
  purple: '#a14da5', // content-brand-secondary
  deep: '#10494c', // brand-dark
  body: '#374151', // text-secondary
  frame: '#eef9f9', // background-brand-subtle
  border: '#e4edea', // border-subtle
  checkBg: '#ddf3f4',
  white: '#ffffff',
} as const;

/** Stops of the dark surface (ticket stub, split panel, band), darkest first. */
export const SURFACE_STOPS = ['#0c3b3e', '#10494c', '#175f63', '#207d82'] as const;
export const SURFACE = `linear-gradient(135deg, ${SURFACE_STOPS[0]} 0%, ${SURFACE_STOPS[1]} 35%, ${SURFACE_STOPS[2]} 70%, ${SURFACE_STOPS[3]} 100%)`;
/** Purple glow in the lower right of the dark surface, echoing the references' blue-to-violet shift. */
export const SURFACE_BG = `radial-gradient(circle at 100% 100%, rgba(161,77,165,0.35), rgba(161,77,165,0) 55%), ${SURFACE}`;
/** Soft glow behind the illustration, from the site's hero gradient hues (sky and lilac). */
export const PAGE_GLOW = 'radial-gradient(60% 70% at 78% 55%, rgba(93,198,243,0.16), rgba(181,90,186,0.1) 45%, rgba(255,255,255,0) 72%)';

export const CANVAS = { width: 1200, height: 675 } as const;
/** Space between the canvas edge and the white card. */
export const INSET = 20;
/** Space between the card edge and its content. */
export const PAD = 56;
export const CARD = { width: CANVAS.width - 2 * INSET, height: CANVAS.height - 2 * INSET } as const;
```

- [ ] **Step 5: Write `thumbnails.ts`**

Create `components/pages/blog/thumbnail/thumbnails.ts`:

```ts
// Copy for each blog thumbnail, worded from the article it belongs to. A post that is listed here gets a rendered thumbnail.
type Copy = {
  /** Short topic label under the dash, e.g. "Screen time guide". */
  eyebrow: string;
  /** First headline line, plain colour. At most 20 characters. */
  lead: string;
  /** Second headline line, accent colour. At most 20 characters. */
  accent: string;
  subtitle: string;
};

/** A tilted boarding-pass style ticket with a stub. */
export type TicketData = {
  layout: 'ticket';
  label: string;
  from: string;
  to: string;
  unit: string;
  checks: readonly string[];
  /** Highlight tag on the stub. */
  tag: string;
};

/** A slanted dark panel with labelled waveform rows. */
export type SplitData = {
  layout: 'split';
  rows: readonly string[];
  /** Index of the bright row; it gets the tag. */
  highlight: number;
  tag: string;
};

/** A dark band of pill chips along the bottom. */
export type BandData = {
  layout: 'band';
  chips: readonly string[];
  /** Index of the highlighted chip. */
  highlight: number;
};

export type ThumbnailSpec = Copy & (TicketData | SplitData | BandData);

export const THUMBNAILS: Record<string, ThumbnailSpec> = {
  'early-intervention-is-the-key-to-managing-autism': {
    layout: 'ticket',
    eyebrow: 'Early intervention guide',
    lead: 'Early support,',
    accent: 'more time to grow',
    subtitle: 'What it is, and why timing matters',
    label: 'M-CHAT-R screening',
    from: '16',
    to: '30',
    unit: 'months',
    checks: ['Spot early signs', 'Start support'],
    tag: 'Start early',
  },
  'the-startling-truth-about-screen-time-and-autism': {
    layout: 'split',
    eyebrow: 'Screen time guide',
    lead: 'Screens work best',
    accent: 'watched together',
    subtitle: 'Three viewing strategies for parents',
    rows: ['Restrictive', 'Co-viewing', 'Interactive'],
    highlight: 2,
    tag: 'Most effective',
  },
  'the-transformative-power-of-physical-activities-for-children-with-autism': {
    layout: 'band',
    eyebrow: 'Physical activity guide',
    lead: 'Movement that builds',
    accent: 'more than muscle',
    subtitle: 'How activity supports children with autism',
    chips: ['Motor skills', 'Sensory integration', 'Social bonds', 'Emotional wellness', 'Focus', 'Confidence'],
    highlight: 0,
  },
};

/** True only for slugs listed above; `constructor` and other inherited object keys are not thumbnails. */
export const hasThumbnail = (slug: string) => Object.prototype.hasOwnProperty.call(THUMBNAILS, slug);
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/blog-thumbnail-copy.test.ts tests/unit/blog-thumbnail-contrast.test.ts`
Expected: PASS (copy: 8 tests plus 3 `it.each`; contrast: 10).

- [ ] **Step 7: Checkpoint (no commit, no push)**

Run: `cd /Users/samarthkumar/CBT/cbt-site && git status --short components/pages/blog tests/unit`
Expected: new files untracked (`??`); nothing staged.

---

### Task 2: Template components

**Files:**
- Create: `components/pages/blog/thumbnail/ThumbnailFrame.tsx`
- Create: `components/pages/blog/thumbnail/TicketArt.tsx`
- Create: `components/pages/blog/thumbnail/SplitArt.tsx`
- Create: `components/pages/blog/thumbnail/BandArt.tsx`
- Create: `components/pages/blog/thumbnail/PostThumbnail.tsx`
- Test: `tests/unit/blog-thumbnail-template.test.tsx`

**Interfaces:**
- Consumes: `COLORS`, `SURFACE_STOPS`, `SURFACE_BG`, `PAGE_GLOW`, `CANVAS`, `INSET`, `PAD` (tokens); `THUMBNAILS`, `hasThumbnail`, `ThumbnailSpec`, `TicketData`, `SplitData`, `BandData`.
- Produces:
  - `ThumbnailFrame({ spec, children })`. Root `data-testid="thumbnail"` with `data-layout`; card `data-testid="card"`; text block `data-testid="text"`; `eyebrow`, `headline-lead`, `headline-accent`, `subtitle` test ids.
  - Each art root has `data-testid="art"`. Text-bearing elements carry `data-fit`; their containing boxes carry `data-fit-box`. The rotated ticket root carries `data-rotate`.
  - `Thumbnail({ spec: ThumbnailSpec })` and `PostThumbnail({ slug: string })` (throws `No thumbnail for post "<slug>"` for anything not in `THUMBNAILS`).

- [ ] **Step 1: Write the failing unit test**

Create `tests/unit/blog-thumbnail-template.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostThumbnail, Thumbnail } from '@/components/pages/blog/thumbnail/PostThumbnail';
import { THUMBNAILS, type ThumbnailSpec } from '@/components/pages/blog/thumbnail/thumbnails';
import { COLORS } from '@/components/pages/blog/thumbnail/tokens';

const EARLY = 'early-intervention-is-the-key-to-managing-autism';
const SCREEN = 'the-startling-truth-about-screen-time-and-autism';
const PHYSICAL = 'the-transformative-power-of-physical-activities-for-children-with-autism';
const SLUGS = [EARLY, SCREEN, PHYSICAL];

describe('Thumbnail frame', () => {
  it.each(SLUGS)('%s renders one eyebrow, a two-part headline and one descriptor at 1200 x 675', (slug) => {
    const spec = THUMBNAILS[slug];
    render(<PostThumbnail slug={slug} />);
    const root = screen.getByTestId('thumbnail');
    expect(root).toHaveStyle({ width: '1200px', height: '675px' });
    expect(root).toHaveAttribute('data-layout', spec.layout);
    expect(screen.getAllByTestId('eyebrow')).toHaveLength(1);
    expect(screen.getByTestId('eyebrow')).toHaveTextContent(spec.eyebrow);
    expect(screen.getByTestId('eyebrow')).toHaveStyle({ color: COLORS.purple });
    expect(screen.getByTestId('headline-lead')).toHaveTextContent(spec.lead);
    expect(screen.getByTestId('headline-accent')).toHaveTextContent(spec.accent);
    expect(screen.getByTestId('headline-accent')).toHaveStyle({ color: COLORS.accent });
    expect(screen.getByTestId('subtitle')).toHaveTextContent(spec.subtitle);
    expect(screen.getAllByTestId('art')).toHaveLength(1);
  });

  // This is what makes the three read as one campaign: one frame, one set of text styles.
  it('gives all three the same card, eyebrow, headline and descriptor styles', () => {
    const styles = SLUGS.map((slug) => {
      const { unmount } = render(<PostThumbnail slug={slug} />);
      const s = ['card', 'eyebrow', 'headline-lead', 'headline-accent', 'subtitle'].map((id) => screen.getByTestId(id).getAttribute('style'));
      unmount();
      return s;
    });
    expect(styles[1]).toEqual(styles[0]);
    expect(styles[2]).toEqual(styles[0]);
  });
});

describe('illustrations', () => {
  it('draws the ticket content and a tag', () => {
    render(<PostThumbnail slug={EARLY} />);
    const art = within(screen.getByTestId('art'));
    expect(art.getByText('M-CHAT-R screening')).toBeInTheDocument();
    expect(art.getByText('16')).toBeInTheDocument();
    expect(art.getByText('30')).toBeInTheDocument();
    expect(art.getByText('months')).toBeInTheDocument();
    expect(art.getByText('Spot early signs')).toBeInTheDocument();
    expect(art.getByText('Start support')).toBeInTheDocument();
    expect(art.getByText('Start early')).toBeInTheDocument();
    expect(screen.getByTestId('art')).toHaveAttribute('data-rotate');
  });

  it('draws three rows with only the highlighted one bright and tagged', () => {
    const { container } = render(<PostThumbnail slug={SCREEN} />);
    const art = within(screen.getByTestId('art'));
    for (const row of ['Restrictive', 'Co-viewing', 'Interactive']) expect(art.getByText(row)).toBeInTheDocument();
    expect(art.getByText('Most effective')).toBeInTheDocument();
    const lit = container.querySelectorAll('[data-highlight]');
    expect(lit).toHaveLength(1);
    expect(lit[0]).toHaveTextContent('Interactive');
    expect(lit[0]).toHaveTextContent('Most effective');
  });

  it('draws six chips with the first one highlighted', () => {
    render(<PostThumbnail slug={PHYSICAL} />);
    const art = within(screen.getByTestId('art'));
    const chips = ['Motor skills', 'Sensory integration', 'Social bonds', 'Emotional wellness', 'Focus', 'Confidence'];
    for (const chip of chips) expect(art.getByText(chip)).toBeInTheDocument();
    expect(art.getByText('Motor skills')).toHaveStyle({ background: COLORS.purple });
    expect(art.getByText('Focus')).toHaveStyle({ background: COLORS.white });
  });
});

describe('edge cases', () => {
  const base = THUMBNAILS[PHYSICAL];

  it('shows markup characters in the copy as text', () => {
    const odd: ThumbnailSpec = { ...base, lead: '<b>bold</b> & "q"', subtitle: '<script>alert(1)</script>' };
    const { container } = render(<Thumbnail spec={odd} />);
    expect(screen.getByTestId('headline-lead').textContent).toBe('<b>bold</b> & "q"');
    expect(screen.getByTestId('subtitle').textContent).toBe('<script>alert(1)</script>');
    expect(container.querySelector('b, script')).toBeNull();
  });

  it('keeps each headline part on one line however long it is', () => {
    const long: ThumbnailSpec = { ...base, lead: 'A'.repeat(60), accent: 'B'.repeat(60) };
    render(<Thumbnail spec={long} />);
    expect(screen.getByTestId('headline-lead')).toHaveStyle({ whiteSpace: 'nowrap' });
    expect(screen.getByTestId('headline-accent')).toHaveStyle({ whiteSpace: 'nowrap' });
  });

  it('fails loudly for a slug with no thumbnail, including inherited object keys', () => {
    for (const slug of ['a-post-with-no-thumbnail', 'fun-ways-to-boost-motor-skills-of-children-with-autism', 'constructor', '__proto__']) {
      expect(() => PostThumbnail({ slug }), slug).toThrow(/No thumbnail for post/);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/blog-thumbnail-template.test.tsx`
Expected: FAIL, "Failed to resolve import ... PostThumbnail".

- [ ] **Step 3: Write `ThumbnailFrame.tsx`**

Create `components/pages/blog/thumbnail/ThumbnailFrame.tsx`:

```tsx
import type { CSSProperties, ReactNode } from 'react';
import type { ThumbnailSpec } from './thumbnails';
import { CANVAS, COLORS, INSET, PAD, PAGE_GLOW } from './tokens';

/** Where the text block sits in the card, per layout (card coordinates, 1160 x 635). */
const TEXT: Record<ThumbnailSpec['layout'], CSSProperties> = {
  // Reference 1: vertically centred, art on the right.
  ticket: { left: PAD, top: 0, bottom: 0, width: 540, justifyContent: 'center' },
  // Reference 2: eyebrow and headline upper left, descriptor pinned bottom left, panel on the right.
  split: { left: PAD, top: 96, bottom: PAD, width: 548, justifyContent: 'space-between' },
  // Reference 3: text across the top, band below.
  band: { left: PAD, top: 64, right: PAD },
};

/** The part every thumbnail shares: frame, white card, glow, eyebrow, two-tone headline and descriptor. The illustration goes in `children`. */
export function ThumbnailFrame({ spec, children }: { spec: ThumbnailSpec; children: ReactNode }) {
  return (
    <div data-testid="thumbnail" data-layout={spec.layout} style={{ position: 'relative', width: CANVAS.width, height: CANVAS.height, overflow: 'hidden', background: COLORS.frame }}>
      <div
        data-testid="card"
        style={{
          position: 'absolute',
          inset: INSET,
          boxSizing: 'border-box',
          borderRadius: 32,
          overflow: 'hidden',
          background: COLORS.white,
          border: `1.5px solid ${COLORS.border}`,
          boxShadow: '0 10px 30px rgba(16,73,76,0.06)',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: PAGE_GLOW }} />
        {children}
        <div data-testid="text" style={{ position: 'absolute', display: 'flex', flexDirection: 'column', ...TEXT[spec.layout] }}>
          <div>
            <p data-testid="eyebrow" className="font-heading" style={{ display: 'flex', alignItems: 'center', gap: 16, margin: 0, color: COLORS.purple, fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
              <span aria-hidden="true" style={{ width: 36, height: 5, borderRadius: 3, background: COLORS.purple }} />
              {spec.eyebrow}
            </p>
            <h2 className="font-heading" style={{ margin: '22px 0 0', fontSize: 56, fontWeight: 800, lineHeight: 1.12, color: COLORS.ink }}>
              <span data-testid="headline-lead" style={{ display: 'block', width: 'max-content', whiteSpace: 'nowrap' }}>{spec.lead}</span>
              <span data-testid="headline-accent" style={{ display: 'block', width: 'max-content', whiteSpace: 'nowrap', color: COLORS.accent }}>{spec.accent}</span>
            </h2>
          </div>
          <p data-testid="subtitle" className="font-sans" style={{ margin: spec.layout === 'split' ? 0 : '20px 0 0', maxWidth: spec.layout === 'band' ? 900 : 520, fontSize: 30, lineHeight: 1.4, color: COLORS.body }}>
            {spec.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write `TicketArt.tsx`**

Create `components/pages/blog/thumbnail/TicketArt.tsx`. The ticket is 520 × 296, tilted −6°, centred near card point (872, 322). The perforation sits 340px from its left edge, with 14px notches top and bottom.

```tsx
import type { CSSProperties } from 'react';
import type { TicketData } from './thumbnails';
import { COLORS, SURFACE_STOPS } from './tokens';

const W = 520;
const H = 296;
/** Perforation: where the main part ends and the stub starts. */
const P = 340;
/** Rounded card outline with a half-circle notch in the top and bottom edge at the perforation. */
const SHAPE = 'M26 0H326A14 14 0 0 0 354 0H494A26 26 0 0 1 520 26V270A26 26 0 0 1 494 296H354A14 14 0 0 0 326 296H26A26 26 0 0 1 0 270V26A26 26 0 0 1 26 0Z';
/** Barcode bar widths, left to right, 4px apart, starting 31px into the stub. */
const BAR_WIDTHS = [4, 2, 6, 2, 3, 6, 2, 4, 3, 6, 2, 3, 4, 2, 6, 3];
const BARS = BAR_WIDTHS.reduce<{ x: number; w: number }[]>((bars, w) => {
  const last = bars[bars.length - 1];
  return [...bars, { x: last ? last.x + last.w + 4 : P + 31, w }];
}, []);

const BIG: CSSProperties = { color: COLORS.ink, fontSize: 52, fontWeight: 800, lineHeight: 1 };
const TAG: CSSProperties = { background: COLORS.purple, color: COLORS.white, fontSize: 21, fontWeight: 800, lineHeight: 1.1, padding: '9px 13px', borderRadius: 10, whiteSpace: 'nowrap', width: 'max-content' };

function Check() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="17" cy="17" r="17" fill={COLORS.checkBg} />
      <path d="M10 17.5l5 5 9.5-10.5" fill="none" stroke={COLORS.accent} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Reference 1: a boarding-pass style ticket, tilted, with a dark barcode stub and a highlight tag. Centred near card point (880, 322). */
export function TicketArt({ data }: { data: TicketData }) {
  return (
    <div data-testid="art" data-rotate="" style={{ position: 'absolute', left: 620, top: 174, width: W, height: H, transform: 'rotate(-6deg)', filter: 'drop-shadow(0 28px 36px rgba(16,73,76,0.18))' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <clipPath id="ticket-clip">
            <path d={SHAPE} />
          </clipPath>
          <linearGradient id="ticket-stub" x1="0" y1="0" x2="1" y2="1">
            {SURFACE_STOPS.map((stop, i) => (
              <stop key={stop} offset={[0, 0.35, 0.7, 1][i]} stopColor={stop} />
            ))}
          </linearGradient>
          <radialGradient id="ticket-glow" cx="1" cy="1" r="0.8">
            <stop offset="0" stopColor={COLORS.purple} stopOpacity="0.35" />
            <stop offset="1" stopColor={COLORS.purple} stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={SHAPE} fill={COLORS.white} />
        <g clipPath="url(#ticket-clip)">
          <rect x={P} y="0" width={W - P} height={H} fill="url(#ticket-stub)" />
          <rect x={P} y="0" width={W - P} height={H} fill="url(#ticket-glow)" />
        </g>
        <path d={`M${P} 26V270`} stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9" />
        {BARS.map((b) => (
          <rect key={b.x} x={b.x} y="30" width={b.w} height="150" rx="1" fill="#fff" />
        ))}
      </svg>
      <div data-fit-box="" style={{ position: 'absolute', left: 28, top: 28, width: 284, height: 240 }}>
        <p data-fit="" className="font-heading" style={{ margin: 0, width: 'max-content', color: COLORS.accent, fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{data.label}</p>
        <div data-fit="" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, width: 'max-content' }}>
          <span className="font-heading" style={BIG}>{data.from}</span>
          <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true">
            <path d="M3 12h32M26 3l10 9-10 9" fill="none" stroke={COLORS.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-heading" style={BIG}>{data.to}</span>
          <span className="font-heading" style={{ marginLeft: 6, alignSelf: 'flex-end', paddingBottom: 9, color: COLORS.body, fontSize: 22, fontWeight: 700 }}>{data.unit}</span>
        </div>
        <ul style={{ margin: '18px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.checks.map((check) => (
            <li key={check} data-fit="" style={{ display: 'flex', alignItems: 'center', gap: 14, width: 'max-content' }}>
              <Check />
              <span className="font-heading" style={{ color: COLORS.ink, fontSize: 24, fontWeight: 700 }}>{check}</span>
            </li>
          ))}
        </ul>
      </div>
      <div data-fit-box="" style={{ position: 'absolute', left: P, top: 0, width: W - P, height: H }}>
        <span data-fit="" className="font-heading" style={{ ...TAG, position: 'absolute', right: 14, bottom: 22 }}>{data.tag}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write `SplitArt.tsx`**

Create `components/pages/blog/thumbnail/SplitArt.tsx`. The art box covers card x 620 to 1160; the slanted panel polygon runs (680,0) (1160,0) (1160,635) (620,635); the rows sit at card x 740.

```tsx
import type { CSSProperties } from 'react';
import type { SplitData } from './thumbnails';
import { COLORS, SURFACE_STOPS } from './tokens';

const PANEL = '680,0 1160,0 1160,635 620,635';
/** Top of each row block inside the rows box, and the shared bar heights (24 bars, 8px wide, 7px apart). */
const ROW_TOPS = [95, 235, 375];
const BAR_HEIGHTS = [22, 38, 52, 30, 60, 44, 26, 54, 36, 18, 48, 62, 40, 24, 56, 34, 20, 50, 42, 28, 58, 32, 46, 22];
/** The bar the tag's connector hangs from, and its centre x. */
const PINNED = 17;
const PINNED_X = PINNED * 15 + 4;

const TAG: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px 10px 14px', borderRadius: 12, background: COLORS.purple, color: COLORS.white, fontSize: 26, fontWeight: 800, lineHeight: 1.1, whiteSpace: 'nowrap', width: 'max-content' };

/** Reference 2: a slanted dark panel with labelled waveform rows; one row is bright and carries the highlight tag. */
export function SplitArt({ data }: { data: SplitData }) {
  return (
    <div data-testid="art" style={{ position: 'absolute', left: 620, top: 0, width: 540, height: 635 }}>
      <svg width="540" height="635" viewBox="620 0 540 635" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="split-surface" gradientUnits="userSpaceOnUse" x1="620" y1="0" x2="1160" y2="635">
            {SURFACE_STOPS.map((stop, i) => (
              <stop key={stop} offset={[0, 0.35, 0.7, 1][i]} stopColor={stop} />
            ))}
          </linearGradient>
          <radialGradient id="split-glow" gradientUnits="userSpaceOnUse" cx="1160" cy="635" r="420">
            <stop offset="0" stopColor={COLORS.purple} stopOpacity="0.35" />
            <stop offset="1" stopColor={COLORS.purple} stopOpacity="0" />
          </radialGradient>
        </defs>
        <polygon points={PANEL} fill="url(#split-surface)" />
        <polygon points={PANEL} fill="url(#split-glow)" />
        <circle cx="1130" cy="40" r="130" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="2" />
        <circle cx="1130" cy="40" r="80" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="2" />
      </svg>
      <div data-fit-box="" style={{ position: 'absolute', left: 120, top: 0, width: 370, height: 635 }}>
        {data.rows.map((label, i) => {
          const lit = i === data.highlight;
          return (
            <div key={label} data-highlight={lit ? '' : undefined} style={{ position: 'absolute', left: 0, top: ROW_TOPS[i], width: 370, height: 110 }}>
              <p data-fit="" className="font-heading" style={{ margin: 0, width: 'max-content', color: COLORS.white, fontSize: 30, fontWeight: 800, lineHeight: 1.15, opacity: lit ? 1 : 0.85 }}>{label}</p>
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 44, width: 370, height: 64, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '3px dotted rgba(255,255,255,0.4)' }} />
                {BAR_HEIGHTS.map((h, j) => (
                  <span key={j} style={{ position: 'relative', flex: 'none', width: 8, height: h, borderRadius: 4, background: COLORS.white, opacity: lit ? 1 : 0.5 }} />
                ))}
              </div>
              {lit ? (
                <>
                  <span aria-hidden="true" style={{ position: 'absolute', left: PINNED_X - 6, top: 95, width: 12, height: 12, borderRadius: 6, background: COLORS.white }} />
                  <span aria-hidden="true" style={{ position: 'absolute', left: PINNED_X - 1.5, top: 101, width: 3, height: 21, background: COLORS.white }} />
                  <span data-fit="" className="font-heading" style={{ ...TAG, position: 'absolute', right: 0, top: 122 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 21V4" />
                      <path d="M5 4h12l-2.5 4L17 12H5" />
                    </svg>
                    {data.tag}
                  </span>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Write `BandArt.tsx`**

Create `components/pages/blog/thumbnail/BandArt.tsx`. The band covers card x 56 to 1104, y 375 to 575.

```tsx
import type { CSSProperties } from 'react';
import type { BandData } from './thumbnails';
import { COLORS, SURFACE_BG } from './tokens';

const CHIP: CSSProperties = { display: 'inline-flex', alignItems: 'center', height: 56, padding: '0 24px', borderRadius: 14, fontSize: 28, fontWeight: 800, lineHeight: 1, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.14)' };

/** Reference 3: a dark gradient band of pill chips in two centred rows, one highlighted, with faint rings and dots behind. */
export function BandArt({ data }: { data: BandData }) {
  const rows = [data.chips.slice(0, 3), data.chips.slice(3)].filter((row) => row.length > 0);
  return (
    <div data-testid="art" data-fit-box="" style={{ position: 'absolute', left: 56, top: 375, width: 1048, height: 200, borderRadius: 28, overflow: 'hidden', background: SURFACE_BG }}>
      <svg width="1048" height="200" viewBox="0 0 1048 200" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <circle cx="930" cy="40" r="150" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
        <circle cx="930" cy="40" r="95" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
        <circle cx="70" cy="180" r="46" fill="#fff" fillOpacity="0.07" />
        {[0, 1, 2].flatMap((row) => [0, 1, 2, 3, 4].map((col) => <circle key={`${row}-${col}`} cx={130 + col * 22} cy={30 + row * 22} r="2.5" fill="#fff" fillOpacity="0.25" />))}
        <path d="M985 150h24M997 138v24" stroke="#fff" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
        {rows.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: 14 }}>
            {row.map((chip, c) => {
              const lit = r * 3 + c === data.highlight;
              return (
                <span key={chip} data-fit="" className="font-heading" style={{ ...CHIP, background: lit ? COLORS.purple : COLORS.white, color: lit ? COLORS.white : COLORS.deep }}>
                  {chip}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Write `PostThumbnail.tsx`**

Create `components/pages/blog/thumbnail/PostThumbnail.tsx`:

```tsx
import { BandArt } from './BandArt';
import { SplitArt } from './SplitArt';
import { TicketArt } from './TicketArt';
import { ThumbnailFrame } from './ThumbnailFrame';
import { THUMBNAILS, hasThumbnail, type ThumbnailSpec } from './thumbnails';

/** A thumbnail from a copy spec, drawn at exact pixel size (1200 x 675) so a screenshot of it is the PNG. */
export function Thumbnail({ spec }: { spec: ThumbnailSpec }) {
  return (
    <ThumbnailFrame spec={spec}>
      {spec.layout === 'ticket' ? <TicketArt data={spec} /> : spec.layout === 'split' ? <SplitArt data={spec} /> : <BandArt data={spec} />}
    </ThumbnailFrame>
  );
}

/** The thumbnail for a blog post. Only the render route shows it; the site serves the PNG. */
export function PostThumbnail({ slug }: { slug: string }) {
  if (!hasThumbnail(slug)) throw new Error(`No thumbnail for post "${slug}"; add an entry to components/pages/blog/thumbnail/thumbnails.ts`);
  return <Thumbnail spec={THUMBNAILS[slug]} />;
}
```

- [ ] **Step 8: Run the unit tests to verify they pass**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/blog-thumbnail-template.test.tsx tests/unit/blog-thumbnail-copy.test.ts tests/unit/blog-thumbnail-contrast.test.ts`
Expected: PASS. If a `toHaveStyle` assertion fails, print `element.getAttribute('style')` to see what jsdom kept: colours, `background` and `white-space` are set inline and should appear. If `toHaveStyle({ background: ... })` is unreliable in jsdom for a hex value, assert on `backgroundColor` instead for the two chip checks. Keep the assertion's intent (which colour, one line); only change how it is read.

- [ ] **Step 9: Lint**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npm run lint`
Expected: no errors in the new files.

- [ ] **Step 10: Checkpoint (no commit, no push)**

Run: `cd /Users/samarthkumar/CBT/cbt-site && git status --short components/pages/blog tests/unit`
Expected: new files untracked; nothing staged.

---

### Task 3: Render routes, layout tests, visual tuning

**Files:**
- Create: `app/kit/thumbnail/[slug]/page.tsx`
- Create: `app/kit/thumbnail/page.tsx`
- Test: `tests/e2e/blog-thumbnails.spec.ts`

**Interfaces:**
- Consumes: `PostThumbnail`, `Thumbnail` (Task 2); `THUMBNAILS`, `hasThumbnail`.
- Produces:
  - `GET /kit/thumbnail/<slug>`: 200 with the thumbnail at (0, 0), 1200 × 675, for the three slugs; 404 otherwise.
  - `GET /kit/thumbnail`: a page with one `<a data-slug="<slug>">` per thumbnail, each showing the thumbnail at 400px wide.

- [ ] **Step 1: Write the failing e2e tests**

Create `tests/e2e/blog-thumbnails.spec.ts`:

```ts
import { expect, test } from '@playwright/test';
import { POSTS } from '../../components/pages/blog/posts';
import { THUMBNAILS } from '../../components/pages/blog/thumbnail/thumbnails';

const SLUGS = Object.keys(THUMBNAILS);
const WITHOUT = POSTS.find((p) => !Object.prototype.hasOwnProperty.call(THUMBNAILS, p.slug))!;

test.describe('thumbnail render route', () => {
  test.use({ viewport: { width: 1200, height: 675 } });

  for (const slug of SLUGS) {
    test.describe(slug.slice(0, 32), () => {
      test('is exactly 1200 x 675', async ({ page }) => {
        const res = await page.goto(`/kit/thumbnail/${slug}`);
        expect(res?.status()).toBe(200);
        expect(await page.getByTestId('thumbnail').boundingBox()).toMatchObject({ x: 0, y: 0, width: 1200, height: 675 });
      });

      test('uses the brand heading font and keeps each headline part on one line inside the text block', async ({ page }) => {
        await page.goto(`/kit/thumbnail/${slug}`);
        const m = await page.evaluate(() => {
          const rect = (id: string) => {
            const b = document.querySelector(`[data-testid="${id}"]`)!.getBoundingClientRect();
            return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, height: b.height };
          };
          const lead = document.querySelector('[data-testid="headline-lead"]')!;
          return { text: rect('text'), lead: rect('headline-lead'), accent: rect('headline-accent'), font: getComputedStyle(lead).fontFamily };
        });
        expect(m.font).toMatch(/Nunito/);
        // 56px x 1.12 = 62.7px per line; a second line would double it.
        expect(m.lead.height).toBeLessThan(70);
        expect(m.accent.height).toBeLessThan(70);
        for (const part of [m.lead, m.accent]) {
          expect(part.left).toBeGreaterThanOrEqual(76 - 1);
          expect(part.right).toBeLessThanOrEqual(m.text.right + 0.5);
        }
      });

      test('text and illustration do not overlap, and the illustration stays inside the card', async ({ page }) => {
        await page.goto(`/kit/thumbnail/${slug}`);
        const g = await page.evaluate(() => {
          const rect = (id: string) => {
            const b = document.querySelector(`[data-testid="${id}"]`)!.getBoundingClientRect();
            return { left: b.left, right: b.right, top: b.top, bottom: b.bottom };
          };
          return { layout: (document.querySelector('[data-testid="thumbnail"]') as HTMLElement).dataset.layout, text: rect('text'), art: rect('art'), card: rect('card') };
        });
        if (g.layout === 'band') expect(g.text.bottom).toBeLessThanOrEqual(g.art.top);
        else expect(g.text.right).toBeLessThanOrEqual(g.art.left);
        expect(g.art.left).toBeGreaterThanOrEqual(g.card.left);
        expect(g.art.right).toBeLessThanOrEqual(g.card.right);
        expect(g.art.top).toBeGreaterThanOrEqual(g.card.top);
        expect(g.art.bottom).toBeLessThanOrEqual(g.card.bottom);
      });

      test('every labelled element fits inside its box', async ({ page }) => {
        await page.goto(`/kit/thumbnail/${slug}`);
        const r = await page.evaluate(() => {
          // Measure the ticket untilted so its boxes are axis-aligned.
          document.querySelectorAll<HTMLElement>('[data-rotate]').forEach((el) => (el.style.transform = 'none'));
          const outside: string[] = [];
          const fits = document.querySelectorAll<HTMLElement>('[data-fit]');
          fits.forEach((el) => {
            const box = el.closest('[data-fit-box]');
            if (!box) return void outside.push(`${el.textContent}: no box`);
            const a = el.getBoundingClientRect();
            const b = box.getBoundingClientRect();
            if (a.left < b.left - 1 || a.right > b.right + 1 || a.top < b.top - 1 || a.bottom > b.bottom + 1) outside.push(`${el.textContent}: outside its box`);
          });
          return { count: fits.length, outside };
        });
        expect(r.count).toBeGreaterThanOrEqual(3);
        expect(r.outside).toEqual([]);
      });
    });
  }

  test('the header and cookie banner never sit over the thumbnail, even without cookie consent', async ({ page }) => {
    await page.goto(`/kit/thumbnail/${SLUGS[0]}`); // consent deliberately not set, so the banner shows
    await page.waitForTimeout(800); // the banner mounts after hydration
    const covered = await page.evaluate(() => {
      const root = document.querySelector('[data-testid="thumbnail"]')!;
      const points = [[5, 5], [1195, 5], [5, 670], [1195, 670], [600, 337], [600, 20]];
      return points.filter(([x, y]) => !root.contains(document.elementFromPoint(x, y))).length;
    });
    expect(covered).toBe(0);
  });

  test('an unknown slug, a post with no thumbnail, and inherited object keys are all a 404', async ({ page }) => {
    for (const slug of ['not-a-post', WITHOUT.slug, 'constructor', '__proto__', 'toString']) {
      expect((await page.goto(`/kit/thumbnail/${slug}`))?.status(), slug).toBe(404);
    }
  });

  test('the index lists every thumbnail once, by slug', async ({ page }) => {
    await page.goto('/kit/thumbnail');
    const slugs = await page.locator('[data-slug]').evaluateAll((els) => els.map((el) => el.getAttribute('data-slug')));
    expect(slugs.sort()).toEqual([...SLUGS].sort());
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Stop any server already on port 3100 first (`lsof -ti :3100 | xargs kill` if it prints a PID), because the config reuses a running server and it would serve an old build.

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx playwright test tests/e2e/blog-thumbnails.spec.ts`
Expected: the config builds, then FAIL (the routes do not exist yet, so the pages 404).

- [ ] **Step 3: Write the render route**

Create `app/kit/thumbnail/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostThumbnail } from '@/components/pages/blog/thumbnail/PostThumbnail';
import { THUMBNAILS, hasThumbnail } from '@/components/pages/blog/thumbnail/thumbnails';

export const metadata: Metadata = { title: 'Thumbnail', robots: { index: false, follow: false } };

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(THUMBNAILS).map((slug) => ({ slug }));
}

/**
 * One blog thumbnail at exact pixel size, for tools/render-thumbnails.mjs to screenshot.
 * Pinned over the header, footer and cookie banner so none of them can appear in the image.
 */
export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!hasThumbnail(slug)) notFound();
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 2147483647 }}>
      <PostThumbnail slug={slug} />
    </div>
  );
}
```

- [ ] **Step 4: Write the index page**

Create `app/kit/thumbnail/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { PostThumbnail } from '@/components/pages/blog/thumbnail/PostThumbnail';
import { THUMBNAILS } from '@/components/pages/blog/thumbnail/thumbnails';

export const metadata: Metadata = { title: 'Thumbnails', robots: { index: false, follow: false } };

/** Every blog thumbnail at 400px wide, for review. tools/render-thumbnails.mjs reads the slugs from the data-slug attributes. */
export default function Page() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: '120px 24px 48px' }}>
      {Object.keys(THUMBNAILS).map((slug) => (
        <Link key={slug} data-slug={slug} href={`/kit/thumbnail/${slug}`} style={{ display: 'block', width: 400, height: 225, overflow: 'hidden', borderRadius: 12 }}>
          <div style={{ width: 1200, height: 675, transform: 'scale(0.33333)', transformOrigin: 'top left' }}>
            <PostThumbnail slug={slug} />
          </div>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Run the e2e tests**

Stop any server on port 3100 first.

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx playwright test tests/e2e/blog-thumbnails.spec.ts`
Expected: PASS for all. If a fit or overlap test fails, the message names the element: go to Step 7 (tuning), fix, and re-run. If `toMatch(/Nunito/)` fails, check how `font-heading` resolves in `app/globals.css` (`--font-heading`) and that the classes are applied to the headline.

- [ ] **Step 6: Visual check of all three, against the references**

Start the dev server and screenshot each thumbnail:

```bash
cd /Users/samarthkumar/CBT/cbt-site && (npm run dev -- -p 3105 > /dev/null 2>&1 &) ; sleep 8
S=/private/tmp/claude-501/-Users-samarthkumar-CBT-cbt-site/65ceaeea-6325-48be-892f-64aca5182c44/scratchpad
for slug in early-intervention-is-the-key-to-managing-autism the-startling-truth-about-screen-time-and-autism the-transformative-power-of-physical-activities-for-children-with-autism; do
  npx playwright screenshot --viewport-size=1200,675 --wait-for-timeout=2500 "http://localhost:3105/kit/thumbnail/$slug" "$S/$slug.png"
done
ls "$S"
```

Open each PNG with the Read tool, next to its reference (`images/1.png` ticket, `images/2.png` split, `images/3.png` band), and check every item for all three:

1. **Frame:** light outer frame, white rounded card with a hairline border and soft shadow; nothing touches the card edge except the dark surfaces, which are clipped by its corners.
2. **Text:** eyebrow is a purple dash plus bold purple label; the headline is two lines, near-black then teal; the descriptor is lighter and smaller. Fonts are Nunito (rounded) and Open Sans, not Arial or a serif.
3. **Placement matches the reference:** ticket text vertically centred with the tilted ticket right; split panel slants with the heading upper-left and the descriptor pinned bottom-left; band text across the top with the band below.
4. **Illustration quality:** ticket notches are clean half-circles, the dotted perforation and barcode sit on the dark stub, the check circles and tag are crisp; split rows have dotted tracks, the bright row stands out and the tag's connector lands on a bar; band chips are evenly spaced in two centred rows with the highlight chip clearly different.
5. **Hierarchy and white space:** the headline is the first thing read; there is breathing room around every block; the illustration is heavy enough to balance the text.
6. **Campaign:** side by side they share frame, type, colours, surface gradient, chip and tag style; only layout and illustration differ.
7. **Brand:** only CognitiveBotics colours (teal, purple, white, grey), no yellow, no logo.

- [ ] **Step 7: Tune until the checks hold**

Adjust numbers only (positions, sizes, gaps, opacities), never the spec copy or structure. Typical fixes:
- Ticket text touching the stub or tag spilling out of the stub: reduce `TAG` font size or padding in `TicketArt.tsx`, or move content (`left`, `top`) in the main box.
- Tag connector not meeting a bar, or the chip off-balance: adjust `PINNED`, `ROW_TOPS` and the tag `top` in `SplitArt.tsx`.
- Headline wider than its text block: reduce the headline `fontSize` in `ThumbnailFrame.tsx` from 56 to 52, and update the Global Constraints and the spec's type table.
- Anything that fails an e2e fit or overlap test: fix the geometry; do not loosen the test.

After each change re-run the screenshots (Step 6) and `npx vitest run tests/unit/blog-thumbnail-template.test.tsx`. Stop the dev server when done: `lsof -ti :3105 | xargs kill`.

- [ ] **Step 8: Re-run everything for this task**

Stop any server on port 3100, then:

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/blog-thumbnail-copy.test.ts tests/unit/blog-thumbnail-contrast.test.ts tests/unit/blog-thumbnail-template.test.tsx && npx playwright test tests/e2e/blog-thumbnails.spec.ts && npm run lint`
Expected: all PASS; lint clean for the new files.

- [ ] **Step 9: Checkpoint (no commit, no push)**

Run: `cd /Users/samarthkumar/CBT/cbt-site && git status --short app/kit tests components/pages/blog`
Expected: new files untracked; nothing staged.

---

### Task 4: Render script and the 3 PNGs

**Files:**
- Create: `tools/render-thumbnails.mjs`
- Create (generated): `public/blog/thumbs/<slug>.png` (3 files)
- Modify: `package.json` (scripts)
- Test: `tests/unit/blog-thumbnail-files.test.ts`

**Interfaces:**
- Consumes: `THUMBNAILS` (Task 1), the render route and index page (Task 3).
- Produces: `npm run thumbnails`, and `public/blog/thumbs/<slug>.png` at 1200 × 675 for every slug in `THUMBNAILS`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/blog-thumbnail-files.test.ts`:

```ts
// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { THUMBNAILS } from '@/components/pages/blog/thumbnail/thumbnails';

/** Width and height from a PNG's IHDR chunk. */
function pngSize(file: string) {
  const b = readFileSync(file);
  expect(b.subarray(1, 4).toString('latin1'), `${file} is a PNG`).toBe('PNG');
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

describe('rendered blog thumbnails', () => {
  it.each(Object.keys(THUMBNAILS))('%s has a 1200x675 PNG', (slug) => {
    const file = join(process.cwd(), 'public/blog/thumbs', `${slug}.png`);
    expect(existsSync(file), `missing ${file}; run npm run thumbnails`).toBe(true);
    expect(pngSize(file)).toEqual({ width: 1200, height: 675 });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/blog-thumbnail-files.test.ts`
Expected: FAIL for all three, "missing .../public/blog/thumbs/<slug>.png; run npm run thumbnails".

- [ ] **Step 3: Write the render script**

Create `tools/render-thumbnails.mjs`:

```js
// Renders a 1200x675 PNG for every blog thumbnail listed in components/pages/blog/thumbnail/thumbnails.ts.
// `npm run thumbnails` builds the site first, then this serves the build, reads the slug list from /kit/thumbnail
// and screenshots /kit/thumbnail/<slug>. Re-run it after changing a thumbnail's copy or the template.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PORT = process.env.PORT ?? '3101';
const BASE = `http://localhost:${PORT}`;
const OUT = 'public/blog/thumbs';
const WIDTH = 1200;
const HEIGHT = 675;

const up = (url) => fetch(url).then((r) => r.ok, () => false);

if (await up(BASE)) throw new Error(`something is already serving ${BASE}; stop it or set PORT to a free port`);

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', PORT], { stdio: 'ignore' });
let exited = false;
server.on('exit', () => (exited = true));

try {
  for (let i = 0; !(await up(`${BASE}/kit/thumbnail`)); i++) {
    if (exited || i >= 60) throw new Error('the site did not start; run `npm run build` and check it passes');
    await new Promise((r) => setTimeout(r, 1000));
  }
  const index = await fetch(`${BASE}/kit/thumbnail`).then((r) => r.text());
  const slugs = [...new Set([...index.matchAll(/data-slug="([^"]+)"/g)].map((m) => m[1]))];
  if (!slugs.length) throw new Error(`${BASE}/kit/thumbnail lists no thumbnails`);
  mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
    // same key as components/shared/cookie-key.ts
    await ctx.addInitScript(() => localStorage.setItem('cb-cookie-consent', 'rejected'));
    for (const slug of slugs) {
      const page = await ctx.newPage();
      await page.goto(`${BASE}/kit/thumbnail/${slug}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const shot = await page.getByTestId('thumbnail').screenshot({ animations: 'disabled' });
      const file = `${OUT}/${slug}.png`;
      await sharp(shot).png({ compressionLevel: 9 }).toFile(file);
      const { width, height } = await sharp(file).metadata();
      if (width !== WIDTH || height !== HEIGHT) throw new Error(`${file} is ${width}x${height}, expected ${WIDTH}x${HEIGHT}`);
      console.log(`wrote ${file}`);
      await page.close();
    }
    await ctx.close();
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}
```

- [ ] **Step 4: Add the npm script**

In `package.json`, add after the `"verify"` line (and add a comma to that line):

```json
    "verify": "node tools/verify-page.mjs",
    "thumbnails": "next build && node tools/render-thumbnails.mjs"
```

- [ ] **Step 5: Render the PNGs**

Make sure nothing serves port 3101, then:

Run: `cd /Users/samarthkumar/CBT/cbt-site && npm run thumbnails`
Expected: the build succeeds, then 3 lines `wrote public/blog/thumbs/....png`. If the build fails with a transient error, retry once.

- [ ] **Step 6: Run the file test**

Run: `cd /Users/samarthkumar/CBT/cbt-site && npx vitest run tests/unit/blog-thumbnail-files.test.ts && ls -l public/blog/thumbs`
Expected: PASS (3 tests). Each PNG should be well under 500KB; if any is larger, report the sizes.

- [ ] **Step 7: Look at the real PNGs and a contact sheet**

Open each of the three PNGs in `public/blog/thumbs/` with the Read tool, at full size, and repeat the Task 3 Step 6 checklist on the files themselves (fonts loaded, nothing clipped, header and cookie banner absent). Then make a 3-up sheet at 400px (largest card) and 280px (narrowest card):

```bash
cd /Users/samarthkumar/CBT/cbt-site
S=/private/tmp/claude-501/-Users-samarthkumar-CBT-cbt-site/65ceaeea-6325-48be-892f-64aca5182c44/scratchpad
for W in 400 280; do
  W=$W OUT="$S/sheet-$W.png" node --input-type=module -e "
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const dir = 'public/blog/thumbs';
const files = readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
const W = Number(process.env.W), H = Math.round((W * 9) / 16), gap = 24;
const tiles = await Promise.all(files.map(async (f, i) => ({ input: await sharp(dir + '/' + f).resize(W, H).toBuffer(), left: i * (W + gap) + gap, top: gap })));
await sharp({ create: { width: files.length * (W + gap) + gap, height: H + 2 * gap, channels: 3, background: '#ffffff' } }).composite(tiles).png().toFile(process.env.OUT);
"
done
```

Open `sheet-400.png` and `sheet-280.png` with the Read tool. At 280px wide check: each headline is readable as words, the highlight element in each is still the clearest accent, the three look like one campaign yet are clearly different from each other, and white space still reads as calm rather than empty.

If anything fails, go back to Task 3 Step 7 (tune), then re-run `npm run thumbnails` and this step.

- [ ] **Step 8: Checkpoint (no commit, no push)**

Run: `cd /Users/samarthkumar/CBT/cbt-site && git status --short package.json public/blog tools`
Expected: `package.json` modified, `public/blog/` and `tools/render-thumbnails.mjs` untracked; nothing staged.

---

### Task 5: Document the workflow and verify everything

**Files:**
- Modify: `CLAUDE.md` (Commands and Layout sections)
- Modify: `docs/superpowers/specs/2026-11-04-blog-thumbnail-template-design.md` (status line, plus any type sizes changed during tuning)

- [ ] **Step 1: Document `npm run thumbnails`**

In `CLAUDE.md`, under `## Commands`, add after the `npm run capture` line:

```
- `npm run thumbnails`: builds, then renders a blog thumbnail PNG (1200 × 675) to `public/blog/thumbs/` for every post listed in `components/pages/blog/thumbnail/thumbnails.ts`. Re-run it after changing a thumbnail's copy or the template, and commit the PNGs. `/kit/thumbnail` previews them all.
```

Under `## Layout`, add after the `components/shared/` bullet:

```
- `components/pages/blog/thumbnail/`: the blog thumbnail template. `thumbnails.ts` holds the copy per post; `ThumbnailFrame` draws the shared frame and text; `TicketArt`, `SplitArt` and `BandArt` are the three illustration layouts. It is a render source only; the output is the PNGs in `public/blog/thumbs/`. Three posts have one so far. To add one, add an entry to `thumbnails.ts` (reusing a layout) and run `npm run thumbnails`.
```

- [ ] **Step 2: Update the spec status**

In the spec, change the line `Date: 2026-11-04. Status: revised after reference images, awaiting review. (Supersedes the dark-teal shape-cluster design.)` to `Date: 2026-11-04. Status: implemented.` If tuning changed any type size, spacing or geometry that the spec states (headline size, text widths, ticket size, panel polygon, band position), edit the matching spec text to the final values.

- [ ] **Step 3: Full verification**

Stop any server on ports 3100 and 3101, then run, one after another:

```bash
cd /Users/samarthkumar/CBT/cbt-site
npm run lint
npm test
npm run build
npx playwright test tests/e2e/blog-thumbnails.spec.ts tests/e2e/stories.spec.ts tests/e2e/kit.spec.ts
```

Expected: lint clean; all unit tests pass (including `stories-content.test.ts`); build succeeds (retry once on a transient failure); the listed e2e specs pass. Nothing in the blog cards or post pages changed, so `stories.spec.ts` passing unchanged confirms that.

- [ ] **Step 4: Final checkpoint (no commit, no push)**

Run: `cd /Users/samarthkumar/CBT/cbt-site && git status --short`
Report to Samarth: the three PNG paths, the files created and changed, the test results, that nothing was committed or pushed, and that the blog cards still show the old placeholder cover until they decide to wire the PNGs in. Offer to commit only the thumbnail files (and say that `components/pages/blog/` is untracked, so committing it would include the rest of the blog work).
