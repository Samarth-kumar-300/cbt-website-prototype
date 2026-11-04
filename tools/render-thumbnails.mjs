// Renders a 1200x675 PNG for every blog thumbnail listed in components/pages/blog/thumbnail/thumbnails.ts.
// `npm run thumbnails` builds the site first, then this serves the build, reads the slug list from /kit/thumbnail
// and screenshots /kit/thumbnail/<slug>. Re-run it after changing a thumbnail's copy or the template.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const PORT = process.env.PORT ?? '3101';
const BASE = `http://localhost:${PORT}`;
const OUT = 'public/blog/thumbs';
const WIDTH = 1200;
const HEIGHT = 675;

const up = (url) => fetch(url).then((r) => r.ok, () => false);

if (await up(BASE)) throw new Error(`something is already serving ${BASE}; stop it or set PORT to a free port`);

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', PORT], { stdio: 'ignore' });
let exited = false;
server.on('exit', () => (exited = true));

try {
  for (let i = 0; !(await up(`${BASE}/kit/thumbnail`)); i++) {
    if (exited || i >= 60) throw new Error('the site did not start; run `npm run build` and check it passes');
    await new Promise((r) => setTimeout(r, 1000));
  }
  const index = await fetch(`${BASE}/kit/thumbnail`).then((r) => r.text());
  const slugs = [...new Set([...index.matchAll(/data-slug="([^"]+)"/g)].map((m) => m[1]))];
  if (!slugs.length) throw new Error(`${BASE}/kit/thumbnail lists no thumbnails`);
  mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
    // same key as components/shared/cookie-key.ts
    await ctx.addInitScript(() => localStorage.setItem('cb-cookie-consent', 'rejected'));
    for (const slug of slugs) {
      const page = await ctx.newPage();
      await page.goto(`${BASE}/kit/thumbnail/${slug}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const shot = await page.getByTestId('thumbnail').screenshot({ animations: 'disabled' });
      const file = `${OUT}/${slug}.png`;
      await sharp(shot).png({ compressionLevel: 9 }).toFile(file);
      const { width, height } = await sharp(file).metadata();
      if (width !== WIDTH || height !== HEIGHT) throw new Error(`${file} is ${width}x${height}, expected ${WIDTH}x${HEIGHT}`);
      console.log(`wrote ${file}`);
      await page.close();
    }
    await ctx.close();
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}
