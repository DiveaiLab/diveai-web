import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonWorkspace } from "../../../_components/LessonWorkspace";
import {
  getLessonBySlug,
  getLessonParams,
} from "../../../_data/course-repository.server";

type LessonPageProps = {
  params: Promise<{ slug: string; lessonSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getLessonParams();
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const result = await getLessonBySlug(slug, lessonSlug);

  if (!result) return { title: "找不到單元" };

  return {
    title: `${result.lesson.title}｜${result.course.shortTitle}`,
    description: result.lesson.summary,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const result = await getLessonBySlug(slug, lessonSlug);

  if (!result) notFound();

  return <LessonWorkspace course={result.course} lesson={result.lesson} />;
}
