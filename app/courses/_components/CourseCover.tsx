import type { CourseAccent, CourseStatus } from "../_data/types";

import styles from "./course-cover.module.css";

const accentClass: Record<CourseAccent, string> = {
  aqua: styles.aqua,
  peach: styles.peach,
  navy: styles.navy,
  mint: styles.mint,
};

type CourseCoverProps = {
  code: string;
  eyebrow: string;
  shortTitle: string;
  accent: CourseAccent;
  status: CourseStatus;
  size?: "card" | "feature" | "detail" | "preview";
  showPlay?: boolean;
};

export function CourseCover({
  code,
  eyebrow,
  shortTitle,
  accent,
  status,
  size = "card",
  showPlay = false,
}: CourseCoverProps) {
  return (
    <div
      className={`${styles.cover} ${accentClass[accent]} ${styles[size]}`}
      aria-label={`${shortTitle} 課程封面`}
      role="img"
    >
      <div className={styles.coverTopline}>
        <span>{eyebrow}</span>
        <span>{code}</span>
      </div>

      <div className={styles.orbit} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.coverTitle}>
        <span className={styles.coverLabel}>ONLINE COURSE</span>
        <strong>{shortTitle}</strong>
      </div>

      <div className={styles.coverBottom}>
        <span>{status === "coming-soon" ? "COMING SOON" : "LEARN · TRY · SHARE"}</span>
        <span className={styles.stepMark} aria-hidden="true">
          一步
        </span>
      </div>

      {showPlay ? (
        <span className={styles.playBadge} aria-hidden="true">
          ▶
        </span>
      ) : null}
    </div>
  );
}
