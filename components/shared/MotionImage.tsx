'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  CURTAIN,
  DRIFT_PERCENT,
  MOTION_OK,
  PARALLAX_PERCENT,
  RISE,
  SCROLL_LAYER_QUERY,
  TOUCH_DRIFT_PERCENT,
  TOUCH_PARALLAX_PERCENT,
  TOUCH_SCROLL_LAYER_QUERY,
  TILT_QUERY,
  frameClass,
  normalizedOffset,
  parallaxScale,
  tiltAngles,
  type Enter,
  type Layer,
} from './image-motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  enter?: Enter;
  layer?: Layer;
};

// Drop-in for the sized div around an image. Server HTML shows the image fully; every tween runs
// inside gsap.matchMedia, so reduced motion (and touch, for the layers) leaves it plain and visible.
// `enter` plays once as the frame scrolls in; `layer` is the scroll- or pointer-linked motion after.
// Two inner parts keep the two from fighting over the same transform: the layer part moves, the
// enter part reveals.
export function MotionImage({ children, className = '', style, enter = 'rise', layer = 'none' }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const layerPart = useRef<HTMLDivElement>(null);
  const enterPart = useRef<HTMLDivElement>(null);
  const clips = enter === 'curtain' || layer === 'parallax';

  useGSAP(
    () => {
      const f = frame.current;
      const l = layerPart.current;
      const e = enterPart.current;
      if (!f || !l || !e) return;
      const mm = gsap.matchMedia();
      const once = { trigger: f, start: 'top 88%', once: true } as const;

      if (enter !== 'none') {
        mm.add(MOTION_OK, () => {
          if (enter === 'rise') {
            gsap.fromTo(e, RISE.from, { ...RISE.to, scrollTrigger: once });
          } else {
            gsap.fromTo(f, CURTAIN.frameFrom, { ...CURTAIN.frameTo, scrollTrigger: once });
            gsap.fromTo(e, CURTAIN.innerFrom, { ...CURTAIN.innerTo, scrollTrigger: once });
          }
        });
      }

      if (layer === 'drift' || layer === 'parallax') {
        mm.add(SCROLL_LAYER_QUERY, () => {
          const percent = layer === 'drift' ? DRIFT_PERCENT : PARALLAX_PERCENT;
          if (layer === 'parallax') gsap.set(l, { scale: parallaxScale(PARALLAX_PERCENT) });
          gsap.fromTo(
            l,
            { yPercent: -percent },
            {
              yPercent: percent,
              ease: 'none',
              scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      }

      if (layer === 'drift' || layer === 'parallax') {
        mm.add(TOUCH_SCROLL_LAYER_QUERY, () => {
          const percent = layer === 'drift' ? TOUCH_DRIFT_PERCENT : TOUCH_PARALLAX_PERCENT;
          if (layer === 'parallax') gsap.set(l, { scale: parallaxScale(TOUCH_PARALLAX_PERCENT) });
          gsap.fromTo(
            l,
            { yPercent: -percent },
            {
              yPercent: percent,
              ease: 'none',
              scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      }

      if (layer === 'tilt') {
        mm.add(TILT_QUERY, () => {
          gsap.set(l, { transformPerspective: 900 });
          const rotateX = gsap.quickTo(l, 'rotationX', { duration: 0.6, ease: 'power3.out' });
          const rotateY = gsap.quickTo(l, 'rotationY', { duration: 0.6, ease: 'power3.out' });
          const move = (ev: PointerEvent) => {
            const r = f.getBoundingClientRect();
            const a = tiltAngles(normalizedOffset(ev.clientX, r.left, r.width), normalizedOffset(ev.clientY, r.top, r.height));
            rotateX(a.rotationX);
            rotateY(a.rotationY);
          };
          const leave = () => {
            rotateX(0);
            rotateY(0);
          };
          f.addEventListener('pointermove', move);
          f.addEventListener('pointerleave', leave);
          return () => {
            f.removeEventListener('pointermove', move);
            f.removeEventListener('pointerleave', leave);
          };
        });
      }

      return () => mm.revert();
    },
    { scope: frame, dependencies: [enter, layer] },
  );

  return (
    <div ref={frame} className={frameClass(className, clips)} style={style} data-mi-enter={enter} data-mi-layer={layer}>
      <div ref={layerPart} data-mi-part="layer" className="absolute inset-0">
        <div ref={enterPart} data-mi-part="enter" className="absolute inset-0">
          {children}
        </div>
      </div>
    </div>
  );
}
