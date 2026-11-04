import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostThumbnail } from '@/components/pages/blog/thumbnail/PostThumbnail';
import { THUMBNAILS, hasThumbnail } from '@/components/pages/blog/thumbnail/thumbnails';

export const metadata: Metadata = { title: 'Thumbnail', robots: { index: false, follow: false } };

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(THUMBNAILS).map((slug) => ({ slug }));
}

/**
 * One blog thumbnail at exact pixel size, for tools/render-thumbnails.mjs to screenshot.
 * Pinned over the header, footer and cookie banner so none of them can appear in the image.
 */
export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!hasThumbnail(slug)) notFound();
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 2147483647 }}>
      <PostThumbnail slug={slug} />
    </div>
  );
}
