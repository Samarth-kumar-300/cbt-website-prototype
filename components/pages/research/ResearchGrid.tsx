import { RevealStagger } from '@/components/shared/RevealStagger';
import { researchCards } from './content';
import { ResearchCard } from './ResearchCard';

export function ResearchGrid() {
  return (
    <RevealStagger className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      {researchCards.map((card) => (
        <ResearchCard key={card.href} card={card} />
      ))}
    </RevealStagger>
  );
}
