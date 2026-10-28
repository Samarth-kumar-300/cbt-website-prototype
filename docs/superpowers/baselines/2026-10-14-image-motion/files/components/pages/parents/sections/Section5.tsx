import { ScrollIllustration } from "@/components/shared/ScrollIllustration";
import { Reveal } from "@/components/shared/Reveal";
import { TextReveal } from "@/components/shared/TextReveal";
import Link from "next/link";
import { Placeholder } from "@/components/shared/Placeholder";

export function Section5() {
  return (
    <section
      style={{ background: "linear-gradient(90deg, #f3f2f8 0%, #ddf2f4 100%)" }}
    >
      <div className="mx-auto max-w-[1440px] px-5 pt-[56px] pb-[56px] lg:px-24 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col items-start gap-8 lg:gap-10">
            <div className="flex flex-col items-start gap-3 lg:gap-6">
              <p className="font-heading text-[13px] font-semibold tracking-[1.2px] leading-[18px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal">
                INSIDE A SESSION
              </p>
              <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-content-brand-alt lg:text-[40px] lg:leading-[48px] lg:text-brand-dark">{"Learning that adapts to every child"}</TextReveal>
              <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
                CognitiveBotics uses AI-powered activities that adapt to each child’s abilities for engaging and personalised learning.
              </p>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[330px] lg:hidden">
              <Placeholder label="Image" className="object-contain" />
            </div>
            <div className="flex flex-col items-start gap-5 lg:gap-6">
              <div className="flex items-start gap-[14px] lg:gap-4">
                <span className="flex shrink-0 items-center justify-center rounded-full bg-background-brand-subtle size-10 lg:size-12">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-brand-teal"
                  >
                    <path d="M8 9.5h4M8 13h7m-3 8a9 9 0 1 0-8.342-5.616c.081.2.122.3.14.381a.907.907 0 0 1 .024.219c0 .083-.015.173-.045.353l-.593 3.558c-.062.373-.093.56-.035.694a.5.5 0 0 0 .262.262c.135.058.321.027.694-.035l3.558-.593c.18-.03.27-.045.353-.045.081 0 .14.006.219.024.08.018.18.059.38.14A8.973 8.973 0 0 0 12 21Z"></path>
                  </svg>
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-dark">
                    Interactive Sessions
                  </p>
                  <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
                    Guided questions and activities encourage active participation, communication and attention.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-[14px] lg:gap-4">
                <span className="flex shrink-0 items-center justify-center rounded-full bg-background-brand-subtle size-10 lg:size-12">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-brand-teal"
                  >
                    <path d="M19 10v2a7 7 0 0 1-7 7m-7-9v2a7 7 0 0 0 7 7m0 0v3m-4 0h8m-4-7a3 3 0 0 1-3-3V5a3 3 0 1 1 6 0v7a3 3 0 0 1-3 3Z"></path>
                  </svg>
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-dark">
                    Speech Recognition
                  </p>
                  <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
                    Real-time voice interaction helps practise speech and communication in a supportive environment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-[14px] lg:gap-4">
                <span className="flex shrink-0 items-center justify-center rounded-full bg-background-brand-subtle size-10 lg:size-12">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-brand-teal"
                  >
                    <path d="M8 3h-.2c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8V8m5 13h-.2c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V16m18-8v-.2c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H16m5 13v.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H16M3 12h.01m4.49 0h.01m8.99 0h.01M12 12h.01M21 12h.01"></path>
                  </svg>
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-dark">
                    Pose Detection
                  </p>
                  <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
                    AI-powered movement tracking supports imitation, attention and active participation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-[14px] lg:gap-4">
                <span className="flex shrink-0 items-center justify-center rounded-full bg-background-brand-subtle size-10 lg:size-12">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-brand-teal"
                  >
                    <path d="M7.5 4.5a2.5 2.5 0 0 1 5 0V6h1c1.398 0 2.097 0 2.648.228a3 3 0 0 1 1.624 1.624C18 8.403 18 9.102 18 10.5h1.5a2.5 2.5 0 0 1 0 5H18v1.7c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C15.72 22 14.88 22 13.2 22h-.7v-1.75a2.25 2.25 0 0 0-4.5 0V22H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C2 19.72 2 18.88 2 17.2v-1.7h1.5a2.5 2.5 0 0 0 0-5H2c0-1.398 0-2.097.228-2.648a3 3 0 0 1 1.624-1.624C4.403 6 5.102 6 6.5 6h1V4.5Z"></path>
                  </svg>
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-dark">
                    Interactive Learning Games
                  </p>
                  <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
                    Play-based activities build skills through repeated practice, encouraging confidence and progress.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/try-demo"
              className="flex items-center gap-2 text-[16px] font-semibold text-brand-teal transition-colors hover:text-[#0f4548] lg:ml-16 lg:gap-[10px]"
            >
              Try interactive games
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
            </Link>
          </Reveal>
          <ScrollIllustration className="relative hidden min-h-[400px] lg:block">
            <Placeholder label="Image" className="object-contain" />
          </ScrollIllustration>
        </div>
      </div>
    </section>
  );
}
