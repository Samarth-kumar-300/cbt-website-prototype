import { Button } from '@/components/shared/Button';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { pricingContent as c } from '../content';

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-[2px] shrink-0 text-brand-teal">
      <path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Section1() {
  return (
    <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
      <RevealStagger className="mx-auto grid max-w-[1248px] grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {c.plans.map((p) => (
          <article
            key={p.id}
            aria-labelledby={`plan-${p.id}`}
            className="flex flex-col rounded-[24px] border-[1.5px] border-brand-teal-100 bg-white p-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] lg:p-8"
          >
            <h2 id={`plan-${p.id}`} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[32px] lg:leading-[40px]">
              {p.name}
            </h2>
            <p className="mt-1 text-[16px] leading-[24px] text-text-secondary lg:text-[18px]">{p.audience}</p>
            <div className="mt-6 flex flex-col gap-1">
              <p className="flex items-baseline gap-1 font-heading text-brand-dark">
                <span className={`font-bold ${p.unit ? 'text-[40px] leading-[48px] lg:text-[48px] lg:leading-[56px]' : 'text-[32px] leading-[40px] lg:text-[40px] lg:leading-[48px]'}`}>
                  {p.price}
                </span>
                {p.unit ? <span className="text-[18px] font-semibold text-content-secondary">{p.unit}</span> : null}
              </p>
              <p className="text-[16px] font-semibold leading-[24px] text-content-brand">{p.note}</p>
              {p.total ? <p className="text-[16px] leading-[24px] text-text-secondary">{p.total}</p> : null}
              {p.taxes ? <p className="text-[14px] leading-[22px] text-content-secondary">{p.taxes}</p> : null}
            </div>
            <hr className="my-6 border-border-subtle" />
            <ul className="flex flex-1 flex-col gap-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href={p.cta.href} size="lg" arrow className="w-full">
                {p.cta.label}
              </Button>
            </div>
          </article>
        ))}
      </RevealStagger>
    </section>
  );
}
