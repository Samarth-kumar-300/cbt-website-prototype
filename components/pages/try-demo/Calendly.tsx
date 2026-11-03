'use client';

import { useEffect, useRef, useState } from 'react';
import { isScheduledEvent, loadCalendly } from '@/lib/calendly';

type Props = { url: string; name: string; email: string; onBooked: () => void; onFailed: () => void };

export function Calendly({ url, name, email, onBooked, onFailed }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (isScheduledEvent(e)) onBooked();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onBooked]);

  useEffect(() => {
    let cancelled = false;
    loadCalendly()
      .then(() => {
        if (cancelled || !host.current) return;
        // The script loaded but did not define the global: report it, so the card never waits forever.
        if (!window.Calendly) {
          onFailed();
          return;
        }
        window.Calendly.initInlineWidget({ url, parentElement: host.current, prefill: { name, email } });
        host.current.querySelector('iframe')?.setAttribute('title', 'Pick a time for your demo');
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) onFailed();
      });
    return () => {
      cancelled = true;
    };
    // name and email only prefill the widget. Re-running on a change would reload it mid-booking.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div className="relative min-h-[660px] w-full">
      {ready ? null : (
        <p role="status" className="absolute inset-0 flex items-center justify-center text-[16px] text-content-secondary">
          Loading available times
        </p>
      )}
      <div ref={host} className="h-[660px] w-full" />
    </div>
  );
}
