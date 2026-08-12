"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Course, FlatLesson } from "../_data/types";
import styles from "./lesson-workspace.module.css";

type LessonWorkspaceProps = {
  course: Course;
  lesson: FlatLesson;
};

export function LessonWorkspace({ course, lesson }: LessonWorkspaceProps) {
  const [activePanel, setActivePanel] = useState<"overview" | "notes">(
    "overview",
  );
  const [isComplete, setIsComplete] = useState(false);
  const [notes, setNotes] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const lessons = useMemo(
    () => course.sections.flatMap((section) => section.lessons),
    [course.sections],
  );
  const currentIndex = lessons.findIndex(
    (candidate) => candidate.slug === lesson.slug,
  );
  const nextPreview = lessons
    .slice(currentIndex + 1)
    .find((candidate) => candidate.isPreview);
  const progress = isComplete
    ? Math.round(((currentIndex + 1) / lessons.length) * 100)
    : Math.round((currentIndex / lessons.length) * 100);
  const youtubeUrl =
    lesson.videoProvider === "youtube" && lesson.videoId
      ? `https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0&modestbranding=1`
      : undefined;

  return (
    <main className={styles.workspace}>
      <div className={styles.workspaceTopbar}>
        <div className={styles.breadcrumb}>
          <Link href="/courses">課程</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/courses/${course.slug}`}>{course.shortTitle}</Link>
          <span aria-hidden="true">/</span>
          <span>{lesson.title}</span>
        </div>
        <span className={styles.demoBadge}>播放器 Demo</span>
      </div>

      <div className={styles.learningGrid}>
        <section className={styles.lessonMain}>
          <div className={styles.player}>
            {youtubeUrl ? (
              <iframe
                src={youtubeUrl}
                title={`${lesson.title} 試看影片`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : lesson.videoProvider === "mp4" && lesson.videoUrl ? (
              <video controls preload="metadata">
                <source src={lesson.videoUrl} />
                你的瀏覽器不支援影片播放。
              </video>
            ) : (
              <div className={styles.playerPlaceholder}>
                <span aria-hidden="true">▶</span>
                <strong>完整影片將於課程上線後開放</strong>
                <p>
                  後台已預留 YouTube、Vimeo 與 MP4 影片來源欄位。
                </p>
              </div>
            )}
          </div>

          <div className={styles.videoNotice}>
            <span aria-hidden="true">i</span>
            <p>
              此頁示範嵌入合作講師既有影音；目前影片僅供介面測試，正式內容與授權需另行確認。
            </p>
          </div>

          <header className={styles.lessonHeader}>
            <div>
              <p>
                CHAPTER {lesson.sectionIndex} · {lesson.sectionTitle}
              </p>
              <h1>{lesson.title}</h1>
              <span>{lesson.duration}・免費試看單元</span>
            </div>
            <button
              type="button"
              className={isComplete ? styles.completeButtonActive : ""}
              aria-pressed={isComplete}
              onClick={() => setIsComplete((complete) => !complete)}
            >
              <span aria-hidden="true">{isComplete ? "✓" : "○"}</span>
              {isComplete ? "已完成" : "標記完成"}
            </button>
          </header>

          <div className={styles.panelTabs} role="tablist" aria-label="單元內容">
            <button
              id="overview-tab"
              type="button"
              role="tab"
              aria-selected={activePanel === "overview"}
              aria-controls="overview-panel"
              onClick={() => setActivePanel("overview")}
            >
              單元摘要
            </button>
            <button
              id="notes-tab"
              type="button"
              role="tab"
              aria-selected={activePanel === "notes"}
              aria-controls="notes-panel"
              onClick={() => setActivePanel("notes")}
            >
              我的筆記
            </button>
          </div>

          {activePanel === "overview" ? (
            <section
              id="overview-panel"
              className={styles.overviewPanel}
              role="tabpanel"
              aria-labelledby="overview-tab"
            >
              <h2>這一段，我們要完成什麼？</h2>
              <p>{lesson.summary}</p>
              <div className={styles.takeaway}>
                <span>本課重點</span>
                <p>
                  AI 的價值不只在快速產生答案，而是在明確分工、持續回饋與最後查核中，幫助你保留判斷並更快完成成果。
                </p>
              </div>
              <h3>看完後，試著做</h3>
              <ol>
                <li>挑一件你這週真的需要完成的小任務。</li>
                <li>寫下哪些判斷必須由你負責、哪些步驟可以請 AI 協助。</li>
                <li>把你的分工方式留在筆記，作為下一單元的起點。</li>
              </ol>
            </section>
          ) : (
            <section
              id="notes-panel"
              className={styles.notesPanel}
              role="tabpanel"
              aria-labelledby="notes-tab"
            >
              <div className={styles.notesHeading}>
                <div>
                  <h2>留下你的判斷與問題</h2>
                  <p>Demo 筆記只保留在目前畫面，重新整理後會清除。</p>
                </div>
                <span>{notes.length} / 800</span>
              </div>
              <textarea
                value={notes}
                maxLength={800}
                onChange={(event) => {
                  setNotes(event.target.value);
                  setNoteMessage("");
                }}
                placeholder="例如：我想把下週的簡報作為練習，AI 可以幫我整理架構，但論點與資料來源要自己確認……"
              />
              <div className={styles.noteActions}>
                <p aria-live="polite">{noteMessage}</p>
                <button
                  type="button"
                  onClick={() =>
                    setNoteMessage(
                      notes.trim()
                        ? "已暫存於本頁 Demo"
                        : "請先寫下一點內容",
                    )
                  }
                >
                  暫存筆記
                </button>
              </div>
            </section>
          )}

          <nav className={styles.lessonNavigation} aria-label="單元導覽">
            <Link href={`/courses/${course.slug}`}>
              <span aria-hidden="true">←</span>
              返回課程大綱
            </Link>
            {nextPreview ? (
              <Link
                className={styles.nextLesson}
                href={`/courses/${course.slug}/lessons/${nextPreview.slug}`}
              >
                下一段試看
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <Link className={styles.nextLesson} href={`/courses/${course.slug}`}>
                完成試看
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </nav>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.progressHeader}>
            <div>
              <p>YOUR PROGRESS</p>
              <strong>{progress}%</strong>
            </div>
            <span>
              {isComplete ? currentIndex + 1 : currentIndex} / {lessons.length} 單元
            </span>
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className={styles.sidebarSections}>
            {course.sections.map((section) => (
              <section key={section.id}>
                <div className={styles.sidebarSectionTitle}>
                  <span>{section.index}</span>
                  <h2>{section.title}</h2>
                </div>
                <ol>
                  {section.lessons.map((item) => {
                    const isCurrent = item.slug === lesson.slug;

                    return (
                      <li key={item.slug}>
                        {item.isPreview ? (
                          <Link
                            href={`/courses/${course.slug}/lessons/${item.slug}`}
                            className={isCurrent ? styles.currentLesson : ""}
                            aria-current={isCurrent ? "page" : undefined}
                          >
                            <span className={styles.lessonStatus} aria-hidden="true">
                              {isCurrent ? "▶" : "○"}
                            </span>
                            <span>
                              <strong>{item.title}</strong>
                              <small>{item.duration}・試看</small>
                            </span>
                          </Link>
                        ) : (
                          <div className={styles.lockedLesson}>
                            <span className={styles.lessonStatus} aria-hidden="true">
                              ·
                            </span>
                            <span>
                              <strong>{item.title}</strong>
                              <small>{item.duration}・完整課程</small>
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
