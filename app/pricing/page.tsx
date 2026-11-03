import type { Metadata } from 'next';
import { PricingPage } from '@/components/pages/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Pricing | CognitiveBotics',
  description: 'One plan for therapy centres and schools: ₹2,000 per user per month for up to 5 users. Custom pricing for larger teams.',
};

export default function Page() {
  return <PricingPage />;
}
