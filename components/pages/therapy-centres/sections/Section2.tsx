import Image from "next/image";
import { HorizontalScroller } from "@/components/shared/HorizontalScroller";
import { TextReveal } from "@/components/shared/TextReveal";

export function Section2() {
  return (
    <section className="bg-white px-5 pt-14 pb-14 lg:px-24 lg:pt-8 lg:pb-24">
      <HorizontalScroller
        label="Skills"
        className="mx-auto max-w-[1248px]"
        bodyClassName="mt-6"
        header={<TextReveal as="h2" split="words" trigger="scroll" className="max-w-[900px] font-heading text-[24px] font-semibold leading-[32px] text-content-brand-alt lg:text-[40px] lg:leading-[48px] lg:text-brand-teal">{"Skills empowering every child’s journey"}</TextReveal>}
      >
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/reading-writing.webp"
                alt="Reading & Writing illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              {"Reading & Writing"}
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Builds reading, writing and comprehension skills.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/arithmetic.webp"
                alt="Arithmetic Skill illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              Arithmetic Skill
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Develops basic maths and problem-solving skills.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/visual.webp"
                alt="Visual Skill illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              Visual Skill
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Helps children interpret visual information.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/social.webp"
                alt="Social Skill illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              Social Skill
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Builds communication and positive social interaction.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/play.webp"
                alt="Play Skill illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              Play Skill
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Encourages imaginative play, creativity and problem-solving.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/self-help.webp"
                alt="Self-Help Skill illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              Self-Help Skill
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Builds independence in everyday activities.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/attending.webp"
                alt="Attending Skill illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              Attending Skill
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Improves focus and attention during activities.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/imitation.webp"
                alt="Imitation Skill illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              Imitation Skill
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Encourages learning by observing and copying others.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/receptive.webp"
                alt="Receptive Skill illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              Receptive Skill
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Supports understanding of speech and instructions.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image
                src="/images/therapy-centres/skills/expressive.webp"
                alt="Expressive Skill illustration"
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-contain"
              />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              Expressive Skill
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Helps communicate thoughts, needs and emotions.
            </p>
          </div>
      </HorizontalScroller>
    </section>
  );
}
