import { MotionImage } from "@/components/shared/MotionImage";
import { RevealStagger } from "@/components/shared/RevealStagger";
import Image from "next/image";
import { TextReveal } from "@/components/shared/TextReveal";

export function Section2() {
  return (
    <section style={{ background: "#FFFFFF" }}>
      <div className="mx-auto hidden max-w-[1440px] px-24 pt-[88px] pb-[92px] lg:flex lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-[614px] flex-col items-start gap-5">
          <span className="inline-block rounded-full bg-brand-teal-100 px-4 py-2 text-[18px] text-brand-teal">
            THE SMALL WINS THAT CHANGE EVERYTHING
          </span>
          <TextReveal as="h2" split="words" trigger="scroll" media="(min-width: 1024px)" className="font-heading text-[40px] font-semibold leading-[48px] text-text-secondary">{"Growth looks different for every child"}</TextReveal>
          <RevealStagger className="flex w-full flex-col">
            <div className="flex items-start gap-4 py-4 ">
              <span
                data-icon
                className="flex shrink-0 items-center justify-center rounded-full  size-12"
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
                  style={{ color: "#207d82" }}
                >
                  <path d="M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v5.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 18 17.88 18 16.2 18H9.684c-.624 0-.936 0-1.235.061a2.997 2.997 0 0 0-.762.267c-.27.14-.514.334-1.002.724L4.3 20.96c-.416.333-.624.5-.8.5a.5.5 0 0 1-.39-.188C3 21.135 3 20.868 3 20.336V7.8Z"></path>
                </svg>
              </span>
              <div>
                <p className="font-heading text-[20px] font-bold leading-[26px] text-content-brand">
                  Finding their voice
                </p>
                <p className="mt-1 text-[18px] leading-[27px] text-text-secondary">
                  With the right support, communication grows one expression at
                  a time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-4 border-t border-[#e1bde3]">
              <span
                data-icon
                className="flex shrink-0 items-center justify-center rounded-full  size-12"
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
                  style={{ color: "#a14da5" }}
                >
                  <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69 4.9 19.104m12.786-1.414 1.414 1.414M22 12h-2m-3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"></path>
                </svg>
              </span>
              <div>
                <p className="font-heading text-[20px] font-bold leading-[26px] text-content-brand">
                  Building steadier days
                </p>
                <p className="mt-1 text-[18px] leading-[27px] text-text-secondary">
                  Children thrive on consistency, understanding and shared
                  goals.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-4 border-t border-[#e1bde3]">
              <span
                data-icon
                className="flex shrink-0 items-center justify-center rounded-full  size-12"
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
                  style={{ color: "#b91c1c" }}
                >
                  <path d="M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"></path>
                </svg>
              </span>
              <div>
                <p className="font-heading text-[20px] font-bold leading-[26px] text-content-brand">
                  Creating rhythms that work
                </p>
                <p className="mt-1 text-[18px] leading-[27px] text-text-secondary">
                  Support that extends beyond sessions into the moments that
                  shape daily life.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-4 border-t border-[#e1bde3]">
              <span
                data-icon
                className="flex shrink-0 items-center justify-center rounded-full  size-12"
                style={{ backgroundColor: "#f0f9ff" }}
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
                  style={{ color: "#0369a1" }}
                >
                  <path d="M12 2c3 2 3.923 6.292 4 10-.077 3.708-1 8-4 10m0-20C9 4 8.077 8.292 8 12c.077 3.708 1 8 4 10m0-20C6.477 2 2 6.477 2 12M12 2c5.523 0 10 4.477 10 10M12 22c5.523 0 10-4.477 10-10M12 22C6.477 22 2 17.523 2 12m20 0c-2 3-6.292 3.923-10 4-3.708-.077-8-1-10-4m20 0c-2-3-6.292-3.923-10-4-3.708.077-8 1-10 4"></path>
                </svg>
              </span>
              <div>
                <p className="font-heading text-[20px] font-bold leading-[26px] text-content-brand">
                  Feeling comfortable in the world
                </p>
                <p className="mt-1 text-[18px] leading-[27px] text-text-secondary">
                  When sensory needs are understood, children explore with
                  greater confidence.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-4 border-t border-[#e1bde3]">
              <span
                data-icon
                className="flex shrink-0 items-center justify-center rounded-full  size-12"
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
                  style={{ color: "#a14da5" }}
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </span>
              <div>
                <p className="font-heading text-[20px] font-bold leading-[26px] text-content-brand">
                  Joining in with confidence
                </p>
                <p className="mt-1 text-[18px] leading-[27px] text-text-secondary">
                  Connection grows through trust and opportunities to engage
                  naturally.
                </p>
              </div>
            </div>
          </RevealStagger>
        </div>
        <MotionImage enter="rise" className="relative aspect-[3481/3184] w-full max-w-[600px] shrink-0">
          <Image src="/images/homepage/growthlooksdiff.webp" alt="Two children beside the Progress, Explore and Learn screens of the Cognitive Botics app" fill sizes="600px" className="object-contain" />
        </MotionImage>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-5 py-14 lg:hidden">
        <div className="flex w-full flex-col items-start gap-[10px]">
          <p className="text-[14px] font-bold text-brand-teal">
            THE SMALL WINS THAT CHANGE EVERYTHING
          </p>
          <TextReveal as="h2" split="words" trigger="scroll" media="(max-width: 1023px)" className="font-heading text-[20px] font-bold leading-[30px] text-text-secondary">{"Growth looks different for every child"}</TextReveal>
        </div>
        <MotionImage enter="rise" className="relative aspect-[3481/3184] w-full max-w-[340px] shrink-0">
          <Image src="/images/homepage/growthlooksdiff.webp" alt="Two children beside the Progress, Explore and Learn screens of the Cognitive Botics app" fill sizes="340px" className="object-contain" />
        </MotionImage>
        <RevealStagger className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full items-start gap-[14px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-10"
              style={{ backgroundColor: "#eef9f9" }}
            >
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
                style={{ color: "#207d82" }}
              >
                <path d="M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v5.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 18 17.88 18 16.2 18H9.684c-.624 0-.936 0-1.235.061a2.997 2.997 0 0 0-.762.267c-.27.14-.514.334-1.002.724L4.3 20.96c-.416.333-.624.5-.8.5a.5.5 0 0 1-.39-.188C3 21.135 3 20.868 3 20.336V7.8Z"></path>
              </svg>
            </span>
            <div className="flex flex-1 flex-col items-start gap-1">
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                Finding their voice
              </p>
              <p className="text-[14px] leading-[22px] text-text-default">
                With the right support, communication grows one expression at a
                time.
              </p>
            </div>
          </div>
          <div className="flex w-full items-start gap-[14px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-10"
              style={{ backgroundColor: "#f8f2f9" }}
            >
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
                style={{ color: "#a14da5" }}
              >
                <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69 4.9 19.104m12.786-1.414 1.414 1.414M22 12h-2m-3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"></path>
              </svg>
            </span>
            <div className="flex flex-1 flex-col items-start gap-1">
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                Building steadier days
              </p>
              <p className="text-[14px] leading-[22px] text-text-default">
                Children thrive on consistency, understanding and shared goals.
              </p>
            </div>
          </div>
          <div className="flex w-full items-start gap-[14px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-10"
              style={{ backgroundColor: "#fef2f2" }}
            >
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
                style={{ color: "#b91c1c" }}
              >
                <path d="M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"></path>
              </svg>
            </span>
            <div className="flex flex-1 flex-col items-start gap-1">
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                Creating rhythms that work
              </p>
              <p className="text-[14px] leading-[22px] text-text-default">
                Support that extends beyond sessions into the moments that shape
                daily life.
              </p>
            </div>
          </div>
          <div className="flex w-full items-start gap-[14px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-10"
              style={{ backgroundColor: "#f0f9ff" }}
            >
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
                style={{ color: "#0369a1" }}
              >
                <path d="M12 2c3 2 3.923 6.292 4 10-.077 3.708-1 8-4 10m0-20C9 4 8.077 8.292 8 12c.077 3.708 1 8 4 10m0-20C6.477 2 2 6.477 2 12M12 2c5.523 0 10 4.477 10 10M12 22c5.523 0 10-4.477 10-10M12 22C6.477 22 2 17.523 2 12m20 0c-2 3-6.292 3.923-10 4-3.708-.077-8-1-10-4m20 0c-2-3-6.292-3.923-10-4-3.708.077-8 1-10 4"></path>
              </svg>
            </span>
            <div className="flex flex-1 flex-col items-start gap-1">
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                Feeling comfortable in the world
              </p>
              <p className="text-[14px] leading-[22px] text-text-default">
                When sensory needs are understood, children explore with greater
                confidence.
              </p>
            </div>
          </div>
          <div className="flex w-full items-start gap-[14px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-10"
              style={{ backgroundColor: "#f8f2f9" }}
            >
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
                style={{ color: "#a14da5" }}
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </span>
            <div className="flex flex-1 flex-col items-start gap-1">
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                Joining in with confidence
              </p>
              <p className="text-[14px] leading-[22px] text-text-default">
                Connection grows through trust and opportunities to engage
                naturally.
              </p>
            </div>
          </div>
        </RevealStagger>
      </div>
    </section>
  );
}
