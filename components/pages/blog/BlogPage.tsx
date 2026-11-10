import { CtaPanel } from '@/components/shared/CtaPanel';
import { SplitHeader } from '@/components/shared/SplitHeader';
import { BlogIndex } from './BlogIndex';
import { blogContent as c } from './content';
import { POSTS } from './posts';

export function BlogPage() {
  return (
    <>
      <section className="px-5 pb-12 pt-[116px] lg:px-[84px] lg:pb-[84px] lg:pt-[142px]">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10 lg:gap-14">
          <SplitHeader title={c.title} subtitle={c.subtitle} />
          <BlogIndex posts={POSTS} />
        </div>
      </section>
      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} />
    </>
  );
}
