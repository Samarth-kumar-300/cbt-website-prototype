import type { Metadata } from 'next';
import { TestimonialsPage } from '@/components/pages/testimonials/TestimonialsPage';

export const metadata: Metadata = {
  title: 'Testimonials | CognitiveBotics',
  description: 'What parents, therapists and schools say about using CognitiveBotics.',
  alternates: { canonical: '/testimonials' },
};

export default function Page() {
  return <TestimonialsPage />;
}
