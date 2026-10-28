'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { children: ReactNode; className?: string; style?: CSSProperties };

// A panel whose gradient drifts gently while it crosses the screen. The gradient is 160% wide
// so there is room to move. Under reduced motion, and without JavaScript, it stays put.
export function ScrollGradient({ children, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el,
          { backgroundPosition: '0% 50%' },
          {
            backgroundPosition: '100% 50%',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      data-scroll-gradient
      className={className}
      style={{ backgroundSize: '160% 100%', backgroundPosition: '0% 50%', ...style }}
    >
      {children}
    </div>
  );
}
