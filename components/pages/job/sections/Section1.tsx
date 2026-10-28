import { Section } from "@/components/shared/Section";
import type { Job } from "../content";
import { ApplyButton } from "../ApplyButton";

type Props = { job: Job; applied: boolean; onApply: () => void };

const HEADING =
  "font-heading text-[20px] font-semibold leading-[30px] text-brand-dark lg:text-[24px] lg:leading-[32px]";
const TEXT = "text-[16px] leading-[27px] text-text-default";
const LIST = `${TEXT} list-disc pl-[27px]`;

export function Section1({ job, applied, onApply }: Props) {
  return (
    <Section className="px-5 pb-16 pt-14 lg:px-24 lg:pb-24 lg:pt-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14">
        <div className="flex flex-col gap-3">
          <h2 className={HEADING}>Role Overview</h2>
          {job.overview.map((p) => (
            <p key={p} className={TEXT}>
              {p}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h2 className={HEADING}>Key Responsibilities</h2>
          <ul className={LIST}>
            {job.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className={HEADING}>Required Experience &amp; Qualifications</h2>
          <ul className={LIST}>
            {job.qualifications.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
        <div>
          <ApplyButton applied={applied} onApply={onApply} />
        </div>
      </div>
    </Section>
  );
}
