'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = { children: ReactNode; className?: string };

// Groups siblings so the CSS in globals.css (.reveal-group) staggers their entry. The pending
// state is set only after mount, so the server HTML shows every child. Without
// IntersectionObserver the group is left alone and stays visible.
export function RevealStagger({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'pending' | 'shown'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    setState('pending');
    // A tall group (a long card list on a phone) can never be 15% visible, so cap the threshold at
    // what half the viewport can show; otherwise the cards would stay hidden.
    const threshold = Math.min(0.15, (window.innerHeight * 0.5) / Math.max(el.offsetHeight, 1));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown');
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal-group={state === 'idle' ? undefined : state} className={`reveal-group ${className}`}>
      {children}
    </div>
  );
}
