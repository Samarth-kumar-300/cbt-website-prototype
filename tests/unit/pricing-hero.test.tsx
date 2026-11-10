import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
vi.mock('@/components/shared/TextReveal', () => ({
  TextReveal: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));
vi.mock('@/components/shared/RevealStagger', () => ({
  RevealStagger: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
}));

import { Hero } from '@/components/pages/pricing/sections/Hero';
import { hero } from '@/components/pages/pricing/content';

afterEach(cleanup);

describe('pricing hero', () => {
  it('is left aligned, with no centred text', () => {
    const { container } = render(<Hero />);
    expect(container.innerHTML).not.toMatch(/text-center/);
    expect(container.querySelector('.text-left')).not.toBeNull();
  });

  it('shows the hero illustration, which exists in public', () => {
    render(<Hero />);
    const img = screen.getByRole('img', { name: /therapist, two parents and a child/i });
    expect(decodeURIComponent(img.getAttribute('src')!)).toContain('/images/pricing/hero.webp');
    expect(existsSync(join(process.cwd(), 'public/images/pricing/hero.webp'))).toBe(true);
  });

  it('shows every stat and credential, each with its own colour', () => {
    const { container } = render(<Hero />);
    const total = hero.stats.length + hero.credentials.length;
    const tones = [...container.querySelectorAll('[data-proof-tone]')] as HTMLElement[];
    expect(tones).toHaveLength(total);
    expect(new Set(tones.map((d) => d.style.color)).size).toBe(total);
    for (const s of hero.stats) {
      expect(screen.getByText(s.figure)).toBeTruthy();
      expect(screen.getByText(s.label)).toBeTruthy();
      expect(screen.getByText(s.source)).toBeTruthy();
    }
    for (const c of hero.credentials) expect(screen.getByText(c.source)).toBeTruthy();
    expect(container.querySelectorAll('[data-proof-group] > li')).toHaveLength(total);
  });
});

describe('pricing hero background', () => {
  it('uses the Parents hero gradient', () => {
    const { container } = render(<Hero />);
    const style = (container.querySelector('section') as HTMLElement).getAttribute('style')!;
    expect(style).toContain('rgb(234, 245, 242)');
    expect(style).toContain('rgb(252, 237, 233)');
  });
});
