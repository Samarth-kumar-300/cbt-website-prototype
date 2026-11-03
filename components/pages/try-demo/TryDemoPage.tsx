import type { Plan } from '@/lib/demo-form';
import { Section0 } from './sections/Section0';

export function TryDemoPage({ plan }: { plan: Plan | null }) {
  return <Section0 plan={plan} />;
}
