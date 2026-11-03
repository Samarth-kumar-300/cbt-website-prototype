import type { Metadata } from 'next';
import { FaqsPage } from '@/components/pages/faqs/FaqsPage';

export const metadata: Metadata = {
  title: 'FAQs | CognitiveBotics',
  description: 'Answers for parents, therapy centres and schools about CognitiveBotics, pricing and getting started.',
};

export default function Page() {
  return <FaqsPage />;
}
