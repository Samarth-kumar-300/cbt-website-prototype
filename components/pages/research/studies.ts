// Copy from the live detail pages (cognitivebotics.com/resources/research/<slug>), one entry per Research card.
// The page body is a flat list of blocks so the copy stays plain data.
export type StudyBlock =
  | { readonly type: 'heading'; readonly text: string }
  | { readonly type: 'paragraph'; readonly text: string }
  | { readonly type: 'list'; readonly items: readonly string[] };

export type Study = {
  readonly slug: string;
  readonly pill: string;
  readonly pillBg: string;
  readonly pillColor: string;
  readonly title: string;
  /** The hero button: the live site links both studies to the NIEPID letter and the patent to its PDF. */
  readonly button: { readonly label: string; readonly href: string };
  readonly blocks: readonly StudyBlock[];
  readonly status: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
};

export const STUDIES: readonly Study[] = [
  {
    slug: 'effectiveness-of-artificial-intelligence-based-platform-in-administering-therapies-for-children-with-autism-spectrum-disorder-12-month-observational-study',
    pill: '12-Month Observational Study',
    pillBg: '#ddf3f4',
    pillColor: '#10494c',
    title:
      'Effectiveness of Artificial Intelligence-Based Platform in Administering Therapies for Children With Autism Spectrum Disorder: 12-Month Observational Study',
    button: {
      label: 'View research paper',
      href: 'https://d2gq2a16cq5v8g.cloudfront.net/documents/NIEPID_Validation_Letter.pdf',
    },
    blocks: [
      {
        type: 'heading',
        text: 'Methodology',
      },
      {
        type: 'paragraph',
        text: 'A 12-month observational study involving 43 children (aged 2-18 years) diagnosed with ASD.',
      },
      {
        type: 'paragraph',
        text: 'Participants were divided into:',
      },
      {
        type: 'list',
        items: ['Intervention group (n=35): Received standard therapy + CognitiveBotics platform.', 'Control group (n=5): Received only standard therapy.'],
      },
      {
        type: 'paragraph',
        text: 'Standardized assessments used:',
      },
      {
        type: 'list',
        items: [
          'Childhood Autism Rating Scale (CARS)',
          'Vineland Social Maturity Scale (VSMS)',
          'Developmental Screening Test (DST)',
          'Receptive Expressive Emergent Language Test (REEL)',
        ],
      },
      {
        type: 'heading',
        text: 'Key Findings',
      },
      {
        type: 'paragraph',
        text: 'The intervention group showed statistically significant improvements (p < .001) across all domains:',
      },
      {
        type: 'list',
        items: [
          'CARS score reduced by 15.18%',
          'Social Age increased by 56.84%',
          'Developmental Age increased by 46.49%',
          'Receptive Language improved by 56.22%',
          'Expressive Language improved by 59.93%',
        ],
      },
      {
        type: 'paragraph',
        text: 'The control group showed marginal or non-significant changes in these domains.',
      },
    ],
    status: 'Status: Published in JMIR Neurotechnology, 2025; DOI: 10.2196/70589',
    metaTitle: '12-Month Study of an AI Platform for Autism Therapy',
    metaDescription: 'Discover findings from a 12-month observational study evaluating an AI-based platform for administering autism therapies.',
  },

  {
    slug: 'application-of-ai-based-learning-platform-for-children-with-asd-developmental-delay-and-intellectual-disability-a-prospective-cohort-study',
    pill: 'A Prospective Cohort Study',
    pillBg: '#dff4fd',
    pillColor: '#387792',
    title: 'Application of AI-Based Learning Platform for Children with ASD, Developmental Delay, and Intellectual Disability - A Prospective Cohort Study',
    button: {
      label: 'View research paper',
      href: 'https://d2gq2a16cq5v8g.cloudfront.net/documents/NIEPID_Validation_Letter.pdf',
    },
    blocks: [
      {
        type: 'heading',
        text: 'Institution/Partner',
      },
      {
        type: 'paragraph',
        text: 'National Institute for the Empowerment of Persons with Intellectual Disabilities (NIEPID), Ministry of Social Justice & Empowerment, Govt. of India',
      },
      {
        type: 'heading',
        text: 'Methodology',
      },
      {
        type: 'paragraph',
        text: 'A 90-day prospective cohort study with 60 children (mental age 2-7 years) clinically diagnosed with mild to moderate ASD, ID or DD.',
      },
      {
        type: 'paragraph',
        text: 'Participants were divided into:',
      },
      {
        type: 'list',
        items: ['Experimental group (n=30): Received standard therapy + CognitiveBotics platform', 'Control group (n=30): Received only standard therapy'],
      },
      {
        type: 'paragraph',
        text: 'Primary tools used:',
      },
      {
        type: 'list',
        items: ['Developmental Screening Test (DST)', 'Vineland Social Maturity Scale (VSMS)', 'CognitiveBotics Checklist (CBT Checklist)'],
      },
      {
        type: 'heading',
        text: 'Key Findings',
      },
      {
        type: 'paragraph',
        text: 'Statistically significant improvements were observed in the experimental group:',
      },
      {
        type: 'list',
        items: [
          'Developmental Age: +18.93% (p = 0.00003)',
          'Developmental Quotient: +11.23% (p = 0.00006)',
          'Social Age: +12.55% (p = 0.000009)',
          'Social Quotient: +6.39% (p = 0.000014)',
          'Independent task completion increased by 59.56%',
        ],
      },
      {
        type: 'paragraph',
        text: 'The control group showed minor gains in developmental age, and a decline in social quotient.',
      },
    ],
    status: 'Status: Completed at NIEPID, 2025',
    metaTitle: 'AI Learning Platform Cohort Study: ASD and Developmental Delay',
    metaDescription:
      'Read about a prospective cohort study exploring an AI-based learning platform for children with autism, developmental delays and intellectual disabilities.',
  },

  {
    slug: 'methods-for-aiding-persons-with-autism-to-acquire-skills',
    pill: 'Granted Indian Patent • No. 586929',
    pillBg: '#fff7de',
    pillColor: '#998035',
    title: 'Methods for Aiding Persons with Autism to Acquire Skills',
    button: {
      label: 'View patent details',
      href: 'https://d2gq2a16cq5v8g.cloudfront.net/documents/CognitiveBotics_India_Patent.pdf',
    },
    blocks: [
      {
        type: 'heading',
        text: 'Patentee',
      },
      {
        type: 'paragraph',
        text: 'Cognitive Botics Technologies Pvt. Ltd.',
      },
      {
        type: 'heading',
        text: 'Granted By',
      },
      {
        type: 'paragraph',
        text: 'The Patent Office, Government of India',
      },
      {
        type: 'heading',
        text: 'Patent No.',
      },
      {
        type: 'paragraph',
        text: '586929',
      },
      {
        type: 'heading',
        text: 'What This Patent Covers',
      },
      {
        type: 'paragraph',
        text: 'This patent protects CognitiveBotics’ proprietary methodology for delivering structured, AI-guided skill acquisition to children with autism. Filed on 8 August 2019 (Application No. 201941032153), it was formally examined and granted by the Patent Office, Government of India, under the Patents Act, 1970 - recognizing the approach as a novel, patentable invention rather than a standard software feature.',
      },
      {
        type: 'heading',
        text: 'Why It Matters',
      },
      {
        type: 'paragraph',
        text: 'Patent protection runs for 20 years from the filing date, through 2039. For therapy centers, schools and partners evaluating CognitiveBotics, this means the technology behind every child’s learning plan is both clinically validated and legally protected as original intellectual property - not something competitors can freely replicate.',
      },
    ],
    status: 'Patent No. 586929 - Granted by the Patent Office, Government of India',
    metaTitle: 'Indian Patent 586929: Helping Persons with Autism Learn Skills',
    metaDescription: 'Learn about Indian Patent No. 586929 and the patented methods designed to help persons with autism acquire skills.',
  },
];

export function getStudy(slug: string): Study | undefined {
  return STUDIES.find((s) => s.slug === slug);
}
