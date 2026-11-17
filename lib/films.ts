export type Film = {
  /** The id from the YouTube address (the part after `watch?v=`). */
  readonly youtubeId: string;
  /** Names the play button and the player frame. */
  readonly title: string;
  /** Local copy of the film's title card, in `public/`. */
  readonly poster: string;
  readonly posterAlt: string;
};

/** CognitiveBotics' Children's Day film. The poster is YouTube's own title card, saved locally so the page asks Google for nothing before play. */
export const PROGRESS_IS_PRICELESS: Film = {
  youtubeId: 'c7LKzn9LWSo',
  title: 'Progress is Priceless',
  poster: '/images/video/progress-is-priceless-poster.webp',
  posterAlt: 'Title card for Progress is Priceless, a Children’s Day film from CognitiveBotics. A woman reaches toward a child on a bed while a man sits reading in the foreground.',
};

/**
 * The player address. youtube-nocookie.com sets no cookies until the visitor plays;
 * rel=0 limits end-of-video suggestions to the film's own channel.
 */
export function embedUrl(film: Film): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(film.youtubeId)}?autoplay=1&rel=0&playsinline=1`;
}
