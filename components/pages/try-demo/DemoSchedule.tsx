'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { isScheduledEvent, loadCalendly } from '@/lib/calendly';
import { tryDemoContent as c } from './content';
import { PrototypeCalendar } from './PrototypeCalendar';
import { SuccessIcon } from './SuccessIcon';

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  url: string;
  name: string;
  email: string;
  onBooked: () => void;
  /** TEMPORARY (design preview): freeze the button in this state and never contact Calendly. */
  previewStatus?: 'idle' | 'opening' | 'error';
};

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Step two: the request is in, so the card confirms it and offers one next step. The button opens
// Calendly as a popup over the page, and Calendly's own "booked" message moves the flow on.
export function DemoSchedule({ headingRef, url, name, email, onBooked, previewStatus }: Props) {
  const [liveStatus, setStatus] = useState<'idle' | 'opening' | 'error'>('idle');
  const [protoOpen, setProtoOpen] = useState(false);
  const bookButton = useRef<HTMLButtonElement>(null);
  const closeProto = useCallback(() => {
    setProtoOpen(false);
    bookButton.current?.focus();
  }, []);
  const status = previewStatus ?? liveStatus;

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!isScheduledEvent(e)) return;
      // Close Calendly's own confirmation so the visitor lands on ours.
      window.Calendly?.closePopupWidget?.();
      onBooked();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onBooked]);

  const openCalendar = async () => {
    if (previewStatus) return;
    // No Calendly link yet: open the sample calendar so the whole journey can be walked.
    if (url === '') {
      setProtoOpen(true);
      return;
    }
    setStatus('opening');
    try {
      await loadCalendly();
      // The script ran but did not define the global: treat it as a failed load.
      if (!window.Calendly) throw new Error('Calendly missing');
      window.Calendly.initPopupWidget({ url, prefill: { name, email } });
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center lg:gap-8">
      <SuccessIcon />
      <div className="flex flex-col gap-3 lg:gap-4">
        <h2 ref={headingRef} tabIndex={-1} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none lg:text-[32px] lg:leading-[40px]">
          {c.schedule.title}
        </h2>
        <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">{c.schedule.helper}</p>
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        <button
          ref={bookButton}
          type="button"
          onClick={openCalendar}
          disabled={status === 'opening'}
          className="btn inline-flex min-h-[44px] w-full items-center justify-center gap-[10px] whitespace-nowrap rounded-full bg-brand-teal px-6 py-[14px] text-[16px] font-semibold text-content-knockout transition-colors hover:bg-[#0f4548] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand-teal lg:py-[18px] lg:text-[18px]"
        >
          {status === 'opening' ? c.schedule.opening : c.schedule.cta}
          {status === 'opening' ? null : <ArrowRight />}
        </button>
        {status === 'error' ? (
          <p role="alert" className="text-[14px] leading-[22px] text-[#b42318]">
            {c.schedule.error}
          </p>
        ) : null}
      </div>
      {protoOpen ? (
        <PrototypeCalendar
          onClose={closeProto}
          onConfirm={() => {
            setProtoOpen(false);
            onBooked();
          }}
        />
      ) : null}
    </div>
  );
}
