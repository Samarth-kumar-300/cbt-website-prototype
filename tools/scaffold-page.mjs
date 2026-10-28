import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { htmlToJsx } from './lib/html-to-jsx.mjs';
import { makeResolver } from './lib/images.mjs';
import { slugToComponentName } from './lib/slug.mjs';

const slug = process.argv[2];
if (!slug) {
  console.error('usage: node tools/scaffold-page.mjs <slug>');
  process.exit(2);
}
const manifest = existsSync('reference/image-manifest.json') ? JSON.parse(readFileSync('reference/image-manifest.json', 'utf8')) : [];
const resolveImage = makeResolver(manifest);
const dir = `reference/${slug}/sections`;
const files = readdirSync(dir).filter((f) => f.endsWith('.html')).sort((a, b) => parseInt(a) - parseInt(b));
const out = `components/pages/${slug}/sections`;
mkdirSync(out, { recursive: true });

const names = [];
for (const f of files) {
  const i = parseInt(f);
  const { jsx, usesLink, usesPlaceholder, usesImage } = htmlToJsx(readFileSync(`${dir}/${f}`, 'utf8'), { resolveImage });
  const imports = [
    usesLink && "import Link from 'next/link';",
    usesImage && "import Image from 'next/image';",
    usesPlaceholder && "import { Placeholder } from '@/components/shared/Placeholder';",
  ].filter(Boolean).join('\n');
  writeFileSync(`${out}/Section${i}.tsx`, `${imports}${imports ? '\n\n' : ''}export function Section${i}() {\n  return (\n${jsx}\n  );\n}\n`);
  names.push(`Section${i}`);
}

const comp = slugToComponentName(slug);
const importLines = names.map((n) => `import { ${n} } from './sections/${n}';`).join('\n');
writeFileSync(
  `components/pages/${slug}/${comp}.tsx`,
  `${importLines}\n\nexport function ${comp}() {\n  return (\n    <>\n${names.map((n) => `      <${n} />`).join('\n')}\n    </>\n  );\n}\n`,
);
console.log(`scaffolded ${names.length} sections into components/pages/${slug}/ as ${comp}`);
