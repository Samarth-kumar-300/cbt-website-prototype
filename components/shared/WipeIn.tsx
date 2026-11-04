'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MOTION_OK } from './image-motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

// Wipes its content in from the left, once, as it scrolls into view. Used for filled shapes, where
// a stroke draw-on would show nothing. Server HTML shows everything; reduced motion skips the wipe.
export function WipeIn({ children, className = '', style }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const f = frame.current;
      if (!f) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          f,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: f, start: 'top 90%', once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={className} style={style}>
      {children}
    </div>
  );
}
