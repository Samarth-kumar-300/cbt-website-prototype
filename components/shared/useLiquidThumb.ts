'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { edgesOf, moveThumb, reducedMotion, setThumb } from './motion';

// The liquid slide for switches, chips, dots and rails. A rigid translate moves the whole pill at one speed,
// which reads as a mechanical slider. Here the two edges move on their own clocks: the leading edge shoots
// ahead, the trailing edge follows a beat later, so the pill stretches across the gap and then settles into
// the new item. On a horizontal move a small vertical squash gives it weight.
//
// GSAP owns left, right (and top, bottom for the y and both axes) and scaleY on the thumb after mount. The
// thumb's React style must stay constant (freeze it to the first value) so React never fights the tweens.
// The thumb is absolutely positioned and isolated, so animating its edges does not reflow anything else.
//
// Options:
//   axis  'x' (default): left and right only. 'y': top and bottom only (vertical rails). 'both': all four,
//         for chips that wrap onto several rows.
//   squash  Vertical squash on horizontal moves. Default true. Turn off for very small thumbs (dots).
//   inkRef  A container whose children are white copies of each item's label, in item order. Each child is
//         placed over its item and the container is clipped to the thumb every frame, so a label turns
//         white exactly where the pill is under it. Use it when label colour alone would be unreadable
//         mid-move (teal text on a teal pill).
//
// After the first measurement the track gets data-liquid="ready", so CSS can hand the first-paint fill
// (what the server rendered) over to the thumb without a flash.

type Options = { axis?: 'x' | 'y' | 'both'; squash?: boolean; inkRef?: RefObject<HTMLElement | null> };

export function useLiquidThumb(
  trackRef: RefObject<HTMLElement | null>,
  thumbRef: RefObject<HTMLElement | null>,
  itemRefs: RefObject<(HTMLElement | null)[]>,
  activeIndex: number,
  options: Options = {},
) {
  const { axis = 'x', squash = true, inkRef } = options;
  const latest = useRef(activeIndex);
  const previous = useRef(activeIndex);

  // Clip the white label layer to the thumb's current shape (including the squash).
  const syncInk = (track: HTMLElement, thumb: HTMLElement) => {
    const ink = inkRef?.current;
    if (!ink) return;
    const g = (p: string) => Number(gsap.getProperty(thumb, p));
    const sy = g('scaleY') || 1;
    const h = track.clientHeight - g('top') - g('bottom');
    const d = (h * (1 - sy)) / 2;
    ink.style.clipPath = `inset(${g('top') + d}px ${g('right')}px ${g('bottom') + d}px ${g('left')}px round ${(h * sy) / 2}px)`;
  };

  const placeInk = () => {
    const ink = inkRef?.current;
    if (!ink) return;
    Array.from(ink.children).forEach((child, i) => {
      const item = itemRefs.current?.[i];
      if (!item) return;
      Object.assign((child as HTMLElement).style, { left: `${item.offsetLeft}px`, top: `${item.offsetTop}px`, width: `${item.offsetWidth}px`, height: `${item.offsetHeight}px` });
    });
  };

  // Snap to the active item whenever the track is measured or resized. This also covers a control that
  // was first rendered inside a hidden panel and has no layout until it is shown.
  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb || typeof ResizeObserver === 'undefined') return;
    const snap = () => {
      const edges = edgesOf(track, itemRefs.current?.[latest.current]);
      if (!edges) return;
      setThumb(thumb, edges, axis);
      placeInk();
      syncInk(track, thumb);
      track.dataset.liquid = 'ready';
    };
    const ro = new ResizeObserver(snap);
    ro.observe(track);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackRef, thumbRef, itemRefs, axis]);

  useEffect(() => {
    latest.current = activeIndex;
    if (previous.current === activeIndex) return;
    previous.current = activeIndex;

    const track = trackRef.current;
    const thumb = thumbRef.current;
    const target = track && edgesOf(track, itemRefs.current?.[activeIndex]);
    if (!track || !thumb || !target) return;

    if (reducedMotion()) {
      setThumb(thumb, target, axis);
      syncInk(track, thumb);
      return;
    }
    placeInk();
    moveThumb(thumb, target, { axis, squash, onUpdate: inkRef ? () => syncInk(track, thumb) : undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, trackRef, thumbRef, itemRefs, axis, squash]);

  // Stop any tween still running if the control unmounts.
  useEffect(() => {
    const thumb = thumbRef;
    return () => {
      if (thumb.current) gsap.killTweensOf(thumb.current);
    };
  }, [thumbRef]);
}
