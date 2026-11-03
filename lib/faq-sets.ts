import { faq as homeFaq } from '@/components/pages/home/content';
import { faq as parentsFaq } from '@/components/pages/parents/content';
import { pricingFaq } from '@/components/pages/pricing/content';
import { faq as schoolsFaq } from '@/components/pages/schools/content';
import { faq as therapyFaq } from '@/components/pages/therapy-centres/content';

export type FaqSet = {
  readonly id: string;
  readonly label: string;
  readonly items: readonly { readonly q: string; readonly a: string }[];
};

/** Shown at the foot of /faqs. Update when any answer changes. */
export const FAQ_LAST_UPDATED = 'November 2026';

// Each set reads from the same content file as its source page, so one edit updates both.
export const FAQ_SETS: readonly FaqSet[] = [
  { id: 'general', label: 'General', items: homeFaq },
  { id: 'therapy-centres', label: 'Therapy centres', items: therapyFaq },
  { id: 'schools', label: 'Schools', items: schoolsFaq },
  { id: 'parents', label: 'Parents', items: parentsFaq },
  { id: 'pricing', label: 'Pricing', items: pricingFaq },
];

export function faqPageJsonLd(sets: readonly FaqSet[] = FAQ_SETS) {
  const seen = new Set<string>();
  const mainEntity = sets
    .flatMap((s) => s.items)
    .filter((i) => (seen.has(i.q) ? false : (seen.add(i.q), true)))
    .map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } }));
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity };
}
