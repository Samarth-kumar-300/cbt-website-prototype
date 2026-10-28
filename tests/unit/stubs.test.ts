import { describe, expect, it } from 'vitest';
import { STUB_ROUTES } from '@/lib/stub-routes';

describe('STUB_ROUTES', () => {
  it('covers every out-of-scope route, including blog posts', () => {
    ['/try-demo', '/developmental-checklist', '/privacy-policy', '/terms-of-use', '/medical-disclaimer', '/blog', '/blog/:slug*', '/resources/research/:slug*'].forEach((r) =>
      expect(STUB_ROUTES).toContain(r),
    );
  });
  it('never shadows a Phase 1 route', () => {
    ['/', '/therapy-centres', '/schools', '/parents', '/resources', '/about', '/contact-us', '/careers'].forEach((r) => expect(STUB_ROUTES).not.toContain(r));
  });
});
