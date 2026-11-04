import { TextReveal } from '@/components/shared/TextReveal';
import { CaseStudyList } from './CaseStudyList';
import { CASE_STUDIES, caseStudiesContent as c } from './content';

// Case studies only: no research, achievements or closing panel on this page.
export function CaseStudiesPage() {
  return (
    <section className="px-5 pb-16 pt-[116px] lg:px-[84px] lg:pb-[120px] lg:pt-[150px]">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-10 lg:gap-16">
        <TextReveal as="h1" split="lines" trigger="load" className="max-w-[760px] font-heading text-[34px] font-semibold leading-[42px] text-brand-dark lg:text-[52px] lg:leading-[60px]">
          {c.title}
        </TextReveal>
        <CaseStudyList studies={CASE_STUDIES} />
      </div>
    </section>
  );
}
