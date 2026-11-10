import { describe, expect, it } from 'vitest';
import { STUB_ROUTES } from '@/lib/stub-routes';

describe('STUB_ROUTES', () => {
  it('covers every out-of-scope route', () => {
    ['/developmental-checklist', '/privacy-policy', '/terms-of-use', '/medical-disclaimer', '/webinars'].forEach((r) =>
      expect(STUB_ROUTES).toContain(r),
    );
  });
  it('never shadows a built route', () => {
    ['/', '/therapy-centres', '/schools', '/parents', '/about', '/contact-us', '/careers', '/try-demo', '/pricing', '/faqs', '/blog', '/case-studies', '/testimonials', '/research', '/achievements'].forEach((r) =>
      expect(STUB_ROUTES).not.toContain(r),
    );
    expect(STUB_ROUTES).not.toContain('/blog/:slug*');
    expect(STUB_ROUTES).not.toContain('/resources/research/:slug*');
  });
});
