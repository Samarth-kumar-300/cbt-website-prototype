import type { Metadata } from 'next';
import { AchievementsPage } from '@/components/pages/achievements/AchievementsPage';

export const metadata: Metadata = {
  title: 'Achievements | CognitiveBotics',
  description: 'CognitiveBotics holds a granted Indian patent and an ISO 27001 certification.',
  alternates: { canonical: '/achievements' },
};

export default function Page() {
  return <AchievementsPage />;
}
