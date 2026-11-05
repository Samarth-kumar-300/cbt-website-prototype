// Copy from reference/resources/copy.json (the "Achievements" section of /resources).
// The ISO card has no image on the original, only the icon treatment below.
export const achievementsContent = {
  title: 'Achievements',
  subtitle: 'Our granted Indian patent and ISO 27001 certification.',
  cta: { heading: 'See the certified platform in action', body: 'We’ll walk your team through how it works.', label: 'Book a demo', href: '/try-demo' },
} as const;

export type Achievement = {
  readonly id: string;
  readonly href: string;
  readonly pill: string;
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  readonly iconPath: string;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly pillBg: string;
  readonly pillColor: string;
};

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: 'patent',
    href: 'https://d2gq2a16cq5v8g.cloudfront.net/documents/CognitiveBotics_India_Patent.pdf',
    pill: 'Granted Indian Patent • No. 586929',
    title: 'Methods for Aiding Persons with Autism to Acquire Skills',
    body: 'Granted by the Patent Office, Government of India - protecting CognitiveBotics’ AI-guided skill-acquisition methodology for children with autism through 2039.',
    cta: 'View Certificate',
    iconPath:
      'M10 17.659V20a2 2 0 1 0 4 0v-2.341M12 2v1m-9 9H2m3.5-6.5-.6-.6m13.6.6.6-.6M22 12h-1m-3 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z',
    iconBg: '#fffbeb',
    iconColor: '#b45309',
    pillBg: '#fff7de',
    pillColor: '#998035',
  },
  {
    id: 'iso',
    href: 'https://d2gq2a16cq5v8g.cloudfront.net/documents/Final-ISO-27001-Certificate-2026.pdf',
    pill: 'Certified',
    title: 'ISO Certification',
    body: 'ISO 27001 certified',
    cta: 'View Certificate',
    iconPath:
      'M7.967 14.722 7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 0 1 .214 0c.08.017.155.062.305.152L17 22l-.966-7.279M19 9A7 7 0 1 1 5 9a7 7 0 0 1 14 0Z',
    iconBg: '#f0f9ff',
    iconColor: '#0369a1',
    pillBg: '#dff4fd',
    pillColor: '#646871',
  },
] as const;
