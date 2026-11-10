import { Eyebrow } from '@/components/shared/Eyebrow';
import { SplitHeader } from '@/components/shared/SplitHeader';
import { CaseStudyList } from './CaseStudyList';
import { CASE_STUDIES, caseStudiesContent as c } from './content';

// Case studies only: no research, achievements or closing panel on this page.
export function CaseStudiesPage() {
  return (
    <section className="px-5 pb-16 pt-[116px] lg:px-[84px] lg:pb-[120px] lg:pt-[150px]">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-10 lg:gap-16">
        <div className="flex flex-col gap-3">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <SplitHeader title={c.title} subtitle={c.subtitle} />
        </div>
        <CaseStudyList studies={CASE_STUDIES} />
      </div>
    </section>
  );
}
