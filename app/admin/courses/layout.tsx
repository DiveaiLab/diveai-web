import type { Metadata } from "next";
import Link from "next/link";
import "./admin-courses.css";

export const metadata: Metadata = {
  title: "課程上稿後台 Demo｜DHub",
  description: "DHub 線上課程內容管理與上稿流程 Demo。",
};

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />
    </svg>
  );
}

function CourseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 6 8-3 8 3-8 3-8-3Zm2 3.5V15c0 1.6 2.7 3 6 3s6-1.4 6-3V9.5l-6 2.2-6-2.2Zm13 0v6.1l1 1V9.1l-1 .4Z" />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm5 4v8l6-4-6-4Z" />
    </svg>
  );
}

export default function CourseAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="dhub-admin-course" lang="zh-Hant">
      <a className="dhub-admin-course__skip" href="#course-admin-content">
        跳到主要內容
      </a>

      <header className="dhub-admin-course__topbar">
        <Link className="dhub-admin-course__brand" href="/admin/courses">
          <span className="dhub-admin-course__brand-mark" aria-hidden="true">
            D
          </span>
          <span>
            <strong>DHub</strong>
            <small>Content Studio</small>
          </span>
        </Link>

        <div className="dhub-admin-course__topbar-meta">
          <span className="dhub-admin-course__demo-badge">DEMO MODE</span>
          <span className="dhub-admin-course__avatar" aria-hidden="true">
            編
          </span>
          <span className="dhub-admin-course__editor-label">示範編輯者</span>
        </div>
      </header>

      <div className="dhub-admin-course__body">
        <aside className="dhub-admin-course__sidebar">
          <p className="dhub-admin-course__nav-label">內容管理</p>
          <nav aria-label="後台主要導覽">
            <span className="dhub-admin-course__nav-item is-muted">
              <DashboardIcon />
              總覽
              <small>規劃中</small>
            </span>
            <Link
              className="dhub-admin-course__nav-item is-active"
              href="/admin/courses"
              aria-current="page"
            >
              <CourseIcon />
              線上課程
            </Link>
            <span className="dhub-admin-course__nav-item is-muted">
              <MediaIcon />
              影音素材
              <small>規劃中</small>
            </span>
          </nav>

          <div className="dhub-admin-course__sidebar-note">
            <strong>目前是功能 Demo</strong>
            <p>所有課程與送出結果都不會寫入資料庫。</p>
          </div>
        </aside>

        <main id="course-admin-content" className="dhub-admin-course__main">
          {children}
        </main>
      </div>
    </div>
  );
}
