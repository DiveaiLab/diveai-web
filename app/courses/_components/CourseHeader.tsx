"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import styles from "./course-shell.module.css";

const navigation = [
  { label: "共學牆", href: "/commuity-wall" },
  { label: "AI 日報", href: "/articles" },
  { label: "線上課程", href: "/courses" },
  { label: "認識我們", href: "/aboutus" },
];

export function CourseHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="DiveAI 首頁"
          onClick={() => setIsOpen(false)}
        >
          <span className={styles.brandMark} aria-hidden="true">
            步
          </span>
          <span className={styles.brandType}>
            <strong>呆一步</strong>
            <small>DiveAI</small>
          </span>
        </Link>

        <button
          className={styles.menuButton}
          type="button"
          aria-label={isOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={isOpen}
          aria-controls="course-primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className={isOpen ? styles.menuLineTopOpen : styles.menuLineTop} />
          <span
            className={isOpen ? styles.menuLineBottomOpen : styles.menuLineBottom}
          />
        </button>

        <div
          id="course-primary-navigation"
          className={`${styles.headerNavWrap} ${isOpen ? styles.headerNavWrapOpen : ""}`}
        >
          <nav className={styles.navigation} aria-label="主要選單">
            {navigation.map((item) => {
              const isActive =
                item.href === "/courses" && pathname.startsWith("/courses");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? styles.activeNavigation : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            className={styles.authorLink}
            href="/admin/courses"
            onClick={() => setIsOpen(false)}
          >
            講師上稿
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
