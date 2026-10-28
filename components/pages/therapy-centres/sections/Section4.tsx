import { TextReveal } from "@/components/shared/TextReveal";
import Image from "next/image";

export function Section4() {
  return (
    <section
      className="px-5 py-14 lg:px-24 lg:py-20"
      style={{
        background:
          "linear-gradient(90deg, rgba(255,251,235,0.6) 0%, rgba(221,243,244,0.6) 50%, rgba(248,234,242,0.6) 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[1248px] flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex max-w-[508px] flex-1 flex-col items-center gap-4 text-center lg:items-start lg:gap-4 lg:text-left">
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-content-brand-alt lg:text-[40px] lg:leading-[48px] lg:text-brand-teal">{"Extending developmental care beyond location and means"}</TextReveal>
          <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[22px] lg:leading-[33px] lg:text-text-default">
            A single view to manage your caseload, personalise learning plans,
            track progress and stay connected to each child’s journey.
          </p>
        </div>
        <div className="flex w-full max-w-[340px] flex-col items-start gap-6 lg:max-w-[669px] lg:items-end">
          <div className="relative aspect-[340/242] w-full lg:aspect-[669/476]">
            <Image
              src="/images/therapy-centres/extending-development.webp"
              alt="CognitiveBotics dashboard"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <a
            href="https://atcapp.cognitivebotics.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex cursor-pointer items-center gap-[8px] text-[16px] font-semibold text-brand-teal"
          >
            Explore the Dashboard
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
