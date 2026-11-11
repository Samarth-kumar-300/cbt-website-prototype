import type { FaqCardItem } from '@/components/shared/FaqCards';
import { faq as therapyFaq } from '../therapy-centres/content';
import type { PricingIconId } from './icons';

export const AUDIENCE_IDS = ['therapy-centres', 'schools'] as const;
export type AudienceId = (typeof AUDIENCE_IDS)[number];
export const DEFAULT_AUDIENCE: AudienceId = 'therapy-centres';

/** `?for=` value to audience. Only an exact first value of `schools` picks Schools. */
export function parseAudience(v: string | string[] | undefined): AudienceId {
  const first = Array.isArray(v) ? v[0] : v;
  return first === 'schools' ? 'schools' : DEFAULT_AUDIENCE;
}

/** Shown until Sales confirms "Who counts as a user?". A unit test pins which answers are still pending. */
export const PENDING_ANSWER = 'Answer coming soon.';
const pending = (q: string): FaqCardItem => ({ q, a: PENDING_ANSWER });

/** Colours from the client brand doc, scoped to the pricing page. The purple is the site's own secondary token. */
export const PRICING_AQUA = '#E4F4F6';
export const BLOOM_YELLOW = '#FEF0C7';

export const hero = {
  eyebrow: 'PRICING',
  titleLead: 'One platform for each neurodivergent child’s plan, practice and ',
  titleAccent: 'progress',
  subtitle:
    'Therapy and teaching happen a few hours a week. CognitiveBotics, the AI-powered early intervention platform for therapy centres and schools, carries your plans into each child’s day and shows the progress back to you.',
  partner: 'Working with NIEPID (Govt of India) under an MoU',
  // `tone` picks the figure or icon colour (TONES in sections/Hero.tsx).
  stats: [
    { figure: '59.57%', label: 'more tasks done independently', source: 'NIEPID 90-day study', tone: 'green' },
    { figure: '+56.8%', label: 'social age in 12 months', source: 'JMIR Neurotechnology', tone: 'teal' },
  ],
  credentials: [
    { title: 'Winner', source: 'UK–India HealthTech Accelerator 2025', icon: 'trophy', tone: 'amber' },
    { title: 'Winner', source: 'AP Govt MedTech Challenge', icon: 'trophy', tone: 'pink' },
    { title: 'ISO 27001 certified', source: 'DPDP Act readiness', icon: 'shield', tone: 'blue' },
  ],
} as const;

export type Feature = {
  /** Optional leading figure shown in brand purple, e.g. "400+". */
  readonly lead?: string;
  readonly title: string;
  readonly body: string;
  readonly icon: PricingIconId;
};

export type PlanCard = {
  readonly id: 'basic' | 'custom' | 'bloom';
  readonly name: string;
  readonly eyebrow?: string;
  readonly audience: string;
  readonly price: string;
  readonly unit?: string;
  readonly meta: string;
  readonly metaNote: string;
  readonly features: readonly string[];
  readonly cta: { readonly label: string; readonly href: string; readonly variant: 'solid' | 'outline' };
  readonly tone: 'plain' | 'bloom';
};

export type Audience = {
  readonly id: AudienceId;
  readonly tabLabel: string;
  readonly intro: { readonly heading: string; readonly lede: string; readonly highlight?: string };
  readonly features: readonly Feature[];
  readonly gets: { readonly heading: string; readonly items: readonly string[] };
  readonly plansHeading: string;
  readonly plans: readonly PlanCard[];
  readonly testimonials: { readonly heading: string; readonly order: readonly string[] };
  readonly faqHeading: string;
  readonly faq: readonly FaqCardItem[];
  readonly cta: { readonly heading: string; readonly body: string; readonly label: string; readonly href: string };
};

const basicPrice = { price: '₹2,000', unit: '/user/month', meta: 'Up to 5 users', metaNote: 'Excluding taxes' } as const;
const bookDemo = { label: 'Book a demo', href: '/try-demo?plan=basic', variant: 'solid' } as const;
const contactCustom = { label: 'Contact us', href: '/try-demo?plan=custom', variant: 'outline' } as const;

export const audiences: Record<AudienceId, Audience> = {
  'therapy-centres': {
    id: 'therapy-centres',
    tabLabel: 'Therapy Centres',
    intro: {
      heading: 'For therapy centres: grow beyond therapist hours',
      lede: 'Families stay when they see progress. Each therapist’s plan keeps working at home, between sessions.',
    },
    features: [
      { title: 'Personalised learning plans for each child', body: 'AI-drafted in about 10–15 minutes, then reviewed and finalised by your therapist.', icon: 'plan' },
      { lead: '400+', title: 'learning objectives across 10 skill areas', body: 'From attending and imitation to social, expressive and receptive skills.', icon: 'objectives' },
      { title: 'Game-based activities and social stories', body: 'With gaze, pose and speech detection built in.', icon: 'games' },
      { title: 'Guided videos for home practice', body: 'Parent training videos and guided co-learning in the parent app.', icon: 'home' },
      { title: 'Progress tracking per objective', body: 'Independent and prompted attempts, first-try rate and days practised.', icon: 'progress' },
      { title: 'Outcome reports, generated automatically', body: 'Mastery logs, skill-wise progress, time engaged and a monthly report.', icon: 'reports' },
    ],
    gets: {
      heading: 'What your centre gets',
      items: [
        'Less therapist time on planning, documentation and parent follow-ups',
        'Progress parents can see, between every session',
        'Live within a week',
      ],
    },
    plansHeading: 'Plans for therapy centres',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        audience: 'For centres starting with a core team',
        ...basicPrice,
        features: [
          'Personalised learning plans for each child',
          '400+ learning objectives across 10 skill areas',
          'Game-based activities and social stories',
          'Guided videos for home practice',
          'Progress tracking and outcome reports',
        ],
        cta: bookDemo,
        tone: 'plain',
      },
      {
        id: 'custom',
        name: 'Custom',
        audience: 'For larger teams and multi-branch centres',
        price: 'Custom pricing',
        meta: '6 or more users',
        metaNote: 'One licence per access, priced for your team size',
        features: ['Everything in Basic', 'Pricing based on the number of users', 'Live within a week'],
        cta: contactCustom,
        tone: 'plain',
      },
    ],
    testimonials: { heading: 'What centres and parents say', order: ['chandrashekhar', 'mounila'] },
    faqHeading: 'Questions centres ask before buying',
    faq: [
      pending('Who counts as a user?'),
      {
        q: 'What if we need more than 5 users, or have more than one branch?',
        a: 'Teams of 6 or more users get custom pricing, based on team size. Each branch needs its own licence per access. Contact us and we will put it together.',
      },
      { q: 'How quickly can our centre go live?', a: 'Therapy centres go live within a week.' },
      { q: 'Are prices inclusive of taxes?', a: 'No. Prices exclude taxes.' },
      {
        q: 'How does CognitiveBotics fit our existing therapy process?',
        a: 'It gives you one place for each child’s plan, home practice and progress, not another system to manage. The AI drafts and your therapists decide, with plans built on CARS, VSMS, DST and REEL.',
      },
      {
        q: 'Will parents actually use it?',
        a: 'Home activities are short, structured and guided, and the platform records time engaged, so your therapists can see what was practised.',
      },
      { q: 'Is children’s data safe?', a: 'CognitiveBotics is ISO 27001 certified, with DPDP Act readiness.' },
    ],
    cta: {
      heading: 'Find the right plan for your centre',
      body: 'Tell us about your team and the children you support. We’ll walk you through what’s included, how many users you need and how quickly your centre can go live, with no pressure to decide on the call.',
      label: 'Contact us',
      href: '/contact-us',
    },
  },
  schools: {
    id: 'schools',
    tabLabel: 'Schools',
    intro: {
      heading: 'For schools: inclusion that works across class, home and special educator',
      lede: 'Start with the 10–15% of learners who need structured support, then extend it to more.',
      highlight: '10–15%',
    },
    features: [
      { title: 'Personalised learning plans (IEPs) for each child', body: 'AI-drafted in about 10–15 minutes, then finalised by your special educator. Plans adapt with each child’s performance.', icon: 'plan' },
      { lead: '400+', title: 'learning objectives across 10 skill areas', body: 'Mapped to NCF Foundational Stage and ECCE.', icon: 'objectives' },
      { title: 'Classroom cues for class teachers', body: 'Simple cues tied to each child’s goals, ready to use in class.', icon: 'cues' },
      { title: 'Guided home practice', body: 'Daily IEP-aligned activities and take-home worksheets (sensory, motor, pencil control, drawing, cognitive) through the parent app.', icon: 'home' },
      { title: 'Progress tracking and outcome reports', body: 'Real-time dashboards, mastery logs, a monthly report and CBSE-compliant IEP documentation.', icon: 'reports' },
      { title: 'No exams, no labels', body: 'Progress is observed during activities, never graded. No diagnosis required.', icon: 'labels' },
    ],
    gets: {
      heading: 'What your school gets',
      items: [
        'Equips your special educator and documents the work',
        'One shared plan across special educator, class teacher and parent',
        'Live within 6 weeks',
      ],
    },
    plansHeading: 'Plans for schools',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        audience: 'For schools with a special educator, starting with the children who need structured support most',
        ...basicPrice,
        features: [
          'AI-drafted IEPs for each child',
          '400+ learning objectives across 10 skill areas',
          'Classroom cues for class teachers',
          'Guided home practice through the parent app',
          'Progress tracking and CBSE-compliant IEP documentation',
        ],
        cta: bookDemo,
        tone: 'plain',
      },
      {
        id: 'custom',
        name: 'Custom',
        audience: 'For schools extending support to more class teachers and learners',
        price: 'Custom pricing',
        meta: '6 or more users',
        metaNote: 'Priced for your team size',
        features: [
          'Everything in Basic',
          'More users across your special educator and class teachers',
          'Scale from the 10–15% towards more learners',
          'Live within 6 weeks',
        ],
        cta: contactCustom,
        tone: 'plain',
      },
      {
        id: 'bloom',
        name: 'BLOOM',
        eyebrow: 'NO SPECIAL EDUCATOR? START HERE',
        audience: 'For schools without a special educator',
        price: 'Custom pricing',
        meta: 'Tailored to your school',
        metaNote: 'Licences, services and on-site support',
        features: [
          'A CognitiveBotics-trained resource person placed in your school',
          'Everything in the platform',
          'Manages each child’s plan and supports class teachers',
          'Makes sure home practice reaches parents',
          'Live within 6 weeks',
        ],
        cta: { label: 'Contact us', href: '/contact-us', variant: 'outline' },
        tone: 'bloom',
      },
    ],
    testimonials: { heading: 'What educators and parents say', order: ['pavani', 'tejaswi'] },
    faqHeading: 'Questions schools ask before buying',
    faq: [
      pending('Who counts as a user?'),
      { q: 'What if we need more than 5 users?', a: 'Teams of 6 or more users get custom pricing, based on team size. Contact us and we will put it together.' },
      {
        q: 'We don’t have a special educator. Can we still start?',
        a: 'Yes. BLOOM places a CognitiveBotics-trained resource person in your school, with everything in the platform. Every BLOOM deployment is tailored to your school.',
      },
      { q: 'Can we start small?', a: 'Yes. Start with the 10–15% of learners who need structured support, then extend it to more learners.' },
      { q: 'How quickly can our school go live?', a: 'Schools go live within 6 weeks.' },
      { q: 'Are prices inclusive of taxes?', a: 'No. Prices exclude taxes.' },
      { q: 'Will this add work for our teachers?', a: 'No. Classroom cues arrive ready to use, and documentation happens as the work happens.' },
      { q: 'Will parents worry about labels?', a: 'No exams and no labels. Progress is observed during activities and celebrated, never graded.' },
      { q: 'Is student data safe?', a: 'CognitiveBotics is ISO 27001 certified, with DPDP Act readiness.' },
    ],
    cta: {
      heading: 'Find the right plan for your school',
      body: 'Tell us about your team and the children you support. We’ll walk you through what’s included, whether the platform or BLOOM suits you, and how quickly your school can go live, with no pressure to decide on the call.',
      label: 'Contact us',
      href: '/contact-us',
    },
  },
};

export const parentsPanel = {
  heading: 'For parents: explore CognitiveBotics with your child, free',
  body: 'The free app includes a limited set of lessons, so you can see how your child learns through play. A personalised plan and progress tracking come through your child’s therapist or school. Ask them about using CognitiveBotics together.',
  share: 'Know a parent who could use this? Share the app with them.',
  shareText: 'CognitiveBotics has a free app for parents of neurodivergent children.',
  googlePlay: 'Get it on Google Play',
  appStore: 'Download on the App Store',
} as const;

export const pricingContent = { hero, audiences, parentsPanel } as const;

function reuse(question: string) {
  const hit = therapyFaq.find((f) => f.q === question);
  if (!hit) throw new Error(`FAQ not found on Therapy Centres: ${question}`);
  return hit;
}

// The Pricing chip on /faqs and its FAQPage JSON-LD read this list. Keep it answered and unchanged.
export const pricingFaq: readonly FaqCardItem[] = [
  { q: 'Who counts as a user?', a: 'We’ll confirm the exact count in your demo.' },
  {
    q: 'What happens after I book a demo?',
    a: 'You pick a time right after you submit the form. Our team will get back to you in 2 to 3 business days.',
  },
  reuse('Is there published research behind this?'),
  reuse('Is CognitiveBotics suitable for NGOs, not just private therapy centres?'),
];
