import Image from 'next/image';
import type { CSSProperties } from 'react';
import { JOURNEY_SPARK_COLORS, type JourneyStep } from '../journey/steps';

// A step may carry an optional kicker (a small label above the title, e.g. an age band) and an
// optional accent colour for its node and kicker. The homepage passes neither, so its output is unchanged.
export type JourneyRailItem = JourneyStep & { kicker?: string; accent?: string };

type Props = {
  steps: readonly JourneyRailItem[];
  // Column count from 1280px: 4 sets data-cols="4" (see .jr-list in globals.css). Omit for the default of five.
  cols?: number;
  sparkColors?: readonly string[];
  // Below 1280px, stack the illustration above the text (right of the rail) instead of beside it.
  stacked?: boolean;
};

// The list half of the growth path. Server-rendered; the motion lives in JourneyRailMotion, which wraps this
// list and animates the [data-jr-*] hooks only. Used by the homepage rail and the parents early-years rail.
export function JourneyRailList({ steps, cols, sparkColors = JOURNEY_SPARK_COLORS, stacked }: Props) {
  const last = steps.length - 1;
  return (
    <ol role="list" className="jr-list" data-cols={cols} data-stacked={stacked ? "" : undefined} data-kicker={steps.some((s) => s.kicker) ? "" : undefined}>
      {steps.map((step, i) => {
        const accentStyle = step.accent ? ({ '--jr-accent': step.accent } as CSSProperties) : undefined;
        return (
          <li
            key={step.id}
            data-jr-step
            data-pos={i === 0 ? 'first' : i === last ? 'last' : 'mid'}
            className="jr-step"
            style={{ '--jr-bg': step.bg, '--jr-border': step.border, ...accentStyle } as CSSProperties}
          >
            <div className="jr-rail" aria-hidden="true">
              <span className="jr-track">
                <span data-jr-line className="jr-line" />
              </span>
              <span className="jr-path">
                <span data-jr-orb className="jr-orb" />
              </span>
              <span data-jr-node className="jr-node">
                <span data-jr-ring className="jr-ring" />
                <span className="jr-num">{i + 1}</span>
              </span>
              {i === last &&
                sparkColors.map((color, k) => (
                  <span key={k} data-jr-spark className="jr-spark" style={{ background: color }} />
                ))}
            </div>
            <div data-jr-image className="jr-image">
              <Image
                src={step.src}
                alt={step.alt}
                fill
                sizes="(min-width: 1280px) 264px, 252px"
                className="object-contain"
              />
            </div>
            <div data-jr-card className="jr-card">
              <span data-jr-stub className="jr-stub" aria-hidden="true" />
              {step.kicker && <p className="jr-kicker">{step.kicker}</p>}
              <p data-jr-title className="jr-title">
                {step.title}
              </p>
              <p data-jr-body className="jr-body">
                {step.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
