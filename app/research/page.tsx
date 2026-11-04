import type { Metadata } from 'next';
import { ResearchPage } from '@/components/pages/research/ResearchPage';

export const metadata: Metadata = {
  title: 'Research | CognitiveBotics',
  description: 'Peer-reviewed research, validation studies and a granted patent showing how CognitiveBotics delivers measurable outcomes.',
  alternates: { canonical: '/research' },
};

export default function Page() {
  return <ResearchPage />;
}
