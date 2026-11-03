import { QuoteRow } from '@/components/shared/QuoteRow';
import { TextReveal } from '@/components/shared/TextReveal';
import { TESTIMONIALS } from '@/lib/testimonials';
import { pricingContent as c } from '../content';

export function Section2() {
  return (
    <section className="bg-brand-subtle-bg px-5 py-12 lg:px-[84px] lg:py-[84px]">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-8 lg:gap-10">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[40px] lg:leading-[48px]">
          {c.testimonialsHeading}
        </TextReveal>
        <QuoteRow quotes={TESTIMONIALS.slice(0, 3)} />
      </div>
    </section>
  );
}
