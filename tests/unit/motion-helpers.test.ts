import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clampToggle, edgesOf, expandIn, isMouse, reducedMotion, setThumb, staggerIn } from '@/components/shared/motion';

function mockMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({ matches: reduce && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as unknown as typeof window.matchMedia;
}

beforeEach(() => mockMotion(false));
afterEach(() => vi.restoreAllMocks());

describe('motion helpers', () => {
  it('reads prefers-reduced-motion', () => {
    expect(reducedMotion()).toBe(false);
    mockMotion(true);
    expect(reducedMotion()).toBe(true);
  });

  it('treats only a real mouse as hover-capable', () => {
    expect(isMouse({ pointerType: 'mouse' })).toBe(true);
    expect(isMouse({ pointerType: 'touch' })).toBe(false);
    expect(isMouse({ pointerType: 'pen' })).toBe(false);
  });

  it('returns no edges when the track has no layout (hidden or jsdom)', () => {
    const track = document.createElement('div');
    const item = document.createElement('button');
    track.appendChild(item);
    expect(edgesOf(track, item)).toBeNull();
    expect(edgesOf(track, null)).toBeNull();
  });

  it('sets the thumb edges for the chosen axis only', () => {
    const thumb = document.createElement('span');
    setThumb(thumb, { left: 10, right: 20, top: 3, bottom: 4 }, 'x');
    expect(thumb.style.left).toBe('10px');
    expect(thumb.style.right).toBe('20px');
    expect(thumb.style.top).toBe('');
    const rail = document.createElement('span');
    setThumb(rail, { left: 10, right: 20, top: 3, bottom: 4 }, 'y');
    expect(rail.style.top).toBe('3px');
    expect(rail.style.left).toBe('');
    const both = document.createElement('span');
    setThumb(both, { left: 1, right: 2, top: 3, bottom: 4 }, 'both');
    expect([both.style.left, both.style.right, both.style.top, both.style.bottom]).toEqual(['1px', '2px', '3px', '4px']);
  });

  it('does nothing on entrances under reduced motion, and tolerates missing elements', () => {
    mockMotion(true);
    const el = document.createElement('div');
    expandIn(el);
    expect(el.style.overflow).toBe('');
    expect(() => expandIn(null)).not.toThrow();
    expect(() => staggerIn(null)).not.toThrow();
    expect(() => staggerIn([])).not.toThrow();
  });

  it('lands on the final clamp state straight away under reduced motion', () => {
    mockMotion(true);
    const p = document.createElement('p');
    p.className = 'line-clamp-4';
    const done = vi.fn();
    clampToggle(p, ['line-clamp-4'], true, done);
    expect(p.classList.contains('line-clamp-4')).toBe(false);
    clampToggle(p, ['line-clamp-4'], false, done);
    expect(p.classList.contains('line-clamp-4')).toBe(true);
    expect(done).toHaveBeenCalledTimes(2);
  });
});
