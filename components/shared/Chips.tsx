'use client';

import { useRef } from 'react';

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

export function Chips({ items, value, onChange, label, idPrefix, className = '' }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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
      role="tablist"
      aria-label={label}
      className={`flex flex-wrap gap-2 lg:gap-3 ${className}`}
    >
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
            className={`inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border-[1.5px] border-brand-teal px-5 text-[16px] font-semibold transition-colors ${
              selected ? 'bg-brand-teal text-content-knockout' : 'bg-transparent text-content-brand hover:bg-brand-subtle-bg'
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
