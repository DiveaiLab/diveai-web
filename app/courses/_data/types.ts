export type CourseAccent = "aqua" | "peach" | "navy" | "mint";

export type CourseStatus = "published" | "coming-soon" | "draft";

export type VideoProvider = "youtube" | "vimeo" | "mp4" | "none";

export type Instructor = {
  name: string;
  role: string;
  initials: string;
  bio: string;
};

export type Lesson = {
  slug: string;
  title: string;
  duration: string;
  summary: string;
  isPreview: boolean;
  videoProvider: VideoProvider;
  videoId?: string;
  videoUrl?: string;
};

export type CourseSection = {
  id: string;
  index: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  code: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  lessonCount: number;
  releaseLabel: string;
  studentLabel: string;
  accessLabel: string;
  accent: CourseAccent;
  status: CourseStatus;
  featured: boolean;
  tags: string[];
  outcomes: string[];
  audience: string[];
  instructor: Instructor;
  sections: CourseSection[];
};

export type CourseSummary = Pick<
  Course,
  | "slug"
  | "code"
  | "eyebrow"
  | "title"
  | "shortTitle"
  | "summary"
  | "category"
  | "level"
  | "duration"
  | "lessonCount"
  | "releaseLabel"
  | "studentLabel"
  | "accessLabel"
  | "accent"
  | "status"
  | "featured"
  | "tags"
> & {
  instructorName: string;
  previewHref?: string;
};

export type FlatLesson = Lesson & {
  sectionId: string;
  sectionIndex: string;
  sectionTitle: string;
};
