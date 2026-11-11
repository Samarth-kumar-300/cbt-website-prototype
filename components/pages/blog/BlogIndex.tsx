'use client';

import { useState } from 'react';
import { SECONDARY_HOVER } from '@/components/shared/Button';
import { Chips } from '@/components/shared/Chips';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { blogAudiences, blogContent as c } from './content';
import { PostCard } from './PostCard';
import type { BlogPost } from './posts';

const ALL = 'all';
/** "Show more" appears only when a view has more posts than this. */
const PAGE = 9;

export function BlogIndex({ posts }: { posts: readonly BlogPost[] }) {
  const [active, setActive] = useState(ALL);
  const [more, setMore] = useState(false);
  const chips = [{ id: ALL, label: 'All' }, ...blogAudiences(posts).map((a) => ({ id: a, label: a }))];
  const list = active === ALL ? posts : posts.filter((p) => (p.audiences as readonly string[]).includes(active));
  const shown = more ? list : list.slice(0, PAGE);

  return (
    <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10 lg:gap-14">
      <Chips
        items={chips}
        value={active}
        onChange={(id) => {
          setActive(id);
          setMore(false);
        }}
        label={c.chipsLabel}
        idPrefix="blog"
        className="max-sm:-mx-5 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-5 max-sm:pb-1 max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden"
      />
      {/* The server renders the All view, so crawlers see every post. */}
      <div role="tabpanel" id={`blog-panel-${active}`} aria-labelledby={`blog-tab-${active}`} className="flex flex-col gap-12">
        <RevealStagger key={active} className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
          {shown.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </RevealStagger>
        {list.length > PAGE && !more ? (
          <button
            type="button"
            onClick={() => setMore(true)}
            className={`btn mx-auto inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full border-[1.5px] border-brand-teal bg-transparent px-6 py-[14px] text-[16px] font-semibold text-content-brand transition-colors ${SECONDARY_HOVER}`}
          >
            Show more
          </button>
        ) : null}
      </div>
    </div>
  );
}
