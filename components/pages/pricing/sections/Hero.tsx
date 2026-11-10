import Image from 'next/image';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { TextReveal } from '@/components/shared/TextReveal';
import { hero } from '../content';

type Tone = (typeof hero.stats)[number]['tone'] | (typeof hero.credentials)[number]['tone'];

/** Figure or icon colour and its soft disc, one pair per proof, drawn from the colours in the hero illustration. */
const TONES: Record<Tone, { readonly bg: string; readonly fg: string }> = {
  green: { bg: '#e8f6ec', fg: '#15803d' },
  teal: { bg: '#e3f4f4', fg: '#0f7a80' },
  amber: { bg: '#fdf1d3', fg: '#b45309' },
  pink: { bg: '#fde7ee', fg: '#d6336c' },
  blue: { bg: '#e4effd', fg: '#1d5fd6' },
};

function Shield() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Trophy() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

const ICONS = { trophy: Trophy, shield: Shield } as const;

// Phone: copy, picture, then the proof bar. Desktop: copy on the left, picture on the right, and the proof bar runs full width underneath.
// The bar is two groups: the outcome figures lead, the awards and certification sit quietly beside them.
// The bar sits on a white card so it reads against the gradient.
// Widths: xl one row of five, lg and sm two rows (stats, then credentials in three columns), phone two stat columns and the credentials stacked.
export function Hero() {
  return (
    <section
      className="px-5 pb-12 pt-[116px] lg:px-[84px] lg:pb-[72px] lg:pt-[150px]"
      style={{ background: 'linear-gradient(90deg, #eaf5f2 0%, #f4eff6 49.038%, #fcede9 100%)' }}
    >
      <div className="mx-auto grid max-w-[1248px] grid-cols-1 items-center gap-x-12 gap-y-8 text-left lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-y-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,500px)]">
        <div className="flex flex-col items-start gap-4 lg:col-start-1 lg:row-start-1 lg:gap-5">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[40px] lg:leading-[52px] xl:text-[48px] xl:leading-[60px]">
            {hero.titleLead}
            <span className="text-content-brand-secondary">{hero.titleAccent}</span>.
          </TextReveal>
          <p className="max-w-[620px] text-[16px] leading-[26px] text-text-default lg:text-[19px] lg:leading-[30px]">{hero.subtitle}</p>
          <p className="font-heading text-[14px] font-bold leading-[22px] text-content-brand lg:text-[16px]">{hero.partner}</p>
        </div>

        <div className="hero-settle hero-delay-2 relative mx-auto aspect-[3379/2642] w-full max-w-[360px] lg:col-start-2 lg:row-start-1 lg:max-w-none">
          <Image
            src="/images/pricing/hero.webp"
            alt="A therapist, two parents and a child walk a winding path together with the CognitiveBotics mascot"
            fill
            sizes="(min-width: 1280px) 500px, 360px"
            className="object-contain"
            priority
          />
        </div>

        <RevealStagger className="rounded-2xl border border-[#e4ded4] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(16,73,76,0.05),0_12px_28px_-14px_rgba(16,73,76,0.18)] lg:col-span-2 lg:row-start-2 lg:px-8 lg:py-6 xl:flex xl:items-center xl:gap-6">
          <ul data-proof-group="stats" className="grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-3 lg:gap-x-6 xl:grid-cols-2 xl:flex-[2_1_0%] xl:gap-6 xl:[&>li+li]:border-l xl:[&>li+li]:border-[#e4ded4] xl:[&>li+li]:pl-6">
            {hero.stats.map((p) => (
              <li key={p.figure} className="flex flex-col gap-1 text-left">
                <span data-proof-tone className="font-heading text-[24px] font-semibold leading-none" style={{ color: TONES[p.tone].fg }}>
                  {p.figure}
                </span>
                <span className="text-[13px] font-medium leading-[18px] text-brand-dark lg:text-[14px] lg:leading-[20px]">{p.label}</span>
                <span className="text-[12px] leading-[16px] text-text-secondary">{p.source}</span>
              </li>
            ))}
          </ul>

          {/* Phone: stacked, so nothing hides off-screen. Tablet and up: three columns. xl: sits beside the stats on one row. */}
          <ul
            data-proof-group="credentials"
            className="mt-4 grid grid-cols-1 gap-3 border-t border-[#ece6dc] pt-4 sm:grid-cols-3 sm:gap-6 lg:mt-5 lg:pt-5 xl:mt-0 xl:flex-[3_1_0%] xl:border-l xl:border-t-0 xl:border-[#e4ded4] xl:pl-6 xl:pt-0 xl:[&>li+li]:border-l xl:[&>li+li]:border-[#e4ded4] xl:[&>li+li]:pl-6"
          >
            {hero.credentials.map((p) => {
              const Icon = ICONS[p.icon];
              return (
                <li key={p.source} className="grid grid-cols-[18px_1fr] items-start gap-x-2.5 text-left">
                  <span data-proof-tone className="mt-[2px] flex size-[18px] items-center justify-center sm:mt-[3px]" style={{ color: TONES[p.tone].fg }}>
                    <Icon />
                  </span>
                  <span className="block sm:flex sm:flex-col sm:gap-0.5">
                    <strong className="font-heading text-[15px] font-semibold leading-[22px] text-brand-dark sm:text-[17px] sm:leading-[24px]">{p.title}</strong>
                    <span className="text-text-secondary sm:hidden" aria-hidden="true">{' · '}</span>
                    <span className="text-[13px] leading-[18px] text-text-secondary">{p.source}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </RevealStagger>
      </div>
    </section>
  );
}
