import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SCROLL_LAYER_QUERY,
  TOUCH_SCROLL_LAYER_QUERY, TILT_QUERY, MOTION_OK } from '@/components/shared/image-motion';

const mm = vi.hoisted(() => ({ queries: [] as string[], reverts: 0 }));

vi.mock('gsap', () => {
  const gsap = {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    fromTo: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    matchMedia: () => ({
      add: (query: string) => {
        mm.queries.push(query);
      },
      revert: () => {
        mm.reverts += 1;
      },
    }),
  };
  return { default: gsap };
});
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
vi.mock('@gsap/react', async () => {
  const { useEffect } = await import('react');
  return {
    useGSAP: (fn: () => (() => void) | void) =>
      useEffect(() => {
        const cleanup = fn();
        return typeof cleanup === 'function' ? cleanup : undefined;
      }, []),
  };
});

import { MotionImage } from '@/components/shared/MotionImage';

beforeEach(() => {
  mm.queries.length = 0;
  mm.reverts = 0;
});

describe('MotionImage', () => {
  it('renders its children visibly with no inline hiding styles', () => {
    render(
      <MotionImage className="h-10 w-10">
        <img alt="art" src="/x.webp" />
      </MotionImage>,
    );
    const img = screen.getByAltText('art');
    expect(img).toBeInTheDocument();
    const frame = img.closest('[data-mi-enter]') as HTMLElement;
    expect(frame.getAttribute('style')).toBeNull();
    expect(frame.querySelector('[data-mi-part="enter"]')?.getAttribute('style')).toBeNull();
    expect(frame.querySelector('[data-mi-part="layer"]')?.getAttribute('style')).toBeNull();
  });

  it('defaults to a rise enter and no layer', () => {
    render(<MotionImage><span>x</span></MotionImage>);
    const frame = screen.getByText('x').closest('[data-mi-enter]')!;
    expect(frame.getAttribute('data-mi-enter')).toBe('rise');
    expect(frame.getAttribute('data-mi-layer')).toBe('none');
  });

  it('registers only a motion-ok query for a plain rise', () => {
    render(<MotionImage><span>x</span></MotionImage>);
    expect(mm.queries).toEqual([MOTION_OK]);
  });

  it('registers no query at all for enter none and layer none', () => {
    render(<MotionImage enter="none"><span>x</span></MotionImage>);
    expect(mm.queries).toEqual([]);
  });

  it('gates drift and parallax on desktop+fine pointer and, separately, on touch/narrow screens', () => {
    render(<MotionImage layer="drift"><span>a</span></MotionImage>);
    expect(mm.queries).toContain(SCROLL_LAYER_QUERY);
    mm.queries.length = 0;
    render(<MotionImage layer="parallax" enter="none"><span>b</span></MotionImage>);
    expect(mm.queries).toEqual([SCROLL_LAYER_QUERY, TOUCH_SCROLL_LAYER_QUERY]);
  });

  it('gates tilt on a fine pointer, not on width', () => {
    render(<MotionImage enter="none" layer="tilt"><span>x</span></MotionImage>);
    expect(mm.queries).toEqual([TILT_QUERY]);
  });

  it('clips the frame for curtain and parallax, but not for rise', () => {
    const { rerender } = render(<MotionImage enter="curtain"><span>x</span></MotionImage>);
    expect(screen.getByText('x').closest('[data-mi-enter]')!.className).toContain('overflow-hidden');
    rerender(<MotionImage enter="none" layer="parallax"><span>x</span></MotionImage>);
    expect(screen.getByText('x').closest('[data-mi-enter]')!.className).toContain('overflow-hidden');
    rerender(<MotionImage enter="rise"><span>x</span></MotionImage>);
    expect(screen.getByText('x').closest('[data-mi-enter]')!.className).not.toContain('overflow-hidden');
  });

  it('keeps an absolute frame absolute and passes style through', () => {
    render(
      <MotionImage className="absolute" style={{ left: '10%', aspectRatio: '766 / 538' }}>
        <span>x</span>
      </MotionImage>,
    );
    const frame = screen.getByText('x').closest('[data-mi-enter]') as HTMLElement;
    expect(frame.className).not.toContain('relative');
    expect(frame.style.left).toBe('10%');
  });

  it('reverts its GSAP context on unmount and survives a re-mount', () => {
    const { unmount } = render(<MotionImage><span>x</span></MotionImage>);
    unmount();
    expect(mm.reverts).toBe(1);
    render(<MotionImage><span>y</span></MotionImage>);
    expect(screen.getByText('y')).toBeInTheDocument();
  });
});
