import { CtaPanel } from '@/components/shared/CtaPanel';
import { PageHero } from '@/components/shared/PageHero';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { AchievementCard } from './AchievementCard';
import { ACHIEVEMENTS, achievementsContent as c } from './content';

export function AchievementsPage() {
  return (
    <>
      <PageHero title={c.title} subtitle={c.subtitle} />
      <section className="px-5 py-12 lg:px-[84px] lg:py-[84px]">
        <div className="mx-auto max-w-[1248px]">
          <RevealStagger className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            {ACHIEVEMENTS.map((item) => (
              <AchievementCard key={item.id} item={item} />
            ))}
          </RevealStagger>
        </div>
      </section>
      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} />
    </>
  );
}
