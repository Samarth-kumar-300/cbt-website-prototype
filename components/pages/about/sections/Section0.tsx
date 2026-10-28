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
      <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-3 lg:gap-[22px]">
        <p className="font-heading text-[13px] max-lg:text-[14px] font-semibold leading-[18px] tracking-[1.2px] text-[#9a3fa0] lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal lg:text-content-brand-secondary">
          ABOUT US
        </p>
        <TextReveal
          as="h1"
          split="lines"
          trigger="load"
          className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[64px] lg:leading-[76px]"
        >
          {"Our Story"}
        </TextReveal>
        <p className="text-[14px] leading-[22px] text-text-default lg:text-[22px] lg:leading-[33px]">
          {
            "CognitiveBotics began with Ram, our founder’s son, whose progress through early intervention inspired a bigger vision: to transform how neurodivergent children learn and develop."
          }
        </p>
        <p className="text-[14px] leading-[22px] text-text-default lg:text-[22px] lg:leading-[33px]">
          {
            "Today, we bring together AI-powered technology, personalised learning and early intervention to help more children reach their potential."
          }
        </p>
      </div>
    </section>
  );
}
