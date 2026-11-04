import type { Metadata } from 'next';
import { BlogPage } from '@/components/pages/blog/BlogPage';

export const metadata: Metadata = {
  title: 'Blog | CognitiveBotics',
  description: 'Guides and news on autism and early support, from the CognitiveBotics team.',
  alternates: { canonical: '/blog' },
};

export default function Page() {
  return <BlogPage />;
}
