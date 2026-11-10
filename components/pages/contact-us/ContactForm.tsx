"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  useGuardedSubmit,
  validateFields,
  type Field,
} from "@/lib/contact-form";
import { CaptchaField } from "@/components/shared/CaptchaField";
import { Select } from "./Select";
import { DIAL_CODES } from "@/lib/dial-codes";

/*
 * Field list derived from reference/interactions.json (contactForm.inputs, contactSelect).
 * The capture recorded `required: false` for every input, but the visible labels end in `*`,
 * so labels with `*` are treated as required. Labels here omit the asterisk (it is rendered separately).
 */
const FIELDS: Field[] = [
  { name: "firstName", label: "First Name", type: "text", required: true, maxLength: 80 },
  { name: "lastName", label: "Last Name", type: "text", required: true, maxLength: 80 },
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
    name: "topic",
    label: "Professional/Parent",
    type: "select",
    required: true,
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    required: false,
    maxLength: 80,
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    required: true,
    maxLength: 2000,
  },
  {
    name: "captcha",
    label: "Enter code shown",
    type: "text",
    required: true,
    maxLength: 12,
  },
];

const TOPIC_OPTIONS = [
  "Therapy Centres",
  "Schools",
  "Individual Therapists",
  "Doctors – Psychiatrists",
  "Doctors – Paediatricians",
  "Parents",
  "Others",
] as const;

const TOPIC_OTHERS = "Others";

// Shown only when the visitor picks "Others" in the Professional/Parent list.
const TOPIC_OTHER_FIELD: Field = {
  name: "topicOther",
  label: "Professional/Parent",
  type: "text",
  required: false,
  maxLength: 80,
};

const EMPTY: Record<string, string> = Object.fromEntries(
  [...FIELDS, TOPIC_OTHER_FIELD].map((f) => [f.name, ""]),
);

const LABEL =
  "mb-1 flex items-start gap-[2px] font-heading text-[16px] font-bold text-brand-teal";
const CONTROL =
  "min-h-[48px] w-full scroll-mt-[96px] rounded-[8px] border bg-brand-subtle-bg px-3 py-2 text-[16px] text-text-secondary shadow-[0px_1px_1px_0px_rgba(10,13,18,0.05)] placeholder:text-[#9ca3af] focus:border-brand-teal focus:outline-none";

function Star() {
  return <span className="text-[14px] font-medium text-[#207d82]">*</span>;
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={`${id}-error`} role="alert" className="mt-1 text-[14px] text-error">
      {message}
    </p>
  ) : null;
}

export function ContactForm() {
  const [values, setValues] = useState<Record<string, string>>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dial, setDial] = useState("IN");
  const [sent, setSent] = useState(false);
  const captchaRef = useRef<HTMLInputElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  // After a send the form is replaced by the thank-you card; move focus to it for keyboard and screen-reader users.
  useEffect(() => {
    if (sent) thanksRef.current?.focus();
  }, [sent]);

  // Stub: nothing leaves the browser. Replace with a real endpoint call when a backend exists.
  const send = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 600));
  }, []);
  const { submitting, run } = useGuardedSubmit(send);

  const set = (name: string) => (v: string) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const bind = (name: string) => ({
    id: name === "captcha" ? "captcha-input" : name,
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(name)(e.target.value),
    // Keeps the focused field clear of the header and the on-screen keyboard.
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      if (!window.matchMedia?.("(pointer: coarse)").matches) return;
      window.setTimeout(() => el.scrollIntoView({ block: "center", behavior: "smooth" }), 300);
    },
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name]
      ? `${name === "captcha" ? "captcha-input" : name}-error`
      : undefined,
    className: `${CONTROL} ${errors[name] ? "border-error" : "border-brand-teal-100"}`,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const other = values.topic === TOPIC_OTHERS;
    const errs = validateFields(values, other ? [...FIELDS, TOPIC_OTHER_FIELD] : FIELDS);
    if (other && !values.topicOther.trim()) errs.topicOther = "Tell us who you are";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const ok = await run(values);
    if (ok) {
      setValues(EMPTY);
      setSent(true);
    }
  };

  const selected = DIAL_CODES.find((c) => c.iso === dial) ?? DIAL_CODES[0];

  if (sent) {
    return (
      <div
        role="status"
        className="flex flex-col gap-6 rounded-[24px] border-[1.5px] border-border-subtle bg-white px-5 py-6 shadow-[0px_6px_18px_0px_rgba(15,48,48,0.06)] lg:gap-8 lg:px-8 lg:py-9"
      >
        <div className="flex flex-col gap-4 lg:gap-5">
          <h2
            ref={thanksRef}
            tabIndex={-1}
            className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none lg:text-[32px] lg:leading-[40px]"
          >
            Thank you for reaching out!
          </h2>
          <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">
            We’ve received your message. Our team will review it and get back to you shortly.
          </p>
        </div>
        <Link
          href="/"
          className="flex w-full cursor-pointer items-center justify-center rounded-full bg-brand-teal py-4 text-[18px] font-semibold text-content-knockout transition-colors hover:bg-[#0f4548]"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-[18px] rounded-[24px] border-[1.5px] border-border-subtle bg-white px-5 py-6 shadow-[0px_6px_18px_0px_rgba(15,48,48,0.06)] lg:gap-9 lg:px-8 lg:py-9"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-[18px] lg:gap-[22px]">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex flex-1 flex-col">
            <label htmlFor="firstName" className={LABEL}>
              First Name
              <Star />
            </label>
            <input type="text" autoComplete="given-name" enterKeyHint="next" maxLength={80} {...bind("firstName")} />
            <ErrorText id="firstName" message={errors.firstName} />
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="lastName" className={LABEL}>
              Last Name
              <Star />
            </label>
            <input type="text" autoComplete="family-name" enterKeyHint="next" maxLength={80} {...bind("lastName")} />
            <ErrorText id="lastName" message={errors.lastName} />
          </div>
        </div>
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex flex-1 flex-col">
            <label htmlFor="email" className={LABEL}>
              Email
              <Star />
            </label>
            <input type="email" autoComplete="email" inputMode="email" enterKeyHint="next" {...bind("email")} />
            <ErrorText id="email" message={errors.email} />
          </div>
        </div>
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex-1">
            <div className="flex flex-col phone-input-teal">
              <label htmlFor="phone" className={LABEL}>
                Phone number
                <Star />
              </label>
              <div className="relative">
                {/* Closed state mirrors the original selector; a transparent native <select> on top provides the accessible country-code control. */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] flex items-center gap-2 pl-3 text-[16px] text-text-secondary">
                  <span>{selected.code}</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-[#6b7280]"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                <select
                  aria-label={`Country code, currently ${selected.name} (${selected.code})`}
                  value={dial}
                  onChange={(e) => setDial(e.target.value)}
                  className="peer absolute inset-y-0 left-0 z-[2] w-[74px] cursor-pointer rounded-l-[8px] opacity-0"
                >
                  {DIAL_CODES.map((c) => (
                    <option key={c.iso} value={c.iso}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                {/* The select stays invisible (its own text would draw over the code above), so keyboard focus is shown by this ring. */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-[74px] rounded-l-[8px] opacity-0 outline outline-2 -outline-offset-1 outline-brand-teal peer-focus-visible:opacity-100" />
                <input
                  type="tel"
                  autoComplete="tel-national"
                  inputMode="tel"
                  {...bind("phone")}
                  style={{ paddingLeft: "74px" }}
                />
              </div>
              <ErrorText id="phone" message={errors.phone} />
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <label htmlFor="topic" className={LABEL}>
              Professional/Parent
              <Star />
            </label>
            <Select
              id="topic"
              label="Professional/Parent"
              placeholder="Choose one"
              options={TOPIC_OPTIONS}
              value={values.topic}
              onChange={(v) => {
                set("topic")(v);
                if (v !== TOPIC_OTHERS) set("topicOther")("");
              }}
              error={errors.topic}
            />
          </div>
        </div>
        {values.topic === TOPIC_OTHERS ? (
          <div className="flex flex-col">
            <label htmlFor="topicOther" className={LABEL}>
              Please specify
              <Star />
            </label>
            <input type="text" maxLength={80} {...bind("topicOther")} />
            <ErrorText id="topicOther" message={errors.topicOther} />
          </div>
        ) : null}
        <div className="flex flex-col">
          <label htmlFor="country" className={LABEL}>
            Country
          </label>
          <input
            type="text"
            placeholder="Enter your country"
            autoComplete="country-name"
            {...bind("country")}
          />
          <ErrorText id="country" message={errors.country} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="message" className={LABEL}>
            Message
            <Star />
          </label>
          <textarea
            rows={5}
            {...bind("message")}
            className={`${bind("message").className} h-[165px] resize-none`}
          />
          <ErrorText id="message" message={errors.message} />
        </div>
        <CaptchaField
          labelClass={LABEL}
          inputProps={bind("captcha")}
          inputRef={captchaRef}
          error={errors.captcha}
          onRefresh={() => {
            set("captcha")("");
            captchaRef.current?.focus();
          }}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-brand-teal font-semibold text-content-knockout transition-colors hover:bg-[#0f4548] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand-teal flex w-full cursor-pointer items-center justify-center gap-[10px] py-4 text-[18px]"
      >
        Submit
      </button>
    </form>
  );
}
