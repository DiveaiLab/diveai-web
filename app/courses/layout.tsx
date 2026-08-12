import type { Metadata } from "next";

import { CourseFooter } from "./_components/CourseFooter";
import { CourseHeader } from "./_components/CourseHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "線上課程｜DiveAI",
    template: "%s｜DiveAI 課程",
  },
  description:
    "從符合程度的島嶼啟航，完成真實任務、累積能力，逐步解鎖下一塊 AI 學習大陸。",
  openGraph: {
    title: "DiveAI 學習群島｜每學會一步，下一座島就會出現。",
    description:
      "依照自己的學習程度逐步完成 AI 課程、解鎖關卡與新的學習大陸。",
    type: "website",
    locale: "zh_TW",
    images: [
      {
        url: "/og.png",
        width: 1732,
        height: 908,
        alt: "DiveAI 學習群島線上課程",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DiveAI 學習群島｜每學會一步，下一座島就會出現。",
    description: "完成真實任務，逐步解鎖下一塊 AI 學習大陸。",
    images: ["/og.png"],
  },
};

export default function CoursesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="course-root">
      <CourseHeader />
      {children}
      <CourseFooter />
    </div>
  );
}
