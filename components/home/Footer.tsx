import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const footerGroups = [
  {
    title: "認識我們",
    links: [{ label: "About DiveAI", href: "#about" }],
  },
  {
    title: "社群",
    links: [
      { label: "GitHub", href: "#github" },
      { label: "Instagram", href: "#instagram" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brandBlock}>
            <Link className={styles.logo} href="/" aria-label="DiveAI 首頁">
              <Image
                src="/images/diveai-wordmark.png"
                alt="呆一步 AI"
                width={1053}
                height={222}
              />
            </Link>
            <p className={styles.brandName}>DiveAI</p>
            <p className={styles.description}>
              陪你用更簡單、更踏實的方式，一步步走進 AI 的世界。
            </p>
          </div>

          <nav className={styles.navigation} aria-label="頁尾導覽">
            {footerGroups.map((group) => (
              <div className={styles.linkGroup} key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 DiveAI</p>
        </div>
      </div>
    </footer>
  );
}
