import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CourseCover } from "../_components/CourseCover";
import {
  getCourseBySlug,
  getCourseSlugs,
} from "../_data/course-repository.server";
import styles from "./course-detail.module.css";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getCourseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return { title: "找不到課程" };
  }

  return {
    title: course.shortTitle,
    description: course.summary,
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  const previewLesson = course.sections
    .flatMap((section) => section.lessons)
    .find((lesson) => lesson.isPreview);
  const previewHref = previewLesson
    ? `/courses/${course.slug}/lessons/${previewLesson.slug}`
    : undefined;

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.breadcrumb} aria-label="麵包屑">
            <Link href="/courses">線上課程</Link>
            <span aria-hidden="true">/</span>
            <span>{course.category}</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.pills}>
                <span>{course.category}</span>
                <span>{course.level}</span>
                <span>{course.accessLabel}</span>
              </div>
              <p className={styles.courseCode}>{course.code}</p>
              <h1>{course.title}</h1>
              <p className={styles.summary}>{course.summary}</p>

              <div className={styles.heroActions}>
                {course.status === "published" && previewHref ? (
                  <Link className={styles.primaryAction} href={previewHref}>
                    <span className={styles.playIcon} aria-hidden="true">
                      ▶
                    </span>
                    免費試看第一單元
                  </Link>
                ) : (
                  <a className={styles.primaryAction} href="#course-reminder">
                    登記到課提醒
                    <span aria-hidden="true">↓</span>
                  </a>
                )}
                <a className={styles.textAction} href="#course-outline">
                  先看課程大綱
                </a>
              </div>

              <dl className={styles.heroFacts}>
                <div>
                  <dt>講師</dt>
                  <dd>{course.instructor.name}</dd>
                </div>
                <div>
                  <dt>內容</dt>
                  <dd>{course.lessonCount} 段單元</dd>
                </div>
                <div>
                  <dt>總長</dt>
                  <dd>{course.duration}</dd>
                </div>
              </dl>
            </div>

            <div className={styles.coverWrap}>
              <CourseCover
                code={course.code}
                eyebrow={course.eyebrow}
                shortTitle={course.shortTitle}
                accent={course.accent}
                status={course.status}
                size="detail"
                showPlay={course.status === "published"}
              />
              <div className={styles.coverCaption}>
                <span>{course.releaseLabel}</span>
                <span>{course.studentLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.introduction}>
        <div className={styles.introLabel}>
          <span>ABOUT THIS COURSE</span>
          <span aria-hidden="true">01</span>
        </div>
        <div className={styles.introContent}>
          <h2>不是把答案交給 AI，<br />而是學會一起把事情做好。</h2>
          <p>{course.description}</p>
        </div>
      </section>

      <section className={styles.outcomesSection}>
        <div className={styles.outcomesInner}>
          <div className={styles.outcomesHeading}>
            <p>AFTER THE COURSE</p>
            <h2>上完這堂課，<br />你會帶走什麼？</h2>
          </div>
          <ol className={styles.outcomeList}>
            {course.outcomes.map((outcome, index) => (
              <li key={outcome}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{outcome}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="course-outline" className={styles.curriculumSection}>
        <div className={styles.curriculumHeader}>
          <div>
            <p>COURSE OUTLINE</p>
            <h2>跟著一個節奏，<br />把方法練成自己的。</h2>
          </div>
          <p>
            共 {course.sections.length} 章、{course.lessonCount} 段單元。每一章都有一個明確成果，適合分次完成。
          </p>
        </div>

        <div className={styles.curriculumGrid}>
          <div className={styles.sectionList}>
            {course.sections.map((section, index) => (
              <details key={section.id} open={index === 0}>
                <summary>
                  <span className={styles.sectionIndex}>{section.index}</span>
                  <span className={styles.sectionSummaryCopy}>
                    <strong>{section.title}</strong>
                    <small>{section.lessons.length} 段單元</small>
                  </span>
                  <span className={styles.summaryToggle} aria-hidden="true">
                    ＋
                  </span>
                </summary>

                <div className={styles.sectionBody}>
                  <p>{section.description}</p>
                  <ol>
                    {section.lessons.map((lesson) => (
                      <li key={lesson.slug}>
                        <span className={styles.lessonMark} aria-hidden="true">
                          {lesson.isPreview ? "▶" : "·"}
                        </span>
                        <span className={styles.lessonCopy}>
                          <strong>{lesson.title}</strong>
                          <small>{lesson.summary}</small>
                        </span>
                        <span className={styles.lessonDuration}>
                          {lesson.duration}
                        </span>
                        {lesson.isPreview ? (
                          <Link
                            href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                          >
                            試看
                          </Link>
                        ) : (
                          <span className={styles.lockedLabel}>完整課程</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </details>
            ))}
          </div>

          <aside className={styles.enrollCard}>
            <p className={styles.enrollEyebrow}>START LEARNING</p>
            <h3>
              {course.status === "coming-soon"
                ? "課程準備中"
                : "先從免費單元開始"}
            </h3>
            <p>
              {course.status === "coming-soon"
                ? "留下到課意願，正式內容與合作講師資訊確認後通知你。"
                : "Demo 階段不需登入或付款，先體驗完整播放器與學習筆記介面。"}
            </p>
            <ul>
              <li>
                <span aria-hidden="true">✓</span>
                隨選影音與章節導覽
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                課堂摘要與個人筆記
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                後續可串接學習進度
              </li>
            </ul>
            {course.status === "published" && previewHref ? (
              <Link href={previewHref}>開始免費試看</Link>
            ) : (
              <a href="#course-reminder">登記到課提醒</a>
            )}
            <small>目前為產品 Demo，不會建立正式帳號或訂單。</small>
          </aside>
        </div>
      </section>

      <section className={styles.instructorSection}>
        <div className={styles.instructorAvatar} aria-hidden="true">
          <span>{course.instructor.initials}</span>
        </div>
        <div className={styles.instructorIntro}>
          <p>YOUR INSTRUCTOR</p>
          <h2>{course.instructor.name}</h2>
          <span>{course.instructor.role}</span>
        </div>
        <p className={styles.instructorBio}>{course.instructor.bio}</p>
      </section>

      <section id="course-reminder" className={styles.reminderSection}>
        <div>
          <p>KEEP ONE STEP AHEAD</p>
          <h2>準備好了，就從這一步開始。</h2>
        </div>
        <div>
          <p>
            目前課程內容與上稿流程皆為 Demo。正式上線後，這裡會依課程狀態提供免費加入、付費購買或到課通知。
          </p>
          {previewHref ? (
            <Link href={previewHref}>
              試看這堂課
              <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            <Link href="/courses">
              探索其他課程
              <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
