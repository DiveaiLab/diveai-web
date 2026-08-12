export const courseCategories = [
  "AI 基礎",
  "生成式 AI",
  "自動化工作流",
  "設計與內容",
  "商業應用",
] as const;

export const courseLevels = ["入門", "進階", "不限程度"] as const;

export const videoSources = ["youtube", "vimeo", "mp4"] as const;

export type CourseIntent = "draft" | "publish";
export type CourseCategory = (typeof courseCategories)[number];
export type CourseLevel = (typeof courseLevels)[number];
export type VideoSource = (typeof videoSources)[number];

export type CourseField =
  | "intent"
  | "title"
  | "slug"
  | "summary"
  | "description"
  | "instructor"
  | "category"
  | "level"
  | "durationMinutes"
  | "coverUrl"
  | "videoSource"
  | "videoUrl"
  | "syllabus";

export type CourseActionState = {
  status: "idle" | "error" | "success";
  message: string;
  errors: Partial<Record<CourseField, string>>;
  intent?: CourseIntent;
  validatedTitle?: string;
  submittedAt?: string;
};

export const initialCourseActionState: CourseActionState = {
  status: "idle",
  message: "",
  errors: {},
};
