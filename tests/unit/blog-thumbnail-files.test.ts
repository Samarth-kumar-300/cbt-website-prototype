// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { THUMBNAILS } from '@/components/pages/blog/thumbnail/thumbnails';

/** Width and height from a PNG's IHDR chunk. */
function pngSize(file: string) {
  const b = readFileSync(file);
  expect(b.subarray(1, 4).toString('latin1'), `${file} is a PNG`).toBe('PNG');
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

describe('rendered blog thumbnails', () => {
  it.each(Object.keys(THUMBNAILS))('%s has a 1200x675 PNG', (slug) => {
    const file = join(process.cwd(), 'public/blog/thumbs', `${slug}.png`);
    expect(existsSync(file), `missing ${file}; run npm run thumbnails`).toBe(true);
    expect(pngSize(file)).toEqual({ width: 1200, height: 675 });
  });
});
