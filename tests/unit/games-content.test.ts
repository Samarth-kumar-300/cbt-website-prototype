import { describe, expect, it } from 'vitest';
import { GAMES, gameKicker, getGame, isEmbeddable, relatedGames } from '@/components/pages/games/content';

describe('games content', () => {
  it('lists the 4 launch games with unique slugs', () => {
    expect(GAMES).toHaveLength(4);
    expect(new Set(GAMES.map((g) => g.slug)).size).toBe(4);
  });

  it('has no coming-soon copy anywhere in the games content', () => {
    expect(JSON.stringify(GAMES)).not.toMatch(/coming soon|on the way/i);
  });

  it('has no placeholder brackets in any visible copy', () => {
    for (const g of GAMES) for (const v of Object.values(g).flat()) if (typeof v === 'string') expect(v).not.toMatch(/[\[\]]/);
  });

  it('returns a detail page for every game and nothing for an unknown slug', () => {
    for (const g of GAMES) expect(getGame(g.slug)?.name).toBe(g.name);
    expect(getGame('learn-to-look')?.name).toBe('Learn to look');
    expect(getGame('nope')).toBeUndefined();
  });

  it('gives every game full detail copy', () => {
    for (const g of GAMES) {
      expect(g.childDoes.length).toBeGreaterThan(10);
      expect(g.howItWorks.length).toBeGreaterThan(10);
      expect(g.summary.length).toBeGreaterThan(10);
    }
  });

  it('gives each game 3 other games, never itself', () => {
    for (const g of GAMES) {
      const r = relatedGames(g.slug);
      expect(r).toHaveLength(3);
      expect(r.map((x) => x.slug)).not.toContain(g.slug);
    }
    expect(relatedGames('learn-to-look').map((g) => g.slug)).toEqual(['label-common-objects', 'identify-common-objects', 'imitate-with-hands']);
  });

  it('uses the agreed skill and game names, in card order', () => {
    expect(GAMES.map((g) => `${g.skill}: ${g.name}`)).toEqual([
      'Attending: Learn to look',
      'Expressive: Label common objects',
      'Receptive: Identify common objects',
      'Imitation: Imitate with hands',
    ]);
  });

  it('builds the kicker in sentence case', () => {
    expect(gameKicker(GAMES[0])).toBe('Attending · Gaze detection');
    expect(gameKicker(GAMES[3])).toBe('Imitation · Pose detection');
  });

  it('allows only https embed URLs', () => {
    expect(isEmbeddable('https://example.com/g')).toBe(true);
    expect(isEmbeddable('http://example.com/g')).toBe(false);
    expect(isEmbeddable('javascript:alert(1)')).toBe(false);
    expect(isEmbeddable(undefined)).toBe(false);
  });
});

describe('game thumbnails', () => {
  it('gives every game its own 16:9 thumbnail file in public', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    const paths = GAMES.map((g) => g.thumbnail);
    expect(new Set(paths).size).toBe(4);
    for (const t of paths) {
      expect(t).toMatch(/^\/images\/games\/thumbs\/[a-z-]+\.webp$/);
      expect(existsSync(`public${t}`)).toBe(true);
      const b = readFileSync(`public${t}`);
      // Lossy webp stores size in 'VP8 ' (14-bit values at bytes 26 to 29) or, with extra data, in 'VP8X' (24-bit, minus 1).
      const kind = b.toString('ascii', 12, 16);
      const size = kind === 'VP8X' ? [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)] : [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
      expect(size, t).toEqual([1600, 900]);
    }
  });
});

describe('game tasks', () => {
  it('gives every game the 5 tasks from its platform card, exactly as listed', () => {
    const tasks = Object.fromEntries(GAMES.map((g) => [g.slug, g.tasks]));
    expect(tasks).toEqual({
      'learn-to-look': ['Look at the object 1', 'Look at the object 2', 'Look at the object 3', 'Look at the object 4', 'Look at the object 5'],
      'label-common-objects': ['Bubbles', 'Train', 'Cookies', 'Car', 'Banana'],
      'identify-common-objects': ['Bubbles', 'Train', 'Cookies', 'Car', 'Banana'],
      'imitate-with-hands': ['Hands on head', 'Hands on shoulder', 'Touch nose', 'Wave hand', 'Clap hands'],
    });
  });

  it('writes what the child does without naming a child', () => {
    for (const g of GAMES) expect(g.childDoes).not.toMatch(/jaya/i);
  });
});
