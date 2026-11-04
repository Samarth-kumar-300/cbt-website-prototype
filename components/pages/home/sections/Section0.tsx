import { TextReveal } from "@/components/shared/TextReveal";
import { RevealStagger } from "@/components/shared/RevealStagger";
import { Reveal } from "@/components/shared/Reveal";
import { MotionImage } from "@/components/shared/MotionImage";
import Image from "next/image";

export function Section0() {
  return (
    <section
      className="relative overflow-hidden rounded-bl-[50%_30px] rounded-br-[50%_30px] pt-[140px] pb-[75px] lg:rounded-bl-[50%_120px] lg:rounded-br-[50%_120px] lg:pt-[150px] lg:pb-[140px]"
      style={{
        background:
          "linear-gradient(90deg, rgba(147, 229, 125, 0.15) 0%, rgba(93, 198, 243, 0.15) 50%, rgba(181, 90, 186, 0.15) 100%), #FFF",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-24">
        <div className="contents lg:flex lg:flex-col lg:items-start lg:gap-[26px]">
          <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[min(36px,calc((100vw_-_48px)/16))] font-semibold leading-[1.3] text-brand-teal whitespace-nowrap order-1 w-full text-left lg:order-none lg:w-auto lg:text-[clamp(28px,2.778vw,40px)] lg:leading-[1.2]"><span className="block lg:inline">Early intervention for autism,</span><br /> from small steps to everyday wins</TextReveal>
          <a
            className="hero-enter hero-delay-1 btn inline-flex items-center rounded-full whitespace-nowrap font-semibold gap-[10px] px-6 py-[14px] text-[16px] lg:py-[18px] lg:pl-8 lg:pr-[30px] lg:text-[18px] bg-brand-teal text-content-knockout transition-colors hover:bg-[#0f4548] order-3 mt-2 w-full justify-center lg:order-none lg:w-auto lg:justify-start"
            href="/try-demo"
          >
            Explore CognitiveBotics
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
              className="hidden lg:inline-block"
            >
              <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
            </svg>
          </a>
        </div>
        <div className="hero-settle hero-delay-2 relative order-2 h-[300px] w-full max-w-[608px] shrink-0 lg:order-none lg:h-[clamp(340px,36.1vw,520px)] lg:w-[clamp(360px,38.9vw,560px)] lg:max-w-none">
          <Image
            src="/images/homepage/home-hero-devices-v2.webp"
            alt="Hero_Section"
            fill
            priority
            sizes="(min-width: 1024px) 536px, 100vw"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-[1440px] px-6 lg:px-24">
        <RevealStagger className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-[20px] border border-[#f1eef3] bg-white px-5 py-[22px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.06)] lg:flex lg:grid-cols-none lg:flex-row lg:items-center lg:gap-6 lg:rounded-[28px] lg:px-10 lg:py-6 lg:shadow-[0px_6px_20px_0px_rgba(89,71,102,0.05)]">
          <a
            href="https://d2gq2a16cq5v8g.cloudfront.net/documents/NIEPID_Validation_Letter.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start gap-[10px] lg:order-none lg:w-auto lg:flex-1 lg:flex-row lg:items-center lg:gap-4  cursor-pointer hover:opacity-80"
          >
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-12 lg:size-14"
              style={{ backgroundColor: "#eef9f9" }}
            >
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
                className="shrink-0 lg:size-8"
                style={{ color: "#175f63" }}
              >
                <path d="m7.5 12 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"></path>
              </svg>
            </span>
            <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[20px] lg:leading-[26px] lg:text-brand-dark">
              NIEPID Validated
            </p>
          </a>
          <a
            href="https://d2gq2a16cq5v8g.cloudfront.net/documents/Final-ISO-27001-Certificate-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start gap-[10px] lg:order-none lg:w-auto lg:flex-1 lg:flex-row lg:items-center lg:gap-4 cursor-pointer hover:opacity-80"
          >
            <span className="hidden h-10 w-px shrink-0 bg-[#eae7ee] lg:block"></span>
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-12 lg:size-14"
              style={{ backgroundColor: "#fef2f2" }}
            >
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
                className="shrink-0 lg:size-8"
                style={{ color: "#dc2626" }}
              >
                <path d="M7.967 14.722 7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 0 1 .214 0c.08.017.155.062.305.152L17 22l-.966-7.279M19 9A7 7 0 1 1 5 9a7 7 0 0 1 14 0Z"></path>
              </svg>
            </span>
            <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[20px] lg:leading-[26px] lg:text-brand-dark">
              ISO 27001 certified
            </p>
          </a>
          <a
            href="https://neuro.jmir.org/2025/1/e70589"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start gap-[10px] lg:order-none lg:w-auto lg:flex-1 lg:flex-row lg:items-center lg:gap-4  cursor-pointer hover:opacity-80"
          >
            <span className="hidden h-10 w-px shrink-0 bg-[#eae7ee] lg:block"></span>
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-12 lg:size-14"
              style={{ backgroundColor: "#f8f2f9" }}
            >
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
                className="shrink-0 lg:size-8"
                style={{ color: "#a14da5" }}
              >
                <path d="M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M14 17H8m8-4H8m12-3.012V17.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C6.28 2 7.12 2 8.8 2h3.212c.733 0 1.1 0 1.446.083.306.073.598.195.867.36.303.185.562.444 1.08.963l3.19 3.188c.518.519.777.778.963 1.081a3 3 0 0 1 .36.867c.082.346.082.712.082 1.446Z"></path>
              </svg>
            </span>
            <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[20px] lg:leading-[26px] lg:text-brand-dark">
              JMIR-published 12-month outcomes
            </p>
          </a>
          <a
            href="https://d2gq2a16cq5v8g.cloudfront.net/documents/CognitiveBotics_India_Patent.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start gap-[10px] lg:order-none lg:w-auto lg:flex-1 lg:flex-row lg:items-center lg:gap-4 cursor-pointer hover:opacity-80"
          >
            <span className="hidden h-10 w-px shrink-0 bg-[#eae7ee] lg:block"></span>
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-12 lg:size-14"
              style={{ backgroundColor: "#f8f2f9" }}
            >
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
                className="shrink-0 lg:size-8"
                style={{ color: "#a14da5" }}
              >
                <path d="M10 17.659V20a2 2 0 1 0 4 0v-2.341M12 2v1m-9 9H2m3.5-6.5-.6-.6m13.6.6.6-.6M22 12h-1m-3 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"></path>
              </svg>
            </span>
            <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[20px] lg:leading-[26px] lg:text-brand-dark">
              Patented early-intervention technology
            </p>
          </a>
        </RevealStagger>
      </div>
      <Reveal><div className="mx-auto mt-6 max-w-[1440px] px-6 lg:px-24">
        <div className="rounded-[24px] border border-[#cfe2de] bg-white px-5 pb-[26px] pt-[22px] lg:rounded-[32px] lg:border-[#e2ede9] lg:p-12">
          <div className="flex flex-col items-start gap-[18px] lg:flex-row lg:items-center lg:gap-14">
            <MotionImage enter="none" layer="tilt" className="relative h-[188px] w-full max-w-[310px] shrink-0 lg:h-[258px] lg:w-[426px] lg:max-w-none">
              <Image
                src="/images/homepage/whatiscbt.webp"
                alt="What_Is_CBT"
                fill
                sizes="(min-width: 1024px) 426px, 310px"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </MotionImage>
            <div className="flex flex-col items-start gap-3 lg:gap-5">
              <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-content-brand-secondary lg:text-[48px] lg:leading-[58px]">{"What is CognitiveBotics?"}</TextReveal>
              <p className="text-[14px] leading-[22px] text-text-default lg:text-[22px] lg:leading-[33px] lg:text-text-secondary">
                CognitiveBotics brings AI to early intervention for autism and
                developmental delays, helping therapists create personalised
                support for children aged 2 to 8.
              </p>
              <p className="text-[14px] leading-[22px] text-text-default lg:text-[22px] lg:leading-[33px] lg:text-text-secondary">
                It connects therapy, home and school so children receive
                consistent support and continue building skills in everyday
                life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
    </section>
  );
}
