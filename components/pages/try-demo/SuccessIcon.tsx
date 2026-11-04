// Featured check icon: a check in a tinted circle with a lighter ring around it.
export function SuccessIcon() {
  return (
    <span aria-hidden="true" className="flex size-[72px] items-center justify-center rounded-full bg-[#eef9f9] lg:size-20">
      <span className="flex size-[52px] items-center justify-center rounded-full bg-[#d6ece7] lg:size-[58px]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#207d82" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
    </span>
  );
}
