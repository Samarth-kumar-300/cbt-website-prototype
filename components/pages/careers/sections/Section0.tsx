import { Button } from "@/components/shared/Button";
import { Eyebrow } from "@/components/shared/Eyebrow";
import Image from "next/image";
import { TextReveal } from "@/components/shared/TextReveal";

export function Section0() {
  return (
    <section
      className="px-5 pb-9 pt-[116px] lg:px-24 lg:pb-[90px] lg:pt-[150px]"
      style={{
        background:
          "linear-gradient(90deg, #e4f2ef 0%, #f1f7f4 60%, #faf6f0 100%)",
      }}
    >
      <div className="mx-auto grid max-w-[1248px] grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-3 lg:gap-[22px]">
          <Eyebrow>CAREERS</Eyebrow>
          <TextReveal
            as="h1"
            split="lines"
            trigger="load"
            className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[44px] lg:leading-[56px]"
          >
            {"Join us in making a difference, with AI and care"}
          </TextReveal>
          <Button href="#open-positions" size="lg" className="mt-3 lg:mt-2">
            Browse open positions
          </Button>
        </div>
        <div className="flex w-full justify-center lg:justify-end">
          <div className="hero-settle relative aspect-[1000/751] w-full max-w-[420px]">
            <Image
              src="/images/careers/careers-hero-children-holding-hands.webp"
              alt="Illustration of three children holding hands"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 90vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
