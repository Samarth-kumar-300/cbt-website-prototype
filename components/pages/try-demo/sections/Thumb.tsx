import type { GameThumb } from "../content";

const stars: [number, number, string][] = [
  [40, 38, "#fde047"], [165, 30, "#fde047"], [95, 75, "#fde047"], [20, 100, "#fde047"],
  [100, 20, "#f472b6"], [140, 105, "#f472b6"],
];

export function Thumb({ kind }: { kind: GameThumb }) {
  return (
    <svg viewBox="0 0 205 115" className="h-[115px] w-[205px] rounded-[8px]" role="img" aria-hidden="true">
      {kind === "stars" && (
        <>
          <rect width="205" height="115" fill="#1e2a8a" />
          {stars.map(([x, y, c], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill={c} />
          ))}
        </>
      )}
      {kind === "bus" && (
        <>
          <rect width="205" height="115" fill="#b6e6fb" />
          <rect y="95" width="205" height="20" fill="#8a8a8a" />
          <rect y="85" width="205" height="10" fill="#6cbf4b" />
          <rect x="28" y="30" width="145" height="55" rx="10" fill="#fbbf24" />
          {[42, 72, 102].map((x) => (
            <rect key={x} x={x} y="40" width="24" height="20" rx="4" fill="#38a3e0" />
          ))}
          <circle cx="62" cy="88" r="12" fill="#222" />
          <circle cx="148" cy="88" r="12" fill="#222" />
        </>
      )}
      {kind === "kids" && (
        <>
          <rect width="205" height="115" fill="#cdddfc" />
          <circle cx="62" cy="40" r="22" fill="#fcd9b0" />
          <path d="M40 38a22 22 0 0 1 44 0z" fill="#8b4a1f" />
          <rect x="40" y="62" width="44" height="53" rx="14" fill="#fde7c4" />
          <circle cx="140" cy="46" r="22" fill="#fcd9b0" />
          <path d="M116 46a24 24 0 0 1 48 0v14h-48z" fill="#7a3b17" opacity=".9" />
          <rect x="118" y="68" width="44" height="47" rx="14" fill="#f59e0b" />
        </>
      )}
    </svg>
  );
}
