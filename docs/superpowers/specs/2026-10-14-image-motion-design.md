# Image motion system: design

Date: 2026-10-14

## Goal

Give the site's images (about 60, across 7 pages) calm, purposeful motion that responds only to scroll or hover. Today nearly every image gets the same CSS fade plus a 1.04 zoom-settle, and photos, mockups, cards and avatars have no interaction. Use GSAP where it adds value. Motion must stay subtle and suit an audience that includes parents of children with developmental needs.

## Decisions

- No idle or looping motion anywhere, including the home hero.
- Approach A: one typed `<MotionImage variant>` wrapper, migrated page by page.
- One motion per image. A reveal and a parallax never stack on the same image.

## Image classification (decided)

The file extension decides the treatment:

- `.png` and `.jpeg`: photos. Opaque rectangles, so frame-based effects (clip-path, inner parallax, hover zoom) are safe.
- `.svg` and `.webp`: illustrations and mockups. They are transparent with no background, so the effect must follow the artwork, not a rectangle. A clip-path or `overflow-hidden` frame would crop shadows or reveal an invisible box, so these never use `curtain` or in-frame `parallax`.
- Avatars: only on the About page (Leadership and team cards), circular crops.

Current state: the repo has no `.png` or `.jpeg` yet (28 `.webp`, 9 `.svg`). Photos and avatars still render as `Placeholder` boxes, so `MotionImage` must also wrap `Placeholder`, and the photo variants will apply as real assets land.

## Variant mapping

### Photos (`.png`, `.jpeg`)

| Use | Variant | Behaviour |
|---|---|---|
| Photos, resource card images | `curtain` | Clip-path inset reveal on enter (once). Inner image settles from 1.12 to 1 over about 0.9 s, `power3.out`. |
| Wide framed photos | `parallax` | Image oversized slightly, drifts +-5% inside its frame with scroll (`scrub: true`, `ease: none`). Desktop and fine pointer only. |
| Cards with a photo | `hover-zoom` | Image scales to 1.05 inside the frame, next to `card-lift`. CSS. |

### Illustrations and mockups (`.svg`, `.webp`, transparent)

| Use | Variant | Behaviour |
|---|---|---|
| Illustrations (hero, growth, journey steps) | `rise` | Enter once: translate up about 24px, opacity 0 to 1, scale 0.97 to 1, `power2.out`. Replaces the side-slide plus the 0.96 to 1.04 scale scrub (which reads as a zoom). |
| Large illustrations | `drift` | Whole image (no frame, so nothing crops) translates +-4% with scroll (`scrub: true`, `ease: none`). Desktop and fine pointer only. |
| Device mockups (therapy-centres hero) | `tilt` | +-3 degrees pointer follow via `gsap.quickTo`, shadow shifts opposite. Eases back on leave. Fine pointer only. |

Per image: one `enter` (`rise` or `curtain`, or `none` where a hero already has a CSS settle) plus at most one `layer` (`drift`, `parallax` or `tilt`). `rise` is the enter and the others are the scroll or hover behaviour, so a reveal and a scroll effect never compete for the same property at the same time.

### Avatars (About page only)

Soft ring and 1.04 scale on hover. CSS. Real photos, when they arrive, may also use `curtain` clipped to the circle.

## Global rules

- Reduced motion: the image is visible and untransformed. No fade, tilt or parallax.
- Touch devices: reveal only. No tilt or parallax.
- Progressive enhancement: the server HTML shows the image fully. Hiding happens only after JS confirms it can animate (same principle as `Reveal.tsx`), so no-JS visitors and crawlers see every image.
- Animate only `transform`, `opacity` and `clip-path`. The one exception is the hover shadow on illustrations, which uses a separate shadow element (transform and opacity), not a `filter`. No layout shift: wrappers keep reserving space via `fill` plus sized frames.

## Structure

All under `cbt-site/components/shared/`:

- `MotionImage.tsx`: client component. Renders a relative frame around a child `next/image` or `Placeholder` (`overflow-hidden` only for photo variants). Props: `enter` (`rise` | `curtain` | `none`, default `rise`), `layer` (`drift` | `parallax` | `tilt` | `none`, default `none`), `className`, `style`. It is a drop-in for the sized `div` that wraps an image today. Pages keep their own `fill`, `sizes` and `alt`, so loading behaviour is unchanged.
- `image-motion.ts`: plain module with no React. Holds variant configs (durations, eases, distances), the `matchMedia` queries, and pure builder functions per variant. Tuning subtlety is a one-file change.
- `app/globals.css`: `hover-zoom` and avatar hover, inside the existing `(hover: hover) and (prefers-reduced-motion: no-preference)` block. Old `[data-motion-image]` rules stay until the last page is migrated, then are deleted.

### Variant lifecycle (curtain as the example)

1. Server renders the image visible and unclipped.
2. After mount, `gsap.matchMedia` checks reduced motion. If motion is allowed, GSAP sets the clip-path inset and inner scale, then a once-only ScrollTrigger plays them.
3. Cleanup via `useGSAP` plus `mm.revert()`, matching `ScrollIllustration`. Safe across route changes and React strict-mode double mounts.
4. No manual refresh is needed: frames have reserved dimensions and ScrollTrigger refreshes on window load.

## Testing

- Vitest (jsdom): unit-test the pure builders in `image-motion.ts`. Test that `MotionImage` renders children visibly and does not animate under reduced motion.
- Playwright e2e:
  - `reducedMotion: 'reduce'`: images visible and untransformed.
  - Desktop: a `rise` illustration reaches full opacity and no transform after scrolling to it. A `curtain` photo placeholder reaches full clip.
  - JS disabled: images visible.
  - No horizontal overflow or layout shift at mobile and desktop widths.
- `npm run verify` (existing visual comparison against the original): no diffs at rest, since animation changes only enter and hover states.

## Rollout (one commit per step)

1. Build `MotionImage` and `image-motion.ts` with tests. Migrate nothing.
2. Therapy-centres: device hero (`tilt`, keeping its CSS settle), dashboard (`rise`), and the therapist photo placeholder (`curtain`, ready for the real asset).
3. Home: `rise` on illustrations, `drift` on the growth image (replacing its scale scrub).
4. Resources (`hover-zoom` cards) and About (avatar hover).
5. Parents and Schools.
6. Keep the `data-motion-image` CSS: images inside already-revealed cards (therapy skills, resource thumbnails, school icons, avatars) keep that fade and get CSS hover only, so a second reveal never stacks on the card's own. Remove `ScrollIllustration` once unused.

## Out of scope

Idle or looping motion, cursor followers, pinned or scrubbed scenes beyond the inner parallax, and changes to the existing text, icon and journey-rail animations.

## Decisions made during planning

- `settle-shadow` is deferred. Viewing the assets showed none that floats without its own ground, so there is nothing for it to improve.
- Blur-up placeholders are dropped. The images are transparent and a blurred preview of a transparent image looks wrong.
- Rule: an image that already sits inside a `Reveal` or `RevealStagger` keeps its CSS `data-motion-image` fade and gets CSS hover only, so two reveals never stack. Only standalone images move to `MotionImage`.
- Per-asset assignment: home hero keeps its CSS settle; home `whatiscbt` keeps its CSS fade (inside a `Reveal`); growth image `rise` plus `drift` (desktop) and `rise` (mobile); therapy hero `tilt` (keeps its CSS settle); therapy dashboard `rise`; therapist photo placeholder `curtain`; schools flower `rise` (petal rotation untouched); schools `object-cover` placeholder (future photo) `curtain`; other standalone `object-contain` placeholders `rise`; parents desktop illustration `rise` plus `drift`; resource card image and About avatars get CSS hover only.
- The ScrollTrigger refresh-on-image-load step is dropped: every frame has reserved dimensions, so loading an image cannot move a trigger, and ScrollTrigger already refreshes on window load.
- The journey rail, text, icon and horizontal-scroller animations are untouched.
