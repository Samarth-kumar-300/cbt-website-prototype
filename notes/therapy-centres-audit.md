# Therapy Centres: PDF vs prototype audit (1440px)

Source: "Therapy Centres — v3 (doc copy).pdf". Frozen: Section2 "Skills empowering every child's journey" (not changed).

| # | section | element | PDF shows | prototype has | action | frozen? |
|---|---|---|---|---|---|---|
| 1 | Hero (S0) | eyebrow | FOR CHILD DEVELOPMENT CENTERS | same | none | no |
| 2 | Hero | h1 | Intervention works best when it doesn't stop at the clinic door | same | none | no |
| 3 | Hero | pills | JMIR Outcomes, Patented technology, ISO Certification | same | none | no |
| 4 | Hero | illustration | therapist + child with blocks (vector) | devices mockup (hero-devices.webp) | image | no |
| 5 | Hero | layout/bg | gradient bg, rounded bottom | same | none | no |
| 6 | Believe (S1) | h2 | What we believe | same | none | no |
| 7 | Believe | body | "Tracking ... learning." with "CognitiveBotics" in purple semibold | same text, no purple span | copy (styling) | no |
| 8 | Believe | CTA (desktop + mobile) | "Your Workflow, Made Simpler" | "Start a Conversation" | copy | no |
| 9 | Believe | image | laptop/phone/tablet with captions For Therapists / For Parents / For Children | placeholder "A therapist working with a child" | image | no |
| 10 | Skills (S2) | all | 10 skill cards | — | FROZEN – not changed | yes |
| 11 | Start Clearer Picture (S3) | eyebrow/h2/body/CTA | same copy and button | same | none | no |
| 12 | Clinical (S5) | eyebrow, h2, intro | same | same | none | no |
| 13 | Clinical | illustration | glasses mascot reading book | Placeholder "Image" | image | no |
| 14 | Clinical | stat cards | Social Age +56.84%, Expressive Language +59.93%, Developmental Age +46.49% | same copy; third value colour is brown-orange (#a85923) | colour | no |
| 15 | Clinical | published line | at 1440: "Published in JMIR Neurotechnology" + underlined "View published study" text link (no icon, no button) | desktop shows icon + bold text + button, mobile shows text line | layout | no |
| 16 | FAQ (S6) | eyebrow, h2 | QUESTIONS THERAPISTS ASK US / Frequently Asked Questions | same | none | no |
| 17 | FAQ | 5 questions | identical wording, collapsed | identical | none | no |
| 18 | FAQ | icons | teal doc, green heart, blue people, orange scale, purple chat | same | none | no |
| 19 | CTA (S7) | h2, body, button | Bring greater clarity... / Plan with precision... / Book a Demo | same | none | no |
| 20 | Section order | | Hero, Believe, Skills, Start Picture, Clinical, FAQ, CTA | same (S4 not rendered) | none | no |
| 21 | Dead file | Section4.tsx | not in PDF; not imported | exists, unused | report only, not deleted | no |
| 22 | Header/footer | nav and footer | layout-owned, not in page | — | none | — |

Open questions (not resolved by PDF):
- CTA "Your Workflow, Made Simpler" href: PDF gives no target. Keeping /contact-us.
- FAQ answers are not in the PDF text (collapsed); prototype answers kept as-is.
- Captions are inside the devices image, so they are not real text (a11y: alt text covers them).
