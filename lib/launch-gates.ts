/**
 * Which Learn pages are linked from the footer and the Try Demo confirmation (the nav dropdown
 * always lists all of them). Spec 2026-11-03 ("Launch gates") wants case studies 2, testimonials 6,
 * blog 6 posts with bodies before a page is linked. Research and achievements are real content
 * captured from the live site, so they have no gate beyond being built.
 *
 * TODO: case studies are sample placeholders (see components/pages/case-studies/content.ts) and
 * testimonials has 4 quotes, not 6. Both are on by request; revisit before launch.
 */
export const LIVE_PAGES = {
  caseStudies: true,
  faqs: true,
  blog: true,
  testimonials: true,
  research: true,
  achievements: true,
} as const;

export type LivePages = { readonly [K in keyof typeof LIVE_PAGES]: boolean };
