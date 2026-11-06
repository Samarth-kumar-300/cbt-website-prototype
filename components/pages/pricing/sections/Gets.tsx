import { Reveal } from '@/components/shared/Reveal';
import type { Audience } from '../content';
import { Check } from './Check';

export function Gets({ a }: { a: Audience }) {
  return (
    <section className="px-5 lg:px-24">
      <Reveal className="mx-auto max-w-[1248px]">
        <div className="flex flex-col gap-4 rounded-[24px] bg-brand-subtle-bg p-5 lg:gap-5 lg:p-8">
          <h3 className="font-heading text-[20px] font-bold leading-[28px] text-brand-teal lg:text-[22px] lg:leading-[30px]">{a.gets.heading}</h3>
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-8">
            {a.gets.items.map((item) => (
              <li key={item} className="flex gap-3 text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
