'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Layout measured against the old 1600x1464 grouped image, as % of that frame.
// `from` is where each side phone starts: tucked behind the centre phone and upright.
// The PNGs already carry their tilt, so the end state is rotation 0 and the start counter-rotates.
const PHONES = [
  { key: 'left', alt: 'Progress screen of the Cognitive Botics app', box: { l: 0, t: 5.5, w: 49.5, h: 94.3 }, from: { xPercent: 46.5, yPercent: -8.1, rotation: 12 } },
  { key: 'right', alt: 'Learn screen of the Cognitive Botics app', box: { l: 50, t: 5.2, w: 50, h: 94.5 }, from: { xPercent: -54.5, yPercent: -7.9, rotation: -12 } },
  { key: 'centre', alt: 'Explore screen of the Cognitive Botics app', box: { l: 28.25, t: 0.3, w: 39, h: 89.3 }, from: null },
] as const;

type Props = { className?: string; sizes: string; media: string };

// The three phones fan out from behind the centre one, once, as the frame scrolls into view.
// Server HTML and reduced motion show the final layout; the starting pose is applied by GSAP only.
export function PhoneFan({ className = '', sizes, media }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const f = frame.current;
      if (!f) return;
      const mm = gsap.matchMedia();
      mm.add(`(prefers-reduced-motion: no-preference) and ${media}`, () => {
        const sides = f.querySelectorAll<HTMLElement>('[data-phone="left"],[data-phone="right"]');
        gsap.set(sides, { transformOrigin: '50% 90%' });
        gsap.fromTo(
          f.querySelector('[data-phone="left"]'),
          { ...PHONES[0].from, opacity: 0, scale: 0.94 },
          { xPercent: 0, yPercent: 0, rotation: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.25, scrollTrigger: { trigger: f, start: 'top 80%', once: true } },
        );
        gsap.fromTo(
          f.querySelector('[data-phone="right"]'),
          { ...PHONES[1].from, opacity: 0, scale: 0.94 },
          { xPercent: 0, yPercent: 0, rotation: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.4, scrollTrigger: { trigger: f, start: 'top 80%', once: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={`relative aspect-[1600/1464] w-full ${className}`} data-phone-fan>
      {PHONES.map(({ key, alt, box }) => (
        <div
          key={key}
          data-phone={key}
          className="absolute"
          style={{ left: `${box.l}%`, top: `${box.t}%`, width: `${box.w}%`, height: `${box.h}%`, zIndex: key === 'centre' ? 2 : 1 }}
        >
          <Image src={`/images/homepage/home-phone-${key}.webp`} alt={alt} fill sizes={sizes} className="object-contain" />
        </div>
      ))}
    </div>
  );
}
