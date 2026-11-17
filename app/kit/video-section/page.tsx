import { VideoSection } from '@/components/shared/VideoSection';
import { PROGRESS_IS_PRICELESS } from '@/lib/films';

export const metadata = { title: 'Video section', robots: { index: false, follow: false } };

const TONES = ['gradient', 'flat-aqua', 'white'] as const;

// A noindex preview: the section on each background. The header is fixed, so the top padding clears it.
export default function VideoSectionPreview() {
  return (
    <div className="bg-white pt-[116px] lg:pt-[150px]">
      {TONES.map((tone) => (
        <VideoSection key={tone} heading="Progress is Priceless" film={PROGRESS_IS_PRICELESS} tone={tone} />
      ))}
    </div>
  );
}
