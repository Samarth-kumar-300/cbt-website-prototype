import { QuoteCard } from '@/components/shared/QuoteCard';
import { TestimonialCarousel } from '@/components/shared/TestimonialCarousel';
import { TextReveal } from '@/components/shared/TextReveal';
import type { Plan } from '@/lib/demo-plan';
import { TESTIMONIALS } from '@/lib/testimonials';
import { tryDemoContent as c } from '../content';
import { DemoFlow } from '../DemoFlow';

// Mobile order: headline, form card, proof. From lg the headline and proof sit in the left column beside the card.
export function Section0({ plan }: { plan: Plan | null }) {
  const quotes = TESTIMONIALS.slice(0, 3);
  return (
    <section
      className="px-5 pb-12 pt-[116px] lg:px-[84px] lg:pb-[84px] lg:pt-[142px]"
      style={{ background: 'linear-gradient(100deg, #e7f1ef 0%, #f3eef5 45%, #fbece9 100%)' }}
    >
      <div className="mx-auto grid max-w-[1248px] grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
        <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:row-start-1 lg:gap-4">
          <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[40px] lg:leading-[56px]">
            {c.title}
          </TextReveal>
          <p className="text-[16px] leading-[26px] text-text-default lg:text-[20px] lg:leading-[29px]">{c.subtitle}</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <DemoFlow plan={plan} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5 lg:row-start-2">
          <TestimonialCarousel slides={quotes.map((q) => <QuoteCard key={q.id} quote={q} clamp />)} />
          <ul aria-label="Credentials" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-semibold text-content-brand">
            {c.trust.map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
