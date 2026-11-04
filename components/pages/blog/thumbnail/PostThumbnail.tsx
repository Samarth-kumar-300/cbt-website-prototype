import { BandArt } from './BandArt';
import { SplitArt } from './SplitArt';
import { TicketArt } from './TicketArt';
import { ThumbnailFrame } from './ThumbnailFrame';
import { THUMBNAILS, copyProblems, hasThumbnail, type ThumbnailSpec } from './thumbnails';

/** A thumbnail from a copy spec, drawn at exact pixel size (1200 x 675) so a screenshot of it is the PNG. Copy that would not fit throws, so it can never be rendered into a PNG. */
export function Thumbnail({ spec }: { spec: ThumbnailSpec }) {
  const problems = copyProblems(spec);
  if (problems.length) throw new Error(`Thumbnail copy does not fit: ${problems.join('; ')}`);
  return (
    <ThumbnailFrame spec={spec}>
      {spec.layout === 'ticket' ? <TicketArt data={spec} /> : spec.layout === 'split' ? <SplitArt data={spec} /> : <BandArt data={spec} />}
    </ThumbnailFrame>
  );
}

/** The thumbnail for a blog post. Only the render route shows it; the site serves the PNG. */
export function PostThumbnail({ slug }: { slug: string }) {
  if (!hasThumbnail(slug)) throw new Error(`No thumbnail for post "${slug}"; add an entry to components/pages/blog/thumbnail/thumbnails.ts`);
  return <Thumbnail spec={THUMBNAILS[slug]} />;
}
