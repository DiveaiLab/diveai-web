import Link from "next/link";

import styles from "./course-detail.module.css";

export default function CourseNotFound() {
  return (
    <main className={styles.notFound}>
      <p>COURSE NOT FOUND</p>
      <h1>這堂課可能還在準備中。</h1>
      <span>回到課程首頁，看看目前已經開放的學習內容。</span>
      <Link href="/courses">返回所有課程</Link>
    </main>
  );
}
