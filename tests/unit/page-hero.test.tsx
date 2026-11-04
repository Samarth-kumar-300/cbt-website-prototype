import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/shared/TextReveal', () => ({
  TextReveal: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

import { PageHero } from '@/components/shared/PageHero';

afterEach(cleanup);

describe('PageHero', () => {
  it('shows the title as the H1 and the subtitle under it', () => {
    render(<PageHero title="Research" subtitle="Peer-reviewed studies." />);
    expect(screen.getByRole('heading', { level: 1, name: 'Research' })).toBeInTheDocument();
    expect(screen.getByText('Peer-reviewed studies.')).toBeInTheDocument();
  });
});
