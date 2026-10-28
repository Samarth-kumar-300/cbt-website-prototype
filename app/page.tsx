import type { Metadata } from 'next';
import { HomePage } from '@/components/pages/home/HomePage';

export const metadata: Metadata = {
  title: 'CognitiveBotics | AI Powered Early Intervention',
  description: 'AI-powered early intervention, built to connect the therapist, family and school around every child.',
};

export default function Page() {
  return <HomePage />;
}
