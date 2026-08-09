import type { Metadata } from "next";
import "./globals.css";
import { WallStateProvider } from "./lib/wall-state-context";

export const metadata: Metadata = {
  title: "共學牆 | DiveAI - 把 AI，用在對的地方",
  description:
    "團隊策展的學習紀錄：每篇都附上「我原本的程度」與「花了多久」，記錄真實的卡關與解法。",
};

export default function CommunityWallLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WallStateProvider>{children}</WallStateProvider>;
}
