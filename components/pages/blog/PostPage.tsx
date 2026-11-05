import Link from 'next/link';
import { CtaPanel } from '@/components/shared/CtaPanel';
import { JsonLd } from '@/components/shared/JsonLd';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { AUDIENCE_TAG, blogContent as c, postJsonLd, relatedPosts } from './content';
import { PostCard } from './PostCard';
import type { BlogPost } from './posts';

export function PostPage({ post }: { post: BlogPost }) {
  const related = relatedPosts(post.slug);
  return (
    <>
      <section
        className="px-5 pb-9 pt-[116px] lg:px-24 lg:pb-16 lg:pt-[150px]"
        style={{ background: 'linear-gradient(90deg, #e4f2ef 0%, #f1f7f4 60%, #faf6f0 100%)' }}
      >
        <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-[14px] lg:gap-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-brand-teal">
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-content-secondary">{post.audiences[0]}</li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-[10px]">
            {post.audiences.map((a) => (
              <span key={a} className="rounded-full border-[1.5px] bg-white px-4 py-[7px] text-[14px] font-semibold" style={AUDIENCE_TAG[a]}>
                {a}
              </span>
            ))}
          </div>
          <h1 className="max-w-[931px] font-heading text-[28px] font-semibold leading-[38px] text-brand-dark lg:text-[44px] lg:leading-[58px]">{post.title}</h1>
          <p className="text-[14px] text-content-secondary">{post.minutes} min read</p>
        </div>
      </section>
      <article className="bg-white px-5 pb-8 pt-10 lg:px-24 lg:py-[80px]">
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-start gap-5 lg:gap-6">
          {post.body.map((b, i) =>
            b.type === 'h' ? (
              <h2 key={i} className="mt-2 font-heading text-[20px] font-bold leading-[28px] text-brand-dark lg:mt-4 lg:text-[26px] lg:leading-[34px]">
                {b.text}
              </h2>
            ) : (
              <p
                key={i}
                className={
                  b.type === 'lead'
                    ? 'text-[17px] leading-[27px] text-text-default lg:text-[22px] lg:leading-[33px]'
                    : 'text-[16px] leading-[26px] text-text-default lg:text-[18px] lg:leading-[29px]'
                }
              >
                {b.text}
              </p>
            ),
          )}
        </div>
      </article>
      {related.length > 0 ? (
        <section className="px-5 pb-12 pt-4 lg:px-[84px] lg:pb-[72px]">
          <div className="mx-auto flex max-w-[1248px] flex-col gap-6 lg:gap-8">
            <h2 className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[32px] lg:leading-[40px]">Keep reading</h2>
            <RevealStagger className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </RevealStagger>
          </div>
        </section>
      ) : null}
      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} />
      <JsonLd data={postJsonLd(post)} />
    </>
  );
}
