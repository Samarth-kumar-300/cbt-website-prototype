import { render } from '@testing-library/react';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CARD_STYLES } from '@/components/pages/blog/card-styles';
import { PostCard } from '@/components/pages/blog/PostCard';
import { POSTS } from '@/components/pages/blog/posts';

/** One supplied banner per post, in post order. */
const COVERS = ['01', '02', '03', '04', '05', '06'].map((n) => `/images/blog/banner-${n}.webp`);

describe('blog card covers', () => {
  it('gives every post its own supplied banner, in order', () => {
    expect(POSTS).toHaveLength(COVERS.length);
    expect(POSTS.map((p) => CARD_STYLES[p.slug].cover)).toEqual(COVERS);
  });

  it.each(COVERS)('%s is a real file', (cover) => {
    const file = join(process.cwd(), 'public', cover);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(10_000);
  });

  it('no longer ships the superseded PNG copies', () => {
    for (const n of ['01', '02', '03']) expect(existsSync(join(process.cwd(), 'public/images/blog', `thumbnail-${n}.png`)), `thumbnail-${n}.png`).toBe(false);
  });

  it('shows the supplied image as decoration, zooming on hover with no lift and no placeholder icon', () => {
    const post = POSTS[3];
    const { container } = render(<PostCard post={post} />);
    const cover = container.querySelector('[data-cover]')!;
    expect(cover.getAttribute('data-cover')).toBe('image');
    expect(cover.tagName).toBe('IMG');
    expect(cover.getAttribute('alt')).toBe(''); // the title is the text under the card
    expect(decodeURIComponent(cover.getAttribute('src')!)).toContain('/images/blog/banner-04.webp');
    expect(cover.className).not.toMatch(/translate/);
    expect(cover.className).toMatch(/group-hover:scale-\[1\.1\]/);
    expect(cover.parentElement!.className).toMatch(/overflow-hidden/);
    expect(container.querySelector('[data-cover="placeholder"]')).toBeNull();
  });

  it('falls back to the colourful placeholder, with its hover lift, for a post that has no cover', () => {
    const post = POSTS[0];
    const original = CARD_STYLES[post.slug];
    CARD_STYLES[post.slug] = { ...original, cover: undefined };
    try {
      const { container } = render(<PostCard post={post} />);
      const cover = container.querySelector('[data-cover]')!;
      expect(cover.getAttribute('data-cover')).toBe('placeholder');
      expect(cover.className).toMatch(/group-hover:-translate-y-1/);
      expect(container.querySelector('img')).toBeNull();
    } finally {
      CARD_STYLES[post.slug] = original;
    }
  });
});
