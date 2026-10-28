export function fillRects(data, width, height, rects) {
  for (const r of rects) {
    const x0 = Math.max(0, Math.floor(r.x));
    const y0 = Math.max(0, Math.floor(r.y));
    const x1 = Math.min(width, Math.ceil(r.x + r.w));
    const y1 = Math.min(height, Math.ceil(r.y + r.h));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * width + x) * 4;
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 255;
        data[i + 3] = 255;
      }
    }
  }
}

export function bandReport(mask, width, height, bandHeight = 200) {
  const bands = [];
  for (let y0 = 0; y0 < height; y0 += bandHeight) {
    const y1 = Math.min(height, y0 + bandHeight);
    let diff = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = 0; x < width; x++) {
        if (mask[(y * width + x) * 4 + 3] !== 0) diff++;
      }
    }
    bands.push({ y0, y1, ratio: diff / (width * (y1 - y0)) });
  }
  return bands;
}

/** Copy the top-left width x height region of an RGBA image whose rows are srcWidth pixels wide. */
export function cropRgba(data, srcWidth, width, height) {
  const out = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const from = y * srcWidth * 4;
    out.set(data.subarray(from, from + width * 4), y * width * 4);
  }
  return out;
}
