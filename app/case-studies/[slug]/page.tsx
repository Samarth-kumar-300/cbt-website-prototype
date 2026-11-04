import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyDetail } from '@/components/pages/case-studies/CaseStudyDetail';
import { CASE_STUDIES, getCaseStudy } from '@/components/pages/case-studies/content';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.org} case study | CognitiveBotics`,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
    ...(study.placeholder ? { robots: { index: false } } : {}),
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyDetail study={study} />;
}
