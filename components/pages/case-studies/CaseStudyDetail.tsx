import Link from 'next/link';
import { CtaPanel } from '@/components/shared/CtaPanel';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { JsonLd } from '@/components/shared/JsonLd';
import { caseStudiesContent as c, caseStudyJsonLd, nextCaseStudy, type CaseStudy } from './content';

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Layout: a Back link in a narrow left rail with the headline beside it; the article sits in the right column below.
export function CaseStudyDetail({ study }: { study: CaseStudy }) {
  const next = nextCaseStudy(study.slug);
  return (
    <>
      <article className="px-5 pb-16 pt-[116px] lg:px-[84px] lg:pb-[100px] lg:pt-[150px]">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10 lg:gap-16">
          <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16">
            <div>
              <Link href="/case-studies" className="inline-flex min-h-[44px] items-center gap-2 text-[16px] font-semibold text-content-brand hover:underline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="rotate-180">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </Link>
            </div>
            <div className="flex flex-col gap-5 lg:gap-6">
              <div className="flex flex-col gap-1">
                <Eyebrow>{study.group}</Eyebrow>
                <p className="text-[14px] font-semibold text-content-secondary">
                  {study.location} · {study.users}
                </p>
              </div>
              <h1 className="font-heading text-[34px] font-semibold leading-[42px] text-brand-dark lg:text-[56px] lg:leading-[66px]">{study.headline}</h1>
            </div>
          </header>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16">
            <div className="flex max-w-[760px] flex-col gap-8 lg:col-start-2 lg:gap-10">
              <p className="text-[18px] leading-[29px] text-text-default lg:text-[20px] lg:leading-[32px]">{study.summary}</p>
              <ul className="grid divide-y divide-border-subtle border-y border-border-subtle sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {study.metrics.map((m) => (
                  <li key={m.label} className="flex flex-col gap-1 py-5 sm:px-6 sm:first:pl-0">
                    <span className="font-heading text-[34px] font-bold leading-[42px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{m.value}</span>
                    <span className="text-[14px] leading-[22px] text-content-secondary lg:text-[16px]">{m.label}</span>
                  </li>
                ))}
              </ul>
              <section className="flex flex-col gap-3">
                <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-dark lg:text-[28px] lg:leading-[36px]">Challenge</h2>
                <p className="text-[16px] leading-[27px] text-text-default lg:text-[18px] lg:leading-[30px]">{study.challenge}</p>
              </section>
              <section className="flex flex-col gap-3">
                <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-dark lg:text-[28px] lg:leading-[36px]">Solution</h2>
                <p className="text-[16px] leading-[27px] text-text-default lg:text-[18px] lg:leading-[30px]">{study.solution}</p>
              </section>
              <section className="flex flex-col gap-4">
                <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-dark lg:text-[28px] lg:leading-[36px]">Features used</h2>
                <ul className="flex flex-wrap gap-2 lg:gap-3">
                  {study.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 rounded-full border border-[#e4ded4] bg-white px-4 py-2 text-[14px] text-brand-teal">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
              <figure className="m-0 flex flex-col gap-4 border-l-2 border-brand-teal pl-6 lg:pl-8">
                <blockquote className="m-0 font-heading text-[22px] font-medium leading-[32px] text-brand-dark lg:text-[28px] lg:leading-[40px]">“{study.quote.text}”</blockquote>
                <figcaption className="text-[16px] text-content-secondary">
                  <span className="font-semibold text-content-brand">{study.quote.name}</span>, {study.quote.role}
                </figcaption>
              </figure>
              {next ? (
                <Link href={`/case-studies/${next.slug}`} className="inline-flex min-h-[44px] w-fit items-center gap-2 text-[16px] font-semibold text-content-brand hover:underline lg:text-[18px]">
                  Next case study: {next.org}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </article>
      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} />
      <JsonLd data={caseStudyJsonLd(study)} />
    </>
  );
}
