# /achievements

Split out of the "Achievements" section of `/resources`. Copy from `reference/resources/copy.json`; the section h2 is now the page H1.

- Header: `PageHero` with the subtitle "Our granted Indian patent and ISO 27001 certification." The live site has no subtitle for this part; the line was specified by the lead.
- Grid: 2 columns from `sm` (the old grid had 3 columns on `lg` with one slot empty). Cards are equal height.
- Card (redesigned; the original had an icon circle instead of an image), top to bottom: 16:9 thumbnail, badge pill, title, one-line description (`truncate`, so the long patent text ends in an ellipsis on purpose), then a "View Certificate" line with an arrow pinned to the bottom.
- The whole card is one `<a>` to the PDF (`target="_blank"`, `rel="noopener noreferrer"`). "View Certificate" is a `<span>`, not a nested link. Focus shows an outline via `focus-visible`.
- Thumbnails are 1600x900 renders in `public/achievements/` (`patent.webp`, `iso.webp`), set in `content.ts` as `thumbnail: { src, alt }`. They use `next/image` with `fill`, `sizes="(min-width: 640px) 50vw, 100vw"` and no `priority`. On hover or focus the image scales slightly (`motion-safe` only).
- The icon fields (`iconPath`, `iconBg`, `iconColor`) were removed from `Achievement`.
- Card styling is unchanged: `rounded-[20px]`, teal-100 border, same shadow, `card-lift` (staggered by `RevealStagger`), `hover:bg-background-brand-subtle`.
- Could not cross-check against the live site; copy is from the captured reference only.
- Lead to do: nav/footer links, launch gates, and any `/achievements` stub-route removal.
