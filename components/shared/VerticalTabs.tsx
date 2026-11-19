'use client';

import { useRef } from 'react';
import { useLiquidThumb } from './useLiquidThumb';

export type VerticalTabItem = {
  readonly id: string;
  readonly label: string;
  /** Optional second line under the label, such as "27 objectives". */
  readonly meta?: string;
};

type Props = {
  items: readonly VerticalTabItem[];
  /** Id of the current item. */
  value: string;
  onChange: (id: string) => void;
  /** Accessible name of the list (and of the dropdown). */
  label: string;
  /**
   * 'vertical' is the Figma Desktop variant (a stack of rows). 'dropdown' is the Figma Mobile variant
   * (one select showing the current item). Pick one per placement and hide it at the breakpoints you do not want.
   */
  layout?: 'vertical' | 'dropdown';
  /**
   * Give each item an address and it renders as a nav of links (aria-current marks the current one), for
   * jumping around a page. Leave it out for real tabs that swap a panel: role="tab" with arrow keys.
   */
  getHref?: (id: string) => string;
  /** Link mode: runs on click, before the browser follows the link, so the caller can scroll smoothly instead. */
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  /** Tab mode: ids are `${idPrefix}-tab-${id}`; the panel for each is `${idPrefix}-panel-${id}`. */
  idPrefix?: string;
  className?: string;
};

// Row look from the design system (DS-CBT, "Vertical tabs" with the gray tab base): 14px semibold label,
// optional 12px meta line, 8px radius, 12px / 8px padding. The current row takes the muted brand fill, others
// are clear until hovered.
//
// The muted fill is one block that slides between rows (the liquid slide in useLiquidThumb, vertical axis),
// so rows of different heights stretch it. The rows sit above it. Until the list has been measured the
// current row paints the fill itself, which is what the server renders. Afterwards the row keeps the same
// colour, but it only appears once the block has had time to arrive (delay), and it fades out at once when
// the row stops being current, so the block never has a second copy of the fill jumping ahead of it.
const ROW =
  'relative z-10 flex w-full items-center rounded-[8px] px-2 py-3 text-left text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal';
const ROW_CURRENT = 'bg-brand-teal-100 transition-colors duration-0 delay-[650ms] motion-reduce:delay-0';
const ROW_IDLE = 'bg-transparent transition-colors hover:bg-[#f9fafb]';

// The sliding block. Hidden until measured, and whenever no row is current.
function Thumb({ thumbRef, hidden }: { thumbRef: React.RefObject<HTMLSpanElement | null>; hidden: boolean }) {
  return (
    <span
      ref={thumbRef}
      aria-hidden="true"
      data-rail-thumb=""
      className={`pointer-events-none absolute inset-x-0 z-0 rounded-[8px] bg-brand-teal-100 opacity-0 [[data-liquid=ready]_&]:opacity-100 ${hidden ? 'invisible' : ''}`}
    />
  );
}

function Text({ item }: { item: VerticalTabItem }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="text-[14px] font-semibold leading-[20px]">{item.label}</span>
      {item.meta ? <span className="text-[12px] leading-[16px]">{item.meta}</span> : null}
    </span>
  );
}

export function VerticalTabs({ items, value, onChange, label, layout = 'vertical', getHref, onLinkClick, idPrefix = 'vtabs', className = '' }: Props) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const trackRef = useRef<HTMLElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const activeIndex = items.findIndex((it) => it.id === value);
  useLiquidThumb(trackRef, thumbRef, refs, Math.max(0, activeIndex), { axis: 'y' });

  if (layout === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-[8px] border border-[#d1d5db] bg-white pl-3 pr-10 text-[16px] leading-[24px] text-text-secondary shadow-[0px_1px_2px_rgba(10,13,18,0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        >
          {items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.label}
            </option>
          ))}
        </select>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (getHref) {
    return (
      <nav ref={trackRef} aria-label={label} className={`relative ${className}`}>
        <Thumb thumbRef={thumbRef} hidden={activeIndex < 0} />
        <ul className="m-0 flex list-none flex-col p-0">
          {items.map((it, i) => {
            const current = it.id === value;
            return (
              <li key={it.id}>
                <a
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  href={getHref(it.id)}
                  aria-current={current ? 'true' : undefined}
                  onClick={(e) => (onLinkClick ? onLinkClick(e, it.id) : onChange(it.id))}
                  className={`${ROW} ${current ? ROW_CURRENT : ROW_IDLE}`}
                >
                  <Text item={it} />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === 'ArrowDown') next = (i + 1) % items.length;
    else if (e.key === 'ArrowUp') next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div ref={trackRef as React.RefObject<HTMLDivElement>} role="tablist" aria-orientation="vertical" aria-label={label} className={`relative flex flex-col ${className}`}>
      <Thumb thumbRef={thumbRef} hidden={activeIndex < 0} />
      {items.map((it, i) => {
        const selected = it.id === value;
        return (
          <button
            key={it.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${it.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${it.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(it.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`${ROW} ${selected ? ROW_CURRENT : ROW_IDLE}`}
          >
            <Text item={it} />
          </button>
        );
      })}
    </div>
  );
}
