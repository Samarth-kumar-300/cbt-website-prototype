import { readFileSync } from 'node:fs';

const slug = process.argv[2];
const sections = JSON.parse(readFileSync(`reference/${slug}/copy.json`, 'utf8'));
for (const s of sections) {
  const head = (s.h1[0] ?? s.h2[0] ?? s.p[0] ?? '').slice(0, 60);
  console.log(`${String(s.index).padStart(2)}  h=${String(s.height).padStart(5)}  id=${(s.id || '-').padEnd(14)} imgs=${s.imgs.length}  "${head}"`);
}
