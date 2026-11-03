import { LIVE_PAGES, type LivePages } from '@/lib/launch-gates';

export type NavLinkItem = { readonly kind: 'link'; readonly label: string; readonly href: string };
export type StoriesPage = { readonly label: string; readonly href: string; readonly helper: string };
export type NavMenuItem = { readonly kind: 'menu'; readonly label: string; readonly pages: readonly StoriesPage[] };
export type NavItem = NavLinkItem | NavMenuItem;

// Hrefs stay single-quoted: tools/lib/nav-config.mjs reads them from this file.
export const STORIES_PAGES: Record<keyof LivePages, StoriesPage> = {
  caseStudies: { label: 'Case studies', href: '/case-studies', helper: 'How centres and schools use CognitiveBotics' },
  faqs: { label: 'FAQs', href: '/faqs', helper: 'Quick answers before you book' },
  blog: { label: 'Blog', href: '/blog', helper: 'Guides on autism and early support' },
  testimonials: { label: 'Testimonials', href: '/testimonials', helper: 'Families and professionals, in their words' },
};

const STORIES_ORDER: readonly (keyof LivePages)[] = ['caseStudies', 'faqs', 'blog', 'testimonials'];

export function livePages(live: LivePages = LIVE_PAGES): StoriesPage[] {
  return STORIES_ORDER.filter((k) => live[k]).map((k) => STORIES_PAGES[k]);
}

/** Stories needs two live pages to be worth a dropdown; until then the legacy Resources link stays. */
export function buildPrimaryNav(live: LivePages = LIVE_PAGES): NavItem[] {
  const pages = livePages(live);
  const stories: NavItem =
    pages.length >= 2
      ? { kind: 'menu', label: 'Stories', pages }
      : { kind: 'link', label: 'Resources', href: '/resources' };
  return [
    { kind: 'link', label: 'Therapy Centres', href: '/therapy-centres' },
    { kind: 'link', label: 'Schools', href: '/schools' },
    { kind: 'link', label: 'Parents', href: '/parents' },
    { kind: 'link', label: 'Pricing', href: '/pricing' },
    stories,
    { kind: 'link', label: 'About Us', href: '/about' },
    { kind: 'link', label: 'Get in Touch', href: '/contact-us' },
  ];
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}

/** Legacy list read by Header.tsx until Task 9 switches it to buildPrimaryNav. */
export const NAV_LINKS = [
  { label: 'Therapy Centres', href: '/therapy-centres' },
  { label: 'Schools', href: '/schools' },
  { label: 'Parents', href: '/parents' },
  { label: 'Resources', href: '/resources' },
  { label: 'About Us', href: '/about' },
  { label: 'Get in Touch', href: '/contact-us' },
] as const;
