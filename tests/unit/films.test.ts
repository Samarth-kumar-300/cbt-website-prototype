import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { PROGRESS_IS_PRICELESS, embedUrl } from '@/lib/films';

describe('PROGRESS_IS_PRICELESS', () => {
  it('names the film and its YouTube id', () => {
    expect(PROGRESS_IS_PRICELESS.title).toBe('Progress is Priceless');
    expect(PROGRESS_IS_PRICELESS.youtubeId).toBe('c7LKzn9LWSo');
  });

  it('points at a local 1280 x 720 WebP poster that is light enough for a hero image', async () => {
    expect(PROGRESS_IS_PRICELESS.poster.startsWith('/images/video/')).toBe(true);
    const file = path.join(process.cwd(), 'public', PROGRESS_IS_PRICELESS.poster);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeLessThan(250_000);
    const meta = await sharp(file).metadata();
    expect([meta.format, meta.width, meta.height]).toEqual(['webp', 1280, 720]);
  });

  it('describes the poster in a sentence', () => {
    expect(PROGRESS_IS_PRICELESS.posterAlt.length).toBeGreaterThan(40);
  });
});

describe('embedUrl', () => {
  it('builds the privacy-friendly player address', () => {
    expect(embedUrl(PROGRESS_IS_PRICELESS)).toBe('https://www.youtube-nocookie.com/embed/c7LKzn9LWSo?autoplay=1&rel=0&playsinline=1');
  });

  it('encodes the id so a mistyped one cannot change the address', () => {
    const url = embedUrl({ ...PROGRESS_IS_PRICELESS, youtubeId: 'a/b?x=1#y' });
    expect(url).toBe('https://www.youtube-nocookie.com/embed/a%2Fb%3Fx%3D1%23y?autoplay=1&rel=0&playsinline=1');
  });
});
