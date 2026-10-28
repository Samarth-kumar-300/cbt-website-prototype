const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const SIZE_PREFIX = /^(small|medium|large|thumb|thumbnail)_/;

// Strapi-style size variants (`small_X`, `medium_X`, ...) are the same image as `X`; the captured
// currentSrc carries the prefix while the section HTML src does not, so compare without it.
export function normalizeKey(key) {
  return key.toLowerCase().replace(SIZE_PREFIX, '');
}

export function srcKey(src) {
  let s = src;
  try {
    const u = new URL(s, 'https://x.invalid');
    s = u.searchParams.get('url') ?? u.pathname;
  } catch {
    /* keep s as is */
  }
  let base = s.split('?')[0].split('/').pop() ?? '';
  try {
    base = decodeURIComponent(base);
  } catch {
    /* keep undecoded */
  }
  return normalizeKey(base.replace(/\.[a-z0-9]+$/i, ''));
}

export function matchLocal({ key, alt }, locals) {
  const candidates = [norm(key), norm(alt)].filter(Boolean);
  for (const c of candidates) {
    const exact = locals.filter((l) => norm(l.file) === c);
    if (exact.length === 1) return exact[0].path;
    const loose = locals.filter((l) => norm(l.file).replace(/\d+$/, '') === c.replace(/\d+$/, ''));
    if (loose.length === 1) return loose[0].path;
  }
  return null;
}

export function makeResolver(manifest) {
  return ({ src, alt }) => {
    const key = srcKey(src);
    const is = (m) => normalizeKey(m.key) === key;
    const hit = manifest.find((m) => is(m) && m.alt === alt) ?? manifest.find(is);
    return hit?.local ?? null;
  };
}
