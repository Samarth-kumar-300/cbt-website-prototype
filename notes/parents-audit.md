# Parents page audit (PDF "Parents — v2 (doc copy).pdf" vs prototype, 1440 desktop)

Action key: none / copy / image / layout / order / add / remove / frozen.
Image rows marked STOP were not changed because the source image was not in the PDF image set.

| # | section | element | PDF shows | prototype had | action | frozen? |
|---|---|---|---|---|---|---|
| 1 | Hero | eyebrow "FOR PARENTS" | purple eyebrow | same | none | no |
| 2 | Hero | h1 "Extend your child's therapy beyond the clinic..." | 3 lines | same | none | no |
| 3 | Hero | trust pills "JMIR Outcomes", "Patented technology", "ISO Certification" | three bordered pills with icons under h1 | absent | add (Section0) | no |
| 4 | Hero | family illustration (right) | illustration of parents, child, mascot, tablet | Placeholder | image STOP: not in PDF imgs/ | no |
| 5 | What is autism | eyebrow, h2 "Understanding Autism", body | same copy | same | none | no |
| 6 | Recognising | h2 "Recognising Early Differences" | same | same | none | no |
| 7 | Recognising | centre illustration (woman, child, bear, rug) | illustration | Placeholder (desktop and mobile) | image STOP: not in PDF imgs/ | no |
| 8 | Recognising | card "Speech develops differently" (top-left) | copy + icon | same | none | no |
| 9 | Recognising | card "Connecting with others feels different" (top-right) | copy + icon | same | none | no |
| 10 | Recognising | card "Comfort in routine" (bottom-left) | copy + icon | same | none | no |
| 11 | Recognising | card "Sensitive to everyday sensations" (bottom-right) | copy + icon | same | none | no |
| 12 | Recognising | "Learn more, at your own pace" button | absent | present (desktop and mobile source) | remove | no |
| 13 | Checklist CTA | h2, body, "Start the checklist →" | same | same | none | no |
| 14 | Early intervention (2,000 days) | eyebrow, h2, body, 4 age cards with illustrations | shown | Section3 | FROZEN – not changed (diff not logged) | yes |
| 15 | Daily toolkit | eyebrow "HOW COGNITIVEBOTICS HELPS", h2, subtitle | same | same | none | no |
| 16 | Daily toolkit | stat cards 450+ / 1,800+ / 20+ with copy | same | same | none | no |
| 17 | Daily toolkit | toolkit list order | Daily Journal, Personalised Learning Plans, Progress Reports | Plans, Progress, Journal | order (desktop and mobile) | no |
| 18 | Daily toolkit | selected state on "Personalised Learning Plans" | teal border, light teal fill | none | add static selected style; click-to-select not built (no interaction in PDF or reference) | no |
| 19 | Daily toolkit | Daily Journal copy | "Capture daily moments, milestones and observations, helping parents and therapists identify meaningful patterns in a child's progress." | "Capture everyday moments ... in seconds. Over time ..." | copy (desktop, mobile, content.ts) | no |
| 20 | Daily toolkit | Progress Reports copy | same | same | none | no |
| 21 | Daily toolkit | dashboard screenshots (tablet with phone overlay) | app screenshots | Placeholder | image added (tablet + phone; phone bezel is CSS) | no |
| 22 | Daily toolkit | mobile screenshot slot | not shown in PDF (desktop only) | Placeholder | left as scaffold placeholder | no |
| 23 | Language bar | "App available in 8 languages. Learning content in English and Telugu, with more coming soon" | pill with globe icon | same | none | no |
| 24 | FAQ | eyebrow "QUESTIONS PARENTS ASK US", h2 "Frequently Asked Questions" | same | same | none | no |
| 25 | FAQ | questions 1-3 with icons (rocket, clipboard, book) | shown, collapsed | same | none | no |
| 26 | FAQ | questions 4-5 ("How will I know...", "Is giving my child screen time...") | not shown; hidden behind "View All" | shown | layout: 3 visible, rest behind View All | no |
| 27 | FAQ | "View All" link | right-aligned under cards | absent | add (expands the remaining 2 in place; destination not specified in PDF) | no |
| 28 | Inside a session | eyebrow, h2, body | same | same | none | no |
| 29 | Inside a session | four features (Interactive Sessions, Speech Recognition, Pose Detection, Interactive Learning Games) with icons | same | same | none | no |
| 30 | Inside a session | "Try interactive games →" | same | same | none | no |
| 31 | Inside a session | two app screenshots (sink, dining) in bezel frames, blue-purple glow behind | framed screenshots + glow | Placeholder | image added (two framed screenshots); glow not recreated | no |
| 32 | Inside a session | mobile image slot | not in PDF | Placeholder | left as scaffold placeholder | no |
| 33 | CTA | h2 "Every child deserves care that's made just for them.", body, "Get in Touch with the Team →" | same | same | none | no |
| 34 | Footer | footer and curve | shared footer | Section7 curve SVG | none (shared footer not owned) | no |
| 35 | Nav | page-level nav | shared header, PARENTS active | layout-owned | none (not owned) | no |
