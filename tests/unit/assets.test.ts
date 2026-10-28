import { describe, expect, it } from 'vitest';
import { ROUTES, routeToSlug, slugToComponentName } from '../../tools/lib/slug.mjs';
import { slugifyFilename } from '../../tools/import-assets.mjs';

describe('slug helpers', () => {
  it('maps routes to slugs', () => {
    expect(routeToSlug('/')).toBe('home');
    expect(routeToSlug('/therapy-centres')).toBe('therapy-centres');
    expect(routeToSlug('/blog/some-post')).toBe('blog-some-post');
  });
  it('maps slugs to page component names', () => {
    expect(slugToComponentName('home')).toBe('HomePage');
    expect(slugToComponentName('therapy-centres')).toBe('TherapyCentresPage');
    expect(slugToComponentName('contact-us')).toBe('ContactUsPage');
  });
  it('lists exactly the Phase 1 routes', () => {
    expect(ROUTES).toEqual(['/', '/therapy-centres', '/schools', '/parents', '/resources', '/about', '/contact-us']);
  });
});

describe('slugifyFilename', () => {
  it('kebab-cases, drops apostrophes and keeps the extension', () => {
    expect(slugifyFilename("Understand Your Child's Development.webp")).toBe('understand-your-childs-development.webp');
    expect(slugifyFilename('play & behaviour.webp')).toBe('play-behaviour.webp');
    expect(slugifyFilename('heroSection_01.webp')).toBe('herosection-01.webp');
  });
});
