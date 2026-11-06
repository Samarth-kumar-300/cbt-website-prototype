import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StoreBadge } from '@/components/pages/pricing/sections/StoreBadge';

describe('StoreBadge', () => {
  it('names the link with the full label and stays in-site for a local href', () => {
    render(<StoreBadge store="google" href="/coming-soon" label="Get it on Google Play" />);
    const link = screen.getByRole('link', { name: 'Get it on Google Play' });
    expect(link).toHaveAttribute('href', '/coming-soon');
    expect(link).not.toHaveAttribute('target');
  });
  it('opens a store URL in a new tab safely', () => {
    render(<StoreBadge store="apple" href="https://apps.apple.com/app/id1" label="Download on the App Store" />);
    const link = screen.getByRole('link', { name: 'Download on the App Store' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
