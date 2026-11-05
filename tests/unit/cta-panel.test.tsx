import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/shared/TextReveal', () => ({
  TextReveal: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

import { CtaPanel } from '@/components/shared/CtaPanel';

afterEach(cleanup);

describe('CtaPanel', () => {
  it('shows the heading and a link to the target', () => {
    render(<CtaPanel heading="Not sure which fits?" label="Book a demo" href="/try-demo" />);
    expect(screen.getByRole('heading', { name: 'Not sure which fits?' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /book a demo/i })).toHaveAttribute('href', '/try-demo');
  });
  it('shows a supporting line when given one, and no empty paragraph when not', () => {
    const { container, rerender } = render(<CtaPanel heading="Heading" label="Go" href="/x" />);
    expect(container.querySelector('p')).toBeNull();
    rerender(<CtaPanel heading="Heading" body="What happens next." label="Go" href="/x" />);
    expect(screen.getByText('What happens next.')).toBeInTheDocument();
  });
});
