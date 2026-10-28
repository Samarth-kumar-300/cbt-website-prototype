import type { ReactNode } from 'react';

type Bg = 'none' | 'white' | 'subtle' | 'off-1' | 'off-2' | 'off-3';
type Props = { children: ReactNode; id?: string; bg?: Bg; contained?: boolean; hero?: boolean; className?: string };

const BG: Record<Bg, string> = {
  none: '',
  white: 'bg-white',
  subtle: 'bg-brand-subtle-bg',
  'off-1': 'bg-[#f7fbfb]',
  'off-2': 'bg-[#fafcfb]',
  'off-3': 'bg-[#f0f5f4]',
};

export function Section({ children, id, bg = 'none', contained = false, hero = false, className = '' }: Props) {
  const heroCls = hero ? 'relative overflow-hidden bg-[image:var(--gradient-hero)]' : '';
  return (
    <section id={id} className={`[overflow-wrap:anywhere] ${BG[bg]} ${heroCls} ${className}`}>
      {contained ? <div className="mx-auto max-w-[1440px]">{children}</div> : children}
    </section>
  );
}
