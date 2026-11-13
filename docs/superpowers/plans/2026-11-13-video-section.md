# Video section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable video section: a heading above a full-width card that plays the "Progress is Priceless" YouTube film in place, with a noindex preview at `/kit/video-section`.

**Architecture:** `lib/films.ts` holds the film data and the player address. `FilmPlayer` (client component) moves through `idle` (poster button), `loading` (spinner, invisible player frame mounted) and `playing` (frame faded in). `VideoSection` (server component) adds the heading, the background tone and the scroll reveal. `TextReveal` gains an optional `id` so the section can label itself with its heading.

**Tech Stack:** Next.js 16.4 (App Router), React 19.3, Tailwind v4, GSAP helpers already in the repo (`TextReveal`, `Reveal`), Vitest + Testing Library (jsdom), Playwright, sharp.

**Spec:** `docs/superpowers/specs/2026-11-13-video-section-design.md` (read it first; it records the approved design and four amendments made during planning).

All commands run from `/Users/samarthkumar/CBT/cbt-site`.

## Global Constraints

- **Heading text** is exactly `Progress is Priceless`. The section shows no other copy: no tagline, body text, duration, credit, actors note or link.
- **Player address** is exactly `https://www.youtube-nocookie.com/embed/c7LKzn9LWSo?autoplay=1&rel=0&playsinline=1`. The iframe has `referrerPolicy="strict-origin-when-cross-origin"`. No `modestbranding`.
- **Privacy:** the server HTML contains no address on youtube.com, youtube-nocookie.com, ytimg.com or google.com, and no iframe exists until the visitor presses play. The poster is a local file.
- **Design system:** CognitiveBotics tokens only (Nunito headings, Open Sans body, brand teal and purple). Reuse `TextReveal` and `Reveal`. No change to `app/globals.css`. No `uppercase` on text.
- **Reduced motion:** no hover zoom, no badge scale, a static ring instead of a spinning one, no fade.
- **Next.js 16:** do not pass `quality` to `next/image` (only 75 is allowed by default). `AGENTS.md` says to read `node_modules/next/dist/docs/` before Next-specific code; the Next-specific pieces here (`next/image` with `fill`, an App Router page with `metadata`) copy patterns already used in the repo.
- **Git:** never run `git push`. The working tree has unrelated uncommitted files, so stage only the named files; never use `git add -A` or `git add .`. Every commit message ends with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

Inputs and conditions the spec implies but its test list did not cover on its own. Each line has its test in the task named.

1. A visitor double-clicks play: still one player frame, never two. (Task 2)
2. Two video sections on one page (the preview shows three): each heading id is unique and labels its own section. Duplicate ids silently break labelling. (Task 3)
3. A visitor whose JavaScript has not run: the server HTML shows the heading and poster, has no player, and names no Google or YouTube address. (Task 3)
4. A later page passes a heading with a very long word at 320px: it wraps instead of scrolling sideways. (Task 3)
5. A mistyped YouTube id containing `/`, `?` or `#` cannot change the player address. (Task 1)

## File Structure

| File | Responsibility |
|---|---|
| `lib/films.ts` (create) | The `Film` type, the `PROGRESS_IS_PRICELESS` record, `embedUrl()` |
| `public/images/video/progress-is-priceless-poster.webp` (create) | Local 1280 × 720 copy of the film's title card |
| `components/shared/FilmPlayer.tsx` (create, client) | Poster button, spinner, player frame, focus handoff, load fallback |
| `components/shared/VideoSection.tsx` (create, server) | Section, labelled heading, background tone, scroll reveal |
| `components/shared/TextReveal.tsx` (modify) | Optional `id` prop passed to the heading |
| `app/kit/video-section/page.tsx` (create) | Noindex preview: the section on each tone |
| `tests/unit/films.test.ts`, `film-player.test.tsx`, `video-section.test.tsx` (create); `text-reveal-media.test.tsx` (modify) | Unit tests |
| `tests/e2e/video-section.spec.ts` (create) | Browser tests on the preview page |

---

### Task 1: Film data, player address and poster

**Files:**
- Create: `lib/films.ts`
- Create: `public/images/video/progress-is-priceless-poster.webp`
- Test: `tests/unit/films.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Film = { readonly youtubeId: string; readonly title: string; readonly poster: string; readonly posterAlt: string }`
  - `const PROGRESS_IS_PRICELESS: Film`
  - `function embedUrl(film: Film): string`

- [ ] **Step 1: Create the feature branch**

Run: `git switch -c feat/video-section`
Expected: `Switched to a new branch 'feat/video-section'`. The unrelated uncommitted files stay in the working tree.

- [ ] **Step 2: Commit the spec and this plan**

```bash
git add docs/superpowers/specs/2026-11-13-video-section-design.md docs/superpowers/plans/2026-11-13-video-section.md
git commit -m "$(cat <<'EOF'
docs: add video section spec and implementation plan

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Write the failing test**

Create `tests/unit/films.test.ts`:

```ts
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { PROGRESS_IS_PRICELESS, embedUrl } from '@/lib/films';

describe('PROGRESS_IS_PRICELESS', () => {
  it('names the film and its YouTube id', () => {
    expect(PROGRESS_IS_PRICELESS.title).toBe('Progress is Priceless');
    expect(PROGRESS_IS_PRICELESS.youtubeId).toBe('c7LKzn9LWSo');
  });

  it('points at a local 1280 x 720 WebP poster that is light enough for a hero image', async () => {
    expect(PROGRESS_IS_PRICELESS.poster.startsWith('/images/video/')).toBe(true);
    const file = path.join(process.cwd(), 'public', PROGRESS_IS_PRICELESS.poster);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeLessThan(250_000);
    const meta = await sharp(file).metadata();
    expect([meta.format, meta.width, meta.height]).toEqual(['webp', 1280, 720]);
  });

  it('describes the poster in a sentence', () => {
    expect(PROGRESS_IS_PRICELESS.posterAlt.length).toBeGreaterThan(40);
  });
});

describe('embedUrl', () => {
  it('builds the privacy-friendly player address', () => {
    expect(embedUrl(PROGRESS_IS_PRICELESS)).toBe('https://www.youtube-nocookie.com/embed/c7LKzn9LWSo?autoplay=1&rel=0&playsinline=1');
  });

  it('encodes the id so a mistyped one cannot change the address', () => {
    const url = embedUrl({ ...PROGRESS_IS_PRICELESS, youtubeId: 'a/b?x=1#y' });
    expect(url).toBe('https://www.youtube-nocookie.com/embed/a%2Fb%3Fx%3D1%23y?autoplay=1&rel=0&playsinline=1');
  });
});
```

- [ ] **Step 4: Run it and watch it fail**

Run: `npx vitest run tests/unit/films.test.ts`
Expected: FAIL with `Failed to resolve import "@/lib/films"`.

- [ ] **Step 5: Create the poster from YouTube's title card**

This is a one-time download of the company's own thumbnail (about 161 KB). Only the converted WebP is kept in the repo.

```bash
SRC_DIR=$(mktemp -d)
curl -sS -m 30 -o "$SRC_DIR/maxres.jpg" https://i.ytimg.com/vi/c7LKzn9LWSo/maxresdefault.jpg
mkdir -p public/images/video
node --input-type=module -e "import sharp from 'sharp'; await sharp(process.argv[1]).webp({ quality: 85 }).toFile(process.argv[2]);" "$SRC_DIR/maxres.jpg" public/images/video/progress-is-priceless-poster.webp
ls -l public/images/video/
```

Expected: one file, `progress-is-priceless-poster.webp`, under 250,000 bytes.

Then open `public/images/video/progress-is-priceless-poster.webp` with the Read tool. Expected: the title card, with "Progress is Priceless" in white and lavender, the CognitiveBotics logo at top right, and a woman settling a child on a bed with a man in the foreground. If the picture differs from the alt text in Step 6, change the alt text to describe what you see.

- [ ] **Step 6: Write the data module**

Create `lib/films.ts`:

```ts
export type Film = {
  /** The id from the YouTube address (the part after `watch?v=`). */
  readonly youtubeId: string;
  /** Names the play button and the player frame. */
  readonly title: string;
  /** Local copy of the film's title card, in `public/`. */
  readonly poster: string;
  readonly posterAlt: string;
};

/** CognitiveBotics' Children's Day film. The poster is YouTube's own title card, saved locally so the page asks Google for nothing before play. */
export const PROGRESS_IS_PRICELESS: Film = {
  youtubeId: 'c7LKzn9LWSo',
  title: 'Progress is Priceless',
  poster: '/images/video/progress-is-priceless-poster.webp',
  posterAlt: 'Title card for Progress is Priceless, a Children’s Day film from CognitiveBotics. A woman settles a child on a bed while a man sits in the foreground.',
};

/**
 * The player address. youtube-nocookie.com sets no cookies until the visitor plays;
 * rel=0 limits end-of-video suggestions to the film's own channel.
 */
export function embedUrl(film: Film): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(film.youtubeId)}?autoplay=1&rel=0&playsinline=1`;
}
```

- [ ] **Step 7: Run the test and watch it pass**

Run: `npx vitest run tests/unit/films.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 8: Commit**

```bash
git add lib/films.ts tests/unit/films.test.ts public/images/video/progress-is-priceless-poster.webp
git commit -m "$(cat <<'EOF'
feat: add film data, player address and poster for the video section

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: FilmPlayer

**Files:**
- Create: `components/shared/FilmPlayer.tsx`
- Test: `tests/unit/film-player.test.tsx`

**Interfaces:**
- Consumes: `Film`, `embedUrl` from `@/lib/films` (Task 1).
- Produces:
  - `function FilmPlayer({ film }: { film: Film }): JSX.Element` (client component)
  - `const SHOW_FRAME_AFTER_MS = 6000`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/film-player.test.tsx`:

```tsx
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FilmPlayer, SHOW_FRAME_AFTER_MS } from '@/components/shared/FilmPlayer';
import { PROGRESS_IS_PRICELESS as film, embedUrl } from '@/lib/films';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const playButton = () => screen.getByRole('button', { name: 'Play film: Progress is Priceless' });
const frame = () => document.querySelector('iframe');

describe('FilmPlayer before the film is played', () => {
  it('shows the poster and a labelled play button, and no player frame', () => {
    render(<FilmPlayer film={film} />);
    expect(playButton()).toBeInTheDocument();
    expect(screen.getByAltText(film.posterAlt)).toBeInTheDocument();
    expect(frame()).toBeNull();
  });

  it('references nothing from YouTube or Google in the markup', () => {
    const { container } = render(<FilmPlayer film={film} />);
    expect(container.innerHTML).not.toMatch(/youtube|ytimg|google/i);
  });
});

describe('FilmPlayer when played', () => {
  it('mounts the privacy-friendly player in place, with the right attributes', async () => {
    const user = userEvent.setup();
    render(<FilmPlayer film={film} />);
    await user.click(playButton());
    const f = frame()!;
    expect(f).toHaveAttribute('src', embedUrl(film));
    expect(f).toHaveAttribute('title', 'Progress is Priceless');
    expect(f.getAttribute('allow')).toMatch(/autoplay/);
    expect(f.getAttribute('allow')).toMatch(/fullscreen/);
    expect(f).toHaveAttribute('allowfullscreen');
    expect(f).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  });

  it('moves focus to the player frame, because the button that held it goes away', async () => {
    const user = userEvent.setup();
    render(<FilmPlayer film={film} />);
    await user.click(playButton());
    expect(frame()).toHaveFocus();
  });

  it('keeps the poster until the frame has loaded, then removes the button and shows the frame', async () => {
    const user = userEvent.setup();
    render(<FilmPlayer film={film} />);
    await user.click(playButton());
    expect(playButton()).toBeDisabled();
    expect(frame()).toHaveClass('opacity-0');
    fireEvent.load(frame()!);
    expect(screen.queryByRole('button', { name: /Play film/ })).toBeNull();
    expect(frame()).toHaveClass('opacity-100');
  });

  it('shows the frame after the wait if it never reports loading (blocked or slow network)', () => {
    vi.useFakeTimers();
    render(<FilmPlayer film={film} />);
    fireEvent.click(playButton());
    expect(frame()).toHaveClass('opacity-0');
    act(() => {
      vi.advanceTimersByTime(SHOW_FRAME_AFTER_MS - 1);
    });
    expect(frame()).toHaveClass('opacity-0');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(frame()).toHaveClass('opacity-100');
    expect(screen.queryByRole('button', { name: /Play film/ })).toBeNull();
  });

  it('leaves one frame when the button is pressed twice', async () => {
    const user = userEvent.setup();
    render(<FilmPlayer film={film} />);
    await user.dblClick(playButton());
    expect(document.querySelectorAll('iframe')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx vitest run tests/unit/film-player.test.tsx`
Expected: FAIL with `Failed to resolve import "@/components/shared/FilmPlayer"`.

- [ ] **Step 3: Write the component**

Create `components/shared/FilmPlayer.tsx`:

```tsx
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { embedUrl, type Film } from '@/lib/films';

type Status = 'idle' | 'loading' | 'playing';

/** How long to wait for the frame to report it has loaded. After that it is shown anyway, so a blocked or slow network ends in the player's own message, not a spinner that never stops. */
export const SHOW_FRAME_AFTER_MS = 6000;

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="size-8 text-content-brand-secondary lg:size-10">
      <path d="M5 4.99c0-.972 0-1.457.202-1.725a1 1 0 0 1 .738-.395c.335-.02.74.25 1.548.788l10.515 7.01c.668.446 1.002.668 1.118.949a1 1 0 0 1 0 .766c-.116.28-.45.503-1.118.948l-10.515 7.01c-.809.54-1.213.809-1.548.789a1 1 0 0 1-.738-.395C5 20.467 5 19.98 5 19.01V4.99Z" />
    </svg>
  );
}

function Spinner() {
  return <span className="size-8 rounded-full border-[3px] border-content-brand-secondary/25 border-t-content-brand-secondary motion-safe:animate-spin lg:size-10" />;
}

function Badge({ loading }: { loading: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f8f2f9] shadow-[0px_6px_20px_rgba(10,13,18,0.18)] transition-transform duration-200 motion-safe:group-hover:scale-105 lg:size-24"
    >
      {loading ? <Spinner /> : <PlayIcon />}
    </span>
  );
}

/**
 * A film card. It shows a poster and a play button; nothing from YouTube loads until the
 * visitor presses it. Then the player replaces the poster in the same box.
 * The button is the card itself, outside any clipping box, so its focus ring is never cut off.
 */
export function FilmPlayer({ film }: { film: Film }) {
  const [status, setStatus] = useState<Status>('idle');
  const frame = useRef<HTMLIFrameElement>(null);

  // The play button goes away once the film starts, so hand focus to the player frame.
  useEffect(() => {
    if (status === 'loading') frame.current?.focus();
  }, [status]);

  // A frame that never reports loading is shown after a wait (see SHOW_FRAME_AFTER_MS).
  useEffect(() => {
    if (status !== 'loading') return;
    const timer = window.setTimeout(() => setStatus('playing'), SHOW_FRAME_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="relative aspect-video rounded-[20px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)] lg:rounded-[24px]">
      {status !== 'playing' ? (
        <button
          type="button"
          onClick={() => setStatus('loading')}
          disabled={status === 'loading'}
          aria-label={`Play film: ${film.title}`}
          className="group absolute inset-0 cursor-pointer overflow-hidden rounded-[inherit] bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal disabled:cursor-default"
        >
          <span className="img-hover-zoom absolute inset-0 block">
            <Image src={film.poster} alt={film.posterAlt} fill sizes="(min-width: 1440px) 1248px, (min-width: 1024px) calc(100vw - 192px), 100vw" className="object-cover" />
          </span>
          <Badge loading={status === 'loading'} />
        </button>
      ) : null}
      {status !== 'idle' ? (
        <iframe
          ref={frame}
          src={embedUrl(film)}
          title={film.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setStatus('playing')}
          className={`absolute inset-0 size-full rounded-[inherit] bg-black transition-opacity duration-300 motion-reduce:transition-none ${status === 'playing' ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : null}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border-[1.5px] border-[#e4ded4]" />
    </div>
  );
}
```

- [ ] **Step 4: Run the tests and watch them pass**

Run: `npx vitest run tests/unit/film-player.test.tsx`
Expected: PASS, 7 tests.

- [ ] **Step 5: Lint the new files**

Run: `npx eslint components/shared/FilmPlayer.tsx lib/films.ts`
Expected: no output (clean).

- [ ] **Step 6: Commit**

```bash
git add components/shared/FilmPlayer.tsx tests/unit/film-player.test.tsx
git commit -m "$(cat <<'EOF'
feat: add FilmPlayer, a poster card that plays YouTube in place

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: TextReveal id and VideoSection

**Files:**
- Modify: `components/shared/TextReveal.tsx` (the `Props` type, the function signature, the returned tag)
- Modify: `tests/unit/text-reveal-media.test.tsx` (append one `describe`)
- Create: `components/shared/VideoSection.tsx`
- Test: `tests/unit/video-section.test.tsx`

**Interfaces:**
- Consumes: `FilmPlayer` (Task 2); `Film`, `PROGRESS_IS_PRICELESS` (Task 1); `Reveal` and `TextReveal` from `components/shared`.
- Produces:
  - `TextReveal` accepts `id?: string`
  - `type VideoSectionTone = 'gradient' | 'flat-aqua' | 'white'`
  - `function VideoSection({ heading, film, tone }: { heading: string; film: Film; tone?: VideoSectionTone }): JSX.Element` (server component; `tone` defaults to `'gradient'`)

- [ ] **Step 1: Write the failing TextReveal test**

Append to `tests/unit/text-reveal-media.test.tsx` (after the last `describe` block):

```tsx
describe('TextReveal id', () => {
  it('passes an id through so a section can name itself with its heading', () => {
    render(
      <TextReveal as="h2" split="words" trigger="scroll" id="film-heading">
        Progress is Priceless
      </TextReveal>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'film-heading');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/unit/text-reveal-media.test.tsx`
Expected: the new test FAILS (`Expected the element to have attribute: id="film-heading"`); the two older tests pass. (TypeScript is not checked by Vitest, so the unknown prop does not stop the run.)

- [ ] **Step 3: Add the `id` prop to TextReveal**

In `components/shared/TextReveal.tsx`, add `id` to the props type:

```tsx
type Props = {
  as: 'h1' | 'h2';
  split: 'lines' | 'words' | 'sentences';
  trigger: 'load' | 'scroll';
  /** Only split while this media query matches, so a hidden desktop or mobile copy is never split. */
  media?: string;
  /** Lets a section point aria-labelledby at its heading. */
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};
```

Change the function signature:

```tsx
export function TextReveal({ as: Tag, split, trigger, media, id, className, style, children }: Props) {
```

Change the returned tag (the last statement of the function):

```tsx
  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
```

- [ ] **Step 4: Run the TextReveal tests and watch them pass**

Run: `npx vitest run tests/unit/text-reveal-media.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 5: Write the failing VideoSection tests**

Create `tests/unit/video-section.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { PROGRESS_IS_PRICELESS as film } from '@/lib/films';

// The real TextReveal needs GSAP, which needs window.matchMedia (absent in jsdom). The stand-in keeps the id so labelling can be tested.
vi.mock('@/components/shared/TextReveal', () => ({
  TextReveal: ({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) => (
    <h2 id={id} className={className}>
      {children}
    </h2>
  ),
}));

import { VideoSection } from '@/components/shared/VideoSection';

const HEADING = 'Progress is Priceless';

describe('VideoSection', () => {
  it('shows the heading exactly as supplied and names its section with it', () => {
    render(<VideoSection heading={HEADING} film={film} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(HEADING);
    expect(screen.getByRole('region', { name: HEADING })).toBeInTheDocument();
  });

  it('gives each section its own heading id when two share a page', () => {
    const { container } = render(
      <>
        <VideoSection heading={HEADING} film={film} />
        <VideoSection heading={HEADING} film={film} />
      </>,
    );
    const sections = [...container.querySelectorAll('section')];
    const ids = sections.map((s) => s.querySelector('h2')!.id);
    expect(sections).toHaveLength(2);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);
    sections.forEach((s) => expect(s.getAttribute('aria-labelledby')).toBe(s.querySelector('h2')!.id));
  });

  it('uses the Home gradient by default, and flat aqua or white when asked', () => {
    const { container, rerender } = render(<VideoSection heading={HEADING} film={film} />);
    const style = () => (container.querySelector('section') as HTMLElement).getAttribute('style');
    expect(style()).toContain('rgb(248, 234, 242)');
    rerender(<VideoSection heading={HEADING} film={film} tone="flat-aqua" />);
    expect(style()).toContain('brand-subtle-bg');
    rerender(<VideoSection heading={HEADING} film={film} tone="white" />);
    expect(style()).toMatch(/#fff|rgb\(255, 255, 255\)/i);
  });

  it('wraps long unbroken words instead of overflowing', () => {
    const { container } = render(<VideoSection heading={HEADING} film={film} />);
    expect(container.querySelector('section')!.className).toContain('[overflow-wrap:anywhere]');
  });

  it('renders the heading and poster on the server, with no player frame and no YouTube or Google address', () => {
    const html = renderToString(<VideoSection heading={HEADING} film={film} />);
    expect(html).toContain(HEADING);
    expect(html).toContain('progress-is-priceless-poster');
    expect(html).not.toContain('<iframe');
    expect(html).not.toMatch(/youtube|ytimg|google/i);
  });
});
```

- [ ] **Step 6: Run them and watch them fail**

Run: `npx vitest run tests/unit/video-section.test.tsx`
Expected: FAIL with `Failed to resolve import "@/components/shared/VideoSection"`.

- [ ] **Step 7: Write the section**

Create `components/shared/VideoSection.tsx`:

```tsx
import { useId } from 'react';
import type { Film } from '@/lib/films';
import { FilmPlayer } from './FilmPlayer';
import { Reveal } from './Reveal';
import { TextReveal } from './TextReveal';

const TONES = {
  // The Home testimonial gradient. Merge with TestimonialsSection's copy when that section is replaced.
  gradient: { background: 'linear-gradient(90deg, #f8eaf2 0%, #f4eff6 50%, #eaf5f2 100%)' },
  'flat-aqua': { background: 'var(--color-brand-subtle-bg)' },
  white: { background: '#fff' },
} as const;

export type VideoSectionTone = keyof typeof TONES;

type Props = { heading: string; film: Film; tone?: VideoSectionTone };

/** A heading above one film that plays in place. Content comes in as props, so any page can show any film. */
export function VideoSection({ heading, film, tone = 'gradient' }: Props) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} style={TONES[tone]} className="[overflow-wrap:anywhere]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-14 lg:gap-10 lg:px-24 lg:py-[84px]">
        <TextReveal
          as="h2"
          split="words"
          trigger="scroll"
          id={headingId}
          className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[48px] lg:leading-[58px]"
        >
          {heading}
        </TextReveal>
        <Reveal>
          <FilmPlayer film={film} />
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Run the tests and watch them pass**

Run: `npx vitest run tests/unit/video-section.test.tsx tests/unit/text-reveal-media.test.tsx`
Expected: PASS, 8 tests (5 + 3).

- [ ] **Step 9: Lint**

Run: `npx eslint components/shared/VideoSection.tsx components/shared/TextReveal.tsx`
Expected: no output (clean).

- [ ] **Step 10: Commit**

```bash
git add components/shared/TextReveal.tsx components/shared/VideoSection.tsx tests/unit/text-reveal-media.test.tsx tests/unit/video-section.test.tsx
git commit -m "$(cat <<'EOF'
feat: add VideoSection and an optional id on TextReveal

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Preview page and browser tests

**Files:**
- Create: `app/kit/video-section/page.tsx`
- Test: `tests/e2e/video-section.spec.ts`

**Interfaces:**
- Consumes: `VideoSection` (Task 3), `PROGRESS_IS_PRICELESS` (Task 1); `noConsentBanner`, `overflowAt` from `tests/e2e/helpers.ts`.
- Produces: the route `/kit/video-section` (noindex).

- [ ] **Step 1: Write the failing browser tests**

Create `tests/e2e/video-section.spec.ts`:

```ts
import { expect, test, type Page } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

const ROUTE = '/kit/video-section';
const PLAY = { name: 'Play film: Progress is Priceless' };
const EMBED = 'https://www.youtube-nocookie.com/embed/c7LKzn9LWSo?autoplay=1&rel=0&playsinline=1';
const WIDTHS = [320, 375, 768, 1024, 1280, 1440];

test.beforeEach(async ({ page }) => noConsentBanner(page));

// Answers the player request with an empty page, so these tests need no network and still see the frame load.
async function stubPlayer(page: Page) {
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>stub</title>' }),
  );
}

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    expect(await overflowAt(page, ROUTE, width)).toBeLessThanOrEqual(0);
  });
}

for (const width of [375, 1440]) {
  test(`the card is 16:9 at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(ROUTE);
    const box = await page.getByRole('button', PLAY).first().boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width / box!.height - 16 / 9)).toBeLessThan(0.02);
  });
}

test('nothing from Google or YouTube loads before the film is played', async ({ page }) => {
  const hits: string[] = [];
  page.on('request', (request) => {
    if (/youtube|ytimg|google/i.test(new URL(request.url()).hostname)) hits.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  await page.waitForLoadState('networkidle');
  expect(hits).toEqual([]);
});

test('keyboard users can Tab to the play button', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  const play = page.getByRole('button', PLAY).first();
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    if (await play.evaluate((el) => el === document.activeElement)) break;
  }
  await expect(play).toBeFocused();
});

for (const key of ['Enter', 'Space']) {
  test(`${key} plays the film in place`, async ({ page }) => {
    await stubPlayer(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ROUTE);
    const section = page.locator('main section').first();
    await section.getByRole('button', PLAY).focus();
    await page.keyboard.press(key);
    const frame = section.locator('iframe[title="Progress is Priceless"]');
    await expect(frame).toHaveAttribute('src', EMBED);
    await expect(frame).toHaveCSS('opacity', '1');
    await expect(section.getByRole('button', PLAY)).toHaveCount(0);
  });
}

test('with reduced motion requested, nothing in the section animates while the film starts', async ({ page }) => {
  await stubPlayer(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  const section = page.locator('main section').first();
  await section.getByRole('button', PLAY).click();
  await expect(section.locator('iframe')).toHaveCSS('opacity', '1');
  const running = await section.evaluate((el) => el.getAnimations({ subtree: true }).length);
  expect(running).toBe(0);
});
```

- [ ] **Step 2: Run them and watch them fail**

Run: `npx playwright test tests/e2e/video-section.spec.ts`
Expected: this builds the site and serves it on port 3100 (a few minutes). The route does not exist yet, so the card, keyboard and reduced-motion tests FAIL. The six overflow tests and the no-requests test may pass against the 404 page; that is fine. If the port is busy, run with `PORT=3101`. If Playwright reports a missing browser, run `npx playwright install chromium`. The build uses the whole working tree, which has unrelated uncommitted changes; if it fails in a file this work did not touch, stop and report that instead of fixing it.

- [ ] **Step 3: Create the preview page**

Create `app/kit/video-section/page.tsx`:

```tsx
import { VideoSection } from '@/components/shared/VideoSection';
import { PROGRESS_IS_PRICELESS } from '@/lib/films';

export const metadata = { title: 'Video section', robots: { index: false, follow: false } };

const TONES = ['gradient', 'flat-aqua', 'white'] as const;

// A noindex preview: the section on each background. The header is fixed, so the top padding clears it.
export default function VideoSectionPreview() {
  return (
    <div className="bg-white pt-[116px] lg:pt-[150px]">
      {TONES.map((tone) => (
        <VideoSection key={tone} heading="Progress is Priceless" film={PROGRESS_IS_PRICELESS} tone={tone} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the browser tests and watch them pass**

Run: `npx playwright test tests/e2e/video-section.spec.ts`
Expected: PASS, 13 tests (6 overflow, 2 aspect, 1 no-requests, 1 Tab reach, 2 keyboard, 1 reduced motion).

If the no-requests test fails, the failing address is printed in the diff: it is either this section (a bug) or something else on the page, such as the header or footer (then say so in your report before changing anything).

- [ ] **Step 5: Commit**

```bash
git add app/kit/video-section/page.tsx tests/e2e/video-section.spec.ts
git commit -m "$(cat <<'EOF'
feat: add noindex preview page and browser tests for the video section

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Full checks and visual verification

**Files:** none created. Fixes found here go in the file they belong to, with a test if the fix changes behaviour.

**Interfaces:**
- Consumes: everything above.
- Produces: a verified branch and a short report.

- [ ] **Step 1: Run the full automated checks**

Run each, in order:

```bash
npm run lint
npm test
npm run build
npx playwright test tests/e2e/video-section.spec.ts tests/e2e/kit.spec.ts
```

Expected: lint clean; every unit test passes (including the existing ones that render `TextReveal`: `cta-panel`, `page-hero`, `pricing-*`, `testimonials-section`); the build succeeds and lists `/kit/video-section`; all browser tests pass. If something unrelated to this work fails, report it with the output instead of fixing it.

- [ ] **Step 2: Look at it in a browser**

Run `npm run dev` in the background, then open `http://localhost:3000/kit/video-section` at widths 375, 768, 1024 and 1440 (the browser pane's viewport tool, or Playwright). Save screenshots outside the repo. Check each item against the spec:

1. The heading reads `Progress is Priceless`, left-aligned, teal Nunito, 24px on phones and 48px from 1024px.
2. The card spans the container width, is 16:9, has rounded corners (20px phones, 24px desktop), a thin cream border, and a soft shadow. The poster fills it with no gaps.
3. The play badge is lavender with a purple triangle, 72px on phones and 96px on desktop, centred.
4. Hover (desktop): the poster zooms slightly and the badge grows. Keyboard focus: a teal ring with a gap, not clipped at the corners.
5. Press play: a ring spinner replaces the triangle, then the real YouTube player fades in and starts. Confirm the film actually plays and does not show "Video unavailable" or error 153. When it ends, suggestions come only from the CognitiveBotics channel.
6. The three backgrounds differ: gradient, pale aqua, white.
7. At 320px nothing scrolls sideways.
8. With "Reduce motion" turned on in the system settings: no zoom, no spin, the player appears without a fade.

Stop the dev server when finished.

- [ ] **Step 3: Check the change is contained**

Run: `git diff --stat main...HEAD`
Expected: only these paths: the spec and plan, `lib/films.ts`, `public/images/video/progress-is-priceless-poster.webp`, `components/shared/FilmPlayer.tsx`, `components/shared/VideoSection.tsx`, `components/shared/TextReveal.tsx`, `app/kit/video-section/page.tsx`, and the four test files. No live page, no `globals.css`, no `TestimonialsSection`.

- [ ] **Step 4: Fix anything the checks found, then commit**

If Steps 1 to 3 needed changes, stage only the files you changed and commit with a message that says what was fixed. If they needed none, skip this step.

- [ ] **Step 5: Report**

Report to the user: what was built, the checks that passed (with counts), anything that failed or looked wrong, and the three open items from the spec (Unlisted visibility, poster sharpness, actors note). Then ask where the section should be placed. Do not push.
