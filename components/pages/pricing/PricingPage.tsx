import { CtaPanel } from '@/components/shared/CtaPanel';
import { JsonLd } from '@/components/shared/JsonLd';
import { SkillsScroller } from '@/components/shared/SkillsScroller';
import { TestimonialsSection } from '@/components/shared/TestimonialsSection';
import { AudienceTabs } from './AudienceTabs';
import { AUDIENCE_IDS, DEFAULT_AUDIENCE, audiences, type Audience, type AudienceId } from './content';
import { pricingJsonLd } from './seo';
import { Faq } from './sections/Faq';
import { Gets } from './sections/Gets';
import { Hero } from './sections/Hero';
import { Intro } from './sections/Intro';
import { ParentsPanel } from './sections/ParentsPanel';
import { Plans } from './sections/Plans';

/** Video card copy from the client doc; the shared defaults stay as they are for Home. */
export const PRICING_VIDEO = {
  title: 'Importance of Early Intervention and Preparing Children for Healthy Digital Engagement',
  role: 'Inclusive Education Specialist, Founder Trustee, Chakshumathi',
  linkLabel: 'Explore expert insights',
  byline: true,
} as const;

function AudiencePanel({ a }: { a: Audience }) {
  return (
    <>
      <Intro a={a} />
      <SkillsScroller className="bg-white px-5 pb-10 pt-6 lg:px-24 lg:pb-14 lg:pt-4" />
      <Gets a={a} />
      <Plans a={a} />
      <ParentsPanel />
      <TestimonialsSection heading={a.testimonials.heading} railOrder={a.testimonials.order} tone="flat-aqua" video={PRICING_VIDEO} />
      <Faq a={a} />
      <CtaPanel heading={a.cta.heading} body={a.cta.body} label={a.cta.label} href={a.cta.href} wideBody />
    </>
  );
}

export function PricingPage({ initial = DEFAULT_AUDIENCE }: { initial?: AudienceId }) {
  return (
    <>
      <Hero />
      <AudienceTabs
        initial={initial}
        tabs={AUDIENCE_IDS.map((id) => ({ id, label: audiences[id].tabLabel }))}
        panels={{
          'therapy-centres': <AudiencePanel a={audiences['therapy-centres']} />,
          schools: <AudiencePanel a={audiences.schools} />,
        }}
      />
      <JsonLd data={pricingJsonLd()} />
    </>
  );
}
