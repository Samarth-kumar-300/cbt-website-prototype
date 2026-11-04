// Same look as the contact form's private LABEL and CONTROL classes.
export const LABEL = 'mb-1 flex items-start gap-[2px] font-heading text-[16px] font-bold text-brand-teal';
// Width-less base, so a caller can size the control itself (the country-code select).
export const CONTROL_BASE =
  'min-h-[48px] scroll-mt-[96px] rounded-[8px] border bg-brand-subtle-bg px-3 py-2 text-[16px] text-text-secondary shadow-[0px_1px_1px_0px_rgba(10,13,18,0.05)] placeholder:text-[#9ca3af] focus:border-brand-teal focus:outline-none';
export const CONTROL = `w-full ${CONTROL_BASE}`;
