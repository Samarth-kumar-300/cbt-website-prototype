import Image from 'next/image';
import Link from 'next/link';
import { CARD_GRID_SIZES } from '@/components/shared/card-sizes';
import { ReadTime } from '@/components/shared/ReadTime';
import { CARD_STYLES } from './card-styles';
import type { BlogPost } from './posts';

/** The post's cover: its supplied thumbnail when it has one, otherwise a stand-in, a solid toned-down tint of the category colour with the category icon. The caller sets the shape. */
export function PostCover({ post, className = '' }: { post: BlogPost; className?: string }) {
  const s = CARD_STYLES[post.slug];
  // alt is empty because the title is the text under the card, and the image repeats it.
  if (s.cover) return <Image data-cover="image" src={s.cover} alt="" width={7680} height={4320} sizes={CARD_GRID_SIZES} className={`rounded-[12px] object-cover sm:rounded-[16px] ${className}`} />;
  return (
    <div data-cover="placeholder" aria-hidden="true" className={`relative flex items-center justify-center overflow-hidden rounded-[12px] sm:rounded-[16px] ${className}`} style={{ backgroundColor: s.pillBg }}>
      <span className="absolute size-[70%] rounded-full border border-white/70" />
      <span className="absolute size-[110%] rounded-full border border-white/50" />
      <span className="relative flex size-[56px] items-center justify-center rounded-full bg-white shadow-[0px_6px_20px_0px_rgba(15,74,77,0.08)] sm:size-[72px] lg:size-[88px]">
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="size-6 sm:size-[34px]" style={{ color: s.iconFg }}>
          <path d={s.iconPath} />
        </svg>
      </span>
    </div>
  );
}

/** The post's main audience. One neutral style for every tag. */
export function CategoryPill({ post }: { post: BlogPost }) {
  return <span className="inline-block w-fit rounded-full bg-brand-subtle-bg px-[10px] py-[5px] text-[14px] font-medium text-brand-dark">{post.audiences[0]}</span>;
}

/** The tag with the read time beside it. */
export function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <CategoryPill post={post} />
      <ReadTime minutes={post.minutes} />
    </div>
  );
}

// A rectangular cover on top and the text under it, on every screen width.
export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal">
      {/* The placeholder lifts on hover; a supplied thumbnail is a still image and does not move. */}
      <PostCover post={post} className={`aspect-[16/9] w-full${CARD_STYLES[post.slug].cover ? '' : ' transition-transform duration-300 group-hover:-translate-y-1'}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
        <PostMeta post={post} />
        <h3 className="font-heading text-[18px] font-semibold leading-[24px] text-brand-dark group-hover:underline lg:text-[20px] lg:leading-[26px]">{post.title}</h3>
        <p className="line-clamp-3 text-[14px] leading-[22px] text-content-secondary lg:text-[16px] lg:leading-[24px]">{post.excerpt}</p>
      </div>
    </Link>
  );
}
