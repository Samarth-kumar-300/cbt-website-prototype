import { RevealStagger } from '@/components/shared/RevealStagger';
import { TextReveal } from '@/components/shared/TextReveal';
import type { Audience } from '../content';
import { PRICING_ICONS } from '../icons';

function Lede({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <strong className="font-bold text-content-brand-secondary">{highlight}</strong>
      {after}
    </>
  );
}

export function Intro({ a }: { a: Audience }) {
  return (
    <section className="px-5 pb-6 pt-10 lg:px-24 lg:pb-8 lg:pt-14">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-8 lg:gap-10">
        <div className="flex max-w-[900px] flex-col gap-3 lg:gap-4">
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">
            {a.intro.heading}
          </TextReveal>
          <p className="text-[16px] leading-[26px] text-text-default lg:text-[18px] lg:leading-[27px]">
            <Lede text={a.intro.lede} highlight={a.intro.highlight} />
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-[24px] bg-brand-subtle-bg p-3 lg:gap-6 lg:p-8">
          <h3 className="px-2 font-heading text-[18px] font-bold leading-[26px] text-brand-dark lg:px-0 lg:text-[22px] lg:leading-[30px]">What’s in the platform</h3>
          <RevealStagger className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {a.features.map((f) => {
              const icon = PRICING_ICONS[f.icon];
              return (
                <div key={f.title} data-feature-card="" className="flex flex-col items-start gap-3 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white p-[18px] shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:p-[26px]">
                  <span data-icon="" className="flex size-11 shrink-0 items-center justify-center rounded-full lg:size-12" style={{ backgroundColor: icon.bg }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: icon.fg }}>
                      {icon.paths.map((d) => (
                        <path key={d} d={d} />
                      ))}
                    </svg>
                  </span>
                  <h4 className="font-heading text-[18px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
                    {f.lead ? <span className="text-content-brand-secondary">{f.lead} </span> : null}
                    {f.title}
                  </h4>
                  <p className="text-[14px] leading-[22px] text-text-default lg:text-[17px] lg:leading-[26px]">{f.body}</p>
                </div>
              );
            })}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
