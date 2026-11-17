import Link from 'next/link';
import { CtaPanel } from '@/components/shared/CtaPanel';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { JsonLd } from '@/components/shared/JsonLd';
import { CaseStudyTabs } from './CaseStudyTabs';
import { caseStudiesContent as c, caseStudyJsonLd, caseStudySections, nextCaseStudy, type CaseStudy } from './content';

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
  const sections = caseStudySections(study);
  return (
    <>
      <article className="px-5 pb-16 pt-[116px] lg:px-[84px] lg:pb-[100px] lg:pt-[150px]">
        <div className="mx-auto grid max-w-[1248px] grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-x-16">
          {/* Left rail: Back with the section tabs right under it. The whole rail sticks, so Back stays in reach. */}
          <aside className="lg:col-start-1 lg:row-start-1">
            <div className="lg:sticky lg:top-[120px]">
              <Link href="/case-studies" className="inline-flex min-h-[44px] items-center gap-2 text-[16px] font-semibold text-content-brand hover:underline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="rotate-180">
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </Link>
              <div className="mt-2 hidden lg:block">
                <CaseStudyTabs sections={sections} layout="vertical" />
              </div>
            </div>
          </aside>
          <div className="flex flex-col gap-10 lg:col-start-2 lg:row-start-1 lg:gap-16">
            <header className="flex flex-col gap-5 lg:gap-6">
              <div className="flex flex-col gap-1">
                <Eyebrow>{study.group}</Eyebrow>
                <p className="text-[14px] font-semibold text-content-secondary">
                  {study.users ? `${study.location} · ${study.users}` : study.location}
                </p>
              </div>
              <h1 className="font-heading text-[32px] font-semibold leading-[42px] text-brand-dark lg:text-[40px] lg:leading-[52px] xl:text-[48px] xl:leading-[60px]">{study.headline}</h1>
            </header>
            {/* Phone and tablet: the same section tabs as a dropdown, under the headline. */}
            <div className="-mt-4 lg:hidden">
              <CaseStudyTabs sections={sections} layout="dropdown" />
            </div>
            <div className="flex max-w-[760px] flex-col gap-8 lg:gap-10">
              <p className="text-[18px] leading-[29px] text-text-default lg:text-[20px] lg:leading-[32px]">{study.summary}</p>
              <ul className="grid divide-y divide-border-subtle overflow-hidden rounded-[16px] bg-brand-subtle-bg sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {study.metrics.map((m) => (
                  <li key={m.label} className="flex flex-col gap-2 px-6 py-6 lg:py-8">
                    <span className="whitespace-nowrap font-heading text-[40px] font-bold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[56px]">{m.value}</span>
                    <span className="text-[16px] leading-[24px] text-content-secondary">{m.label}</span>
                  </li>
                ))}
              </ul>
              <section id="challenge" className="scroll-mt-28 flex flex-col gap-3">
                <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-dark lg:text-[28px] lg:leading-[36px]">Challenge</h2>
                <p className="text-[16px] leading-[27px] text-text-default lg:text-[18px] lg:leading-[30px]">{study.challenge}</p>
                {study.challengeMore?.map((t) => (
                  <p key={t} className="text-[16px] leading-[27px] text-text-default lg:text-[18px] lg:leading-[30px]">{t}</p>
                ))}
                {study.coreNeed ? (
                  <p className="text-[16px] leading-[27px] text-text-default lg:text-[18px] lg:leading-[30px]">
                    <strong className="font-semibold text-brand-dark">Core need:</strong> {study.coreNeed}
                  </p>
                ) : null}
              </section>
              {study.solution || study.steps?.length ? (
                <section id="solution" className="scroll-mt-28 flex flex-col gap-3">
                  <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-dark lg:text-[28px] lg:leading-[36px]">Solution</h2>
                  {study.solution ? <p className="text-[16px] leading-[27px] text-text-default lg:text-[18px] lg:leading-[30px]">{study.solution}</p> : null}
                  {study.steps?.length ? (
                    <ol className="m-0 flex list-decimal flex-col gap-3 pl-6 text-[16px] leading-[27px] text-text-default marker:font-semibold marker:text-brand-teal lg:text-[18px] lg:leading-[30px]">
                      {study.steps.map((t) => (
                        <li key={t} className="pl-1">{t}</li>
                      ))}
                    </ol>
                  ) : null}
                </section>
              ) : null}
              {study.adoption ? (
                <section id="adoption" className="scroll-mt-28 flex min-w-0 flex-col gap-3">
                  <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-dark lg:text-[28px] lg:leading-[36px]">{study.adoption.caption}</h2>
                  {/* Scrolls inside its own box on narrow screens so the page never scrolls sideways. */}
                  <div role="region" aria-label={`${study.adoption.caption} table`} tabIndex={0} className="max-w-full overflow-x-auto rounded-[12px] border border-border-subtle">
                    <table className="w-full min-w-[560px] border-collapse text-left text-[14px] leading-[22px] text-text-default lg:text-[16px]">
                      <thead className="bg-[#f6f3ed] text-brand-dark">
                        <tr>
                          {study.adoption.columns.map((col) => (
                            <th key={col} scope="col" className="px-4 py-3 font-semibold">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {study.adoption.rows.map((row) => (
                          <tr key={row[0]}>
                            <th scope="row" className="px-4 py-3 font-semibold text-brand-dark">{row[0]}</th>
                            {row.slice(1).map((cell) => (
                              <td key={cell} className="px-4 py-3">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}
              {study.outcomes ? (
                <section id="outcomes" className="scroll-mt-28 flex flex-col gap-3">
                  <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-dark lg:text-[28px] lg:leading-[36px]">{study.outcomes.heading}</h2>
                  <p className="text-[16px] leading-[27px] text-text-default lg:text-[18px] lg:leading-[30px]">{study.outcomes.text}</p>
                </section>
              ) : null}
              {study.features.length ? (
              <section id="features" className="scroll-mt-28 flex flex-col gap-4">
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
              ) : null}
              {study.quote ? (
              <figure className="m-0 flex flex-col gap-4 border-l-2 border-brand-teal pl-6 lg:pl-8">
                <blockquote className="m-0 font-heading text-[22px] font-medium leading-[32px] text-brand-dark lg:text-[28px] lg:leading-[40px]">“{study.quote.text}”</blockquote>
                <figcaption className="text-[16px] text-content-secondary">
                  <span className="font-semibold text-content-brand">{study.quote.name}</span>, {study.quote.role}
                </figcaption>
              </figure>
              ) : null}
              {study.about ? (
                <section id="about" className="scroll-mt-28 flex flex-col gap-3 border-t border-border-subtle pt-8">
                  <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-dark lg:text-[28px] lg:leading-[36px]">{study.about.heading}</h2>
                  <p className="text-[16px] leading-[27px] text-text-default lg:text-[18px] lg:leading-[30px]">{study.about.text}</p>
                </section>
              ) : null}
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
