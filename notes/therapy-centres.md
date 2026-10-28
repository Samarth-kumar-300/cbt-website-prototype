# therapy-centres notes

## Requests for read-only files (lead decides)

1. `app/globals.css` (body rule, line ~52): `font-family: var(--font-sans);` resolves to nothing, because `--font-sans`
   is declared inside `@theme inline` and is never emitted as a CSS variable. The unlayered `body` rule also beats the
   layered `font-sans` utility on `<body>`, so the whole site renders in the browser default (system-ui) instead of Open Sans.
   Effect on this page: text is narrower than the original, so paragraphs wrap differently and card heights shift.
   With `font-family: var(--font-open-sans), "Open Sans Fallback", Arial, sans-serif;` in that rule (tested locally, NOT committed),
   `npm run verify -- /therapy-centres` PASSES at all widths (mismatch 0.4% to 0.9%, no bad bands).
   Without it: 1024px fails (mismatch 0.078, bands 3000-3600 and 5000-6600); 375/768/1440 pass.
   This affects every page; it should be fixed once in `globals.css`.
2. Remaining differences after that fix are all in shared chrome, not this page: Footer (different layout and no ISO badge image, so
   total page height differs by 53 to 240px at the bottom), full-page screenshot header placement at 375px, and `.btn` link font
   at 375px (original shows the "Request a Platform Demo" / "Book a Demo" buttons in Nunito bold on mobile; scaffolded class strings are
   identical, so a global rule probably exists in the original that is not in `globals.css`).

## Deviations from the brief

- Step 5 (swap FAQ for shared `<FAQ items={faq} />`) was tried first. The shared FAQ renders a divided list, the original renders five
  rounded cards with a coloured icon per question, so verify showed FAQ bands failing (1440: 208px shorter). Per AGENT_BRIEF rule 1
  (replace only when the render is identical) the card markup is kept in `components/pages/therapy-centres/FaqCards.tsx`, a small
  client component fed by `faq` from `content.ts`, with the same `aria-expanded` toggle and `FAQ_MODE` (single) as the shared FAQ.
  The answer panel styling is an assumption (the original capture only has the collapsed state).
  Resolved in Task 16b: Therapy Centres now renders the shared `components/shared/FaqCards.tsx` (icons from `faq-icons.ts` in the page folder); the open state matches the live original (captured from the live site: card tint, `mt-3 pl-10 lg:mt-4 lg:pl-[52px]` answer panel).
- Images stay exactly as scaffolded: hero and care-beyond-clinic use `next/image` (local files); the beliefs illustration, the ten skill
  icons and the outcomes images are `Placeholder` (no local file), so those image areas differ from the reference (masked by verify).

## PDF sync (v3 doc copy)

See notes/therapy-centres-audit.md. Changes: hero illustration swapped to hero-illustration.webp; What we believe image now what-we-believe-devices.webp, CTA label "Your Workflow, Made Simpler", purple "CognitiveBotics" span; Clinical section mascot (clinical-mascot.webp) on both slots, third stat colour, published line shown as text link at all widths. Skills section (frozen) untouched.

Open questions:
- CTA "Your Workflow, Made Simpler" has no href in the PDF; currently /contact-us.
- Section4.tsx ("Extending developmental care") is not in the PDF and not imported; left in place.
- hero-devices.webp and extending-development.webp are no longer used by the page after this sync (not deleted).
- Captions "For Therapists/For Parents/For Children" are baked into the devices image, not live text.
