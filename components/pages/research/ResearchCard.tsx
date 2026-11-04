import Link from 'next/link';
import type { ResearchCardData } from './content';

// Card markup and class strings are carried over from the original Resources > Research section.
// It is a direct child of RevealStagger, which staggers `.card-lift` children.
export function ResearchCard({ card }: { card: ResearchCardData }) {
  return (
    <Link
      href={card.href}
      className="flex w-full flex-1 flex-col items-start gap-4 rounded-[20px] border-[1.5px] border-brand-teal-100 bg-white px-6 py-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] card-lift hover:bg-background-brand-subtle lg:px-7 lg:py-7 lg:min-h-[380px]"
    >
      <span data-icon className="flex size-10 shrink-0 items-center justify-center rounded-full lg:size-12" style={{ backgroundColor: card.iconBg }}>
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="lg:size-6"
          style={{ color: card.iconColor }}
        >
          <path d={card.iconPath} />
        </svg>
      </span>
      <span
        className="inline-block rounded-full px-[10px] py-[5px] text-[13px] max-lg:text-[14px] lg:text-[14px]"
        style={{ backgroundColor: card.pillBg, color: card.pillColor }}
      >
        {card.pill}
      </span>
      <p className="font-heading text-[18px] leading-[24px] lg:text-[20px] lg:leading-[26px] font-bold" style={{ color: '#175f63' }}>
        {card.title}
      </p>
      <div className="flex-1" />
      <span className="flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
        Read more
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12h16m0 0-6-6m6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
