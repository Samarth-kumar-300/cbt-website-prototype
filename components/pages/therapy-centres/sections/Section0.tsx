import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";
import Image from "next/image";
import { MotionImage } from "@/components/shared/MotionImage";

export function Section0() {
  return (
    <section
      className="relative overflow-hidden rounded-bl-[50%_24px] rounded-br-[50%_24px] pt-[116px] pb-10 lg:rounded-bl-[50%_120px] lg:rounded-br-[50%_120px] lg:pt-[150px] lg:pb-[100px]"
      style={{
        background:
          "linear-gradient(90deg, #e4f2ef 0%, #f1f7f4 60%, #faf6f0 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:px-24">
        <div className="flex w-full max-w-[592px] flex-col items-start self-start lg:w-auto lg:self-auto gap-[14px] lg:gap-[22px]">
          <p className="font-heading text-[13px] max-lg:text-[14px] font-semibold leading-[18px] tracking-[1.2px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal">
            FOR CHILD DEVELOPMENT CENTERS
          </p>
          <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[58px]">{"Autism therapy software that doesn't stop at the clinic door"}</TextReveal>
          <RevealStagger className="mt-2 flex w-full flex-wrap items-start gap-x-[18px] gap-y-3 lg:flex-nowrap lg:items-center lg:justify-between lg:gap-x-0">
            <a
              href="https://neuro.jmir.org/2025/1/e70589"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 lg:gap-[10px] lg:rounded-full lg:border lg:border-[#e4ded4] lg:bg-white lg:px-[18px] lg:py-[10px] cursor-pointer hover:opacity-80"
            >
              <span
                data-icon
                className="flex shrink-0 items-center justify-center rounded-full  size-[26px] lg:size-8"
                style={{ backgroundColor: "#eef9f9" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: "#175f63" }}
                >
                  <path d="M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M14 17H8m8-4H8m12-3.012V17.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C6.28 2 7.12 2 8.8 2h3.212c.733 0 1.1 0 1.446.083.306.073.598.195.867.36.303.185.562.444 1.08.963l3.19 3.188c.518.519.777.778.963 1.081a3 3 0 0 1 .36.867c.082.346.082.712.082 1.446Z"></path>
                </svg>
              </span>
              <p className="whitespace-nowrap text-[13px] max-lg:text-[14px] leading-[19px] text-brand-teal lg:text-[14px] lg:leading-[21px]">
                JMIR Outcomes
              </p>
            </a>
            <a
              href="https://d2gq2a16cq5v8g.cloudfront.net/documents/CognitiveBotics_India_Patent.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 lg:gap-[10px] lg:rounded-full lg:border lg:border-[#e4ded4] lg:bg-white lg:px-[18px] lg:py-[10px] cursor-pointer hover:opacity-80"
            >
              <span
                data-icon
                className="flex shrink-0 items-center justify-center rounded-full  size-[26px] lg:size-8"
                style={{ backgroundColor: "#f0fdf4" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: "#15803d" }}
                >
                  <path d="M10 17.659V20a2 2 0 1 0 4 0v-2.341M12 2v1m-9 9H2m3.5-6.5-.6-.6m13.6.6.6-.6M22 12h-1m-3 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"></path>
                </svg>
              </span>
              <p className="whitespace-nowrap text-[13px] max-lg:text-[14px] leading-[19px] text-brand-teal lg:text-[14px] lg:leading-[21px]">
                Patented technology
              </p>
            </a>
            <a
              href="https://d2gq2a16cq5v8g.cloudfront.net/documents/Final-ISO-27001-Certificate-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 lg:gap-[10px] lg:rounded-full lg:border lg:border-[#e4ded4] lg:bg-white lg:px-[18px] lg:py-[10px] cursor-pointer hover:opacity-80"
            >
              <span
                data-icon
                className="flex shrink-0 items-center justify-center rounded-full  size-[26px] lg:size-8"
                style={{ backgroundColor: "#fef2f2" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: "#dc2626" }}
                >
                  <path d="M7.967 14.722 7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 0 1 .214 0c.08.017.155.062.305.152L17 22l-.966-7.279M19 9A7 7 0 1 1 5 9a7 7 0 0 1 14 0Z"></path>
                </svg>
              </span>
              <p className="whitespace-nowrap text-[13px] max-lg:text-[14px] leading-[19px] text-brand-teal lg:text-[14px] lg:leading-[21px]">
                ISO Certification
              </p>
            </a>
          </RevealStagger>
        </div>
        <MotionImage enter="none" layer="tilt" className="hero-settle hero-delay-2 relative h-[257px] w-full max-w-[320px] shrink-0 lg:h-[470px] lg:max-w-[600px]">
          <Image
            src="/images/therapy-centres/hero-clinician-v2.webp"
            alt="A therapist and a child playing with blocks together"
            fill
            sizes="100vw"
            className="object-contain"
          />
        </MotionImage>
      </div>
    </section>
  );
}
