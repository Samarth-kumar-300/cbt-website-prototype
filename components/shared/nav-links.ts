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
  research: { label: 'Research', href: '/research', helper: 'Peer-reviewed studies on developmental outcomes' },
  achievements: { label: 'Patent and certifications', href: '/achievements', helper: 'Our granted patent and ISO 27001 certificate' },
};

// The knowledge base lives on another site, so it opens in a new tab. It has no launch gate.
export const KNOWLEDGE_BASE: NavPage = {
  label: 'Knowledge base',
  href: 'https://support.cognitivebotics.com/support/solutions',
  helper: 'Guides and troubleshooting for the platform',
  external: true,
};

export const GET_IN_TOUCH: NavPage = { label: 'Get in touch', href: '/contact-us', helper: 'Talk to our team' };

const LEARN_ORDER: readonly (keyof LivePages)[] = ['research', 'caseStudies', 'achievements', 'testimonials', 'faqs', 'blog'];

export function livePages(live: LivePages = LIVE_PAGES): NavPage[] {
  return LEARN_ORDER.filter((k) => live[k]).map((k) => LEARN_PAGES[k]);
}

/** Every page in a menu, column by column. */
export function menuPages(item: NavMenuItem): NavPage[] {
  return item.columns.flatMap((c) => [...c.pages]);
}

/**
 * Learn replaces the old Resources link, in three columns grouped by what a visitor is trying to find out:
 * does it work (evidence, strongest first), what do others say and what can I ask (questions and stories), and help.
 * It lists every page; those not live yet open the coming-soon stub.
 */
export function buildPrimaryNav(): NavItem[] {
  const learn: NavItem = {
    kind: 'menu',
    label: 'Learn',
    columns: [
      { heading: 'Evidence', pages: [LEARN_PAGES.research, LEARN_PAGES.caseStudies, LEARN_PAGES.achievements] },
      { heading: 'Questions and stories', pages: [LEARN_PAGES.testimonials, LEARN_PAGES.faqs, LEARN_PAGES.blog] },
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
