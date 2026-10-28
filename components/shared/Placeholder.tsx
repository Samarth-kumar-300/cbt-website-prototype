type Props = { label: string; ratio?: number; className?: string };

// Stands in for an image that has no local file yet. It takes the size of the box the live site gives
// that image: with no ratio it fills its (relatively positioned, sized) parent the way next/image
// `fill` does, so the layout shows the real footprint. With a ratio it sizes itself from its width.

export function Placeholder({ label, ratio, className = '' }: Props) {
  const hasWidth = /(^|\s)(\S+:)*w-/.test(className);
  return (
    <div
      role="img"
      aria-label={label}
      data-testid="placeholder"
      style={ratio ? { aspectRatio: String(ratio) } : undefined}
      className={`flex items-center justify-center overflow-hidden rounded-2xl border border-dashed border-brand-teal-100 bg-brand-subtle-bg text-center ${ratio ? (hasWidth ? '' : 'w-full') : 'absolute inset-0 h-full w-full'} ${className}`}
    >
      <span className="p-2 text-[12px] font-semibold leading-[16px] text-content-brand">{label}</span>
    </div>
  );
}
