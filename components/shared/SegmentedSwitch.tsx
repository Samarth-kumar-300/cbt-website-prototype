'use client';

import { useRef, useState } from 'react';
import { useLiquidThumb } from './useLiquidThumb';

export type SwitchItem = { readonly id: string; readonly label: string };

type Props = {
  items: readonly SwitchItem[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name of the tab list. */
  label: string;
  /** Tab ids are `${idPrefix}-tab-${id}`; the panel for each is `${idPrefix}-panel-${id}`. */
  idPrefix: string;
  className?: string;
};

// A segmented control: one grey track, equal-width segments, and a white thumb that slides under the
// active label. Same tab semantics and arrow-key behaviour as Chips, for choices that swap a whole view.
// The thumb moves with the liquid slide in useLiquidThumb.
export function SegmentedSwitch({ items, value, onChange, label, idPrefix, className = '' }: Props) {
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
    <div
      ref={trackRef}
      role="tablist"
      aria-label={label}
      data-active-index={activeIndex}
      className={`relative grid w-full rounded-[18px] bg-[#f3f4f6] p-1.5 ${className}`}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <span
        ref={thumbRef}
        aria-hidden="true"
        data-switch-thumb=""
        className="pointer-events-none absolute inset-y-1.5 rounded-[14px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06),0_2px_8px_rgba(16,24,40,0.08)]"
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
            className={`relative z-10 min-h-[48px] rounded-[14px] px-2 text-[14px] font-semibold leading-[22px] sm:px-3 sm:text-[15px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal lg:min-h-[56px] lg:px-6 lg:text-[18px] ${
              selected ? 'text-text-default delay-[110ms] motion-reduce:delay-0' : 'text-[#5b6470] hover:text-text-default'
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
