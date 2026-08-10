"use client";

import WallHeader from "./components/WallHeader";
import WallFooter from "./components/WallFooter";
import HeroSection from "./components/HeroSection";
import WallCarouselSection from "./components/WallCarouselSection";
import TeamUpdatesSidebar from "./components/TeamUpdatesSidebar";
import { useWallState } from "./lib/wall-state-context";
import { getPublishedPostsByKind, type WallPostKind } from "./lib/mock-posts";
import { mockTeamGroups } from "./lib/mock-teams";

// 顯示順序：讀書會筆記排最前面，因為目前是團隊產出最豐富的內容類型；
// 專案與 Agent 相關內容會晚一點才累積起來。
// viewAllHref 指向獨立的分類總覽子頁面（app/commuity-wall/<kind>/page.tsx）。
const SECTIONS: { kind: WallPostKind; title: string; viewAllHref: string }[] = [
  { kind: "note", title: "讀書會筆記", viewAllHref: "/commuity-wall/note" },
  { kind: "project", title: "專案展示", viewAllHref: "/commuity-wall/project" },
  { kind: "agent", title: "Agent 介紹", viewAllHref: "/commuity-wall/agent" },
];

export default function WallPageClient() {
  const { posts, isLoggedIn, toggleLogin, hasLiked, likePost } = useWallState();
  const publishedCount = posts.filter((post) => post.status === "published").length;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      <WallHeader />

      <main className="pt-12 pb-16">
        <HeroSection publishedCount={publishedCount} teamCount={mockTeamGroups.length} />

        {/* 假登入開關：僅用來模擬「按讚需登入」的前台狀態，非投稿相關功能。
            只在列表頁畫一次，單篇頁共用同一個 isLoggedIn 判斷，不重複畫 UI */}
        <section className="max-w-5xl mx-auto px-4 mb-10">
          <label className="inline-flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={isLoggedIn}
              onChange={toggleLogin}
              className="h-4 w-4 accent-[#2563EB]"
            />
            模擬已登入
            <span className="text-gray-400">
              {isLoggedIn ? "（目前：已登入）" : "（目前：未登入）"}
            </span>
          </label>
        </section>

        {/* Two-column layout：左欄「小組動態」（桌機 sticky，手機堆疊在上方），
            右欄三個分類的 carousel */}
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
          <TeamUpdatesSidebar />

          <div className="min-w-0">
            {SECTIONS.map((section) => (
              <WallCarouselSection
                key={section.kind}
                title={section.title}
                viewAllHref={section.viewAllHref}
                posts={getPublishedPostsByKind(posts, section.kind)}
                hasLiked={hasLiked}
                onLike={likePost}
              />
            ))}
          </div>
        </div>
      </main>

      <WallFooter />
    </div>
  );
}
