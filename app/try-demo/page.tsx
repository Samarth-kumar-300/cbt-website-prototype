import type { Metadata } from 'next';
import { TryDemoPage } from '@/components/pages/try-demo/TryDemoPage';
import { parsePlan } from '@/lib/demo-plan';
import { parsePreview } from '@/lib/demo-preview';

export const metadata: Metadata = {
  title: 'Book a demo | CognitiveBotics',
  description: 'Tell us about your team and pick a time for your CognitiveBotics demo.',
};

// `plan` comes from the pricing CTAs (?plan=basic or ?plan=custom). Reading searchParams makes this route render per request.
export default async function Page({ searchParams }: { searchParams: Promise<{ plan?: string | string[]; preview?: string | string[] }> }) {
  const { plan, preview } = await searchParams;
  return <TryDemoPage plan={parsePlan(plan)} preview={parsePreview(preview)} />;
}
