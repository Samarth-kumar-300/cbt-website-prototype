import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { QuoteCard } from '@/components/shared/QuoteCard';
import { QuoteRow } from '@/components/shared/QuoteRow';
import { TESTIMONIALS } from '@/lib/testimonials';

afterEach(cleanup);

describe('QuoteCard', () => {
  it('shows the quote, name, role and avatar', () => {
    const q = TESTIMONIALS[2];
    const { container } = render(<QuoteCard quote={q} />);
    expect(screen.getByText(q.text)).toBeInTheDocument();
    expect(screen.getByText(q.name)).toBeInTheDocument();
    expect(screen.getByText(q.role)).toBeInTheDocument();
    const img = container.querySelector('img')!;
    expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain('/images/homepage/avatars/chandrashekhar.webp');
    expect(img).toHaveAttribute('alt', '');
  });
  it('clamps the text with CSS only, so the full quote stays in the page', () => {
    const q = TESTIMONIALS[0];
    render(<QuoteCard quote={q} clamp />);
    const block = screen.getByText(q.text);
    expect(block.className).toContain('line-clamp-6');
    expect(block.textContent).toBe(q.text);
  });
});

describe('QuoteRow', () => {
  it('renders one card per quote', () => {
    render(<QuoteRow quotes={TESTIMONIALS.slice(0, 3)} />);
    expect(screen.getAllByRole('figure')).toHaveLength(3);
  });
});
