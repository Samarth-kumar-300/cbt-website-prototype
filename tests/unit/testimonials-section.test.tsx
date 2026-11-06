import { describe, expect, it, vi } from 'vitest';
import { pickTestimonials } from '@/components/shared/TestimonialsSection';
import { TESTIMONIALS } from '@/lib/testimonials';

// The section's motion components register GSAP plugins on import, which needs window.matchMedia (absent in jsdom).
// The helper under test renders nothing, so GSAP is stubbed out.
vi.mock('gsap', () => ({ default: { registerPlugin: vi.fn() } }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
vi.mock('gsap/SplitText', () => ({ SplitText: {} }));
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));

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
