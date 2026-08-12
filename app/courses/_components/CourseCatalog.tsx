"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { CourseSummary } from "../_data/types";
import { CourseCover } from "./CourseCover";
import styles from "./course-catalog.module.css";

type CourseCatalogProps = {
  courses: CourseSummary[];
};

export function CourseCatalog({ courses }: CourseCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const categories = [
    "全部",
    ...Array.from(new Set(courses.map((course) => course.category))),
  ];

  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-Hant");

    return courses.filter((course) => {
      const matchesCategory =
        activeCategory === "全部" || course.category === activeCategory;
      const searchableText = [
        course.title,
        course.summary,
        course.instructorName,
        course.category,
        ...course.tags,
      ]
        .join(" ")
        .toLocaleLowerCase("zh-Hant");

      return (
        matchesCategory &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [activeCategory, courses, query]);

  return (
    <section className={styles.catalog} aria-labelledby="catalog-title">
      <div className={styles.catalogHeading}>
        <div>
          <p className={styles.eyebrow}>COURSE LIBRARY</p>
          <h2 id="catalog-title">離開主線，自由探索所有課程</h2>
          <p>
            群島是一條建議航線，課程庫則沒有順序限制。依主題探索，或直接搜尋你正在解的問題。
          </p>
        </div>

        <label className={styles.search}>
          <span className={styles.visuallyHidden}>搜尋課程</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋主題、講師或技能"
          />
        </label>
      </div>

      <div
        className={styles.filterRow}
        role="group"
        aria-label="依課程分類篩選"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={activeCategory === category ? styles.activeFilter : ""}
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.resultSummary} aria-live="polite">
        <span>{visibleCourses.length} 堂課程</span>
        {query ? <span>搜尋「{query}」</span> : null}
      </div>

      {visibleCourses.length > 0 ? (
        <div className={styles.courseGrid}>
          {visibleCourses.map((course) => (
            <article className={styles.courseCard} key={course.slug}>
              <Link
                className={styles.coverLink}
                href={`/courses/${course.slug}`}
                aria-label={`查看課程：${course.title}`}
              >
                <CourseCover
                  code={course.code}
                  eyebrow={course.eyebrow}
                  shortTitle={course.shortTitle}
                  accent={course.accent}
                  status={course.status}
                />
              </Link>

              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span>{course.category}</span>
                  <span>{course.level}</span>
                  {course.status === "coming-soon" ? (
                    <span className={styles.comingSoon}>即將推出</span>
                  ) : null}
                </div>

                <h3>
                  <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                </h3>
                <p>{course.summary}</p>

                <div className={styles.cardDetails}>
                  <span>{course.instructorName}</span>
                  <span>
                    {course.duration}・{course.lessonCount} 單元
                  </span>
                </div>

                <Link
                  className={styles.cardAction}
                  href={`/courses/${course.slug}`}
                >
                  {course.status === "coming-soon" ? "查看課程預告" : "查看課程"}
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span aria-hidden="true">⌕</span>
          <h3>暫時沒有符合的課程</h3>
          <p>試著換一個關鍵字，或回到全部分類看看。</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("全部");
              setQuery("");
            }}
          >
            清除篩選
          </button>
        </div>
      )}
    </section>
  );
}
