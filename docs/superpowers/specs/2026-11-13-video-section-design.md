# Video section (Progress is Priceless)

Date: 2026-11-13. Status: approved, then amended during planning (see the last section).

## Goal

One reusable video section in the CognitiveBotics look: a heading above a large video card that plays the company's Children's Day film. It is built once and placed on several pages later. Placement is a separate step; no existing page changes now.

## Content

Only what was supplied. Nothing else appears in the section.

- **Heading:** Progress is Priceless (exactly as supplied; Title Case is allowed because it is the campaign and film name).
- **Video:** `https://www.youtube.com/watch?v=c7LKzn9LWSo` ("Progress is Priceless | A Children's Day Film | CognitiveBotics", 2:07, CognitiveBotics channel).

No tagline, body text, duration, credit, actors note or link. The component has no slot for them. Adding one later is a new request.

## Decisions already made

- Layout A: heading on top, video below, CognitiveBotics tokens (Nunito headings, Open Sans body, brand teal and purple), existing motion helpers only.
- **One change to the approved layout:** with no text beside the video, a 7/5 split would leave an empty column. The video card takes the full container width under the heading instead.
- The video plays in place. Pressing the poster swaps in the player. There is no dialog.
- The poster is a local copy of YouTube's title card, so the page makes no request to Google until someone presses play.

## Layout

- **Section:** `mx-auto max-w-[1440px] px-5 py-14 lg:px-24 lg:py-[84px]`, the same container as the Home testimonial section. The `section` element also carries `[overflow-wrap:anywhere]`, as the shared `Section` does, so a long heading word cannot overflow. Background set by `tone`: `gradient` (the testimonial gradient `linear-gradient(90deg, #f8eaf2 0%, #f4eff6 50%, #eaf5f2 100%)`), `flat-aqua` (`brand-subtle-bg`), or `white`. Default `gradient`.
- **Stack:** heading, then card. Gap 24px on phones, 40px from `lg`.
- **Heading:** `h2`, left-aligned, `font-heading font-semibold text-brand-teal`, 24/32 on phones, 48/58 from `lg`. Revealed word by word with `TextReveal` (`split="words"`, `trigger="scroll"`).
- **Card:** full container width (1248px at 1440), 16:9, radius 20px on phones and 24px from `lg`, 1.5px `#e4ded4` border, shadow `0px 6px 20px 0px rgba(15,74,77,0.05)`. Fades up once with `Reveal`.
- **Poster:** `next/image` with `fill` inside the 16:9 card, `sizes="(min-width: 1440px) 1248px, (min-width: 1024px) calc(100vw - 192px), 100vw"`. On hover (motion allowed) the image scales to 1.05 through the existing `img-hover-zoom` class.
- **Play badge:** centred circle, `#f8f2f9` fill, purple `content-brand-secondary` triangle, shadow `0px 6px 20px rgba(10,13,18,0.18)`. 72px on phones, 96px from `lg` (the existing card badge is 56/64px; a hero film needs more presence). On hover it scales to 1.05.
- **Breakpoints checked:** 320, 375, 768, 1024, 1280, 1440.

## Behaviour

States: `idle`, `loading`, `playing`.

1. **idle.** A `<button type="button">` fills the card: poster plus badge. Accessible name: "Play film: Progress is Priceless". No iframe exists.
2. **loading** (after press). The poster stays. The badge becomes a ring spinner. An iframe mounts at opacity 0 over the poster with:
   `src="https://www.youtube-nocookie.com/embed/c7LKzn9LWSo?autoplay=1&rel=0&playsinline=1"`,
   `title="Progress is Priceless"`,
   `allow="autoplay; encrypted-media; picture-in-picture; fullscreen"`, `allowFullScreen`,
   `referrerPolicy="strict-origin-when-cross-origin"` (YouTube rejects embeds that send no referrer).
   Focus moves to the iframe, because the button that held it is gone.
3. **playing.** On the iframe's `load` event, or after 6 seconds if it never fires, the iframe fades to opacity 1 over the poster. The badge is removed; the poster stays underneath, inert and hidden from assistive technology, so the fade is a crossfade and no page background shows through. The 6-second fallback lets YouTube's own error message show instead of an endless spinner.

`rel=0` limits end-of-video suggestions to the CognitiveBotics channel. No `modestbranding` (YouTube deprecated it) and no custom controls.

**Reduced motion:** no hover zoom, no badge scale, a static ring instead of a spinning one, instant swap with no fade.

**Without JavaScript:** the poster shows and does not play, as the existing video card behaves.

**Privacy:** the server HTML contains no URL on youtube.com, youtube-nocookie.com, ytimg.com or google.com. The cookie banner does not gate any script today, so no consent logic is added.

## Accessibility

- `<section aria-labelledby>` pointing at the `h2`. The id comes from `useId`, so two sections on one page never share one.
- The whole card is the target (well above 44px). Visible focus ring: 2px brand teal, 4px offset, as on the existing video card.
- Poster alt text describes the image, not the film's message. Draft: "Title card for Progress is Priceless, a Children's Day film from CognitiveBotics. A woman settles a child on a bed while a man sits in the foreground." Final wording is checked against the file at build time.

## Interface

```ts
// lib/films.ts
export type Film = {
  readonly youtubeId: string;
  readonly title: string;      // iframe title and button label
  readonly poster: string;     // /images/video/...
  readonly posterAlt: string;
};
export const PROGRESS_IS_PRICELESS: Film;
export function embedUrl(film: Film): string;   // the player address; encodes the id

// components/shared/VideoSection.tsx (server component)
<VideoSection heading="Progress is Priceless" film={PROGRESS_IS_PRICELESS} tone="gradient" />
```

`FilmPlayer` (`components/shared/FilmPlayer.tsx`, client component) holds the three states and takes `film`. `VideoSection` holds the section, heading and reveal.

## Files

New:
- `lib/films.ts`
- `components/shared/VideoSection.tsx`
- `components/shared/FilmPlayer.tsx`
- `public/images/video/progress-is-priceless-poster.webp`
- `app/kit/video-section/page.tsx`: a noindex preview showing the section on each `tone`, with top padding to clear the fixed header
- `tests/unit/video-section.test.tsx`
- `tests/e2e/video-section.spec.ts`

Modified: `components/shared/TextReveal.tsx` gains an optional `id` prop, passed to the heading. No existing caller changes.

Unchanged: `TestimonialsSection`, `VideoTestimonialCard`, `VideoDialog`, every live page, `globals.css`, and `public/images/index.json` (a one-off import list that omits every newer image, including the Ram Kamal poster). When `TestimonialsSection` is replaced later, its tone map and this one should be merged.

**Poster file.** I download YouTube's `maxresdefault.jpg` once (about 161 KB, 1280 × 720), convert it to WebP with `sharp` (already a dev dependency), and commit only the WebP. The download is a one-time step, not a runtime dependency. Approving this spec approves that download.

## Testing

Unit (Vitest and Testing Library):
1. The `h2` reads exactly "Progress is Priceless" and labels its section.
2. Before any press there is no iframe, and nothing in the document references youtube, ytimg or google.
3. The play button's accessible name is "Play film: Progress is Priceless".
4. Pressing it mounts an iframe with the exact `src`, `title`, `allow` and `referrerpolicy` above, and focus moves to it.
5. The poster stays until the iframe `load` event, then is removed. With fake timers, 6 seconds also reveals the iframe.
6. Each `tone` sets its background.
7. Pressing play twice still leaves one frame.
8. Two sections on one page get different heading ids, each labelling its own section.
9. Rendered on the server, the section shows the heading and poster, has no iframe, and references no YouTube or Google address.
10. The `section` element wraps long words (`[overflow-wrap:anywhere]`).
11. `embedUrl` encodes the id, so a mistyped id containing `/`, `?` or `#` cannot change the address.

End to end (Playwright, `/kit/video-section`):
1. No horizontal overflow at 320, 375, 768, 1024, 1280 and 1440px.
2. The card is 16:9 (within 1px) at 375 and 1440px.
3. No request to youtube, ytimg or google before a press.
4. Tab reaches the play button, and Enter and Space both press it. The iframe appears with the expected `src`. The test does not wait for YouTube to load, so it passes offline.
5. With reduced motion emulated, no animation runs.

Visual check: screenshots in the browser pane at 375, 768, 1024 and 1440px. `npm run lint`, `npm test` and `npm run build` pass before I call it done.

## Not doing

- Placing the section on any page, or changing any existing section.
- Any copy beyond the heading.
- Analytics events, consent gating, captions settings, or a fallback link for networks that block YouTube.

## Open items (none block the build)

1. **Unlisted video.** Embedding works while the video is Unlisted, as long as "Allow embedding" stays on. YouTube's oEmbed check passed on 2026-11-13. Whether to make it Public is your decision.
2. **Poster sharpness.** 1280 × 720 is the largest size YouTube serves. At 1248px wide it will look soft on 2× screens. A 2560 × 1440 export of the title card from the film's studio would fix it; I would swap the file and change nothing else.
3. **Actors note.** The film's description says all characters are played by actors. The section omits it, per your instruction.

## Amendments during planning

Found while writing the implementation plan. None changes what visitors see.

1. **No `public/images/index.json` entry.** The file lists only 12 images from an early import, and no image added since is in it. Registering the poster would add nothing, and the import tool would overwrite it.
2. **`TextReveal` gains an optional `id`.** The section's `aria-labelledby` needs an id on the heading, and `TextReveal` did not accept one. One optional prop; no caller changes.
3. **Focus ring and border structure.** The border is a non-interactive overlay on the card, and the play button is the card itself. Putting the button inside a clipped, bordered box would cut off its focus ring.
4. **Tests 7 to 11 added**, covering double presses, duplicate ids, server HTML, long words and id encoding. The preview page also gets top padding for the fixed header.
5. **Poster zoom follows the button's hover**, not the `img-hover-zoom` class. That class only reacts to its own wrapper, and the play badge sits outside it, so the zoom let go when the pointer reached the badge. Same duration and easing.
6. **Poster stays under the player once playing** (found in the final review). Removing it at the start of the fade let the page background show through for 300 ms.
