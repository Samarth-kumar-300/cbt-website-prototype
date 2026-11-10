import { Button } from './Button';
import { TextReveal } from './TextReveal';

// The closing gradient panel used at the bottom of a page.
// `wideBody` lets a long supporting line run to two lines on desktop instead of wrapping into a narrow column.
export function CtaPanel({ heading, body, label, href, wideBody = false }: { heading: string; body?: string; label: string; href: string; wideBody?: boolean }) {
  return (
    <section className="px-5 pb-14 pt-8 lg:px-[84px] lg:pb-[76px] lg:pt-0">
      <div className="mx-auto max-w-[1248px]">
        <div
          className="flex flex-col items-center gap-5 rounded-[24px] px-[22px] py-9 text-center lg:rounded-[32px] lg:py-[52px]"
          style={{ background: 'linear-gradient(90deg, #f6e8f7 0%, #ead3ee 55%, #ddecea 100%)' }}
        >
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[28px] font-semibold leading-[40px] text-brand-teal lg:text-[40px] lg:leading-[48px]">
            {heading}
          </TextReveal>
          {body && <p className={`text-[16px] leading-[24px] text-brand-dark lg:text-[18px] lg:leading-[27px] ${wideBody ? 'max-w-[560px] lg:max-w-[1000px] lg:text-balance' : 'max-w-[560px]'}`}>{body}</p>}
          <Button href={href} arrow>
            {label}
          </Button>
        </div>
      </div>
    </section>
  );
}
