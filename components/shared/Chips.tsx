'use client';

import { useRef } from 'react';
import { useLiquidThumb } from './useLiquidThumb';

export type ChipItem = { readonly id: string; readonly label: string };

type Props = {
  items: readonly ChipItem[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name of the tab list. */
  label: string;
  /** Tab ids are `${idPrefix}-tab-${id}`; the panel for each is `${idPrefix}-panel-${id}`. */
  idPrefix: string;
  className?: string;
};

// Shared by the chip and its white copy in the ink layer, so the label sits in exactly the same place.
const CHIP = 'inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border-[1.5px] px-5 text-[16px] font-semibold';
// Until the track has been measured (data-liquid="ready") the selected chip paints its own teal fill and
// white label, which is what the server renders. After that the pill and the ink layer take over. The
// variant classes are written out in full so Tailwind can find them.

// One teal pill travels between the chips (the liquid slide in useLiquidThumb). Chips can wrap onto several
// rows, so the pill moves on both axes. A white copy of every label sits in a clipped layer on top and the
// clip follows the pill, so a label turns white exactly where the pill is under it.
export function Chips({ items, value, onChange, label, idPrefix, className = '' }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const activeIndex = Math.max(0, items.findIndex((it) => it.id === value));
  useLiquidThumb(trackRef, thumbRef, refs, activeIndex, { axis: 'both', squash: true, inkRef });

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
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
      className={`relative flex flex-wrap gap-2 lg:gap-3 ${className}`}
    >
      <span
        ref={thumbRef}
        aria-hidden="true"
        data-chip-thumb=""
        className={`pointer-events-none absolute z-0 rounded-full bg-brand-teal opacity-0 [[data-liquid=ready]_&]:opacity-100`}
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
            className={`relative z-10 border-brand-teal transition-colors ${CHIP} ${
              selected
                ? `bg-brand-teal text-content-knockout [[data-liquid=ready]_&]:bg-transparent [[data-liquid=ready]_&]:text-content-brand`
                : 'bg-transparent text-content-brand hover:bg-brand-subtle-bg'
            }`}
          >
            {it.label}
          </button>
        );
      })}
      <span ref={inkRef} aria-hidden="true" data-chip-ink="" className="pointer-events-none absolute inset-0 z-20 opacity-0 [[data-liquid=ready]_&]:opacity-100">
        {items.map((it) => (
          <span key={it.id} className={`absolute border-transparent text-content-knockout ${CHIP}`}>
            {it.label}
          </span>
        ))}
      </span>
    </div>
  );
}
