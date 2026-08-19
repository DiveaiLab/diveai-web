"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./ai-toolbox.module.css";

// 導覽列與頁尾：沿用 feature/homepage 分支 components/home/Navbar.tsx 與
// Footer.tsx 的結構與互動（品牌 wordmark、底線滑入、手機漢堡選單）。
//
// ⚠️ 整合階段注意：首頁已有同樣的元件，這裡是為了讓工具箱分頁能獨立運作而
// 複製一份。合併時應改為共用 components/home 的元件，刪掉這個檔案。

const navigation = [
  { label: "共學牆", href: "/commuity-wall" },
  { label: "日報", href: "/articles" },
  { label: "AI 工具箱", href: "/ai-toolbox", current: true },
  { label: "認識我們", href: "/aboutus" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="呆一步 AI 首頁">
          <Image
            src="/images/diveai-wordmark.png"
            alt="呆一步 AI"
            width={1053}
            height={222}
            priority
          />
        </Link>

        <button
          className={styles.menuButton}
          type="button"
          aria-label={isOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={isOpen}
          aria-controls="toolbox-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className={isOpen ? styles.lineTopOpen : styles.lineTop} />
          <span className={isOpen ? styles.lineBottomOpen : styles.lineBottom} />
        </button>

        <nav
          id="toolbox-navigation"
          className={`${styles.navigation} ${isOpen ? styles.navigationOpen : ""}`}
          aria-label="主要選單"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

const footerGroups = [
  {
    title: "探索",
    links: [
      { label: "About Us", href: "/aboutus" },
      { label: "共學牆", href: "/commuity-wall" },
      { label: "AI 日報", href: "/articles" },
      { label: "AI 工具箱", href: "/ai-toolbox" },
      // TODO: 學習群島路由確認後補上（沿用首頁 Footer 的待辦）
      { label: "學習群島", href: "#learning-islands" },
    ],
  },
  {
    title: "保持聯絡",
    links: [
      { label: "GitHub", href: "#github" },
      { label: "Instagram", href: "#instagram" },
      { label: "聯絡 DiveAI", href: "#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <Link className={styles.footerLogo} href="/" aria-label="呆一步 AI 首頁">
              <Image
                src="/images/diveai-wordmark.png"
                alt="呆一步 AI"
                width={1053}
                height={222}
              />
            </Link>
            <p className={styles.footerDescription}>
              陪你用更簡單、更踏實的方式，一步步走進 AI 的世界。
            </p>
          </div>

          <nav className={styles.footerNav} aria-label="頁尾導覽">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.footerBottom}>
          <p>DiveAI © 2026</p>
        </div>
      </div>
    </footer>
  );
}
