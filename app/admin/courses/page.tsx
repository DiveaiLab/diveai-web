import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "課程管理｜DHub Content Studio",
  description: "查看 DHub 線上課程內容與上稿狀態。",
};

const demoCourses = [
  {
    title: "AI 工作流實戰：把重複工作交給 AI",
    instructor: "DHub 教學團隊",
    status: "已發佈",
    statusClass: "published",
    lessons: 8,
    duration: "2 小時 35 分",
    updatedAt: "今天 10:24",
    coverClass: "flow",
    monogram: "AI",
  },
  {
    title: "Prompt Engineering 從提問到共創",
    instructor: "合作講師・林老師",
    status: "待審核",
    statusClass: "review",
    lessons: 6,
    duration: "1 小時 48 分",
    updatedAt: "昨天 16:40",
    coverClass: "prompt",
    monogram: "PE",
  },
  {
    title: "用生成式 AI 建立品牌內容系統",
    instructor: "合作講師・陳老師",
    status: "草稿",
    statusClass: "draft",
    lessons: 4,
    duration: "尚未設定",
    updatedAt: "8 月 8 日",
    coverClass: "brand",
    monogram: "BR",
  },
] as const;

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
    </svg>
  );
}

export default function AdminCoursesPage() {
  return (
    <div className="dhub-admin-course__page">
      <section className="dhub-admin-course__page-heading">
        <div>
          <div className="dhub-admin-course__eyebrow">
            CONTENT / COURSES
          </div>
          <h1>課程管理</h1>
          <p>集中查看課程狀態，並用一致的欄位建立教學內容。</p>
        </div>
        <Link
          className="dhub-admin-course__button is-primary"
          href="/admin/courses/new"
        >
          <PlusIcon />
          建立新課程
        </Link>
      </section>

      <section className="dhub-admin-course__demo-callout" aria-label="Demo 提醒">
        <span aria-hidden="true">i</span>
        <div>
          <strong>這是一組上稿流程示意資料</strong>
          <p>
            下方列表不代表實際課程庫；新課程表單只會驗證內容，不會永久儲存。
          </p>
        </div>
      </section>

      <section
        className="dhub-admin-course__stats"
        aria-label="課程內容狀態摘要"
      >
        <article>
          <span>全部課程</span>
          <strong>3</strong>
          <small>Demo 資料</small>
        </article>
        <article>
          <span>已發佈</span>
          <strong>1</strong>
          <small>可在前台顯示</small>
        </article>
        <article>
          <span>待審核</span>
          <strong>1</strong>
          <small>等待內容確認</small>
        </article>
        <article>
          <span>草稿</span>
          <strong>1</strong>
          <small>尚未完成</small>
        </article>
      </section>

      <section className="dhub-admin-course__list-panel" aria-labelledby="course-list-title">
        <div className="dhub-admin-course__panel-heading">
          <div>
            <h2 id="course-list-title">所有課程</h2>
            <p>3 筆示意內容</p>
          </div>
          <span className="dhub-admin-course__static-filter" aria-label="目前顯示全部狀態">
            全部狀態
          </span>
        </div>

        <div className="dhub-admin-course__course-list">
          <div className="dhub-admin-course__list-header" aria-hidden="true">
            <span>課程</span>
            <span>狀態</span>
            <span>內容</span>
            <span>最後更新</span>
            <span>操作</span>
          </div>

          {demoCourses.map((course) => (
            <article className="dhub-admin-course__course-row" key={course.title}>
              <div className="dhub-admin-course__course-identity">
                <div
                  className={`dhub-admin-course__mini-cover is-${course.coverClass}`}
                  aria-hidden="true"
                >
                  <span>{course.monogram}</span>
                </div>
                <div>
                  <h3>{course.title}</h3>
                  <p>{course.instructor}</p>
                </div>
              </div>

              <div className="dhub-admin-course__mobile-label">狀態</div>
              <div>
                <span
                  className={`dhub-admin-course__status is-${course.statusClass}`}
                >
                  {course.status}
                </span>
              </div>

              <div className="dhub-admin-course__mobile-label">內容</div>
              <div className="dhub-admin-course__course-meta">
                <strong>{course.lessons} 堂</strong>
                <span>{course.duration}</span>
              </div>

              <div className="dhub-admin-course__mobile-label">最後更新</div>
              <time>{course.updatedAt}</time>

              <div className="dhub-admin-course__mobile-label">操作</div>
              <button
                className="dhub-admin-course__text-button"
                type="button"
                disabled
                title="編輯功能將於串接資料庫後開放"
              >
                編輯（規劃中）
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
