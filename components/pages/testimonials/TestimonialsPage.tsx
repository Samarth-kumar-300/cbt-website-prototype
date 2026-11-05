import { CtaPanel } from '@/components/shared/CtaPanel';
import { TextReveal } from '@/components/shared/TextReveal';
import { TESTIMONIALS, VIDEO_TESTIMONIAL } from '@/lib/testimonials';
import { testimonialsContent as c } from './content';
import { TestimonialsGrid } from './TestimonialsGrid';

// No review structured data on purpose: Google ignores reviews a company publishes about itself.
export function TestimonialsPage() {
  return (
    <>
      <section
        className="px-5 pb-9 pt-[116px] lg:px-[84px] lg:pb-[72px] lg:pt-[142px]"
        style={{ background: 'linear-gradient(100deg, #e7f1ef 0%, #f3eef5 45%, #fbece9 100%)' }}
      >
        <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-3 lg:gap-4">
          <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[40px] lg:leading-[56px]">
            {c.title}
          </TextReveal>
          <p className="text-[16px] leading-[26px] text-text-default lg:text-[20px] lg:leading-[29px]">{c.subtitle}</p>
        </div>
      </section>
      <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
        <TestimonialsGrid quotes={TESTIMONIALS} video={VIDEO_TESTIMONIAL} />
      </section>
      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} />
    </>
  );
}
