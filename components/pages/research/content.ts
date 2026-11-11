// Copy from reference/resources/copy.json (the "research" section of /resources).
export const researchContent = {
  title: 'Research',
  subtitle: 'Research with India’s clinical and government institutions, measuring real progress in children using CognitiveBotics.',
  cta: { heading: 'See the platform behind the research', body: 'Pick a time and we’ll show you how it works in a centre or school.', label: 'Book a demo', href: '/try-demo' },
} as const;

export const RESEARCH_HREF_PREFIX = '/research/';

export type ResearchPartner = {
  name: string;
  subLabel?: string;
  // The partner's own brand colour for its name, e.g. JMIR's navy. Falls back to the brand teal.
  nameColor?: string;
  // Logo shown just beside the name. Drop the file into public/research/ and reference it here, e.g. '/research/jmir-logo.svg'.
  // Until then the card shows the name alone.
  src?: string;
};

export type ResearchCardData = {
  href: string;
  headline: string;
  output: string;
  readTime: string;
  button: string;
  partner: ResearchPartner;
  tone: 'teal' | 'purple';
};

// Each card names the third party behind the study, a headline for what was studied and a short
// numeric output line. The formal paper titles stay on the detail pages (studies.ts).
export const researchCards: readonly ResearchCardData[] = [
  {
    href: '/research/effectiveness-of-artificial-intelligence-based-platform-in-administering-therapies-for-children-with-autism-spectrum-disorder-12-month-observational-study',
    headline: '12-month study, published in JMIR Neurotechnology',
    output: '+56.8% social age · +46.5% developmental age',
    readTime: '2 min read',
    button: 'Read the study',
    partner: { name: 'JMIR Neurotechnology', nameColor: '#1c2b57' },
    tone: 'teal',
  },
  {
    href: '/research/application-of-ai-based-learning-platform-for-children-with-asd-developmental-delay-and-intellectual-disability-a-prospective-cohort-study',
    headline: '90-day study at NIEPID, Govt of India',
    output: '59.57% more tasks done independently · +18.93% developmental age',
    readTime: '2 min read',
    button: 'Read the summary',
    partner: { name: 'NIEPID', subLabel: 'Govt of India' },
    tone: 'purple',
  },
];
