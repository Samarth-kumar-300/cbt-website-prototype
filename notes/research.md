# /research

New page built from the "Research" section of `/resources` (reference/resources/copy.json, id `research`).

- Header: shared `PageHero` (title "Research", subtitle from the original section intro). The section's own h2 was dropped.
- Cards: one cream ruled-notepad sheet each (`ResearchCard.tsx`), in a 1-column / 3-column (lg) grid inside `RevealStagger`. The whole sheet is the `<Link>`. Data in `content.ts` is `href`, a short `title` (40 characters max) and a one-sentence `description` (80 characters max, two lines max). The formal paper titles live only on the detail pages (`studies.ts`). Every figure in a description comes from that study's own page.
  - Paper `#fffcf5` with a 1px `#e1e6e8` edge so it reads on the white page. Rules `#eef1f2`, margin line `#e3e8ea`. The title is brand teal (`text-brand-teal`, over 7:1 on the paper) and the description `#4a5658` (7.6:1). Constants sit at the top of the component.
  - Title in the brand heading font (Nunito) at weight 600, 20px mobile / 24px lg, with `text-balance`. Description 15px / 16px, `line-clamp-2`. The sheet stays straight (no tilt); min-height 360px, 460px from lg.
  - Logo: `public/research/logo-symbol.webp` (from `illustrations/logo_symbol.webp`), 28 × 25px, decorative (`alt=""`), top-right at 16px from the top and 20px from the right. The description sits one blank ruled row below the title. The first three ruled rows are left empty for the clip and the logo.
  - Ruling: a 1px rule at the bottom of each `--rule` row (28px mobile, 32px lg), drawn as a tiled linear-gradient on the whole sheet, so it runs to the bottom edge. `--rule` is also the line-height of both text blocks; `--rule-shift` (-1px, 1px lg) is tuned so descenders clear the rules. Checked on the built page at 375 and 1440.
  - 3px corners, soft neutral shadow (the `.card-lift` teal hover shadow is overridden), focus-visible ring. The link's accessible name is the title plus the description.
- Cards link to `/research/<slug>` (detail pages, copy in `studies.ts`). The live site's `/resources/research/<slug>` URLs redirect there (`next.config.ts`).
- CTA: "Want results like these?" / "Book a demo" -> `/try-demo` (same as Testimonials).

Not matched / for the lead:
- Copy was checked against the reference capture only; the live site was not fetched.
- Nav, footer and launch gates untouched; the lead needs to link `/research` and decide whether `/resources` should keep its Research section.
- The paper colours and card copy are local to the component and `content.ts` in `ResearchCard.tsx`; no tokens exist for them.
