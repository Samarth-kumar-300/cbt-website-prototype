import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('gsap', () => ({ default: { registerPlugin: vi.fn() } }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { refresh: vi.fn() } }));
vi.mock('@/components/shared/TestimonialsSection', () => ({ TestimonialsSection: () => null }));
vi.mock('@/components/shared/TextReveal', () => ({
  TextReveal: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));
vi.mock('@/components/shared/RevealStagger', () => ({ RevealStagger: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div> }));
vi.mock('@/components/shared/Reveal', () => ({ Reveal: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div> }));

import { PRICING_VIDEO } from '@/components/pages/pricing/PricingPage';
import { audiences } from '@/components/pages/pricing/content';
import { Gets } from '@/components/pages/pricing/sections/Gets';
import { Intro } from '@/components/pages/pricing/sections/Intro';
import { PlanGrid } from '@/components/pages/pricing/sections/Plans';
import { VideoTestimonialCard } from '@/components/shared/VideoTestimonialCard';
import { VIDEO_TESTIMONIAL } from '@/lib/testimonials';

describe('pricing sections', () => {
  it('draws the six platform cards as white icon cards, each with its own tinted icon', () => {
    const { container } = render(<Intro a={audiences['therapy-centres']} />);
    const cards = [...container.querySelectorAll<HTMLElement>('[data-feature-card]')];
    expect(cards).toHaveLength(6);
    for (const c of cards) {
      expect(c.className).toContain('bg-white');
      expect(c.className).toContain('border-brand-teal-100');
      expect(c.querySelector('[data-icon] svg path')).not.toBeNull();
    }
    const tints = cards.map((c) => (c.querySelector('[data-icon]') as HTMLElement).style.backgroundColor);
    expect(new Set(tints).size).toBeGreaterThanOrEqual(5);
  });
  it('uses flat aqua for the gets block and yellow for BLOOM', () => {
    const { container } = render(<Gets a={audiences.schools} />);
    expect(container.innerHTML).toContain('bg-brand-subtle-bg');
    const { container: c2 } = render(<PlanGrid plans={audiences.schools.plans} />);
    expect(within(c2).getByRole('article', { name: 'BLOOM' }).className).toContain('bg-[#FEF0C7]');
  });
  it('shows the doc wording on the pricing video card and keeps Watch now by default', () => {
    const { unmount } = render(<VideoTestimonialCard video={{ ...VIDEO_TESTIMONIAL, title: PRICING_VIDEO.title, role: PRICING_VIDEO.role }} variant="slide" linkLabel={PRICING_VIDEO.linkLabel} byline />);
    expect(screen.getByText('Explore expert insights')).toBeInTheDocument();
    expect(screen.getByText('Importance of Early Intervention and Preparing Children for Healthy Digital Engagement')).toBeInTheDocument();
    expect(screen.getByText('Inclusive Education Specialist, Founder Trustee, Chakshumathi')).toBeInTheDocument();
    unmount();
    render(<VideoTestimonialCard video={VIDEO_TESTIMONIAL} variant="slide" />);
    expect(screen.getByText('Watch now')).toBeInTheDocument();
  });
});

describe('pricing panel colours', () => {
  it('tints the parents banner with the secondary purple and stacks the store badges', async () => {
    const { ParentsPanel } = await import('@/components/pages/pricing/sections/ParentsPanel');
    const { container } = render(<ParentsPanel />);
    expect(container.innerHTML).toContain('bg-[#f8f2f9]');
    const badges = screen.getByRole('link', { name: /Google Play/ }).closest('div')!;
    expect(badges.className).toContain('flex-row');
    expect(badges.className).toContain('flex-wrap');
    expect(badges.className).toContain('lg:flex-col');
  });
});
