import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GameDetail } from '@/components/pages/games/GameDetail';
import { GAMES, getGame } from '@/components/pages/games/content';

type Props = { params: Promise<{ slug: string }> };

// Only games in the list have a page; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  return {
    title: `${game.name} | Play a game | CognitiveBotics`,
    description: `${game.summary} Part of the ${game.skill} skill area on CognitiveBotics.`,
    alternates: { canonical: `/games/${game.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  return <GameDetail game={game} />;
}
