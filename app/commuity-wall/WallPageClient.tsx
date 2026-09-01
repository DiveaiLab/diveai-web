"use client";

import { useState } from "react";
import WallHeader from "./components/WallHeader";
import WallFooter from "./components/WallFooter";
import HeroSection from "./components/HeroSection";
import TagSidebar from "./components/TagSidebar";
import WallCarouselSection from "./components/WallCarouselSection";
import TeamStatusSection from "./components/TeamStatusSection";
import { useWallState } from "@/app/lib/wall/wall-state-context";
import {
  getPublishedPostsByKind,
  getAllPublishedTags,
  type WallPostKind,
} from "@/app/lib/wall/mock-posts";

// 顯示順序：讀書會筆記排最前面，因為目前是團隊產出最豐富的內容類型；
// 專案與 Agent 相關內容會晚一點才累積起來。
// viewAllHref 指向獨立的分類總覽子頁面（app/commuity-wall/<kind>/page.tsx）。
const SECTIONS: { kind: WallPostKind; title: string; viewAllHref: string }[] = [
  { kind: "note", title: "讀書會筆記", viewAllHref: "/commuity-wall/note" },
  { kind: "project", title: "專案展示", viewAllHref: "/commuity-wall/project" },
  { kind: "agent", title: "Agent 介紹", viewAllHref: "/commuity-wall/agent" },
];

export default function WallPageClient() {
  const { posts, teams, isLoggedIn, username, login, logout, hasLiked, likePost } =
    useWallState();
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const allTags = getAllPublishedTags(posts);

  // 登入輸入框的草稿文字，跟 context 裡實際「已登入的帳號」分開管理，
  // 這樣輸入到一半、還沒按登入之前不會影響任何已登入狀態。
  const [usernameDraft, setUsernameDraft] = useState("");

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!usernameDraft.trim()) return;
    login(usernameDraft);
    setUsernameDraft("");
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      <WallHeader />

      <main className="pt-12 pb-16">
        <HeroSection publishedCount={publishedCount} teamCount={teams.length} />

        {/* 登入區塊：開發階段假登入，輸入帳號名稱即可「登入」，不驗證密碼，
            僅用來模擬「按讚需登入」的前台狀態，非投稿相關功能。只在列表頁
            畫一次，單篇頁共用同一個 isLoggedIn／username 判斷，不重複畫 UI */}
        <section className="max-w-7xl mx-auto px-4 mb-10">
          {isLoggedIn ? (
            <div className="inline-flex items-center gap-3 text-sm text-gray-600">
              <span>
                已登入：<span className="font-semibold text-gray-900">{username}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                登出
              </button>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="inline-flex items-center gap-2">
              <input
                type="text"
                value={usernameDraft}
                onChange={(e) => setUsernameDraft(e.target.value)}
                placeholder="輸入帳號名稱"
                className="bg-gray-100/80 border-0 rounded-xl px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!usernameDraft.trim()}
                className="bg-[#2563EB] hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
              >
                登入
              </button>
            </form>
          )}
        </section>

        {/* Two-column layout：左欄「技術標籤」（純靜態，桌機 sticky，手機堆疊
            在上方），右欄三個分類的 carousel（維持不變） */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
          <TagSidebar tags={allTags} />

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

        {/* 小組動態：從左欄移到三個分區下方，改成橫向並排的卡片列 */}
        <TeamStatusSection />
      </main>

      <WallFooter />
    </div>
  );
}
