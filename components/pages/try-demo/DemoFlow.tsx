'use client';

import { useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { reducedMotion, staggerIn, useIsoLayoutEffect } from '@/components/shared/motion';
import { track } from '@/lib/analytics';
import { CALENDLY_URL } from '@/lib/demo-config';
import { demoReducer, INITIAL_DEMO_STATE } from '@/lib/demo-flow';
import { keepBookingWhileMounted, saveBooking, savedBooking } from '@/lib/demo-booking';
import type { DemoMeeting } from '@/lib/demo-meeting';
import type { DemoRequest, Plan } from '@/lib/demo-form';
import { DemoDone } from './DemoDone';
import { DemoForm } from './DemoForm';
import { DemoSchedule } from './DemoSchedule';
import { popSuccessIcon } from './SuccessIcon';

export const DEMO_CARD = 'flex flex-col gap-6 rounded-[24px] border-[1.5px] border-border-subtle bg-white px-5 py-6 shadow-[0px_6px_18px_0px_rgba(15,48,48,0.06)] lg:gap-8 lg:px-8 lg:py-9';

// What rises in on a new step: the step's own blocks, looking through the role=status wrapper on the done
// step. The success icon plays its own pop instead.
function riseTargets(card: HTMLElement): Element[] {
  const root = card.firstElementChild;
  if (!root) return [];
  const blocks = Array.from(root.children).flatMap((el) => (el.getAttribute('role') === 'status' ? Array.from(el.children) : [el]));
  return blocks.filter((el) => !el.hasAttribute('data-success-icon'));
}

// The card eases from the old step's height to the new one's, and the new step's blocks rise in. Only called
// when the visitor moves the flow on, never for the first paint or a booking restored from the tab.
function enterStep(card: HTMLElement, fromHeight: number) {
  if (reducedMotion()) return;
  gsap.killTweensOf(card);
  card.style.overflow = 'hidden';
  gsap.fromTo(
    card,
    { height: fromHeight },
    { height: 'auto', duration: 0.45, ease: 'power3.out', onComplete: () => { gsap.set(card, { clearProps: 'height,overflow' }); } },
  );
  staggerIn(riseTargets(card), { y: 14, stagger: 0.06, delay: 0.08, duration: 0.45 });
  popSuccessIcon(card);
}

export function DemoFlow({ plan }: { plan: Plan | null }) {
  const [state, dispatch] = useReducer(demoReducer, INITIAL_DEMO_STATE);
  const [request, setRequest] = useState<DemoRequest | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // The card's height just before the visitor moved on. Set only by the handlers below, so a restored
  // booking or the first render never animates.
  const leavingHeight = useRef<number | null>(null);
  // Calendly can send the booking message more than once. Only the first outcome counts.
  const settled = useRef(false);

  // A booking saved earlier in this tab (the visitor reloaded the confirmation) puts the flow straight on "done".
  const saved = useSyncExternalStore(savedBooking.subscribe, savedBooking.getSnapshot, savedBooking.getServerSnapshot);
  const step = saved ? 'done' : state.step;

  // Runs before paint, so the new step never shows at full opacity first. Focus (next effect) is not delayed.
  useIsoLayoutEffect(() => {
    const from = leavingHeight.current;
    leavingHeight.current = null;
    if (from !== null && cardRef.current) enterStep(cardRef.current, from);
  }, [step]);

  // After the form, move focus to the new heading so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (step !== 'details') headingRef.current?.focus();
  }, [step]);
  // Leaving the page through the site forgets the booking, so the next visit starts a fresh form.
  useEffect(() => keepBookingWhileMounted(), []);

  const onSubmitted = useCallback(
    (req: DemoRequest) => {
      track('demo_submitted', { plan: req.plan ?? 'none' });
      leavingHeight.current = cardRef.current?.offsetHeight ?? null;
      setRequest(req);
      dispatch({ type: 'submitted' });
    },
    [],
  );
  const onBooked = useCallback((booked?: DemoMeeting) => {
    if (settled.current) return;
    settled.current = true;
    track('demo_booked');
    leavingHeight.current = cardRef.current?.offsetHeight ?? null;
    saveBooking(booked ?? null);
    dispatch({ type: 'booked' });
  }, []);
  return (
    <div ref={cardRef} className={DEMO_CARD}>
      {step === 'details' ? <DemoForm plan={plan} onSubmitted={onSubmitted} /> : null}
      {step === 'schedule' && request ? (
        <DemoSchedule headingRef={headingRef} url={CALENDLY_URL} name={`${request.firstName} ${request.lastName}`.trim()} firstName={request.firstName} lastName={request.lastName} email={request.email} onBooked={onBooked} />
      ) : null}
      {step === 'done' ? <DemoDone headingRef={headingRef} meeting={saved?.meeting ?? null} /> : null}
    </div>
  );
}
