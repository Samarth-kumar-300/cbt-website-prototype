import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { bandReport, cropRgba, fillRects } from './lib/diff.mjs';
import { routeToSlug } from './lib/slug.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3100';
const MAX = Number(process.env.MAX_MISMATCH ?? 0.05);
const WIDTHS = [375, 768, 1024, 1440];
const route = process.argv[2];
if (!route) {
  console.error('usage: npm run verify -- <route>   e.g. npm run verify -- /schools');
  process.exit(2);
}
const slug = routeToSlug(route);
const outDir = `verify/${slug}`;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const report = [];
let failed = false;

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  // same key as components/shared/cookie-key.ts
  await ctx.addInitScript(() => localStorage.setItem('cb-cookie-consent', 'rejected'));
  const page = await ctx.newPage();
  const errors = [];
  // Next prefetches every nav link as an RSC request. Nav links to routes another agent has not
  // merged yet answer 404; those prefetch failures are not errors of the page under test.
  page.on('console', (m) => m.type() === 'error' && !m.location().url.includes('_rsc=') && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  const res = await page.goto(BASE + route, { waitUntil: 'load' });
  const status = res ? res.status() : 0;
  // 404 prefetches (see above) never settle, so networkidle is best-effort rather than required.
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const shot = `${outDir}/${w}.png`;
  await page.screenshot({ path: shot, fullPage: true });
  await ctx.close();

  const row = { width: w, status, overflow, consoleErrors: errors.length, errors: errors.slice(0, 3) };
  const refPng = `reference/${slug}/${w}.png`;
  const refMeta = `reference/${slug}/${w}.json`;
  if (existsSync(refPng) && overflow <= 0) {
    const a = PNG.sync.read(readFileSync(refPng));
    const b = PNG.sync.read(readFileSync(shot));
    let rects = [];
    if (existsSync(refMeta)) rects = JSON.parse(readFileSync(refMeta, 'utf8')).imgRects ?? [];
    else console.log(`note: ${refMeta} is missing, no image rectangles are masked`);
    if (a.width !== w) console.log(`note: reference ${a.width}px wide vs nominal ${w} (original overflowed); comparing the common ${Math.min(a.width, b.width)}px`);
    const width = Math.min(a.width, b.width);
    const height = Math.min(a.height, b.height);
    // crop row by row: each image keeps its own stride
    const A = { data: cropRgba(a.data, a.width, width, height) };
    const B = { data: cropRgba(b.data, b.width, width, height) };
    fillRects(A.data, width, height, rects);
    fillRects(B.data, width, height, rects);
    const diff = new PNG({ width, height });
    const bad = pixelmatch(A.data, B.data, diff.data, width, height, { threshold: 0.1, diffMask: true });
    writeFileSync(`${outDir}/${w}.diff.png`, PNG.sync.write(diff));
    row.heightRef = a.height;
    row.heightNew = b.height;
    row.mismatch = +(bad / (width * height)).toFixed(4);
    row.badBands = bandReport(diff.data, width, height, 200).filter((x) => x.ratio > 0.1).map((x) => `${x.y0}-${x.y1} (${Math.round(x.ratio * 100)}%)`);
  }
  if (status >= 400) console.log(`${w}px: navigation returned HTTP ${status}`);
  if (status >= 400 || overflow > 0 || errors.length > 0 || (row.mismatch !== undefined && row.mismatch > MAX)) failed = true;
  report.push(row);
}
await browser.close();

writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 2));
for (const r of report) {
  console.log(
    `${String(r.width).padStart(4)}px  status=${r.status}  overflow=${r.overflow}  consoleErrors=${r.consoleErrors}  height ref/new=${r.heightRef ?? '-'}/${r.heightNew ?? '-'}  mismatch=${r.mismatch ?? '-'}  badBands=${(r.badBands ?? []).join(', ') || '-'}`,
  );
}
console.log(failed ? `\nFAIL (see ${outDir}/*.diff.png)` : '\nPASS');
process.exit(failed ? 1 : 0);
