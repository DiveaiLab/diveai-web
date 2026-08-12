import Link from "next/link";

import styles from "./course-shell.module.css";

export function CourseFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLead}>
          <Link className={styles.footerBrand} href="/">
            DiveAI
          </Link>
          <p>把 AI 學習變成一段有人同行、做得出成果的路。</p>
        </div>

        <nav className={styles.footerNavigation} aria-label="課程頁尾導覽">
          <div>
            <p>探索</p>
            <Link href="/courses">所有課程</Link>
            <Link href="/commuity-wall">共學牆</Link>
          </div>
          <div>
            <p>合作</p>
            <Link href="/admin/courses">講師上稿 Demo</Link>
            <Link href="/aboutus">關於 DiveAI</Link>
          </div>
        </nav>
      </div>

      <div className={styles.footerBottom}>
        <span>© 2026 DiveAI</span>
        <span>課程內容 Demo・資料尚未正式串接</span>
      </div>
    </footer>
  );
}
