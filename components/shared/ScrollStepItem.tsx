'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { stepTrigger, prefersReducedMotion, stepFor } from './scroll-steps';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HIDDEN = { y: 16, opacity: 0.35 };
const SHOWN = { y: 0, opacity: 1 };

// Brings an item up once the scroll reaches its step, and keeps it up after that. Scrolling back
// drops it again. The outer element is left to the parent's reveal styles; this animates the inner one.
export function ScrollStepItem({
  index,
  steps,
  children,
  className = '',
}: {
  index: number;
  steps: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const section = el?.closest('section');
      if (!el || !section) return;

      const duration = prefersReducedMotion() ? 0 : 0.6;
      let up: boolean | null = null;

      ScrollTrigger.create({
        trigger: section,
        ...stepTrigger(),
        onRefresh: (self) => {
          up = stepFor(self.progress, steps) >= index;
          gsap.set(el, up ? SHOWN : HIDDEN);
        },
        onUpdate: (self) => {
          const next = stepFor(self.progress, steps) >= index;
          if (next === up) return;
          up = next;
          gsap.to(el, { ...(next ? SHOWN : HIDDEN), duration, ease: 'power2.out', overwrite: 'auto' });
        },
      });
    },
    { scope: ref },
  );

  return (
    <div className={className}>
      <div ref={ref}>{children}</div>
    </div>
  );
}
