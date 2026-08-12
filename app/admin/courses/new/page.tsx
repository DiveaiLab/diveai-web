import type { Metadata } from "next";
import Link from "next/link";
import { CourseEditorForm } from "./course-editor-form";

export const metadata: Metadata = {
  title: "建立新課程｜DHub Content Studio",
  description: "建立 DHub 線上課程的基本資料、影音與課綱。",
};

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m10.7 5.3-6 6a1 1 0 0 0 0 1.4l6 6 1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4Z" />
    </svg>
  );
}

export default function NewCoursePage() {
  return (
    <div className="dhub-admin-course__page is-editor-page">
      <Link className="dhub-admin-course__back-link" href="/admin/courses">
        <ArrowLeftIcon />
        返回課程列表
      </Link>

      <section className="dhub-admin-course__page-heading is-editor-heading">
        <div>
          <div className="dhub-admin-course__eyebrow">COURSES / NEW</div>
          <h1>建立新課程</h1>
          <p>先整理基本資訊、影音與課綱，右側會同步呈現學員看到的內容摘要。</p>
        </div>
      </section>

      <CourseEditorForm />
    </div>
  );
}
