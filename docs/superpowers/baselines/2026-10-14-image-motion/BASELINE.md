# Image behaviour baseline (before the image motion system)

Recorded 2026-10-14 on branch `feat/cbt-replica`, HEAD `d600b22`. This is how every image on the site moves **today**, kept so the image motion work (spec `docs/superpowers/specs/2026-10-14-image-motion-design.md`, plan `docs/superpowers/plans/2026-10-14-image-motion.md`) can be rolled back exactly.

## Why git alone cannot restore this

The current behaviour lives partly in **uncommitted** work. These are untracked, so `git revert` or `git checkout` cannot bring them back: `components/shared/ScrollIllustration.tsx`, `Reveal.tsx`, `RevealStagger.tsx`, `TextReveal.tsx`, `tests/e2e/motion-homepage.spec.ts`, `tests/e2e/motion-pages.spec.ts`. Every file the plan edits (except those two test files and `ScrollIllustration.tsx`) also carries uncommitted edits. So this folder holds byte-exact copies of every file the plan will change or delete:

- `files/`: the copies, at their original relative paths.
- `files.sha256`: SHA-256 of each original (`shasum -a 256 -c files.sha256` run from `cbt-site/` tells you whether a file is back to baseline).
- `restore.sh`: puts the copies back and removes the files the plan adds.

## Rolling back

```bash
cd /Users/samarthkumar/CBT/cbt-site
bash docs/superpowers/baselines/2026-10-14-image-motion/restore.sh          # lists what it would do
bash docs/superpowers/baselines/2026-10-14-image-motion/restore.sh --yes    # does it
shasum -a 256 -c docs/superpowers/baselines/2026-10-14-image-motion/files.sha256   # all OK = baseline restored
npx vitest run && PORT=3100 npx playwright test                              # confirm
```

Caveat: restoring overwrites each listed file with its baseline copy, so any edit made to those files **after** the baseline (outside this work) is lost. If other work has landed on them, restore only the files you want, or diff first (`diff -u docs/.../files/<path> <path>`).

## Files the plan adds (removed by a rollback)

`components/shared/image-motion.ts`, `components/shared/MotionImage.tsx`, `tests/unit/image-motion.test.ts`, `tests/unit/motion-image.test.tsx`, `tests/e2e/image-motion.spec.ts`.

## Current behaviour, by mechanism

All motion is disabled under `prefers-reduced-motion: reduce`.

**1. `[data-motion-image]` CSS fade (app/globals.css, "Motion system" block).** An image inside a revealed block fades in and settles from a slight zoom. `transition: opacity 600ms var(--ease-out), transform 600ms var(--ease-out)`. While the parent is pending (`.reveal-group[data-reveal-group="pending"]` or `.reveal[data-reveal="pending"]`) it is `opacity: 0; transform: scale(1.04)`; when shown it is `opacity: 1; transform: none`. The parent state is set by `Reveal.tsx` / `RevealStagger.tsx` (IntersectionObserver; content visible in server HTML, hidden only after mount). Reduced motion: `opacity: 1; transform: none; transition: none`.

**2. `.hero-settle` (+ `.hero-delay-2`) CSS animation.** `@keyframes settle-in { from { opacity: 0; transform: scale(1.04) } to { opacity: 1; transform: none } }`, `animation: settle-in 800ms var(--ease-out) both`, `.hero-delay-2` adds `animation-delay: 300ms`. Plays once on load. Reduced motion: `animation: none !important`.

**3. `ScrollIllustration` (GSAP, `components/shared/ScrollIllustration.tsx`).** Inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`: (a) `gsap.from(el, { x: 40, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { start: 'top 85%', once: true } })`; (b) `gsap.fromTo(el, { scale: 0.96 }, { scale: 1.04, ease: 'none', scrollTrigger: { start: 'top bottom', end: 'bottom top', scrub: true } })`. Static and visible without JS or under reduced motion.

**4. `ScrollStepRotate` (GSAP).** The schools flower's petals turn in 72-degree steps as the section scrolls (`steps={5}`, `stepAngle={72}`), 0.7 s eases, reversible. **Not changed by the plan.** It sits inside the `ScrollIllustration` that the plan replaces.

**5. Journey rail (`JourneyRailMotion`, `.jr-image`).** GSAP entry plus, on `(hover: hover)` with motion allowed: `.jr-step:hover .jr-image { scale: 1.06; rotate: 2deg }` with `transition: scale 350ms cubic-bezier(0.34, 1.56, 0.64, 1), rotate 350ms cubic-bezier(0.34, 1.56, 0.64, 1)`, and a one-shot ring pulse. **Not changed by the plan.**

**6. No motion at all.** Images with none of the mechanisms above are static: they simply appear with the page.

## Per image, today

| Page | Image | Today | Plan changes it? |
|---|---|---|---|
| Home S0 | hero (`herosection-01.webp`) | `.hero-settle .hero-delay-2` | No |
| Home S0 | What is CBT (`whatiscbt.webp`) | `[data-motion-image]` inside a `Reveal` | No |
| Home S1 | journey step images (steps01 to 05, desktop and mobile) | Journey rail GSAP entry, `.jr-image` hover wiggle | No |
| Home S2 | growth, desktop (`growthlooksdiff.webp`) | `ScrollIllustration` (slide-in plus scale scrub 0.96 to 1.04) | **Yes**: `rise` plus `drift` |
| Home S2 | growth, mobile | Static | **Yes**: `rise` |
| Home S5 | quote-mark placeholders | Static | No |
| Therapy S0 | hero devices (`hero-devices.webp`) | `.hero-settle .hero-delay-2` | **Yes**: `tilt` added, settle kept |
| Therapy S1 | therapist photo placeholder | Static | **Yes**: `curtain` |
| Therapy S2 | ten skill images (`skills/*.webp`) | `[data-motion-image]` in cards | No |
| Therapy S4 | dashboard (`extending-development.webp`) | Static | **Yes**: `rise` |
| Therapy S5 | placeholders | Inside `Reveal` or decorative | No |
| Resources S1 | thumbnails | `[data-motion-image]` | No |
| Resources S2 | card image | `[data-motion-image]` | **Yes**: CSS hover zoom added |
| About S2, S3 | 22 avatar frames | `[data-motion-image]`, no hover | **Yes**: CSS hover scale and ring added |
| Parents S0 | hero placeholder | `.hero-settle .hero-delay-2` | No |
| Parents S1, S4, S5 mobile | placeholders | Inside `Reveal`, S1 desktop `[data-motion-image]` | No |
| Parents S5 | desktop placeholder | `ScrollIllustration` | **Yes**: `rise` plus `drift` |
| Schools S0 | hero placeholder | `.hero-settle .hero-delay-2` | No |
| Schools S1 | placeholder | Static | **Yes**: `rise` |
| Schools S3 | photo placeholder | Static | **Yes**: `curtain` |
| Schools S4 | flower (petals and centre) | `ScrollIllustration` wrapping `ScrollStepRotate` | **Yes**: wrapper becomes `MotionImage` `rise`; petal rotation kept |
| Schools S5 | nine icon placeholders | `[data-motion-image]` | No |
| Contact | hero placeholder | `.hero-settle .hero-delay-2` | No |

## Tests that describe today's behaviour

`tests/e2e/motion-homepage.spec.ts` and `tests/e2e/motion-pages.spec.ts` (both untracked) assert on `[data-motion-image]`, `.hero-settle`, `.reveal` and the reveal groups. They must keep passing unchanged after the plan, since the plan does not touch those mechanisms. If one fails afterwards, that is a regression to investigate before anything else.

## Environment at baseline

Next 16.4.0, React 19.3.0, gsap 3.15, `@gsap/react` 2.1.2. 30 `next/image` usages, all `.webp`; 9 `.svg`; no `.png` or `.jpeg` yet.
