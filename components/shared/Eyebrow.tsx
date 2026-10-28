import type { ReactNode } from 'react';

type Props = { children: ReactNode; tone?: 'purple' | 'teal'; className?: string };

const TONE = { purple: 'text-content-brand-secondary', teal: 'text-brand-teal' };

export function Eyebrow({ children, tone = 'purple', className = '' }: Props) {
  return (
    <p className={`font-heading text-[14px] font-bold leading-[normal] lg:text-[20px] lg:leading-[26px] ${TONE[tone]} ${className}`}>
      {children}
    </p>
  );
}
