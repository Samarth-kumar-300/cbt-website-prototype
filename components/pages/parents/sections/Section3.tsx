import { TextReveal } from "@/components/shared/TextReveal";
import { JourneyRailList } from "@/components/pages/home/sections/JourneyRailList";
import { JourneyRailMotion } from "@/components/pages/home/sections/JourneyRailMotion";
import { JOURNEY_SPARK_COLORS } from "@/components/pages/home/journey/steps";
import { EARLY_YEARS_STEPS } from "../journey/steps";

export function Section3() {
  return (
    <section
      style={{ background: "linear-gradient(90deg, #eef8f9 0%, #f7f2f9 100%)" }}
    >
      <div className="mx-auto max-w-[1440px] px-5 pt-[56px] pb-[56px] lg:px-24 lg:py-24">
        <div className="flex flex-col items-start gap-3 lg:gap-4">
          <p className="font-heading text-[13px] max-lg:text-[14px] font-semibold tracking-[1.2px] leading-[18px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal lg:text-[#9a3fa0]">
            EARLY INTERVENTION · THE FIRST 2,000 DAYS
          </p>
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-content-brand-alt lg:text-[40px] lg:leading-[48px] lg:text-brand-dark">{"The years that shape everything"}</TextReveal>
          <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[22px] lg:leading-[33px]">
            The initial years, from birth to around 6 years, are a critical period for brain development. Early, consistent support helps strengthen communication, learning, social skills and everyday abilities.
          </p>
        </div>
        <JourneyRailMotion className="mt-[28px] lg:mt-16">
          <JourneyRailList steps={EARLY_YEARS_STEPS} cols={4} stacked sparkColors={JOURNEY_SPARK_COLORS} />
        </JourneyRailMotion>
      </div>
    </section>
  );
}
