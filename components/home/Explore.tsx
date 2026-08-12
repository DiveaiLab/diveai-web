import Link from "next/link";
import styles from "./Explore.module.css";

const destinations = [
  {
    id: "community-wall",
    index: "01",
    eyebrow: "COMMUNITY WALL",
    title: "共學牆",
    description:
      "透過真實案例，看看其他人如何把 AI 運用在生活、學習與工作中，建立自己的 AI 思維。",
    highlights: ["生活應用", "學習方法", "工作實踐"],
    href: "/commuity-wall",
    action: "看看大家怎麼做",
    tone: "community",
  },
  {
    id: "daily",
    index: "02",
    eyebrow: "AI DAILY",
    title: "AI 日報",
    description:
      "快速掌握 AI 最新發展與觀察，降低資訊焦慮，持續建立對 AI 的理解。",
    highlights: ["趨勢速覽", "重點解讀", "持續理解"],
    href: "/articles",
    action: "閱讀今日精選",
    tone: "daily",
  },
] as const;

export function Explore() {
  return (
    <section className={styles.explore} aria-labelledby="explore-title">
      <div className={styles.container}>
        <div className={styles.headingGroup}>
          <p className={styles.eyebrow}>EXPLORE DIVEAI</p>
          <h2 id="explore-title">接下來，你想從哪裡開始？</h2>
          <p className={styles.introduction}>
            不用一次懂完所有事。選一個感興趣的入口，從真實經驗或每日新知開始探索 AI。
          </p>
        </div>

        <div className={styles.grid}>
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              className={`${styles.card} ${styles[destination.tone]}`}
              href={destination.href}
              aria-labelledby={`${destination.id}-title`}
            >
              <div className={styles.cardTopline}>
                <span>{destination.eyebrow}</span>
                <span className={styles.index}>{destination.index}</span>
              </div>

              <div className={styles.cardContent}>
                <h3 id={`${destination.id}-title`}>{destination.title}</h3>
                <p>{destination.description}</p>

                <ul className={styles.highlights} aria-label="內容包含">
                  {destination.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardAction}>
                <span>{destination.action}</span>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
