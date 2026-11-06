# Pricing page redesign: Therapy Centres / Schools

Date: 2026-11-06
Status: draft for review
Source designs: `illustrations/Pricing · Therapy Centres@1x.png`, `illustrations/Pricing · Schools@1x.png`

## Goal

Rebuild `/pricing` so a therapy centre or a school can see what it gets, what it costs and what to do next, in one page with an audience switch. Take the information architecture from the two mocks. Take every visual property (colour, type, radius, borders, shadows, motion) from the pages already on the site, so Pricing reads as part of the same product as Home, Therapy Centres and Schools.

## Decisions already made

- **Approach A:** one route, two audience panels, switched on the client by the shared `Chips` tablist. The active audience lives in the URL as `?for=therapy-centres` (default) or `?for=schools`.
- The mock's "10 skill areas" chip row is replaced by the illustrated skills scroller from Therapy Centres (`therapy-centres/sections/Section2.tsx`).
- The mock's testimonial row is replaced by the Home testimonial section (`home/sections/Section5.tsx`: video card plus drifting `TestimonialRail` on desktop, `TestimonialCarousel` on mobile).
- FAQ answers: Samarth will supply them. Until then, every answer not given in the mock is a visible placeholder.

## Page structure

Shared sections render once. Audience sections render once per audience inside a tab panel; the inactive panel has the `hidden` attribute, so both are in the server HTML.

| # | Section | Scope | Built from |
|---|---|---|---|
| 1 | Hero | shared | `Eyebrow`, `TextReveal`, current pricing hero gradient |
| 2 | Audience switch | shared | `Chips` |
| 3 | Intro + "What's in the platform" | per audience | Schools "connected ecosystem" card style |
| 4 | Skills scroller | shared component, rendered in both panels | extracted from Therapy Centres Section2 |
| 5 | "What your centre/school gets" | per audience | new, site tokens |
| 6 | Plans | per audience | current pricing plan card |
| 7 | Parents app panel | same content in both panels | new, site tokens |
| 8 | Testimonials | per audience (heading, order) | extracted from Home Section5 |
| 9 | FAQ | per audience | `FaqList` layout of current pricing Section3 |
| 10 | Closing CTA | per audience | `CtaPanel` |

Sections 7 to 10 sit below the panels in the mock, but 8 to 10 change with the audience. The panel therefore wraps sections 3 to 10, and the parents panel (7) is rendered inside each panel from the same component. The page has one switch at the top. It is not sticky: switching mid-page would replace the content under the reader's eyes.

## 1. Hero (shared)

- Layout: centred, as in the mock. Max text width about 880px.
- Background: the existing pricing hero gradient `linear-gradient(100deg, #e7f1ef 0%, #f3eef5 45%, #fbece9 100%)`, not the mock's flat mint.
- Eyebrow `PRICING` (purple, `Eyebrow`).
- H1, `TextReveal` on load: "One platform for each neurodivergent child’s plan, practice and **progress**." "progress" uses `text-content-brand-secondary`.
- Subcopy: "Therapy and teaching happen a few hours a week. CognitiveBotics, the AI-powered early intervention platform for therapy centres and schools, carries your plans into each child’s day and shows the progress back to you."
- Line: "Working with NIEPID (Govt of India) under an MoU" (teal, semibold).
- Proof chips, wrapping and centred, styled like the white hero badges on Therapy Centres/Schools (white pill, teal-100 border, small purple shield icon, bold claim plus secondary source):
  1. **59.57% more tasks done independently** · NIEPID 90-day study
  2. **+56.8% social age in 12 months** · JMIR Neurotechnology
  3. **Winner** · UK–India HealthTech Accelerator 2025
  4. **Winner** · AP Govt MedTech Challenge
  5. **ISO 27001 certified** · DPDP Act readiness

## 2. Audience switch (shared)

- `Chips` with items `therapy-centres` "Therapy Centres" and `schools` "Schools", label "Choose who the pricing is for", centred.
- Reading the URL: `?for=schools` selects Schools; anything else selects Therapy Centres.
- Changing tabs calls `history.replaceState` (no new history entry, no scroll jump) to keep `?for=` in step.
- The panel for each tab has `role="tabpanel"`, `id="pricing-panel-<id>"` and `aria-labelledby="pricing-tab-<id>"`.
- Animation: the incoming panel fades in (opacity, 200ms) and is skipped under reduced motion. Each panel's own `Reveal`/`TextReveal` run when it is shown for the first time; a ScrollTrigger refresh follows the switch so pinned or scroll-triggered pieces measure the now-visible panel.

## 3. Intro + "What's in the platform" (per audience)

- H2 (`TextReveal`, teal, 40/48 desktop, 24/32 mobile) and lede (18/27).
- Sub-heading "What’s in the platform" (heading font, 20px, bold, `text-brand-dark`).
- 6 cards in a `RevealStagger` grid: 1 column on mobile, 2 at `sm`, 3 at `lg`. The card is the Schools Section2 card: white, `border-[1.5px] border-brand-teal-100`, radius 18, the same soft shadow, a tinted round icon (same tint and stroke pairs as Schools Section2), a teal title and body text. The leading figure in a title ("400+") uses brand purple.

**Therapy Centres**
- H2: "For therapy centres: grow beyond therapist hours"
- Lede: "Families stay when they see progress. Each therapist’s plan keeps working at home, between sessions."
- Cards:
  1. Personalised learning plans for each child: AI-drafted in about 10–15 minutes, then reviewed and finalised by your therapist.
  2. **400+** learning objectives across 10 skill areas: From attending and imitation to social, expressive and receptive skills.
  3. Game-based activities and social stories: With gaze, pose and speech detection built in.
  4. Guided videos for home practice: Parent training videos and guided co-learning in the parent app.
  5. Progress tracking per objective: Independent and prompted attempts, first-try rate and days practised.
  6. Outcome reports, generated automatically: Mastery logs, skill-wise progress, time engaged and a monthly report.

**Schools**
- H2: "For schools: inclusion that works across class, home and special educator"
- Lede: "Start with the **10–15%** of learners who need structured support, then extend it to more." ("10–15%" in brand purple, bold.)
- Cards:
  1. Personalised learning plans (IEPs) for each child: AI-drafted in about 10–15 minutes, then finalised by your special educator. Plans adapt with each child’s performance.
  2. **400+** learning objectives across 10 skill areas: Mapped to NCF Foundational Stage and ECCE.
  3. Classroom cues for class teachers: Simple cues tied to each child’s goals, ready to use in class.
  4. Guided home practice: Daily IEP-aligned activities and take-home worksheets (sensory, motor, pencil control, drawing, cognitive) through the parent app.
  5. Progress tracking and outcome reports: Real-time dashboards, mastery logs, a monthly report and CBSE-compliant IEP documentation.
  6. No exams, no labels: Progress is observed during activities, never graded. No diagnosis required.

## 4. Skills scroller (shared component)

- Extract the 10 cards and the `HorizontalScroller` wrapper from `therapy-centres/sections/Section2.tsx` into `components/shared/SkillsScroller.tsx`, driven by a `SKILLS` data array (title, description, image, alt) in `lib/skills.ts`.
- Props: `heading` (default "Skills empowering every child’s journey"), `className` for section padding and background.
- Therapy Centres Section2 becomes `<SkillsScroller />` and must render the same DOM classes and copy as today (a unit test pins the 10 titles, and a before/after screenshot of `/therapy-centres` is compared).
- On Pricing it sits directly under the 6 cards with the same heading as Therapy Centres ("Skills empowering every child’s journey"), so the section is reused as-is. The section background is the page white, not a new band.

## 5. "What your centre/school gets" (per audience)

- Rounded panel (radius 24), `bg-brand-subtle-bg`, padding 32 desktop / 20 mobile.
- Title (heading font, 22px, bold, teal), then 3 items in a row on `lg` and stacked below it. Each item has the plan-card teal check and body text at 18/27.
- Therapy Centres: "What your centre gets": Less therapist time on planning, documentation and parent follow-ups · Progress parents can see, between every session · Live within a week.
- Schools: "What your school gets": Equips your special educator and documents the work · One shared plan across special educator, class teacher and parent · Live within 6 weeks.

## 6. Plans (per audience)

- Heading H2 "Plans for therapy centres" / "Plans for schools".
- Grid: `RevealStagger`, 1 column on mobile; on `lg`, 2 columns for centres and 3 for schools. Cards stretch to equal height and the button sits at the bottom.
- Card base: the current pricing card (white, radius 24, `border-[1.5px] border-brand-teal-100`, shadow `0 10px 24px -6px rgba(23,94,99,0.07)`, padding 32 desktop).
- **Basic** (recommended): border `border-brand-teal` (1.5px). Price "₹2,000" in `text-content-brand-secondary`, bold, 48/56; "/user/month" in secondary text. "Up to 5 users" (semibold, `text-content-brand`), "Excluding taxes". A divider, then the feature list with teal checks. Button: solid, `lg`, full width, "Book a demo" → `/try-demo?plan=basic&for=<audience>`.
- **Custom**: "Custom pricing" in teal, bold, 40/48. Meta line in teal, then a secondary line. Button: outline, full width, "Contact us" → `/contact-us?plan=custom&for=<audience>`.
- **Bloom** (Schools only): background the site's lavender `#f6e8f7` (the start of the `CtaPanel` gradient), border `#ead3ee`. Purple eyebrow "NO SPECIAL EDUCATOR? START HERE" above the name "BLOOM". Button: solid, "Contact us" → `/contact-us?plan=bloom&for=schools`.
- Each card is an `<article aria-labelledby>`; the plan name is an `h3`.

**Therapy Centres plans**
- Basic: "For centres starting with a core team". Features: Personalised learning plans for each child · 400+ learning objectives across 10 skill areas · Game-based activities and social stories · Guided videos for home practice · Progress tracking and outcome reports.
- Custom: "For larger teams and multi-branch centres". "6 or more users" / "One licence per access, priced for your team size". Features: Everything in Basic · Pricing based on the number of users · Live within a week.

**Schools plans**
- Basic: "For schools with a special educator, starting with the children who need structured support most". Features: AI-drafted IEPs for each child · 400+ learning objectives across 10 skill areas · Classroom cues for class teachers · Guided home practice through the parent app · Progress tracking and CBSE-compliant IEP documentation.
- Custom: "For schools extending support to more class teachers and learners". "6 or more users" / "Priced for your team size". Features: Everything in Basic · More users across your special educator and class teachers · Scale from the 10–15% towards more learners · Live within 6 weeks.
- Bloom: "For schools without a special educator". "Tailored to your school" / "Licences, services and on-site support". Features: A CognitiveBotics-trained resource person placed in your school · Everything in the platform · Manages each child’s plan and supports class teachers · Makes sure home practice reaches parents · Live within 6 weeks.

## 7. Parents app panel (inside each panel, same content)

- Rounded panel (radius 24), `bg-brand-subtle-bg`. Copy on the left, buttons on the right on `lg`; stacked on mobile.
- H2 (teal, 28/36 desktop): "For parents: explore CognitiveBotics with your child, free"
- Body: "The free app includes a limited set of lessons, so you can see how your child learns through play. A personalised plan and progress tracking come through your child’s therapist or school. Ask them about using CognitiveBotics together."
- Link (`Button` tertiary): "Know a parent who could use this? Share the app with them." It uses the Web Share API where available and otherwise copies the page URL, with a polite live-region confirmation.
- Store buttons: "Get it on Google Play" and "Download on the App Store", as `Button` solid with `bg-brand-dark` (the site's footer colour) and opening in a new tab. **The site has no store URLs yet;** both point to `/coming-soon` until Samarth supplies them, through one constant in `lib/app-links.ts`.

## 8. Testimonials (per audience)

- Extract Home Section5 into `components/shared/TestimonialsSection.tsx` with props `heading`, `order` (testimonial ids), `showMark` (the CB mark on the right; true on Home). Background, rail, carousel and video card are unchanged.
- Home renders it with today's heading and order; the result must match current Home (same before/after screenshot check).
- The mobile carousel slides come from `TESTIMONIALS` instead of being hand-written, so ordering works on both breakpoints. The copy is identical, so the output does not change.
- Pricing, Therapy Centres: heading "What centres and parents say"; order: video, Dr Chandrashekhar, Mounila, Pavani, Tejaswi.
- Pricing, Schools: heading "What educators and parents say"; order: video, Pavani, Tejaswi, Mounila, Dr Chandrashekhar.

## 9. FAQ (per audience)

- Layout of current pricing Section3 (heading column plus `FaqList`, home FAQ icons, `questionColor="#207d82"`).
- Heading: "Questions centres ask before buying" / "Questions schools ask before buying".
- Answers are placeholders, shown as "Answer coming soon." and stored in `content.ts` behind a `PENDING` marker that a unit test counts, so none can be missed when the real copy arrives.

Therapy Centres questions:
1. Who counts as a user?
2. What if we need more than 5 users, or have more than one branch? Answer (from the mock): "Teams of 6 or more users get custom pricing, based on team size. Each branch needs its own licence per access. Contact us and we will put it together."
3. How quickly can our centre go live?
4. Are prices inclusive of taxes?
5. How does CognitiveBotics fit our existing therapy process?
6. Will parents actually use it?
7. Is children’s data safe?

Schools questions:
1. Who counts as a user?
2. What if we need more than 5 users?
3. We don’t have a special educator. Can we still start?
4. Can we start small?
5. How quickly can our school go live?
6. Are prices inclusive of taxes?
7. Will this add work for our teachers?
8. Will parents worry about labels?
9. Is student data safe?

## 10. Closing CTA (per audience)

`CtaPanel` with label "Contact us" → `/contact-us?for=<audience>`.
- Centres: "Find the right plan for your centre" / "Tell us about your team and the children you support. We’ll walk you through what’s included, how many users you need and how quickly your centre can go live, with no pressure to decide on the call."
- Schools: "Find the right plan for your school" / "Tell us about your team and the children you support. With or without a special educator, we’ll walk you through what’s included, how many users you need, whether the platform or BLOOM suits you, and how quickly your school can go live, with no pressure to decide on the call."

## Corrections found while planning (these override the sections above)

- **Button links.** Basic keeps `/try-demo?plan=basic`, and Custom uses `/try-demo?plan=custom` with the label "Contact us". The demo form already reads `plan` and preselects "6 or more" users for custom, so the visitor's choice carries through. Bloom and the closing CTA go to `/contact-us`. No `for=` parameter is added to these links.
- **Dashes.** The pricing copy tests forbid en and em dashes, so ranges use a hyphen: "10-15%", "UK-India", "about 10-15 minutes".
- **`/faqs` is untouched.** `pricingFaq` (4 answered questions) feeds the Pricing chip on `/faqs` and its FAQPage JSON-LD. It stays exported unchanged. The new per-audience FAQs are separate data and never go into structured data while answers are pending.
- **Reveal in the hidden panel.** A panel hidden with `hidden` has no layout, so its scroll reveals fire straight away and finish while it is hidden. When the visitor switches, the new panel is already revealed and fades in as a whole (200ms opacity, skipped under reduced motion), and `ScrollTrigger.refresh()` runs on the next frame. This replaces "run when shown for the first time" in section 2.
- **No flash on deep links.** `app/pricing/page.tsx` reads `searchParams.for` on the server and passes the initial audience, so `/pricing?for=schools` arrives with Schools already selected. This makes the route render per request, as `/try-demo` already does.

## Code layout

```
components/pages/pricing/
  PricingPage.tsx         hero, switch, two panels, JSON-LD
  content.ts              shared hero copy + `audiences` record keyed by id
  seo.ts                  Basic offer, unchanged price
  AudienceTabs.tsx        'use client': Chips, URL sync, panel visibility
  sections/
    Hero.tsx
    Intro.tsx             H2, lede, 6 cards
    Gets.tsx
    Plans.tsx
    ParentsPanel.tsx      + ShareLink (client)
    Faq.tsx
components/shared/SkillsScroller.tsx
components/shared/TestimonialsSection.tsx
lib/skills.ts
lib/app-links.ts
```

The old `Section0`–`Section3` in `pricing/sections` are deleted. `AudienceTabs` receives both panels as server-rendered children, so only the switch logic ships as client code.

`app/pricing/page.tsx`: description becomes "Pricing for therapy centres and schools: ₹2,000 per user per month for up to 5 users, custom pricing for larger teams, and BLOOM for schools without a special educator."

## Responsive

- Mobile at 375: hero chips wrap, centred; tabs fit on one line; cards and plans stack; the skills scroller and testimonial carousel keep their existing mobile behaviour; store buttons are full width.
- Tablet at 768: cards in 2 columns; plans stay stacked until `lg`.
- Side padding follows the site: `px-5` mobile, `lg:px-[84px]`/`lg:px-24` with `max-w-[1248px]` content.

## Accessibility

- Tabs: existing `Chips` keyboard model (arrows, Home, End), `aria-selected`, roving tabindex.
- One H1. Within each panel: H2 per section, H3 per card and plan.
- Hidden panel uses `hidden`, so it leaves the tab order and the accessibility tree.
- Colour pairs reuse existing site tokens that already pass AA. The purple price on white and the teal text on lavender are checked in the e2e axe run.

## Testing

- Unit (`tests/unit`):
  - `pricing-content.test.ts` rewritten: both audiences have 6 cards, 3 "gets" items, the right plans (2 / 3), FAQ counts (7 / 9) and a count of `PENDING` answers.
  - `pricing-plans.test.tsx` rewritten for the new `Plans` (Basic price, Bloom only for schools, button hrefs).
  - New `pricing-tabs.test.tsx`: `?for=schools` selects Schools, unknown values fall back, switching updates the URL and toggles `hidden`.
  - New `skills-scroller.test.tsx`: 10 titles in order.
- E2E (`tests/e2e/pricing.spec.ts`): default tab, switch by click and keyboard, deep link `?for=schools`, a bad `for` value, scroll position kept on switch, plan counts, no overflow for either audience. axe is not installed in this repo, so accessibility is covered by the tab ARIA and heading assertions instead. Existing Home and Therapy Centres specs still pass.
- Visual: before/after full-page screenshots of `/` and `/therapy-centres` at 1440 and 375 must match after the extractions; `/pricing` is checked against both mocks at 1440 and 375.
- `npm run lint`, `npm test`, `npm run build`.

## Open items

1. **FAQ answers:** 15 of 16 pending (Samarth to send).
2. **Store URLs** for Google Play and App Store.
3. **400+ vs 450+:** the mocks say "400+ learning objectives"; the Schools page and the current pricing page say 450+. This spec follows the mocks. Confirm which figure is right so the site agrees with itself.
4. **"Talk to our team" on Schools** could link to `/pricing?for=schools`. Out of scope unless asked.

## Final content (2026-11-06)

`illustrations/CognitiveBotics_Pricing_Page_Content.pdf` is the final copy and overrides the copy above where they differ:
- 14 of 16 FAQ answers are supplied; "Who counts as a user?" stays pending on both tabs.
- Testimonials: centres show Dr Chandrashekhar and Mounila; schools show Pavani and Tejaswi (after the video card).
- Ranges use an en dash ("10–15%", "UK–India"). The copy test forbids em dashes and "!".
- Store buttons follow the official badge look until the official badge files are supplied.
- The PDF's brand notes (flat #E4F4F6 backgrounds, pastel card fills, #6E0074 purple) are not applied: the page keeps the site's existing visual language, as Samarth asked at the start. This is listed for Samarth to confirm.
