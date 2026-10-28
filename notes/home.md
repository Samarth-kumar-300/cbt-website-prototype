# Home page notes

## Requests for read-only files (lead decides)

1. **`app/globals.css` body font bug (affects every page).** `body { font-family: var(--font-sans); }` is unlayered CSS and
   `--font-sans` is declared inside `@theme inline`, so Tailwind never emits it as a custom property. The declaration resolves
   to nothing and beats the `font-sans` utility on `<body>`, so all body copy renders in the system UI font instead of Open Sans
   (headings are fine because `font-heading` is a utility). Fix:
   `font-family: var(--font-open-sans), "Open Sans Fallback", Arial, sans-serif;` (or delete the `font-family` line and rely on
   the `font-sans` class). Verified locally on the home page with this one-line change (then reverted):
   `verify /` goes from FAIL (mismatch 0.045 / 0.014 / 0.065 / 0.024 at 375/768/1024/1440) to PASS
   (0.009 / 0.005 / 0.003 / 0.004, no bad bands except a footer band at 375).
2. **Footer differs from the original** (`components/shared`): the original has an ISO 27001 badge image, a real-icon social row
   at the right above the divider, plain (not letter-spaced) column headings, copyright on the left and legal links on the right
   on desktop. Ours has text social chips ("In", "X", "Li", "Yo"), a text ISO badge, letter-spaced headings and a different bottom row. This is the cause
   of the doc-height gap (-73px at 1440, +240px at 375, -189px at 1024) and of the remaining bad bands near the page end.

## Deviations from the task brief

- **FAQ (Section6)** uses a page-local `HomeFaq.tsx` instead of the shared `FAQ`. The shared FAQ renders a divided list without
  the per-question icon, card border/radius and padding of the original, so it cost 0.03 to 0.06 of mismatch and about 270px of
  height at 1024. `HomeFaq` keeps the scaffolded card markup verbatim, adds the same single-open state (`FAQ_MODE`) and
  `aria-expanded`/`aria-controls`/`role="region"` as the shared one. `faq` still comes from `content.ts` (faq.json). The open-state
  answer styling (`pt-3`, `lg:pl-[52px]`) is my choice; the capture only has the closed state.
  Resolved in Task 16b: Home now renders the shared `components/shared/FaqCards.tsx` (icons from `faq-icons.ts` in the page folder); the open state matches the live original (captured from the live site: card tint, `mt-3 pl-10 lg:mt-4 lg:pl-[52px]` answer panel).
- **Testimonial carousel**: mobile card 2 text is the desktop card 2 text in the mobile card styling (the capture holds only
  mobile card 1). Dots are `role="tab"` with the original aria-labels ("Go to testimonial N"). The desktop prev/next block is
  unchanged: the original has a single page of two cards, so its arrows stay disabled.

## Facts

- Sections 3 and 7 both carry `id="get-in-touch"`, as on the original. Kept.
- Images: 14 slots are real `next/image` files from `public/images/homepage/` (hero, what-is, steps 1-5 on desktop and on mobile,
  growth-looks-different on desktop and mobile). The scaffolder fell back to `Placeholder` for them because the manifest keys carry
  the `medium_`/`small_` prefix (tools/lib/images.mjs makeResolver misses); I swapped them by hand. Slot to file by alt text:
  Hero_Section=herosection-01, What_Is_CBT=whatiscbt, "Observing and understanding..."=steps01, "Turning observations..."=steps02,
  "Building learning activities..."=steps03, "Adapting learning..."=steps04, "Tracking meaningful progress..."=steps05,
  Growth_Looks_Diff=growthlooksdiff. Still `Placeholder` (no local file): the purple wavy path ribbon behind the steps on desktop
  (Section1, label "Image", renders as a small ribbon; the original shows a purple curve) and the two quote-mark images on the
  desktop testimonial cards (Section5). verify masks image rectangles, so e2e asserts the real images render.
- In full-page screenshots the fixed header sits mid-page at 1024 (capture artifact of the scrolled position); not a layout bug.

## Growth path: two versions (temporary)

Home shows the growth path twice. The original (`sections/Section1.tsx`, winding path, scroll-scrubbed) is unchanged. Directly below it,
`sections/JourneyRail.tsx` is the rebuilt version: five equal columns from 1280px, a compact list below, one-time entry animation in
`JourneyRailMotion.tsx`. To keep only one, delete the other's line in `HomePage.tsx`, then remove `extraSections: 1` from `home.spec.ts`.
`npm run verify` (visual diff against the original site) will report the extra section's height until one is removed; that is expected.
Spec: `docs/superpowers/specs/2026-10-13-journey-rail-design.md`.

## Sync to "Homepage — v2.pdf" (see notes/home-audit.md)

- Hero h1, "What is" body (2 paragraphs), "Find your path" eyebrow (uppercase), Governments row removed, testimonial copy (4 quotes), FAQ shows first 3 items, CTA heading and body without full stops.
- Open questions: (1) testimonials desktop layout (PDF shows a 3-up carousel with 3 dots; desktop still shows 2 static cards); (2) FAQ "View All" link target; (3) testimonial quote-mark icons and the "cb" logo beside the heading (still Placeholder / absent); (4) `sections` export in content.ts is stale generator output (unused).
- Frozen, not changed: Section1 growth path eyebrow ("A CHILD'S JOURNEY WITH COGNITIVEBOTICS" in PDF vs "A CHILD'S GROWTH PATH") and JourneyRail*.

## Round 2 image pass (see notes/home-image-audit.md)

- Hero art is now `home-hero-devices.webp` (tablet and phone dashboards, girl and boy kneeling). Growth phones are `home-growth-phones.webp` on desktop and mobile (three phones, no people).
- Testimonial quote marks: desktop cards 1 and 2 use a Nunito 800 quote glyph in green and orange; mobile slides use green, orange, blue, purple. No `Placeholder` is left on Home.
- cb mark (`home-cb-mark.webp`, cropped from the navbar logo) sits at the right of the desktop testimonial heading; that heading row is now left-aligned to match the PDF.
- Open, not image work: (1) desktop testimonials show 2 static cards, PDF shows a 3-up carousel with 3 dots; (2) FAQ icon circles are 38px, PDF 32px (shared `FaqCards`).
