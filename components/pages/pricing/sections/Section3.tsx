import { FAQ } from '@/components/shared/FAQ';
import { TextReveal } from '@/components/shared/TextReveal';
import { pricingContent as c, pricingFaq } from '../content';

export function Section3() {
  return (
    <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[40px] lg:leading-[48px]">
          {c.faqHeading}
        </TextReveal>
        <FAQ items={pricingFaq} />
      </div>
    </section>
  );
}
