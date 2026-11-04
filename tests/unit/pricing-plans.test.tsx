import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Section1 } from '@/components/pages/pricing/sections/Section1';

afterEach(cleanup);

describe('Pricing plans', () => {
  it('renders Basic and Custom as labelled articles', () => {
    render(<Section1 />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('article', { name: 'Basic' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Custom' })).toBeInTheDocument();
  });
  it('shows the Basic price, user limit, total and tax line', () => {
    render(<Section1 />);
    const basic = within(screen.getByRole('article', { name: 'Basic' }));
    expect(basic.getByText('₹2,000')).toBeInTheDocument();
    expect(basic.getByText('/user/month')).toBeInTheDocument();
    expect(basic.getByText('Up to 5 users')).toBeInTheDocument();
    expect(basic.getByText('5 users: ₹10,000 per month')).toBeInTheDocument();
    expect(basic.getByText('Excluding taxes')).toBeInTheDocument();
    expect(basic.getAllByRole('listitem')).toHaveLength(7);
  });
  it('links each CTA to the demo form with the plan', () => {
    render(<Section1 />);
    expect(screen.getByRole('link', { name: /book a demo/i })).toHaveAttribute('href', '/try-demo?plan=basic');
    expect(screen.getByRole('link', { name: /talk to sales/i })).toHaveAttribute('href', '/try-demo?plan=custom');
  });
  it('does not show a tax line or per-user unit on the Custom plan', () => {
    render(<Section1 />);
    const custom = within(screen.getByRole('article', { name: 'Custom' }));
    expect(custom.queryByText('Excluding taxes')).toBeNull();
    expect(custom.queryByText('/user/month')).toBeNull();
    expect(custom.getAllByRole('listitem')).toHaveLength(3);
  });
});
