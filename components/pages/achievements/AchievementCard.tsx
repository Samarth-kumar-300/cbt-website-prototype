import Image from 'next/image';
import type { Achievement } from './content';

// The whole card is one link to the certificate PDF; the "View Certificate" line is a span, not a nested link.
export function AchievementCard({ item }: { item: Achievement }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full w-full flex-1 flex-col items-start gap-3 rounded-[16px] border-[1.5px] border-brand-teal-100 bg-white p-3 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] card-lift hover:bg-background-brand-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal sm:gap-4 sm:rounded-[20px] sm:p-4 lg:p-5"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-[10px] bg-background-brand-subtle sm:rounded-[14px]">
        <Image
          src={item.thumbnail.src}
          alt={item.thumbnail.alt}
          fill
          sizes="(min-width: 1416px) 400px, (min-width: 1024px) calc((100vw - 216px) / 3), (min-width: 640px) calc((100vw - 64px) / 2), calc((100vw - 52px) / 2)"
          className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-visible:scale-[1.04]"
        />
      </div>
      <span
        className="inline-block rounded-[12px] px-[10px] py-[4px] text-[12px] leading-[16px] sm:rounded-full sm:py-[5px] sm:text-[14px] sm:leading-normal"
        style={{ backgroundColor: item.pillBg, color: item.pillColor }}
      >
        {item.pill}
      </span>
      <p className="font-heading text-[16px] font-semibold leading-[22px] sm:text-[18px] sm:leading-[24px] lg:text-[20px] lg:leading-[26px]" style={{ color: '#10494c' }}>
        {item.title}
      </p>
      <p className="block w-full min-w-0 text-[13px] leading-[19px] text-text-default sm:text-[16px] sm:leading-[24px] lg:text-[18px] lg:leading-[27px]">
        {item.body}
      </p>
      <span className="mt-auto flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
        {item.cta}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
        </svg>
      </span>
    </a>
  );
}
