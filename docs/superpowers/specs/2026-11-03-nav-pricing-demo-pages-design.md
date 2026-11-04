# Nav, Pricing, Try Demo and Stories pages: design

Date: 2026-11-03

## Goal

Improve SEO and conversion with a clearer navigation and five new or rebuilt page groups:

1. Replace the "Resources" nav item with a "Stories" dropdown (Case studies, FAQs, Blog, Testimonials).
2. Add a "Pricing" page.
3. Rebuild "Try demo" as form, then Calendly booking, then confirmation.
4. Build Blog, Case Studies, FAQs and Testimonials pages.

This spec covers layout, information architecture and copy. It does not cover build order, which goes in the plan.

## Decisions

- Nav label is **Stories** (single word, same weight as "Schools" and "Parents"). Test it with a first-click test before launch.
- The dropdown has four pages with their own URLs, for SEO.
- The old `/resources` content is redistributed. `/resources` redirects to `/case-studies`.
- Pricing has one plan (Basic, INR, monthly). Both pricing CTAs go to `/try-demo`.
- Try Demo is one URL with three card states. No `/try-demo/book` or `/try-demo/thank-you` routes.
- All copy follows lean-copy: sentence case, no em dashes, buttons name the action.
- Motion reuses `Reveal`, `RevealStagger`, `TextReveal`, `MotionImage`. No one-off animations.
- Design language: Nunito headings in teal, Open Sans body, pill buttons, 16 to 32px radius cards, pastel gradients, purple eyebrow. Match `Button`, `Section`, `Eyebrow`, `FAQ`.

## Sitemap and redirects

| Route | Status | Notes |
|---|---|---|
| `/pricing` | New | |
| `/faqs` | New | |
| `/testimonials` | New | Hidden until 6 real quotes exist |
| `/case-studies`, `/case-studies/[slug]` | New | Hidden until 2 real case studies exist |
| `/blog`, `/blog/[slug]` | New | Remove `/blog` and `/blog/:slug*` from `lib/stub-routes.ts`. Keep the six existing slugs unchanged |
| `/try-demo` | Rebuilt | Reads `?plan=basic` or `?plan=custom` |
| `/resources` | Permanent redirect to `/case-studies` | Until the Case Studies page ships, redirect to `/blog` |
| `/resources/research/:slug*` | Unchanged | Stays a stub |

Footer: "Platform" gains Pricing. "Resources" column lists Case studies, FAQs, Blog, Testimonials, Knowledge base, Development checklist. The old `/resources#blog` link becomes `/blog`.

## Navigation

Desktop order:

`THERAPY CENTRES | SCHOOLS | PARENTS | PRICING | STORIES ▾ | ABOUT US | GET IN TOUCH`

"Sign in" and the "Try demo" pill stay on the right.

Dropdown panel (reuses the Sign-in menu style: white, `rounded-2xl`, `menu-in`, Escape closes):

| Item | Helper line |
|---|---|
| Case studies | How centres and schools use CognitiveBotics |
| FAQs | Quick answers before you book |
| Blog | Guides on autism and early support |
| Testimonials | Families and professionals, in their words |

- The "Stories" label is a button (`aria-haspopup`, `aria-expanded`), not a link. It takes the active colour on any child route.
- The four links are always in the HTML so crawlers see them. The footer repeats them.
- Mobile drawer: "Stories" is an accordion with four sub-links, using the Sign-in accordion pattern. Pricing is a plain link.
- If Case studies or Testimonials are hidden (see Launch gates), their rows are not rendered.

Files: `components/shared/nav-links.ts`, `Header.tsx`, `Footer.tsx`, `lib/stub-routes.ts`, `next.config.ts` (redirect).

## Pricing (`/pricing`)

Reference: Mistral. Single paid plan, so no "Most popular" banner, no billing toggle, no currency toggle.

```
HERO        PRICING (eyebrow) / One plan for centres and schools / The same price for both.
CARDS       2 columns, CTA pinned to the bottom of each card
            Basic                          Custom
            For centres and schools        For 6 or more users
            ₹2,000 /user/month             Custom pricing
            Up to 5 users                  Volume pricing for larger teams
            5 users: ₹10,000 per month
            Excluding taxes
            7 feature rows                 3 feature rows
            [Book a demo]                  [Talk to sales]
TESTIMONIALS  reuse the home carousel
FAQ         4 questions (FAQ component)
CTA PANEL   Not sure which fits? / [Book a demo]
```

Mobile: cards stack, Basic first, CTAs full width, hero left-aligned.

CTAs: Basic links to `/try-demo?plan=basic`. Custom links to `/try-demo?plan=custom`. Both are plain links. No third-party script on this page.

Basic feature rows (all from existing site claims):

- Personalised learning plans for each child
- AI-guided games that adapt to progress
- 10 skill areas, 450+ learning objectives
- Guided videos for home practice
- Progress tracking and outcome reports
- One view of your whole caseload
- Shared goals for therapists, teachers and parents

Held out on purpose (look like Bloom programme items, not per-user plan items): 1,800+ structured tasks, 20+ social stories, teacher onboarding and specialist mentoring, school-wide implementation.

Custom feature rows:

- Everything in Basic
- Volume pricing for 6 or more users
- Rollout planned around your team (assumption, confirm)

Pricing FAQ:

1. Who counts as a user? "We'll confirm the exact count in your demo." (rule not settled)
2. What happens after I book a demo? The team replies within 2 to 3 business days.
3. Is there published research behind this? Reuse the Therapy Centres answer.
4. Is it suitable for NGOs, not just private centres? Reuse the Therapy Centres answer.

SEO: title "Pricing | CognitiveBotics", `Offer` JSON-LD (2000 INR per user per month), one H1, H2 per section.

## Try Demo (`/try-demo`)

Reference: Headspace. The four games preview cards are removed.

```
HERO (gradient, two columns)
LEFT                                RIGHT (white card, 24px radius)
See CognitiveBotics in action       ① Your details ─ ② Pick a time ─ ③ Done
Tell us about your team, then       form, Calendly or confirmation
pick a time for your demo.
testimonial card (2 parent quotes, dots)
NIEPID validated · JMIR-published · ISO 27001 certified
```

Mobile: the card comes first. Testimonial and trust row sit below it.

### Fields

| Field | Type | Rule |
|---|---|---|
| Name | text | required |
| Email | email | required |
| Phone number | tel with dial code | required |
| I am a | select: Therapist, Parent, Therapy centre admin, School, Other | required |
| Centre or school name | text | shown only for Therapy centre admin and School |
| How many users | select: 1, 2, 3, 4, 5, 6 or more | required |

- Helper under users: "We'll confirm the exact count in your demo." Under "6 or more": "Custom pricing applies."
- `?plan=custom` preselects "6 or more". `?plan=basic` leaves it open and shows "Basic: up to 5 users, ₹2,000 each."
- Consent line: "By submitting, you agree we may contact you about your demo." plus a Privacy policy link.
- No message field, no captcha. Add a honeypot field. A real captcha waits for the lead endpoint.
- Button: "Submit & Book".
- Reuse `lib/contact-form.ts` (`validateFields`, `useGuardedSubmit`) and `components/pages/contact-us/Select.tsx`.

### States

| State | Content | Copy |
|---|---|---|
| ① Details | Form | Button "Submit & Book" |
| ② Pick a time | Calendly embedded in the card, name and email prefilled | "Demo request received" / "Pick a time that suits you." Link under the embed: "Book later" |
| ③ Done, booked | Confirmation | "Demo booked" / "Our team will get back to you in 2 to 3 business days." Button "Read case studies" |
| ③ Done, skipped | Same screen | "Request received" / same line |

- Load the Calendly script only when state ② opens. Listen for `calendly.event_scheduled` to move to ③.
- Move focus to the new heading on each change (the contact form already does this).
- Analytics events: demo_submitted, demo_booked, demo_skipped.

## FAQs (`/faqs`)

Reference: SpaceXAI. Shared `FAQ` component, chips as tabs.

```
HERO     Frequently asked questions / Answers for parents, therapy centres and schools.
         ( General ) ( Therapy centres ) ( Schools ) ( Parents ) ( Pricing )
LIST     hairline-divided accordion, one item open, "Last updated: <month year>"
CTA      Still have a question? / [Get in touch]
```

| Chip | Source | Questions |
|---|---|---|
| General | Home | 8 |
| Therapy centres | Therapy Centres page | 5 |
| Schools | Schools page | 9 |
| Parents | Parents page | 5 |
| Pricing | Pricing page | 4 |

- Each set is read from the same content file as its source page, so one edit updates both.
- Chips are `role="tab"`, with arrow-key support. The selected chip syncs to the hash (`/faqs#schools`). All five panels stay in the HTML (`hidden`, not removed).
- Selected chip: solid teal. Others: outline pill. Mobile: chips wrap.
- SEO: `FAQPage` JSON-LD for all 29 questions. "Last updated" comes from one constant.

## Blog (`/blog`, `/blog/[slug]`)

Reference: Windsurf.

Index:

```
HERO      Blog / Guides and news on autism and early support.
FEATURED  one wide card: cover image left, tag, title, excerpt, date · read time right
CHIPS     ( All ) ( Early intervention ) ( Motor skills ) ( Autism ) ( Screen time ) ( Travel )
GRID      3 columns (2 tablet, 1 mobile), "Show more" only above 9 posts
```

- Cards extend the existing blog card from the old Resources page (20px radius, 1.5px teal-100 border, `card-lift`, tinted pill, "Read now"). A cover image replaces the small icon.
- Until covers exist, use a pastel gradient tile with the category icon.

Post page: breadcrumb (Blog > Category), category pill, H1, meta line, cover image, body in a 720px column at 18px, "Keep reading" with 3 related posts, closing panel "See it in your centre or school" / "Book a demo".

SEO: `Article` JSON-LD, breadcrumbs, canonical URLs, sitemap. The six existing slugs stay as they are:

- the-transformative-power-of-physical-activities-for-children-with-autism
- fun-ways-to-boost-motor-skills-of-children-with-autism
- understanding-the-underlying-causes-of-autism-a-comprehensive-guide
- the-startling-truth-about-screen-time-and-autism
- early-intervention-is-the-key-to-managing-autism
- how-to-travel-with-children-who-have-autism

## Case studies (`/case-studies`, `/case-studies/[slug]`)

References: Ada (index), Stripe (detail).

Index:

```
HERO     CASE STUDIES (eyebrow) / Results from real centres and schools /
         See what changed after they started with CognitiveBotics.
PANELS   stacked, full width, 32px radius, pastel gradients (mint, lilac, peach in turn)
         photo or logo | org · type, outcome headline, key metric, [Read case study] | quote, name, role
PROOF    "Proof and research": the old Resources Research, Achievements, Knowledge base and video, reused
CTA      Want results like these? / [Book a demo]
```

- Mobile panel order: photo, headline, metric, quote, button.
- No filter chips until 6 or more case studies.

Detail:

```
breadcrumb: Case studies > Org name
CASE STUDY (eyebrow)           | one paragraph about the organisation
Headline naming the outcome    | Type · Location · Users
3 stat tiles (Therapy Centres stat style)
Challenge                      | dark teal quote card (sticky): logo, quote, name, role
Solution                       |
Features used (check chips)    |
CTA panel: Want results like these? / [Book a demo]        Next case study →
```

Content shape per case study: organisation, type, location, headline, 3 metrics, challenge, solution, features used, quote with name and role, photo or logo, written permission to publish.

SEO: `Article` JSON-LD, breadcrumbs, canonical.

## Testimonials (`/testimonials`)

No reference. Built from existing patterns.

```
HERO    What families and professionals say / In their own words.
CHIPS   ( All ) ( Parents ) ( Therapists ) ( Schools )
GRID    3 columns of quote cards: quote mark, text clamped with "Read more", name, role
CTA     Want results like these? / [Book a demo]
```

- One data file feeds this page, the home carousel, Pricing and Try Demo.
- No review structured data: Google ignores reviews a company publishes about itself.

## Launch gates

A page goes live, and its nav row renders, only with enough real content:

| Page | Minimum |
|---|---|
| Case studies | 2 real case studies |
| Testimonials | 6 real quotes |
| Blog | 6 posts with body content |

Until then the row is hidden and `/resources` redirects to `/blog`. Never ship placeholder text to production.

## Reuse map

| Need | Existing piece |
|---|---|
| Hero gradient, eyebrow, sections | `Section`, `Eyebrow`, `TextReveal`, try-demo hero gradient |
| Buttons | `Button` (solid, outline, tertiary) |
| FAQ list | `components/shared/FAQ.tsx` |
| Chips | New shared `Chips`, used by FAQs, Blog, Testimonials |
| Form logic and select | `lib/contact-form.ts`, `contact-us/Select.tsx` |
| Testimonials | `home/TestimonialCarousel.tsx`, `TestimonialRail.tsx` |
| Research, Achievements, Knowledge base | Old `components/pages/resources/sections` (moved to Case Studies) |
| Dropdown | Header Sign-in menu pattern |
| Motion | `Reveal`, `RevealStagger`, `MotionImage`, `card-lift` |

## Testing

- Unit: nav config, form validation (including conditional field and plan param), FAQ tabs and hash sync, Calendly state machine (details, pick a time, booked, skipped), launch gates.
- Playwright: nav dropdown (desktop and mobile), `/resources` redirect, Pricing CTAs reach `/try-demo?plan=...`, full Try Demo journey with Calendly mocked, FAQ chips, Blog filter, existing blog slugs resolve.
- Run `npm run lint`, `npm test`, `npm run build` before declaring done.

## Open items

1. Calendly link.
2. Lead endpoint. Submit is a client-side stub today and the repo has no API routes. Decide where leads go (email, CRM, sheet) before launch.
3. Confirm Basic feature rows and the Custom "rollout planned around your team" row.
4. Define "user" for the 5-user limit. Parents counting as users would push most centres to Custom.
5. Case study material for at least 2 organisations, with permission.
6. At least 4 more testimonials, ideally from centres and schools.
7. Blog: article bodies (pull from the live site with `tools/capture`), cover images, dates, read times, author.
8. Confirm "Excluding taxes" (assumed GST on top).
9. First-click test of the "Stories" label.
10. Confirm the 2 to 3 business days line next to an instant Calendly confirmation.
