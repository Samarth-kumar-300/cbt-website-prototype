'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Every number that shapes the feel lives here, so tuning never touches the logic below.
const MOTION = {
  speed: 720, // px per second the orb travels along the line
  minSegment: 0.3, // seconds: shortest stretch of line, so short mobile rows still read as travel
  image: { duration: 0.9, ease: 'back.out(1.5)', scale: 0.84, tilt: 5, blur: 8, lead: 0.05 },
  node: { duration: 0.5, ease: 'back.out(2.6)' },
  ring: { duration: 0.7, to: 1.9, from: 0.55, delay: 0.1 },
  card: { duration: 0.7, delay: 0.1, blur: 6, riseX: 34, riseY: 18 },
  copy: { duration: 0.5, titleDelay: 0.25, bodyDelay: 0.35, rise: 10 },
  stub: { duration: 0.3, delay: 0.2 },
  spark: { duration: 0.9, radius: 52, jitter: 14, delay: 0.25 },
  // The path is driven by scroll: 0% when the rail's top reaches 75% of the viewport, 100% when its bottom
  // reaches 50%, so the last step has landed while the rail is still on screen. smooth trails the wheel a little.
  scroll: { start: 'top 75%', end: 'bottom 50%', smooth: 0.6 },
} as const;

type Axis = 'x' | 'y';

// Builds the whole entry as one paused timeline. Called only when motion is allowed. The axis is
// 'x' at >= 1280px (five columns, line runs left to right) and 'y' below (list, line runs down).
function build(root: HTMLElement, axis: Axis) {
  const horizontal = axis === 'x';
  const steps = gsap.utils.toArray<HTMLElement>('[data-jr-step]', root);
  const last = steps.length - 1;
  const one = (el: HTMLElement, sel: string) => el.querySelector<HTMLElement>(sel)!;

  // Hidden start states. The CSS default is "final", so reduced motion and no JavaScript need no code.
  steps.forEach((step, i) => {
    const tilt = (i % 2 === 0 ? -1 : 1) * MOTION.image.tilt;
    gsap.set(one(step, '[data-jr-line]'), horizontal ? { scaleX: 0 } : { scaleY: 0 });
    gsap.set(one(step, '[data-jr-orb]'), { autoAlpha: 0, x: 0, y: 0 });
    gsap.set(one(step, '[data-jr-node]'), { scale: 0, opacity: 0 });
    gsap.set(one(step, '[data-jr-image]'), {
      opacity: 0,
      scale: MOTION.image.scale,
      rotate: tilt,
      filter: `blur(${MOTION.image.blur}px)`,
      ...(horizontal ? { y: 30 } : { x: -14, y: 8 }),
    });
    gsap.set(one(step, '[data-jr-card]'), {
      opacity: 0,
      filter: `blur(${MOTION.card.blur}px)`,
      ...(horizontal ? { y: MOTION.card.riseX } : { x: MOTION.card.riseY }),
    });
    gsap.set([one(step, '[data-jr-title]'), one(step, '[data-jr-body]')], { opacity: 0, y: MOTION.copy.rise });
    gsap.set(one(step, '[data-jr-stub]'), { scaleY: 0 });
  });

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  let cursor = 0;
  let arrivedLast = 0;

  steps.forEach((step, i) => {
    const track = one(step, '.jr-track');
    const length = horizontal ? track.offsetWidth : track.offsetHeight;
    const dur = Math.max(MOTION.minSegment, length / MOTION.speed);
    const start = cursor;
    cursor += dur;
    // The first step's line starts at its node, the last step's line ends at its node, the others
    // pass through it halfway.
    const arrive = i === 0 ? start : i === last ? start + dur : start + dur / 2;
    if (i === last) arrivedLast = arrive;

    const line = one(step, '[data-jr-line]');
    const orb = one(step, '[data-jr-orb]');
    const node = one(step, '[data-jr-node]');
    const ring = one(step, '[data-jr-ring]');
    const image = one(step, '[data-jr-image]');
    const card = one(step, '[data-jr-card]');

    // The line and the orb travel together, linear, so the orb always sits at the head of the line.
    tl.to(line, { [horizontal ? 'scaleX' : 'scaleY']: 1, duration: dur, ease: 'none' }, start);
    tl.set(orb, { autoAlpha: 1 }, start);
    tl.to(
      orb,
      { [horizontal ? 'x' : 'y']: () => (horizontal ? track.offsetWidth : track.offsetHeight), duration: dur, ease: 'none' },
      start,
    );
    // Mid-path orbs hand over to the next step; the last one fades out as it lands on the final node.
    if (i !== last) tl.set(orb, { autoAlpha: 0 }, start + dur);
    else tl.to(orb, { autoAlpha: 0, duration: 0.25, ease: 'power1.out' }, start + dur);

    tl.to(
      image,
      { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)', clearProps: 'filter', duration: MOTION.image.duration, ease: MOTION.image.ease },
      Math.max(0, arrive - MOTION.image.lead),
    );
    tl.to(node, { scale: 1, opacity: 1, duration: MOTION.node.duration, ease: MOTION.node.ease }, arrive);
    tl.fromTo(
      ring,
      { scale: 1, opacity: MOTION.ring.from },
      { scale: MOTION.ring.to, opacity: 0, duration: MOTION.ring.duration, ease: 'power2.out', immediateRender: false },
      arrive + MOTION.ring.delay,
    );
    tl.to(card, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', clearProps: 'filter', duration: MOTION.card.duration }, arrive + MOTION.card.delay);
    tl.to(one(step, '[data-jr-title]'), { opacity: 1, y: 0, duration: MOTION.copy.duration }, arrive + MOTION.copy.titleDelay);
    tl.to(one(step, '[data-jr-body]'), { opacity: 1, y: 0, duration: MOTION.copy.duration }, arrive + MOTION.copy.bodyDelay);
    tl.to(one(step, '[data-jr-stub]'), { scaleY: 1, duration: MOTION.stub.duration, ease: 'power2.out' }, arrive + MOTION.stub.delay);
  });

  // Finale: ten sparks burst from the last node ("thriving"), after its own pop has landed.
  const sparks = gsap.utils.toArray<HTMLElement>('[data-jr-spark]', root);
  sparks.forEach((spark, k) => {
    const angle = (k / sparks.length) * Math.PI * 2 - Math.PI / 2;
    const r = MOTION.spark.radius + (k % 2) * MOTION.spark.jitter;
    tl.fromTo(
      spark,
      { x: 0, y: 0, scale: 0.4, autoAlpha: 1 },
      { x: Math.cos(angle) * r, y: Math.sin(angle) * r, scale: 1, autoAlpha: 0, duration: MOTION.spark.duration, ease: 'power2.out', immediateRender: false },
      arrivedLast + MOTION.spark.delay,
    );
  });

  return tl;
}

// Ties the growth path to the reader's scroll: the timeline is scrubbed by a plain ScrollTrigger (never
// pinned, never hijacking the wheel), so scrolling down advances 1 -> last and scrolling up rewinds it.
// Motion is built only when the visitor allows it, so the server HTML and reduced-motion view are simply
// the final state. A breakpoint change rebuilds the timeline on the right axis; the scrub restores the
// current progress, including after a reload with restored scroll.
export function JourneyRailMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ rail: '(min-width: 1280px)', allowed: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
        const { rail, allowed } = ctx.conditions as { rail: boolean; allowed: boolean };
        const root = ref.current;
        if (!allowed || !root) return;

        const tl = build(root, rail ? 'x' : 'y');
        const st = ScrollTrigger.create({
          trigger: root,
          animation: tl,
          start: MOTION.scroll.start,
          end: MOTION.scroll.end,
          scrub: MOTION.scroll.smooth,
        });
        return () => {
          st.kill();
          tl.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
