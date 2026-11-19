export type Method = 'gaze' | 'speech' | 'animation' | 'pose';
export type Tint = 'yellow' | 'blue' | 'green' | 'peach';

export type Game = {
  readonly slug: string;
  readonly skill: string;
  /** Detection method, or null while the web team has not confirmed it. */
  readonly method: Method | null;
  readonly name: string;
  /** One line on what the child does. */
  readonly summary: string;
  readonly tint: Tint;
  /** 16:9 card image, 1600 x 900, in public/images/games/thumbs/. The tint shows while it loads. */
  readonly thumbnail: string;
  /** Copy for the detail page. */
  readonly howItWorks: string;
  readonly childDoes: string;
  /** The tasks the game works through, as on the platform's objective card. Hidden when absent. */
  readonly tasks?: readonly string[];
  /** Sentence shown under the player when the game needs a camera or microphone. */
  readonly permissionNote?: string;
  /**
   * TODO: playable URL (https) from the web team. Without one the player shows a coming-soon state.
   * Set when a game is hosted and allows embedding.
   */
  readonly embedUrl?: string;
};

/** One plain sentence on how a game senses the child, shown in the card body instead of a badge. */
export const METHOD_SENTENCE: Record<Method, string> = {
  gaze: 'Uses the camera to follow where the child looks.',
  speech: 'Uses the microphone to hear the child’s answers.',
  animation: 'Uses animation to guide play.',
  pose: 'Uses the camera to track hand movements.',
};

/** Hero band shared by the listing and the detail pages: the Schools hero gradient, with a flat bottom edge. */
export const HERO_BG = 'linear-gradient(90deg, rgba(244,228,245,0.8) 0%, rgba(221,243,244,0.8) 47%, rgba(255,247,222,0.8) 100%)';

const thumb = (slug: string) => `/images/games/thumbs/${slug}.webp`;

export const METHOD_LABEL: Record<Method, string> = {
  gaze: 'Gaze detection',
  speech: 'Speech detection',
  animation: 'Animation',
  pose: 'Pose detection',
};

export const gamesContent = {
  eyebrow: 'Try it yourself',
  title: 'Play the games children practise with on CognitiveBotics',
  subtitle: 'Each game builds one skill area and records how the child plays: on their own or with a prompt, on the first try or after a few. Pick a game and play, no sign-in needed.',
  heroImage: { src: '/images/games/hero-child-and-mascot-v2.webp', alt: 'A child plays a game on a tablet with an adult and the CognitiveBotics mascot' },
  gridHeading: 'One game for each skill area',
  gridSubtitle: 'Choose a game to see how it works, then play it.',
  permissionNote: 'Some games ask for camera or microphone access to detect gaze, pose or speech.',
  plan: {
    heading: 'How a game fits into a child’s plan',
    steps: [
      { icon: 'assign', bg: '#fffbeb', color: '#b45309', title: 'Assign', body: 'The therapist or special educator adds the objective to the child’s plan. Plans are AI-drafted in about 10–15 minutes, then reviewed and finalised.' },
      { icon: 'practise', bg: '#f0fdf4', color: '#15803d', title: 'Practise', body: 'The child plays at home through the parent app, or in class.' },
      { icon: 'track', bg: '#f0f9ff', color: '#0369a1', title: 'Track', body: 'Progress appears for each objective: independent and prompted attempts, first-try rate and days practised.' },
    ],
  },
  audiencesEyebrow: 'Where would you like to go next?',
  audiencesHeading: 'Find your path',
  /** Same cards and colours as Find your path on the home page. */
  audiences: [
    { heading: 'For therapy centres', body: 'Delivering consistent, high-quality care at scale.', href: '/therapy-centres', color: '#15803d' },
    { heading: 'For parents', body: 'Understanding your child: guidance, clarity and support.', href: '/parents', color: '#b45309' },
    { heading: 'For schools', body: 'Creating inclusive classrooms where every child belongs.', href: '/schools', color: '#0369a1' },
  ],
  cta: { heading: 'See the full platform behind the games', body: 'Plans, home practice and progress tracking, for your centre or school.', label: 'Book a demo', href: '/try-demo' },
  /** Placeholder for the real game: a macOS-style microphone prompt, then a "Game started" overlay. */
  startFlow: {
    permissionTitle: '“CognitiveBotics” would like to access the microphone.',
    permissionBody: 'The game uses the microphone to hear how your child responds.',
    deny: 'Don’t allow',
    allow: 'OK',
    started: 'Game started',
    close: 'Close',
  },
  detail: {
    back: 'All games',
    start: 'Start the game',
    unavailable: 'This game isn’t live on the site yet',
    unavailableBody: 'Pick another game to play in the meantime.',
    unavailableCta: 'Try another game',
    childDoes: 'What the child does',
    tasks: 'Tasks',
    howItWorks: 'How it works',
    recorded: 'What gets recorded',
    recordedItems: ['Independent and prompted attempts', 'First-try rate', 'Days practised'],
    related: 'Try another game',
  },
} as const;

// Used by the paused games below; kept so they can be restored as they were.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HOW_GENERIC = 'The game gives the child a prompt on screen and records how they respond.';

// Card order is the order on the listing page.
export const GAMES: readonly Game[] = [
  {
    slug: 'learn-to-look',
    thumbnail: thumb('learn-to-look'),
    skill: 'Attending',
    method: 'gaze',
    name: 'Learn to look',
    summary: 'The child looks at the right object on screen.',
    tint: 'yellow',
    childDoes: 'Looks at the right object on screen when asked.',
    tasks: ['Look at the object 1', 'Look at the object 2', 'Look at the object 3', 'Look at the object 4', 'Look at the object 5'],
    howItWorks: 'Gaze detection uses the device camera to check where the child is looking.',
    permissionNote: 'This game asks for camera access to detect where the child is looking.',
  },
  {
    slug: 'label-common-objects',
    thumbnail: thumb('label-common-objects'),
    skill: 'Expressive',
    method: 'speech',
    name: 'Label common objects',
    summary: 'The child names everyday objects out loud.',
    tint: 'blue',
    childDoes: 'Learns to name some objects.',
    tasks: ['Bubbles', 'Train', 'Cookies', 'Car', 'Banana'],
    howItWorks: 'Speech detection uses the device microphone to hear the word the child says.',
    permissionNote: 'This game asks for microphone access to hear the child’s answers.',
  },
  /* Paused: not in the launch set of 4 skills. Restore by moving it out of this comment.
  {
    slug: 'identify-numbers',
    thumbnail: thumb('identify-numbers'),
    skill: 'Arithmetic',
    method: null,
    name: 'Identify numbers',
    summary: 'The child learns the numbers 1 to 10.',
    tint: 'green',
    childDoes: 'Learns the numbers 1 to 10.',
    tasks: ['1', '2', '3', '4', '5'],
    howItWorks: HOW_GENERIC,
  },
  */
  {
    slug: 'identify-common-objects',
    thumbnail: thumb('identify-common-objects'),
    skill: 'Receptive',
    method: 'animation',
    name: 'Identify common objects',
    summary: 'The child finds the object they’re asked for.',
    tint: 'peach',
    childDoes: 'Learns to recognise some objects.',
    tasks: ['Bubbles', 'Train', 'Cookies', 'Car', 'Banana'],
    howItWorks: 'The game gives a spoken prompt with animation, and the child taps the matching object.',
  },
  {
    slug: 'imitate-with-hands',
    thumbnail: thumb('imitate-with-hands'),
    skill: 'Imitation',
    method: 'pose',
    name: 'Imitate with hands',
    summary: 'The child copies the hand movements shown.',
    tint: 'yellow',
    childDoes: 'Learns to imitate actions with hands modelled by an adult.',
    tasks: ['Hands on head', 'Hands on shoulder', 'Touch nose', 'Wave hand', 'Clap hands'],
    howItWorks: 'Pose detection uses the device camera to check the child’s hand positions.',
    permissionNote: 'This game asks for camera access to detect hand movements.',
  },
  /* Paused: not in the launch set of 4 skills. Restore by moving it out of this comment.
  {
    slug: 'associative-matching',
    thumbnail: thumb('associative-matching'),
    skill: 'Visual',
    method: null,
    name: 'Associative matching',
    summary: 'The child learns to match pairs.',
    tint: 'blue',
    childDoes: 'Learns to match pairs.',
    tasks: ['Fish', 'Toothbrush', 'Crayon', 'Bird', 'Shoe'],
    howItWorks: HOW_GENERIC,
  },
  */
  /* Paused: not in the launch set of 4 skills. Restore by moving it out of this comment.
  {
    slug: 'pretend-play',
    thumbnail: thumb('pretend-play'),
    skill: 'Play',
    method: null,
    name: 'Pretend play',
    summary: 'The child learns pretend play.',
    tint: 'green',
    childDoes: 'Learns pretend play.',
    tasks: ['Doctor', 'Firefighter', 'Pirate', 'Teacher', 'Hairdresser'],
    howItWorks: HOW_GENERIC,
  },
  */
  /* Paused: not in the launch set of 4 skills. Restore by moving it out of this comment.
  {
    slug: 'brushing-teeth',
    thumbnail: thumb('brushing-teeth'),
    skill: 'Self-help',
    method: null,
    name: 'Brushing teeth',
    summary: 'The child learns about brushing teeth.',
    tint: 'peach',
    childDoes: 'Learns about brushing teeth.',
    tasks: ['Tooth brush', 'Tooth paste', 'Tooth brush with toothpaste', 'Water glass', 'Tap'],
    howItWorks: HOW_GENERIC,
  },
  */
  /* Paused: not in the launch set of 4 skills. Restore by moving it out of this comment.
  {
    slug: 'ask-for-actions',
    thumbnail: thumb('ask-for-actions'),
    skill: 'Social',
    method: null,
    name: 'Ask for actions',
    summary: 'The child learns to ask for an action.',
    tint: 'yellow',
    childDoes: 'Learns to ask for an action.',
    tasks: ['Run', 'Stop', 'Open', 'Jump', 'Hide'],
    howItWorks: HOW_GENERIC,
  },
  */
  /* Paused: not in the launch set of 4 skills. Restore by moving it out of this comment.
  {
    slug: 'identify-alphabets',
    thumbnail: thumb('identify-alphabets'),
    skill: 'Reading and writing',
    method: null,
    name: 'Identify alphabets',
    summary: 'The child learns to read and write alphabets.',
    tint: 'blue',
    childDoes: 'Learns to read and write alphabets.',
    tasks: ['A', 'B', 'C', 'D', 'E'],
    howItWorks: HOW_GENERIC,
  },
  */
];

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}

/** Up to `count` other games, starting after this one and wrapping, so every game gets a different set. */
export function relatedGames(slug: string, count = 3, list: readonly Game[] = GAMES): Game[] {
  const i = list.findIndex((g) => g.slug === slug);
  const others = [...list.slice(i + 1), ...list.slice(0, Math.max(i, 0))].filter((g) => g.slug !== slug);
  return others.slice(0, count);
}

/** The line above a game's title, in sentence case: skill area, then method when known. */
export function gameKicker(g: Game): string {
  return g.method ? `${g.skill} · ${METHOD_LABEL[g.method]}` : g.skill;
}

/** Only https URLs may load in the player. */
export const isEmbeddable = (url?: string): url is string => typeof url === 'string' && /^https:\/\//.test(url);

export const SITE = 'https://cognitivebotics.com';

export function gameJsonLd(g: Game) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: g.name,
        description: g.summary,
        url: `${SITE}/games/${g.slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Games', item: `${SITE}/games` },
          { '@type': 'ListItem', position: 2, name: g.name, item: `${SITE}/games/${g.slug}` },
        ],
      },
    ],
  };
}
