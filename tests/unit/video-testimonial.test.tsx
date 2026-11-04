import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { TestimonialsGrid } from '@/components/pages/testimonials/TestimonialsGrid';
import { VideoTestimonialCard } from '@/components/shared/VideoTestimonialCard';
import { TESTIMONIALS, VIDEO_TESTIMONIAL } from '@/lib/testimonials';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

describe('VideoTestimonialCard', () => {
  it('loads no video until the card is pressed', () => {
    render(<VideoTestimonialCard video={VIDEO_TESTIMONIAL} variant="grid" />);
    expect(document.querySelector('video')).toBeNull();
    expect(screen.getByRole('button', { name: /Watch now/ })).toBeInTheDocument();
  });

  it('opens the video in a dialog, locks page scroll, and Escape closes it and returns focus', async () => {
    const user = userEvent.setup();
    render(<VideoTestimonialCard video={VIDEO_TESTIMONIAL} variant="grid" />);
    const card = screen.getByRole('button', { name: /Watch now/ });
    await user.click(card);
    const dialog = screen.getByRole('dialog', { name: VIDEO_TESTIMONIAL.title });
    const video = dialog.querySelector('video')!;
    expect(video).toHaveAttribute('src', VIDEO_TESTIMONIAL.src);
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('poster', VIDEO_TESTIMONIAL.poster);
    expect(screen.getByRole('button', { name: 'Close video' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.querySelector('video')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(card).toHaveFocus();
  });

  it('closes with the close button', async () => {
    const user = userEvent.setup();
    render(<VideoTestimonialCard video={VIDEO_TESTIMONIAL} variant="slide" />);
    await user.click(screen.getByRole('button', { name: /Watch now/ }));
    await user.click(screen.getByRole('button', { name: 'Close video' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows the speaker on the wide card only', () => {
    const { unmount } = render(<VideoTestimonialCard video={VIDEO_TESTIMONIAL} variant="grid" />);
    expect(screen.getByText(VIDEO_TESTIMONIAL.name)).toBeInTheDocument();
    unmount();
    render(<VideoTestimonialCard video={VIDEO_TESTIMONIAL} variant="slide" />);
    expect(screen.queryByText(VIDEO_TESTIMONIAL.name)).toBeNull();
  });
});

describe('written testimonials on the Testimonials page', () => {
  it('carry the same 1.5px stroke as the home page testimonial cards', () => {
    render(<TestimonialsGrid quotes={TESTIMONIALS} video={VIDEO_TESTIMONIAL} />);
    for (const card of screen.getAllByRole('figure')) {
      expect(card).toHaveClass('border-[1.5px]', 'border-[#e4ded4]');
    }
  });
});

describe('TestimonialsGrid with the video', () => {
  it('puts the video first, spanning two columns, ahead of every written quote', () => {
    render(<TestimonialsGrid quotes={TESTIMONIALS} video={VIDEO_TESTIMONIAL} />);
    const panel = screen.getByRole('tabpanel');
    const first = panel.firstElementChild!.firstElementChild as HTMLElement;
    expect(first).toHaveClass('sm:col-span-2');
    expect(first.querySelector('button')).toHaveTextContent('Watch now');
    expect(screen.getAllByRole('figure')).toHaveLength(TESTIMONIALS.length);
  });

  it('filters the video with its audience: it appears under All and Schools only', async () => {
    const user = userEvent.setup();
    render(<TestimonialsGrid quotes={TESTIMONIALS} video={VIDEO_TESTIMONIAL} />);
    expect(screen.getByRole('tab', { name: 'Schools' })).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Schools' }));
    expect(screen.getByRole('button', { name: /Watch now/ })).toBeInTheDocument();
    expect(screen.queryAllByRole('figure')).toHaveLength(0);
    await user.click(screen.getByRole('tab', { name: 'Parents' }));
    expect(screen.queryByRole('button', { name: /Watch now/ })).toBeNull();
    expect(screen.getAllByRole('figure').length).toBeGreaterThan(0);
  });
});
