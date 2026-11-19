import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TestimonialsGrid } from '@/components/pages/testimonials/TestimonialsGrid';
import type { Testimonial } from '@/lib/testimonials';
import './freeze-gsap';

afterEach(cleanup);

const q = (id: string, audience: Testimonial['audience'], text: string): Testimonial => ({ id, name: `Name ${id}`, role: 'Role', audience, avatar: 'tejaswi', color: '#000', text });
const QUOTES = [q('a', 'parent', 'Short one.'), q('b', 'parent', 'x'.repeat(200)), q('c', 'therapist', 'A therapist quote.')];

describe('TestimonialsGrid', () => {
  it('shows every quote under All and filters by chip', async () => {
    render(<TestimonialsGrid quotes={QUOTES} />);
    expect(screen.getAllByRole('figure')).toHaveLength(3);
    await userEvent.click(screen.getByRole('tab', { name: 'Therapists' }));
    expect(screen.getAllByRole('figure')).toHaveLength(1);
    expect(screen.getByText('A therapist quote.')).toBeInTheDocument();
  });
  it('offers Read more only on long quotes and toggles it', async () => {
    render(<TestimonialsGrid quotes={QUOTES} />);
    const more = screen.getAllByRole('button', { name: 'Read more' });
    expect(more).toHaveLength(1);
    await userEvent.click(more[0]);
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('TestimonialsGrid read more', () => {
  const clamped = () => screen.getAllByRole('figure').find((f) => f.querySelector('button'))!.querySelector('blockquote')!;

  function mockMotion(reduce: boolean) {
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({ matches: reduce && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as unknown as typeof window.matchMedia;
  }

  it('lifts the clamp at once on Read more, and keeps aria-expanded and the text in step', async () => {
    mockMotion(false);
    render(<TestimonialsGrid quotes={QUOTES} />);
    expect(clamped().className).toContain('line-clamp-4');
    const more = screen.getByRole('button', { name: 'Read more' });
    expect(more).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(more);
    expect(clamped().className).not.toContain('line-clamp-4');
    const less = screen.getByRole('button', { name: 'Show less' });
    expect(less).toHaveAttribute('aria-expanded', 'true');
    // The block is clipped while it eases, so the new lines do not spill over the button.
    expect(clamped().style.overflow).toBe('hidden');
  });

  it('snaps open and shut under reduced motion, with the clamp back on Show less', async () => {
    mockMotion(true);
    render(<TestimonialsGrid quotes={QUOTES} />);
    await userEvent.click(screen.getByRole('button', { name: 'Read more' }));
    expect(clamped().className).not.toContain('line-clamp-4');
    expect(clamped().style.overflow).toBe('');
    await userEvent.click(screen.getByRole('button', { name: 'Show less' }));
    expect(clamped().className).toContain('line-clamp-4');
    expect(screen.getByRole('button', { name: 'Read more' })).toHaveAttribute('aria-expanded', 'false');
  });
});
