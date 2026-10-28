import type { Metadata } from 'next';
import { TherapyCentresPage } from '@/components/pages/therapy-centres/TherapyCentresPage';

export const metadata: Metadata = {
  title: 'Therapy Centres | CognitiveBotics',
  description:
    'CognitiveBotics helps therapy centres keep intervention connected across therapy, home and school with AI-powered tools and clinically validated outcomes.',
};

export default function Page() {
  return <TherapyCentresPage />;
}
