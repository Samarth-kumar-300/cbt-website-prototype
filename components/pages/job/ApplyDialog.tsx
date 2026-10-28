"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/shared/Button";
import { Select } from "@/components/pages/contact-us/Select";
import { validateFields, type Field } from "@/lib/contact-form";
import type { Job } from "./content";
import { HEARD_ABOUT_OPTIONS } from "./content";

const FIELDS: readonly Field[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    maxLength: 80,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    maxLength: 80,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    maxLength: 254,
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    required: true,
    maxLength: 20,
  },
  {
    name: "heard",
    label: "How did you hear about this opportunity?",
    type: "select",
    required: true,
  },
];

const RESUME_LABEL = "Reusume/CV";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const LABEL =
  "mb-1 flex items-start gap-[2px] font-heading text-[16px] font-bold text-brand-teal";
const CONTROL =
  "w-full rounded-[8px] border bg-white px-3 py-2 text-[16px] text-text-secondary shadow-[0px_1px_1px_0px_rgba(10,13,18,0.05)] placeholder:text-[#9ca3af] focus:border-brand-teal focus:outline-none";

type Props = {
  job: Job;
  view: "form" | "success";
  onDismiss: () => void;
  onSubmitted: () => void;
};

function Star() {
  return <span className="text-[14px] font-medium text-[#207d82]">*</span>;
}

function Row({
  label,
  error,
  children,
}: {
  label: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {label}
      {children}
      {error ? (
        <p role="alert" className="mt-1 text-[14px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ApplyDialog({ job, view, onDismiss, onSubmitted }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      const expanded =
        (e.target as HTMLElement | null)?.getAttribute?.("aria-expanded") ===
        "true";
      if (e.key === "Escape" && !expanded) {
        onDismiss();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus();
    };
  }, [onDismiss]);

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [view]);

  const setField = (name: string) => (v: string) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const inputClass = (name: string) =>
    `${CONTROL} ${errors[name] ? "border-error" : "border-brand-teal-100"}`;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateFields(values, FIELDS);
    if (!resume) errs[RESUME_LABEL] = `${RESUME_LABEL} is required`;
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmitted();
  };

  const err = (name: string) => errors[name];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(10,13,18,0.28)] p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onDismiss();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          view === "form" ? "apply-title" : "apply-success-title"
        }
        className="w-full max-w-[584px] rounded-[24px] border border-white bg-brand-subtle-bg px-6 py-8 shadow-[0px_20px_48px_rgba(10,13,18,0.18)] lg:px-8"
      >
        {view === "form" ? (
          <>
            <h2
              id="apply-title"
              className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark"
            >
              Apply for this job
            </h2>
            <form
              noValidate
              onSubmit={onSubmit}
              className="mt-6 flex flex-col gap-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Row
                  label={
                    <label htmlFor="firstName" className={LABEL}>
                      First Name
                      <Star />
                    </label>
                  }
                  error={err("firstName")}
                >
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={values.firstName ?? ""}
                    onChange={(e) => setField("firstName")(e.target.value)}
                    aria-invalid={err("firstName") ? true : undefined}
                    className={inputClass("firstName")}
                  />
                </Row>
                <Row
                  label={
                    <label htmlFor="lastName" className={LABEL}>
                      Last Name
                      <Star />
                    </label>
                  }
                  error={err("lastName")}
                >
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={values.lastName ?? ""}
                    onChange={(e) => setField("lastName")(e.target.value)}
                    aria-invalid={err("lastName") ? true : undefined}
                    className={inputClass("lastName")}
                  />
                </Row>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Row
                  label={
                    <label htmlFor="email" className={LABEL}>
                      Email
                      <Star />
                    </label>
                  }
                  error={err("email")}
                >
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={values.email ?? ""}
                    onChange={(e) => setField("email")(e.target.value)}
                    aria-invalid={err("email") ? true : undefined}
                    className={inputClass("email")}
                  />
                </Row>
                <Row
                  label={
                    <label htmlFor="phone" className={LABEL}>
                      Phone number
                      <Star />
                    </label>
                  }
                  error={err("phone")}
                >
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 z-[1] flex items-center gap-2 pl-3 text-[16px] text-text-secondary"
                    >
                      +91
                      <svg
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#6b7280]"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={values.phone ?? ""}
                      onChange={(e) => setField("phone")(e.target.value)}
                      aria-invalid={err("phone") ? true : undefined}
                      style={{ paddingLeft: "74px" }}
                      className={inputClass("phone")}
                    />
                  </div>
                </Row>
              </div>
              <Row
                label={
                  <label htmlFor="resume" className={LABEL}>
                    Reusume/CV
                    <Star />
                  </label>
                }
                error={err(RESUME_LABEL)}
              >
                <div
                  className={`flex items-center gap-3 rounded-[12px] border-[1.5px] bg-white px-4 py-3 ${
                    err(RESUME_LABEL) ? "border-error" : "border-brand-teal-100"
                  }`}
                >
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf3f1] text-brand-teal"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                    </svg>
                  </span>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    aria-invalid={err(RESUME_LABEL) ? true : undefined}
                    className="peer sr-only"
                    onChange={(e) => {
                      setResume(e.target.files?.[0] ?? null);
                      setErrors((prev) => {
                        if (!prev[RESUME_LABEL]) return prev;
                        const next = { ...prev };
                        delete next[RESUME_LABEL];
                        return next;
                      });
                    }}
                  />
                  <label
                    htmlFor="resume"
                    className="cursor-pointer rounded-full bg-[#edf3f1] px-4 py-2 text-[16px] text-text-secondary peer-focus-visible:outline-2 peer-focus-visible:outline-brand-teal"
                  >
                    Choose a file
                  </label>
                  <span className="min-w-0 truncate text-[16px] text-text-secondary">
                    {resume ? resume.name : "No file selected."}
                  </span>
                </div>
              </Row>
              <Row
                label={
                  <span className={LABEL}>
                    How did you hear about this opportunity?
                    <Star />
                  </span>
                }
                error={err("heard")}
              >
                <Select
                  id="heard"
                  label="How did you hear about this opportunity?"
                  placeholder="Please select"
                  options={HEARD_ABOUT_OPTIONS}
                  value={values.heard ?? ""}
                  onChange={setField("heard")}
                  error={err("heard")}
                />
              </Row>
              <button
                type="submit"
                className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-full bg-brand-teal py-4 text-[18px] font-semibold text-content-knockout transition-colors hover:bg-[#0f4548]"
              >
                Submit application
              </button>
            </form>
          </>
        ) : (
          <>
            <h2
              id="apply-success-title"
              className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal"
            >
              Application submitted!
            </h2>
            <p className="mt-6 text-[20px] leading-[33px] text-text-default">
              Thank you for applying for the{" "}
              <strong className="font-semibold">{job.title}</strong> role at
              CognitiveBotics.
            </p>
            <p className="mt-4 text-[20px] leading-[33px] text-text-default">
              We’ve received your application and our team will review it. If
              your experience is a good match, we’ll be in touch about next
              steps.
            </p>
            <Button href="/careers" size="lg" className="mt-8 w-full">
              Back to careers
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
