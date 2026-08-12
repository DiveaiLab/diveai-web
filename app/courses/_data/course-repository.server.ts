import "server-only";

import { courses } from "./mock-courses";
import type { Course, CourseSummary, FlatLesson } from "./types";

function toSummary(course: Course): CourseSummary {
  const previewLesson = course.sections
    .flatMap((section) => section.lessons)
    .find((lesson) => lesson.isPreview);

  return {
    slug: course.slug,
    code: course.code,
    eyebrow: course.eyebrow,
    title: course.title,
    shortTitle: course.shortTitle,
    summary: course.summary,
    category: course.category,
    level: course.level,
    duration: course.duration,
    lessonCount: course.lessonCount,
    releaseLabel: course.releaseLabel,
    studentLabel: course.studentLabel,
    accessLabel: course.accessLabel,
    accent: course.accent,
    status: course.status,
    featured: course.featured,
    tags: [...course.tags],
    instructorName: course.instructor.name,
    previewHref: previewLesson
      ? `/courses/${course.slug}/lessons/${previewLesson.slug}`
      : undefined,
  };
}

export async function listPublicCourses(): Promise<CourseSummary[]> {
  return courses
    .filter((course) => course.status !== "draft")
    .map(toSummary);
}

export async function getFeaturedCourse(): Promise<
  CourseSummary | undefined
> {
  const course = courses.find(
    (candidate) => candidate.featured && candidate.status === "published",
  );

  return course ? toSummary(course) : undefined;
}

export async function getCourseBySlug(
  slug: string,
): Promise<Course | undefined> {
  return courses.find(
    (course) => course.slug === slug && course.status !== "draft",
  );
}

export async function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string,
): Promise<{ course: Course; lesson: FlatLesson } | undefined> {
  const course = await getCourseBySlug(courseSlug);

  if (!course) return undefined;

  for (const section of course.sections) {
    const lesson = section.lessons.find(
      (candidate) => candidate.slug === lessonSlug,
    );

    if (lesson) {
      return {
        course,
        lesson: {
          ...lesson,
          sectionId: section.id,
          sectionIndex: section.index,
          sectionTitle: section.title,
        },
      };
    }
  }

  return undefined;
}

export function getCourseSlugs(): string[] {
  return courses
    .filter((course) => course.status !== "draft")
    .map((course) => course.slug);
}

export function getLessonParams(): Array<{
  slug: string;
  lessonSlug: string;
}> {
  return courses.flatMap((course) =>
    course.sections.flatMap((section) =>
      section.lessons.map((lesson) => ({
        slug: course.slug,
        lessonSlug: lesson.slug,
      })),
    ),
  );
}
