import type { CSSProperties } from 'react';
import type { SplitData } from './thumbnails';
import { COLORS, SURFACE_STOPS } from './tokens';

const PANEL = '680,0 1160,0 1160,635 620,635';
/** Top of each row block inside the rows box, and the shared bar heights (24 bars, 8px wide, 7px apart). */
const ROW_TOPS = [95, 235, 375];
const BAR_HEIGHTS = [22, 38, 52, 30, 60, 44, 26, 54, 36, 18, 48, 62, 40, 24, 56, 34, 20, 50, 42, 28, 58, 32, 46, 22];
/** Each row starts the same bars at a different place, so the three waveforms differ. */
const ROW_SHIFT = [0, 9, 17];
/** The bar the tag's connector hangs from, and its centre x. */
const PINNED = 17;
const PINNED_X = PINNED * 15 + 4;

const TAG: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px 10px 14px', borderRadius: 12, background: COLORS.purple, color: COLORS.white, fontSize: 26, fontWeight: 800, lineHeight: 1.1, whiteSpace: 'nowrap', width: 'max-content' };

/** Reference 2: a slanted dark panel with labelled waveform rows; one row is bright and carries the highlight tag. */
export function SplitArt({ data }: { data: SplitData }) {
  return (
    <div data-testid="art" style={{ position: 'absolute', left: 620, top: 0, width: 540, height: 635 }}>
      <svg width="540" height="635" viewBox="620 0 540 635" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="split-surface" gradientUnits="userSpaceOnUse" x1="620" y1="0" x2="1160" y2="635">
            {SURFACE_STOPS.map((stop, i) => (
              <stop key={stop} offset={[0, 0.35, 0.7, 1][i]} stopColor={stop} />
            ))}
          </linearGradient>
          <radialGradient id="split-glow" gradientUnits="userSpaceOnUse" cx="1160" cy="635" r="420">
            <stop offset="0" stopColor={COLORS.purple} stopOpacity="0.35" />
            <stop offset="1" stopColor={COLORS.purple} stopOpacity="0" />
          </radialGradient>
        </defs>
        <polygon points={PANEL} fill="url(#split-surface)" />
        <polygon points={PANEL} fill="url(#split-glow)" />
        <circle cx="1130" cy="40" r="130" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="2" />
        <circle cx="1130" cy="40" r="80" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="2" />
      </svg>
      <div data-fit-box="" style={{ position: 'absolute', left: 120, top: 0, width: 370, height: 635 }}>
        {data.rows.map((label, i) => {
          const lit = i === data.highlight;
          const heights = BAR_HEIGHTS.map((_, j) => BAR_HEIGHTS[(j + ROW_SHIFT[i]) % BAR_HEIGHTS.length]);
          // Bottom of the pinned bar in row coordinates: the tracks are 64px tall starting 44px down.
          const pinBottom = 44 + 32 + heights[PINNED] / 2;
          return (
            <div key={label} data-highlight={lit ? '' : undefined} style={{ position: 'absolute', left: 0, top: ROW_TOPS[i], width: 370, height: 110 }}>
              <p data-fit="" className="font-heading" style={{ margin: 0, width: 'max-content', color: COLORS.white, fontSize: 30, fontWeight: 800, lineHeight: 1.15, opacity: lit ? 1 : 0.85 }}>{label}</p>
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 44, width: 370, height: 64, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '3px dotted rgba(255,255,255,0.4)' }} />
                {heights.map((h, j) => (
                  <span key={j} style={{ position: 'relative', flex: 'none', width: 8, height: h, borderRadius: 4, background: COLORS.white, opacity: lit ? 1 : 0.5 }} />
                ))}
              </div>
              {lit ? (
                <>
                  <span aria-hidden="true" style={{ position: 'absolute', left: PINNED_X - 6, top: pinBottom - 6, width: 12, height: 12, borderRadius: 6, background: COLORS.white }} />
                  <span aria-hidden="true" style={{ position: 'absolute', left: PINNED_X - 1.5, top: pinBottom, width: 3, height: 122 - pinBottom, background: COLORS.white }} />
                  <span data-fit="" className="font-heading" style={{ ...TAG, position: 'absolute', right: 0, top: 122 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 21V4" />
                      <path d="M5 4h12l-2.5 4L17 12H5" />
                    </svg>
                    {data.tag}
                  </span>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
