import type { Metadata } from 'next';
import { PricingPage } from '@/components/pages/pricing/PricingPage';
import { parseAudience } from '@/components/pages/pricing/content';

export const metadata: Metadata = {
  title: 'Pricing | CognitiveBotics',
  description:
    'Pricing for therapy centres and schools: ₹2,000 per user per month for up to 5 users, custom pricing for larger teams, and BLOOM for schools without a special educator.',
};

// ?for=schools opens the Schools view. Reading searchParams renders this route per request, like /try-demo.
export default async function Page({ searchParams }: { searchParams: Promise<{ for?: string | string[] }> }) {
  const { for: audience } = await searchParams;
  return <PricingPage initial={parseAudience(audience)} />;
}
