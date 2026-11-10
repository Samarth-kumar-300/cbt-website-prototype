import type { Metadata } from 'next';
import { BlogPage } from '@/components/pages/blog/BlogPage';

export const metadata: Metadata = {
  title: 'Blog | CognitiveBotics',
  description: 'What’s changing in early intervention, and how centres, schools and parents put it to work.',
  alternates: { canonical: '/blog' },
};

export default function Page() {
  return <BlogPage />;
}
