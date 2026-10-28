import type { Metadata } from 'next';
import { ResourcesPage } from '@/components/pages/resources/ResourcesPage';

export const metadata: Metadata = {
  title: 'Resources | CognitiveBotics | CognitiveBotics',
  description:
    'Step-by-step help, honest stories and best practices - for families and professionals walking the journey together.',
};

export default function Page() {
  return <ResourcesPage />;
}
