'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// Draws a soft underline under an accent word once the page has settled. The underline is
// part of the server-rendered style, so it's visible without JavaScript. Reduced-motion
// users keep the static underline.
export function AccentUnderline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(el, { backgroundSize: '0% 0.2em', duration: 0.9, delay: 0.5, ease: 'power2.out' });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      className="bg-no-repeat"
      style={{
        backgroundImage: 'linear-gradient(#e9b8e4, #e9b8e4)',
        backgroundPosition: '0 88%',
        backgroundSize: '100% 0.2em',
      }}
    >
      {children}
    </span>
  );
}
