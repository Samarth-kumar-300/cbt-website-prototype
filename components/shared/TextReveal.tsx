'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Props = {
  as: 'h1' | 'h2';
  split: 'lines' | 'words' | 'sentences';
  trigger: 'load' | 'scroll';
  /** Only split while this media query matches, so a hidden desktop or mobile copy is never split. */
  media?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

// Reveals a heading's lines, words or sentences once. The heading is plain text in the server
// HTML, so it reads without JavaScript. Reduced-motion users never get the split. aria: 'auto'
// keeps the full sentence as the accessible name so screen readers don't read the pieces.
export function TextReveal({ as: Tag, split, trigger, media, className, style, children }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const query = media
        ? `(prefers-reduced-motion: no-preference) and ${media}`
        : '(prefers-reduced-motion: no-preference)';
      mm.add(query, () => {
        const compact = window.matchMedia('(max-width: 1023px)').matches; // phones: later-start, quicker
        const scrollTrigger = trigger === 'scroll' ? { trigger: el, start: compact ? 'top 90%' : 'top 85%', once: true } : undefined;
        // This SplitText version has no sentence type, so sentences are split as words and grouped below.
        const splitText = SplitText.create(el, {
          type: split === 'lines' ? 'lines' : 'words',
          mask: split === 'lines' ? 'lines' : undefined,
          aria: 'auto',
          autoSplit: true,
          onSplit(self) {
            if (split === 'lines') {
              return gsap.from(self.lines, { yPercent: 100, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger });
            }
            if (split === 'words') {
              return gsap.from(self.words, { opacity: 0, y: 14, duration: compact ? 0.45 : 0.6, stagger: compact ? 0.025 : 0.05, ease: 'power2.out', scrollTrigger });
            }
            // Sentence reveal: each sentence starts after the previous one, words inside it stagger.
            const tl = gsap.timeline({ scrollTrigger });
            let sentence = 0;
            let inSentence = 0;
            self.words.forEach((word) => {
              tl.from(word, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, sentence * 0.4 + inSentence * 0.05);
              inSentence++;
              if (/[.?!]$/.test(word.textContent ?? '')) {
                sentence++;
                inSentence = 0;
              }
            });
            return tl;
          },
        });
        return () => splitText.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
