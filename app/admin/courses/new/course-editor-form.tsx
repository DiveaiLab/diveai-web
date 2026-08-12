"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import { saveCourseAction } from "../actions";
import {
  courseCategories,
  courseLevels,
  initialCourseActionState,
  type CourseActionState,
  type CourseField,
  type VideoSource,
} from "../types";

type EditorValues = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  durationMinutes: string;
  coverUrl: string;
  videoSource: VideoSource;
  videoUrl: string;
  syllabus: string;
};

const initialValues: EditorValues = {
  title: "打造你的第一個 AI 協作工作流",
  slug: "ai-collaboration-workflow",
  summary:
    "從真實工作情境出發，學會拆解任務、設計提示，並建立一套可以持續改善的 AI 協作流程。",
  description:
    "這門課會帶你從零開始找出適合交給 AI 協作的任務，透過清楚的示範與練習，完成一套能直接帶回日常工作的個人流程。",
  instructor: "DHub 教學團隊",
  category: "生成式 AI",
  level: "入門",
  durationMinutes: "90",
  coverUrl: "",
  videoSource: "youtube",
  videoUrl: "",
  syllabus: "找到適合 AI 協作的任務\n把模糊需求拆成清楚步驟\n建立、測試與改善你的工作流",
};

function parseHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}
function getVideoEmbedUrl(source: VideoSource, value: string) {
  const url = parseHttpUrl(value);
  if (!url) return null;

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (source === "youtube") {
    let videoId = "";
    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      videoId =
        url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ??
        "";
    }

    return /^[a-zA-Z0-9_-]{6,}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : null;
  }

  if (source === "vimeo") {
    if (hostname !== "vimeo.com" && hostname !== "player.vimeo.com") return null;
    const videoId = url.pathname
      .split("/")
      .filter(Boolean)
      .find((segment) => /^\d+$/.test(segment));
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }

  return url.pathname.toLowerCase().endsWith(".mp4") ? url.toString() : null;
}

function ErrorMessage({
  state,
  field,
}: {
  state: CourseActionState;
  field: CourseField;
}) {
  const message = state.errors[field];
  return message ? (
    <p className="dhub-admin-course__field-error" id={`${field}-error`}>
      <span aria-hidden="true">!</span>
      {message}
    </p>
  ) : null;
}

function SectionNumber({ children }: { children: React.ReactNode }) {
  return <span className="dhub-admin-course__section-number">{children}</span>;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 16h2V8.8l2.6 2.6L17 10l-5-5-5 5 1.4 1.4L11 8.8V16Zm-6 3h14v-2H5v2Z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3h12l2 2v16H5V3Zm2 2v14h10V6l-1-1H7Zm2 1h6v4H9V6Zm0 7h6v4H9v-4Z" />
    </svg>
  );
}

function PublishIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 4 7v6c0 4.4 3.4 7.7 8 8 4.6-.3 8-3.6 8-8V7l-8-4Zm-1 12.2-3-3L9.4 11l1.6 1.6 3.6-3.6 1.4 1.4-5 4.8Z" />
    </svg>
  );
}

export function CourseEditorForm() {
  const [values, setValues] = useState(initialValues);
  const [state, formAction, pending] = useActionState(
    saveCourseAction,
    initialCourseActionState,
  );
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "idle") feedbackRef.current?.focus();
  }, [state]);

  const updateField =
    (field: keyof EditorValues) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
    };

  const fieldState = (field: CourseField) => ({
    "aria-invalid": state.errors[field] ? (true as const) : undefined,
    "aria-describedby": state.errors[field]
      ? `${field}-hint ${field}-error`
      : `${field}-hint`,
  });

  const coverUrl = parseHttpUrl(values.coverUrl)?.toString() ?? null;
  const videoUrl = getVideoEmbedUrl(values.videoSource, values.videoUrl);
  const syllabusItems = values.syllabus
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const duration = Number(values.durationMinutes);
  const durationLabel =
    Number.isFinite(duration) && duration > 0
      ? duration >= 60
        ? `${Math.floor(duration / 60)} 小時${duration % 60 ? ` ${duration % 60} 分` : ""}`
        : `${duration} 分鐘`
      : "時數未定";

  return (
    <form className="dhub-admin-course__editor" action={formAction} noValidate>
      <div className="dhub-admin-course__editor-grid">
        <div className="dhub-admin-course__form-column">
          {state.status !== "idle" ? (
            <div
              className={`dhub-admin-course__form-feedback is-${state.status}`}
              ref={feedbackRef}
              role={state.status === "error" ? "alert" : "status"}
              aria-live={state.status === "error" ? "assertive" : "polite"}
              tabIndex={-1}
            >
              <span className="dhub-admin-course__feedback-icon" aria-hidden="true">
                {state.status === "success" ? "✓" : "!"}
              </span>
              <div>
                <strong>{state.message}</strong>
                {state.status === "success" ? (
                  <p>
                    「{state.validatedTitle}」已完成
                    {state.intent === "publish" ? "發佈" : "草稿"}欄位檢核
                    {state.submittedAt ? `，檢核時間 ${state.submittedAt}` : ""}。
                  </p>
                ) : (
                  <p>資料仍保留在畫面上，請依欄位提示修正後再送出。</p>
                )}
              </div>
            </div>
          ) : null}

          <section className="dhub-admin-course__form-card" aria-labelledby="basic-info-heading">
            <div className="dhub-admin-course__form-card-heading">
              <SectionNumber>01</SectionNumber>
              <div>
                <h2 id="basic-info-heading">課程基本資料</h2>
                <p>這些內容會出現在課程列表與課程介紹頁。</p>
              </div>
            </div>

            <div className="dhub-admin-course__fields">
              <div className="dhub-admin-course__field is-full">
                <div className="dhub-admin-course__label-row">
                  <label htmlFor="title">課程名稱</label>
                  <span>{values.title.length}/80</span>
                </div>
                <input
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={updateField("title")}
                  minLength={2}
                  maxLength={80}
                  required
                  {...fieldState("title")}
                />
                <p className="dhub-admin-course__field-hint" id="title-hint">
                  用學員能快速理解的結果或主題命名。
                </p>
                <ErrorMessage state={state} field="title" />
              </div>

              <div className="dhub-admin-course__field is-full">
                <label htmlFor="slug">網址代稱</label>
                <div className="dhub-admin-course__slug-input">
                  <span aria-hidden="true">dhub.tw/courses/</span>
                  <input
                    id="slug"
                    name="slug"
                    value={values.slug}
                    onChange={updateField("slug")}
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    required
                    {...fieldState("slug")}
                  />
                </div>
                <p className="dhub-admin-course__field-hint" id="slug-hint">
                  僅使用小寫英文、數字與連字號；正式串接時仍需檢查是否重複。
                </p>
                <ErrorMessage state={state} field="slug" />
              </div>

              <div className="dhub-admin-course__field is-full">
                <div className="dhub-admin-course__label-row">
                  <label htmlFor="summary">短摘要</label>
                  <span>{values.summary.length}/180</span>
                </div>
                <textarea
                  id="summary"
                  name="summary"
                  rows={3}
                  value={values.summary}
                  onChange={updateField("summary")}
                  minLength={20}
                  maxLength={180}
                  required
                  {...fieldState("summary")}
                />
                <p className="dhub-admin-course__field-hint" id="summary-hint">
                  建議說明學員會學到什麼，以及適合誰參加。
                </p>
                <ErrorMessage state={state} field="summary" />
              </div>

              <div className="dhub-admin-course__field is-full">
                <div className="dhub-admin-course__label-row">
                  <label htmlFor="description">完整介紹</label>
                  <span>{values.description.length}/2,000</span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={values.description}
                  onChange={updateField("description")}
                  minLength={40}
                  maxLength={2000}
                  required
                  {...fieldState("description")}
                />
                <p className="dhub-admin-course__field-hint" id="description-hint">
                  Demo 使用純文字；正式版可由結構化內容或 MDX 渲染。
                </p>
                <ErrorMessage state={state} field="description" />
              </div>

              <div className="dhub-admin-course__field">
                <label htmlFor="instructor">講師名稱</label>
                <input
                  id="instructor"
                  name="instructor"
                  value={values.instructor}
                  onChange={updateField("instructor")}
                  maxLength={60}
                  required
                  {...fieldState("instructor")}
                />
                <p className="dhub-admin-course__field-hint" id="instructor-hint">
                  正式版會改為選擇已建立的講師資料。
                </p>
                <ErrorMessage state={state} field="instructor" />
              </div>

              <div className="dhub-admin-course__field">
                <label htmlFor="category">課程分類</label>
                <select
                  id="category"
                  name="category"
                  value={values.category}
                  onChange={updateField("category")}
                  required
                  {...fieldState("category")}
                >
                  <option value="">請選擇分類</option>
                  {courseCategories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <p className="dhub-admin-course__field-hint" id="category-hint">
                  前台可用分類做篩選與推薦。
                </p>
                <ErrorMessage state={state} field="category" />
              </div>

              <div className="dhub-admin-course__field">
                <label htmlFor="level">適合程度</label>
                <select
                  id="level"
                  name="level"
                  value={values.level}
                  onChange={updateField("level")}
                  required
                  {...fieldState("level")}
                >
                  <option value="">請選擇程度</option>
                  {courseLevels.map((level) => (
                    <option value={level} key={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <p className="dhub-admin-course__field-hint" id="level-hint">
                  幫助學員判斷是否符合先備經驗。
                </p>
                <ErrorMessage state={state} field="level" />
              </div>

              <div className="dhub-admin-course__field">
                <label htmlFor="durationMinutes">預估總時數（分鐘）</label>
                <input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={6000}
                  step={1}
                  value={values.durationMinutes}
                  onChange={updateField("durationMinutes")}
                  required
                  {...fieldState("durationMinutes")}
                />
                <p className="dhub-admin-course__field-hint" id="durationMinutes-hint">
                  正式版可由單元影音長度自動加總。
                </p>
                <ErrorMessage state={state} field="durationMinutes" />
              </div>
            </div>
          </section>

          <section className="dhub-admin-course__form-card" aria-labelledby="media-heading">
            <div className="dhub-admin-course__form-card-heading">
              <SectionNumber>02</SectionNumber>
              <div>
                <h2 id="media-heading">影音與封面</h2>
                <p>Demo 先以網址上稿，正式版再接檔案上傳與媒體庫。</p>
              </div>
            </div>

            <div className="dhub-admin-course__fields">
              <div className="dhub-admin-course__field is-full">
                <label htmlFor="coverUrl">課程封面 URL</label>
                <div className="dhub-admin-course__input-with-icon">
                  <UploadIcon />
                  <input
                    id="coverUrl"
                    name="coverUrl"
                    type="url"
                    inputMode="url"
                    placeholder="https://example.com/course-cover.jpg"
                    value={values.coverUrl}
                    onChange={updateField("coverUrl")}
                    required
                    {...fieldState("coverUrl")}
                  />
                </div>
                <p className="dhub-admin-course__field-hint" id="coverUrl-hint">
                  建議 16:9、至少 1,200 × 675 px；正式版改存 Storage path。
                </p>
                <ErrorMessage state={state} field="coverUrl" />
              </div>

              <div className="dhub-admin-course__field">
                <label htmlFor="videoSource">影音來源</label>
                <select
                  id="videoSource"
                  name="videoSource"
                  value={values.videoSource}
                  onChange={updateField("videoSource")}
                  required
                  {...fieldState("videoSource")}
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="mp4">MP4 直連</option>
                </select>
                <p className="dhub-admin-course__field-hint" id="videoSource-hint">
                  目前支援三種常見來源。
                </p>
                <ErrorMessage state={state} field="videoSource" />
              </div>

              <div className="dhub-admin-course__field">
                <label htmlFor="videoUrl">教學影音 URL</label>
                <input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  inputMode="url"
                  placeholder={
                    values.videoSource === "youtube"
                      ? "https://youtu.be/..."
                      : values.videoSource === "vimeo"
                        ? "https://vimeo.com/..."
                        : "https://cdn.example.com/lesson.mp4"
                  }
                  value={values.videoUrl}
                  onChange={updateField("videoUrl")}
                  required
                  {...fieldState("videoUrl")}
                />
                <p className="dhub-admin-course__field-hint" id="videoUrl-hint">
                  請確認影片權限允許嵌入，並已取得必要授權。
                </p>
                <ErrorMessage state={state} field="videoUrl" />
              </div>
            </div>
          </section>

          <section className="dhub-admin-course__form-card" aria-labelledby="syllabus-heading">
            <div className="dhub-admin-course__form-card-heading">
              <SectionNumber>03</SectionNumber>
              <div>
                <h2 id="syllabus-heading">基本課綱</h2>
                <p>每行代表一個單元，預覽會依照輸入順序編號。</p>
              </div>
            </div>

            <div className="dhub-admin-course__field is-full">
              <label htmlFor="syllabus">課綱單元</label>
              <textarea
                id="syllabus"
                name="syllabus"
                rows={7}
                value={values.syllabus}
                onChange={updateField("syllabus")}
                placeholder={"認識生成式 AI\n完成第一個提示\n建立自己的工作流"}
                required
                {...fieldState("syllabus")}
              />
              <p className="dhub-admin-course__field-hint" id="syllabus-hint">
                發佈至少需要 2 個單元；正式版會改成可排序的章節與單元編輯器。
              </p>
              <ErrorMessage state={state} field="syllabus" />
            </div>
          </section>

          {state.errors.intent ? (
            <p className="dhub-admin-course__field-error" id="intent-error">
              <span aria-hidden="true">!</span>
              {state.errors.intent}
            </p>
          ) : null}

          <div className="dhub-admin-course__form-actions">
            <div>
              <strong>送出前請注意</strong>
              <p>Demo 只驗證欄位，不會建立草稿，也不會讓課程出現在前台。</p>
            </div>
            <div className="dhub-admin-course__action-buttons">
              <button
                className="dhub-admin-course__button is-secondary"
                type="submit"
                name="intent"
                value="draft"
                formNoValidate
                disabled={pending}
              >
                <SaveIcon />
                {pending ? "驗證中…" : "驗證草稿"}
              </button>
              <button
                className="dhub-admin-course__button is-primary"
                type="submit"
                name="intent"
                value="publish"
                disabled={pending}
              >
                <PublishIcon />
                {pending ? "驗證中…" : "驗證發佈"}
              </button>
            </div>
          </div>
        </div>

        <aside className="dhub-admin-course__preview-column" aria-labelledby="preview-heading">
          <div className="dhub-admin-course__preview-sticky">
            <div className="dhub-admin-course__preview-heading">
              <div>
                <span className="dhub-admin-course__live-dot" aria-hidden="true" />
                <h2 id="preview-heading">即時預覽</h2>
              </div>
              <span>學員視角摘要</span>
            </div>

            <article className="dhub-admin-course__preview-card">
              <div
                className={`dhub-admin-course__preview-cover${coverUrl ? " has-image" : ""}`}
                style={
                  coverUrl
                    ? ({ backgroundImage: `url("${coverUrl}")` } as CSSProperties)
                    : undefined
                }
                role="img"
                aria-label={
                  coverUrl
                    ? `「${values.title || "未命名課程"}」封面預覽`
                    : "尚未提供課程封面"
                }
              >
                {!coverUrl ? (
                  <div>
                    <span>DHub</span>
                    <strong>COURSE</strong>
                    <small>16 : 9 COVER PREVIEW</small>
                  </div>
                ) : null}
                <span className="dhub-admin-course__preview-status">未發佈預覽</span>
              </div>

              <div className="dhub-admin-course__preview-content">
                <div className="dhub-admin-course__preview-chips">
                  <span>{values.category || "未分類"}</span>
                  <span>{values.level || "程度未定"}</span>
                  <span>{durationLabel}</span>
                </div>
                <h3>{values.title || "請輸入課程名稱"}</h3>
                <p className="dhub-admin-course__preview-summary">
                  {values.summary || "輸入短摘要後，學員會在這裡快速了解課程重點。"}
                </p>
                <div className="dhub-admin-course__preview-instructor">
                  <span aria-hidden="true">
                    {(values.instructor || "講").slice(0, 1)}
                  </span>
                  <div>
                    <small>授課講師</small>
                    <strong>{values.instructor || "尚未設定"}</strong>
                  </div>
                </div>
              </div>
            </article>

            <section className="dhub-admin-course__video-preview" aria-labelledby="video-preview-heading">
              <div className="dhub-admin-course__preview-section-heading">
                <h3 id="video-preview-heading">影音預覽</h3>
                <span>{values.videoSource.toUpperCase()}</span>
              </div>
              <div className="dhub-admin-course__video-frame">
                {videoUrl && values.videoSource !== "mp4" ? (
                  <iframe
                    src={videoUrl}
                    title={`${values.title || "課程"}影音預覽`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : videoUrl && values.videoSource === "mp4" ? (
                  <video key={videoUrl} controls preload="metadata">
                    <source src={videoUrl} type="video/mp4" />
                    您的瀏覽器不支援 HTML5 影片播放。
                  </video>
                ) : (
                  <div className="dhub-admin-course__video-placeholder">
                    <span aria-hidden="true">▶</span>
                    <strong>等待影音網址</strong>
                    <p>輸入有效的 {values.videoSource.toUpperCase()} 網址即可預覽。</p>
                  </div>
                )}
              </div>
            </section>

            <section className="dhub-admin-course__syllabus-preview" aria-labelledby="syllabus-preview-heading">
              <div className="dhub-admin-course__preview-section-heading">
                <h3 id="syllabus-preview-heading">課程內容</h3>
                <span>{syllabusItems.length} 單元</span>
              </div>
              {syllabusItems.length ? (
                <ol>
                  {syllabusItems.map((item, index) => (
                    <li key={`${item}-${index}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="dhub-admin-course__empty-preview">尚未建立課綱單元。</p>
              )}
            </section>
          </div>
        </aside>
      </div>
    </form>
  );
}
