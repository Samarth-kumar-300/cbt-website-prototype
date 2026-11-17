import Link from 'next/link';

// The Find your path row from the home page: a full-width card with an accent colour per audience,
// a tinted hover, a lift and an arrow. The whole card is the link.
export function AudienceCard({ heading, body, href, color }: { heading: string; body: string; href: string; color: string }) {
  return (
    <Link
      href={href}
      style={{ '--row-color': color } as React.CSSProperties}
      className="group flex items-center gap-[14px] rounded-[16px] border-2 border-brand-teal-100 bg-white p-[18px] transition-all duration-200 motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1 hover:border-[var(--row-color)] focus-visible:border-[var(--row-color)] hover:bg-[color-mix(in_srgb,var(--row-color)_7%,white)] hover:shadow-[0px_10px_28px_-8px_rgba(23,94,99,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal lg:gap-3 lg:rounded-[14px] lg:border-[1.5px] lg:border-[#e4ded4] lg:p-6"
    >
      <div className="flex flex-1 flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-0">
        <p className="font-heading text-[16px] font-bold leading-[normal] lg:w-[240px] lg:shrink-0 lg:text-[20px] lg:leading-[26px]" style={{ color }}>
          {heading}
        </p>
        <p className="text-[14px] leading-[22px] text-text-default lg:flex-1 lg:text-[18px] lg:leading-[27px] lg:text-text-secondary">{body}</p>
      </div>
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
        style={{ color }}
      >
        <path d="M4 12h16m0 0-6-6m6 6-6 6" />
      </svg>
    </Link>
  );
}
