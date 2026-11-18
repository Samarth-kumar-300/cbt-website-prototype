// Copy from reference/resources/copy.json (the "Achievements" section of /resources).
// Thumbnails are 1600x900 renders of each certificate, in public/achievements.
export const achievementsContent = {
  title: 'Achievements',
  subtitle: 'Our granted Indian patent, ISO 27001 certification and recognition from the Government of Andhra Pradesh.',
  cta: { heading: 'See the certified platform in action', body: 'We’ll walk your team through how it works.', label: 'Book a demo', href: '/try-demo' },
} as const;

export type Achievement = {
  readonly id: string;
  readonly href: string;
  readonly pill: string;
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  readonly thumbnail: { readonly src: string; readonly alt: string };
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
    thumbnail: { src: '/achievements/patent.webp', alt: 'Granted Indian patent certificate, No. 586929' },
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
    thumbnail: { src: '/achievements/iso.webp', alt: 'ISO 27001 certificate of registration' },
    pillBg: '#dff4fd',
    pillColor: '#646871',
  },
  {
    id: 'medtech',
    // The certificate image is served from this site, not from the CloudFront PDFs the other two cards use.
    href: '/achievements/ap-govt-medtech-certificate.webp',
    pill: 'Finalist • MedTech Innovation Challenge 2026',
    title: 'Certificate of Appreciation',
    body: 'Recognised by the Government of Andhra Pradesh as a finalist under the category of AI Powered Diagnostic Tools, for our healthcare solution and successful pilot deployment.',
    cta: 'View Certificate',
    thumbnail: { src: '/achievements/medtech-appreciation.webp', alt: 'Certificate of Appreciation from the Government of Andhra Pradesh to Cognitivebotics Technologies Pvt Ltd, finalist in the MedTech Innovation Challenge 2026' },
    pillBg: '#f3e5f7',
    pillColor: '#7b3a8f',
  },
] as const;
