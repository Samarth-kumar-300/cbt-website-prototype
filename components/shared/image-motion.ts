// Tuning numbers, media queries and pure helpers for MotionImage. No React and no GSAP here, so
// "how subtle is it" is a one-file change and the maths is unit-testable.

export type Enter = 'rise' | 'curtain' | 'none';
export type Layer = 'drift' | 'parallax' | 'tilt' | 'none';

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const DESKTOP = '(min-width: 1024px)';
export const POINTER_FINE = '(hover: hover) and (pointer: fine)';
// Scroll-linked layers need a mouse-class device at desktop width. Tilt needs only a fine pointer.
export const SCROLL_LAYER_QUERY = `${MOTION_OK} and ${DESKTOP} and ${POINTER_FINE}`;
// Phones and tablets: scroll-linked layers only, gentler than desktop. There is no pointer to tilt toward.
export const TOUCH_SCROLL_LAYER_QUERY = `${MOTION_OK} and ((max-width: 1023px) or ((hover: none) and (pointer: coarse)))`;
export const TOUCH_DRIFT_PERCENT = 2.5;
export const TOUCH_PARALLAX_PERCENT = 3;
export const TILT_QUERY = `${MOTION_OK} and ${POINTER_FINE}`;

// Transparent illustrations ease up and in. They never use a rectangular clip.
export const RISE = {
  from: { y: 24, opacity: 0, scale: 0.97 },
  to: { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
} as const;

// Photos open top to bottom while the image settles from a slight zoom.
export const CURTAIN = {
  frameFrom: { clipPath: 'inset(0% 0% 100% 0%)' },
  frameTo: { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.out' },
  innerFrom: { scale: 1.12 },
  innerTo: { scale: 1, duration: 1.1, ease: 'power3.out' },
} as const;

export const DRIFT_PERCENT = 4; // whole illustration shifts +-4% of its height across the scroll
export const PARALLAX_PERCENT = 5; // photo shifts +-5% inside its frame
export const TILT_MAX_DEG = 3;

const HAS_POSITION = /(^|\s)(relative|absolute|fixed|sticky)(\s|$)/;

// The frame must be a positioned box for the layers inside it. Add `relative` only when the caller
// has not already positioned it (an `absolute` or `sticky` frame must keep that position). Only a base
// (unprefixed) position counts: `lg:sticky` alone leaves the frame static below `lg`, so it still gets `relative`.
export function frameClass(className: string, clips: boolean) {
  const parts: string[] = [];
  if (!HAS_POSITION.test(className)) parts.push('relative');
  if (clips) parts.push('overflow-hidden');
  if (className) parts.push(className);
  return parts.join(' ');
}

// Pointer position inside a box as -1 (near edge) to 1 (far edge). A zero-size box gives 0.
export function normalizedOffset(pos: number, start: number, size: number) {
  if (size <= 0) return 0;
  return Math.max(-1, Math.min(1, ((pos - start) / size) * 2 - 1));
}

export function tiltAngles(nx: number, ny: number, max = TILT_MAX_DEG) {
  const cx = Math.max(-1, Math.min(1, nx));
  const cy = Math.max(-1, Math.min(1, ny));
  return { rotationX: -cy * max, rotationY: cx * max };
}

// Scale that leaves `percent` of the image spare on each side, so a +-percent shift never exposes an edge.
export function parallaxScale(percent: number) {
  return 1 + (2 * percent) / 100;
}
