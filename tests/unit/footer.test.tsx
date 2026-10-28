import { readFileSync } from 'node:fs';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Footer } from '@/components/shared/Footer';

afterEach(cleanup);

const ref = JSON.parse(readFileSync('reference/footer.json', 'utf8')) as { links: { text: string; href: string | null }[] };

describe('Footer', () => {
  it('contains every link from the live footer (same hrefs)', () => {
    const { container } = render(<Footer />);
    const hrefs = new Set(Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href')));
    const missing = ref.links.map((l) => l.href).filter((h): h is string => !!h && !hrefs.has(h));
    expect(missing).toEqual([]);
  });
  it('uses the dark teal background and shows the three column headings', () => {
    const { container, getAllByText } = render(<Footer />);
    expect(container.querySelector('footer')!.className).toContain('bg-brand-dark');
    ['PLATFORM', 'RESOURCES', 'COMPANY'].forEach((h) => expect(getAllByText(h).length).toBeGreaterThan(0));
  });
  it('opens external links in a new tab safely', () => {
    const { container } = render(<Footer />);
    const ext = Array.from(container.querySelectorAll('a')).filter((a) => /^https?:/.test(a.getAttribute('href') ?? ''));
    expect(ext.length).toBeGreaterThan(0);
    ext.forEach((a) => {
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
  it('renders social links as labelled inline SVG icons, not text badges', () => {
    const { container } = render(<Footer />);
    ['instagram', 'twitter', 'linkedin', 'youtube'].forEach((label) => {
      const a = container.querySelector(`a[aria-label="${label}"]`)!;
      expect(a).not.toBeNull();
      expect(a.querySelector('svg path')).not.toBeNull();
      expect(a.textContent).toBe('');
    });
  });
  it('shows the ISO badge unlinked, like the live site', () => {
    const { getAllByRole } = render(<Footer />);
    getAllByRole('img', { name: 'ISO 27001 certified' }).forEach((el) => expect(el.closest('a')).toBeNull());
  });
});
