import type { CSSProperties } from 'react';
import type { TicketData } from './thumbnails';
import { COLORS, SURFACE_STOPS } from './tokens';

const W = 520;
const H = 296;
/** Perforation: where the main part ends and the stub starts. */
const P = 340;
/** Rounded card outline with a half-circle notch in the top and bottom edge at the perforation. */
const SHAPE = 'M26 0H326A14 14 0 0 0 354 0H494A26 26 0 0 1 520 26V270A26 26 0 0 1 494 296H354A14 14 0 0 0 326 296H26A26 26 0 0 1 0 270V26A26 26 0 0 1 26 0Z';
/** Barcode bar widths, left to right, 4px apart, starting 31px into the stub. */
const BAR_WIDTHS = [4, 2, 6, 2, 3, 6, 2, 4, 3, 6, 2, 3, 4, 2, 6, 3];
const BARS = BAR_WIDTHS.reduce<{ x: number; w: number }[]>((bars, w) => {
  const last = bars[bars.length - 1];
  return [...bars, { x: last ? last.x + last.w + 4 : P + 31, w }];
}, []);

const BIG: CSSProperties = { color: COLORS.ink, fontSize: 52, fontWeight: 800, lineHeight: 1 };
const TAG: CSSProperties = { background: COLORS.purple, color: COLORS.white, fontSize: 21, fontWeight: 800, lineHeight: 1.1, padding: '9px 13px', borderRadius: 10, whiteSpace: 'nowrap', width: 'max-content' };

function Check() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="17" cy="17" r="17" fill={COLORS.checkBg} />
      <path d="M10 17.5l5 5 9.5-10.5" fill="none" stroke={COLORS.accent} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Reference 1: a boarding-pass style ticket, tilted, with a dark barcode stub and a highlight tag. Centred near card point (880, 322). */
export function TicketArt({ data }: { data: TicketData }) {
  return (
    <div data-testid="art" data-rotate="" style={{ position: 'absolute', left: 604, top: 174, width: W, height: H, transform: 'rotate(-6deg)', filter: 'drop-shadow(0 28px 36px rgba(16,73,76,0.18))' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <clipPath id="ticket-clip">
            <path d={SHAPE} />
          </clipPath>
          <linearGradient id="ticket-stub" x1="0" y1="0" x2="1" y2="1">
            {SURFACE_STOPS.map((stop, i) => (
              <stop key={stop} offset={[0, 0.35, 0.7, 1][i]} stopColor={stop} />
            ))}
          </linearGradient>
          <radialGradient id="ticket-glow" cx="1" cy="1" r="0.8">
            <stop offset="0" stopColor={COLORS.purple} stopOpacity="0.35" />
            <stop offset="1" stopColor={COLORS.purple} stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={SHAPE} fill={COLORS.white} />
        <g clipPath="url(#ticket-clip)">
          <rect x={P} y="0" width={W - P} height={H} fill="url(#ticket-stub)" />
          <rect x={P} y="0" width={W - P} height={H} fill="url(#ticket-glow)" />
        </g>
        <path d={`M${P} 26V270`} stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 9" />
        {BARS.map((b) => (
          <rect key={b.x} x={b.x} y="30" width={b.w} height="150" rx="1" fill="#fff" />
        ))}
      </svg>
      <div data-fit-box="" style={{ position: 'absolute', left: 28, top: 28, width: 284, height: 240 }}>
        <p data-fit="" className="font-heading" style={{ margin: 0, width: 'max-content', color: COLORS.accent, fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{data.label}</p>
        <div data-fit="" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, width: 'max-content' }}>
          <span className="font-heading" style={BIG}>{data.from}</span>
          <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true">
            <path d="M3 12h32M26 3l10 9-10 9" fill="none" stroke={COLORS.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-heading" style={BIG}>{data.to}</span>
          <span className="font-heading" style={{ marginLeft: 6, alignSelf: 'flex-end', paddingBottom: 9, color: COLORS.body, fontSize: 22, fontWeight: 700 }}>{data.unit}</span>
        </div>
        <ul style={{ margin: '18px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.checks.map((check) => (
            <li key={check} data-fit="" style={{ display: 'flex', alignItems: 'center', gap: 14, width: 'max-content' }}>
              <Check />
              <span className="font-heading" style={{ color: COLORS.ink, fontSize: 24, fontWeight: 700 }}>{check}</span>
            </li>
          ))}
        </ul>
      </div>
      <div data-fit-box="" style={{ position: 'absolute', left: P, top: 0, width: W - P, height: H }}>
        <span data-fit="" className="font-heading" style={{ ...TAG, position: 'absolute', right: 14, bottom: 22 }}>{data.tag}</span>
      </div>
    </div>
  );
}
