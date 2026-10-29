import { TextReveal } from "@/components/shared/TextReveal";
import { Button } from "@/components/shared/Button";
import Image from "next/image";
import { MotionImage } from "@/components/shared/MotionImage";

export function Section1() {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col items-center gap-9 px-5 py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-[88px] lg:px-24">
      <div className="flex max-w-[614px] flex-col items-start gap-3 lg:min-w-0 lg:max-w-[640px] lg:flex-1 lg:gap-[18px]">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{"Inclusive learning begins with the right support"}</TextReveal>
        <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
          CognitiveBotics connects educators, specialists and families to
          personalise learning and track progress.
        </p>
        <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
          With simplified coordination, schools can focus on helping
          <br className="hidden min-[1440px]:block" /> every child thrive.
        </p>
        <Button href="/resources#blog" variant="tertiary" arrow className="mt-1 lg:mt-2">
          Learn more about inclusive education
        </Button>
      </div>
      <MotionImage enter="rise" className="relative h-[260px] w-full shrink-0 lg:h-[451px] lg:max-w-[590px]">
        <Image
          src="/images/schools/inclusive-learning.webp"
          alt="Educators, families and specialists connected through a school learning dashboard"
          fill
          sizes="(min-width: 1024px) 608px, 100vw"
          className="object-contain"
        />
      </MotionImage>
    </section>
  );
}
