'use client';

import { useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react';
import { track } from '@/lib/analytics';
import { CALENDLY_URL } from '@/lib/demo-config';
import { demoReducer, INITIAL_DEMO_STATE } from '@/lib/demo-flow';
import { keepBookingWhileMounted, saveBooking, savedBooking } from '@/lib/demo-booking';
import type { DemoMeeting } from '@/lib/demo-meeting';
import type { DemoRequest, Plan } from '@/lib/demo-form';
import { DemoDone } from './DemoDone';
import { DemoForm } from './DemoForm';
import { DemoSchedule } from './DemoSchedule';

export const DEMO_CARD = 'flex flex-col gap-6 rounded-[24px] border-[1.5px] border-border-subtle bg-white px-5 py-6 shadow-[0px_6px_18px_0px_rgba(15,48,48,0.06)] lg:gap-8 lg:px-8 lg:py-9';

export function DemoFlow({ plan }: { plan: Plan | null }) {
  const [state, dispatch] = useReducer(demoReducer, INITIAL_DEMO_STATE);
  const [request, setRequest] = useState<DemoRequest | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Calendly can send the booking message more than once. Only the first outcome counts.
  const settled = useRef(false);

  // A booking saved earlier in this tab (the visitor reloaded the confirmation) puts the flow straight on "done".
  const saved = useSyncExternalStore(savedBooking.subscribe, savedBooking.getSnapshot, savedBooking.getServerSnapshot);
  const step = saved ? 'done' : state.step;

  // After the form, move focus to the new heading so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (step !== 'details') headingRef.current?.focus();
  }, [step]);
  // Leaving the page through the site forgets the booking, so the next visit starts a fresh form.
  useEffect(() => keepBookingWhileMounted(), []);

  const onSubmitted = useCallback(
    (req: DemoRequest) => {
      track('demo_submitted', { plan: req.plan ?? 'none' });
      setRequest(req);
      dispatch({ type: 'submitted' });
    },
    [],
  );
  const onBooked = useCallback((booked?: DemoMeeting) => {
    if (settled.current) return;
    settled.current = true;
    track('demo_booked');
    saveBooking(booked ?? null);
    dispatch({ type: 'booked' });
  }, []);
  return (
    <div className={DEMO_CARD}>
      {step === 'details' ? <DemoForm plan={plan} onSubmitted={onSubmitted} /> : null}
      {step === 'schedule' && request ? (
        <DemoSchedule headingRef={headingRef} url={CALENDLY_URL} name={`${request.firstName} ${request.lastName}`.trim()} firstName={request.firstName} lastName={request.lastName} email={request.email} onBooked={onBooked} />
      ) : null}
      {step === 'done' ? <DemoDone headingRef={headingRef} meeting={saved?.meeting ?? null} /> : null}
    </div>
  );
}
