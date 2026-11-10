import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TestimonialsSection, pickTestimonials } from '@/components/shared/TestimonialsSection';
import { TESTIMONIALS } from '@/lib/testimonials';

// The section's motion components register GSAP plugins on import, which needs window.matchMedia (absent in jsdom).
// The helper under test renders nothing, so GSAP is stubbed out.
vi.mock('gsap', () => ({ default: { registerPlugin: vi.fn() } }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
vi.mock('gsap/SplitText', () => ({ SplitText: {} }));
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));

vi.mock('@/components/shared/TestimonialRail', () => ({ TestimonialRail: () => null }));
vi.mock('@/components/shared/TestimonialCarousel', () => ({ TestimonialCarousel: () => null }));
vi.mock('@/components/shared/TextReveal', () => ({ TextReveal: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2> }));

describe('TestimonialsSection background', () => {
  it('uses flat aqua when asked, and the Home gradient by default', () => {
    const { container, rerender } = render(<TestimonialsSection heading="H" tone="flat-aqua" />);
    expect((container.querySelector('section') as HTMLElement).getAttribute('style')).toContain('brand-subtle-bg');
    rerender(<TestimonialsSection heading="H" />);
    expect((container.querySelector('section') as HTMLElement).getAttribute('style')).toContain('rgb(248, 234, 242)');
  });
});

describe('pickTestimonials', () => {
  it('returns every testimonial in data order when no order is given', () => {
    expect(pickTestimonials().map((t) => t.id)).toEqual(TESTIMONIALS.map((t) => t.id));
  });
  it('follows the given order', () => {
    expect(pickTestimonials(['pavani', 'tejaswi']).map((t) => t.id)).toEqual(['pavani', 'tejaswi']);
  });
  it('throws on an unknown id so a typo cannot silently drop a quote', () => {
    expect(() => pickTestimonials(['nobody'])).toThrow('Unknown testimonial: nobody');
  });
});
