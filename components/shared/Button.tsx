import Link from 'next/link';
import type { ReactNode } from 'react';

type Size = 'lg' | 'md' | 'nav';
type Variant = 'solid' | 'outline';
type Props = {
  href: string;
  children: ReactNode;
  size?: Size;
  variant?: Variant;
  arrow?: boolean;
  external?: boolean;
  className?: string;
};

const SIZE: Record<Size, string> = {
  lg: 'gap-[10px] px-6 py-[14px] text-[16px] lg:py-[18px] lg:pl-8 lg:pr-[30px] lg:text-[18px] font-semibold',
  md: 'gap-[8px] px-6 py-[14px] text-[16px] font-semibold',
  nav: 'px-[26px] py-[13px] text-[14px] font-bold tracking-[0.5px]',
};
const VARIANT: Record<Variant, string> = {
  solid: 'bg-brand-teal text-content-knockout hover:bg-[#0f4548]',
  outline: 'border-[1.5px] border-brand-teal bg-transparent text-content-brand',
};

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Button({ href, children, size = 'md', variant = 'solid', arrow = false, external = false, className = '' }: Props) {
  const cls = `btn min-h-[44px] inline-flex items-center justify-center whitespace-nowrap rounded-full transition-colors ${SIZE[size]} ${VARIANT[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow ? <ArrowRight /> : null}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
