import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.glowOne} aria-hidden="true" />
      <div className={styles.glowTwo} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.copy}>
          <Image
            className={styles.wordmark}
            src="/images/diveai-wordmark.png"
            alt="呆一步 AI"
            width={1053}
            height={222}
            priority
            sizes="(max-width: 720px) 86vw, 52vw"
          />

          <p className={styles.eyebrow}>DIVE INTO AI, ONE STEP AT A TIME</p>
          <h1 id="hero-title">AI 沒有你想像中困難</h1>
          <p className={styles.description}>
            陪你從第一步開始，把艱深的 AI 知識變成看得懂、學得會、用得上的日常能力。
          </p>

          <Link className={styles.cta} href="/courses">
            <span>開始探索</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className={styles.visual} aria-label="動畫角色視覺預留區">
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.characterCard}>
            <span className={styles.sparkOne} aria-hidden="true" />
            <span className={styles.sparkTwo} aria-hidden="true" />
            <Image
              className={styles.mascot}
              src="/images/diveai-mascot.png"
              alt="呆一步 AI 機器人圖示"
              width={237}
              height={221}
              priority
            />
          </div>
          <p className={styles.placeholderLabel}>ANIMATION PLACEHOLDER</p>
        </div>
      </div>
    </section>
  );
}
