import { CtaPanel } from '@/components/shared/CtaPanel';
import { JsonLd } from '@/components/shared/JsonLd';
import { pricingContent as c } from './content';
import { pricingJsonLd } from './seo';
import { Section0 } from './sections/Section0';
import { Section1 } from './sections/Section1';
import { Section2 } from './sections/Section2';
import { Section3 } from './sections/Section3';

export function PricingPage() {
  return (
    <>
      <Section0 />
      <Section1 />
      <Section2 />
      <Section3 />
      <CtaPanel heading={c.cta.heading} body={c.cta.body} label={c.cta.label} href={c.cta.href} />
      <JsonLd data={pricingJsonLd()} />
    </>
  );
}
