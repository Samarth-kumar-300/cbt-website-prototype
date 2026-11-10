import { Reveal } from './Reveal';
import { TextReveal } from './TextReveal';

// Page header: the H1 on the left, a short subheading on the right, both sitting on one divider.
// Below lg the subheading stacks under the title. The subheading uses the same load-in as the rest
// of the page so it never shows half-placed while the title lines reveal.
export function SplitHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="flex flex-col gap-3 border-b border-border-subtle pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:pb-10">
      <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[40px] lg:leading-[52px] xl:text-[48px] xl:leading-[60px]">
        {title}
      </TextReveal>
      <Reveal className="lg:max-w-[420px]">
        <p className="text-[16px] leading-[24px] text-content-secondary lg:text-right lg:text-[18px] lg:leading-[26px]">{subtitle}</p>
      </Reveal>
    </header>
  );
}
