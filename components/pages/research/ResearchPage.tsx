import { CtaPanel } from '@/components/shared/CtaPanel';
import { PageHero } from '@/components/shared/PageHero';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { researchCards, researchContent as c } from './content';
import { ResearchCard } from './ResearchCard';

export function ResearchPage() {
  return (
    <>
      <PageHero title={c.title} subtitle={c.subtitle} />
      <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
        <div className="mx-auto max-w-[1248px]">
          <RevealStagger className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {researchCards.map((card) => (
              <ResearchCard key={card.href} card={card} />
            ))}
          </RevealStagger>
        </div>
      </section>
      <CtaPanel heading={c.cta.heading} label={c.cta.label} href={c.cta.href} />
    </>
  );
}
