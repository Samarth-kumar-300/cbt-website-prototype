'use client';

import { useId, useState } from 'react';
import { FAQ_MODE } from './faq-config';

export type FaqItem = { q: string; a: string };

export function FAQ({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState<number[]>([]);
  const base = useId();
  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : FAQ_MODE === 'single' ? [i] : [...o, i]));

  return (
    <ul className="flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
      {items.map((it, i) => {
        const isOpen = open.includes(i);
        const id = `${base}-${i}`;
        return (
          <li key={id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-4 py-5 text-left"
            >
              <span className="flex-1 font-heading text-[16px] font-bold leading-[27px] text-content-brand lg:text-[20px]">{it.q}</span>
              {/* Plus becomes minus: the vertical stroke collapses rather than the glyph swapping. */}
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-content-brand">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M12 5v14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={`faq-plus-bar origin-center transition-transform duration-300 ease-out ${isOpen ? 'scale-y-0' : ''}`}
                />
              </svg>
            </button>
            {/* Collapsed answers stay in the DOM so crawlers read them, but inert keeps their links out of tab order. */}
            <div
              id={id}
              role="region"
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="pb-5 text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px] lg:text-text-secondary">
                  {it.a}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
