import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { PROGRESS_IS_PRICELESS as film } from '@/lib/films';

// The real TextReveal needs GSAP, which needs window.matchMedia (absent in jsdom). The stand-in keeps the id so labelling can be tested.
vi.mock('@/components/shared/TextReveal', () => ({
  TextReveal: ({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) => (
    <h2 id={id} className={className}>
      {children}
    </h2>
  ),
}));

import { VideoSection } from '@/components/shared/VideoSection';

const HEADING = 'Progress is Priceless';

describe('VideoSection', () => {
  it('shows the heading exactly as supplied and names its section with it', () => {
    render(<VideoSection heading={HEADING} film={film} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(HEADING);
    expect(screen.getByRole('region', { name: HEADING })).toBeInTheDocument();
  });

  it('gives each section its own heading id when two share a page', () => {
    const { container } = render(
      <>
        <VideoSection heading={HEADING} film={film} />
        <VideoSection heading={HEADING} film={film} />
      </>,
    );
    const sections = [...container.querySelectorAll('section')];
    const ids = sections.map((s) => s.querySelector('h2')!.id);
    expect(sections).toHaveLength(2);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);
    sections.forEach((s) => expect(s.getAttribute('aria-labelledby')).toBe(s.querySelector('h2')!.id));
  });

  it('uses the Home gradient by default, and flat aqua or white when asked', () => {
    const { container, rerender } = render(<VideoSection heading={HEADING} film={film} />);
    const style = () => (container.querySelector('section') as HTMLElement).getAttribute('style');
    expect(style()).toContain('rgb(248, 234, 242)');
    rerender(<VideoSection heading={HEADING} film={film} tone="flat-aqua" />);
    expect(style()).toContain('brand-subtle-bg');
    rerender(<VideoSection heading={HEADING} film={film} tone="white" />);
    expect(style()).toMatch(/#fff|rgb\(255, 255, 255\)/i);
  });

  it('wraps long unbroken words instead of overflowing', () => {
    const { container } = render(<VideoSection heading={HEADING} film={film} />);
    expect(container.querySelector('section')!.className).toContain('[overflow-wrap:anywhere]');
  });

  it('renders the heading and poster on the server, with no player frame and no YouTube or Google address', () => {
    const html = renderToString(<VideoSection heading={HEADING} film={film} />);
    expect(html).toContain(HEADING);
    expect(html).toContain('progress-is-priceless-poster');
    expect(html).not.toContain('<iframe');
    expect(html).not.toMatch(/youtube|ytimg|google/i);
  });
});
