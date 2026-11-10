import { POSTS, type Audience, type BlogPost } from './posts';

export const blogContent = {
  title: 'Blog',
  subtitle: 'What’s changing in early intervention, and how centres, schools and parents put it to work.',
  chipsLabel: 'Blog audiences',
  cta: { heading: 'See it in your centre or school', body: 'Tell us about your team, then pick a time for your demo.', label: 'Book a demo', href: '/try-demo' },
} as const;

/** Chip order on /blog; an audience with no posts is left out. */
const AUDIENCE_ORDER: readonly Audience[] = ['Therapy centres', 'Schools', 'Parents'];

export function blogAudiences(posts: readonly BlogPost[] = POSTS): Audience[] {
  return AUDIENCE_ORDER.filter((a) => posts.some((p) => p.audiences.includes(a)));
}

/** Border and text colours of an audience tag on a post page. */
export const AUDIENCE_TAG: Record<Audience, { readonly borderColor: string; readonly color: string }> = {
  Parents: { borderColor: '#a8d5d7', color: '#10494c' },
  'Therapy centres': { borderColor: '#ddbce0', color: '#9a3fa0' },
  Schools: { borderColor: '#e5d39a', color: '#8a6d1d' },
};

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Up to `count` other posts, ones sharing an audience first, then the rest in list order. */
export function relatedPosts(slug: string, count = 3): BlogPost[] {
  const me = getPost(slug);
  const others = POSTS.filter((p) => p.slug !== slug);
  const same = others.filter((p) => p.audiences.some((a) => me?.audiences.includes(a)));
  return [...same, ...others.filter((p) => !same.includes(p))].slice(0, count);
}

export const SITE = 'https://cognitivebotics.com';

export function postJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        mainEntityOfPage: `${SITE}/blog/${post.slug}`,
        publisher: { '@type': 'Organization', name: 'CognitiveBotics' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Blog', item: `${SITE}/blog` },
          { '@type': 'ListItem', position: 2, name: post.title, item: `${SITE}/blog/${post.slug}` },
        ],
      },
    ],
  };
}
