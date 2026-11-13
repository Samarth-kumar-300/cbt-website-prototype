import { useId } from 'react';
import type { Film } from '@/lib/films';
import { FilmPlayer } from './FilmPlayer';
import { Reveal } from './Reveal';
import { TextReveal } from './TextReveal';

const TONES = {
  // The Home testimonial gradient. Merge with TestimonialsSection's copy when that section is replaced.
  gradient: { background: 'linear-gradient(90deg, #f8eaf2 0%, #f4eff6 50%, #eaf5f2 100%)' },
  'flat-aqua': { background: 'var(--color-brand-subtle-bg)' },
  white: { background: '#fff' },
} as const;

export type VideoSectionTone = keyof typeof TONES;

type Props = { heading: string; film: Film; tone?: VideoSectionTone };

/** A heading above one film that plays in place. Content comes in as props, so any page can show any film. */
export function VideoSection({ heading, film, tone = 'gradient' }: Props) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} style={TONES[tone]} className="[overflow-wrap:anywhere]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-14 lg:gap-10 lg:px-24 lg:py-[84px]">
        <TextReveal
          as="h2"
          split="words"
          trigger="scroll"
          id={headingId}
          className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[48px] lg:leading-[58px]"
        >
          {heading}
        </TextReveal>
        <Reveal>
          <FilmPlayer film={film} />
        </Reveal>
      </div>
    </section>
  );
}
