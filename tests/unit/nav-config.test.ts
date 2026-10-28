import { describe, expect, it } from 'vitest';
import { buildNavConfig } from '../../tools/lib/nav-config.mjs';

describe('buildNavConfig', () => {
  it('serialises sign-in items, drawer links and the scrolled background', () => {
    const out = buildNavConfig({
      signInMenu: [{ label: 'Parent app', href: 'https://app.example.com' }],
      drawerLinks: [{ label: 'Try Demo', href: '/try-demo' }, { label: 'Careers', href: '/careers' }],
      headerScrolled: { background: 'rgba(255, 255, 255, 0.8)' },
    });
    expect(out).toContain('export const SIGN_IN_ITEMS');
    expect(out).toContain('"Parent app"');
    expect(out).toContain('export const DRAWER_LINKS');
    expect(out).toContain('"/careers"');
    expect(out).toContain('export const HEADER_SCROLLED_BG = "rgba(255, 255, 255, 0.8)";');
  });
  it('exports the captured header background-image verbatim, falling back to none', () => {
    const img = 'linear-gradient(rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.55) 100%)';
    expect(buildNavConfig({ headerTop: { backgroundImage: img } })).toContain(`export const HEADER_BG_IMAGE = ${JSON.stringify(img)};`);
    expect(buildNavConfig({})).toContain('export const HEADER_BG_IMAGE = "none";');
  });
  it('falls back to empty lists and a translucent white background', () => {
    const out = buildNavConfig({});
    expect(out).toContain('SIGN_IN_ITEMS: readonly { label: string; href: string }[] = []');
    expect(out).toContain('DRAWER_LINKS: readonly { label: string; href: string }[] = []');
    expect(out).toContain('rgba(255, 255, 255, 0.72)');
  });
  it('keeps only drawer links not already rendered by the primary nav, sign-in items or Try Demo', () => {
    const out = buildNavConfig({
      signInMenu: [
        { label: 'Professional Sign In', href: 'https://pro.example.com/login' },
        { label: '', href: 'https://empty.example.com' },
        { label: '   ', href: 'https://blank.example.com' },
      ],
      drawerLinks: [
        { label: 'THERAPY CENTRES', href: '/therapy-centres' },
        { label: 'ABOUT US', href: '/about' },
        { label: 'TRY DEMO', href: '/try-demo' },
        { label: 'Professional Sign In', href: 'https://pro.example.com/login' },
        { label: 'Careers', href: '/careers' },
      ],
    });
    const drawer = out.slice(out.indexOf('export const DRAWER_LINKS'), out.indexOf('export const HEADER_SCROLLED_BG'));
    expect(drawer).toContain('"/careers"');
    expect(drawer).not.toContain('/therapy-centres');
    expect(drawer).not.toContain('/about"');
    expect(drawer).not.toContain('/try-demo');
    expect(drawer).not.toContain('pro.example.com');
    expect(out).toContain('"https://pro.example.com/login"');
    expect(out).not.toContain('empty.example.com');
    expect(out).not.toContain('blank.example.com');
  });
});
