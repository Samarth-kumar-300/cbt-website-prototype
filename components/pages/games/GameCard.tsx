import Image from 'next/image';
import Link from 'next/link';
import { METHOD_SENTENCE, type Game, type Tint } from './content';

export const TINT: Record<Tint, string> = {
  yellow: 'bg-[#fdf0c9]',
  blue: 'bg-[#d7edfb]',
  green: 'bg-[#e1fbe3]',
  peach: 'bg-[#fbe8dc]',
};

// Same shape as the Achievements card: bordered 20px card, 16:9 rounded image, one pill, title, body, link row.
// Until a game has a screenshot the image slot is a soft tint, and a play icon marks the games you can open.
const CARD = 'flex h-full w-full flex-1 flex-col items-start gap-3 rounded-[16px] border-[1.5px] border-brand-teal-100 bg-white p-3 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] sm:gap-4 sm:rounded-[20px] sm:p-4 lg:p-5';

// Two cards per row on phones and tablets, 3 from lg: 20px page padding below lg, 84px from lg, 1248px max width, 24px gaps.
const GAME_GRID_SIZES = '(min-width: 1416px) 400px, (min-width: 1024px) calc((100vw - 216px) / 3), (min-width: 640px) calc((100vw - 64px) / 2), calc((100vw - 52px) / 2)';

// alt is empty because the game name is the text under the image, and the image repeats it.
function Tile({ game }: { game: Game }) {
  return (
    <div aria-hidden="true" className={`relative aspect-video w-full shrink-0 overflow-hidden rounded-[10px] sm:rounded-[14px] ${TINT[game.tint]}`}>
      <Image
        src={game.thumbnail}
        alt=""
        fill
        sizes={GAME_GRID_SIZES}
        className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-visible:scale-[1.04]"
      />
    </div>
  );
}

function Pill({ children }: { children: string }) {
  return <span className="inline-block rounded-full bg-brand-subtle-bg px-[10px] py-[4px] text-[13px] font-medium text-brand-dark sm:py-[5px] sm:text-[14px]">{children}</span>;
}

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      data-game={game.slug}
      className={`group ${CARD} card-lift hover:bg-background-brand-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal`}
    >
      <Tile game={game} />
      <Pill>{game.skill}</Pill>
      <p className="font-heading text-[16px] font-semibold leading-[22px] text-brand-dark sm:text-[18px] sm:leading-[24px] lg:text-[20px] lg:leading-[26px]">{game.name}</p>
      <p className="hidden w-full min-w-0 text-[14px] leading-[22px] text-text-default sm:block lg:text-[16px] lg:leading-[24px]">
        {game.summary}
        {game.method ? ` ${METHOD_SENTENCE[game.method]}` : ''}
      </p>
      <span className="mt-auto flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
        Play now
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 12h16m0 0-6-6m6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
