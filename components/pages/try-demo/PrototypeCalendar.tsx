'use client';

import { useEffect, useRef, useState } from 'react';

// PROTOTYPE ONLY: stands in for Calendly while CALENDLY_URL is empty, so the whole journey can be
// walked. Once the link is set, DemoSchedule opens Calendly and this file is never used. Delete it then.
const SLOTS = ['10:00 am', '11:30 am', '2:00 pm', '3:30 pm', '5:00 pm'] as const;
const DAYS = 5;

/** The next `count` weekdays after today. */
export function nextWeekdays(from: Date, count: number): Date[] {
  const out: Date[] = [];
  const d = new Date(from);
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
  }
  return out;
}

const dayLabel = (d: Date) => new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);

const pill = (on: boolean) =>
  `inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full border-[1.5px] border-brand-teal px-4 text-[15px] font-semibold transition-colors ${
    on ? 'bg-brand-teal text-content-knockout' : 'bg-transparent text-content-brand hover:bg-brand-subtle-bg'
  }`;

type Props = { onConfirm: () => void; onClose: () => void; today?: Date };

export function PrototypeCalendar({ onConfirm, onClose, today = new Date() }: Props) {
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const days = nextWeekdays(today, DAYS);

  useEffect(() => {
    headingRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-3 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="proto-cal-title" className="flex max-h-full w-full max-w-[480px] flex-col gap-5 overflow-y-auto rounded-[24px] text-left bg-white p-6 shadow-[0px_20px_60px_rgba(10,13,18,0.3)] lg:gap-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <h2 id="proto-cal-title" ref={headingRef} tabIndex={-1} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none">
            Pick a time
          </h2>
          <p className="text-[14px] leading-[22px] text-content-secondary">Sample times for the prototype. Times are in IST.</p>
        </div>
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-[14px] font-semibold text-content-brand">Date</legend>
          <div className="flex flex-wrap gap-2">
            {days.map((d) => {
              const label = dayLabel(d);
              return (
                <button key={label} type="button" aria-pressed={day === label} onClick={() => setDay(label)} className={pill(day === label)}>
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-[14px] font-semibold text-content-brand">Time</legend>
          <div className="flex flex-wrap gap-2">
            {SLOTS.map((s) => (
              <button key={s} type="button" aria-pressed={slot === s} onClick={() => setSlot(s)} className={pill(slot === s)}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            disabled={!day || !slot}
            onClick={onConfirm}
            className="btn inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-brand-teal px-6 py-[14px] text-[16px] font-semibold text-content-knockout transition-colors hover:bg-[#0f4548] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-teal"
          >
            Confirm time
          </button>
          <button type="button" onClick={onClose} className="min-h-[44px] px-4 text-[16px] font-semibold text-content-brand underline-offset-4 hover:underline focus-visible:underline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
