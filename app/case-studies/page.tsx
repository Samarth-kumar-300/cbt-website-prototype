import type { Metadata } from 'next';
import { CaseStudiesPage } from '@/components/pages/case-studies/CaseStudiesPage';
import { CASE_STUDIES, hasPlaceholders } from '@/components/pages/case-studies/content';

export const metadata: Metadata = {
  title: 'Case studies | CognitiveBotics',
  description: 'Results from real therapy centres and schools using CognitiveBotics.',
  alternates: { canonical: '/case-studies' },
  // Placeholder entries must not be indexed.
  ...(hasPlaceholders(CASE_STUDIES) ? { robots: { index: false } } : {}),
};

export default function Page() {
  return <CaseStudiesPage />;
}
