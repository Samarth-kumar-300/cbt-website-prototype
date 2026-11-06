import { Eyebrow } from '@/components/shared/Eyebrow';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { TextReveal } from '@/components/shared/TextReveal';
import { hero } from '../content';

function Shield() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function Hero() {
  return (
    <section
      className="px-5 pb-12 pt-[116px] lg:px-[84px] lg:pb-[72px] lg:pt-[150px]"
      style={{ background: 'linear-gradient(100deg, #e7f1ef 0%, #f3eef5 45%, #fbece9 100%)' }}
    >
      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-4 text-center lg:gap-5">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[52px] lg:leading-[64px]">
          {hero.titleLead}
          <span className="text-content-brand-secondary">{hero.titleAccent}</span>.
        </TextReveal>
        <p className="max-w-[760px] text-[16px] leading-[26px] text-text-default lg:text-[20px] lg:leading-[30px]">{hero.subtitle}</p>
        <p className="font-heading text-[14px] font-bold leading-[22px] text-content-brand lg:text-[16px]">{hero.partner}</p>
        <RevealStagger className="mt-2 flex max-w-[920px] justify-center">
          <ul className="flex flex-wrap justify-center gap-2 lg:gap-3">
            {hero.proofs.map((p) => (
              <li key={p.source} className="flex items-center gap-2 rounded-full border border-[#e4ded4] bg-white px-4 py-2 text-left text-[13px] leading-[19px] lg:px-[18px] lg:py-[10px] lg:text-[14px] lg:leading-[21px]">
                <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#f8f2f9] text-content-brand-secondary">
                  <Shield />
                </span>
                <span>
                  <strong className="font-semibold text-brand-dark">{p.claim}</strong>
                  <span className="text-text-secondary"> · {p.source}</span>
                </span>
              </li>
            ))}
          </ul>
        </RevealStagger>
      </div>
    </section>
  );
}
