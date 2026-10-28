"use client";

import { useCallback, useRef, useState } from "react";
import {
  useGuardedSubmit,
  validateFields,
  type Field,
} from "@/lib/contact-form";
import { Select } from "./Select";

/*
 * Field list derived from reference/interactions.json (contactForm.inputs, contactSelect).
 * The capture recorded `required: false` for every input, but the visible labels end in `*`,
 * so labels with `*` are treated as required. Labels here omit the asterisk (it is rendered separately).
 */
const FIELDS: Field[] = [
  { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
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
  "Therapist",
  "Parent",
  "Therapy Centre Admin",
  "Psychiatrist",
  "Other",
] as const;

/* Compact replacement for the captured intl-tel-input country list (~244 entries). */
const DIAL_CODES = [
  { iso: "IN", name: "India", code: "+91" },
  { iso: "US", name: "United States", code: "+1" },
  { iso: "GB", name: "United Kingdom", code: "+44" },
  { iso: "AE", name: "United Arab Emirates", code: "+971" },
  { iso: "SA", name: "Saudi Arabia", code: "+966" },
  { iso: "QA", name: "Qatar", code: "+974" },
  { iso: "SG", name: "Singapore", code: "+65" },
  { iso: "AU", name: "Australia", code: "+61" },
  { iso: "CA", name: "Canada", code: "+1" },
  { iso: "DE", name: "Germany", code: "+49" },
] as const;

/* Static stand-in for the original's rotating code. This is not a real captcha. */
const CODE = "VKNB62";

const EMPTY: Record<string, string> = Object.fromEntries(
  FIELDS.map((f) => [f.name, ""]),
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
    const errs = validateFields(values, FIELDS);
    setErrors(errs);
    setSent(false);
    if (Object.keys(errs).length) return;
    const ok = await run(values);
    if (ok) {
      setValues(EMPTY);
      setSent(true);
    }
  };

  const selected = DIAL_CODES.find((c) => c.iso === dial) ?? DIAL_CODES[0];

  return (
    <form
      className="flex flex-col gap-[18px] rounded-[24px] border-[1.5px] border-border-subtle bg-white px-5 py-6 shadow-[0px_6px_18px_0px_rgba(15,48,48,0.06)] lg:gap-9 lg:px-8 lg:py-9"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-[18px] lg:gap-[22px]">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex flex-1 flex-col">
            <label htmlFor="name" className={LABEL}>
              Name
              <Star />
            </label>
            <input type="text" autoComplete="name" enterKeyHint="next" {...bind("name")} />
            <ErrorText id="name" message={errors.name} />
          </div>
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
                  className="absolute inset-y-0 left-0 z-[2] w-[74px] cursor-pointer rounded-l-[8px] opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal"
                >
                  {DIAL_CODES.map((c) => (
                    <option key={c.iso} value={c.iso}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
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
              onChange={set("topic")}
              error={errors.topic}
            />
          </div>
        </div>
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
        <div className="flex flex-col gap-[10px] sm:flex-row sm:items-start sm:gap-[22px]">
          <div className="flex flex-1 flex-col">
            <label htmlFor="captcha-input" className={LABEL}>
              Enter code shown
              <Star />
            </label>
            <input
              type="text"
              placeholder="Enter code"
              autoComplete="off"
              {...bind("captcha")}
              ref={captchaRef}
            />
            <ErrorText id="captcha-input" message={errors.captcha} />
          </div>
          <div className="flex items-center gap-[6px] sm:mt-[16px]">
            <div className="flex w-[178px] items-center justify-center rounded-[12px] border-[1.5px] border-brand-teal-100 bg-white px-5 py-[15px]">
              <p
                className="select-none font-heading text-[19px] font-bold tracking-[3px] text-brand-dark"
                aria-label={`Code: ${CODE.split("").join(" ")}`}
              >
                {CODE}
              </p>
            </div>
            <button
              type="button"
              aria-label="Refresh code"
              onClick={() => {
                set("captcha")("");
                captchaRef.current?.focus();
              }}
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#edf3f1] text-brand-teal"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 4v6h6M20 20v-6h-6M4.5 15a8 8 0 0014.5 3.5M19.5 9A8 8 0 005 5.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {sent ? (
        <p
          role="status"
          className="-mt-2 rounded-[8px] bg-background-success-subtle px-4 py-3 text-[16px] text-text-default lg:-mt-4"
        >
          Thank you. Your message has been received and our team will get back
          to you soon.
        </p>
      ) : null}
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
