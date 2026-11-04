import Image from 'next/image';
import Link from 'next/link';
import { CARD_GRID_SIZES } from '@/components/shared/card-sizes';
import { ReadTime } from '@/components/shared/ReadTime';
import { readMinutes, type CaseStudy } from './content';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <Link href={`/case-studies/${study.slug}`} className="cs-card group flex flex-col gap-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal">
      {/* alt is empty because the headline is the text under the card. */}
      <Image src={study.cover} alt="" width={7680} height={4320} sizes={CARD_GRID_SIZES} className="cs-cover aspect-[16/9] w-full object-cover" />
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="text-[14px] font-semibold text-content-secondary">{study.group}</p>
        <span aria-hidden="true" className="text-[14px] text-content-secondary">
          ·
        </span>
        <ReadTime minutes={readMinutes(study)} />
      </div>
      <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-dark">{study.headline}</h2>
      <span className="flex items-center gap-2 text-[16px] font-semibold text-content-brand">
        Read more
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
