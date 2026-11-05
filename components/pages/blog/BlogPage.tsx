import { CtaPanel } from '@/components/shared/CtaPanel';
import { TextReveal } from '@/components/shared/TextReveal';
import { BlogIndex } from './BlogIndex';
import { blogContent as c } from './content';
import { POSTS } from './posts';

export function BlogPage() {
  return (
    <>
      <section className="px-5 pb-12 pt-[116px] lg:px-[84px] lg:pb-[84px] lg:pt-[142px]">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10 lg:gap-14">
          <header className="flex flex-col gap-3 border-b border-border-subtle pb-8 lg:flex-row lg:items-end lg:justify-between lg:pb-10">
            <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[40px] font-semibold leading-[48px] text-brand-teal lg:text-[56px] lg:leading-[64px]">
              {c.title}
            </TextReveal>
            <p className="text-[16px] leading-[24px] text-content-secondary lg:pb-2 lg:text-right lg:text-[18px]">{c.subtitle}</p>
          </header>
          <BlogIndex posts={POSTS} />
        </div>
      </section>
      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} />
    </>
  );
}
