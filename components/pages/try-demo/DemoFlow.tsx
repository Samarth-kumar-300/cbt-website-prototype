'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { CALENDLY_URL } from '@/lib/demo-config';
import { demoReducer, INITIAL_DEMO_STATE } from '@/lib/demo-flow';
import type { DemoRequest, Plan } from '@/lib/demo-form';
import { DemoDone } from './DemoDone';
import { DemoForm } from './DemoForm';
import { DemoSchedule } from './DemoSchedule';

const STEPS_WITH_BOOKING = ['Your details', 'Pick a time', 'Done'] as const;
const STEPS_WITHOUT_BOOKING = ['Your details', 'Done'] as const;

function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <ol aria-label="Progress" className="flex items-center gap-3 text-[14px] font-semibold">
      {steps.map((label, i) => (
        <li key={label} aria-current={i === current ? 'step' : undefined} className="flex items-center gap-3">
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[14px] ${
              i <= current ? 'bg-brand-teal text-content-knockout' : 'bg-brand-subtle-bg text-content-secondary'
            }`}
          >
            {i + 1}
          </span>
          <span className={`${i === current ? 'text-brand-teal' : 'hidden text-content-secondary sm:inline'}`}>{label}</span>
          {i < steps.length - 1 ? <span aria-hidden="true" className="h-px w-6 bg-brand-teal/28 lg:w-10" /> : null}
        </li>
      ))}
    </ol>
  );
}

export function DemoFlow({ plan }: { plan: Plan | null }) {
  const canBook = CALENDLY_URL !== '';
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
      dispatch({ type: 'submitted', canBook });
    },
    [canBook],
  );
  const onBooked = useCallback(() => {
    if (settled.current) return;
    settled.current = true;
    track('demo_booked');
    dispatch({ type: 'booked' });
  }, []);
  const onSkipped = useCallback(() => {
    if (settled.current) return;
    settled.current = true;
    track('demo_skipped');
    dispatch({ type: 'skipped' });
  }, []);

  const steps = canBook ? STEPS_WITH_BOOKING : STEPS_WITHOUT_BOOKING;
  const current = state.step === 'details' ? 0 : state.step === 'schedule' ? 1 : steps.length - 1;

  return (
    <div className="flex flex-col gap-6 rounded-[24px] border-[1.5px] border-border-subtle bg-white px-5 py-6 shadow-[0px_6px_18px_0px_rgba(15,48,48,0.06)] lg:gap-8 lg:px-8 lg:py-9">
      <Stepper steps={steps} current={current} />
      {state.step === 'details' ? <DemoForm plan={plan} onSubmitted={onSubmitted} /> : null}
      {state.step === 'schedule' && request ? (
        <DemoSchedule headingRef={headingRef} url={CALENDLY_URL} name={request.name} email={request.email} onBooked={onBooked} onSkipped={onSkipped} />
      ) : null}
      {state.step === 'done' ? <DemoDone headingRef={headingRef} booked={state.booked} /> : null}
    </div>
  );
}
