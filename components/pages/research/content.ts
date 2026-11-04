// Copy from reference/resources/copy.json (the "research" section of /resources).
export const researchContent = {
  title: 'Research',
  subtitle: 'Explore peer-reviewed research and validation studies showcasing how we deliver measurable outcomes',
  cta: { heading: 'Want results like these?', label: 'Book a demo', href: '/try-demo' },
} as const;

export const RESEARCH_HREF_PREFIX = '/research/';

export const researchCards = [
  {
    href: '/research/effectiveness-of-artificial-intelligence-based-platform-in-administering-therapies-for-children-with-autism-spectrum-disorder-12-month-observational-study',
    pill: '12-Month Observational Study',
    title:
      'Effectiveness of Artificial Intelligence–Based Platform in Administering Therapies for Children With Autism Spectrum Disorder: 12-Month Observational Study',
    iconBg: '#eef9f9',
    iconColor: '#207d82',
    pillBg: '#ddf3f4',
    pillColor: '#175f63',
    iconPath:
      'M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M16 13H8m8 4H8m2-8H8m6-7H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 4.28 4 5.12 4 6.8v10.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C6.28 22 7.12 22 8.8 22h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 19.72 20 18.88 20 17.2V8l-6-6Z',
  },
  {
    href: '/research/application-of-ai-based-learning-platform-for-children-with-asd-developmental-delay-and-intellectual-disability-a-prospective-cohort-study',
    pill: 'A Prospective Cohort Study',
    title:
      'Application of AI-Based Learning Platform for Children with ASD, Developmental Delay and Intellectual Disability – A Prospective Cohort Study',
    iconBg: '#f0f9ff',
    iconColor: '#0369a1',
    pillBg: '#dff4fd',
    pillColor: '#387792',
    iconPath:
      'M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M14 17H8m8-4H8m12-3.012V17.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C6.28 2 7.12 2 8.8 2h3.212c.733 0 1.1 0 1.446.083.306.073.598.195.867.36.303.185.562.444 1.08.963l3.19 3.188c.518.519.777.778.963 1.081a3 3 0 0 1 .36.867c.082.346.082.712.082 1.446Z',
  },
  {
    href: '/research/methods-for-aiding-persons-with-autism-to-acquire-skills',
    pill: 'Granted Indian Patent • No. 586929',
    title: 'Methods for Aiding Persons with Autism to Acquire Skills',
    iconBg: '#fffbeb',
    iconColor: '#b45309',
    pillBg: '#fff7de',
    pillColor: '#998035',
    iconPath:
      'M10 17.659V20a2 2 0 1 0 4 0v-2.341M12 2v1m-9 9H2m3.5-6.5-.6-.6m13.6.6.6-.6M22 12h-1m-3 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z',
  },
] as const;

export type ResearchCardData = (typeof researchCards)[number];
