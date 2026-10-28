import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";
import { Placeholder } from "@/components/shared/Placeholder";

export function Section2() {
  return (
    <section className="bg-[#f7fbfb] px-6 py-10 lg:px-24 lg:pb-[56px] lg:pt-[48px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-8 lg:gap-10">
        <div className="flex flex-col items-start gap-2 lg:gap-3">
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[28px] font-semibold leading-[36px] text-brand-dark lg:text-[40px] lg:leading-[48px]">{"Beyond the label"}</TextReveal>
          <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">
            Expert-led conversations on neurodivergence, child development,
            learning, behaviour and everyday challenges.
          </p>
        </div>
        <RevealStagger className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            className="flex w-full cursor-pointer flex-col items-start overflow-hidden rounded-[20px] border-[1.5px] border-brand-teal-100 bg-white text-left shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] disabled:cursor-not-allowed"
          >
            <div data-motion-image className="relative aspect-[400/246] w-full shrink-0">
              <Placeholder label="Image" className="object-cover" />
              <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f8f2f9]">
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
                  className="text-content-brand-secondary"
                >
                  <path d="M5 4.99c0-.972 0-1.457.202-1.725a1 1 0 0 1 .738-.395c.335-.02.74.25 1.548.788l10.515 7.01c.668.446 1.002.668 1.118.949a1 1 0 0 1 0 .766c-.116.28-.45.503-1.118.948l-10.515 7.01c-.809.54-1.213.809-1.548.789a1 1 0 0 1-.738-.395C5 20.467 5 19.98 5 19.01V4.99Z"></path>
                </svg>
              </span>
            </div>
            <div className="flex flex-col items-start gap-4 px-6 pb-6 pt-6">
              <p className="font-heading text-[16px] font-bold leading-[20px] text-brand-teal">
                Importance of Early Intervention and Preparing Children for
                Healthy Digital Engagement
              </p>
              <span className="flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
                Watch now
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
                >
                  <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
                </svg>
              </span>
            </div>
          </button>
        </RevealStagger>
      </div>
    </section>
  );
}
