import type { Metadata } from 'next';
import Link from 'next/link';
import { PostThumbnail } from '@/components/pages/blog/thumbnail/PostThumbnail';
import { THUMBNAILS } from '@/components/pages/blog/thumbnail/thumbnails';

export const metadata: Metadata = { title: 'Thumbnails', robots: { index: false, follow: false } };

/** Every blog thumbnail at 400px wide, for review. tools/render-thumbnails.mjs reads the slugs from the data-slug attributes. */
export default function Page() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: '120px 24px 48px' }}>
      {Object.keys(THUMBNAILS).map((slug) => (
        <Link key={slug} data-slug={slug} href={`/kit/thumbnail/${slug}`} style={{ display: 'block', width: 400, height: 225, overflow: 'hidden', borderRadius: 12 }}>
          <div style={{ width: 1200, height: 675, transform: 'scale(0.33333)', transformOrigin: 'top left' }}>
            <PostThumbnail slug={slug} />
          </div>
        </Link>
      ))}
    </div>
  );
}
