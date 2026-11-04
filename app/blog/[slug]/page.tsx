import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost } from '@/components/pages/blog/content';
import { PostPage } from '@/components/pages/blog/PostPage';
import { POSTS } from '@/components/pages/blog/posts';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | CognitiveBotics`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <PostPage post={post} />;
}
