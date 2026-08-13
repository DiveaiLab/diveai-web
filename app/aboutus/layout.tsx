import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About us | DiveAI - 把 AI，用在對的地方",
  description: "我們發起於一門大學通識課，相信 AI 焦慮多半來自沒有判斷框架，建立「何時信、何時查、何時動手做」的判斷方式。",
};

export default function AboutUsLayout({
  children,
}: Readonly<{
  children: Readonly<React.ReactNode>;
}>) {
  return <>{children}</>;
}
