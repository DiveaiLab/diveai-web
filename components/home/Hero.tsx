import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

// TODO: Replace the AI Toolbox placeholder when its route is confirmed.
const heroLinks = {
  about: "/aboutus",
  daily: "/articles",
  toolbox: "#ai-toolbox",
  community: "/commuity-wall",
} as const;

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heading}>
        <Image
          className={styles.wordmark}
          src="/images/diveai-wordmark.png"
          alt="呆一步 AI"
          width={1053}
          height={222}
          loading="eager"
          sizes="(max-width: 720px) 72vw, 340px"
        />
        <div className={styles.headingCopy}>
          <h1 id="hero-title">AI 沒有你想像中困難</h1>
          <p>點擊場景中的角色與物件，探索 DiveAI 的不同入口。</p>
        </div>
      </div>

      <div className={styles.scene} aria-label="DiveAI 辦公室互動探索場景">
        <Image
          className={styles.desktopArtwork}
          src="/images/hero-office-desktop.png"
          alt="乾淨復古的 DiveAI 辦公室，共學牆前擺著打字機、AI 日報與發光工具箱"
          fill
          sizes="(max-width: 760px) 1px, min(1180px, 100vw)"
        />
        <Image
          className={styles.mobileArtwork}
          src="/images/hero-office-mobile.png"
          alt="DiveAI 辦公室行動版場景"
          fill
          sizes="(max-width: 760px) calc(100vw - 32px), 1px"
        />

        <Link
          className={`${styles.hotspot} ${styles.communityHotspot}`}
          href={heroLinks.community}
          aria-label="前往共學牆"
        >
          <span className={styles.tooltip}>共學牆</span>
        </Link>

        <Link
          className={`${styles.hotspot} ${styles.dailyHotspot}`}
          href={heroLinks.daily}
          aria-label="前往 AI 日報"
        >
          <span className={styles.tooltip}>AI 日報</span>
        </Link>

        <Link
          id="ai-toolbox"
          className={`${styles.hotspot} ${styles.toolboxHotspot}`}
          href={heroLinks.toolbox}
          aria-label="前往 AI 工具箱"
        >
          <span className={styles.tooltip}>AI 工具箱</span>
        </Link>

        <Link
          className={`${styles.hotspot} ${styles.mascotHotspot}`}
          href={heroLinks.about}
          aria-label="前往 About Us"
        >
          <span className={styles.reaction} aria-hidden="true">
            <i>!</i>
            <i>!</i>
          </span>
          <Image
            className={styles.mascot}
            src="/images/diveai-mascot.png"
            alt="驚訝地發現工具箱的呆一布"
            width={237}
            height={221}
            loading="eager"
          />
          <span className={styles.mascotShadow} aria-hidden="true" />
          <span className={styles.tooltip}>About Us</span>
        </Link>
      </div>

      <a className={styles.cta} href="#explore-title">
        <span>探索更多</span>
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
