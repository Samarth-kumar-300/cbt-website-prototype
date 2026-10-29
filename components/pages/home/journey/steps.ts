export type JourneyStep = {
  id: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  bg: string;
  border: string;
};

export const JOURNEY_EYEBROW = "A CHILD'S GROWTH PATH";
export const JOURNEY_HEADING = 'One Connected Journey, Every Step of the Way';

export const JOURNEY_STEPS: readonly JourneyStep[] = [
  {
    id: 'meet',
    title: 'MEET THE CHILD',
    body: 'Understand each child’s unique learning needs.',
    src: '/images/homepage/steps01.webp',
    alt: 'Observing and understanding a child’s unique needs',
    bg: '#e9f5f2',
    border: '#cfe4de',
  },
  {
    id: 'answer',
    title: 'ANSWER QUESTIONS',
    body: 'Gain insights through developmental screening questions.',
    src: '/images/homepage/steps02.webp',
    alt: 'Turning observations into clearer developmental insights',
    bg: '#f4e4f5',
    border: '#e4c9e7',
  },
  {
    id: 'plan',
    title: 'ASSIGN PLAN',
    body: 'Create plans around individual developmental goals.',
    src: '/images/homepage/steps03.webp',
    alt: 'Building learning activities around developmental goals',
    bg: '#fff7de',
    border: '#efe3be',
  },
  {
    id: 'personalise',
    title: 'PERSONALISE LEARNING',
    body: 'Build skills through personalised learning activities.',
    src: '/images/homepage/steps04-v2.webp',
    alt: 'Adapting learning to a child’s pace and progress',
    bg: '#fce8e2',
    border: '#f0cfc2',
  },
  {
    id: 'monitor',
    title: 'MONITOR GROWTH',
    body: 'Track progress and adapt learning continuously.',
    src: '/images/homepage/steps05.webp',
    alt: 'Tracking meaningful progress over time',
    bg: '#e9fae5',
    border: '#cfe8c6',
  },
];

// The finale burst at the last node: the five card hues, alternating light and strong.
export const JOURNEY_SPARK_COLORS: readonly string[] = [
  '#7fc8bd', '#c79acc', '#f2c14e', '#f08a6a', '#7cc96b',
  '#b55aba', '#5fb3a6', '#f6d77a', '#f4a58b', '#a3dc94',
];
