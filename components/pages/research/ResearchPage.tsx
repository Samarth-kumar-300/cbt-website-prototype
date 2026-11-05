import { CtaPanel } from '@/components/shared/CtaPanel';
import { PageHero } from '@/components/shared/PageHero';
import { researchContent as c } from './content';
import { ResearchGrid } from './ResearchGrid';

export function ResearchPage() {
  return (
    <>
      <PageHero title={c.title} subtitle={c.subtitle} />
      <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
        <div className="mx-auto max-w-[1248px]">
          <ResearchGrid />
        </div>
      </section>
      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} />
    </>
  );
}
