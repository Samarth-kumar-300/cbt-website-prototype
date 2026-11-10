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
  it('is coded, not an image: live lettering, no img, Figma proportions', () => {
    const { container, rerender } = render(<StoreBadge store="google" href="/coming-soon" label="Get it on Google Play" />);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('GET IT ON')).toBeInTheDocument();
    expect(screen.getByText('Google Play')).toBeInTheDocument();
    const face = container.querySelector('a > span') as HTMLElement;
    expect(face.style.getPropertyValue('--u')).toBe('1.5px');
    expect(face.style.width).toBe('calc(var(--u) * 135)');
    expect(face.style.height).toBe('calc(var(--u) * 40)');
    rerender(<StoreBadge store="apple" href="/coming-soon" label="Download on the App Store" height={40} />);
    expect(screen.getByText('Download on the')).toBeInTheDocument();
    expect(screen.getByText('App Store')).toBeInTheDocument();
    const apple = container.querySelector('a > span') as HTMLElement;
    expect(apple.style.getPropertyValue('--u')).toBe('1px');
    expect(apple.style.width).toBe('calc(var(--u) * 135)');
    expect(apple.style.borderRadius).toBe(face.style.borderRadius);
  });
});
