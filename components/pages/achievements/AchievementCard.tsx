import type { Achievement } from './content';

export function AchievementCard({ item }: { item: Achievement }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full flex-1 flex-col items-start gap-4 rounded-[20px] border-[1.5px] border-brand-teal-100 bg-white px-6 py-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] card-lift hover:bg-background-brand-subtle lg:px-7 lg:py-7 lg:min-h-[420px]"
    >
      <span
        data-icon
        className="flex size-10 shrink-0 items-center justify-center rounded-full lg:size-12"
        style={{ backgroundColor: item.iconBg }}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="lg:size-6"
          style={{ color: item.iconColor }}
        >
          <path d={item.iconPath}></path>
        </svg>
      </span>
      <span
        className="inline-block rounded-full px-[10px] py-[5px] text-[13px] max-lg:text-[14px] lg:text-[14px]"
        style={{ backgroundColor: item.pillBg, color: item.pillColor }}
      >
        {item.pill}
      </span>
      <p className="font-heading text-[18px] leading-[24px] lg:text-[20px] lg:leading-[26px] font-semibold" style={{ color: '#10494c' }}>
        {item.title}
      </p>
      <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">{item.body}</p>
      <div className="flex-1"></div>
      <span className="flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
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
