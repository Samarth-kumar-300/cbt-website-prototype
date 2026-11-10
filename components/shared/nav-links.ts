import { LIVE_PAGES, type LivePages } from '@/lib/launch-gates';

export type NavLinkItem = { readonly kind: 'link'; readonly label: string; readonly href: string };
export type NavPage = { readonly label: string; readonly href: string; readonly helper: string; readonly external?: boolean };
export type NavColumn = { readonly heading: string; readonly pages: readonly NavPage[] };
export type NavPromo = { readonly heading: string; readonly body?: string; readonly label: string; readonly href: string };
export type NavMenuItem = { readonly kind: 'menu'; readonly label: string; readonly columns: readonly NavColumn[]; readonly promo: NavPromo };
export type NavItem = NavLinkItem | NavMenuItem;

// Hrefs stay single-quoted: tools/lib/nav-config.mjs reads them from this file.
export const LEARN_PAGES: Record<keyof LivePages, NavPage> = {
  caseStudies: { label: 'Case studies', href: '/case-studies', helper: 'How centres and schools put CognitiveBotics to work' },
  faqs: { label: 'FAQs', href: '/faqs', helper: 'Quick answers before you book' },
  blog: { label: 'Blog', href: '/blog', helper: 'What’s changing in early intervention, and how centres, schools and parents put it to work' },
  testimonials: { label: 'Testimonials', href: '/testimonials', helper: 'Centre heads, experts and parents, in their own words' },
  research: { label: 'Research', href: '/research', helper: 'Studies with NIEPID and in JMIR Neurotechnology' },
  achievements: { label: 'Awards', href: '/achievements', helper: 'Our wins in healthcare innovation, in India and the UK' },
};

// The knowledge base lives on another site, so it opens in a new tab. It has no launch gate.
export const KNOWLEDGE_BASE: NavPage = {
  label: 'Knowledge base',
  href: 'https://support.cognitivebotics.com/support/solutions',
  helper: 'How the platform works, setup guides and answers to common questions',
  external: true,
};

// No page is built for webinars yet: the stub route in lib/stub-routes.ts serves /coming-soon. Not a launch-gated page.
export const WEBINARS: NavPage = { label: 'Webinars', href: '/webinars', helper: 'Live and recorded sessions on early intervention and the platform' };

const LEARN_ORDER: readonly (keyof LivePages)[] = ['research', 'caseStudies', 'achievements', 'testimonials', 'faqs', 'blog'];

export function livePages(live: LivePages = LIVE_PAGES): NavPage[] {
  return LEARN_ORDER.filter((k) => live[k]).map((k) => LEARN_PAGES[k]);
}

/** Every page in a menu, column by column. */
export function menuPages(item: NavMenuItem): NavPage[] {
  return item.columns.flatMap((c) => [...c.pages]);
}

/**
 * Inside CognitiveBotics replaces the old Resources link, in three columns: Company (proof and what others say),
 * Library (reading and sessions) and Product (research and the knowledge base). FAQs stay in the footer and at /faqs.
 * It lists every page; those not live yet open the coming-soon stub.
 */
export function buildPrimaryNav(): NavItem[] {
  const inside: NavItem = {
    kind: 'menu',
    label: 'Inside CognitiveBotics',
    columns: [
      { heading: 'Company', pages: [LEARN_PAGES.caseStudies, LEARN_PAGES.testimonials, LEARN_PAGES.achievements] },
      { heading: 'Library', pages: [LEARN_PAGES.blog, WEBINARS] },
      { heading: 'Product', pages: [LEARN_PAGES.research, KNOWLEDGE_BASE] },
    ],
    promo: { heading: 'Questions about your centre or school?', body: 'Talk to our team in Hyderabad about plans and setup.', label: 'Contact us', href: '/contact-us' },
  };
  return [
    { kind: 'link', label: 'Therapy Centres', href: '/therapy-centres' },
    { kind: 'link', label: 'Schools', href: '/schools' },
    { kind: 'link', label: 'Parents', href: '/parents' },
    { kind: 'link', label: 'Pricing', href: '/pricing' },
    inside,
    { kind: 'link', label: 'About Us', href: '/about' },
  ];
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/');
}
