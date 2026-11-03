import Image from 'next/image';
import type { Testimonial } from '@/lib/testimonials';

export function QuoteCard({ quote, clamp = false }: { quote: Testimonial; clamp?: boolean }) {
  return (
    <figure className="m-0 flex h-full w-full flex-col gap-[14px] rounded-[20px] bg-white px-5 pb-[22px] pt-[34px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)] lg:px-6">
      <span
        aria-hidden="true"
        className="block h-[17px] w-[21px] font-heading text-[54px] font-extrabold leading-[17px]"
        style={{ color: quote.color }}
      >
        “
      </span>
      <blockquote className={`m-0 text-[14px] leading-[22px] text-text-default lg:text-[16px] lg:leading-[24px] ${clamp ? 'line-clamp-6' : ''}`}>
        {quote.text}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <Image
          src={`/images/homepage/avatars/${quote.avatar}.webp`}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full ring-1 ring-[#e4ded4]"
        />
        <span className="flex flex-col gap-[2px]">
          <span className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal">{quote.name}</span>
          <span className="text-[14px] leading-[21px] text-[#646871]">{quote.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
