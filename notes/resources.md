# Resources page notes

## Verify status (fresh build, port 3105)
- 768 / 1024 / 1440: pass (no bad bands). 375: mismatch 0.058, bad bands 6200-6600 = the shared Footer (see below).
- Page `<section>` heights at 1440 equal the reference (389 439 623 681 648 1162 457; Achievements is 5px short of 653). 375/768/1024 sections were compared visually and match.

## Requests for the lead (read-only files)
1. `lib/stub-routes.ts`: the three Research cards link to `/resources/research/<slug>` (original hrefs). Those paths are not in `STUB_ROUTES` and there is no route, so they 404. Suggest adding `'/resources/research/:slug*'`. Not done by me (read-only).
2. Shared `Footer` differs from the original at 375/768/1024: original shows the A-LIGN ISO 27001 badge image, the Platform/Resources/Company columns in a 2x2 grid at 375, and social icons as real icons on their own row at 1024. Ours shows a text "ISO 27001 certified" tile, a different column layout and text-letter social buttons. This is the whole 375 bad band.
3. Header/smooth-scroll artefact: `app/globals.css` sets `scroll-behavior: smooth` on html, and `tools/verify-page.mjs` waits only 400ms after `scrollTo(0,0)`. The fixed header is therefore captured mid-scroll in some full-page screenshots (it shows lower than in the reference at 375/1024/1440). Not a page issue. The same smooth scroll made the brief's anchor e2e test race (see below).

## Deviations from the brief
- `tests/e2e/resources.spec.ts`: the anchor tests use `expect.poll` for the section's `y` instead of a single `boundingBox()` read. With `scroll-behavior: smooth`, a one-shot read right after `goto` measured mid-scroll (y=1448 for `#research`). The assertions (`0 <= y < 200`) are unchanged.
- The blog-cards test passes with the 6 `/blog/...` hrefs (rewritten to the coming-soon stub, status 200).

## Left as scaffolded
- Placeholders for the Knowledge Base illustration and the "Beyond the label" video poster (no local image in the manifest).
- External cards (Knowledge Base, Achievements PDFs, support CTA) already carry `target="_blank" rel="noopener noreferrer"`; research and blog cards are internal links. `#research` and `#blog` keep `scroll-mt-[120px]`.
