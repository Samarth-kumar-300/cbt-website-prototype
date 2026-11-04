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
});
