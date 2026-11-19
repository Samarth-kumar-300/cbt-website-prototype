import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FaqList } from '@/components/shared/FaqList';
import './freeze-gsap';

const ITEMS = Array.from({ length: 5 }, (_, i) => ({ q: `Question ${i + 1}?`, a: `Answer ${i + 1}.` }));

function mockMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({ matches: reduce && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as unknown as typeof window.matchMedia;
}

beforeEach(() => mockMotion(false));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const cards = (c: HTMLElement) => Array.from(c.querySelectorAll<HTMLElement>('.faq-card'));

describe('FaqList', () => {
  it('shows three questions and offers View all', () => {
    const { container } = render(<FaqList items={ITEMS} icons={[]} />);
    expect(cards(container)).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'View all' })).toBeInTheDocument();
  });

  it('puts every remaining question in the page after View all, and removes the button', async () => {
    const { container } = render(<FaqList items={ITEMS} icons={[]} />);
    await userEvent.click(screen.getByRole('button', { name: 'View all' }));
    expect(cards(container)).toHaveLength(5);
    expect(screen.getByText('Question 5?')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'View all' })).toBeNull();
  });

  it('eases only the new cards in: the first three are left alone', async () => {
    const { container } = render(<FaqList items={ITEMS} icons={[]} />);
    await userEvent.click(screen.getByRole('button', { name: 'View all' }));
    const [a, b, c, d, e] = cards(container);
    [a, b, c].forEach((el) => expect(el.style.opacity).toBe(''));
    [d, e].forEach((el) => {
      expect(el.style.opacity).toBe('0');
      expect(el.style.transition).toBe('none');
    });
  });

  it('adds nothing under reduced motion', async () => {
    mockMotion(true);
    const { container } = render(<FaqList items={ITEMS} icons={[]} />);
    await userEvent.click(screen.getByRole('button', { name: 'View all' }));
    cards(container).forEach((el) => {
      expect(el.style.opacity).toBe('');
      expect(el.style.transition).toBe('');
    });
  });
});
