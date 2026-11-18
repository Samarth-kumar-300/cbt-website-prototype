import type { Metadata } from 'next';
import { AchievementsPage } from '@/components/pages/achievements/AchievementsPage';

export const metadata: Metadata = {
  title: 'Achievements | CognitiveBotics',
  description: 'CognitiveBotics holds a granted Indian patent and an ISO 27001 certification, and was a finalist in the MedTech Innovation Challenge 2026.',
  alternates: { canonical: '/achievements' },
};

export default function Page() {
  return <AchievementsPage />;
}
