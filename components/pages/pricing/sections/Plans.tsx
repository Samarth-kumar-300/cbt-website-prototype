import { Button } from '@/components/shared/Button';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { TextReveal } from '@/components/shared/TextReveal';
import type { Audience, PlanCard } from '../content';
import { Check } from './Check';

const TONE: Record<PlanCard['tone'], string> = {
  plain: 'border-brand-teal-100 bg-white',
  bloom: 'border-[#f0dca0] bg-[#FEF0C7]',
};

export function PlanGrid({ plans, prefix = 'therapy-centres' }: { plans: readonly PlanCard[]; prefix?: string }) {
  return (
    <RevealStagger className={`grid grid-cols-1 gap-6 lg:gap-8 ${plans.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
      {plans.map((p) => {
        const id = `plan-${prefix}-${p.id}`;
        return (
          <article key={p.id} aria-labelledby={id} className={`flex flex-col rounded-[24px] border-[1.5px] p-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] lg:p-8 ${TONE[p.tone]}`}>
            {p.eyebrow ? <p className="mb-2 font-heading text-[12px] font-bold leading-[18px] tracking-[1.2px] text-content-brand-secondary lg:text-[13px]">{p.eyebrow}</p> : null}
            <h3 id={id} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[28px] lg:leading-[36px]">
              {p.name}
            </h3>
            <p className="mt-1 text-[15px] leading-[23px] text-text-secondary lg:text-[16px] lg:leading-[24px]">{p.audience}</p>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-1 font-heading">
              {p.unit ? (
                <>
                  <span className="text-[40px] font-bold leading-[48px] text-content-brand-secondary lg:text-[48px] lg:leading-[56px]">{p.price}</span>
                  <span className="text-[16px] font-semibold text-text-secondary lg:text-[18px]">{p.unit}</span>
                </>
              ) : (
                <span className="text-[32px] font-bold leading-[40px] text-brand-teal lg:text-[40px] lg:leading-[56px]">{p.price}</span>
              )}
            </p>
            <div className="mt-3 flex flex-col gap-[2px]">
              <p className="text-[16px] font-semibold leading-[24px] text-content-brand">{p.meta}</p>
              <p className="text-[15px] leading-[23px] text-text-secondary lg:text-[16px]">{p.metaNote}</p>
            </div>
            <hr className={`my-6 ${p.tone === 'bloom' ? 'border-[#f0dca0]' : 'border-border-subtle'}`} />
            <ul className="flex flex-1 flex-col gap-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-[16px] leading-[24px] text-text-default lg:text-[17px] lg:leading-[26px]">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href={p.cta.href} size="lg" variant={p.cta.variant} className="w-full">
                {p.cta.label}
              </Button>
            </div>
          </article>
        );
      })}
    </RevealStagger>
  );
}

export function Plans({ a }: { a: Audience }) {
  return (
    <section className="px-5 py-12 lg:px-24 lg:py-[84px]">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-8 lg:gap-10">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">
          {a.plansHeading}
        </TextReveal>
        <PlanGrid plans={a.plans} prefix={a.id} />
      </div>
    </section>
  );
}
