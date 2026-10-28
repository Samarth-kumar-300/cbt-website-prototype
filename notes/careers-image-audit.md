# Careers image audit (round 2)

PDF reference: scratchpad/pdf/careers/tile-00..03.png (1440px). Screenshots: scratchpad/shots2/careers/.

| # | Section / PDF y | PDF shows | Code used before | Verdict | Fix |
|---|---|---|---|---|---|
| 1 | Hero right column, y 150-460 | Three cartoon children holding hands (blond boy, girl with glasses, curly-haired girl), right-aligned, about 415px wide, no box | Placeholder "Illustration of three children holding hands" | MISSING | Section0.tsx now uses public/images/careers/careers-hero-children-holding-hands.webp (from missing_illustration/Group.png, 1000px wide, alpha kept). Verified: same three children, poses, hair, outfits |
| 2 | Hero background, y 0-548 | Left-to-right teal to cream gradient | inline gradient #e4f2ef / #f1f7f4 / #faf6f0 | OK | PDF samples #e7f2ef (left) and #f9f6f1 (right), within about 3 RGB units |
| 3 | About cards, Mission icon | Concentric target rings, teal, in pale circle | inline SVG (3 concentric circles) | OK | none |
| 4 | About cards, Vision icon | Eye outline, blue | inline SVG (eye + pupil) | OK | none |
| 5 | About cards, Culture icon | Hand holding a heart, purple | inline SVG (hand-heart path) | OK | none |
| 6 | Contact Us envelope, y ~1880 | Envelope outline, purple, in pale circle | inline SVG (rect + flap) in #f8f2f9 circle | OK | none |
| 7 | Resume field, upload icon | Cloud with up-arrow, teal, in a pale circle at the left of the file field | none | MISSING | Section3.tsx: inline cloud-upload SVG (#3e7b81) in #f0f9f9 circle |
| 8 | Job filter, Department/Location caret | Small dark down-triangle at right of each select | none (appearance-none, no caret) | MISSING | JobList.tsx: Caret component (8x5 triangle, #323439), absolute right inside each select wrapper |
| 9 | Join us banner, background | Left #f5e9f6, middle #e7d5ed, right #e0ecea | #f5e9f6 / #ead5ec / #e4eeea | WRONG (colour, minor) | Section4.tsx stops now #f5e9f6 0%, #e7d5ed 50%, #e0ecea 100% |
| 10 | Footer ISO 27001 badge, y ~1840 (footer) | A-LIGN ISO 27001 CERTIFIED shield, 67x86 | Shared components/shared/Footer.tsx renders a grey Placeholder (IsoBadge) | MISSING (shared, read-only) | Asset created: public/images/careers/careers-iso-27001-badge.webp (from pdf imgs 00-X14.png). Needs shared-change-request, see notes/careers.md |
| 11 | Resume "Choose a file" control | Native input, PDF label "Choose a file" | native file input, browser label "Choose File" | NOTE (native text, not an image) | not changed |

Non-image defects found on this page while verifying: Clear Filters was wrapped in stray literal parentheses in JobList.tsx (removed).

Total rows: 11. OK 5 (rows 2-6), fixed 5 (rows 1, 7, 8, 9, 10 asset), noted 1 (row 11). Row 10 is fixed only once the shared footer uses the asset.
