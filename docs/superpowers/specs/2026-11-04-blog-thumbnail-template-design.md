# Blog thumbnail template (3-thumbnail campaign set)

Date: 2026-11-04. Status: implemented. (Supersedes the dark-teal shape-cluster design.)

## Goal

Three professional thumbnails for three blog posts that read as one design campaign: the same frame, type, colour and slot structure, each with its own illustration module. Built from a reusable template (a short copy spec goes in, a PNG comes out) so more can be added later.

Deliverable: **3 PNG files**, 1200 × 675 each. The blog cards are not changed yet.

## Decisions already made

- Follow the structure and placement of the three reference images, in CognitiveBotics colours and type (Nunito, Open Sans), not the references' blue, yellow or Montserrat. The references show another company's content; none of their copy or branding is reused.
- Thumbnails are rendered static images: no interaction, no hover, no motion.
- Only three thumbnails; the three posts are Physical activities, Screen time and Early intervention.
- Built from many different shape types (notched ticket, barcode, check circles, tag chips, waveform bars, dotted tracks, pill chips, slanted panel, rings, dots).
- Card size only (16:9). No share image, no `og:image` work. Deliver the PNGs first; wiring them into `/blog` is a later step.

## What the references teach

| Reference | Layout | Illustration module |
|---|---|---|
| 1. "Ready before they board" | Text block left, vertically centred; art right on a soft glow | A tilted boarding-pass ticket: notched card, perforation, barcode stub, check rows, a highlight tag |
| 2. "Compliance, rehearsed out loud" | Eyebrow and heading upper-left, descriptor pinned bottom-left; a slanted dark gradient panel fills the right | Labelled rows of waveform bars on dotted tracks; a highlight tag with a connector line to one bar |
| 3. "Rehearse the value analysis path in order" | Text across the top; a full-width dark gradient band along the bottom | Pill chips in two centred rows; one chip highlighted |

What they share, and what we copy as the campaign system:

1. An outer light frame with an inner white rounded card (card-in-card), soft border and shadow.
2. **Eyebrow:** a short accent dash then a bold label in the accent colour.
3. **Two-tone headline:** 2 short lines, bold, near-black first part, accent colour on the second part.
4. **Descriptor:** one regular-weight grey line or two, below the headline (or pinned to the bottom-left in the split layout).
5. **One strong dark gradient surface** (panel, band or ticket stub) that carries the white content, with one warm/bright highlight element per thumbnail.
6. Generous white space; the illustration is made of UI-like parts, not clip art.

## The campaign: what is fixed and what varies

Fixed in all three:

- The frame, the eyebrow style, the two-tone headline style, the descriptor style, the dark gradient surface, the chip/tag style, the shadows, the glow.
- Type sizes and colours below.

Varies per post:

- The layout archetype (ticket, split panel, band) and its illustration.
- The copy.

| Post | Layout | Eyebrow | Headline (plain / accent) | Descriptor |
|---|---|---|---|---|
| Early intervention | Ticket (reference 1) | Early intervention guide | Early support, / more time to grow | What it is, and why timing matters |
| Screen time | Split panel (reference 2) | Screen time guide | Screens work best / watched together | Three viewing strategies for parents |
| Physical activities | Band (reference 3) | Physical activity guide | Movement that builds / more than muscle | How activity supports children with autism |

All copy comes from the articles; nothing is invented. Headline lines are at most 20 characters so each fits on one line.

### Illustration content

- **Ticket (Early intervention).** Small label "M-CHAT-R screening"; large "16 → 30 months" (the article: M-CHAT-R screening is used for children aged 16 to 30 months); two check rows "Spot early signs" and "Start support" (the article's "early signs to watch for" and therapies); on the stub a barcode and a highlight tag "Start early".
- **Split panel (Screen time).** Three rows, labelled Restrictive, Co-viewing, Interactive (the article's three mediation strategies), each a waveform of rounded bars on a dotted track. Only Interactive is bright, with the highlight tag "Most effective" and a connector line to one bar (the article calls it the most effective of the three). The other two rows are the same dimmer style, because the article does not rank them against each other.
- **Band (Physical activities).** Six chips from the article's benefit headings: Motor skills (highlighted), Sensory integration, Social bonds, Emotional wellness, Focus, Confidence. Faint rings and a dot grid on the band add depth. The descriptor carries no count, because the article has eight benefits and the band shows six.

## Layout (1200 × 675 canvas)

- **Frame:** outer fill `#eef9f9` (`background-brand-subtle`); inner white card inset 20px on every side, radius 32px, 1.5px `#e4edea` border, soft shadow (`0 10px 30px rgba(16,73,76,0.06)`). The dark surfaces are clipped by the card's rounded corners. Content padding inside the card is 56px, so text starts at x = 76.
- **Glow:** a soft radial glow behind the illustration using the site's own hero gradient hues (green, sky, lilac, `--gradient-hero`) at low opacity.
- **Ticket layout:** text block at x = 76, vertically centred, max width 520. Ticket 520 × 296 centred near (884, 342), rotated −6°, perforation 340px from its left edge, notch radius 14.
- **Split layout:** panel polygon (700,20) (1180,20) (1180,655) (640,655), clipped to the card. Eyebrow at y ≈ 120 with the headline below; descriptor pinned bottom-left. Rows at x 760 to 1130, centres y ≈ 190, 345, 500.
- **Band layout:** eyebrow at y ≈ 84, headline, then the descriptor on one line; band x 76 to 1124, y ≈ 395 to 595, radius 28, chips in two centred rows.
- The text never overlaps the illustration: text right edge ≤ illustration left edge (ticket, split) or text bottom ≤ band top (band).
- No logo, as in the references.

## Typography and colour

| Element | Style |
|---|---|
| Eyebrow | 36 × 5px rounded dash, 16px gap, Nunito 700 28px, purple `#a14da5` (the site's Eyebrow colour) |
| Headline | Nunito 800 56px, line-height 1.12; plain line `#101319` (`text-default`), accent line `#207d82` (`content-brand`) |
| Descriptor | Open Sans 400 30px / 1.4, `#374151` (`text-secondary`) |
| Illustration labels | Nunito 700 to 800, 24 to 30px |
| Dark surface | `linear-gradient(135deg, #0c3b3e, #10494c 35%, #175f63 70%, #207d82)` with a purple glow (`rgba(161,77,165,0.35)`) in the lower right, echoing the references' blue-to-violet shift in brand colours |
| Highlight (tags, one chip) | brand purple `#a14da5` fill, white Nunito 800 text |
| Chips and check rows on the dark surface | white fill, `#10494c` text |

Contrast, all at 4.5:1 or better: plain headline on white, teal accent on white (4.9:1), purple on white (5.1:1), white on purple (5.1:1), white on the lightest gradient stop (4.9:1), `#374151` on white.

The references use a warm yellow highlight. CognitiveBotics has no yellow in its palette, so the highlight is the brand purple; a yellow can be added later if wanted.

At the narrowest card (about 22% of the master) the headline is about 12.5px, still readable; descriptors and chip text become small but are secondary, as in the references.

## Architecture

The template is code that exists to be rendered; only the PNGs are a deliverable.

- `components/pages/blog/thumbnail/thumbnails.ts`: a typed copy spec per post slug: eyebrow, headline lead and accent, descriptor, and the layout-specific data (ticket content, rows and highlight, or chips and highlight). Also marks which posts have a thumbnail.
- `components/pages/blog/thumbnail/ThumbnailFrame.tsx`: the shared frame, glow, eyebrow, headline, descriptor, and the slot for an illustration.
- `components/pages/blog/thumbnail/TicketArt.tsx`, `SplitArt.tsx`, `BandArt.tsx`: the three illustration modules.
- `components/pages/blog/thumbnail/PostThumbnail.tsx`: picks the layout from the spec and renders frame plus art at exactly 1200 × 675. Throws a clear error for a post with no spec.
- `components/pages/blog/thumbnail/tokens.ts`: the colours above as constants, shared by the components and the contrast test.
- `app/kit/thumbnail/[slug]/page.tsx`: render route (`noindex`, like `app/kit/page.tsx`); 404 for an unknown slug or a post with no spec; pinned over the header, footer and cookie banner.
- `app/kit/thumbnail/page.tsx`: an index listing every thumbnail post (`data-slug` links) at 400px wide, for review and for the script to read.
- `tools/render-thumbnails.mjs` and `npm run thumbnails`: build, serve, read the slugs from the index page, screenshot each, write `public/blog/thumbs/<slug>.png`. Committed output.
- No change to `PostCard`, post pages or metadata.

## Testing

- Unit (Vitest):
  - copy limits: every spec has a two-part headline with each part at most 20 characters, a descriptor of at most 44 characters, and layout data in range (ticket rows ≤ 2, split rows = 3 with a valid highlight, band chips ≤ 6, each ≤ 20 characters, valid highlight);
  - the three posts use three different layouts;
  - contrast: every text and background pair in the table above is at least 4.5:1, computed from `tokens.ts`;
  - campaign consistency: each thumbnail renders exactly one eyebrow, one two-line headline, one descriptor, uses the same frame and the same text colours;
  - a missing spec fails loudly; markup characters in copy show as text;
  - every post with a spec has a 1200 × 675 PNG.
- E2E (Playwright), for all three:
  - the render route is exactly 1200 × 675;
  - the headline lines do not overflow their box and stay inside the card's padding;
  - the text block never overlaps the illustration (bounding boxes), and the illustration stays inside the card;
  - the header and cookie banner never cover the thumbnail even without cookie consent;
  - an unknown slug and a post with no thumbnail are 404.
- Visual: view each PNG at full size, then a 3-up contact sheet at 400px and 280px wide, and judge placement against the three references (text block position, illustration weight, highlight element, white space). Check the set reads as one campaign.
- `npm run lint`, `npm test`, `npm run build` pass.

## Out of scope

Showing the PNGs on `/blog` cards, share images and `og:image`, a logo on the thumbnails, thumbnails for the other three posts, animation or hover effects, a dark-mode variant, a warm yellow highlight.

## Risks

- Hand-built illustrations need visual tuning; coordinates and sizes are expected to change in the review.
- Rotated ticket text and thin dotted lines can render soft; the visual review checks them at full size.
- A PNG goes stale if its copy spec changes and `npm run thumbnails` is not re-run. The unit test checks files exist and have the right size, not that they match the copy.
- The repo has many uncommitted changes on branch `nav-pricing-demo-pages`. This work touches only the files above plus `package.json` (one script), `tools/`, `public/blog/thumbs/`, `CLAUDE.md` and tests.
