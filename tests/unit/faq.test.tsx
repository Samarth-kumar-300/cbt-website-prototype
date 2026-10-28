import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Vitest globals are off, so RTL does not auto-unmount; unmount explicitly so
// each test only sees its own rendered buttons.
afterEach(() => cleanup());

const ITEMS = [
  { q: 'First?', a: 'Answer one.' },
  { q: 'Second?', a: 'Answer two.' },
];

describe('FAQ (single mode)', () => {
  it('starts collapsed and toggles with click', async () => {
    vi.resetModules();
    vi.doMock('@/components/shared/faq-config', () => ({ FAQ_MODE: 'single' }));
    const { FAQ } = await import('@/components/shared/FAQ');
    render(<FAQ items={ITEMS} />);
    const q1 = screen.getByRole('button', { name: /First\?/ });
    expect(q1).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(q1);
    expect(q1).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Answer one.')).toBeVisible();
    await userEvent.click(q1);
    expect(q1).toHaveAttribute('aria-expanded', 'false');
  });
  it('closes the other item when a second opens', async () => {
    vi.resetModules();
    vi.doMock('@/components/shared/faq-config', () => ({ FAQ_MODE: 'single' }));
    const { FAQ } = await import('@/components/shared/FAQ');
    render(<FAQ items={ITEMS} />);
    const [q1, q2] = screen.getAllByRole('button');
    await userEvent.click(q1);
    await userEvent.click(q2);
    expect(q1).toHaveAttribute('aria-expanded', 'false');
    expect(q2).toHaveAttribute('aria-expanded', 'true');
  });
  it('is operable with the keyboard (Enter and Space)', async () => {
    vi.resetModules();
    vi.doMock('@/components/shared/faq-config', () => ({ FAQ_MODE: 'single' }));
    const { FAQ } = await import('@/components/shared/FAQ');
    render(<FAQ items={ITEMS} />);
    await userEvent.tab();
    expect(screen.getAllByRole('button')[0]).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('FAQ question colour', () => {
  it('uses the captured live-site question colour token (rgb(32,125,130))', async () => {
    vi.resetModules();
    vi.doMock('@/components/shared/faq-config', () => ({ FAQ_MODE: 'single' }));
    const { FAQ } = await import('@/components/shared/FAQ');
    render(<FAQ items={ITEMS} />);
    const span = screen.getByText('First?');
    expect(span).toHaveClass('text-content-brand');
    expect(span).not.toHaveClass('text-brand-dark');
  });
});

describe('FAQ (multiple mode)', () => {
  it('keeps several items open', async () => {
    vi.resetModules();
    vi.doMock('@/components/shared/faq-config', () => ({ FAQ_MODE: 'multiple' }));
    const { FAQ } = await import('@/components/shared/FAQ');
    render(<FAQ items={ITEMS} />);
    const [q1, q2] = screen.getAllByRole('button');
    await userEvent.click(q1);
    await userEvent.click(q2);
    expect(q1).toHaveAttribute('aria-expanded', 'true');
    expect(q2).toHaveAttribute('aria-expanded', 'true');
  });
});
