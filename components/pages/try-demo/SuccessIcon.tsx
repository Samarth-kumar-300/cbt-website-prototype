import gsap from 'gsap';
import { reducedMotion } from '@/components/shared/motion';

/**
 * The success moment, played only when the flow moves to a new step (never on first paint): the ring pops,
 * the inner circle pops a beat later, then the check draws itself. Enter-only; every tween clears its inline
 * styles, so the icon ends exactly as the markup renders it. Does nothing under reduced motion.
 */
export function popSuccessIcon(root: ParentNode | null) {
  const ring = root?.querySelector<HTMLElement>('[data-success-icon]');
  if (!ring || reducedMotion()) return;
  const inner = ring.firstElementChild as HTMLElement | null;
  const path = ring.querySelector<SVGPathElement>('path');
  gsap.killTweensOf([ring, inner, path]);
  gsap.from(ring, { scale: 0.6, opacity: 0, duration: 0.55, ease: 'back.out(1.8)', delay: 0.15, clearProps: 'transform,opacity' });
  if (inner) gsap.from(inner, { scale: 0.6, duration: 0.5, ease: 'back.out(2)', delay: 0.3, clearProps: 'transform' });
  // jsdom has no getTotalLength. The gap is twice the length and the offset starts a hair past it, so the round cap leaves no dot at either end.
  if (path && typeof path.getTotalLength === 'function') {
    const len = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: `${len} ${len * 2}`, strokeDashoffset: len + 0.5 }, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out', delay: 0.5, clearProps: 'strokeDasharray,strokeDashoffset' });
  }
}

// Featured check icon: a check in a tinted circle with a lighter ring around it.
export function SuccessIcon() {
  return (
    <span aria-hidden="true" data-success-icon className="flex size-[72px] items-center justify-center rounded-full bg-[#eef9f9] lg:size-20">
      <span className="flex size-[52px] items-center justify-center rounded-full bg-[#d6ece7] lg:size-[58px]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#207d82" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
    </span>
  );
}
