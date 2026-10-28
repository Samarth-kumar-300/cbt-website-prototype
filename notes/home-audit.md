# Home page audit vs "Homepage — v2.pdf" (desktop 1440)

Assumptions: the PDF is the source of truth for copy and layout. Header and footer belong to the shared layout and are out of scope. Mobile classes are kept. Items marked FROZEN are logged only.

| # | section | element | PDF shows | prototype has | action | frozen? |
|---|---|---|---|---|---|---|
| 1 | Section0 hero | h1 | "Helping autistic children grow, with AI and care." | "Empowering therapists, schools and parents to support every child's progress." | copy | no |
| 2 | Section0 hero | primary CTA | "Find your path →" to #find-your-path | same | none | no |
| 3 | Section0 hero | hero image | tablet, phone and two children illustration | herosection-01.webp | none | no |
| 4 | Section0 trust bar | 4 items (NIEPID Validated, JMIR-published 12-month outcomes, ISO 27001 certified, Patented early-intervention technology) | same four labels and order | same | none | no |
| 5 | Section0 "What is" card | heading "What is CognitiveBotics?" | same | same | none | no |
| 6 | Section0 "What is" card | illustration | whatiscbt illustration | whatiscbt.webp | none | no |
| 7 | Section0 "What is" card | body copy, 2 paragraphs: "CognitiveBotics is an AI-powered early intervention platform that helps therapists create personalised support for children aged 2-8 with autism and developmental delays." / "It connects therapy, home and school so children receive consistent support and continue building skills in everyday life." | 1 paragraph, different text | copy (2 paragraphs) | no |
| 8 | Section1 "A CHILD'S GROWTH PATH" area | eyebrow "A CHILD'S JOURNEY WITH COGNITIVEBOTICS" | "A CHILD'S GROWTH PATH" | FROZEN - not changed (eyebrow and the whole growth-path block are in the frozen area; Section1 and JourneyRail are not edited) | yes |
| 9 | Section1 growth path | heading "One Connected Journey, Every Step of the Way" | same | same | none | yes |
| 10 | Section1 growth path | five step cards (MEET THE CHILD, ANSWER QUESTIONS, ASSIGN PLAN, PERSONALISE LEARNING, MONITOR GROWTH) and copy | same text and order | same | none | yes |
| 11 | Section1 growth path | illustrations and purple ribbon | illustrations, ribbon | illustrations present, ribbon is Placeholder | FROZEN - logged | yes |
| 12 | Section2 "Growth looks different" | eyebrow pill "THE SMALL WINS THAT CHANGE EVERYTHING" | same | same | none | no |
| 13 | Section2 | heading "Growth looks different for every child" | same | same | none | no |
| 14 | Section2 | 5 rows (heading + body) | same text and order | same | none | no |
| 15 | Section2 | phone-mockup image | growth looks different phones | growthlooksdiff.webp | none | no |
| 16 | Section4 "Find your path" | eyebrow "WHERE WOULD YOU LIKE TO GO NEXT?" (uppercase) | uppercase | "Where would you like to go next?" (mixed case) | copy (uppercase) | no |
| 17 | Section4 | heading "Find your path" | same | same | none | no |
| 18 | Section4 | rows | 3 rows: For Therapy Centres, For Parents, For Schools | 4 rows, extra "For Governments" row | remove | no |
| 19 | Section4 | row copy and arrow links | same copy, colours green, orange, blue | same | none | no |
| 20 | Section5 testimonials | heading "Real experiences from the families we support" | same | same | none | no |
| 21 | Section5 testimonials | logo mark at top right of heading | "cb" mark | none | open question (see report) | no |
| 22 | Section5 testimonials | quote-mark icons (green, orange, blue, purple) | coloured quote marks | Placeholder (desktop), "“" glyph (mobile) | image (unresolved, see report) | no |
| 23 | Section5 | card 1 text and name | "Nyra's attention span has improved..." / Mounila Thustam, Parent | long older quote | copy | no |
| 24 | Section5 | card 2 text and name | "We haven't seen such a variety of activities..." / Tejaswi Kumar, Parent | older quote | copy | no |
| 25 | Section5 | card 3 text and name | "In our therapy center, maintaining continuity was a challenge..." / Dr Chandrashekhar, Therapist Director, Resplice Child Development Center | not present | add to carousel (desktop layout question, see report) | no |
| 26 | Section5 | card 4 text and name | "CognitiveBotics has been very helpful..." / Pavani, Parent | not present | add to carousel (desktop layout question, see report) | no |
| 27 | Section5 | carousel controls | arrows, 3 dots (pill active) | 2 static arrows, 1 dot on desktop; 2 slides on mobile | copy and count only; desktop control question open | no |
| 28 | Section6 FAQ | heading "Frequently Asked Questions" | same | same | none | no |
| 29 | Section6 FAQ | items | 3 items: What is CognitiveBotics?, What are the early signs of autism?, At what age can autism be identified? | 8 items | trim to 3 | no |
| 30 | Section6 FAQ | item icons | grid, eye, calendar | faq-icons.ts first three | none | no |
| 31 | Section6 FAQ | "View All" link (right of list) | "View All" | none | open question, destination unknown | no |
| 32 | Section7 CTA | heading "Better outcomes begin with shared understanding" (no full stop) | no full stop | with full stop | copy | no |
| 33 | Section7 CTA | body "Discover how CognitiveBotics helps families, therapists, centres and schools turn everyday moments into meaningful progress" (no full stop) | no full stop | with full stop | copy | no |
| 34 | Section7 CTA | button "Experience the Platform →" | same | same | none | no |
| 35 | Section3 (not rendered by HomePage) | "Could Your Child Benefit from Extra Support?" | not in PDF | component exists, not imported | none (dead code, not touched) | no |
| 36 | Footer | shared footer | out of scope | out of scope | none | n/a |
