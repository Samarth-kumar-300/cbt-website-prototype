import type { Plan } from '@/lib/demo-plan';
import type { PreviewView } from '@/lib/demo-preview';
import { Section0 } from './sections/Section0';

export function TryDemoPage({ plan, preview = null }: { plan: Plan | null; preview?: PreviewView | null }) {
  return <Section0 plan={plan} preview={preview} />;
}
