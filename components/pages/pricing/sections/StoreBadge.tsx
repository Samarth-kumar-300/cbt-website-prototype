import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Link from 'next/link';
import { useId } from 'react';
import type { CSSProperties } from 'react';
import { isExternal } from '@/lib/app-links';

// Coded replicas of the Figma store buttons (DS-CBT, "Mobile app store buttons", Style=Brand, Size=md).
// Every measurement below is in Figma units. Both buttons are 135 x 40 with an 8 radius, so the pair matches
// (Figma's App Store button is 120 wide with a 12 radius; it is widened and squared to match Google Play).
// One unit is `--u`, so the pair scales together from the `height` prop (40 = Figma size).
// The lettering is live text. Google Play uses a font built from the Figma lettering (see below); Apple's own
// SF Pro is not licensed for the web, so the App Store button uses Inter, sized and spaced to match. The two logo glyphs are small
// inline vector icons with the exact path data from Figma.
// The Google Play lettering is artwork, not a typeface, so there is no installable font for it. This font
// is built from the Figma outlines (tools/badge-font/build.py): the exact strings "GET IT ON" and
// "Google Play" map to the exact Figma shapes, so the text stays live. Drawn at 10 Figma units per em,
// with a 13 unit ascent, so a span's top edge sits 13 units above the baseline. No letter-spacing:
// browsers switch ligatures off when it is set.
const googleBadge = localFont({ src: './fonts/google-play-badge.woff2', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: 'variable', display: 'swap' });

const u = (n: number) => `calc(var(--u) * ${n})`;

type Store = 'google' | 'apple';

const SPEC = {
  google: { w: 135, radius: 8 },
  apple: { w: 135, radius: 8 },
} as const;

const abs = (left: number, top: number): CSSProperties => ({ position: 'absolute', left: u(left), top: u(top), whiteSpace: 'nowrap', lineHeight: 1 });

function GoogleLogo() {
  const id = useId();
  const f0 = `${id}f0`;
  const f1 = `${id}f1`;
  const g = [0, 1, 2, 3].map((i) => `${id}g${i}`);
  return (
    <svg aria-hidden="true" focusable="false" viewBox="9.973 7.1409 23.0897 25.7207" style={{ position: 'absolute', left: u(9.973), top: u(7.1409), width: u(23.0897), height: u(25.7207), overflow: 'visible' }}>
      <defs>
        <filter id={f0} x="9.973" y="7.14093" width="23.0897" height="25.7207" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="-0.15" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.15" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow" />
        </filter>
        <filter id={f1} x="10.436" y="20.001" width="16.686" height="12.8607" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="-0.15" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
        <linearGradient id={g[0]} x1="21.8008" y1="8.70903" x2="5.0188" y2="25.491" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00A0FF" />
          <stop offset="0.0066" stopColor="#00A1FF" />
          <stop offset="0.2601" stopColor="#00BEFF" />
          <stop offset="0.5122" stopColor="#00D2FF" />
          <stop offset="0.7604" stopColor="#00DFFF" />
          <stop offset="1" stopColor="#00E3FF" />
        </linearGradient>
        <linearGradient id={g[1]} x1="33.8335" y1="20.001" x2="9.6376" y2="20.001" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE000" />
          <stop offset="0.4087" stopColor="#FFBD00" />
          <stop offset="0.7754" stopColor="#FFA500" />
          <stop offset="1" stopColor="#FF9C00" />
        </linearGradient>
        <linearGradient id={g[2]} x1="24.8281" y1="22.2949" x2="2.06961" y2="45.0534" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF3A44" />
          <stop offset="1" stopColor="#C31162" />
        </linearGradient>
        <linearGradient id={g[3]} x1="7.2974" y1="0.176806" x2="17.4597" y2="10.3391" gradientUnits="userSpaceOnUse">
          <stop stopColor="#32A071" />
          <stop offset="0.0685" stopColor="#2DA771" />
          <stop offset="0.4762" stopColor="#15CF74" />
          <stop offset="0.8009" stopColor="#06E775" />
          <stop offset="1" stopColor="#00F076" />
        </linearGradient>
      </defs>
      <g filter={`url(#${f0})`}>
        <path d="M10.436 7.53803C10.145 7.84603 9.973 8.32403 9.973 8.94303V31.059C9.973 31.679 10.145 32.156 10.436 32.464L10.51 32.536L22.899 20.147V20.001V19.855L10.51 7.46503L10.436 7.53803Z" fill={`url(#${g[0]})`} />
        <path d="M27.028 24.278L22.899 20.147V20.001V19.855L27.029 15.725L27.122 15.778L32.015 18.558C33.412 19.352 33.412 20.651 32.015 21.446L27.122 24.226L27.028 24.278Z" fill={`url(#${g[1]})`} />
        <g filter={`url(#${f1})`}>
          <path d="M27.122 24.225L22.898 20.001L10.436 32.464C10.896 32.952 11.657 33.012 12.514 32.526L27.122 24.225Z" fill={`url(#${g[2]})`} />
        </g>
        <path d="M27.122 15.777L12.514 7.47701C11.657 6.99001 10.896 7.05101 10.436 7.53901L22.899 20.002L27.122 15.777Z" fill={`url(#${g[3]})`} />
      </g>
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="9.97 8.72 17.72 21.78" fill="#fff" style={{ position: 'absolute', left: u(9.97), top: u(8.72), width: u(17.72), height: u(21.78), overflow: 'visible' }}>
      <path d="M24.769 20.3008C24.7907 18.6198 25.6934 17.0292 27.1256 16.1488C26.2221 14.8584 24.7088 14.0403 23.1344 13.9911C21.4552 13.8148 19.8272 14.9959 18.9715 14.9959C18.0992 14.9959 16.7817 14.0086 15.363 14.0378C13.5137 14.0975 11.7898 15.1489 10.8901 16.7656C8.95607 20.1141 10.3987 25.0351 12.2513 27.7417C13.1782 29.0671 14.2615 30.5475 15.6789 30.495C17.066 30.4375 17.584 29.6105 19.2583 29.6105C20.9171 29.6105 21.4031 30.495 22.8493 30.4616C24.3377 30.4375 25.2754 29.1304 26.1698 27.7925C26.8358 26.8481 27.3483 25.8044 27.6882 24.7C25.9391 23.9602 24.771 22.2 24.769 20.3008Z" />
      <path d="M22.0373 12.2111C22.8489 11.2369 23.2487 9.98469 23.1518 8.72046C21.912 8.85068 20.7668 9.44324 19.9443 10.3801C19.14 11.2954 18.7214 12.5255 18.8006 13.7415C20.0408 13.7542 21.2601 13.1777 22.0373 12.2111Z" />
    </svg>
  );
}

const TEXT = { color: '#fff' } as const;
const GOOGLE_TEXT = { ...TEXT, fontSize: u(10), lineHeight: 'normal', fontFeatureSettings: '"liga" 1' } as CSSProperties;

function Face({ store }: { store: Store }) {
  if (store === 'google') {
    return (
      <>
        <GoogleLogo />
        <span className={googleBadge.className} style={{ ...abs(41.1, -0.5), ...GOOGLE_TEXT, WebkitTextStroke: `${u(0.2)} #fff` }}>GET IT ON</span>
        <span className={googleBadge.className} style={{ ...abs(40.88, 16.34), ...GOOGLE_TEXT }}>Google Play</span>
      </>
    );
  }
  // The Figma artwork is 120 wide; centred in the 135-wide button, so everything shifts right by 7.5.
  return (
    <span style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: u(7.5) }}>
      <AppleLogo />
      <span className={inter.className} style={{ ...abs(35.15, 7.75), ...TEXT, fontWeight: 500, fontSize: u(8.7) }}>Download on the</span>
      <span className={inter.className} style={{ ...abs(33.95, 15.5), ...TEXT, fontWeight: 600, fontSize: u(16.7), letterSpacing: '-0.03em' }}>App Store</span>
    </span>
  );
}

function StoreBadgeFace({ store, height }: { store: Store; height: number }) {
  const { w, radius } = SPEC[store];
  const style = {
    '--u': `${height / 40}px`,
    position: 'relative',
    display: 'block',
    flexShrink: 0,
    boxSizing: 'border-box',
    width: u(w),
    height: u(40),
    borderRadius: u(radius),
    background: '#000',
    boxShadow: `inset 0 0 0 ${u(1)} #D1D5DB`,
    overflow: 'hidden',
  } as CSSProperties;
  return (
    <span aria-hidden="true" style={style}>
      <Face store={store} />
    </span>
  );
}

export function StoreBadge({ store, href, label, height = 60 }: { store: Store; href: string; label: string; height?: number }) {
  const cls = 'inline-block shrink-0 transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal';
  const radius = { borderRadius: `${(SPEC[store].radius * height) / 40}px` };
  const face = <StoreBadgeFace store={store} height={height} />;
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls} style={radius}>{face}</a>
  ) : (
    <Link href={href} aria-label={label} className={cls} style={radius}>{face}</Link>
  );
}
