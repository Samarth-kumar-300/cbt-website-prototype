import { TextReveal } from "@/components/shared/TextReveal";
import { JobList } from "../JobList";

export function Section2() {
  return (
    <section
      id="open-positions"
      className="scroll-mt-24 px-5 py-14 lg:px-24 lg:py-24"
    >
      <div className="mx-auto max-w-[1248px]">
        <TextReveal
          as="h2"
          split="words"
          trigger="scroll"
          className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]"
        >
          {"Open Positions"}
        </TextReveal>
        <JobList />
      </div>
    </section>
  );
}
