import { TextReveal } from "@/components/shared/TextReveal";
import { Placeholder } from "@/components/shared/Placeholder";

export function Section3() {
  return (
    <section className="bg-[#fafcfb] px-5 py-14 lg:px-24 lg:py-[90px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-5 lg:flex-row lg:gap-5">
        <div className="flex flex-1 flex-col items-start gap-3 lg:shrink-0 lg:basis-[360px] lg:gap-5">
          <div className="relative h-[24px] w-[200px] max-w-full lg:h-[42px] lg:w-[360px]">
            <Placeholder
              label="CognitiveBotics Bloom"
              className="object-contain object-left"
            />
          </div>
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{"Tailored implementation, built around your school’s needs"}</TextReveal>
          <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
            Every child has unique learning needs and schools need the right
            tools to support them. CognitiveBotics connects educators,
            specialists and families to personalise learning, track progress
            and help every child thrive.
          </p>
        </div>
        <div className="relative h-[200px] w-full max-w-[300px] shrink-0 lg:h-[372px] lg:min-w-0 lg:max-w-[558px] lg:shrink lg:basis-[558px]">
          <Placeholder label="Image" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
