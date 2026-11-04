import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostThumbnail, Thumbnail } from '@/components/pages/blog/thumbnail/PostThumbnail';
import { THUMBNAILS, type ThumbnailSpec } from '@/components/pages/blog/thumbnail/thumbnails';
import { COLORS } from '@/components/pages/blog/thumbnail/tokens';

const EARLY = 'early-intervention-is-the-key-to-managing-autism';
const SCREEN = 'the-startling-truth-about-screen-time-and-autism';
const PHYSICAL = 'the-transformative-power-of-physical-activities-for-children-with-autism';
const SLUGS = [EARLY, SCREEN, PHYSICAL];

describe('Thumbnail frame', () => {
  it.each(SLUGS)('%s renders one eyebrow, a two-part headline and one descriptor at 1200 x 675', (slug) => {
    const spec = THUMBNAILS[slug];
    render(<PostThumbnail slug={slug} />);
    const root = screen.getByTestId('thumbnail');
    expect(root).toHaveStyle({ width: '1200px', height: '675px' });
    expect(root).toHaveAttribute('data-layout', spec.layout);
    expect(screen.getAllByTestId('eyebrow')).toHaveLength(1);
    expect(screen.getByTestId('eyebrow')).toHaveTextContent(spec.eyebrow);
    expect(screen.getByTestId('eyebrow')).toHaveStyle({ color: COLORS.purple });
    expect(screen.getByTestId('headline-lead')).toHaveTextContent(spec.lead);
    expect(screen.getByTestId('headline-accent')).toHaveTextContent(spec.accent);
    expect(screen.getByTestId('headline-accent')).toHaveStyle({ color: COLORS.accent });
    expect(screen.getByTestId('subtitle')).toHaveTextContent(spec.subtitle);
    expect(screen.getAllByTestId('art')).toHaveLength(1);
  });

  // This is what makes the three read as one campaign: one frame, one set of text styles.
  // The descriptor's margin and width legitimately differ by layout (it is pinned to the bottom in the split layout), so only its type is compared.
  it('gives all three the same card, eyebrow, headline and descriptor styles', () => {
    const styles = SLUGS.map((slug) => {
      const { unmount } = render(<PostThumbnail slug={slug} />);
      const whole = ['card', 'eyebrow', 'headline-lead', 'headline-accent'].map((id) => screen.getByTestId(id).getAttribute('style'));
      const sub = screen.getByTestId('subtitle').style;
      const s = [...whole, `${sub.color} ${sub.fontSize} ${sub.lineHeight}`];
      unmount();
      return s;
    });
    expect(styles[1]).toEqual(styles[0]);
    expect(styles[2]).toEqual(styles[0]);
  });
});

describe('illustrations', () => {
  it('draws the ticket content and a tag', () => {
    render(<PostThumbnail slug={EARLY} />);
    const art = within(screen.getByTestId('art'));
    expect(art.getByText('M-CHAT-R screening')).toBeInTheDocument();
    expect(art.getByText('16')).toBeInTheDocument();
    expect(art.getByText('30')).toBeInTheDocument();
    expect(art.getByText('months')).toBeInTheDocument();
    expect(art.getByText('Spot early signs')).toBeInTheDocument();
    expect(art.getByText('Start support')).toBeInTheDocument();
    expect(art.getByText('Start early')).toBeInTheDocument();
    expect(screen.getByTestId('art')).toHaveAttribute('data-rotate');
  });

  it('draws three rows with only the highlighted one bright and tagged', () => {
    const { container } = render(<PostThumbnail slug={SCREEN} />);
    const art = within(screen.getByTestId('art'));
    for (const row of ['Restrictive', 'Co-viewing', 'Interactive']) expect(art.getByText(row)).toBeInTheDocument();
    expect(art.getByText('Most effective')).toBeInTheDocument();
    const lit = container.querySelectorAll('[data-highlight]');
    expect(lit).toHaveLength(1);
    expect(lit[0]).toHaveTextContent('Interactive');
    expect(lit[0]).toHaveTextContent('Most effective');
  });

  it('draws six chips with the first one highlighted', () => {
    render(<PostThumbnail slug={PHYSICAL} />);
    const art = within(screen.getByTestId('art'));
    const chips = ['Motor skills', 'Sensory integration', 'Social bonds', 'Emotional wellness', 'Focus', 'Confidence'];
    for (const chip of chips) expect(art.getByText(chip)).toBeInTheDocument();
    expect(art.getByText('Motor skills')).toHaveStyle({ background: COLORS.purple });
    expect(art.getByText('Focus')).toHaveStyle({ background: COLORS.white });
  });
});

describe('edge cases', () => {
  const base = THUMBNAILS[PHYSICAL];

  it('shows markup characters in the copy as text', () => {
    const odd: ThumbnailSpec = { ...base, lead: '<b>bold</b> & "q"', subtitle: '<script>alert(1)</script>' };
    const { container } = render(<Thumbnail spec={odd} />);
    expect(screen.getByTestId('headline-lead').textContent).toBe('<b>bold</b> & "q"');
    expect(screen.getByTestId('subtitle').textContent).toBe('<script>alert(1)</script>');
    expect(container.querySelector('b, script')).toBeNull();
  });

  it('refuses copy that would not fit, instead of rendering an overflowing thumbnail', () => {
    expect(() => Thumbnail({ spec: { ...THUMBNAILS[EARLY], accent: 'A'.repeat(18) } })).toThrow(/does not fit.*accent/);
    expect(() => Thumbnail({ spec: { ...base, lead: 'A'.repeat(60) } })).toThrow(/does not fit/);
  });

  it('fails loudly for a slug with no thumbnail, including inherited object keys', () => {
    for (const slug of ['a-post-with-no-thumbnail', 'fun-ways-to-boost-motor-skills-of-children-with-autism', 'constructor', '__proto__']) {
      expect(() => PostThumbnail({ slug }), slug).toThrow(/No thumbnail for post/);
    }
  });
});
