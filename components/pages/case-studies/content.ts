export type CaseStudy = {
  readonly slug: string;
  readonly org: string;
  readonly type: string;
  /** Filter on /case-studies. */
  readonly group: 'Therapy centres' | 'Schools';
  readonly location: string;
  readonly users: string;
  readonly headline: string;
  /** Thumbnail on the /case-studies card (16:9, 7680 x 4320). */
  readonly cover: string;
  readonly summary: string;
  readonly metrics: readonly { readonly value: string; readonly label: string }[];
  readonly challenge: string;
  readonly solution: string;
  readonly features: readonly string[];
  readonly quote: { readonly text: string; readonly name: string; readonly role: string };
  /**
   * TODO: sample data. Replace every entry with a real case study (with written permission to
   * publish) and set this to false. While any entry is a placeholder the pages show a notice.
   */
  readonly placeholder: boolean;
};

export const caseStudiesContent = {
  title: 'Case studies',
  filtersLabel: 'Case study groups',
  cta: { heading: 'Want this in your own centre or school?', body: 'Tell us about your team, then pick a time for your demo.', label: 'Book a demo', href: '/try-demo' },
} as const;

/** Filter rows on /case-studies; a group with no case studies is left out. */
export function caseStudyGroups(list: readonly CaseStudy[] = CASE_STUDIES): string[] {
  return ['Therapy centres', 'Schools'].filter((g) => list.some((c) => c.group === g));
}

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: 'sample-therapy-centre',
    org: 'Sample Therapy Centre',
    type: 'Therapy centre',
    group: 'Therapy centres',
    location: 'City, State',
    users: 'XX users',
    headline: 'Placeholder: outcome headline for a therapy centre',
    cover: '/images/case-studies/therapy-centre.webp',
    summary: 'Placeholder paragraph about the organisation. Replace with a real description.',
    metrics: [
      { value: 'XX%', label: 'Placeholder metric one' },
      { value: 'XX', label: 'Placeholder metric two' },
      { value: 'XX', label: 'Placeholder metric three' },
    ],
    challenge: 'Placeholder: describe the problem the centre had before CognitiveBotics.',
    solution: 'Placeholder: describe how the centre used CognitiveBotics and what changed.',
    features: ['Placeholder feature one', 'Placeholder feature two', 'Placeholder feature three'],
    quote: { text: 'Placeholder quote. Replace with a real, approved quote.', name: 'Name', role: 'Role, Sample Therapy Centre' },
    placeholder: true,
  },
  {
    slug: 'sample-school',
    org: 'Sample School',
    type: 'School',
    group: 'Schools',
    location: 'City, State',
    users: 'XX users',
    headline: 'Placeholder: outcome headline for a school',
    cover: '/images/case-studies/school.webp',
    summary: 'Placeholder paragraph about the organisation. Replace with a real description.',
    metrics: [
      { value: 'XX%', label: 'Placeholder metric one' },
      { value: 'XX', label: 'Placeholder metric two' },
      { value: 'XX', label: 'Placeholder metric three' },
    ],
    challenge: 'Placeholder: describe the problem the school had before CognitiveBotics.',
    solution: 'Placeholder: describe how the school used CognitiveBotics and what changed.',
    features: ['Placeholder feature one', 'Placeholder feature two', 'Placeholder feature three'],
    quote: { text: 'Placeholder quote. Replace with a real, approved quote.', name: 'Name', role: 'Role, Sample School' },
    placeholder: true,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** The case study after this one, wrapping to the first. Undefined when there is only one. */
export function nextCaseStudy(slug: string): CaseStudy | undefined {
  const i = CASE_STUDIES.findIndex((c) => c.slug === slug);
  const next = CASE_STUDIES[(i + 1) % CASE_STUDIES.length];
  return CASE_STUDIES.length > 1 && next.slug !== slug ? next : undefined;
}

/** Reading time in whole minutes at 200 words a minute, never under 1. Counts what the detail page shows as text. */
export function readMinutes(c: CaseStudy): number {
  const words = [c.summary, c.challenge, c.solution, ...c.features, c.quote.text].join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const hasPlaceholders = (list: readonly CaseStudy[] = CASE_STUDIES) => list.some((c) => c.placeholder);

export const SITE = 'https://cognitivebotics.com';

export function caseStudyJsonLd(cs: CaseStudy) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: cs.headline,
        description: cs.summary,
        mainEntityOfPage: `${SITE}/case-studies/${cs.slug}`,
        publisher: { '@type': 'Organization', name: 'CognitiveBotics' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Case studies', item: `${SITE}/case-studies` },
          { '@type': 'ListItem', position: 2, name: cs.org, item: `${SITE}/case-studies/${cs.slug}` },
        ],
      },
    ],
  };
}
