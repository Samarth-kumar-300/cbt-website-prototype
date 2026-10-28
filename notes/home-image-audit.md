# Home image audit (round 2)

Reference: `cbt_website_pages/Homepage — v2.pdf`, rendered at 1440px (tiles in scratchpad `pdf/home/`, y = PDF page px).
Masters: `missing_illustration/`. Code: `components/pages/home/`. Verified by viewing the PDF tile and the file/screenshot side by side.

Verdicts: OK = same picture, same place; WRONG = different picture; MISSING = no image in code; WRONG-CROP / LOW-RES as named.

| # | Section / PDF y | PDF shows | Code uses (file, what it actually depicts) | Verdict | Fix |
|---|---|---|---|---|---|
| 1 | Hero art, y 200-630, x 783-1345 | Tablet "Sammy Smith" dashboard, phone "Welcome Dr. Priya", girl (purple top) and boy (red headband, orange shirt, tablet) kneeling | `herosection-01.webp`: family + monster on a park path | WRONG | `public/images/homepage/home-hero-devices.webp` (from `Hero devices.png`) |
| 2 | Hero trust bar, icon 1 (check-circle, teal), y 720 | Check in circle | SVG `circle-check` in `#eef9f9` circle | OK | none |
| 3 | Hero trust bar, icon 2 (document, purple) | Document with lines | SVG `file-text`, `#a14da5` | OK | none |
| 4 | Hero trust bar, icon 3 (ribbon, red) | Award ribbon | SVG `award`, `#dc2626` | OK | none |
| 5 | Hero trust bar, icon 4 (bulb with rays, purple) | Lightbulb with rays | SVG `lightbulb`, `#a14da5` | OK | none |
| 6 | What is CognitiveBotics, y 1000-1330, x 145-570 | Circuit chips, tablet with child photo, heart, pencil, puzzle, speech bubble | `whatiscbt.webp`: same art | OK | none |
| 7 | Journey step 1 "Meet the child", desktop zigzag and mobile | Boy (red shirt) with monster and tablet | `steps01.webp` (same) | OK | none |
| 8 | Journey step 2 "Answer questions" | Doctor with clipboard, girl with blocks | `steps02.webp` (same) | OK | none |
| 9 | Journey step 3 "Assign plan" | Tablet with hand, eye and smile icons | `steps03.webp` (same) | OK | none |
| 10 | Journey step 4 "Personalise learning" | Girl with glasses, dad, monster, tablet | `steps04.webp` (same) | OK | none |
| 11 | Journey step 5 "Monitor growth" | Doctor with clipboard, bar chart, flower/eye/smile icons | `steps05.webp` (same) | OK | none |
| 12 | JourneyRail (frozen) steps 1-5 | Same five illustrations | `journey/steps.ts` -> steps01-05 (same files) | OK | none (image-only, unchanged) |
| 13 | Growth looks different, desktop, y 3105-3630, x 760-1335 | Three phones fanned: Progress, Explore, Learn; no people | `growthlooksdiff.webp`: girl and boy kneeling with the phones | WRONG | `public/images/homepage/home-growth-phones.webp` (from `GrowthLooksDiff.png`) |
| 14 | Growth looks different, mobile (340 x 280) | Same three phones | `growthlooksdiff.webp` (same wrong file) | WRONG | same file as row 13 |
| 15 | Growth feature icon 1 "Finding their voice" (speech bubble, teal) | Speech bubble outline | SVG `message-square`, `#207d82` | OK | none |
| 16 | Growth feature icon 2 "Building steadier days" (sun, purple) | Sun | SVG `sun`, `#a14da5` | OK | none |
| 17 | Growth feature icon 3 "Creating rhythms" (clock, red) | Clock | SVG `clock`, `#b91c1c` | OK | none |
| 18 | Growth feature icon 4 "Feeling comfortable" (globe, blue) | Globe | SVG globe, `#0369a1` | OK | none |
| 19 | Growth feature icon 5 "Joining in" (pulse, purple) | Pulse line | SVG `activity`, `#a14da5` | OK | none |
| 20 | Find your path, arrows (green / orange / blue), y 5400-5600 | Arrow in each row colour | SVG arrows `#15803d`, `#b45309`, `#0369a1` | OK | none |
| 21 | Testimonials desktop, quote mark card 1 (green), y 870 of tile 5, x 135 | Bold quote mark, green `#4ca154` | `Placeholder` grey box | MISSING | Nunito 800 “ glyph in `#4ca154`, 21x17, offset to PDF ink position (Section5) |
| 22 | Testimonials desktop, quote mark card 2 (orange) | Quote mark, `#a85923` | `Placeholder` grey box | MISSING | Nunito 800 “ glyph in `#a85923` (Section5) |
| 23 | Testimonials desktop, card 3 (blue) and card 4 (purple) | Partly visible third and fourth cards in a carousel | Not rendered on desktop (code shows 2 cards) | layout gap, not an image | reported, not changed (see report) |
| 24 | Testimonials mobile, slides 1-4 quote marks | No PDF tile (mobile); same colours as desktop cards in order | Text glyph “ in brand colour | WRONG (style) | coloured glyph per slide: green, orange, blue, purple (Section5) |
| 25 | cb logo right of testimonial heading, x 1293-1345, y 743-790 | cb mark, purple c and teal b | none | MISSING | `public/images/homepage/home-cb-mark.webp` (mark cropped from `cbt-navbar-logo.webp`), heading row now left-aligned with mark at right (desktop) |
| 26 | FAQ icon 1 "What is CognitiveBotics?" (panel, teal) | Panel icon in light circle | `faq-icons.ts` idx 0 panel `#207d82` | OK | none. Circle is 38px vs PDF 32px (shared FaqCards, not changed) |
| 27 | FAQ icon 2 "early signs of autism" (eye, blue) | Eye | `faq-icons.ts` idx 1 eye `#0369a1` | OK | none (same size note) |
| 28 | FAQ icon 3 "At what age" (calendar, purple) | Calendar | `faq-icons.ts` idx 2 calendar `#a14da5` | OK | none (same size note) |
| 29 | Closing CTA, y 6200-6700 | Gradient panel, no art | none (CSS gradient) | OK | none |
| 30 | Footer ISO 27001 badge (tile 7) | Badge image | Not in home-owned code (shared footer) | not home | shared, not changed |

Totals: 30 rows. OK 21 (includes frozen row 12, already correct), fixed 7 (rows 1, 13, 14, 21, 22, 24, 25), layout gap 1 (row 23, not an image), not home-owned 1 (row 30).

Files added: `home-hero-devices.webp` (1600 px), `home-growth-phones.webp` (1600 px), `home-cb-mark.webp` (140x127 native).
Files left in place (not deleted, may be used elsewhere): `herosection-01.webp`, `growthlooksdiff.webp`.
