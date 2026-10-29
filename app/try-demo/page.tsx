import type { Metadata } from 'next';
import { TryDemoPage } from '@/components/pages/try-demo/TryDemoPage';

export const metadata: Metadata = {
  title: 'Try demo | CognitiveBotics',
  description:
    'Explore the games in the CognitiveBotics autism app, each built around a developmental goal to help children build essential skills through play.',
};

export default function Page() {
  return <TryDemoPage />;
}
