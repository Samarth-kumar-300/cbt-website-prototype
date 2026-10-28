import { TextReveal } from "@/components/shared/TextReveal";
import { MotionImage } from "@/components/shared/MotionImage";
import Image from "next/image";

export function Section3() {
  return (
    <section className="bg-[#fafcfb] px-5 pt-14 pb-0 lg:px-24 lg:pt-[90px] lg:pb-2">
      <div className="mx-auto flex max-w-[1248px] flex-col items-center gap-5 lg:flex-row lg:gap-5">
        <div className="flex flex-1 flex-col items-start gap-3 lg:shrink-0 lg:basis-[360px] lg:gap-5">
          <div className="relative h-[24px] w-[200px] max-w-full lg:h-[50px] lg:w-[427px]">
            <Image
              src="/images/schools/tailored-implementation-wordmark.webp"
              alt="CognitiveBotics Bloom"
              fill
              sizes="(min-width: 1024px) 427px, 200px"
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
        <MotionImage enter="curtain" className="relative h-[300px] w-full max-w-[450px] shrink-0 lg:h-[372px] lg:min-w-0 lg:max-w-[558px] lg:shrink lg:basis-[558px]">
          <Image
            src="/images/schools/tailored-implementation-school.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 558px, 450px"
            className="object-contain"
          />
        </MotionImage>
      </div>
    </section>
  );
}
