import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '@/components/shared/Button';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { Placeholder } from '@/components/shared/Placeholder';
import { Section } from '@/components/shared/Section';

describe('Placeholder', () => {
  it('exposes its label and applies the aspect ratio', () => {
    render(<Placeholder label="Hero image" ratio={1.5} />);
    const el = screen.getByRole('img', { name: 'Hero image' });
    expect(el).toHaveStyle({ aspectRatio: '1.5' });
  });
  it('omits the aspect ratio when none is given and keeps caller classes', () => {
    render(<Placeholder label="Fill" className="absolute inset-0" />);
    const el = screen.getByRole('img', { name: 'Fill' });
    expect(el.style.aspectRatio).toBe('');
    expect(el.className).toContain('absolute inset-0');
  });
});

describe('Button', () => {
  it('renders a link with the solid teal style and an arrow', () => {
    const { container } = render(<Button href="/try" arrow>Go</Button>);
    const a = screen.getByRole('link', { name: 'Go' });
    expect(a).toHaveAttribute('href', '/try');
    expect(a.className).toContain('bg-brand-teal');
    expect(container.querySelector('svg')).not.toBeNull();
  });
  it('opens external links safely', () => {
    render(<Button href="https://x.com" external>X</Button>);
    const a = screen.getByRole('link', { name: 'X' });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });
  it('supports the outline variant', () => {
    render(<Button href="/s" variant="outline" size="nav">Sign in</Button>);
    expect(screen.getByRole('link', { name: 'Sign in' }).className).toContain('border-brand-teal');
  });
});

describe('Eyebrow', () => {
  it('uses the purple tone by default and teal on request', () => {
    const { rerender } = render(<Eyebrow>HELLO</Eyebrow>);
    expect(screen.getByText('HELLO').className).toContain('text-content-brand-secondary');
    rerender(<Eyebrow tone="teal">HELLO</Eyebrow>);
    expect(screen.getByText('HELLO').className).toContain('text-brand-teal');
  });
});

describe('Section', () => {
  it('applies id, background and container classes', () => {
    const { container } = render(<Section id="x" bg="subtle" contained>c</Section>);
    const s = container.querySelector('section')!;
    expect(s.id).toBe('x');
    expect(s.className).toContain('bg-brand-subtle-bg');
    expect(s.firstElementChild!.className).toContain('max-w-[1440px]');
  });
  it('adds the hero gradient and wraps long unbroken words instead of overflowing', () => {
    const { container } = render(<Section hero>{'x'.repeat(80)}</Section>);
    const s = container.querySelector('section')!;
    expect(s.className).toContain('bg-[image:var(--gradient-hero)]');
    expect(s.className).toContain('[overflow-wrap:anywhere]');
  });
});
