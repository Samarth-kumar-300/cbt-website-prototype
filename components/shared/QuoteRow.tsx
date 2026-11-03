import type { Testimonial } from '@/lib/testimonials';
import { QuoteCard } from './QuoteCard';
import { RevealStagger } from './RevealStagger';

// One DOM for every width: a swipe row below lg (native scroll and snap), a three-column grid from lg.
export function QuoteRow({ quotes }: { quotes: readonly Testimonial[] }) {
  return (
    <RevealStagger className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
      {quotes.map((q) => (
        <div key={q.id} className="w-[85%] shrink-0 snap-center lg:w-auto">
          <QuoteCard quote={q} />
        </div>
      ))}
    </RevealStagger>
  );
}
