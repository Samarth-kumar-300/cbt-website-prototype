import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { CtaPanel } from '@/components/shared/CtaPanel';
import { Reveal } from '@/components/shared/Reveal';
import { TextReveal } from '@/components/shared/TextReveal';
import { researchContent } from './content';
import { ShareLinks } from './ShareLinks';
import type { Study } from './studies';

function ArrowUpRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 18 18 6m0 0h-8m8 0v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Layout and class strings follow the live detail pages. Body headings are h2 (the live pages use h3 under the h1),
// so the outline has no skipped level; they are styled the same.
export function ResearchDetailPage({ study }: { study: Study }) {
  return (
    <>
      <section
        className="px-5 pb-9 pt-[116px] lg:px-[84px] lg:pb-14 lg:pt-[150px]"
        style={{ background: 'linear-gradient(90deg, #e4f2ef 0%, #f1f7f4 60%, #faf6f0 100%)' }}
      >
        <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-[14px] lg:gap-9">
          <Link href="/research" className="flex items-center gap-[6px] text-[14px] font-semibold leading-[20px] text-brand-teal lg:gap-3 lg:font-heading lg:text-[20px] lg:font-bold">
            ← Back to research
          </Link>
          <div className="flex flex-col items-start gap-[14px] lg:gap-5">
            <span className="inline-block rounded-full px-[14px] py-[7px] text-[14px] font-semibold" style={{ backgroundColor: study.pillBg, color: study.pillColor }}>
              {study.pill}
            </span>
            <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[44px] lg:leading-[58px]">
              {study.title}
            </TextReveal>
          </div>
          <Button href={study.button.href} external className="w-full lg:w-auto">
            {study.button.label}
            <ArrowUpRight />
          </Button>
        </div>
      </section>
      <section className="bg-white px-5 py-10 lg:px-[84px] lg:py-[72px]">
        <Reveal className="mx-auto flex w-full max-w-[1248px] flex-col items-start gap-8">
          <div className="w-full text-[15px] leading-[23px] text-text-default lg:text-[18px] lg:leading-[27px] [&_h2]:mb-2 [&_h2]:mt-2 [&_h2]:font-heading [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:leading-[30px] [&_h2]:text-brand-dark lg:[&_h2]:text-[32px] lg:[&_h2]:leading-[40px] [&_li]:mb-2 [&_li]:pl-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:marker:text-brand-teal">
            {study.blocks.map((block, i) => {
              if (block.type === 'heading') return <h2 key={i}>{block.text}</h2>;
              if (block.type === 'paragraph') return <p key={i}>{block.text}</p>;
              return (
                <ul key={i}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            })}
          </div>
          <div className="w-full rounded-[14px] bg-[#f1f8f8] px-4 py-4 lg:border-[1.5px] lg:border-[#d5e8e5] lg:bg-brand-subtle-bg lg:px-5 lg:py-[18px]">
            <p className="text-[14px] font-semibold leading-[21px] text-brand-teal lg:text-[16px] lg:leading-[24px]">{study.status}</p>
          </div>
          <ShareLinks title={study.title} />
        </Reveal>
      </section>
      <CtaPanel heading={researchContent.cta.heading} body={researchContent.cta.body} label={researchContent.cta.label} href={researchContent.cta.href} />
    </>
  );
}
