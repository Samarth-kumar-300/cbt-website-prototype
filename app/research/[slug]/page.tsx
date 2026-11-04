import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResearchDetailPage } from '@/components/pages/research/ResearchDetailPage';
import { getStudy, STUDIES } from '@/components/pages/research/studies';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return STUDIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) return {};
  return {
    title: `${study.metaTitle} | CognitiveBotics`,
    description: study.metaDescription,
    alternates: { canonical: `/research/${study.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) notFound();
  return <ResearchDetailPage study={study} />;
}
