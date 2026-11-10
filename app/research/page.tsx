import type { Metadata } from 'next';
import { ResearchPage } from '@/components/pages/research/ResearchPage';

export const metadata: Metadata = {
  title: 'Research | CognitiveBotics',
  description: 'Research with India’s clinical and government institutions, including NIEPID and JMIR Neurotechnology, measuring real progress in children using CognitiveBotics.',
  alternates: { canonical: '/research' },
};

export default function Page() {
  return <ResearchPage />;
}
