export type Skill = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  /** Path under /public. */
  readonly image: string;
  readonly alt: string;
};

const skill = (id: string, title: string, body: string): Skill => ({
  id,
  title,
  body,
  image: `/images/therapy-centres/skills/${id}.webp`,
  alt: `${title} illustration`,
});

// The 10 skill areas, in the order the Therapy Centres page shows them. Pricing reuses the same cards.
export const SKILLS: readonly Skill[] = [
  skill('reading-writing', 'Reading & Writing', 'Builds reading, writing and comprehension skills.'),
  skill('arithmetic', 'Arithmetic Skill', 'Develops basic maths and problem-solving skills.'),
  skill('visual', 'Visual Skill', 'Helps children interpret visual information.'),
  skill('social', 'Social Skill', 'Builds communication and positive social interaction.'),
  skill('play', 'Play Skill', 'Encourages imaginative play, creativity and problem-solving.'),
  skill('self-help', 'Self-Help Skill', 'Builds independence in everyday activities.'),
  skill('attending', 'Attending Skill', 'Improves focus and attention during activities.'),
  skill('imitation', 'Imitation Skill', 'Encourages learning by observing and copying others.'),
  skill('receptive', 'Receptive Skill', 'Supports understanding of speech and instructions.'),
  skill('expressive', 'Expressive Skill', 'Helps communicate thoughts, needs and emotions.'),
];
