import { describe, expect, it } from 'vitest';
import { bandReport, cropRgba, fillRects } from '../../tools/lib/diff.mjs';

describe('fillRects', () => {
  it('paints rectangles magenta and clips to the image', () => {
    const w = 4, h = 4;
    const data = new Uint8Array(w * h * 4);
    fillRects(data, w, h, [{ x: 2, y: 2, w: 10, h: 10 }]);
    const at = (x: number, y: number) => Array.from(data.slice((y * w + x) * 4, (y * w + x) * 4 + 4));
    expect(at(2, 2)).toEqual([255, 0, 255, 255]);
    expect(at(3, 3)).toEqual([255, 0, 255, 255]);
    expect(at(1, 1)).toEqual([0, 0, 0, 0]);
  });
});

describe('bandReport', () => {
  it('reports the share of differing pixels per vertical band', () => {
    const w = 2, h = 4;
    const mask = new Uint8Array(w * h * 4);
    // mark both pixels of row 3 as different (alpha != 0)
    for (let x = 0; x < w; x++) mask[(3 * w + x) * 4 + 3] = 255;
    const bands = bandReport(mask, w, h, 2);
    expect(bands).toEqual([
      { y0: 0, y1: 2, ratio: 0 },
      { y0: 2, y1: 4, ratio: 0.5 },
    ]);
  });
});

describe('cropRgba', () => {
  // pixel (x, y) of a src image has red channel = y * 10 + x so rows are distinguishable
  const make = (w: number, h: number) => {
    const d = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) d.set([y * 10 + x, 0, 0, 255], (y * w + x) * 4);
    return d;
  };
  const reds = (b: Uint8Array, w: number, h: number) => Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => b[(y * w + x) * 4]));

  it('respects the source stride when the source is wider than the crop', () => {
    const out = cropRgba(make(5, 3), 5, 3, 3);
    expect(out.length).toBe(3 * 3 * 4);
    expect(reds(out, 3, 3)).toEqual([[0, 1, 2], [10, 11, 12], [20, 21, 22]]);
  });

  it('drops extra rows when the source is taller than the crop', () => {
    const out = cropRgba(make(3, 5), 3, 3, 2);
    expect(out.length).toBe(3 * 2 * 4);
    expect(reds(out, 3, 2)).toEqual([[0, 1, 2], [10, 11, 12]]);
  });

  it('returns an independent copy', () => {
    const src = make(3, 2);
    const out = cropRgba(src, 3, 3, 2);
    out[0] = 99;
    expect(src[0]).toBe(0);
  });
});
