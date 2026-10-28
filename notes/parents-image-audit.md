# Parents image audit (round 2)

Verdicts checked against PDF tiles (scratchpad/pdf/parents) and the file the code used, viewed as PNG.
"Fixed" rows now point at the new file. Old files are left on disk (not deleted) and are no longer referenced.

| # | Section / PDF y (1440) | PDF shows | Code used (before) | Verdict | Fix (source file) |
|---|---|---|---|---|---|
| 1 | Hero, right, ~170-630 | Family of 3 (woman in red, man in blue shirt, boy in yellow) with blue mascot around a teal tablet, cup of coffee, house drawing | Placeholder | MISSING | `missing_illustration/ParentHero.png` -> `public/images/parents/parents-hero.webp` (1000w) |
| 2 | Hero pill "JMIR Outcomes" icon | Document icon, blue tint | lucide file-text, blue | OK | none |
| 3 | Hero pill "Patented technology" icon | Green bulb-with-rays icon | lucide bulb-like, green | OK (checked at tile scale) | none |
| 4 | Hero pill "ISO Certification" icon | Red award ribbon | lucide award, red | OK | none |
| 5 | Early differences, desktop centre, ~y 470-900 (y 900-1800 tile) | Mother on pink sofa, boy with rocket, teddy in box, plant, blocks, purple rug | Placeholder | MISSING | `missing_illustration/Early differences 1.png` -> `public/images/parents/parents-early-differences.webp` (1600w) |
| 6 | Early differences, mobile | Same illustration | Placeholder | MISSING | same file as row 5 |
| 7 | Early differences card "Speech develops differently" icon | Speech bubble, teal | message-square, teal | OK | none |
| 8 | Early differences card "Connecting with others feels different" icon | Person with a small arc at top right (purple) | single user icon (purple) | WRONG (minor, vector icon) | unresolved: needs the exact icon name (no lucide package in node_modules to match). See report. |
| 9 | Early differences card "Comfort in routine" icon | Rotate-cw, orange tint | rotate icon, orange | OK (checked at tile scale) | none |
| 10 | Early differences card "Sensitive to everyday sensations" icon | Sun icon, blue tint | sun icon, blue | OK (checked at tile scale) | none |
| 11 | Early Intervention age 2 card (frozen, image only) | Child with black hair in red car, teal top | `early-years-age2.webp` (same content) | OK | none |
| 12 | Early Intervention age 3-4 card (frozen) | Girl, brown hair with purple clips, pink heart pyjamas, brushing teeth at sink | `early-years-age3-4.webp` | OK | none |
| 13 | Early Intervention age 5 card (frozen) | Curly-haired girl, yellow top, backpack, alarm clock, dresser | `early-years-age5.webp` | OK | none |
| 14 | Early Intervention age 6-7 card (frozen) | Curly-haired boy (blue/yellow) and girl (orange headband, purple top) at a table with books | `early-years-age6-7.webp` | OK | none |
| 15 | Toolkit, desktop, tab-selected panel, ~y 555-1045 | Learn tablet with phone overlapping at bottom right (default selected tab "Personalised Learning Plans") | `toolkit-dashboard-tablet.png` (tablet only, wrong composition) + `toolkit-dashboard-phone.png` (separate crop) | WRONG | `missing_illustration/Learn.png` -> `public/images/parents/parents-toolkit-learn.webp` (1400w), single composite |
| 16 | Toolkit, mobile, above tab list | Same Learn composite | Placeholder | MISSING | same file as row 15 |
| 17 | Toolkit tab "Daily Journal" | (not shown in PDF; panel only shows Learn) | Journal.png master not used | NOT DISPLAYED | `missing_illustration/Journal.png` is not wired (static state in PDF is Learn). Question for lead. |
| 18 | Toolkit tab "Progress Reports" | (not shown in PDF) | Progress.png master not used | NOT DISPLAYED | `missing_illustration/Progress.png` not wired. Question for lead. |
| 19 | Inside a session, desktop, two stacked landscape screens with blue-purple glow | Girl washing hands (glasses) on top, boy at dinner table below, glow behind | `session-sink.png` + `session-dining.png` (separate crops, no glow) | WRONG | `missing_illustration/LearningThatAdapts.png` -> `public/images/parents/parents-learning-adapts.webp` (1200w), single composite with glow |
| 20 | Inside a session, mobile | Same composite | Placeholder | MISSING | same file as row 19 |
| 21 | Inside a session, four feature icons (chat, mic, pose scan, puzzle) | Matching outline icons | same icons | OK | none |
| 22 | FAQ, three visible icons (rocket, clipboard-check, book-open) | Matching outline icons on tinted circles | `faq-icons.ts` entries 1-3 | OK | none |
| 23 | FAQ, entries 4-5 | Not visible in PDF (View All) | entries 4-5 icons | NOT VERIFIABLE | none |
| 24 | Closing CTA "Every child deserves care..." | Gradient card, no illustration | no art | OK | none (Section7 comment about an omitted mascot is consistent with the PDF) |
| 25 | Footer ISO 27001 badge and curve | Badge bottom-left of footer; curve is dark band top edge | footer is shared (not this page); curve is traced SVG in Section7 | OK for this page | badge belongs to shared Footer, not changed |

Totals: 25 rows. OK 14. WRONG 3 (rows 15 and 19 fixed; row 8 unresolved). MISSING 5 (rows 1, 5, 6, 16, 20, all fixed). NOT DISPLAYED 2 (17, 18). NOT VERIFIABLE 1 (23).
