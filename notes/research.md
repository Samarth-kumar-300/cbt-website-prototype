# /research

New page built from the "Research" section of `/resources` (reference/resources/copy.json, id `research`).

- Header: shared `PageHero` (title "Research", subtitle from the original section intro). The section's own h2 was dropped.
- Cards: markup and class strings from the old `resources/sections/Section3.tsx` (git `0a6e411^`), now in `ResearchCard.tsx`; data in `content.ts`. Laid out as a 1-column / 3-column (lg) grid inside `RevealStagger`, matching the original flex-col / flex-row breakpoint.
- Cards link to `/research/<slug>` (detail pages, copy in `studies.ts`). The live site's `/resources/research/<slug>` URLs redirect there (`next.config.ts`).
- CTA: "Want results like these?" / "Book a demo" -> `/try-demo` (same as Testimonials).

Not matched / for the lead:
- Copy was checked against the reference capture only; the live site was not fetched.
- Nav, footer and launch gates untouched; the lead needs to link `/research` and decide whether `/resources` should keep its Research section.
- No build, e2e or verify was run (shared directory); `tests/e2e/research.spec.ts` is untested.
- The cards reuse hardcoded tint colours from the old section (icon/pill pairs); no tokens exist for them.
