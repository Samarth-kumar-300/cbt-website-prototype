# Motion rollout report (2026-10-13)

Spec: `docs/superpowers/specs/2026-10-13-motion-rollout-all-pages-design.md`. Plan: `docs/superpowers/plans/2026-10-13-motion-rollout-all-pages.md`.

## Verification (fresh build)
tsc clean, eslint clean, vitest 144/144, Playwright 99/99. The new `tests/e2e/motion-pages.spec.ts` covers, for all 7 routes: groups reach their final state, no console errors, no overflow at 390px, JavaScript off, reduced motion; plus card hover, the Therapy scroller, an anchor jump, and stagger groups starting hidden.

## Coverage (visible motion hooks at 1440px)
about 68, contact-us 29, parents 65, resources 63, schools 104, therapy-centres 77. No section on any page is without motion except the Contact form section, which is meant to have none.

## First-load JS, gzipped, initial scripts (before → after)
| Route | Before | After |
|---|---|---|
| / | 242.0 kB | 242.2 kB |
| /about | 181.9 | 229.0 |
| /contact-us | 185.4 | 231.9 |
| /parents | 230.4 | 230.7 |
| /resources | 181.9 | 228.5 |
| /schools | 183.6 | 230.6 |
| /therapy-centres | 230.2 | 231.2 |

About, Contact, Resources and Schools grew by about 47 kB because they now load the GSAP text-split and scroll chunk the homepage already carried. Not lazy-loaded: loading it late would show hero headings as plain text, then hide and re-reveal them.

## Therapy "Skills empowering every child's journey"
10 cards in 2 rows (desktop) and 5 rows (mobile) are now one horizontal row. Section height was not measured numerically; the screenshots show about half on desktop and about a quarter of the mobile height.
