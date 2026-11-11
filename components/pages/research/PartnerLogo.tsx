import Image from 'next/image';
import type { ResearchPartner } from './content';

// The partner's name, with its logo just before it when `src` is supplied. The logo is decorative (empty alt)
// because the name sits right beside it. Real logo files go in public/research/ and are referenced via `src` in content.ts.
export function PartnerLogo({ partner }: { partner: ResearchPartner }) {
  const name = (
    <span className="flex min-w-0 flex-col leading-tight">
      {/* w-min wraps the name at every space, so "JMIR Neurotechnology" stacks on two lines as in the design. */}
      <span style={partner.nameColor ? { color: partner.nameColor } : undefined} className="w-min font-heading text-[length:var(--rc-partner-size)] font-bold text-brand-teal">{partner.name}</span>
      {partner.subLabel ? <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-content-secondary">{partner.subLabel}</span> : null}
    </span>
  );
  if (!partner.src) return name;
  return (
    <span className="flex min-w-0 items-center gap-2.5 lg:gap-3">
      <Image src={partner.src} alt="" width={96} height={96} className="h-[var(--rc-partner-logo-h)] w-auto shrink-0 object-contain" />
      {name}
    </span>
  );
}
