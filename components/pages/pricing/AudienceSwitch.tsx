'use client';

import { useRef, useState } from 'react';
import { useLiquidThumb } from '@/components/shared/useLiquidThumb';

export type SwitchItem = { readonly id: string; readonly label: string };

// Pricing-local segmented control from the design comp: pale teal track, teal active pill, white label.
// Same tab semantics and arrow-key behaviour as the shared SegmentedSwitch. The pill moves with the
// liquid slide in useLiquidThumb; the label colour waits for the pill to arrive under it.
export function AudienceSwitch({ items, value, onChange, label, idPrefix, className = '' }: { items: readonly SwitchItem[]; value: string; onChange: (id: string) => void; label: string; idPrefix: string; className?: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const count = items.length;
  const activeIndex = Math.max(0, items.findIndex((it) => it.id === value));
  // The server-rendered position. Frozen so React never rewrites the style GSAP is animating.
  const [initialIndex] = useState(activeIndex);
  useLiquidThumb(trackRef, thumbRef, refs, activeIndex);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % count;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div ref={trackRef} role="tablist" aria-label={label} data-audience-switch="" data-active-index={activeIndex} className={`relative grid w-full rounded-full bg-brand-subtle-bg p-1.5 ${className}`} style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
      <span
        ref={thumbRef}
        aria-hidden="true"
        data-switch-thumb=""
        className="pointer-events-none absolute inset-y-1.5 rounded-full bg-brand-teal"
        style={{
          left: `calc(6px + ${initialIndex} * (100% - 12px) / ${count})`,
          right: `calc(6px + ${count - 1 - initialIndex} * (100% - 12px) / ${count})`,
        }}
      />
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
            className={`relative z-10 min-h-[44px] rounded-full px-2 font-heading text-[12px] font-bold whitespace-nowrap uppercase leading-[22px] tracking-[0.04em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal sm:px-3 sm:text-[14px] lg:min-h-[48px] lg:px-6 lg:text-[15px] ${selected ? 'text-white delay-[110ms] motion-reduce:delay-0' : 'text-brand-teal hover:text-brand-dark'}`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
