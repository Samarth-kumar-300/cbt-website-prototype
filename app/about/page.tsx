import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/about/AboutPage';

export const metadata: Metadata = {
  title: 'About Us | CognitiveBotics | CognitiveBotics',
  description:
    'The story behind CognitiveBotics, our values and the leadership team building AI-powered early intervention for neurodiverse children.',
};

export default function Page() {
  return <AboutPage />;
}
