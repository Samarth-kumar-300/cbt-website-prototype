import type { CSSProperties } from 'react';
import type { BandData } from './thumbnails';
import { COLORS, SURFACE_BG } from './tokens';

const CHIP: CSSProperties = { display: 'inline-flex', alignItems: 'center', height: 56, padding: '0 24px', borderRadius: 14, fontSize: 28, fontWeight: 800, lineHeight: 1, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.14)' };

/** Reference 3: a dark gradient band of pill chips in two centred rows, one highlighted, with faint rings and dots behind. */
export function BandArt({ data }: { data: BandData }) {
  const rows = [data.chips.slice(0, 3), data.chips.slice(3)].filter((row) => row.length > 0);
  return (
    <div data-testid="art" data-fit-box="" style={{ position: 'absolute', left: 56, top: 375, width: 1048, height: 200, borderRadius: 28, overflow: 'hidden', background: SURFACE_BG }}>
      <svg width="1048" height="200" viewBox="0 0 1048 200" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <circle cx="930" cy="40" r="150" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
        <circle cx="930" cy="40" r="95" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
        <circle data-decor="" cx="70" cy="180" r="46" fill="#fff" fillOpacity="0.07" />
        <g data-decor="">{[0, 1, 2].flatMap((row) => [0, 1, 2, 3, 4].map((col) => <circle key={`${row}-${col}`} cx={30 + col * 22} cy={30 + row * 22} r="2.5" fill="#fff" fillOpacity="0.25" />))}</g>
        <path data-decor="" d="M985 150h24M997 138v24" stroke="#fff" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
        {rows.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: 14 }}>
            {row.map((chip, c) => {
              const lit = r * 3 + c === data.highlight;
              return (
                <span key={chip} data-fit="" className="font-heading" style={{ ...CHIP, background: lit ? COLORS.purple : COLORS.white, color: lit ? COLORS.white : COLORS.deep }}>
                  {chip}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
