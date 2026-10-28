import { readFileSync, writeFileSync } from 'node:fs';
import { buildNavConfig } from './lib/nav-config.mjs';

const i = JSON.parse(readFileSync('reference/interactions.json', 'utf8'));
writeFileSync('components/shared/nav-config.generated.ts', buildNavConfig(i));
console.log('wrote components/shared/nav-config.generated.ts');
