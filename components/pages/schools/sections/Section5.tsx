import { TextReveal } from "@/components/shared/TextReveal";
import Link from "next/link";
import Image from "next/image";

export function Section5() {
  return (
    <section
      className="px-5 py-14 lg:px-24 lg:py-[90px]"
      style={{
        background:
          "linear-gradient(90deg, rgba(252,232,226,0.7) 0%, rgba(233,250,229,0.7) 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex w-full max-w-[645px] flex-col items-start gap-6 lg:gap-[30px]">
          <div className="flex flex-col items-start gap-[10px] lg:gap-3">
            <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{"Built to scale with your school"}</TextReveal>
            <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
              Choose the level of coverage, resource access and specialist
              support that fits your needs - from a single resource room to
              school-wide implementation.
            </p>
          </div>
          <div className="hidden w-full lg:block">
            <Link
              className="btn inline-flex items-center rounded-full whitespace-nowrap font-semibold gap-[10px] px-6 py-[14px] text-[16px] lg:py-[18px] lg:pl-8 lg:pr-[30px] lg:text-[18px] bg-brand-teal text-content-knockout transition-colors hover:bg-[#0f4548]"
              href="/contact-us"
            >
              Talk to our team
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
              </svg>
            </Link>
          </div>
        </div>
        <div className="relative aspect-[1280/569] w-full max-w-none shrink-0 lg:mx-0 lg:aspect-auto lg:h-[282px] lg:w-full lg:max-w-[635px]">
          <Image
            src="/images/schools/built-to-scale-v2.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 635px, 100vw"
            className="object-contain"
          />
        </div>
        <div className="w-full lg:hidden">
          <Link
            className="btn inline-flex items-center rounded-full whitespace-nowrap font-semibold gap-[10px] px-6 py-[14px] text-[16px] lg:py-[18px] lg:pl-8 lg:pr-[30px] lg:text-[18px] bg-brand-teal text-content-knockout transition-colors hover:bg-[#0f4548] w-full justify-center"
            href="/contact-us"
          >
            Talk to our team
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
