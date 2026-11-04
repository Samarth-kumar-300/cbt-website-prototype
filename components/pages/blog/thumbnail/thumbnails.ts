// Copy for each blog thumbnail, worded from the article it belongs to. A post that is listed here gets a rendered thumbnail.
type Copy = {
  /** Short topic label under the dash, e.g. "Screen time guide". */
  eyebrow: string;
  /** First headline line, plain colour. At most 20 characters. */
  lead: string;
  /** Second headline line, accent colour. At most 20 characters. */
  accent: string;
  subtitle: string;
};

/** A tilted boarding-pass style ticket with a stub. */
export type TicketData = {
  layout: 'ticket';
  label: string;
  from: string;
  to: string;
  unit: string;
  checks: readonly string[];
  /** Highlight tag on the stub. */
  tag: string;
};

/** A slanted dark panel with labelled waveform rows. */
export type SplitData = {
  layout: 'split';
  rows: readonly string[];
  /** Index of the bright row; it gets the tag. */
  highlight: number;
  tag: string;
};

/** A dark band of pill chips along the bottom. */
export type BandData = {
  layout: 'band';
  chips: readonly string[];
  /** Index of the highlighted chip. */
  highlight: number;
};

export type ThumbnailSpec = Copy & (TicketData | SplitData | BandData);

export const THUMBNAILS: Record<string, ThumbnailSpec> = {
  'early-intervention-is-the-key-to-managing-autism': {
    layout: 'ticket',
    eyebrow: 'Early intervention guide',
    lead: 'Early support,',
    accent: 'more time to grow',
    subtitle: 'What it is, and why timing matters',
    label: 'M-CHAT-R screening',
    from: '16',
    to: '30',
    unit: 'months',
    checks: ['Spot early signs', 'Start support'],
    tag: 'Start early',
  },
  'the-startling-truth-about-screen-time-and-autism': {
    layout: 'split',
    eyebrow: 'Screen time guide',
    lead: 'Screens work best',
    accent: 'watched together',
    subtitle: 'Three viewing strategies for parents',
    rows: ['Restrictive', 'Co-viewing', 'Interactive'],
    highlight: 2,
    tag: 'Most effective',
  },
  'the-transformative-power-of-physical-activities-for-children-with-autism': {
    layout: 'band',
    eyebrow: 'Physical activity guide',
    lead: 'Movement that builds',
    accent: 'more than muscle',
    subtitle: 'How activity supports children with autism',
    chips: ['Motor skills', 'Sensory integration', 'Social bonds', 'Emotional wellness', 'Focus', 'Confidence'],
    highlight: 0,
  },
};

/** Longest line, in characters, each layout holds without crowding its illustration. Measured on the render: the 56px Nunito 800 headline runs about 29px a character. */
const MAX = {
  ticket: { headline: 17, label: 22, check: 17 },
  split: { headline: 18 },
  band: { headline: 30, chipRow: 52 },
} as const;

/** Everything wrong with a spec's copy and data; empty when it fits. A thumbnail with problems is never rendered. */
export function copyProblems(s: ThumbnailSpec): string[] {
  const out: string[] = [];
  for (const [name, text] of [['lead', s.lead], ['accent', s.accent]] as const) {
    if (!text) out.push(`${name} is empty`);
    else if (text.length > MAX[s.layout].headline) out.push(`${name} "${text}" is ${text.length} characters; a ${s.layout} headline holds ${MAX[s.layout].headline}`);
  }
  if (s.eyebrow.length > 26) out.push(`eyebrow "${s.eyebrow}" is over 26 characters`);
  if (s.subtitle.length > 44) out.push(`descriptor "${s.subtitle}" is over 44 characters`);

  if (s.layout === 'ticket') {
    if (s.label.length > MAX.ticket.label) out.push(`label "${s.label}" is over ${MAX.ticket.label} characters`);
    if (s.checks.length < 1 || s.checks.length > 2) out.push('a ticket needs one or two checks');
    for (const check of s.checks) if (check.length > MAX.ticket.check) out.push(`check "${check}" is over ${MAX.ticket.check} characters`);
    if (s.from.length > 3 || s.to.length > 3) out.push('the ticket range is over 3 characters at an end');
    if (s.tag.length > 12) out.push(`tag "${s.tag}" is over 12 characters`);
  } else if (s.layout === 'split') {
    if (s.rows.length !== 3) out.push('a split panel needs exactly three rows');
    for (const row of s.rows) if (row.length > 14) out.push(`row "${row}" is over 14 characters`);
    if (!Number.isInteger(s.highlight) || s.highlight < 0 || s.highlight >= s.rows.length) out.push(`highlight ${s.highlight} points at no row`);
    if (s.tag.length > 16) out.push(`tag "${s.tag}" is over 16 characters`);
  } else {
    if (s.chips.length < 1 || s.chips.length > 6) out.push('a band needs one to six chips');
    for (const chip of s.chips) if (chip.length > 20) out.push(`chip "${chip}" is over 20 characters`);
    for (const row of [s.chips.slice(0, 3), s.chips.slice(3)]) {
      if (row.join('').length > MAX.band.chipRow) out.push(`chip row "${row.join(', ')}" is wider than the band`);
    }
    if (!Number.isInteger(s.highlight) || s.highlight < 0 || s.highlight >= s.chips.length) out.push(`highlight ${s.highlight} points at no chip`);
  }
  return out;
}

/** True only for slugs listed above; `constructor` and other inherited object keys are not thumbnails. */
export const hasThumbnail = (slug: string) => Object.prototype.hasOwnProperty.call(THUMBNAILS, slug);
