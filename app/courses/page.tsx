import type { Metadata } from "next";
import Link from "next/link";

import { CourseCatalog } from "./_components/CourseCatalog";
import { LearningArchipelago } from "./_components/LearningArchipelago";
import { listPublicCourses } from "./_data/course-repository.server";
import styles from "./courses-page.module.css";

export const metadata: Metadata = {
  title: "線上課程",
  description:
    "DiveAI 學習群島：依照自己的程度逐步完成 AI 課程、解鎖關卡與新的學習大陸。",
};

export default async function CoursesPage() {
  const courses = await listPublicCourses();

  return (
    <main>
      <section className={styles.hero} aria-labelledby="course-page-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroContour} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>
              <span>DIVEAI LEARNING ARCHIPELAGO</span>
              <span className={styles.heroEyebrowLine} aria-hidden="true" />
              <span>你的 AI 學習航線</span>
            </p>
            <h1 id="course-page-title">
              每學會一步，
              <br />
              <span>下一座島就會出現。</span>
            </h1>
            <p className={styles.heroDescription}>
              不用一次征服整片 AI 世界。從符合你程度的島嶼啟航，完成一個真實任務、累積一項能力，再逐步解鎖下一塊大陸。
            </p>

            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#learning-archipelago">
                開始我的航線
                <span aria-hidden="true">↓</span>
              </a>
              <a className={styles.secondaryAction} href="#course-library">
                <span className={styles.playDot} aria-hidden="true">
                  目
                </span>
                直接瀏覽課程
              </a>
            </div>
          </div>

          <div className={styles.heroAside}>
            <div className={styles.routeCard}>
              <div className={styles.routeTopline}>
                <span>DEMO VOYAGE · 001</span>
                <span>示範航線</span>
              </div>
              <div className={styles.compass} aria-hidden="true">
                <span className={styles.compassNorth}>N</span>
                <strong>AI</strong>
                <span className={styles.compassNeedle} />
              </div>
              <p>目前航向</p>
              <h2>協作實作島</h2>
              <div
                className={styles.routeProgress}
                role="progressbar"
                aria-label="示範航線起始進度"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={25}
              >
                <span />
              </div>
              <div className={styles.routeFoot}>
                <span>完成關卡，解鎖下一站</span>
                <a href="#learning-archipelago">查看地圖 ↘</a>
              </div>
            </div>
            <div className={`${styles.heroIsland} ${styles.heroIslandA}`}>
              <span aria-hidden="true">01</span>
            </div>
            <div className={`${styles.heroIsland} ${styles.heroIslandB}`}>
              <span aria-hidden="true">02</span>
            </div>
          </div>
        </div>
      </section>

      <LearningArchipelago courses={courses} />

      <div id="course-library" className={styles.catalogAnchor}>
        <CourseCatalog courses={courses} />
      </div>

      <section className={styles.partnerSection}>
        <div>
          <p className={styles.partnerEyebrow}>TEACH WITH DIVEAI</p>
          <h2>有一套好方法？讓更多人跟著你做出來。</h2>
        </div>
        <div>
          <p>
            我們正在邀請不同領域的講師，一起把既有影音或全新內容整理成好找、好學、能完成作品的線上課程。
          </p>
          <Link href="/admin/courses">
            看看講師上稿流程
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
