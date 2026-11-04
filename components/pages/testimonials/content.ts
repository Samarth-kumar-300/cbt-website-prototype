import type { Testimonial } from '@/lib/testimonials';

type WithAudience = { readonly audience: Testimonial['audience'] };

export const testimonialsContent = {
  title: 'What families and professionals say',
  subtitle: 'In their own words.',
  chipsLabel: 'Testimonial groups',
  cta: { heading: 'Want results like these?', label: 'Book a demo', href: '/try-demo' },
} as const;

export type TestimonialGroup = { readonly id: string; readonly label: string; readonly audience?: Testimonial['audience'] };

const GROUPS: readonly TestimonialGroup[] = [
  { id: 'all', label: 'All' },
  { id: 'parents', label: 'Parents', audience: 'parent' },
  { id: 'therapists', label: 'Therapists', audience: 'therapist' },
  { id: 'schools', label: 'Schools', audience: 'school' },
];

/** A chip with no quotes behind it is left out. */
export function testimonialGroups(items: readonly WithAudience[]): TestimonialGroup[] {
  return GROUPS.filter((g) => !g.audience || items.some((q) => q.audience === g.audience));
}

/** Quotes longer than this (about four lines in a card) are clamped, with a Read more button. */
export const LONG_QUOTE = 150;
