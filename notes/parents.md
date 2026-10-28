### Body font never applies (Open Sans falls back to the system stack) - affects every page
- Type: shared-change-request
- Where: `app/globals.css`, `body { font-family: var(--font-sans); }` (line ~52)
- Detail: `--font-sans` is declared inside `@theme inline`, so Tailwind does not emit it as a CSS variable on `:root`. `var(--font-sans)` in the unlayered `body` rule is therefore invalid at computed-value time, and because unlayered CSS beats the layered `.font-sans` utility on `<body>`, the body computes to the browser default stack (`-apple-system, system-ui, ...`) instead of Open Sans. Headings are unaffected (they use the `font-heading` utility on the element). Effect: body copy wraps differently, section heights drift by 1-3 lines per section (on /parents at 375px: 27px in the hero, 22-66px in "The years that shape everything"), and verify fails at 375/768/1024.
- Fix: replace the declaration with `font-family: var(--font-open-sans), "Open Sans Fallback", Arial, sans-serif;` (or delete it, since `<body className="font-sans">` already sets the family).
- Evidence: with that one-line change applied locally (not committed, `app/globals.css` is read-only for page agents) every top-level section height at 375/768/1024/1440 equals the original exactly and `verify` passes. Without it `verify /parents` reports 6.8%/7.4%/7.3% mismatch at 375/768/1024.

### Parents FAQ uses a page-local accordion instead of the shared FAQ
- Resolved in Task 16b: Parents now renders the shared `components/shared/FaqCards.tsx` (icons from `faq-icons.ts` in the page folder); the open state matches the live original (captured from the live site: card tint, `mt-3 pl-10 lg:mt-4 lg:pl-[52px]` answer panel).
- Type: deviation
- Where: `components/pages/parents/ParentsFaq.tsx`, used by `sections/Section6.tsx`
- Detail: the original parents FAQ is a stack of rounded cards with a tinted icon per question and a teal-tinted open state, not the divided list that `components/shared/FAQ` renders, so the shared component would not match the reference. `ParentsFaq` keeps the shared behavior (`aria-expanded`/`aria-controls`, button toggling, `FAQ_MODE` from `components/shared/faq-config`, region `hidden` when closed) and renders the extra `source` lines and `links` from `reference/parents/faq.json` (items 4 and 5, the "View the Research" and "Read the Published Study" citations). Open-state card heights match the original at 375 and 1440 (1027px and 855px).
- Citation links: per the controller ruling the links follow `reference/parents/faq.json`: each link is a real `<a target="_blank" rel="noopener noreferrer">` whose visible text is the CTA label ("View the Research →", "Read the Published Study →"), with no `aria-label` override. A `source` line equal to a link label is rendered as that link (not repeated as plain text); the other source lines (study title, journal) stay plain text. The two links in answer 4 share a label, so each carries a visually hidden suffix (" (1 of 2)", " (2 of 2)") to give distinct accessible names without changing the layout. The closed-state capture cannot show how the live page renders these answers; the live page (read-only glance) shows the raw URLs as the link text, so the replica's answer 4 and 5 open-state heights differ from the original by the length of those URL lines (numbers in the fix report). The two trailing `<br>` were dropped.

### Footer bands differ in the verify output (shared, not this page)
- Type: unmatched-section
- Where: last band of each width (375: 9800-10000, 768: 7600-7800, 1024: 8000-8200, 1440: 7400-7600); doc height ref/new = 10500/10740, 8282/8335, 8750/8561, 8040/7967
- Detail: all 8 page sections match the original height at every width (with the font fix above); the remaining difference starts exactly where `<footer>` starts (section heights sum to 9964/7767/8122/7569 at 375/768/1024/1440, which is where the footer begins) and is owned by `components/shared/Footer.tsx`. Total mismatch is about 1% at every width, below the 5% threshold.

### Toolkit cards and "Learn more" button have no behavior
- Type: deviation
- Where: `sections/Section1.tsx` ("Learn more, at your own pace" button), `sections/Section4.tsx` (mobile and desktop toolkit cards: Personalised Learning Plans, Progress Reports, Daily Journal)
- Detail: these are `<button>`s with no handler, as scaffolded from the original DOM. The captured reference only shows one static state (first toolkit card styled as selected; the rest with hover styling) and `reference/interactions.json` records no behavior for them, so no selection, scroll or navigation was built. If the original swaps the highlighted card or the image on click, that interaction is not replicated.

### Other deferred scaffold issues
- Type: deviation
- Where: `sections/Section2.tsx` and `sections/Section7.tsx` both carry `id="get-in-touch"` (duplicate id copied from the original DOM); the FAQ answer regions are `role="region"` without an accessible name; image placeholders keep their generic `Image` label.

### PDF sync (v2) open questions
- Round 2 (images): hero, Early differences (desktop and mobile), Learn toolkit composite (desktop and mobile), and Inside-a-session composite (desktop and mobile) are now real artwork, see `notes/parents-image-audit.md`. Still open: the Journal and Progress masters are not wired (tab click does not switch the device image, no behaviour is built), and the "Connecting with others" card icon is a plain user icon where the PDF shows a user with a small arc.
- Type: question
- Hero family illustration (Section0) and "Recognising Early Differences" centre illustration (Section1, desktop and mobile) are not among the PDF's embedded images (`imgs/`), so they stay as Placeholder. Needs the source artwork.
- Inside-a-session blue-purple glow behind the two screenshots is not recreated.
- "View All" on the FAQ expands the two hidden questions in place. The PDF does not say where it should go; if it should link to a full FAQ page, tell me the route.
- "Personalised Learning Plans" is styled as selected (static). If the design expects click-to-select, the interaction needs specifying.
- Section3 (EARLY INTERVENTION) is frozen; differences from the PDF there were not logged.
