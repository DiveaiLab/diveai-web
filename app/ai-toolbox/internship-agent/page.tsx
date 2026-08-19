import Image from "next/image";
import Link from "next/link";
import styles from "../ai-toolbox.module.css";
import { lineSeedTW } from "../fonts";
import { SiteFooter, SiteHeader } from "../site-chrome";

// 實習 Agent 產品介紹頁
// 視覺語言取自 feature/homepage 分支的呆一步 AI 首頁，說明見 ai-toolbox.module.css。

const steps = [
  {
    index: "01",
    title: "盤點你的方向",
    body: "先聊聊你的科系、想投的產業與時間，幫你把「好像什麼都可以」收斂成三、四個具體目標。",
  },
  {
    index: "02",
    title: "一起改履歷",
    body: "針對每個目標職缺，逐段檢視你的履歷，指出哪裡太籠統、哪些經驗值得放大，並給可直接套用的寫法。",
  },
  {
    index: "03",
    title: "模擬面試練手感",
    body: "依職缺出題，一題一題陪你練；答完立刻回饋，讓你在正式面試前就先跑過一遍。",
  },
];

const fitsYou = [
  "履歷改了很多版，但不確定到底哪一版比較好。",
  "想投實習，卻不知道自己的經歷適合什麼職缺。",
  "面試前只能自己對著鏡子練，沒有人給回饋。",
];

export default function InternshipAgentPage() {
  return (
    <div className={`${lineSeedTW.variable} ${styles.page}`}>
      <SiteHeader />

      <main>
        <section className={styles.hero} aria-labelledby="internship-title">
          <Link className={styles.backLink} href="/ai-toolbox">
            <span aria-hidden="true">←</span>
            回 AI 工具箱
          </Link>

          <div className={styles.heroInner} style={{ marginTop: "28px" }}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>INTERNSHIP AGENT</p>
              <h1 id="internship-title">找實習這件事，有人陪你一起跑</h1>
              <p>
                不是再丟給你一份「投履歷技巧懶人包」，而是從你的實際情況出發，陪你把履歷改好、把面試練熟，一路走到真的投出去、拿到回音。
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.pillGhost} href="#steps">
                  看看它怎麼幫你
                </Link>
              </div>
            </div>

            <Image
              className={styles.heroMascot}
              src="/images/diveai-mascot.png"
              alt="呆一布陪你準備實習"
              width={237}
              height={221}
              priority
            />
          </div>
        </section>

        <section className={styles.panel} id="steps" aria-labelledby="steps-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>HOW IT HELPS</p>
              <h2 id="steps-title">它會怎麼幫你</h2>
              <p>三個階段一路走完，每一步都有具體產出，不會只停在「知道要做」。</p>
            </div>

            <ol className={styles.steps}>
              {steps.map((step) => (
                <li className={styles.step} key={step.index}>
                  <span className={styles.stepIndex}>{step.index}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className={`${styles.panel} ${styles.panelAlt}`}
          aria-labelledby="fits-title"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>IS IT FOR YOU</p>
              <h2 id="fits-title">如果你有這些狀況，它幫得上忙</h2>
            </div>

            <ul className={styles.checkList}>
              {fitsYou.map((item) => (
                <li key={item}>
                  <span className={styles.checkMark} aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div
              className={styles.ctaPanel}
              style={{ marginTop: "clamp(40px, 5vw, 64px)" }}
            >
              <h2>準備好要開始了嗎？</h2>
              <p>
                實習 Agent 正在收尾，還沒開放試用。上線後我們會在共學牆與 DiveAI Letter
                第一時間通知你。
              </p>
              <div className={styles.ctaActions}>
                <button
                  className={styles.pillDisabled}
                  type="button"
                  disabled
                  aria-disabled="true"
                >
                  還在開發中
                </button>
                <Link className={styles.pillGhost} href="/ai-toolbox">
                  先看看其他工具
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
