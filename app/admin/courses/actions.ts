"use server";

import type {
  CourseActionState,
  CourseField,
  CourseIntent,
  VideoSource,
} from "./types";
import { courseCategories, courseLevels, videoSources } from "./types";

type RawCourseForm = Record<CourseField, string>;

function getText(formData: FormData, field: CourseField) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function parseHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function validateVideoUrl(value: string, source: VideoSource) {
  const url = parseHttpUrl(value);

  if (!url) {
    return "請輸入完整的 http:// 或 https:// 影音網址。";
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (
    source === "youtube" &&
    hostname !== "youtube.com" &&
    hostname !== "m.youtube.com" &&
    hostname !== "youtu.be"
  ) {
    return "YouTube 來源請使用 youtube.com 或 youtu.be 網址。";
  }

  if (
    source === "vimeo" &&
    hostname !== "vimeo.com" &&
    hostname !== "player.vimeo.com"
  ) {
    return "Vimeo 來源請使用 vimeo.com 網址。";
  }

  if (source === "mp4" && !url.pathname.toLowerCase().endsWith(".mp4")) {
    return "MP4 來源目前僅接受網址路徑以 .mp4 結尾的檔案。";
  }

  return null;
}

function validateCourse(
  values: RawCourseForm,
  intent: CourseIntent,
): Partial<Record<CourseField, string>> {
  const errors: Partial<Record<CourseField, string>> = {};
  const publishing = intent === "publish";

  if (values.title.length < 2) {
    errors.title = "課程名稱至少需要 2 個字。";
  } else if (values.title.length > 80) {
    errors.title = "課程名稱請勿超過 80 個字。";
  }

  if (publishing && !values.slug) {
    errors.slug = "發佈前請設定網址代稱。";
  } else if (
    values.slug &&
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)
  ) {
    errors.slug = "僅能使用小寫英文字母、數字與單一連字號。";
  }

  if (publishing && values.summary.length < 20) {
    errors.summary = "發佈用摘要至少需要 20 個字。";
  } else if (values.summary.length > 180) {
    errors.summary = "課程摘要請勿超過 180 個字。";
  }

  if (publishing && values.description.length < 40) {
    errors.description = "發佈用課程介紹至少需要 40 個字。";
  } else if (values.description.length > 2000) {
    errors.description = "課程介紹請勿超過 2,000 個字。";
  }

  if (publishing && !values.instructor) {
    errors.instructor = "發佈前請填寫講師名稱。";
  } else if (values.instructor.length > 60) {
    errors.instructor = "講師名稱請勿超過 60 個字。";
  }

  if (
    values.category &&
    !courseCategories.includes(
      values.category as (typeof courseCategories)[number],
    )
  ) {
    errors.category = "請從清單中選擇課程分類。";
  } else if (publishing && !values.category) {
    errors.category = "發佈前請選擇課程分類。";
  }

  if (
    values.level &&
    !courseLevels.includes(values.level as (typeof courseLevels)[number])
  ) {
    errors.level = "請從清單中選擇適合程度。";
  } else if (publishing && !values.level) {
    errors.level = "發佈前請選擇適合程度。";
  }

  if (values.durationMinutes) {
    const duration = Number(values.durationMinutes);
    if (!Number.isInteger(duration) || duration < 1 || duration > 6000) {
      errors.durationMinutes = "總時數請輸入 1 至 6,000 的整數分鐘。";
    }
  } else if (publishing) {
    errors.durationMinutes = "發佈前請填寫預估總時數。";
  }

  if (values.coverUrl && !parseHttpUrl(values.coverUrl)) {
    errors.coverUrl = "封面請使用完整的 http:// 或 https:// 網址。";
  } else if (publishing && !values.coverUrl) {
    errors.coverUrl = "發佈前請提供課程封面網址。";
  }

  if (
    values.videoSource &&
    !videoSources.includes(values.videoSource as VideoSource)
  ) {
    errors.videoSource = "請選擇支援的影音來源。";
  } else if (publishing && !values.videoSource) {
    errors.videoSource = "發佈前請選擇影音來源。";
  }

  if (values.videoUrl && values.videoSource) {
    const videoError = validateVideoUrl(
      values.videoUrl,
      values.videoSource as VideoSource,
    );
    if (videoError) errors.videoUrl = videoError;
  } else if (publishing && !values.videoUrl) {
    errors.videoUrl = "發佈前請提供教學影音網址。";
  }

  const syllabusItems = values.syllabus
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  if (publishing && syllabusItems.length < 2) {
    errors.syllabus = "發佈前請至少建立 2 個課綱單元。";
  } else if (syllabusItems.some((item) => item.length > 120)) {
    errors.syllabus = "每個課綱單元請勿超過 120 個字。";
  } else if (syllabusItems.length > 30) {
    errors.syllabus = "Demo 最多接受 30 個課綱單元。";
  }

  return errors;
}

async function requireAdmin() {
  // TODO(auth): 正式版改用 Supabase Auth session，並在每次 Action 內重新確認 admin/editor role。
  // Demo 尚未接登入，因此只回傳清楚標記的本機示範身分，不可視為授權實作。
  return { userId: "demo-admin", role: "admin" as const };
}

export async function saveCourseAction(
  _previousState: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  await requireAdmin();

  const values = {
    intent: getText(formData, "intent"),
    title: getText(formData, "title"),
    slug: getText(formData, "slug"),
    summary: getText(formData, "summary"),
    description: getText(formData, "description"),
    instructor: getText(formData, "instructor"),
    category: getText(formData, "category"),
    level: getText(formData, "level"),
    durationMinutes: getText(formData, "durationMinutes"),
    coverUrl: getText(formData, "coverUrl"),
    videoSource: getText(formData, "videoSource"),
    videoUrl: getText(formData, "videoUrl"),
    syllabus: getText(formData, "syllabus"),
  } satisfies RawCourseForm;

  if (values.intent !== "draft" && values.intent !== "publish") {
    return {
      status: "error",
      message: "無法辨識這次操作，請重新選擇儲存草稿或發佈。",
      errors: { intent: "缺少有效的送出方式。" },
    };
  }

  const intent = values.intent as CourseIntent;
  const errors = validateCourse(values, intent);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: `尚有 ${Object.keys(errors).length} 個欄位需要調整。`,
      errors,
      intent,
    };
  }

  // TODO(repository): 將通過驗證的資料交給 server-only courseRepository，
  // 再由 repository 使用 Supabase transaction/RPC 寫入 courses、sections、lessons 與 audit log。
  // Demo 刻意不執行 insert / update，也不呼叫 revalidatePath，避免讓畫面誤導為已儲存。

  return {
    status: "success",
    message: "Demo 驗證通過但尚未永久儲存",
    errors: {},
    intent,
    validatedTitle: values.title,
    submittedAt: new Intl.DateTimeFormat("zh-TW", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Taipei",
    }).format(new Date()),
  };
}

