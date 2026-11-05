// Copy from reference/resources/copy.json (the "research" section of /resources).
export const researchContent = {
  title: 'Research',
  subtitle: 'Explore peer-reviewed research and validation studies showcasing how we deliver measurable outcomes',
  cta: { heading: 'See the platform behind the research', body: 'Pick a time and we’ll show you how it works in a centre or school.', label: 'Book a demo', href: '/try-demo' },
} as const;

export const RESEARCH_HREF_PREFIX = '/research/';

// The card shows a short plain-language title and a one-sentence takeaway. The formal paper titles
// stay on the detail pages (studies.ts). Every figure below is taken from that study's own page.
// `minutes` is the read time shown in the badge (the study text is about 120 words, so 1 min each).
// `tone` picks the paper tint: a lighter shade of the colour each card's badge had (see ResearchCard).
export const researchCards = [
  {
    href: '/research/effectiveness-of-artificial-intelligence-based-platform-in-administering-therapies-for-children-with-autism-spectrum-disorder-12-month-observational-study',
    title: 'AI therapy platform: 12-month study',
    description: '43 children, ages 2-18. Social age rose 56.84% with the platform.',
    minutes: 1,
    tone: 'teal',
  },
  {
    href: '/research/application-of-ai-based-learning-platform-for-children-with-asd-developmental-delay-and-intellectual-disability-a-prospective-cohort-study',
    title: 'AI learning platform: 90-day study',
    description: '60 children, run at NIEPID. Developmental age rose 18.93%.',
    minutes: 1,
    tone: 'amber',
  },
] as const;

export type ResearchCardData = (typeof researchCards)[number];
