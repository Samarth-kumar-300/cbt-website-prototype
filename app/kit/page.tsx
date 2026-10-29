import { Button } from '@/components/shared/Button';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { FAQ } from '@/components/shared/FAQ';
import { Placeholder } from '@/components/shared/Placeholder';
import { Section } from '@/components/shared/Section';

export const metadata = { title: 'Kit', robots: { index: false, follow: false } };

const LONG = 'Supercalifragilisticexpialidocious'.repeat(2) + '@example-long-domain-name.com';

export default function Kit() {
  return (
    <>
      <Section hero className="px-5 pb-10 pt-[140px] lg:px-24 lg:pt-[150px]">
        <Eyebrow>EYEBROW PURPLE</Eyebrow>
        <h1 className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[58px]">Kit heading</h1>
        <p data-testid="long-string" className="mt-4 text-[14px] leading-[22px]">{LONG}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button href="/kit" size="lg" arrow>Large solid</Button>
          <Button href="/kit" size="md">Medium solid</Button>
          <Button href="/kit" size="nav" variant="outline">Outline</Button>
          <Button href="/kit" variant="tertiary" arrow>Tertiary</Button>
          <Button href="https://example.com" external>External</Button>
        </div>
      </Section>
      {(['white', 'subtle', 'off-1', 'off-2', 'off-3'] as const).map((bg) => (
        <Section key={bg} bg={bg} className="px-5 py-14 lg:px-24 lg:py-24">
          <p className="text-[18px] leading-[27px] text-text-secondary">Section background: {bg}</p>
          <div className="mt-4 max-w-[480px]"><Placeholder label={`Placeholder (${bg})`} ratio={1.6} /></div>
        </Section>
      ))}
      <Section contained className="px-5 py-14 lg:px-24 lg:py-24">
        <FAQ items={[{ q: 'What does a question look like?', a: 'Like this, with an answer underneath.' }, { q: LONG, a: 'Long question wraps.' }]} />
      </Section>
    </>
  );
}
