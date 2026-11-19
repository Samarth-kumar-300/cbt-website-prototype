import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestimonialCarousel } from '@/components/shared/TestimonialCarousel';
import './freeze-gsap';

const slides = ['One', 'Two', 'Three'].map((t) => <p key={t}>{t}</p>);

function mockMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({ matches: reduce && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as unknown as typeof window.matchMedia;
}

beforeEach(() => mockMotion(false));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('TestimonialCarousel dots', () => {
  it('keeps one tab per slide with the first selected and a label each', () => {
    render(<TestimonialCarousel slides={slides} />);
    const dots = screen.getAllByRole('tab');
    expect(dots.map((d) => d.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    expect(dots.map((d) => d.getAttribute('aria-label'))).toEqual(['Go to testimonial 1', 'Go to testimonial 2', 'Go to testimonial 3']);
  });

  it('has a hidden pill that is not a tab, and the active dot keeps its own colour until measured', () => {
    const { container } = render(<TestimonialCarousel slides={slides} />);
    expect(container.querySelector('[data-dot-thumb]')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    const [first, second] = screen.getAllByRole('tab');
    expect(first.className).toContain('bg-brand-teal');
    expect(first.className).toContain('[[data-liquid=ready]_&]:bg-carousel-dot-inactive');
    expect(second.className).not.toContain('bg-brand-teal');
    expect(screen.getByRole('tablist')).not.toHaveAttribute('data-liquid');
  });

  it('scrolls smoothly on a tap, and jumps at once under reduced motion', () => {
    const scrollTo = vi.fn();
    const { container, rerender } = render(<TestimonialCarousel slides={slides} />);
    const track = container.querySelector('[aria-roledescription="carousel"]') as HTMLElement;
    track.scrollTo = scrollTo as unknown as typeof track.scrollTo;
    fireEvent.click(screen.getByRole('tab', { name: 'Go to testimonial 2' }));
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'smooth' }));
    mockMotion(true);
    rerender(<TestimonialCarousel slides={slides} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Go to testimonial 3' }));
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'auto' }));
  });
});
