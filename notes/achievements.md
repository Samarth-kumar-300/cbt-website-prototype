# /achievements

Split out of the "Achievements" section of `/resources`. Copy from `reference/resources/copy.json`; card markup and class strings from the old `Section4` (`git show 0a6e411^:components/pages/resources/sections/Section4.tsx`), unchanged except the section h2, which is now the page H1.

- Header: `PageHero` with the subtitle "Our granted Indian patent and ISO 27001 certification." The live site has no subtitle for this part; the line was specified by the lead.
- Cards: 2 columns from `sm` (the old grid had 3 columns on `lg` with one slot empty).
- ISO card: no image or badge exists in `reference/image-manifest.json` or `public/`, so it keeps the old icon treatment (ribbon icon on a pale blue circle).
- Could not cross-check against the live site; copy is from the captured reference only.
- Lead to do: nav/footer links, launch gates, and any `/achievements` stub-route removal.
