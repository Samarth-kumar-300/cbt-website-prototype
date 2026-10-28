# Schools image audit (round 2)

Source: design PDF tiles `scratchpad/pdf/schools/tile-00..06.png` (1440 wide), embedded rasters `imgs/`, masters in `missing_illustration/`. Desktop 1440 unless noted. Verdicts: OK / WRONG / MISSING / WRONG-SIZE / WRONG-CROP / LOW-RES.

| # | section / PDF y (approx, page px) | PDF shows | code uses (file, what it depicts) | verdict | fix |
|---|---|---|---|---|---|
| 1 | Hero S0, 160-556 | teacher with pointer at solar-system board, beard man, woman in white coat, girl at desk with books | `hero-teachers.webp` (same four people, same board, same desk) | OK (size and position match) | none |
| 2 | Hero chip 1, 'JMIR Outcomes' | teal document icon | inline SVG (file-text) | OK | none |
| 3 | Hero chip 2, 'Patented technology' | green bulb with radiating rays | inline SVG (plain bulb, no rays) | WRONG-ICON (minor, 16px) | not fixed: needs exact source icon from the design |
| 4 | Hero chip 3, 'ISO Certification' | red award ribbon | inline SVG (award) | OK | none |
| 5 | Inclusive S1, ~740-1100 | building, laptop with two pupils and charts, three circles (teacher, pupil, man), paper plane | `inclusive-learning.webp` (same artwork and crop) | OK (art and size match; section sits ~35px higher than PDF, layout, not image) | none |
| 6 | Ecosystem S2 card 1 | open book, teal-orange | inline SVG (book-open, #b45309) | OK | none |
| 7 | Ecosystem S2 card 2 | clipboard with check, blue | inline SVG (clipboard-check, #0369a1) | OK | none |
| 8 | Ecosystem S2 card 3 | clock, green | inline SVG (clock, #15803d) | OK | none |
| 9 | Ecosystem S2 card 4 | two people, teal | inline SVG (users, #175f63) | OK | none |
| 10 | Ecosystem S2 card 5 | smiley, purple | inline SVG (smile, #a14da5) | OK | none |
| 11 | Ecosystem S2 card 6 | red house with heart/smile | inline SVG (house-smile, #dc2626) | OK (matched at zoom) | none |
| 12 | Tailored S3 wordmark, 96-523 x 355-405 | CognitiveBotics Bloom wordmark | was Placeholder | MISSING | added `tailored-implementation-wordmark.webp` (from `missing_illustration/image 127.png`), 427x50 at lg |
| 13 | Tailored S3 image, 790-1344 x 350-668 | school building with clouds, flag, trees, bushes | was Placeholder | MISSING | added `tailored-implementation-school.webp` (from `missing_illustration/Group 28150.png`), contained in 558x372 |
| 14 | Steps S4, 790-1340 | petal cluster: book, chat, person-heart, bar chart, clipboard, cap | `tailored-implementation-petals.webp` (same six icons, same colours) | OK (size matches; cluster sits ~50px lower than PDF in screenshot, sticky/layout, not image) | none |
| 15 | Steps S4 centre | purple CognitiveBotics flower | `tailored-implementation-centre.webp` | OK (same size 180px) | none |
| 16 | Built to scale S5, 723-1336 | three schools on a dotted path (small shop, school, two-tone school) | `built-to-scale.webp` at ~483px | WRONG-SIZE (same artwork, rendered ~75% of PDF size) | added `built-to-scale-v2.webp` (from `PDF imgs/08-X1`), shown at 635x282 |
| 17 | Bloom grid row 1 col 1, icon ~66x49 | open book, no light rays | `bloom-objectives.webp` (book with yellow rays above) | WRONG-CROP (rays not in PDF) and WRONG-SIZE | added `bloom-v2-objectives.webp`: PDF raster cropped from y=384 (pages top), trimmed; rendered 68x49 |
| 18 | Bloom grid row 1 col 2, ~72x57 | puzzle | `bloom-tasks.webp` (same art) | WRONG-SIZE (rendered ~65%) | added `bloom-v2-tasks.webp`, 72x57 |
| 19 | Bloom grid row 1 col 3, ~70x55 | social stories book | `bloom-social-stories.webp` (same art) | WRONG-SIZE | added `bloom-v2-social-stories.webp`, 70x55 |
| 20 | Bloom grid row 2 col 1, ~71x57 | house with plants | `bloom-parent-videos.webp` (same art) | WRONG-SIZE | added `bloom-v2-parent-videos.webp`, 71x57 |
| 21 | Bloom grid row 2 col 2, ~48x64 | clipboard list | `bloom-learning-plans.webp` (same art) | WRONG-SIZE | added `bloom-v2-learning-plans.webp`, 48x64 |
| 22 | Bloom grid row 2 col 3, ~78x78 | brain, teal/purple | `bloom-ai.webp` (same art, visible ~80% of box) | WRONG-SIZE | added `bloom-v2-ai.webp`, 78x78 |
| 23 | Bloom grid row 3 col 1, ~68x47 | graduation cap | `bloom-onboarding.webp` (same art) | WRONG-SIZE | added `bloom-v2-onboarding.webp`, 68x47 |
| 24 | Bloom grid row 3 col 2, ~45x59 | report with bar chart | `bloom-progress.webp` (same art) | WRONG-SIZE | added `bloom-v2-progress.webp`, 45x59 |
| 25 | Bloom grid row 3 col 3, ~65x71 | cycle arrows with document | `bloom-reviews.webp` (same art) | WRONG-SIZE | added `bloom-v2-reviews.webp`, 65x70 |
| 26 | FAQ S7, cards 1-3 (closed) | teal people, red hand-heart, blue person-check | `faq-icons.ts` SVG paths | OK | none |
| 27 | FAQ S7, cards 4-9 | hidden in closed state; PDF has no expanded reference | `faq-icons.ts` SVG paths (from reference markup) | NOT VERIFIED (no PDF reference for hidden cards) | none |
| 28 | Closing CTA S8 | gradient panel, no artwork | none | OK | none |

Notes
- Bloom grid icon boxes: the slot stays 74px wide so text starts at the same x as the PDF (104px). Each icon now renders at the size of its visible artwork in the PDF, scaled by 0.7 below lg. Sizes are per item in `Section6.tsx`.
- Section 5 text column narrows (about 645px to about 485px at 1440) because the illustration is now 635px wide. Layout consequence, not changed.
- Old files `bloom-objectives.webp`, `bloom-tasks.webp`, ..., `built-to-scale.webp`, `tailored-implementation.webp` are no longer referenced by the page. Kept, not deleted.
