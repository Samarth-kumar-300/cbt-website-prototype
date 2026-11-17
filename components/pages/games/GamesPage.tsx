import Image from 'next/image';
import { CtaPanel } from '@/components/shared/CtaPanel';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { TextReveal } from '@/components/shared/TextReveal';
import { AudienceCard } from './AudienceCard';
import { GameCard } from './GameCard';
import { GAMES, HERO_BG, gamesContent as c } from './content';

// Line icons for the plan steps, drawn on the same 24px grid as the icons on the other pages.
const STEP_ICONS = {
  assign: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  practise: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m10 8 6 4-6 4V8Z" />
    </>
  ),
  track: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 5-6" />
    </>
  ),
} as const;

export function GamesPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-[116px] lg:pb-[84px] lg:pt-[150px]" style={{ background: HERO_BG }}>
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:px-24">
          <div className="flex w-full max-w-[706px] flex-col items-start gap-[14px] self-start lg:w-auto lg:gap-[26px] lg:self-auto">
            <p className="font-heading text-[14px] font-semibold leading-[18px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px]">{c.eyebrow}</p>
            <h1 className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[58px]">{c.title}</h1>
            <p className="text-[16px] leading-[26px] text-text-default lg:text-[20px] lg:leading-[29px]">{c.subtitle}</p>
          </div>
          <div className="hero-settle hero-delay-2 relative aspect-[7086/7470] w-full max-w-[299px] shrink-0 lg:max-w-[483px]">
            <Image src={c.heroImage.src} alt={c.heroImage.alt} fill sizes="(min-width: 1024px) 483px, 299px" className="object-contain" priority />
          </div>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-8 lg:gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-[28px] font-semibold leading-[36px] text-brand-teal lg:text-[36px] lg:leading-[44px]">{c.gridHeading}</h2>
            <p className="text-[16px] leading-[26px] text-text-default lg:text-[18px]">{c.gridSubtitle}</p>
          </div>
          <RevealStagger className="grid w-full grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {GAMES.map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
          </RevealStagger>
          <p className="text-[14px] leading-[22px] text-content-secondary">{c.permissionNote}</p>
        </div>
      </section>

      <section className="bg-brand-subtle-bg px-5 py-14 lg:px-24 lg:py-[88px]">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-8 lg:gap-10">
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">
            {c.plan.heading}
          </TextReveal>
          <RevealStagger className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
            {c.plan.steps.map((s) => (
              <div key={s.title} className="flex flex-col items-start gap-3 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white p-[18px] shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:p-[26px]">
                <span data-icon className="flex size-11 shrink-0 items-center justify-center rounded-full lg:size-12" style={{ backgroundColor: s.bg }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: s.color }}>
                    {STEP_ICONS[s.icon]}
                  </svg>
                </span>
                <h3 className="font-heading text-[18px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">{s.title}</h3>
                <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">{s.body}</p>
              </div>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section id="find-your-path" className="mx-auto max-w-[1440px] scroll-mt-[120px] px-5 py-14 lg:px-24 lg:pb-[88px] lg:pt-[84px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-5">
          <div className="flex flex-col items-start gap-2 lg:w-[403px] lg:shrink-0 lg:gap-3">
            <p className="font-heading text-[14px] font-bold leading-[normal] text-content-brand-secondary lg:text-[20px] lg:leading-[26px]">{c.audiencesEyebrow}</p>
            <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[20px] font-bold leading-[30px] text-content-brand lg:text-[40px] lg:font-semibold lg:leading-[48px]">
              {c.audiencesHeading}
            </TextReveal>
          </div>
          <RevealStagger className="flex flex-1 flex-col gap-3 lg:gap-4">
            {c.audiences.map((a) => (
              <AudienceCard key={a.href} {...a} />
            ))}
          </RevealStagger>
        </div>
      </section>

      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} wideBody />
    </>
  );
}
