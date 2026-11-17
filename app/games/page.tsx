import type { Metadata } from 'next';
import { GamesPage } from '@/components/pages/games/GamesPage';

export const metadata: Metadata = {
  title: 'Play a game | CognitiveBotics',
  description: 'Try the games children practise with on CognitiveBotics. One game for each of 10 skill areas, no sign-in needed.',
  alternates: { canonical: '/games' },
};

export default function Page() {
  return <GamesPage />;
}
