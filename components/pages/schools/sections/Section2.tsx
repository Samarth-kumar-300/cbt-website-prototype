import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";
export function Section2() {
  return (
    <section className="bg-brand-subtle-bg px-5 py-14 lg:px-24 lg:py-[88px]">
      <div className="mx-auto flex max-w-[1248px] flex-col items-center gap-9 lg:items-start lg:gap-10">
        <div className="flex flex-col items-start gap-[10px] lg:gap-[14px]">
          <p className="font-heading text-[13px] max-lg:text-[14px] font-semibold leading-[18px] tracking-[1.2px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal">
            A CONNECTED ECOSYSTEM
          </p>
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{"How schools support inclusive education, more consistently"}</TextReveal>
          <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
            CognitiveBotics helps schools create a connected ecosystem where
            every interaction supports a child’s development, beyond the
            classroom
          </p>
        </div>
        <RevealStagger className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-start gap-3 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white p-[18px] shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:p-[26px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-11 lg:size-12"
              style={{ backgroundColor: "#fffbeb" }}
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
                style={{ color: "#b45309" }}
              >
                <path d="m12 21-.1-.15c-.695-1.042-1.042-1.563-1.5-1.94a4 4 0 0 0-1.378-.737C8.453 18 7.827 18 6.575 18H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C2 16.48 2 15.92 2 14.8V6.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 3 4.08 3 5.2 3h.4c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C12 6.04 12 7.16 12 9.4M12 21V9.4M12 21l.1-.15c.695-1.042 1.042-1.563 1.5-1.94a3.999 3.999 0 0 1 1.378-.737C15.547 18 16.173 18 17.425 18H18.8c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 16.48 22 15.92 22 14.8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 3 19.92 3 18.8 3h-.4c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C12 6.04 12 7.16 12 9.4"></path>
              </svg>
            </span>
            <p className="font-heading text-[18px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
              Practical Support for Teachers
            </p>
            <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
              Autism-aware strategies, guided activities and classroom resources.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white p-[18px] shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:p-[26px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-11 lg:size-12"
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
                <path d="M16 4c.93 0 1.395 0 1.776.102a3 3 0 0 1 2.122 2.122C20 6.605 20 7.07 20 8v9.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V8c0-.93 0-1.395.102-1.776a3 3 0 0 1 2.122-2.122C6.605 4 7.07 4 8 4m1 11 2 2 4.5-4.5M9.6 6h4.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C16 5.24 16 4.96 16 4.4v-.8c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C15.24 2 14.96 2 14.4 2H9.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C8 2.76 8 3.04 8 3.6v.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C8.76 6 9.04 6 9.6 6Z"></path>
              </svg>
            </span>
            <p className="font-heading text-[18px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
              Individualised Education Plans (IEPs)
            </p>
            <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
              AI-assisted plans tailored to each child&apos;s progress.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white p-[18px] shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:p-[26px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-11 lg:size-12"
              style={{ backgroundColor: "#f0fdf4" }}
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
                style={{ color: "#15803d" }}
              >
                <path d="M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"></path>
              </svg>
            </span>
            <p className="font-heading text-[18px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
              Reduce Administrative Work
            </p>
            <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
              Centralise assessments, observations and progress reports.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white p-[18px] shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:p-[26px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-11 lg:size-12"
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
                style={{ color: "#175f63" }}
              >
                <path d="M22 21v-2a4.002 4.002 0 0 0-3-3.874M15.5 3.291a4.001 4.001 0 0 1 0 7.418M17 21c0-1.864 0-2.796-.305-3.53a4 4 0 0 0-2.164-2.165C13.796 15 12.864 15 11 15H8c-1.864 0-2.796 0-3.53.305a4 4 0 0 0-2.166 2.164C2 18.204 2 19.136 2 21M13.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path>
              </svg>
            </span>
            <p className="font-heading text-[18px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
              Keep Everyone Working Towards Shared Goals
            </p>
            <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
              Connect educators, therapists and leadership for coordination.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white p-[18px] shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:p-[26px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-11 lg:size-12"
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
                <path d="M15 9h.01M9 9h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-6.5-3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-6 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm2.5 8.5c2.5 0 4.5-1.833 4.5-3.5h-9c0 1.667 2 3.5 4.5 3.5Z"></path>
              </svg>
            </span>
            <p className="font-heading text-[18px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
              Understand Behaviour with Confidence
            </p>
            <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
              Track emotional patterns and guide regulation strategies.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white p-[18px] shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:p-[26px]">
            <span
              data-icon
              className="flex shrink-0 items-center justify-center rounded-full  size-11 lg:size-12"
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
                style={{ color: "#dc2626" }}
              >
                <path d="M8.126 14a4.002 4.002 0 0 0 7.748 0M11.018 2.764 4.235 8.039c-.453.353-.68.53-.843.75a2 2 0 0 0-.318.65C3 9.704 3 9.991 3 10.565V17.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8v-7.235c0-.574 0-.861-.074-1.126a2.002 2.002 0 0 0-.318-.65c-.163-.22-.39-.397-.843-.75l-6.783-5.275c-.351-.273-.527-.41-.72-.462a1 1 0 0 0-.523 0c-.194.052-.37.189-.721.462Z"></path>
              </svg>
            </span>
            <p className="font-heading text-[18px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
              Extend Support Beyond the School Day
            </p>
            <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
              Connect structured classroom activities with caregiver-guided home practice.
            </p>
          </div>
        </RevealStagger>
      </div>
    </section>
  );
}
