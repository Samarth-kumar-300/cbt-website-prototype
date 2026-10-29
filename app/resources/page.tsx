import type { Metadata } from 'next';
import { ResourcesPage } from '@/components/pages/resources/ResourcesPage';

export const metadata: Metadata = {
  title: 'Resources | CognitiveBotics | CognitiveBotics',
  description:
    'Resources on autism and early intervention, honest stories and best practices for families and professionals walking the journey together.',
};

export default function Page() {
  return <ResourcesPage />;
}
