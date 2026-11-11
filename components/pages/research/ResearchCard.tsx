import Image from 'next/image';
import { Button } from '@/components/shared/Button';
import type { ResearchCardData } from './content';
import { PartnerLogo } from './PartnerLogo';

// Soft top band per entity: a neutral grey and a light tint of the brand purple.
const BAND = {
  teal: 'bg-[#f5f6f8]',
  purple: 'bg-[#f4e9f5]',
} as const;

// "+56.8% social age" splits into a figure and its label so the number can lead. A part with no leading figure is all label.
const FIGURE = /^([+-]?\d[\d.,]*%)\s+(.+)$/;

// The middot between the stats stays in the text for screen readers and tests; sighted readers see two tinted tiles instead.
// Two equal columns, so a long label wraps inside its box and both cards put the second box in the same place.
function OutputLine({ text }: { text: string }) {
  const parts = text.split(' · ');
  return (
    <p className="grid grid-cols-2 gap-[var(--rc-stat-gap)]">
      {parts.map((part, i) => {
        const m = FIGURE.exec(part);
        return (
          <span
            key={part}
            className={`flex flex-col gap-1.5 rounded-[var(--rc-box-radius)] border border-brand-teal/10 bg-background-brand-subtle px-[var(--rc-box-px)] py-[var(--rc-box-py)]`}
          >
            {i > 0 ? <span className="sr-only" aria-hidden="true"> · </span> : null}
            {m ? (
              <>
                <span className={`font-heading text-[length:var(--rc-stat-size)] font-bold leading-none ${i === 0 ? 'text-brand-teal' : 'text-content-brand-secondary'}`}>{m[1]}</span>{' '}
                <span className="text-[length:var(--rc-stat-label)] leading-[1.35] text-content-secondary">{m[2]}</span>
              </>
            ) : (
              <span className="text-[length:var(--rc-stat-label)] font-semibold leading-[1.35] text-content-secondary">{part}</span>
            )}
          </span>
        );
      })}
    </p>
  );
}

// Every spacing and size on the card, in one place. Edit a number here. Phone value first, then the
// desktop (1024px and up) value. They are Tailwind classes, so keep each one written out in full.
const KNOBS = [
  // Shape
  '[--rc-radius:24px]     lg:[--rc-radius:28px]',
  // Header band: padding, gap between the logos, minimum height (desktop only, so both headlines line up), logo and partner sizes
  '[--rc-band-py:16px]    lg:[--rc-band-py:22px]',
  '[--rc-band-px:20px]    lg:[--rc-band-px:32px]',
  '[--rc-band-gap:12px]   lg:[--rc-band-gap:20px]',
  '[--rc-band-h:0px]      lg:[--rc-band-h:90px]',
  '[--rc-logo-h:22px]     lg:[--rc-logo-h:26px]',
  '[--rc-partner-size:15px] lg:[--rc-partner-size:18px]',
  '[--rc-partner-logo-h:30px] lg:[--rc-partner-logo-h:36px]',
  // Body: padding, headline size and line-height, gap from headline to stats
  '[--rc-body-px:20px]    lg:[--rc-body-px:32px]',
  '[--rc-body-py:22px]    lg:[--rc-body-py:28px]',
  '[--rc-head-size:22px]  lg:[--rc-head-size:26px]',
  '[--rc-head-lh:1.25]',
  '[--rc-head-gap:24px]   lg:[--rc-head-gap:28px]',
  // Read-time pill under the headline: gap above it
  '[--rc-pill-gap:12px]',
  // Stats: each metric (figure and label) sits in a tinted tile. Figure size, label size, box padding and corner radius,
  // gap between the two boxes, gap above the button
  '[--rc-stat-size:22px]  lg:[--rc-stat-size:24px]',
  '[--rc-stat-label:14px]',
  '[--rc-box-px:12px]     lg:[--rc-box-px:16px]',
  '[--rc-box-py:12px]     lg:[--rc-box-py:14px]',
  '[--rc-box-radius:14px]',
  '[--rc-stat-gap:12px]   lg:[--rc-stat-gap:16px]',
  '[--rc-btn-gap:24px]    lg:[--rc-btn-gap:28px]',
].join(' ');

// The button is the only link; its ::after stretches over the card so the whole card is clickable.
export function ResearchCard({ card }: { card: ResearchCardData }) {
  return (
    <article className={`${KNOBS} relative flex h-full flex-col overflow-hidden rounded-[var(--rc-radius)] border border-brand-teal/10 bg-white shadow-[0_1px_2px_rgba(16,40,44,0.06),0_12px_28px_-14px_rgba(16,40,44,0.18)] transition-shadow duration-200 focus-within:shadow-[0_2px_4px_rgba(16,40,44,0.08),0_18px_36px_-14px_rgba(16,40,44,0.26)] hover:shadow-[0_2px_4px_rgba(16,40,44,0.08),0_18px_36px_-14px_rgba(16,40,44,0.26)]`}>
      {/* Phone: logos stack until there is room for one row (420px). Then ours sits left and the partner's right. */}
      <div className={`flex flex-col items-start gap-2 px-[var(--rc-band-px)] py-[var(--rc-band-py)] min-h-[var(--rc-band-h)] min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between min-[420px]:gap-[var(--rc-band-gap)] ${BAND[card.tone]}`}>
        <Image src="/brand/logo.svg" alt="CognitiveBotics" width={160} height={24} className="h-[var(--rc-logo-h)] w-auto shrink-0" />
        <PartnerLogo partner={card.partner} />
      </div>
      <div className="flex flex-1 flex-col px-[var(--rc-body-px)] py-[var(--rc-body-py)]">
        <h2 className="text-balance font-heading text-[length:var(--rc-head-size)] font-bold leading-[var(--rc-head-lh)] text-brand-teal">{card.headline}</h2>
        <span className="mt-[var(--rc-pill-gap)] inline-flex w-fit items-center rounded-full border border-[#8fd3f7] bg-[#eff9ff] px-3 py-0.5 text-[14px] font-semibold leading-[1.5] text-[#0b6aa2]">{card.readTime}</span>
        <div className="mt-[var(--rc-head-gap)]">
          <OutputLine text={card.output} />
        </div>
        <div className="mt-auto pt-[var(--rc-btn-gap)]">
          <Button href={card.href} size="md" variant="tertiary" arrow className="text-brand-teal! after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-[var(--rc-radius)]">
            {card.button}
          </Button>
        </div>
      </div>
    </article>
  );
}
