export type Testimonial = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly audience: 'parent' | 'therapist' | 'school';
  /** File name (no extension) in public/images/homepage/avatars. */
  readonly avatar: string;
  /** Colour of the opening quote mark. */
  readonly color: string;
  readonly text: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'tejaswi',
    name: 'Tejaswi Kumar',
    role: 'Parent',
    audience: 'parent',
    avatar: 'tejaswi',
    color: '#a85923',
    text: 'We haven’t seen such a variety of activities in other apps or cartoons. He enjoys them and has even started using the app independently. Over the past two months, he has begun saying his name, answering questions and responding to people.',
  },
  {
    id: 'mounila',
    name: 'Mounila Thustam',
    role: 'Parent',
    audience: 'parent',
    avatar: 'mounila',
    color: '#4ca154',
    text: 'Nyra’s attention span has improved. The app fits well with her ongoing therapies as it gives her extra practice at home, and it has helped us spend more structured and meaningful time together.',
  },
  {
    id: 'chandrashekhar',
    name: 'Dr Chandrashekhar',
    role: 'Therapist Director, Resplice Child Development Center',
    audience: 'therapist',
    avatar: 'chandrashekhar',
    color: '#2d679c',
    text: 'In our therapy center, maintaining continuity was a challenge. CognitiveBotics has helped us address this with engaging, user-friendly activities that support parents, educators and therapists in building children’s independence.',
  },
  {
    id: 'pavani',
    name: 'Pavani',
    role: 'Parent',
    audience: 'parent',
    avatar: 'pavani',
    color: '#a95fb5',
    text: 'CognitiveBotics has been very helpful in continuing my child’s learning at home, especially with pointing and imitation skills. He has also started communicating his needs and I feel the app supports faster learning when used alongside therapy.',
  },
];
