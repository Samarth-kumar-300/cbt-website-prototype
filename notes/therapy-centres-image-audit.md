# therapy-centres image audit (round 2)

Originals fetched from manifest URLs (scratchpad/src/therapy-centres/). Current files compared visually.

| # | section / PDF y | PDF shows | code uses (file, what it depicts) | verdict | fix |
|---|---|---|---|---|---|
| 1 | Hero, right, y~150-550 | clinician kneeling with checklist board + girl with blocks (transparent) | hero-illustration.webp (1260px PDF crop, same art, low-res) | LOW-RES | swapped to hero-clinician-v2.webp (original 2540px master, alpha) |
| 2 | What we believe, y~800-1100 | laptop "Welcome Priya!" + phone "Learn" + tablet kids game, captions baked in | what-we-believe-devices.webp (1920px PDF crop, matches) | OK-but-cropped-from-render | no master for the composite; see unresolved |
| 3 | Skills x10, y~530-1000 | icon art with sparkle accents | skills/*.webp (1080px PDF crops; match PDF incl. sparkles) | OK | none (frozen section); cloud originals (720px) lack sparkles |
| 4 | Clinical evidence, right, y~200-450 | glasses mascot reading open book (transparent) | clinical-mascot.webp (960px opaque PDF crop) | LOW-RES / opaque bg | swapped to clinical-mascot-v2.webp (original 1885px master, alpha) |
| 5 | FAQ icons (5) | small coloured line icons | faq-icons.ts (inline icons) | OK (matches PDF glyphs) | none |
| 6 | Closing CTA art | none (gradient panel only) | none | OK | none |
| 7 | Footer ISO badge | A-LIGN ISO 27001 badge | shared footer (not this page) | out of scope | shared chrome |
| 8 | Hero pills icons (3) | small icons | inline | OK | none |

Not on this page: hero-devices.webp (manifest "Hero_Image": tablet "Sammy Smith" + phone "Welcome Dr. Priya") and missing_illustration "Hero devices.png" (same art, woman + child over tablet). Neither appears in the therapy-centres PDF; the lead's hint was wrong. extending-development.webp is unused (Section4 not imported).

Unresolved:
- What-we-believe composite (row 2): no master in missing_illustration or the manifest. The phone matches Learn.png (phone raster 03-X14 in the PDF). The laptop and kids tablet exist only in the PDF render. Needs the designer's master or a higher-res PDF export.
- Skills sparkle accents: the cloud originals lack the sparkles that the PDF shows. The skills section is frozen; the choice of files was left as is pending a decision.
