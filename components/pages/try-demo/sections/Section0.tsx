import { QuoteCard } from '@/components/shared/QuoteCard';
import { TestimonialCarousel } from '@/components/shared/TestimonialCarousel';
import { TextReveal } from '@/components/shared/TextReveal';
import type { Plan } from '@/lib/demo-plan';
import { TESTIMONIALS } from '@/lib/testimonials';
import { tryDemoContent as c } from '../content';
import type { PreviewView } from '@/lib/demo-preview';
import { DemoFlow } from '../DemoFlow';
import { DemoPreview } from '../DemoPreview';

// The brand name takes the secondary colour and "in action" always sits together on the second line.
const [titleLead, titleTail] = c.title.split('CognitiveBotics');
// The last three words ("for your demo.") wrap together instead of leaving "demo." alone.
const subtitleWords = c.subtitle.split(' ');
const subtitleHead = subtitleWords.slice(0, -3).join(' ');
const subtitleTail = subtitleWords.slice(-3).join(' ');

// Mobile order: headline, form card, proof. From lg the headline and proof sit in the left column beside the card.
export function Section0({ plan, preview = null }: { plan: Plan | null; preview?: PreviewView | null }) {
  const quotes = TESTIMONIALS.slice(0, 3);
  return (
    <section
      className="px-5 pb-12 pt-[116px] lg:px-[84px] lg:pb-[84px] lg:pt-[142px]"
      style={{ background: 'linear-gradient(100deg, #e7f1ef 0%, #f3eef5 45%, #fbece9 100%)' }}
    >
      <div className="mx-auto grid max-w-[1248px] grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
        <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:row-start-1 lg:gap-4">
          <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[40px] lg:leading-[56px]">
            {titleLead}
            <span className="text-content-brand-secondary">CognitiveBotics</span>{' '}
            <span className="whitespace-nowrap">{titleTail.trim()}</span>
          </TextReveal>
          <p className="text-[16px] leading-[26px] text-text-default lg:text-[20px] lg:leading-[29px]">{subtitleHead} <span className="whitespace-nowrap">{subtitleTail}</span></p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          {preview ? <DemoPreview plan={plan} initial={preview} /> : <DemoFlow plan={plan} />}
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5 lg:row-start-2">
          <TestimonialCarousel slides={quotes.map((q) => <QuoteCard key={q.id} quote={q} clamp />)} />
          <ul aria-label="Credentials" className="flex flex-wrap items-center gap-2 lg:gap-3">
            {c.trust.map((t) => (
              <li key={t.label} className="flex items-center gap-[10px] rounded-full border border-[#e4ded4] bg-white py-[6px] pl-[6px] pr-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: t.bg }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: t.color }}>
                    <path d={t.path} />
                  </svg>
                </span>
                <span className="whitespace-nowrap text-[14px] leading-[21px] text-brand-teal">{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
