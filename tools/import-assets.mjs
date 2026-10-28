import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SRC = '../Website_Image_pixelation_fix';
const FOLDERS = ['homepage', 'Therapy Centres', 'schools'];
const LOGOS = [
  ['../CBT_Logo/FullLogo/svg/Original.svg', 'public/brand/logo.svg'],
  ['../CBT_Logo/FullLogo/svg/OriginalWhite.svg', 'public/brand/logo-white.svg'],
  ['../CBT_Logo/Symbol/svg/Original.svg', 'public/brand/symbol.svg'],
];

export function slugifyFilename(name) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, path.extname(name));
  const slug = base
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug + ext;
}

async function run() {
  mkdirSync('public/brand', { recursive: true });
  for (const [from, to] of LOGOS) copyFileSync(from, to);
  const index = [];
  for (const folder of FOLDERS) {
    const folderSlug = slugifyFilename(folder + '.x').replace(/\.x$/, '');
    mkdirSync(`public/images/${folderSlug}`, { recursive: true });
    for (const file of readdirSync(path.join(SRC, folder)).filter((f) => f.toLowerCase().endsWith('.webp'))) {
      const out = slugifyFilename(file);
      copyFileSync(path.join(SRC, folder, file), `public/images/${folderSlug}/${out}`);
      const meta = await sharp(path.join(SRC, folder, file)).metadata();
      index.push({
        path: `/images/${folderSlug}/${out}`,
        file: path.basename(out, '.webp'),
        folder: folderSlug,
        w: meta.width,
        h: meta.height,
      });
    }
  }
  writeFileSync('public/images/index.json', JSON.stringify(index, null, 2));
  console.log(`copied ${index.length} images and ${LOGOS.length} logos`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) run();
