import { describe, it, expect } from 'vitest';
import {
  frameClass,
  normalizedOffset,
  parallaxScale,
  tiltAngles,
  TILT_MAX_DEG,
  PARALLAX_PERCENT,
  SCROLL_LAYER_QUERY,
  TILT_QUERY,
} from '@/components/shared/image-motion';

describe('frameClass', () => {
  it('adds relative when the caller set no position', () => {
    expect(frameClass('h-[200px] w-full', false)).toBe('relative h-[200px] w-full');
  });

  it('does not add relative when the caller already positions the frame', () => {
    expect(frameClass('absolute w-1/2', false)).toBe('absolute w-1/2');
    expect(frameClass('relative h-10 lg:sticky', false)).toBe('relative h-10 lg:sticky');
  });

  it('still adds relative when only a breakpoint-prefixed position is set, so the frame is positioned below that breakpoint too', () => {
    expect(frameClass('lg:sticky h-10', false)).toBe('relative lg:sticky h-10');
    expect(frameClass('md:absolute h-10', false)).toBe('relative md:absolute h-10');
  });

  it('adds overflow-hidden only when the frame must clip', () => {
    expect(frameClass('h-10', true)).toBe('relative overflow-hidden h-10');
    expect(frameClass('h-10', false)).not.toContain('overflow-hidden');
  });

  it('copes with an empty className', () => {
    expect(frameClass('', false)).toBe('relative');
  });
});

describe('normalizedOffset', () => {
  it('maps the near edge to -1, the centre to 0 and the far edge to 1', () => {
    expect(normalizedOffset(100, 100, 200)).toBe(-1);
    expect(normalizedOffset(200, 100, 200)).toBe(0);
    expect(normalizedOffset(300, 100, 200)).toBe(1);
  });

  it('clamps a pointer outside the box', () => {
    expect(normalizedOffset(0, 100, 200)).toBe(-1);
    expect(normalizedOffset(999, 100, 200)).toBe(1);
  });

  it('returns 0 for a zero-size box instead of NaN', () => {
    expect(normalizedOffset(50, 50, 0)).toBe(0);
  });
});

describe('tiltAngles', () => {
  it('turns around Y with horizontal offset and around X (inverted) with vertical offset', () => {
    expect(tiltAngles(1, 0).rotationY).toBeCloseTo(TILT_MAX_DEG);
    expect(tiltAngles(0, 1).rotationX).toBeCloseTo(-TILT_MAX_DEG);
  });

  it('is flat at the centre', () => {
    const { rotationX, rotationY } = tiltAngles(0, 0);
    expect(rotationX).toBeCloseTo(0);
    expect(rotationY).toBeCloseTo(0);
  });

  it('never exceeds the maximum, even for out-of-range input', () => {
    expect(Math.abs(tiltAngles(5, -5).rotationY)).toBeLessThanOrEqual(TILT_MAX_DEG);
    expect(Math.abs(tiltAngles(5, -5).rotationX)).toBeLessThanOrEqual(TILT_MAX_DEG);
  });
});

describe('parallaxScale', () => {
  it('oversizes the image just enough to cover the travel on both sides', () => {
    expect(parallaxScale(PARALLAX_PERCENT)).toBeCloseTo(1.1);
    expect(parallaxScale(0)).toBe(1);
  });
});

describe('media queries', () => {
  it('limits scroll layers to desktop, fine pointer and motion-ok, and tilt to fine pointer and motion-ok', () => {
    expect(SCROLL_LAYER_QUERY).toContain('prefers-reduced-motion: no-preference');
    expect(SCROLL_LAYER_QUERY).toContain('min-width: 1024px');
    expect(SCROLL_LAYER_QUERY).toContain('hover: hover');
    expect(TILT_QUERY).toContain('pointer: fine');
    expect(TILT_QUERY).not.toContain('min-width');
  });
});
