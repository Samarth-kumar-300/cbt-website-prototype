### Body font never resolves to Open Sans (affects every page)
- Type: shared-change-request
- Where: `app/globals.css` (`body { font-family: var(--font-sans); }`)
- Detail: `--font-sans` is declared only inside `@theme inline`, so Tailwind never emits it as a `:root` custom property. `var(--font-sans)` in the `body` rule is therefore undefined, and the unlayered `body` rule also beats the `font-sans` utility on `<body>`. Computed body, paragraph and `.btn` font on `/schools` is the system stack (`-apple-system, system-ui, Segoe UI, Roboto...`), not Open Sans (`document.fonts` shows Open Sans `unloaded`). Mobile and tablet paragraph text and the CTA buttons then render visibly narrower than `reference/schools/375.png` and `768.png`. Suggested fix: `font-family: var(--font-open-sans), "Open Sans Fallback", Arial, sans-serif;` in the body rule (or drop that line, since the layout already applies `font-sans`). Verified locally, then reverted: with that one-line change `/schools` verify drops to FAQ-only bands at all four widths (375: 9000-9800, 768: 6400-7000, 1024: 5400-5600 and 9200-10000 before the Section3 fix below, 1440: 6000-6800).

### FAQ is a card list with icons in the original; the shared FAQ is a plain divided list
- Resolved in Task 16b: this page now renders the shared `components/shared/FaqCards.tsx` (icons from `faq-icons.ts` in the page folder); the open state matches the live original (captured from the live site: card tint, `mt-3 pl-10 lg:mt-4 lg:pl-[52px]` answer panel).
- Type: shared-change-request
- Where: Section 7 (`components/pages/schools/sections/Section7.tsx`), `reference/schools/sections/7.html`
- Detail: Following the task brief, the FAQ list is replaced with `<FAQ items={faq} />`. The original renders each question as a rounded bordered white card with a coloured circular icon and a `+` toggle, with 12-14px gaps; `components/shared/FAQ.tsx` renders a flat `divide-y` list with no icons or cards and takes `{q,a}` only. Result: FAQ band height differs (1440: ref 7298 vs 6887) and every remaining verify band at every width is this FAQ area plus the closing CTA and footer that sit below it (shifted). An optional `icon`/`variant="cards"` prop on the shared FAQ would close it. Per-question icon colours and SVGs are in `reference/schools/sections/7.html`.

### Section 3 (tailored implementation) overflowed by 10px at 1024
- Type: deviation
- Where: `components/pages/schools/sections/Section3.tsx`
- Detail: The original overflows the page by 10px at 1024px (the reference PNG is 1034 wide) because the fixed 360px logo wrapper plus the 558px image column do not fit in 832px. The e2e requires no horizontal overflow, so the text column is `lg:shrink-0 lg:basis-[360px]` (still `flex-1`, so it grows to the same width as the original at 1440) and the image column gets `lg:min-w-0 lg:shrink lg:basis-[558px]`, so it shrinks to ~452px at 1024 instead of overflowing. The logo wrapper also got `max-w-full`. Layout at 375, 768 and 1440 is unchanged. At 1024 this means the image is 10px narrower than the original; verify compares the common 1024px so a small mismatch there is expected.

### Placeholders
- Type: unmatched-image
- Where: Sections 0, 1, 3 (logo and image), 5 (nine icons and the scale illustration)
- Detail: Left as scaffolded `Placeholder`s per the brief; only the Bloom image in Section 4 is a real local file. The placeholders collapse to a thin pill, so some bands differ at 375 and 768 (hero, educators image, scale card). Not improvised.

### Test deviation
- Type: deviation
- Where: `tests/e2e/schools.spec.ts`
- Detail: The brief's last test calls `getByRole('link', { name: 'Book a School Demo' })` with `toHaveAttribute`; that locator matches two links (hero and closing CTA) and Playwright strict mode fails. It now asserts every instance links to `/contact-us`.
