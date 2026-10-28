type Props = { applied: boolean; onApply: () => void };

export function ApplyButton({ applied, onApply }: Props) {
  return (
    <button
      type="button"
      onClick={onApply}
      disabled={applied}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-[10px] whitespace-nowrap rounded-full px-6 py-[14px] text-[16px] lg:py-[18px] lg:pl-8 lg:pr-[30px] lg:text-[18px] font-semibold transition-colors disabled:cursor-not-allowed ${
        applied
          ? "bg-[#edf3f1] text-[#9ca3af]"
          : "bg-brand-teal text-content-knockout hover:bg-[#0f4548]"
      }`}
    >
      {applied ? "Applied" : "Apply now"}
    </button>
  );
}
