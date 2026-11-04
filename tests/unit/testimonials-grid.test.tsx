import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { TestimonialsGrid } from '@/components/pages/testimonials/TestimonialsGrid';
import type { Testimonial } from '@/lib/testimonials';

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
