import Image from "next/image";
import Link from "next/link";
import styles from "./ai-toolbox.module.css";
import { lineSeedTW } from "./fonts";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { scenarios, type Tool } from "./tools";
import { WishPool } from "./wish-pool";

// AI 工具箱 首頁
// 視覺語言取自 feature/homepage 分支的呆一步 AI 首頁（品牌色、大圓角卡片、
// eyebrow 標籤、膠囊標籤、圓形箭頭）。
//
// 工具以「使用情境」分組，而非依技術類型分類：使用者通常知道自己卡在哪件事，
// 但不知道該用哪個 AI。

const steps = [
  {
    index: "01",
    title: "先找情境",
    body: "從上面的分類找到你現在卡住的那一步，不用先懂 AI。",
  },
  {
    index: "02",
    title: "挑一個工具",
    body: "每個工具只處理一件事，照著它的流程走就好。",
  },
  {
    index: "03",
    title: "帶回你的成果",
    body: "做完的履歷、報告或練習紀錄，都能直接帶去共學牆討論。",
  },
];

export default function AiToolboxPage() {
  const availableCount = scenarios
    .flatMap((scenario) => scenario.tools)
    .filter((tool) => tool.href).length;

  return (
    <div className={`${lineSeedTW.variable} ${styles.page}`}>
      <SiteHeader />

      <main>
        <section className={styles.hero} aria-labelledby="toolbox-title">
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>AI TOOLBOX</p>
              <h1 id="toolbox-title">把 AI，變成隨手可用的即戰力</h1>
              <p>
                這裡收錄我們為共學夥伴打造的小工具。每一個都對準一個具體、真的會卡住你的情境——先解決那件事，而不是給你一個什麼都能做、卻不知從何用起的大模型。
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.pillPrimary} href="#tools">
                  <span>看看有哪些工具</span>
                  <span aria-hidden="true">↓</span>
                </Link>
                <Link
                  className={styles.pillGhost}
                  href="/ai-toolbox/internship-agent"
                >
                  先看實習 Agent
                </Link>
              </div>
            </div>

            <Image
              className={styles.heroMascot}
              src="/images/diveai-mascot.png"
              alt="呆一布正在整理工具箱"
              width={237}
              height={221}
              priority
            />
          </div>
        </section>

        <section className={styles.panel} id="tools" aria-labelledby="tools-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>FIND BY SITUATION</p>
              <h2 id="tools-title">依情境找工具</h2>
              <p>
                不用先想「該用哪個 AI」，先找到你現在卡住的那件事。目前有 {availableCount}{" "}
                個工具開放試用，其餘正在陸續開發中。
              </p>
            </div>

            {/* 快捷鍵：直接跳到想看的情境，不用一路往下捲 */}
            <ul className={styles.shortcuts} aria-label="快速跳到情境">
              {scenarios.map((scenario) => (
                <li key={scenario.id}>
                  <a className={styles.shortcut} href={`#${scenario.id}`}>
                    {scenario.title}
                    <span className={styles.shortcutCount}>
                      {scenario.tools.length}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  className={`${styles.shortcut} ${styles.shortcutWish}`}
                  href="#wish"
                >
                  工具許願池
                  <span aria-hidden="true">✦</span>
                </a>
              </li>
            </ul>

            <div className={styles.scenarios}>
              {scenarios.map((scenario) => (
                <section
                  key={scenario.id}
                  id={scenario.id}
                  className={styles.anchor}
                  aria-labelledby={`${scenario.id}-title`}
                >
                  <div className={styles.scenarioHeading}>
                    <div>
                      <h3 id={`${scenario.id}-title`}>{scenario.title}</h3>
                      <p>{scenario.lead}</p>
                    </div>
                    <span className={styles.scenarioCount}>
                      {scenario.tools.length} 個工具
                    </span>
                  </div>

                  <ul className={styles.grid}>
                    {scenario.tools.map((tool) => (
                      <li key={tool.name}>
                        <ToolCard tool={tool} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>

        {/* 工具許願池 */}
        <section
          className={styles.panel}
          id="wish"
          aria-labelledby="wish-title"
          style={{ borderRadius: 0, paddingTop: 0 }}
        >
          <div className={`${styles.container} ${styles.anchor}`}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>WISH POOL</p>
              <h2 id="wish-title">沒有你要的工具？來許願</h2>
              <p>
                工具箱要做什麼，是看大家真的卡在哪裡決定的。說出你想要的工具，敲碗的人越多，我們就越早做。
              </p>
            </div>

            <WishPool />
          </div>
        </section>

        <section
          className={`${styles.panel} ${styles.panelAlt}`}
          aria-labelledby="howto-title"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>HOW IT WORKS</p>
              <h2 id="howto-title">工具箱怎麼用？</h2>
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

            <div className={styles.ctaPanel} style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
              <h2>想先看看工具長什麼樣子？</h2>
              <p>
                實習 Agent 是目前唯一開放試用的工具，可以先進去看看它會怎麼陪你跑完一次求職流程。
              </p>
              <div className={styles.ctaActions}>
                <Link
                  className={styles.pillPrimary}
                  href="/ai-toolbox/internship-agent"
                >
                  <span>認識實習 Agent</span>
                  <span aria-hidden="true">↗</span>
                </Link>
                <Link className={styles.pillGhost} href="/commuity-wall">
                  去共學牆看看
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

function ToolCard({ tool }: { tool: Tool }) {
  const available = Boolean(tool.href);

  const inner = (
    <>
      <div className={styles.cardTopline}>
        <span>{tool.eyebrow}</span>
        <span
          className={`${styles.statusBadge} ${available ? "" : styles.statusSoon}`}
        >
          {available ? "可以試用" : "還在開發中"}
        </span>
      </div>

      <div className={styles.cardBody}>
        <h4>{tool.name}</h4>
        <p>{tool.summary}</p>
        <ul className={styles.highlights} aria-label="內容包含">
          {tool.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      <div
        className={`${styles.cardAction} ${available ? "" : styles.cardActionSoon}`}
      >
        <span>{available ? "進一步了解" : "敬請期待"}</span>
        <span
          className={`${styles.arrow} ${available ? "" : styles.arrowSoon}`}
          aria-hidden="true"
        >
          {available ? "↗" : "···"}
        </span>
      </div>
    </>
  );

  if (!available) {
    // 尚未開放的工具不是連結，也不可聚焦，避免鍵盤操作時停在點不了的項目上
    return <div className={`${styles.card} ${styles.cardSoon}`}>{inner}</div>;
  }

  return (
    <Link className={`${styles.card} ${styles.cardAvailable}`} href={tool.href!}>
      {inner}
    </Link>
  );
}
