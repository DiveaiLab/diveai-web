"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.css";

const navigation = [
  { label: "共學牆", href: "/commuity-wall" },
  { label: "日報", href: "/articles" },
  { label: "認識我們", href: "#about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
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
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className={isOpen ? styles.lineTopOpen : styles.lineTop} />
          <span className={isOpen ? styles.lineBottomOpen : styles.lineBottom} />
        </button>

        <nav
          id="primary-navigation"
          className={`${styles.navigation} ${isOpen ? styles.navigationOpen : ""}`}
          aria-label="主要選單"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
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
