# About page: image audit (round 2)

Sources: PDF tiles `scratchpad/pdf/about/tile-00..04.png`, PDF embedded rasters `scratchpad/pdf/about/imgs/*.jp2` (converted to PNG under `scratchpad/shots2/about/pdfimgs/`), masters in `missing_illustration/` (none relevant to About).

| # | section / PDF y | PDF shows | code currently uses (what it depicts) | verdict | fix |
|---|---|---|---|---|---|
| 1 | Hero (top, y 0-520) | No illustration. Text on pale green-to-cream gradient. | None (CSS gradient in Section0) | OK | none |
| 2 | Values, Innovation (y ~720) | Lightbulb icon, amber on pale yellow circle | Inline SVG lightbulb, #b45309 on #fffbeb | OK | none |
| 3 | Values, Accountability | Shield with check, blue on pale blue | Inline SVG shield-check, #0369a1 on #f0f9ff | OK | none |
| 4 | Values, Empathy | Hand holding heart, purple on pale pink | Inline SVG hand-heart, #a14da5 on #f8f2f9 | OK | none |
| 5 | Values, Impact | Trend-up arrow, green on pale green | Inline SVG trending-up, #15803d on #f0fdf4 | OK | none |
| 6 | Values, Collaboration | Two-person outline, teal on pale teal | Inline SVG users, #207d82 on #eef9f9 | OK | none |
| 7 | Values, Continuous Learning | Open book, violet on pale lilac | Inline SVG book-open, #5d2bb6 on #f4f0fe | OK | none |
| 8 | Leadership, Udaya Dintyala (row 1, col 1) | Man, glasses, beige blazer, white shirt, circle crop | `udaya-dintyala.webp` = PDF raster 12 (pixel-identical framing) | OK | none |
| 9 | Leadership, Dr. Ravindranath Kancherla (row 1, col 2) | Man, glasses, dark suit, red tie | `dr-ravindranath-kancherla.webp` = PDF raster 09 | OK | none |
| 10 | Leadership, Hunny Agarwal (row 1, col 3) | Head and shoulders, grey check blazer, maroon shirt, circle crop, larger head | `hunny-agarwal.webp` was the full-length raster (300px, whole body) | WRONG-CROP | new `hunny-agarwal-crop.webp` cut from PDF raster 10 (head and chest, 230px). Section2 updated |
| 11 | Leadership, Sudheer Narra (row 2, col 1) | Curly hair, teal t-shirt | `sudheer-narra.webp` = PDF raster 08 | OK | none |
| 12 | Leadership, Anastasia Trofilova (row 2, col 2) | Long brown hair, red lipstick, dark top | `anastasia-trofilova.webp` = PDF raster 07 | OK | none |
| 13 | Leadership, Zoya Belyaeva (row 2, col 3) | Long blonde hair, smile, white top, head-and-shoulders in circle | `zoya-belyaeva.webp` was a tight face crop of PDF raster 11 | WRONG-CROP | new `zoya-belyaeva-crop.webp` cut from PDF raster 11 (head to chest, 400px). Section2 updated |
| 14 | Advisory, Dr. Venkat Reddy (row 1, col 1) | Grey-haired man, dark suit, lavender tie | `dr-venkat-reddy.webp` = PDF raster 06 (pixel-identical) | OK | none (400px source, displayed at 56/100px) |
| 15 | Advisory, Satish Kottapalli (row 1, col 2) | Man, grey suit, blue lanyard | `satish-kottapalli.webp` = PDF raster 03 (pixel-identical) | OK | none |
| 16 | Advisory, Venkat Nalam (row 1, col 3) | Man, glasses, black suit, moustache | `venkat-nalam.webp` = PDF raster 13 | OK | none |
| 17 | Advisory, Dr. Mark Aszkenasy (row 2, col 1) | White-haired man, open white collar | `dr-mark-aszkenasy.webp` = PDF raster 04 | OK | none |
| 18 | Advisory, Eugene Huang (row 2, col 2) | Man, grey-blue hair, blue shirt | `eugene-huang.webp` = PDF raster 05 | OK | none |
| 19 | LinkedIn glyph (x11 cards, top right) | Grey LinkedIn "in" square | Inline SVG in `LinkedInIcon.tsx` | OK | none |

Totals: 19 rows counting the 11 portraits, 6 value icons, 1 hero, and the LinkedIn glyph. OK 17, WRONG-CROP 2 (both fixed), MISSING 0, LOW-RES 0.

Notes:
- Portrait sources are the PDF's embedded rasters. Most are 160px circle cut-outs, which are the highest resolution the PDF provides for those people. They are sized 56px and 100px in the cards, so no upscaling beyond 1.6x.
- Ring and circle masks are baked into the 160px rasters (transparent corners), so the wrapper `rounded-full` clip is sufficient.
- The ISO 27001 badge and the footer strip raster in the PDF belong to the shared footer, not to the About page; not touched.
- Old files `hunny-agarwal.webp` and `zoya-belyaeva.webp` are left in place (no deletion).
