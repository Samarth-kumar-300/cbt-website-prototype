import type { InputHTMLAttributes, Ref } from 'react';

/* Static stand-in for the original site's rotating code. This is not a real captcha: nothing checks the code. */
export const CAPTCHA_CODE = 'VKNB62';

type Props = {
  code?: string;
  labelClass: string;
  /** What the form already binds to its inputs: id, name, value, onChange, aria and className. */
  inputProps: InputHTMLAttributes<HTMLInputElement> & { id: string };
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
  onRefresh: () => void;
};

/** "Enter code shown": the input, the code box and the refresh button, as on the Contact form. */
export function CaptchaField({ code = CAPTCHA_CODE, labelClass, inputProps, inputRef, error, onRefresh }: Props) {
  const { id } = inputProps;
  // Container query: side by side only when the field's own width fits the input (200px) next to the code box and button.
  return (
    <div className="@container">
      <div className="flex flex-col gap-[10px] @[460px]:flex-row @[460px]:items-start @[460px]:gap-[22px]">
        <div className="flex min-w-0 flex-1 flex-col">
          <label htmlFor={id} className={labelClass}>
            Enter code shown
            <span className="text-[14px] font-medium text-[#207d82]">*</span>
          </label>
          <input type="text" placeholder="Enter code" autoComplete="off" maxLength={12} {...inputProps} ref={inputRef} />
          {error ? (
            <p id={`${id}-error`} role="alert" className="mt-1 text-[14px] text-error">
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-[6px] @[460px]:mt-[16px]">
          <div className="flex w-[178px] items-center justify-center rounded-[12px] border-[1.5px] border-brand-teal-100 bg-white px-5 py-[15px]">
            <p className="select-none font-heading text-[19px] font-bold tracking-[3px] text-brand-dark" aria-label={`Code: ${code.split('').join(' ')}`}>
              {code}
            </p>
          </div>
          <button
            type="button"
            aria-label="Refresh code"
            onClick={onRefresh}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#edf3f1] text-brand-teal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  );
}
