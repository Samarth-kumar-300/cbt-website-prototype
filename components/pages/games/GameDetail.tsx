import Link from 'next/link';
import type { ReactNode } from 'react';
import { CtaPanel } from '@/components/shared/CtaPanel';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { JsonLd } from '@/components/shared/JsonLd';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { GameCard } from './GameCard';
import { GamePlayer } from './GamePlayer';
import { gameJsonLd, gameKicker, gamesContent as c, HERO_BG, relatedGames, type Game } from './content';

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-[3px] shrink-0 text-brand-teal">
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Fact({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-4">
      <h2 className="font-heading text-[18px] font-semibold leading-[24px] text-brand-dark">{title}</h2>
      {children}
    </div>
  );
}

export function GameDetail({ game }: { game: Game }) {
  const related = relatedGames(game.slug);
  const d = c.detail;
  return (
    <>
      <section className="px-5 pb-12 pt-[116px] lg:px-[84px] lg:pb-[72px] lg:pt-[140px]" style={{ background: HERO_BG }}>
        <div className="mx-auto flex max-w-[1248px] flex-col gap-5">
          <Link href="/games" className="inline-flex min-h-[44px] w-fit items-center gap-2 text-[16px] font-bold text-brand-teal hover:underline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="rotate-180">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {d.back}
          </Link>
          <div className="flex flex-col gap-2">
            <Eyebrow>{gameKicker(game)}</Eyebrow>
            <h1 className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[58px]">{game.name}</h1>
          </div>
          {/* Player and facts card share one row from 1400px, so they are the same height. Below 1400px they stack. */}
          <div className="grid gap-y-3 min-[1400px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] min-[1400px]:gap-x-6">
            <GamePlayer game={game} />
            {game.permissionNote && <p className="text-[14px] leading-[22px] text-text-secondary min-[1400px]:col-start-1 min-[1400px]:row-start-2">{game.permissionNote}</p>}
            <aside className="mt-3 flex flex-col divide-y divide-border-subtle overflow-hidden rounded-[20px] border-[1.5px] border-brand-teal-100 bg-white shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] min-[1400px]:col-start-2 min-[1400px]:row-start-1 min-[1400px]:mt-0">
              <Fact title={d.childDoes}>
                <p className="text-[15px] leading-[24px] text-text-default">{game.childDoes}</p>
              </Fact>
              {game.tasks && (
                <Fact title={d.tasks}>
                  <ul className="flex flex-wrap gap-2">
                    {game.tasks.map((t) => (
                      <li key={t} className="rounded-full border border-[#e4ded4] bg-white px-3 py-0.5 text-[14px] leading-[22px] text-brand-teal">
                        {t}
                      </li>
                    ))}
                  </ul>
                </Fact>
              )}
              <Fact title={d.howItWorks}>
                <p className="text-[15px] leading-[24px] text-text-default">{game.howItWorks}</p>
              </Fact>
              <Fact title={d.recorded}>
                <ul className="flex flex-col gap-1.5">
                  {d.recordedItems.map((item) => (
                    <li key={item} className="flex gap-2 text-[15px] leading-[24px] text-text-default">
                      <Check />
                      {item}
                    </li>
                  ))}
                </ul>
              </Fact>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section id="try-another" className="scroll-mt-[100px] px-5 py-12 lg:px-[84px] lg:py-[84px]">
          <div className="mx-auto flex max-w-[1248px] flex-col gap-6">
            <h2 className="font-heading text-[28px] font-semibold leading-[36px] text-brand-teal lg:text-[36px] lg:leading-[44px]">{d.related}</h2>
            <RevealStagger className="grid w-full grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {related.map((g) => (
                <GameCard key={g.slug} game={g} />
              ))}
            </RevealStagger>
          </div>
        </section>
      )}

      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} wideBody />
      <JsonLd data={gameJsonLd(game)} />
    </>
  );
}
