// Copy from reference/resources/copy.json (the "research" section of /resources).
export const researchContent = {
  title: 'Research',
  subtitle: 'Explore peer-reviewed research and validation studies showcasing how we deliver measurable outcomes',
  cta: { heading: 'See the platform behind the research', body: 'Pick a time and we’ll show you how it works in a centre or school.', label: 'Book a demo', href: '/try-demo' },
} as const;

export const RESEARCH_HREF_PREFIX = '/research/';

// The card shows a short plain-language title and a one-sentence takeaway. The formal paper titles
// stay on the detail pages (studies.ts). Every figure below is taken from that study's own page.
export const researchCards = [
  {
    href: '/research/effectiveness-of-artificial-intelligence-based-platform-in-administering-therapies-for-children-with-autism-spectrum-disorder-12-month-observational-study',
    title: 'AI therapy platform: 12-month study',
    description: '43 children, ages 2-18. Social age rose 56.84% with the platform.',
  },
  {
    href: '/research/application-of-ai-based-learning-platform-for-children-with-asd-developmental-delay-and-intellectual-disability-a-prospective-cohort-study',
    title: 'AI learning platform: 90-day study',
    description: '60 children, run at NIEPID. Developmental age rose 18.93%.',
  },
  {
    href: '/research/methods-for-aiding-persons-with-autism-to-acquire-skills',
    title: 'Patent for autism skill learning',
    description: 'Indian Patent No. 586929, valid through 2039.',
  },
] as const;

export type ResearchCardData = (typeof researchCards)[number];
