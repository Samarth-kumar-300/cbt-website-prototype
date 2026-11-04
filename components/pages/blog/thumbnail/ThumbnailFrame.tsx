import type { CSSProperties, ReactNode } from 'react';
import type { ThumbnailSpec } from './thumbnails';
import { CANVAS, COLORS, INSET, PAD, PAGE_GLOW } from './tokens';

/** Where the text block sits in the card, per layout (card coordinates, 1160 x 635). */
const TEXT: Record<ThumbnailSpec['layout'], CSSProperties> = {
  // Reference 1: vertically centred, art on the right.
  ticket: { left: PAD, top: 0, bottom: 0, width: 520, justifyContent: 'center' },
  // Reference 2: eyebrow and headline upper left, descriptor pinned bottom left, panel on the right.
  split: { left: PAD, top: 96, bottom: PAD, width: 548, justifyContent: 'space-between' },
  // Reference 3: text across the top, band below.
  band: { left: PAD, top: 64, right: PAD },
};

/** The part every thumbnail shares: frame, white card, glow, eyebrow, two-tone headline and descriptor. The illustration goes in `children`. */
export function ThumbnailFrame({ spec, children }: { spec: ThumbnailSpec; children: ReactNode }) {
  return (
    <div data-testid="thumbnail" data-layout={spec.layout} style={{ position: 'relative', width: CANVAS.width, height: CANVAS.height, overflow: 'hidden', background: COLORS.frame }}>
      <div
        data-testid="card"
        style={{
          position: 'absolute',
          inset: INSET,
          boxSizing: 'border-box',
          borderRadius: 32,
          overflow: 'hidden',
          background: COLORS.white,
          boxShadow: '0 10px 30px rgba(16,73,76,0.06)',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: PAGE_GLOW }} />
        {children}
        <div data-testid="text" style={{ position: 'absolute', display: 'flex', flexDirection: 'column', ...TEXT[spec.layout] }}>
          <div>
            <p data-testid="eyebrow" className="font-heading" style={{ display: 'flex', alignItems: 'center', gap: 16, margin: 0, color: COLORS.purple, fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
              <span aria-hidden="true" style={{ width: 36, height: 5, borderRadius: 3, background: COLORS.purple }} />
              {spec.eyebrow}
            </p>
            <h2 className="font-heading" style={{ margin: '22px 0 0', fontSize: 56, fontWeight: 800, lineHeight: 1.12, color: COLORS.ink }}>
              <span data-testid="headline-lead" style={{ display: 'block', width: 'max-content', whiteSpace: 'nowrap' }}>{spec.lead}</span>
              <span data-testid="headline-accent" style={{ display: 'block', width: 'max-content', whiteSpace: 'nowrap', color: COLORS.accent }}>{spec.accent}</span>
            </h2>
          </div>
          <p data-testid="subtitle" className="font-sans" style={{ margin: spec.layout === 'split' ? 0 : '20px 0 0', maxWidth: spec.layout === 'band' ? 900 : 520, fontSize: 30, lineHeight: 1.4, color: COLORS.body }}>
            {spec.subtitle}
          </p>
        </div>
        {/* The hairline is an overlay, not a border, so the card's inner space stays exactly 1160 x 635 and it draws over the dark surfaces' edges. */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: 32, border: `1.5px solid ${COLORS.border}`, pointerEvents: 'none' }} />
      </div>
    </div>
  );
}
