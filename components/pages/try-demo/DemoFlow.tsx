'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { CALENDLY_URL } from '@/lib/demo-config';
import { demoReducer, INITIAL_DEMO_STATE } from '@/lib/demo-flow';
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

  // After the form, move focus to the new heading so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (state.step !== 'details') headingRef.current?.focus();
  }, [state.step]);

  const onSubmitted = useCallback(
    (req: DemoRequest) => {
      track('demo_submitted', { plan: req.plan ?? 'none' });
      setRequest(req);
      dispatch({ type: 'submitted' });
    },
    [],
  );
  const onBooked = useCallback(() => {
    if (settled.current) return;
    settled.current = true;
    track('demo_booked');
    dispatch({ type: 'booked' });
  }, []);
  return (
    <div className={DEMO_CARD}>
      {state.step === 'details' ? <DemoForm plan={plan} onSubmitted={onSubmitted} /> : null}
      {state.step === 'schedule' && request ? (
        <DemoSchedule headingRef={headingRef} url={CALENDLY_URL} name={`${request.firstName} ${request.lastName}`.trim()} firstName={request.firstName} lastName={request.lastName} email={request.email} onBooked={onBooked} />
      ) : null}
      {state.step === 'done' ? <DemoDone headingRef={headingRef} /> : null}
    </div>
  );
}
