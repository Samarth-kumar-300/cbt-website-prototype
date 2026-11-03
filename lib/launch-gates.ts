/**
 * A Stories page is linked from the nav and footer only once it has enough real content
 * (spec 2026-11-03, "Launch gates"): case studies 2, testimonials 6, blog 6 posts with bodies.
 * Flip a flag when its page is ready to be linked.
 */
export const LIVE_PAGES = {
  caseStudies: false,
  faqs: true,
  blog: false,
  testimonials: false,
} as const;

export type LivePages = { readonly [K in keyof typeof LIVE_PAGES]: boolean };
