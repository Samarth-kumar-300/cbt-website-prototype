import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { matchLocal, normalizeKey, srcKey } from './lib/images.mjs';
import { ROUTES, routeToSlug } from './lib/slug.mjs';

const locals = JSON.parse(readFileSync('public/images/index.json', 'utf8'));
const existing = existsSync('reference/image-manifest.json') ? JSON.parse(readFileSync('reference/image-manifest.json', 'utf8')) : [];
// Merge entries whose keys differ only by a size-variant prefix (keeps a manual `local` decision).
const byId = new Map();
for (const m of existing) {
  const entry = { ...m, key: normalizeKey(m.key) };
  const id = entry.key + '|' + entry.alt;
  const prev = byId.get(id);
  if (prev) {
    prev.local = prev.local ?? entry.local;
    for (const pg of entry.pages) if (!prev.pages.includes(pg)) prev.pages.push(pg);
  } else byId.set(id, entry);
}
const force = process.argv.includes('--force');

for (const route of ROUTES) {
  const slug = routeToSlug(route);
  const copy = JSON.parse(readFileSync(`reference/${slug}/copy.json`, 'utf8'));
  for (const s of copy) {
    for (const img of s.imgs) {
      const key = srcKey(img.src);
      const id = key + '|' + img.alt;
      const prev = byId.get(id);
      if (prev) {
        if (!prev.pages.includes(slug)) prev.pages.push(slug);
        if (force || prev.local === null) prev.local = matchLocal({ key, alt: img.alt }, locals) ?? prev.local;
      } else {
        byId.set(id, { key, src: img.src, alt: img.alt, local: matchLocal({ key, alt: img.alt }, locals), pages: [slug] });
      }
    }
  }
}

const manifest = [...byId.values()];
writeFileSync('reference/image-manifest.json', JSON.stringify(manifest, null, 2));
const matched = manifest.filter((m) => m.local);
console.log(`${manifest.length} distinct images, ${matched.length} matched to local files, ${manifest.length - matched.length} will be placeholders`);
console.log('\nMATCHED:');
for (const m of matched) console.log(`  ${m.key.padEnd(28)} -> ${m.local}   [${m.pages.join(',')}]`);
console.log('\nUNMATCHED (placeholders):');
for (const m of manifest.filter((x) => !x.local)) console.log(`  ${m.key.padEnd(28)} alt="${m.alt.slice(0, 40)}"   [${m.pages.join(',')}]`);
