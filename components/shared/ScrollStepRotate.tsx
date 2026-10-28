'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { stepTrigger, prefersReducedMotion, stepFor } from './scroll-steps';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Rotates its child in fixed steps as the enclosing section scrolls through. The scroll position
// picks the step (0 to steps-1); the rotation only ever lands on whole multiples of `stepAngle`
// and eases between them. Scrolling back reverses it. The page's own scroll is never touched.
export function ScrollStepRotate({
  steps,
  stepAngle,
  children,
  className = '',
}: {
  steps: number;
  stepAngle: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const section = el?.closest('section');
      if (!el || !section) return;

      const duration = prefersReducedMotion() ? 0 : 0.7;
      let current = 0;

      ScrollTrigger.create({
        trigger: section,
        ...stepTrigger(),
        // Set the starting angle without animating, so a page loaded mid-section doesn't spin in.
        onRefresh: (self) => {
          current = stepFor(self.progress, steps);
          gsap.set(el, { rotation: current * stepAngle });
        },
        onUpdate: (self) => {
          const next = stepFor(self.progress, steps);
          if (next === current) return;
          current = next;
          gsap.to(el, {
            rotation: next * stepAngle,
            duration,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
