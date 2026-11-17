export type CaseStudy = {
  readonly slug: string;
  readonly org: string;
  readonly type: string;
  /** Filter on /case-studies. */
  readonly group: 'Therapy centres' | 'Schools';
  readonly location: string;
  /** Optional user count shown after the location, such as "120 users". Left out when unknown. */
  readonly users?: string;
  readonly headline: string;
  /** Thumbnail on the /case-studies card (16:9, 7680 x 4320). */
  readonly cover: string;
  readonly summary: string;
  readonly metrics: readonly { readonly value: string; readonly label: string }[];
  /** Page title tag and meta description; fall back to the org name and summary. */
  readonly metaTitle?: string;
  readonly metaDescription?: string;
  readonly challenge: string;
  /** Further challenge paragraphs, shown after challenge. */
  readonly challengeMore?: readonly string[];
  /** One-line need, shown under the challenge with a bold Core need label. */
  readonly coreNeed?: string;
  /** Solution as prose. Optional when steps carry the solution. */
  readonly solution?: string;
  /** Solution as an ordered list of steps (numerals, per the style guide). */
  readonly steps?: readonly string[];
  /** Left empty when the source gives no feature list; the section is then hidden. */
  readonly features: readonly string[];
  readonly adoption?: {
    readonly caption: string;
    readonly columns: readonly [string, string, string, string];
    readonly rows: readonly (readonly [string, string, string, string])[];
  };
  readonly outcomes?: { readonly heading: string; readonly text: string };
  readonly about?: { readonly heading: string; readonly text: string };
  /** Hidden when absent. Never invent one: it needs a real, approved quote. */
  readonly quote?: { readonly text: string; readonly name: string; readonly role: string };
  /**
   * TODO: sample data. Replace every entry with a real case study (with written permission to
   * publish) and set this to false. While any entry is a placeholder the pages show a notice.
   */
  readonly placeholder: boolean;
};

export const caseStudiesContent = {
  eyebrow: 'Case studies',
  title: 'Results from real centres and schools',
  subtitle: 'See what changed after they started with CognitiveBotics.',
  filtersLabel: 'Case study groups',
  cta: { heading: 'Want this in your own centre or school?', body: 'Tell us about your team, then pick a time for your demo.', label: 'Book a demo', href: '/try-demo' },
} as const;

/** Filter rows on /case-studies; a group with no case studies is left out. */
export function caseStudyGroups(list: readonly CaseStudy[] = CASE_STUDIES): string[] {
  return ['Therapy centres', 'Schools'].filter((g) => list.some((c) => c.group === g));
}

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: 'manasa-institute',
    org: 'Manasa Institute',
    type: 'Therapy centre',
    group: 'Therapy centres',
    location: 'Hyderabad, Telangana',
    headline: 'Manasa Institute: 3.2× more weekly active users, and clearer progress for parents',
    cover: '/images/case-studies/manasa-institute.webp',
    summary:
      'Manasa Institute of Child Health & Disability Studies brings therapists, teachers and parents together around each child’s development. The centre partnered with CognitiveBotics to bring documentation, progress tracking and home learning into one connected place.',
    metaTitle: 'Manasa Institute Case Study | CognitiveBotics',
    metaDescription: 'How Manasa Institute connected documentation, progress tracking and home learning on CognitiveBotics, growing weekly active users 3.2×.',
    metrics: [
      { value: '3.2×', label: 'Weekly active users, up from 6 to 19' },
      { value: '~2/mo', label: 'Reported issues, from 13 a week to about 2 a month' },
      { value: '2/wk', label: 'On-site centre visits during onboarding' },
    ],
    challenge:
      'Therapists and teachers at Manasa spent long hours on documentation. It was hard to keep consistent, and hard to analyse a child’s progress in numbers as well as in words. Physical learning materials added to the workload, and no single view showed how a child was moving across their learning objectives. Keeping practice going at home was a challenge of its own.',
    challengeMore: [
      'Parents saw only part of the picture. They wanted to know what their child was learning, how that progress went beyond day-to-day observations, and how home activities connected to the work at the centre.',
    ],
    coreNeed: 'One connected place for documentation, progress tracking, therapist insights and learning at home.',
    steps: [
      'In-person demonstration at the centre for therapists and parents. Seeing the platform first-hand built early alignment and confidence.',
      'Onboarding: therapists and children were set up, and the team fitted the platform into the centre’s existing workflows.',
      'Visits twice a week in the early phase, for hands-on guidance, quick fixes and product feedback.',
      'A weekly virtual meeting with therapists to discuss needs and resolve concerns quickly.',
      'A dedicated support channel, so users could raise issues directly with the product team.',
    ],
    features: [],
    adoption: {
      caption: 'CognitiveBotics adoption',
      columns: ['Metric', 'Initial state', 'Later / current state', 'Story point'],
      rows: [
        ['Weekly active users', '6', '19', '3.2× increase in weekly active users'],
        ['Reported issues', '13 per week', '~2 per month', 'Significant reduction in reported issues over the partnership'],
      ],
    },
    outcomes: {
      heading: 'What improved for Manasa Institute of Child Health & Disability',
      text: 'Therapists valued the qualitative child reports most. The reports describe a child’s learning in plain language, beyond the numbers, which makes conversations with parents clearer and easier. The centre also observed clear improvements among children who used the platform consistently.',
    },
    about: {
      heading: 'About the organisation',
      text: 'Manasa Institute of Child Health & Disability Studies brings therapists, teachers and parents together around each child’s development. The centre partnered with CognitiveBotics to bring documentation, progress tracking and home learning into one connected place.',
    },
    placeholder: false,
  },
];

/** One in-page tab per section the study actually shows, in page order. Ids match the section ids in CaseStudyDetail. Labels are short so a tab never wraps; the full heading stays on the section. */
export function caseStudySections(c: CaseStudy): { id: string; label: string }[] {
  return [
    { id: 'challenge', label: 'Challenge' },
    ...(c.solution || c.steps?.length ? [{ id: 'solution', label: 'Solution' }] : []),
    ...(c.adoption ? [{ id: 'adoption', label: 'Adoption' }] : []),
    ...(c.outcomes ? [{ id: 'outcomes', label: 'Results' }] : []),
    ...(c.features.length ? [{ id: 'features', label: 'Features used' }] : []),
    ...(c.about ? [{ id: 'about', label: 'About' }] : []),
  ];
}

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
  const words = [
    c.summary,
    c.challenge,
    ...(c.challengeMore ?? []),
    c.coreNeed,
    c.solution,
    ...(c.steps ?? []),
    ...c.features,
    ...(c.adoption ? [c.adoption.caption, ...c.adoption.columns, ...c.adoption.rows.flat()] : []),
    c.outcomes?.heading,
    c.outcomes?.text,
    c.about?.heading,
    c.about?.text,
    c.quote?.text,
  ]
    .filter(Boolean)
    .join(' ').split(/\s+/).filter(Boolean).length;
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
        description: cs.metaDescription ?? cs.summary,
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
