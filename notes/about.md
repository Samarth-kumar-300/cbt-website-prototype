# About page notes

## Requested change to a read-only file (lead decides)

`app/globals.css`, `body` rule: `font-family: var(--font-sans);` makes the whole site render in the system font instead of Open Sans.

Why: `--font-sans` is declared inside `@theme inline`, so Tailwind inlines it and never emits it as a custom property. `var(--font-sans)` is therefore undefined, the declaration is invalid at computed-value time, and the unlayered `body` rule beats the layered `.font-sans` utility on `<body>`. Computed body font-family is `-apple-system, system-ui, ...` and `document.fonts` never loads Open Sans. Headings (`font-heading`) are unaffected.

Suggested fix (one line):

```css
body {
  font-family: var(--font-open-sans), "Open Sans Fallback", Arial, sans-serif;
}
```

Effect on `/about` (measured with this fix applied locally, then reverted): verify goes from
375 mismatch 0.0283 (band 200-400) / 1024 mismatch 0.0929 (bands 3200-3800) / 1440 mismatch 0.0176 (band 200-400)
to PASS at all four widths (0.0118 / 0.0085 / 0.0047 / 0.0077, no bad bands).
Without it, body text is wider than the original and wraps earlier, so card heights drift at 1024 and the Advisory section shifts down.

This affects every page, not just `/about`.

## Remaining differences

- Page height differs only because of the shared Footer (ref 375: footer is shorter, new has a stacked link layout and a 4-icon social row; ref/new total 4125/4365 at 375, 3153/3206 at 768). Everything through the closing CTA aligns pixel for pixel at 375. Needs a change in `components/shared/Footer*` (read-only).
- At 375, `verify` bad band 200-400 (without the font fix) is the sticky header captured mid-page in the new screenshot plus text anti-aliasing; the in-flow hero matches.
- Leadership and Advisory headshots render as labeled `Placeholder`s because no local image files exist (see `reference/image-manifest.json`). Expected diff in the photo circles.
- Page has no FAQ.

## PDF sync (About Us design update)

Audit: `notes/about-audit.md` (49 rows). Changes made are listed there.

### Footer is missing a Resources link (shared)
- Type: shared-change-request
- Where: components/shared/Footer.tsx, RESOURCES group
- Detail: PDF footer lists Knowledge base, Blog, Development checklist. The code has only Knowledge base and Blog. Needs a "Development checklist" link (href not in the PDF).

### CTA button destination
- Type: deviation
- Where: components/pages/about/sections/Section4.tsx
- Detail: PDF changes the button label to "Ready to get started" but does not show a destination. The link still goes to /contact-us. Confirm the target (contact page, demo, or sign-up).

### LinkedIn icons on leadership and advisory cards
- Type: deviation
- Where: components/pages/about/sections/Section2.tsx, Section3.tsx, components/pages/about/LinkedInIcon.tsx
- Detail: PDF shows a LinkedIn glyph on every card. No profile URLs were supplied, so the glyph is decorative (aria-hidden) and not a link. Provide the profile URLs if these should link.

### Headshots are local files now
- Type: deviation
- Where: public/images/about/*.webp (new files)
- Detail: 11 headshots extracted from the PDF and saved as webp. Hunny Agarwal is cropped from the full-length cutout (10-X1), Zoya Belyaeva is a square crop of the portrait. Placeholders were replaced with next/image. Visual check only, not a browser render.

### Page metadata title (not in PDF)
- Type: deviation
- Where: app/about/page.tsx
- Detail: title reads "About Us | CognitiveBotics | CognitiveBotics" (brand repeated). Not in the PDF, left unchanged.
