import { Button } from '@/components/shared/Button';
import { Section } from '@/components/shared/Section';

export const metadata = { title: 'Coming soon | CognitiveBotics', robots: { index: false } };

export default function ComingSoon() {
  return (
    <Section hero className="px-5 pb-16 pt-[140px] lg:px-24 lg:pb-24 lg:pt-[180px]">
      <h1 className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[58px]">Coming soon</h1>
      <p className="mt-4 max-w-[640px] text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px] lg:text-text-secondary">
        This page is not part of the current build yet.
      </p>
      <div className="mt-8">
        <Button href="/" size="lg" arrow>
          Back to home
        </Button>
      </div>
    </Section>
  );
}
