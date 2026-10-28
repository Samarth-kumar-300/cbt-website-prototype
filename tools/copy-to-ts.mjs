import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { toTsModule } from './lib/content.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('usage: node tools/copy-to-ts.mjs <slug>');
  process.exit(2);
}
const sections = JSON.parse(readFileSync(`reference/${slug}/copy.json`, 'utf8'));
const faqPath = `reference/${slug}/faq.json`;
const faq = existsSync(faqPath) ? JSON.parse(readFileSync(faqPath, 'utf8')) : [];
mkdirSync(`components/pages/${slug}`, { recursive: true });
writeFileSync(`components/pages/${slug}/content.ts`, toTsModule(sections, faq));
console.log(`wrote components/pages/${slug}/content.ts (${sections.length} sections, ${faq.length} faq items)`);
