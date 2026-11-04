import { LIVE_PAGES, type LivePages } from '@/lib/launch-gates';

export type NavLinkItem = { readonly kind: 'link'; readonly label: string; readonly href: string };
export type NavPage = { readonly label: string; readonly href: string; readonly helper: string; readonly external?: boolean };
export type NavColumn = { readonly heading: string; readonly pages: readonly NavPage[] };
export type NavPromo = { readonly heading: string; readonly label: string; readonly href: string };
export type NavMenuItem = { readonly kind: 'menu'; readonly label: string; readonly columns: readonly NavColumn[]; readonly promo: NavPromo };
export type NavItem = NavLinkItem | NavMenuItem;

// Hrefs stay single-quoted: tools/lib/nav-config.mjs reads them from this file.
export const LEARN_PAGES: Record<keyof LivePages, NavPage> = {
  caseStudies: { label: 'Case studies', href: '/case-studies', helper: 'How centres and schools use CognitiveBotics' },
  faqs: { label: 'FAQs', href: '/faqs', helper: 'Quick answers before you book' },
  blog: { label: 'Blog', href: '/blog', helper: 'Guides on autism and early support' },
  testimonials: { label: 'Testimonials', href: '/testimonials', helper: 'Families and professionals, in their words' },
};

// The knowledge base lives on another site, so it opens in a new tab. It has no launch gate.
export const KNOWLEDGE_BASE: NavPage = {
  label: 'Knowledge base',
  href: 'https://support.cognitivebotics.com/support/solutions',
  helper: 'Guides and troubleshooting for the platform',
  external: true,
};

export const GET_IN_TOUCH: NavPage = { label: 'Get in touch', href: '/contact-us', helper: 'Talk to our team' };

const LEARN_ORDER: readonly (keyof LivePages)[] = ['caseStudies', 'faqs', 'blog', 'testimonials'];

export function livePages(live: LivePages = LIVE_PAGES): NavPage[] {
  return LEARN_ORDER.filter((k) => live[k]).map((k) => LEARN_PAGES[k]);
}

/** Every page in a menu, column by column. */
export function menuPages(item: NavMenuItem): NavPage[] {
  return item.columns.flatMap((c) => [...c.pages]);
}

/**
 * Learn replaces the old Resources link, in three columns grouped by format: pages with a detail page per item
 * (case studies, blog), single pages of short items (FAQs, testimonials), and help.
 * It lists every page; those not live yet open the coming-soon stub.
 */
export function buildPrimaryNav(): NavItem[] {
  const learn: NavItem = {
    kind: 'menu',
    label: 'Learn',
    columns: [
      { heading: 'Stories and guides', pages: [LEARN_PAGES.caseStudies, LEARN_PAGES.blog] },
      { heading: 'Answers and quotes', pages: [LEARN_PAGES.faqs, LEARN_PAGES.testimonials] },
      { heading: 'Get support', pages: [KNOWLEDGE_BASE, GET_IN_TOUCH] },
    ],
    promo: { heading: 'See it in your centre or school', label: 'Book a demo', href: '/try-demo' },
  };
  return [
    { kind: 'link', label: 'Therapy Centres', href: '/therapy-centres' },
    { kind: 'link', label: 'Schools', href: '/schools' },
    { kind: 'link', label: 'Parents', href: '/parents' },
    { kind: 'link', label: 'Pricing', href: '/pricing' },
    learn,
    { kind: 'link', label: 'About Us', href: '/about' },
  ];
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}
