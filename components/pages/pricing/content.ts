import type { FaqCardItem } from '@/components/shared/FaqCards';
import { faq as therapyFaq } from '../therapy-centres/content';

// Feature rows come from claims already on the Therapy Centres, Schools and Home pages.
// Bloom programme items (1,800+ tasks, social stories, specialist mentoring) are left out on purpose.
export const pricingContent = {
  eyebrow: 'PRICING',
  title: 'One plan for centres and schools',
  subtitle: 'The same price for both.',
  plans: [
    {
      id: 'basic',
      name: 'Basic',
      audience: 'For centres and schools',
      price: '₹2,000',
      unit: '/user/month',
      note: 'Up to 5 users',
      total: '5 users: ₹10,000 per month',
      taxes: 'Excluding taxes',
      features: [
        'Personalised learning plans for each child',
        'AI-guided games that adapt to progress',
        '10 skill areas, 450+ learning objectives',
        'Guided videos for home practice',
        'Progress tracking and outcome reports',
        'One view of your whole caseload',
        'Shared goals for therapists, teachers and parents',
      ],
      cta: { label: 'Book a demo', href: '/try-demo?plan=basic' },
    },
    {
      id: 'custom',
      name: 'Custom',
      audience: 'For 6 or more users',
      price: 'Custom pricing',
      unit: null,
      note: 'Volume pricing for larger teams',
      total: null,
      taxes: null,
      features: ['Everything in Basic', 'Volume pricing for 6 or more users', 'Rollout planned around your team'],
      cta: { label: 'Talk to sales', href: '/try-demo?plan=custom' },
    },
  ],
  testimonialsHeading: 'What our users say',
  faqHeading: 'Frequently asked questions',
  cta: { heading: 'Not sure which fits?', body: 'Book a demo and we’ll help you choose the right plan.', label: 'Book a demo', href: '/try-demo' },
} as const;

function reuse(question: string) {
  const hit = therapyFaq.find((f) => f.q === question);
  if (!hit) throw new Error(`FAQ not found on Therapy Centres: ${question}`);
  return hit;
}

export const pricingFaq: readonly FaqCardItem[] = [
  { q: 'Who counts as a user?', a: 'We’ll confirm the exact count in your demo.' },
  {
    q: 'What happens after I book a demo?',
    a: 'You pick a time right after you submit the form. Our team will get back to you in 2 to 3 business days.',
  },
  reuse('Is there published research behind this?'),
  reuse('Is CognitiveBotics suitable for NGOs, not just private therapy centres?'),
];
