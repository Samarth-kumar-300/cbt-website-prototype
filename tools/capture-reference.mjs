import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { ROUTES, routeToSlug } from './lib/slug.mjs';

const BASE = process.env.BASE ?? 'https://cognitivebotics.com';
const WIDTHS = [375, 768, 1024, 1440];

// networkidle occasionally never fires on the live site; fall back to a plain load plus a short settle.
async function go(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  } catch {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);
  }
}

async function dismissCookies(page) {
  const reject = page.getByRole('button', { name: /reject all/i }).first();
  // The banner can appear late; wait up to ~2s for it, then click if it showed up.
  try {
    await reject.waitFor({ state: 'visible', timeout: 2000 });
    await reject.click();
    await reject.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
  } catch {
    /* no banner */
  }
}

async function settle(page) {
  // html has `scroll-behavior: smooth`; force instant scrolling so the return to top is deterministic.
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => window.scrollY === 0, null, { timeout: 5000 });
  await page.waitForTimeout(600);
  const y = await page.evaluate(() => window.scrollY);
  if (y !== 0) throw new Error(`settle: expected scrollY 0 before screenshot, got ${y}`);
}

function extractSections() {
  const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden';
  const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
  const main = document.querySelector('main');
  const tops = [...main.querySelectorAll('section')].filter((s) => !s.parentElement.closest('section'));
  return tops.map((s, index) => {
    const cs = getComputedStyle(s);
    const q = (sel) => [...s.querySelectorAll(sel)].filter(vis);
    const r = s.getBoundingClientRect();
    return {
      index,
      id: s.id,
      className: s.getAttribute('class') ?? '',
      height: Math.round(r.height),
      bg: cs.backgroundColor,
      paddingTop: cs.paddingTop,
      paddingBottom: cs.paddingBottom,
      h1: q('h1').map(text),
      h2: q('h2').map(text),
      h3: q('h3').map(text),
      p: q('p').map(text).filter(Boolean),
      links: q('a').map((a) => ({ text: text(a), href: a.getAttribute('href') })).filter((l) => l.text),
      buttons: q('button').map(text).filter(Boolean),
      imgs: q('img').map((i) => {
        const b = i.getBoundingClientRect();
        return { src: i.currentSrc || i.src, alt: i.alt, w: Math.round(b.width), h: Math.round(b.height), ratio: b.height ? +(b.width / b.height).toFixed(3) : 1 };
      }),
      html: s.outerHTML,
    };
  });
}

function extractImgRects() {
  return [...document.querySelectorAll('main img')]
    .filter((i) => i.offsetWidth || i.offsetHeight)
    .map((i) => {
      const b = i.getBoundingClientRect();
      return { x: b.x + window.scrollX, y: b.y + window.scrollY, w: b.width, h: b.height };
    });
}

function extractFooter() {
  const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
  const f = document.querySelector('footer');
  return {
    texts: [...f.querySelectorAll('p')].filter(vis).map(text),
    links: [...f.querySelectorAll('a')].filter(vis).map((a) => ({ text: text(a), href: a.getAttribute('href'), label: a.getAttribute('aria-label') })),
    html: f.outerHTML,
  };
}

async function readFaq(page) {
  const section = page.locator('section', { has: page.getByRole('heading', { name: /frequently asked questions/i }) }).first();
  if (!(await section.count())) return null;
  const buttons = section.getByRole('button');
  const n = await buttons.count();
  const items = [];
  for (let i = 0; i < n; i++) {
    const b = buttons.nth(i);
    const q = (await b.locator('p').first().innerText()).replace(/\s+/g, ' ').trim();
    await b.click();
    await page.waitForTimeout(350);
    // Card = button's parent; the answer panel is every card child except the button.
    // `a` = prose paragraphs only (those without spans/anchors). A trailing "source" paragraph
    // (CTA label, citation lines, bare/anchored URLs) is split into `source` (non-URL lines) and
    // `links` ({text: CTA label, href}); it is never glued into `a`.
    const parsed = await b.evaluate((el) => {
      const clean = (t) => t.replace(/\s+/g, ' ').trim();
      const isUrl = (t) => /^https?:\/\/\S+$/.test(t);
      const panels = [...el.parentElement.children].filter((c) => c !== el);
      const ps = panels.flatMap((c) => (c.tagName === 'P' ? [c] : [...c.querySelectorAll('p')]));
      if (!ps.length) return { a: panels.map((c) => clean(c.textContent)).join(' ').trim(), source: [], links: [] };
      const prose = ps.filter((p) => !p.querySelector('a, span'));
      const noted = ps.filter((p) => p.querySelector('a, span'));
      const lines = [];
      const hrefs = [];
      for (const p of noted) {
        for (const n of p.childNodes) {
          const t = clean(n.textContent ?? '');
          if (!t) continue;
          lines.push(t);
          if (n.nodeType === 1 && n.tagName === 'A') hrefs.push(n.getAttribute('href'));
          else if (isUrl(t)) hrefs.push(t);
        }
      }
      const source = lines.filter((l) => !isUrl(l) && !hrefs.includes(l));
      const label = source[0] ?? '';
      return {
        a: prose.map((p) => clean(p.textContent)).join(' ').trim(),
        source,
        links: [...new Set(hrefs)].map((href) => ({ text: label || href, href })),
      };
    });
    const item = { q, a: parsed.a };
    if (parsed.source.length) item.source = parsed.source;
    if (parsed.links.length) item.links = parsed.links;
    items.push(item);
    if ((await b.getAttribute('aria-expanded')) === 'true') await b.click();
  }
  return items;
}

async function faqMode(page) {
  const section = page.locator('section', { has: page.getByRole('heading', { name: /frequently asked questions/i }) }).first();
  const buttons = section.getByRole('button');
  if ((await buttons.count()) < 2) return 'unknown';
  await buttons.nth(0).click();
  await page.waitForTimeout(300);
  await buttons.nth(1).click();
  await page.waitForTimeout(300);
  const open = await section.locator('[aria-expanded="true"]').count();
  return open === 1 ? 'single' : open > 1 ? 'multiple' : 'unknown';
}

async function probeInteractions(browser) {
  const out = {};

  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dp = await desk.newPage();
  await go(dp, BASE + '/');
  await dismissCookies(dp);
  const pill = dp.locator('div.fixed.inset-x-0.top-0 > div').first();
  const pillStyle = () => pill.evaluate((e) => { const c = getComputedStyle(e); return { background: c.backgroundColor, backgroundImage: c.backgroundImage, backdrop: c.backdropFilter, boxShadow: c.boxShadow, border: c.border }; });
  out.headerTop = await pillStyle();
  await dp.evaluate(() => window.scrollTo(0, 1500));
  await dp.waitForTimeout(700);
  out.headerScrolled = await pillStyle();
  await dp.evaluate(() => window.scrollTo(0, 0));
  await dp.waitForTimeout(400);
  const headerLinks = () => dp.evaluate(() => [...document.querySelectorAll('div.fixed.inset-x-0.top-0 a')].filter((a) => a.offsetWidth || a.offsetHeight).map((a) => ({ label: a.textContent.replace(/\s+/g, ' ').trim(), href: a.getAttribute('href') })));
  const before = await headerLinks();
  await dp.getByRole('button', { name: /sign in/i }).first().click();
  await dp.waitForTimeout(500);
  const after = await headerLinks();
  const seen = new Set(before.map((l) => l.label + '|' + l.href));
  out.signInMenu = after.filter((l) => !seen.has(l.label + '|' + l.href));
  await dp.keyboard.press('Escape');
  out.faqMode = await faqMode(dp);
  out.carousel = await dp.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find((x) => /real experiences/i.test(x.textContent));
    if (!h) return null;
    const s = h.closest('section');
    return [...s.querySelectorAll('button')].filter((b) => b.offsetWidth || b.offsetHeight).map((b) => b.getAttribute('aria-label') || b.textContent.trim());
  });
  out.faqColors = await dp.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find((x) => /frequently asked/i.test(x.textContent));
    const q = h?.closest('section')?.querySelector('button p');
    return { heading: h ? getComputedStyle(h).color : null, question: q ? getComputedStyle(q).color : null };
  });

  const cp = await desk.newPage();
  await go(cp, BASE + '/contact-us');
  await dismissCookies(cp);
  out.contactForm = await cp.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return null;
    const label = (el) => { const id = el.id; const l = id ? document.querySelector(`label[for="${id}"]`) : el.closest('label'); return l ? l.textContent.replace(/\s+/g, ' ').trim() : ''; };
    return {
      inputs: [...form.querySelectorAll('input, textarea')].filter((e) => e.type !== 'hidden').map((e) => ({ tag: e.tagName.toLowerCase(), name: e.name, type: e.type, placeholder: e.placeholder, label: label(e), required: e.required })),
      buttons: [...form.querySelectorAll('button')].map((b) => b.textContent.replace(/\s+/g, ' ').trim()),
    };
  });
  const choose = cp.getByRole('button', { name: /choose one/i }).first();
  if (await choose.count()) {
    await choose.click();
    await cp.waitForTimeout(300);
    // Options render as <button>s in an absolutely positioned panel next to the trigger.
    out.contactSelect = await choose.evaluate((el) =>
      [...el.parentElement.querySelectorAll(':scope > div button')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean),
    );
  }
  await desk.close();

  const mob = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const mp = await mob.newPage();
  await go(mp, BASE + '/');
  await dismissCookies(mp);
  const mBefore = await mp.evaluate(() => [...document.querySelectorAll('div.fixed.inset-x-0.top-0 a')].filter((a) => a.offsetWidth || a.offsetHeight).map((a) => ({ label: a.textContent.replace(/\s+/g, ' ').trim(), href: a.getAttribute('href') })));
  await mp.locator('div.fixed.inset-x-0.top-0').getByRole('button').last().click();
  await mp.waitForTimeout(600);
  const mAfter = await mp.evaluate(() => [...document.querySelectorAll('a')].filter((a) => (a.offsetWidth || a.offsetHeight) && a.closest('div.fixed, nav, aside, [role=dialog]')).map((a) => ({ label: a.textContent.replace(/\s+/g, ' ').trim(), href: a.getAttribute('href') })));
  const mSeen = new Set(mBefore.map((l) => l.label + '|' + l.href));
  out.drawerLinks = mAfter.filter((l) => l.label && !mSeen.has(l.label + '|' + l.href));
  await mob.close();
  return out;
}

async function capturePage(browser, route) {
  const slug = routeToSlug(route);
  const dir = `reference/${slug}`;
  mkdirSync(`${dir}/sections`, { recursive: true });
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await go(page, BASE + route);
    await dismissCookies(page);
    await settle(page);
    await page.screenshot({ path: `${dir}/${w}.png`, fullPage: true });
    const imgRects = await page.evaluate(extractImgRects);
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    writeFileSync(`${dir}/${w}.json`, JSON.stringify({ docHeight, imgRects }, null, 2));
    if (w === 1440) {
      const sections = await page.evaluate(extractSections);
      sections.forEach((s) => writeFileSync(`${dir}/sections/${s.index}.html`, s.html));
      writeFileSync(`${dir}/copy.json`, JSON.stringify(sections.map(({ html, ...rest }) => rest), null, 2));
      writeFileSync(`${dir}/meta.json`, JSON.stringify({ title: await page.title(), description: await page.evaluate(() => document.querySelector('meta[name=description]')?.content ?? '') }, null, 2));
      const faq = await readFaq(page);
      if (faq && faq.length) writeFileSync(`${dir}/faq.json`, JSON.stringify(faq, null, 2));
      if (route === '/') writeFileSync('reference/footer.json', JSON.stringify(await page.evaluate(extractFooter), null, 2));
    }
    await ctx.close();
  }
  console.log(`captured ${route} -> ${dir}`);
}

const browser = await chromium.launch();
try {
  for (const route of ROUTES) await capturePage(browser, route);
  writeFileSync('reference/interactions.json', JSON.stringify(await probeInteractions(browser), null, 2));
  console.log('wrote reference/interactions.json');
} finally {
  await browser.close();
}
