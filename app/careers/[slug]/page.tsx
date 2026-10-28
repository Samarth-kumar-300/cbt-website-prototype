import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOBS, getJob } from "@/components/pages/job/content";
import { JobPage } from "@/components/pages/job/JobPage";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return {};
  return {
    title: `${job.title} | CognitiveBotics`,
    description: `${job.title} role at CognitiveBotics.`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();
  return <JobPage job={job} />;
}
