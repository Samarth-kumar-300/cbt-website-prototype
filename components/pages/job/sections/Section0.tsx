import Link from "next/link";
import { Section } from "@/components/shared/Section";
import type { Job } from "../content";
import { ApplyButton } from "../ApplyButton";

type Props = { job: Job; applied: boolean; onApply: () => void };

export function Section0({ job, applied, onApply }: Props) {
  return (
    <Section
      hero
      className="px-5 pb-10 pt-[116px] lg:px-24 lg:pb-[60px] lg:pt-[150px]"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
        <Link
          href="/careers"
          className="inline-flex w-fit items-center gap-2 text-[16px] font-semibold text-content-brand"
        >
          <span aria-hidden="true">←</span>
          Back to careers
        </Link>
        <div className="mt-6 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-heading text-[36px] font-semibold leading-[46px] text-brand-teal lg:text-[48px] lg:leading-[58px]">
            {job.title}
          </h1>
          <ApplyButton applied={applied} onApply={onApply} />
        </div>
        <p className="text-[16px] leading-[27px] text-text-default lg:text-[18px]">
          <strong className="font-semibold">Location:</strong> {job.location}
        </p>
      </div>
    </Section>
  );
}
