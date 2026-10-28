'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// Fades a block up once it scrolls into view. The content is visible in the
// server HTML and only hidden after JavaScript confirms IntersectionObserver
// works, so no-JS visitors and crawlers never see a blank section.
export function Reveal({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'pending' | 'shown'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    setState('pending');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown');
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal={state === 'idle' ? undefined : state} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}
