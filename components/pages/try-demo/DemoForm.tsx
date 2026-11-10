'use client';

import { useCallback, useRef, useState } from 'react';
import { CaptchaField } from '@/components/shared/CaptchaField';
import { Select } from '@/components/pages/contact-us/Select';
import { useGuardedSubmit } from '@/lib/contact-form';
import { DIAL_CODES } from '@/lib/dial-codes';
import {
  initialValues,
  isSpam,
  ROLE_OPTIONS,
  showsOrganisation,
  toRequest,
  USER_OPTIONS,
  usersHelper,
  validateDemo,
  type DemoRequest,
  type DemoValues,
  type Plan,
} from '@/lib/demo-form';
import { submitDemoRequest } from '@/lib/demo-submit';
import { tryDemoContent as c } from './content';
import { CONTROL, CONTROL_BASE, LABEL } from './form-styles';

type Props = { plan: Plan | null; onSubmitted: (request: DemoRequest) => void };

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

export function DemoForm({ plan, onSubmitted }: Props) {
  const [values, setValues] = useState<DemoValues>(() => initialValues(plan));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dial, setDial] = useState<string>(DIAL_CODES[0].iso);
  const captchaRef = useRef<HTMLInputElement>(null);

  const send = useCallback(async (request: DemoRequest | null) => {
    // A filled honeypot is a bot: behave as if it worked, but send nothing.
    if (request) await submitDemoRequest(request);
  }, []);
  const { submitting, run } = useGuardedSubmit(send);

  const set = (name: keyof DemoValues) => (value: string) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'role' && !showsOrganisation(value)) next.organisation = '';
      return next;
    });
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const field = (name: keyof DemoValues, extra = '') => ({
    id: name,
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(name)(e.target.value),
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `${CONTROL} ${extra} ${errors[name] ? 'border-error' : 'border-brand-teal-100'}`,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateDemo(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const code = DIAL_CODES.find((d) => d.iso === dial)?.code ?? DIAL_CODES[0].code;
    const request = toRequest(values, code, plan);
    const ok = await run(isSpam(values) ? null : request);
    if (ok) onSubmitted(request);
  };

  return (
    <form className="relative flex flex-col gap-[18px] lg:gap-6" noValidate onSubmit={onSubmit}>
      <div className="flex flex-col gap-[18px] sm:flex-row sm:gap-5">
        <div className="flex flex-1 flex-col">
          <label htmlFor="firstName" className={LABEL}>
            First Name
            <Star />
          </label>
          <input type="text" autoComplete="given-name" enterKeyHint="next" maxLength={80} {...field('firstName')} />
          <ErrorText id="firstName" message={errors.firstName} />
        </div>
        <div className="flex flex-1 flex-col">
          <label htmlFor="lastName" className={LABEL}>
            Last Name
            <Star />
          </label>
          <input type="text" autoComplete="family-name" enterKeyHint="next" maxLength={80} {...field('lastName')} />
          <ErrorText id="lastName" message={errors.lastName} />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className={LABEL}>
          Email
          <Star />
        </label>
        <input type="email" autoComplete="email" inputMode="email" enterKeyHint="next" {...field('email')} />
        <ErrorText id="email" message={errors.email} />
      </div>

      <div className="flex flex-col">
        <label htmlFor="phone" className={LABEL}>
          Phone number
          <Star />
        </label>
        <div className="flex gap-2">
          <select
            aria-label="Country code"
            value={dial}
            onChange={(e) => setDial(e.target.value)}
            className={`${CONTROL_BASE} w-[112px] shrink-0 border-brand-teal-100`}
          >
            {DIAL_CODES.map((d) => (
              <option key={d.iso} value={d.iso}>
                {d.iso} {d.code}
              </option>
            ))}
          </select>
          <input type="tel" autoComplete="tel-national" inputMode="tel" enterKeyHint="next" {...field('phone', 'min-w-0 flex-1')} />
        </div>
        <ErrorText id="phone" message={errors.phone} />
      </div>

      <div className="flex flex-col">
        <label htmlFor="role" className={LABEL}>
          I am a
          <Star />
        </label>
        <Select id="role" label="I am a" placeholder="Choose one" options={ROLE_OPTIONS} value={values.role} onChange={set('role')} error={errors.role} />
      </div>

      {showsOrganisation(values.role) ? (
        <div className="flex flex-col">
          <label htmlFor="organisation" className={LABEL}>
            Centre or school name
          </label>
          <input type="text" autoComplete="organization" enterKeyHint="next" {...field('organisation')} />
          <ErrorText id="organisation" message={errors.organisation} />
        </div>
      ) : null}

      <div className="flex flex-col">
        <label htmlFor="users" className={LABEL}>
          How many users
          <Star />
        </label>
        <Select id="users" label="How many users" placeholder="Choose one" options={USER_OPTIONS} value={values.users} onChange={set('users')} error={errors.users} />
        {usersHelper(plan, values.users) ? (
          <p className="mt-2 text-[14px] leading-[22px] text-content-secondary">{usersHelper(plan, values.users)}</p>
        ) : null}
      </div>

      <CaptchaField
        labelClass={LABEL}
        inputProps={field('captcha')}
        inputRef={captchaRef}
        error={errors.captcha}
        onRefresh={() => {
          set('captcha')('');
          captchaRef.current?.focus();
        }}
      />

      {/* Honeypot: off-screen and out of the tab order. Real visitors never fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website')(e.target.value)} />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full cursor-pointer items-center justify-center gap-[10px] rounded-full bg-brand-teal py-4 text-[18px] font-semibold text-content-knockout transition-colors hover:bg-[#0f4548] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand-teal"
      >
        {c.submit}
      </button>
    </form>
  );
}
