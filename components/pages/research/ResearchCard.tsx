import Image from 'next/image';
import Link from 'next/link';
import type { ResearchCardData } from './content';

// One sheet of cream ruled notepad paper. The ruling and the edge are cool greys.
const PAPER = '#fffcf5';
const RULE = '#eef1f2';
const MARGIN_LINE = '#e3e8ea';
const EDGE = '#e1e6e8';
const INK_SOFT = '#4a5658'; // 7.4:1 on PAPER

// The rule interval doubles as the line-height of both text blocks (--rule is 28px on mobile, 32px
// from lg), so each text line sits in exactly one ruled row. --rule-shift (-1px, 1px from lg) moves
// the ruling so Nunito's baseline lands a few px above a rule and descenders (g, p, y) still clear it.
// The gap between title and description is one full row (`--rule`), so both stay on the ruling.
const RULED_PAPER = `linear-gradient(to right, transparent 43px, ${MARGIN_LINE} 43px, ${MARGIN_LINE} 44px, transparent 44px), linear-gradient(to bottom, transparent calc(var(--rule) - 1px), ${RULE} calc(var(--rule) - 1px))`;

// The card is a direct child of RevealStagger, which staggers `.card-lift` children.
export function ResearchCard({ card }: { card: ResearchCardData }) {
  return (
    <Link
      href={card.href}
      className="card-lift relative flex min-h-[360px] w-full flex-1 flex-col rounded-[3px] pb-[calc(var(--rule)*2)] pl-[60px] pr-5 pt-[calc(var(--rule)*3)] shadow-[0_1px_2px_rgba(16,40,44,0.10),0_8px_20px_-8px_rgba(16,40,44,0.20)] outline-none [--rule:28px] [--rule-shift:-1px] hover:shadow-[0_2px_4px_rgba(16,40,44,0.12),0_14px_28px_-10px_rgba(16,40,44,0.28)]! focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 lg:min-h-[460px] lg:[--rule:32px] lg:[--rule-shift:1px]"
      style={{ backgroundColor: PAPER, backgroundImage: RULED_PAPER, backgroundSize: '100% 100%, 100% var(--rule)', backgroundPositionY: '0, var(--rule-shift)', backgroundRepeat: 'no-repeat, repeat-y', border: `1px solid ${EDGE}` }}
    >
      <svg viewBox="0 0 26 64" width="26" height="64" fill="none" stroke="#9aa1a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pointer-events-none absolute -top-[18px] left-[18px] rotate-[4deg] drop-shadow-[0_1px_1px_rgba(16,40,44,0.25)]">
        <path d="M8 44V9a5 5 0 0 1 10 0v40a8 8 0 0 1-16 0V14" />
      </svg>
      <Image src="/research/logo-symbol.webp" alt="" width={28} height={25} className="pointer-events-none absolute right-5 top-4 h-[25px] w-7" />
      <p className="text-balance break-words font-heading text-[20px] font-semibold text-brand-teal lg:text-[24px]" style={{ lineHeight: 'var(--rule)' }}>
        {card.title}
      </p>
      <p className="line-clamp-2 text-balance text-[15px] lg:text-[16px]" style={{ color: INK_SOFT, lineHeight: 'var(--rule)', marginTop: 'var(--rule)' }}>
        {card.description}
      </p>
    </Link>
  );
}
