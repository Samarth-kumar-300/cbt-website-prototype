'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, useGSAP);

type Props = { children: ReactNode; className?: string; style?: CSSProperties };

const PATH_DURATION = 5; // timeline units; the path and marker run the whole timeline

// Desktop only. Walks the five growth steps as the reader scrolls: each card rises, its dashed
// connector draws, the illustration and numbered node land with a one-time ring, while a line
// is drawn through the nodes and an orchid marker travels along it. Progress only ever moves
// forward, so scrolling back up never hides content. Mobile and reduced-motion users get the
// static layout (path fully drawn, marker hidden).
export function JourneyTimeline({ children, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)' },
        (ctx) => {
          const { isDesktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean };
          if (!isDesktop || reduce || !ref.current) return;

          const q = gsap.utils.selector(ref.current);
          const cards = q('[data-journey-card]');
          const connectors = q('[data-journey-connector]');
          const nodes = q('[data-journey-node]');
          const rings = q('[data-journey-ring]');
          const images = q('[data-journey-image]');
          const path = q('[data-journey-path]')[0] as unknown as SVGPathElement | undefined;
          const marker = q('[data-journey-marker]')[0];

          const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });

          cards.forEach((card, i) => {
            tl.from(card, { opacity: 0, y: 24, duration: 0.6 }, i)
              .from(connectors[i], { scaleX: 0, transformOrigin: 'left center', duration: 0.8 }, i + 0.3)
              .from(images[i], { opacity: 0, y: 16, duration: 0.6 }, i + 0.4)
              .from(nodes[i], { scale: 0, duration: 0.4, ease: 'back.out(2)' }, i + 0.7)
              .fromTo(rings[i], { scale: 1, opacity: 0.6 }, { scale: 1.8, opacity: 0, duration: 0.6 }, i + 0.85);
          });

          if (path && marker) {
            tl.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', duration: PATH_DURATION }, 0);
            tl.set(marker, { autoAlpha: 1 }, 0);
            tl.to(
              marker,
              {
                motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
                ease: 'none',
                duration: PATH_DURATION,
              },
              0,
            );
            tl.to(marker, { autoAlpha: 0, duration: 0.3 }, PATH_DURATION - 0.3);
            gsap.set(marker, { autoAlpha: 0 });
          }

          // Forward only: remember the furthest scroll progress and never go back from it.
          let furthest = 0;
          const st = ScrollTrigger.create({
            trigger: ref.current,
            start: 'top 75%',
            end: 'bottom 65%',
            onUpdate(self) {
              if (self.progress > furthest) {
                furthest = self.progress;
                gsap.to(tl, { progress: furthest, duration: 0.6, ease: 'power1.out', overwrite: true });
              }
            },
          });
          if (st.progress > 0) {
            furthest = st.progress;
            tl.progress(furthest);
          }

          return () => {
            st.kill();
            tl.kill();
          };
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
