'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

// Shared helpers for the liquid motion language. Every helper is safe to call on the server, in jsdom and
// under prefers-reduced-motion: it either does nothing or jumps straight to the end state.

export const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function reducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True for a real mouse or trackpad. Touch and pen skip hover-only effects. */
export function isMouse(e: { pointerType?: string }): boolean {
  return e.pointerType === 'mouse';
}

// ---------------------------------------------------------------- liquid thumb

// The leading edge shoots ahead; the trailing edge follows a beat later, so the pill stretches across the
// gap and settles. Same numbers the approved gallery used.
export const LEAD = { duration: 0.42, ease: 'power4.out' } as const;
export const TRAIL = { duration: 0.62, delay: 0.05, ease: 'power4.out' } as const;

export type Edges = { left: number; right: number; top: number; bottom: number };

/** Edges of `item` as insets inside `track` (which must be the item's offsetParent, i.e. position: relative). */
export function edgesOf(track: HTMLElement, item: HTMLElement | null | undefined): Edges | null {
  if (!item || track.clientWidth === 0) return null;
  return {
    left: item.offsetLeft,
    right: track.clientWidth - item.offsetLeft - item.offsetWidth,
    top: item.offsetTop,
    bottom: track.clientHeight - item.offsetTop - item.offsetHeight,
  };
}

type Axis = 'x' | 'y' | 'both';

export function setThumb(thumb: HTMLElement, t: Edges, axis: Axis) {
  const vars: gsap.TweenVars = { scaleY: 1 };
  if (axis !== 'y') Object.assign(vars, { left: t.left, right: t.right });
  if (axis !== 'x') Object.assign(vars, { top: t.top, bottom: t.bottom });
  gsap.killTweensOf(thumb, 'left,right,top,bottom,scaleY');
  gsap.set(thumb, vars);
}

/** Tween the thumb's edges to `t`, leading edge first. Retargets from wherever the thumb is right now. */
export function moveThumb(thumb: HTMLElement, t: Edges, o: { axis?: Axis; squash?: boolean; onUpdate?: () => void } = {}) {
  const axis = o.axis ?? 'x';
  const g = (p: string) => Number(gsap.getProperty(thumb, p));
  const cur = { left: g('left'), right: g('right'), top: g('top'), bottom: g('bottom') };
  const dx = axis !== 'y' && (Math.abs(t.left - cur.left) > 1 || Math.abs(t.right - cur.right) > 1);
  const dy = axis !== 'x' && (Math.abs(t.top - cur.top) > 1 || Math.abs(t.bottom - cur.bottom) > 1);
  // Kill the previous move outright. A trail tween still waiting out its delay is skipped by overwrite:'auto',
  // then starts later and wins the shared edge, leaving the pill at the wrong spot after a quick reversal.
  gsap.killTweensOf(thumb, 'left,right,top,bottom');
  const lead = { ...LEAD, overwrite: 'auto' as const, onUpdate: o.onUpdate };
  const trail = { ...TRAIL, overwrite: 'auto' as const, onUpdate: o.onUpdate };
  if (dx) {
    const r = t.left > cur.left;
    gsap.to(thumb, { [r ? 'right' : 'left']: t[r ? 'right' : 'left'], ...lead });
    gsap.to(thumb, { [r ? 'left' : 'right']: t[r ? 'left' : 'right'], ...trail });
  }
  if (dy) {
    const d = t.top > cur.top;
    gsap.to(thumb, { [d ? 'bottom' : 'top']: t[d ? 'bottom' : 'top'], ...lead });
    gsap.to(thumb, { [d ? 'top' : 'bottom']: t[d ? 'top' : 'bottom'], ...trail });
  }
  // The squash only reads well on a pure horizontal move.
  if (o.squash && dx && !dy) {
    gsap.killTweensOf(thumb, 'scaleY');
    gsap
      .timeline()
      .to(thumb, { scaleY: 0.92, duration: 0.14, ease: 'power2.out', onUpdate: o.onUpdate })
      .to(thumb, { scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.55)', onUpdate: o.onUpdate });
  }
}

// ---------------------------------------------------------------- hover highlight

/**
 * One highlight that slides between rows as the mouse (or keyboard focus) moves. The thumb must be an
 * absolutely positioned, aria-hidden element inside `boxRef` (a position: relative box), and rows must sit
 * above it (relative, z-10). Hidden until the first row is shown, and again on hide().
 */
export function useRowHighlight(boxRef: RefObject<HTMLElement | null>, thumbRef: RefObject<HTMLElement | null>) {
  const shown = useRef(false);

  const show = useCallback(
    (row: HTMLElement | null) => {
      const box = boxRef.current;
      const thumb = thumbRef.current;
      const t = box && edgesOf(box, row);
      if (!box || !thumb || !t) return;
      if (!shown.current || reducedMotion()) {
        setThumb(thumb, t, 'both');
        gsap.to(thumb, { opacity: 1, duration: reducedMotion() ? 0 : 0.15, overwrite: 'auto' });
        shown.current = true;
      } else {
        moveThumb(thumb, t, { axis: 'both' });
      }
    },
    [boxRef, thumbRef],
  );

  const hide = useCallback(() => {
    const thumb = thumbRef.current;
    shown.current = false;
    if (thumb) gsap.to(thumb, { opacity: 0, duration: reducedMotion() ? 0 : 0.2, overwrite: 'auto' });
  }, [thumbRef]);

  useEffect(() => {
    const thumb = thumbRef.current;
    return () => {
      if (thumb) gsap.killTweensOf(thumb);
    };
  }, [thumbRef]);

  return { show, hide };
}

// ---------------------------------------------------------------- entrances

/** Ease an element that just mounted open from height 0. Enter-only: unmounting stays instant. */
export function expandIn(el: HTMLElement | null, o: { duration?: number } = {}) {
  if (!el || reducedMotion()) return;
  gsap.killTweensOf(el);
  el.style.overflow = 'hidden';
  gsap.fromTo(
    el,
    { height: 0, opacity: 0 },
    { height: 'auto', opacity: 1, duration: o.duration ?? 0.38, ease: 'power3.out', onComplete: () => gsap.set(el, { clearProps: 'height,overflow,opacity' }) },
  );
}

/** Rise-and-fade a set of children in, one after the other. */
export function staggerIn(els: Element[] | NodeListOf<Element> | null, o: { y?: number; x?: number; stagger?: number; delay?: number; duration?: number } = {}) {
  if (!els || reducedMotion()) return;
  const list = Array.from(els);
  if (!list.length) return;
  // Returns the tween so a caller can kill the whole stagger with one .kill() when it closes mid-reveal.
  return gsap.from(list, { y: o.y ?? 12, x: o.x ?? 0, opacity: 0, duration: o.duration ?? 0.4, ease: 'power3.out', stagger: o.stagger ?? 0.05, delay: o.delay ?? 0.05, clearProps: 'transform,opacity' });
}

/**
 * Swap a line-clamped block between clamped and open with a height ease. `clampClass` is the class (for
 * example line-clamp-4) that is present while collapsed. Call it right before React toggles the state, or
 * instead of toggling the class yourself: it sets the final class state when the tween ends.
 */
export function clampToggle(textEl: HTMLElement | null, clampClass: string[], expanded: boolean, onDone?: () => void) {
  if (!textEl) return;
  if (reducedMotion()) {
    textEl.classList.toggle(clampClass[0], !expanded);
    clampClass.slice(1).forEach((c) => textEl.classList.toggle(c, !expanded));
    onDone?.();
    return;
  }
  gsap.killTweensOf(textEl);
  const apply = (collapsed: boolean) => clampClass.forEach((c) => textEl.classList.toggle(c, collapsed));
  if (expanded) {
    const h0 = textEl.offsetHeight;
    apply(false);
    const h1 = textEl.offsetHeight;
    gsap.fromTo(textEl, { height: h0 }, { height: h1, duration: 0.45, ease: 'power3.out', clearProps: 'height', onComplete: onDone });
  } else {
    const h1 = textEl.offsetHeight;
    apply(true);
    const h0 = textEl.offsetHeight;
    apply(false);
    textEl.style.overflow = 'hidden';
    gsap.fromTo(textEl, { height: h1 }, { height: h0, duration: 0.4, ease: 'power3.out', onComplete: () => { apply(true); gsap.set(textEl, { clearProps: 'height,overflow' }); onDone?.(); } });
  }
}
