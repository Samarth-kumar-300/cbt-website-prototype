'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { CustomBounce } from 'gsap/CustomBounce';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { researchCards } from './content';
import { ResearchCard, TONES } from './ResearchCard';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, CustomEase, CustomBounce, useGSAP);

// Everything below plays in this many seconds in total, both papers included.
const TOTAL = 1.75;
// While the paper is in the folder, only the folder and the top of the sheet show; the wrapper clips
// the part of the sheet below the folder.
const CLIP = 'inset(-40px -24px 0px -24px)';

// Each paper is pulled up out of a folder pocket, the pocket drops away, then the clip draws on and
// snaps down. The timeline is built in "own" seconds and then sped up to TOTAL. Server HTML shows the
// finished papers with the pockets hidden, so it reads without JavaScript or with reduced motion;
// the start state is applied before the first paint, and globals.css keeps the grid hidden until then.
export function ResearchGrid() {
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = grid.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        CustomBounce.create('clipSnap', { strength: 0.45, squash: 0 });
        const master = gsap.timeline({ paused: true });
        el.querySelectorAll<HTMLElement>('.folder-wrap').forEach((wrap, i) => {
          const card = wrap.querySelector<HTMLElement>('.paper-card');
          const pocket = wrap.querySelector<HTMLElement>('.folder-pocket');
          const clip = card?.querySelector<SVGElement>('.paper-clip');
          const path = card?.querySelector<SVGPathElement>('.paper-clip path');
          if (!card || !pocket) return;
          gsap.set(wrap, { clipPath: CLIP });
          gsap.set(pocket, { autoAlpha: 1 });
          const tl = gsap.timeline();
          // Percentages of each element's own height, so it stays right if the layout resizes.
          tl.fromTo(card, { yPercent: 30 }, { yPercent: 0, duration: 1.3, ease: 'power3.inOut' }, 0.2);
          tl.fromTo(pocket, { yPercent: 0 }, { yPercent: 121, duration: 0.7, ease: 'power2.in' }, 1.3);
          if (clip && path) {
            tl.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power1.inOut' }, 1.3);
            tl.fromTo(clip, { y: -14 }, { y: 0, duration: 0.8, ease: 'clipSnap' }, 1.8);
          }
          tl.set(pocket, { autoAlpha: 0 });
          tl.set(wrap, { clearProps: 'clipPath' });
          master.add(tl, i * 0.15);
        });
        master.duration(TOTAL);
        el.setAttribute('data-paper-ready', '');
        ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => master.play() });
      });
    },
    { scope: grid },
  );

  return (
    <div ref={grid} className="paper-grid grid grid-cols-1 gap-6 sm:grid-cols-2">
      {researchCards.map((card) => {
        const { pocket } = TONES[card.tone];
        return (
          <div key={card.href} className="folder-wrap relative flex">
            <ResearchCard card={card} />
            <div
              aria-hidden="true"
              className="folder-pocket pointer-events-none invisible absolute -left-2 -right-2 bottom-0 z-10 h-[58%] rounded-b-[6px]"
              style={{ background: pocket, boxShadow: '0 -8px 16px -6px rgba(16,40,44,0.18), inset 0 2px 0 rgba(255,255,255,0.55)' }}
            >
              <span className="absolute -top-[14px] left-5 h-[14px] w-24 rounded-t-[6px]" style={{ background: pocket }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
