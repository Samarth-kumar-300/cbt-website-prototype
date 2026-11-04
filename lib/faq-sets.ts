import { faq as homeFaq } from '@/components/pages/home/content';
import { faqIcons as homeIcons } from '@/components/pages/home/faq-icons';
import { faq as parentsFaq } from '@/components/pages/parents/content';
import { faqIcons as parentsIcons } from '@/components/pages/parents/faq-icons';
import { pricingFaq } from '@/components/pages/pricing/content';
import { faq as schoolsFaq } from '@/components/pages/schools/content';
import { faqIcons as schoolsIcons } from '@/components/pages/schools/faq-icons';
import { faq as therapyFaq } from '@/components/pages/therapy-centres/content';
import { faqIcons as therapyIcons } from '@/components/pages/therapy-centres/faq-icons';
import type { FaqCardIcon, FaqCardItem } from '@/components/shared/FaqCards';

export type FaqSet = {
  readonly id: string;
  readonly label: string;
  readonly items: readonly FaqCardItem[];
  /** Per-question icons, as on the page the set comes from. */
  readonly icons?: readonly FaqCardIcon[];
};

/** Shown at the foot of /faqs. Update when any answer changes. */
export const FAQ_LAST_UPDATED = 'November 2026';

// Each set reads from the same content file as its source page, so one edit updates both.
export const FAQ_SETS: readonly FaqSet[] = [
  { id: 'general', label: 'General', items: homeFaq, icons: homeIcons },
  { id: 'therapy-centres', label: 'Therapy centres', items: therapyFaq, icons: therapyIcons },
  { id: 'schools', label: 'Schools', items: schoolsFaq, icons: schoolsIcons },
  { id: 'parents', label: 'Parents', items: parentsFaq, icons: parentsIcons },
  { id: 'pricing', label: 'Pricing', items: pricingFaq, icons: homeIcons },
];

export function faqPageJsonLd(sets: readonly FaqSet[] = FAQ_SETS) {
  const seen = new Set<string>();
  const mainEntity = sets
    .flatMap((s) => s.items)
    .filter((i) => (seen.has(i.q) ? false : (seen.add(i.q), true)))
    .map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } }));
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity };
}
