import Image from "next/image";
import { SKILLS } from "@/lib/skills";
import { HorizontalScroller } from "./HorizontalScroller";
import { TextReveal } from "./TextReveal";

export const SKILLS_HEADING = "Skills empowering every child’s journey";

// The illustrated skills row from Therapy Centres, shared with Pricing.
export function SkillsScroller({
  heading = SKILLS_HEADING,
  className = "bg-white px-5 pt-14 pb-14 lg:px-24 lg:pt-8 lg:pb-24",
}: {
  heading?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <HorizontalScroller
        label="Skills"
        className="mx-auto max-w-[1248px]"
        bodyClassName="mt-6"
        header={<TextReveal as="h2" split="words" trigger="scroll" className="max-w-[900px] font-heading text-[24px] font-semibold leading-[32px] text-content-brand-alt lg:text-[40px] lg:leading-[48px] lg:text-brand-teal">{heading}</TextReveal>}
      >
        {SKILLS.map((s) => (
          <div key={s.id} className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image src={s.image} alt={s.alt} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-contain" />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              {s.title}
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              {s.body}
            </p>
          </div>
        ))}
      </HorizontalScroller>
    </section>
  );
}
