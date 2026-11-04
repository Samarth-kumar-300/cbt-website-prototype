/** Colours and sizes shared by the thumbnail components and the contrast test. Colours come from the site palette (app/globals.css). */
export const COLORS = {
  ink: '#101319', // text-default
  accent: '#207d82', // content-brand
  purple: '#a14da5', // content-brand-secondary
  deep: '#10494c', // brand-dark
  body: '#374151', // text-secondary
  frame: '#eef9f9', // background-brand-subtle
  border: '#e4edea', // border-subtle
  checkBg: '#ddf3f4',
  white: '#ffffff',
} as const;

/** Stops of the dark surface (ticket stub, split panel, band), darkest first. */
export const SURFACE_STOPS = ['#0c3b3e', '#10494c', '#175f63', '#207d82'] as const;
export const SURFACE = `linear-gradient(135deg, ${SURFACE_STOPS[0]} 0%, ${SURFACE_STOPS[1]} 35%, ${SURFACE_STOPS[2]} 70%, ${SURFACE_STOPS[3]} 100%)`;
/** Purple glow in the lower right of the dark surface, echoing the references' blue-to-violet shift. */
export const SURFACE_BG = `radial-gradient(circle at 100% 100%, rgba(161,77,165,0.35), rgba(161,77,165,0) 55%), ${SURFACE}`;
/** Soft glow behind the illustration, from the site's hero gradient hues (sky and lilac). */
export const PAGE_GLOW = 'radial-gradient(60% 70% at 78% 55%, rgba(93,198,243,0.16), rgba(181,90,186,0.1) 45%, rgba(255,255,255,0) 72%)';

export const CANVAS = { width: 1200, height: 675 } as const;
/** Space between the canvas edge and the white card. */
export const INSET = 20;
/** Space between the card edge and its content. */
export const PAD = 56;
export const CARD = { width: CANVAS.width - 2 * INSET, height: CANVAS.height - 2 * INSET } as const;
