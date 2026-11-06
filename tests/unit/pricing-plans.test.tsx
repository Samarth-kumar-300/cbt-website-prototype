import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/shared/TextReveal', () => ({
  TextReveal: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

import { audiences } from '@/components/pages/pricing/content';
import { PlanGrid } from '@/components/pages/pricing/sections/Plans';

describe('PlanGrid', () => {
  it('renders the two centre plans as labelled articles', () => {
    render(<PlanGrid plans={audiences['therapy-centres'].plans} />);
    expect(screen.getAllByRole('article').map((a) => a.getAttribute('aria-labelledby'))).toEqual(['plan-therapy-centres-basic', 'plan-therapy-centres-custom']);
    expect(screen.getByRole('article', { name: 'Basic' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Custom' })).toBeInTheDocument();
  });
  it('shows price, user limit and taxes on Basic only', () => {
    render(<PlanGrid plans={audiences['therapy-centres'].plans} />);
    const basic = within(screen.getByRole('article', { name: 'Basic' }));
    expect(basic.getByText('₹2,000')).toBeInTheDocument();
    expect(basic.getByText('/user/month')).toBeInTheDocument();
    expect(basic.getByText('Up to 5 users')).toBeInTheDocument();
    expect(basic.getByText('Excluding taxes')).toBeInTheDocument();
    expect(basic.getAllByRole('listitem')).toHaveLength(5);
    const custom = within(screen.getByRole('article', { name: 'Custom' }));
    expect(custom.queryByText('/user/month')).toBeNull();
    expect(custom.getAllByRole('listitem')).toHaveLength(3);
  });
  it('adds BLOOM with its eyebrow for schools and links every button', () => {
    render(<PlanGrid plans={audiences.schools.plans} />);
    const bloom = within(screen.getByRole('article', { name: 'BLOOM' }));
    expect(bloom.getByText('NO SPECIAL EDUCATOR? START HERE')).toBeInTheDocument();
    expect(bloom.getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '/contact-us');
    expect(screen.getByRole('link', { name: /book a demo/i })).toHaveAttribute('href', '/try-demo?plan=basic');
    expect(within(screen.getByRole('article', { name: 'Custom' })).getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '/try-demo?plan=custom');
  });
});
