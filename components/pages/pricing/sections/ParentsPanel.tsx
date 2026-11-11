import { Reveal } from '@/components/shared/Reveal';
import { APP_LINKS } from '@/lib/app-links';
import { parentsPanel as c } from '../content';
import { ShareLink } from './ShareLink';
import { StoreBadge } from './StoreBadge';

export function ParentsPanel() {
  return (
    <section className="px-5 pb-12 lg:px-24 lg:pb-[84px]">
      <Reveal className="mx-auto max-w-[1248px]">
        <div className="flex flex-col gap-6 rounded-[24px] bg-[#f8f2f9] p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:rounded-[32px] lg:p-11">
          <div className="flex max-w-[780px] flex-col gap-3">
            <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-teal lg:text-[30px] lg:leading-[40px]">{c.heading}</h2>
            <p className="text-[15px] leading-[24px] text-text-default lg:text-[17px] lg:leading-[26px]">{c.body}</p>
            <ShareLink label={c.share} text={c.shareText} path="/parents" />
          </div>
          <div className="flex shrink-0 flex-row flex-wrap items-start gap-3 lg:flex-col">
            <StoreBadge store="google" href={APP_LINKS.googlePlay} label={c.googlePlay} height={45} />
            <StoreBadge store="apple" href={APP_LINKS.appStore} label={c.appStore} height={45} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
